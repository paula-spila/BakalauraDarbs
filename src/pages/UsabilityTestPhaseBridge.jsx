import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTestSession } from "../context/TestSessionContext.jsx";
import { readRawSession } from "../lib/usabilityTestStorage.js";

export function UsabilityTestPhaseBridge() {
  const navigate = useNavigate();
  const { applyPhaseTwoTransition, refreshFromStorage } = useTestSession();

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  useEffect(() => {
    const s = readRawSession();
    if (!s?.participantId) {
      navigate("/test", { replace: true });
      return;
    }
    if (s.sessionCompletedAt) {
      navigate("/test/complete", { replace: true });
      return;
    }
    if (!s.phase1CompletedAt) {
      navigate(s.phase1Variant === "A" ? "/" : "/rich", { replace: true });
      return;
    }
    if (s.phase2StartedAt) {
      navigate(s.phase2Variant === "A" ? "/" : "/rich", { replace: true });
    }
  }, [navigate]);

  function handleContinue() {
    const { path } = applyPhaseTwoTransition();
    navigate(path);
  }

  return (
    <div className="usability-legal-page">
      <div className="usability-legal-page__inner">
        <h1 className="page-title">Pirmā daļa pabeigta</h1>
        <p>
          Pirmā daļa ir pabeigta. Tagad turpināsiet ar otru vietnes versiju.
        </p>
        <button type="button" className="btn" onClick={handleContinue}>
          Turpināt uz otro daļu
        </button>
      </div>
    </div>
  );
}
