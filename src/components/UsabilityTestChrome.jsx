import { useEffect, useMemo, useState } from "react";
import { getTasksForPhase } from "../data/usabilityTestTasks.js";
import { parseInstructionEmphasis } from "../lib/instructionEmphasis.js";
import { useTestSession } from "../context/TestSessionContext.jsx";

function formatElapsed(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function InstructionParagraph({ text, className }) {
  const parts = useMemo(() => parseInstructionEmphasis(text), [text]);
  return (
    <p className={className}>
      {parts.map((p, i) =>
        p.type === "em" ? (
          <strong key={i} className="usability-instruction-em">
            {p.value}
          </strong>
        ) : (
          <span key={i}>{p.value}</span>
        ),
      )}
    </p>
  );
}

function CheckoutTestDataPanel({ data }) {
  if (!data) return null;
  return (
    <div className="usability-testdata-block">
      <h3 className="usability-testdata-block__title">Testa dati</h3>
      <ul className="usability-testdata-block__list">
        <li>
          <span className="usability-testdata-block__k">Vārds, uzvārds:</span> {data.name}
        </li>
        <li>
          <span className="usability-testdata-block__k">E-pasts:</span> {data.email}
        </li>
        <li>
          <span className="usability-testdata-block__k">Iela un mājas numurs:</span> {data.street}
        </li>
        <li>
          <span className="usability-testdata-block__k">Pilsēta:</span> {data.city}
        </li>
        <li>
          <span className="usability-testdata-block__k">Pasta indekss:</span> {data.postalCode}
        </li>
        {data.phone ? (
          <li>
            <span className="usability-testdata-block__k">Telefons:</span> {data.phone}
          </li>
        ) : null}
      </ul>
      <p className="usability-testdata-block__note">
        Ja formā ir piezīmju lauks, to var atstāt tukšu. Maksājums netiek veikts.
      </p>
    </div>
  );
}

export function UsabilityTestChrome() {
  const {
    session,
    elapsedSeconds,
    clickCount,
    measuring,
    introOpen,
    outcomeOpen,
    outcomeMeta,
    instructionPeekOpen,
    answerError,
    answerDraft,
    setAnswerDraft,
    isGoogleFormConfigured,
    beginCurrentTask,
    acknowledgeOutcome,
    skipCurrentTask,
    openInstructionPeek,
    closeInstructionPeek,
    submitAnswerInput,
  } = useTestSession();

  const [localTick, setLocalTick] = useState(0);

  useEffect(() => {
    if (!measuring) return undefined;
    const id = window.setInterval(() => setLocalTick((x) => x + 1), 250);
    return () => window.clearInterval(id);
  }, [measuring]);

  const tasks = useMemo(
    () => getTasksForPhase(session ?? {}),
    [session?.currentPhase, session?.taskSetOrder, session],
  );
  const idx = Math.min(session?.currentTaskIndex ?? 0, tasks.length - 1);
  const task = tasks[idx];
  const total = tasks.length;

  if (!session || !task) return null;

  const elapsed = useMemo(
    () => (measuring ? elapsedSeconds() : 0),
    [measuring, elapsedSeconds, localTick],
  );
  const showBottom = measuring && !session.sessionCompletedAt;
  const isAnswer = task.successType === "answerInput";
  const isCheckout = task.successType === "checkoutFormFilled";

  const outcomeCopy = outcomeMeta?.sessionEnd
    ? {
      title: "Tests pabeigts",
      body: isGoogleFormConfigured
        ? "Paldies! Praktiskā testa daļa ir noslēgta. Pēc īsa brīža jūs tiksiet novirzīts uz Google Forms anketu (varat arī nospiest pogu zemāk)."
        : "Paldies! Praktiskā testa daļa ir noslēgta. Turpiniet ar rezultātu lapu un anketu.",
      primary: isGoogleFormConfigured ? "Turpināt uz anketu" : "Atvērt rezultātu lapu",
    }
    : outcomeMeta?.phase1End
      ? {
        title: "Pirmā daļa pabeigta",
        body: "Tagad turpināsies testa otrā daļa.",
        primary: "Turpināt",
      }
      : outcomeMeta?.skipped
        ? {
          title: "Uzdevums izlaists",
          body: "Uzdevums ir atzīmēts kā izlaists.",
          primary: "Sākt nākamo uzdevumu",
        }
        : {
          title: "Uzdevums izpildīts",
          body: "Uzdevums ir veiksmīgi pabeigts.",
          primary: "Sākt nākamo uzdevumu",
        };

  return (
    <>
      {introOpen ? (
        <div
          className="usability-overlay usability-overlay--blocking"
          role="dialog"
          aria-modal="true"
          aria-labelledby="usability-intro-title"
          data-usability-chrome="true"
        >
          <div className="usability-modal usability-modal--intro">
            <p className="usability-modal__eyebrow">Lietojamības efektivitātes tests</p>
            <p className="usability-modal__participant">
              Dalībnieka ID: {session.participantId}
            </p>
            <p className="usability-modal__progress">
              Uzdevums {idx + 1} no {total}
            </p>
            <h2 id="usability-intro-title" className="usability-modal__title usability-modal__title--primary">
              {task.title}
            </h2>
            <InstructionParagraph text={task.instruction} className="usability-modal__instruction" />
            {isCheckout && task.checkoutTestData ? (
              <CheckoutTestDataPanel data={task.checkoutTestData} />
            ) : null}
            <p className="usability-modal__hint">
              Laika mērīšana sāksies pēc pogas nospiešanas.
            </p>
            <button type="button" className="btn usability-modal__primary" onClick={beginCurrentTask}>
              Sākt uzdevumu
            </button>
          </div>
        </div>
      ) : null}

      {outcomeOpen ? (
        <div
          className="usability-overlay usability-overlay--blocking"
          role="dialog"
          aria-modal="true"
          aria-labelledby="usability-outcome-title"
          data-usability-chrome="true"
        >
          <div className="usability-modal usability-modal--intro">
            <h2 id="usability-outcome-title" className="usability-modal__title">
              {outcomeCopy.title}
            </h2>
            <p className="usability-modal__instruction">{outcomeCopy.body}</p>
            <button type="button" className="btn usability-modal__primary" onClick={acknowledgeOutcome}>
              {outcomeCopy.primary}
            </button>
          </div>
        </div>
      ) : null}

      {instructionPeekOpen ? (
        <div
          className="usability-overlay usability-overlay--soft"
          role="dialog"
          aria-modal="true"
          aria-labelledby="usability-peek-title"
          data-usability-chrome="true"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) closeInstructionPeek();
          }}
        >
          <div className="usability-modal usability-modal--peek">
            <h2 id="usability-peek-title" className="usability-modal__title">
              {task.title}
            </h2>
            <InstructionParagraph text={task.instruction} className="usability-modal__instruction" />
            {isCheckout && task.checkoutTestData ? (
              <CheckoutTestDataPanel data={task.checkoutTestData} />
            ) : null}
            <button type="button" className="btn btn--ghost" onClick={closeInstructionPeek}>
              Aizvērt
            </button>
          </div>
        </div>
      ) : null}

      {showBottom ? (
        <div className="usability-bottom-bar" data-usability-chrome="true" aria-label="Testa josla">
          <div className="usability-bottom-bar__inner">
            <div className="usability-bottom-bar__main">
              <p className="usability-bottom-bar__progress">
                Uzdevums {idx + 1}/{total} · {formatElapsed(elapsed)} · klikšķi: {clickCount}
              </p>
              <p className="usability-bottom-bar__title">
                <strong className="usability-bottom-bar__title-text">{task.title}</strong>
              </p>
              <InstructionParagraph text={task.instruction} className="usability-bottom-bar__hint" />
              {isCheckout && task.checkoutTestData ? (
                <div className="usability-bottom-bar__testdata" aria-label="Testa dati noformēšanai">
                  <p className="usability-bottom-bar__testdata-lead">
                    <strong>Testa dati:</strong> {task.checkoutTestData.name}, {task.checkoutTestData.email},{" "}
                    {task.checkoutTestData.street}, {task.checkoutTestData.city}, {task.checkoutTestData.postalCode}
                    {task.checkoutTestData.phone ? `, tālr. ${task.checkoutTestData.phone}` : ""}.
                  </p>
                </div>
              ) : null}
              {isAnswer ? (
                <div className="usability-bottom-bar__answer">
                  <input
                    type="text"
                    className="usability-bottom-bar__input"
                    placeholder="Ievadiet atrasto atbildi"
                    value={answerDraft}
                    onChange={(e) => setAnswerDraft(e.target.value)}
                    autoComplete="off"
                  />
                  <div className="usability-bottom-bar__answer-actions">
                    <button type="button" className="btn btn--small" onClick={submitAnswerInput}>
                      Apstiprināt atbildi
                    </button>
                  </div>
                </div>
              ) : null}
              {answerError ? <p className="usability-bottom-bar__error">{answerError}</p> : null}
            </div>
            <div className="usability-bottom-bar__actions">
              <button type="button" className="btn btn--ghost btn--small" onClick={openInstructionPeek}>
                {isCheckout ? "Parādīt uzdevumu un testa datus" : "Parādīt uzdevumu"}
              </button>
              <button type="button" className="btn btn--ghost btn--small" onClick={skipCurrentTask}>
                Izlaist
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
