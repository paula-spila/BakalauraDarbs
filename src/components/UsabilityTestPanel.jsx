import { useMemo, useState } from "react";
import { useTestSession } from "../context/TestSessionContext.jsx";
import { getTaskSetNumberForPhase, getTasksForPhase } from "../data/usabilityTestTasks.js";

export function UsabilityTestPanel() {
  const {
    session,
    measuring,
    clickCount,
    isCompletingTask,
    beginCurrentTask,
    completeCurrentTask,
    skipCurrentTask,
  } = useTestSession();
  const [minimized, setMinimized] = useState(false);

  const phase = session?.currentPhase ?? 1;
  const tasks = useMemo(() => getTasksForPhase(phase), [phase]);
  const idx = Math.min(session?.currentTaskIndex ?? 0, 7);
  const task = tasks[idx];
  const taskSet = getTaskSetNumberForPhase(phase);
  const variantLabel = phase === 1 ? session?.phase1Variant : session?.phase2Variant;

  if (!session || !task) return null;

  const variantHuman = variantLabel === "B" ? "B (blīvs)" : "A (minimālais)";
  const canStart = !measuring && !isCompletingTask;
  const canFinish = measuring && !isCompletingTask;

  return (
    <aside
      className={`usability-panel${minimized ? " usability-panel--min" : ""}`}
      data-usability-panel="true"
      aria-label="Testēšanas uzdevumu panelis"
    >
      <div className="usability-panel__head">
        <span className="usability-panel__badge">Lietojamības tests</span>
        <button
          type="button"
          className="usability-panel__min-btn"
          onClick={() => setMinimized((m) => !m)}
          aria-expanded={!minimized}
        >
          {minimized ? "Rādīt" : "Minimizēt"}
        </button>
      </div>

      {!minimized ? (
        <>
          <dl className="usability-panel__meta">
            <div>
              <dt>Dalībnieka ID</dt>
              <dd>{session.participantId}</dd>
            </div>
            <div>
              <dt>Secība</dt>
              <dd>{session.testOrder}</dd>
            </div>
            <div>
              <dt>Fāze</dt>
              <dd>
                {phase}. daļa no 2 · {variantHuman}
              </dd>
            </div>
            <div>
              <dt>Uzdevumu komplekts</dt>
              <dd>{taskSet}</dd>
            </div>
          </dl>

          <p className="usability-panel__progress">
            Uzdevums {idx + 1} no {tasks.length} — klikšķi šajā uzdevumā: {measuring ? clickCount : "—"}
          </p>

          <div className="usability-panel__task">
            <h2 className="usability-panel__task-title">{task.title}</h2>
            <p className="usability-panel__task-text">{task.instruction}</p>
          </div>

          <div className="usability-panel__actions">
            <button
              type="button"
              className="btn usability-panel__btn"
              onClick={beginCurrentTask}
              disabled={!canStart}
            >
              Sākt uzdevumu
            </button>
            <button
              type="button"
              className="btn btn--ghost usability-panel__btn"
              onClick={completeCurrentTask}
              disabled={!canFinish}
            >
              Pabeigt uzdevumu
            </button>
            <button
              type="button"
              className="btn btn--ghost usability-panel__btn"
              onClick={skipCurrentTask}
              disabled={!canFinish}
            >
              Neizdevās / izlaist
            </button>
          </div>
        </>
      ) : (
        <p className="usability-panel__peek">
          {session.participantId} · {phase}/2 · #{idx + 1}
        </p>
      )}
    </aside>
  );
}
