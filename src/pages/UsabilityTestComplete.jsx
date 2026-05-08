import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTestSession } from "../context/TestSessionContext.jsx";
import { readRawSession } from "../lib/usabilityTestStorage.js";

export function UsabilityTestComplete() {
  const navigate = useNavigate();
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
  const formUrl = buildGoogleFormUrl();

  if (!s?.sessionCompletedAt) {
    return null;
  }

  return (
    <div className="usability-legal-page">
      <div className="usability-legal-page__inner">
        <h1 className="page-title">Paldies</h1>
        <p>Paldies, abas testēšanas daļas ir pabeigtas.</p>

        <dl className="usability-panel__meta usability-complete__meta">
          <div>
            <dt>Dalībnieka ID</dt>
            <dd>{s.participantId}</dd>
          </div>
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

        {!isGoogleFormConfigured() ? (
          <div className="usability-callout usability-callout--warn">
            <p>
              Google Forms saite vēl nav iestatīta. Iestatiet{" "}
              <code>VITE_GOOGLE_FORM_BASE_URL</code> un entry ID vērtības <code>.env</code> failā.
            </p>
          </div>
        ) : null}

        {formUrl ? (
          <p className="usability-legal-page__actions">
            <a className="btn" href={formUrl} target="_blank" rel="noopener noreferrer">
              Aizpildīt anketu
            </a>
          </p>
        ) : null}

        {!isTestResultsEndpointConfigured ? (
          <div className="usability-legal-page__actions usability-complete__export">
            <p className="muted">
              Rezultātu serveris nav konfigurēts — lejupielādējiet lokālos datus pētniecībai.
            </p>
            <button type="button" className="btn btn--ghost" onClick={downloadExportJson}>
              Lejupielādēt rezultātus JSON
            </button>
            <button type="button" className="btn btn--ghost" onClick={downloadExportCsv}>
              Lejupielādēt rezultātus CSV
            </button>
          </div>
        ) : null}

        <p className="muted">
          <Link to="/test?reset=true">Notīrīt sesiju un sākt no jauna</Link>
        </p>
      </div>
    </div>
  );
}
