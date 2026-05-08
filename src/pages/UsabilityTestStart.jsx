import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTestSession } from "../context/TestSessionContext.jsx";

function homePathForVariant(v) {
  return v === "A" ? "/" : "/rich";
}

export function UsabilityTestStart() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    session,
    resetEntireTest,
    startNewSessionFromLanding,
    refreshFromStorage,
  } = useTestSession();
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      resetEntireTest();
      const sp = new URLSearchParams(searchParams);
      sp.delete("reset");
      const q = sp.toString();
      navigate(q ? `/test?${q}` : "/test", { replace: true });
    }
  }, [searchParams, navigate, resetEntireTest]);

  const activeIncomplete = Boolean(session && !session.sessionCompletedAt);

  function resumeTarget() {
    if (!session) return "/";
    if (session.phase1CompletedAt && !session.phase2StartedAt) {
      return "/test/continue";
    }
    return homePathForVariant(session.currentVariant);
  }

  function handleStart() {
    if (!consent) return;
    const { homePath } = startNewSessionFromLanding(searchParams);
    navigate(homePath);
  }

  function handleResume() {
    navigate(resumeTarget());
  }

  return (
    <div className="usability-legal-page">
      <div className="usability-legal-page__inner">
        <h1 className="page-title">Lietojamības testa sākums</h1>

        {activeIncomplete ? (
          <div className="usability-callout usability-callout--info">
            <p>
              <strong>Jums ir nepabeigts tests.</strong> Varat turpināt tur, kur apstājāties, vai sākt
              no jauna (dzēsīs sesijas datus šajā pārlūkā).
            </p>
            <div className="usability-legal-page__actions">
              <button type="button" className="btn" onClick={handleResume}>
                Turpināt testu
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  resetEntireTest();
                  navigate("/test", { replace: true });
                }}
              >
                Sākt no jauna
              </button>
            </div>
          </div>
        ) : null}

        <p>
          Šis tests ir daļa no bakalaura darba praktiskā pētījuma. Testa laikā būs jāizpilda vairāki
          uzdevumi divās demonstrācijas e-veikala versijās.
        </p>
        <p>
          <strong>Maksājumi netiek veikti.</strong> Visi pasūtījumi un maksājumi ir simulācija.
        </p>
        <p>
          Tiks mērīts uzdevumu izpildes laiks, klikšķu skaits un tas, vai uzdevums tika pabeigts.
        </p>
        <p>Dati tiek vākti anonīmi. Netiek prasīts vārds, uzvārds vai e-pasts.</p>

        <label className="usability-consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>Piekrītu piedalīties testā</span>
        </label>

        <div className="usability-legal-page__actions">
          <button type="button" className="btn" disabled={!consent} onClick={handleStart}>
            Sākt testu
          </button>
        </div>

        <p className="muted usability-hint">
          Debug:{" "}
          <Link to="/test?order=AB">AB secība</Link>
          {" · "}
          <Link to="/test?order=BA">BA secība</Link>
          {" · "}
          <Link to="/test?reset=true">Notīrīt sesiju</Link>
        </p>
      </div>
    </div>
  );
}
