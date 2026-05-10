import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTestSession } from "../context/TestSessionContext.jsx";
import { submitBatchResultsNonBlocking } from "../lib/batchTestResults.js";
import { markSessionBatchUploadFinished, readRawSession } from "../lib/usabilityTestStorage.js";

export function UsabilityTestComplete() {
  const navigate = useNavigate();
  const [batchSheetStatus, setBatchSheetStatus] = useState("idle");
  const {
    session,
    buildGoogleFormUrl,
    downloadExportJson,
    downloadExportCsv,
    isTestResultsEndpointConfigured,
    isGoogleFormConfigured,
    refreshFromStorage,
  } = useTestSession();

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  useEffect(() => {
    const s = readRawSession();
    if (!s?.participantId) {
      navigate("/test", { replace: true });
      return;
    }
    if (!s.sessionCompletedAt) {
      navigate("/test", { replace: true });
    }
  }, [navigate]);

  const s = session ?? readRawSession();

  const runBatchUpload = useCallback((freshSession, options) => {
    const dispatchMarkKey = options?.dispatchMarkKey;
    setBatchSheetStatus("sending");
    submitBatchResultsNonBlocking(freshSession, {
      onSettled: (st) => {
        if (st === "sent") {
          markSessionBatchUploadFinished();
          refreshFromStorage();
          setBatchSheetStatus("sent");
        } else if (st === "no_endpoint") {
          setBatchSheetStatus("local_only");
        } else {
          if (dispatchMarkKey) {
            try {
              sessionStorage.removeItem(dispatchMarkKey);
            } catch {
            }
          }
          setBatchSheetStatus("failed");
        }
      },
    });
  }, [refreshFromStorage]);

  useEffect(() => {
    if (!s?.sessionCompletedAt) return;
    const fresh = readRawSession() ?? s;
    if (fresh.batchUploadFinishedAt) {
      setBatchSheetStatus("sent");
      return;
    }
    const dispatchKey = `${fresh.participantId}|${fresh.sessionCompletedAt}`;
    const dispatchMarkKey = `vienskarisimajam_batch_dispatched_${dispatchKey}`;
    try {
      if (sessionStorage.getItem(dispatchMarkKey)) return;
      sessionStorage.setItem(dispatchMarkKey, "1");
    } catch {
    }
    queueMicrotask(() => {
      runBatchUpload(fresh, { dispatchMarkKey });
    });
  }, [s?.sessionCompletedAt, s?.participantId, runBatchUpload, s]);

  useEffect(() => {
    const fresh = readRawSession();
    if (!fresh?.sessionCompletedAt) return undefined;
    if (!isGoogleFormConfigured) return undefined;
    const formUrl = buildGoogleFormUrl(fresh);
    if (!formUrl) return undefined;
    const t = window.setTimeout(() => {
      window.location.assign(formUrl);
    }, 800);
    return () => window.clearTimeout(t);
  }, [
    s?.sessionCompletedAt,
    s?.participantId,
    s?.testOrder,
    s?.phase1Variant,
    s?.phase2Variant,
    isGoogleFormConfigured,
    buildGoogleFormUrl,
  ]);

  if (!s?.sessionCompletedAt) {
    return null;
  }

  const formUrl = buildGoogleFormUrl(s);

  const handleRetryBatch = () => {
    const fresh = readRawSession();
    if (!fresh?.sessionCompletedAt || fresh.batchUploadFinishedAt) return;
    runBatchUpload(fresh);
  };

  return (
    <div className="usability-legal-page">
      <div className="usability-legal-page__inner">
        <h1 className="page-title">Paldies, praktiskā testa daļa ir pabeigta.</h1>
        <p>
          <strong>Dalībnieka ID:</strong> {s.participantId}
        </p>
        <p>
          Lūdzu, aizpildiet īsu Google Forms anketu par testa pieredzi.
        </p>

        <div className="usability-legal-page__actions" style={{ marginBottom: "1.25rem" }}>
          {isGoogleFormConfigured && formUrl ? (
            <a className="btn" href={formUrl} target="_blank" rel="noopener noreferrer">
              Atvērt anketu
            </a>
          ) : null}
        </div>

        <dl className="usability-panel__meta usability-complete__meta">
          <div>
            <dt>Secība</dt>
            <dd>{s.testOrder}</dd>
          </div>
          <div>
            <dt>1. fāzes variants</dt>
            <dd>{s.phase1Variant}</dd>
          </div>
          <div>
            <dt>2. fāzes variants</dt>
            <dd>{s.phase2Variant}</dd>
          </div>
        </dl>

        <div className="usability-callout usability-callout--info" style={{ marginBottom: "1rem" }}>
          <p>
            <strong>Rezultāti saglabāti lokāli</strong> (pārlūkā un rezerves kopijā).
          </p>
          {batchSheetStatus === "sending" ? (
            <p className="muted">Rezultātu nosūtīšana uz Google Sheets…</p>
          ) : null}
          {batchSheetStatus === "sent" ? (
            <p>Rezultāti nosūtīti uz Google Sheets (vienā batch pieprasījumā).</p>
          ) : null}
          {batchSheetStatus === "local_only" ? (
            <p className="muted">
              Rezultātu serveris nav konfigurēts — dati nav nosūtīti uz attālinātu endpoint. Lejupielādējiet JSON/CSV zemāk.
            </p>
          ) : null}
          {batchSheetStatus === "failed" && isTestResultsEndpointConfigured ? (
            <p>
              Rezultātu nosūtīšana neizdevās — lejupielādējiet JSON/CSV.{" "}
              <button type="button" className="btn btn--ghost" onClick={handleRetryBatch}>
                Mēģināt vēlreiz
              </button>
            </p>
          ) : null}
        </div>

        {!isGoogleFormConfigured ? (
          <div className="usability-callout usability-callout--warn">
            <p>
              Google Forms saite vēl nav iestatīta. Iestatiet{" "}
              <code>VITE_GOOGLE_FORM_BASE_URL</code> un entry ID vērtības <code>.env</code> failā.
            </p>
          </div>
        ) : null}

        <div className="usability-legal-page__actions usability-complete__export">
          <p className="muted">Rezerves kopija pētniecībai (JSON un CSV).</p>
          <button type="button" className="btn btn--ghost" onClick={downloadExportJson}>
            Lejupielādēt rezultātus JSON
          </button>
          <button type="button" className="btn btn--ghost" onClick={downloadExportCsv}>
            Lejupielādēt rezultātus CSV
          </button>
        </div>

        <p className="muted">
          <Link to="/test?reset=true">Notīrīt sesiju un sākt no jauna</Link>
        </p>
      </div>
    </div>
  );
}
