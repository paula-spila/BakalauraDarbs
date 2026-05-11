import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { usePrefixedTo } from "../../context/VariantContext.jsx";

export function RichHelpChat() {
  const to = usePrefixedTo();
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="rich-chat">
      {open ? (
        <div
          id={panelId}
          className="rich-chat__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="rich-chat__head">
            <h2 id={titleId} className="rich-chat__title">
              Palīdzība
            </h2>
            <button
              type="button"
              className="rich-chat__close"
              onClick={() => setOpen(false)}
              aria-label="Aizvērt palīdzības logu"
            >
              ×
            </button>
          </div>
          <p className="rich-chat__greet">
            Sveiki! Vai nepieciešama palīdzība ar piegādi vai pasūtījumu?
          </p>
          <p className="rich-chat__note">
            Demonstrācija — izvēlnes ved uz vietnes lapām; čats nestrādā.
          </p>
          <ul className="rich-chat__links">
            <li>
              <Link to={to("/piegade")} onClick={() => setOpen(false)}>
                Piegādes noteikumi
              </Link>
            </li>
            <li>
              <Link to={to("/informacija")} onClick={() => setOpen(false)}>
                BUJ
              </Link>
            </li>
            <li>
              <Link to={to("/kontakti")} onClick={() => setOpen(false)}>
                Rakstiet mums
              </Link>
            </li>
            <li>
              <Link to={to("/grozs")} onClick={() => setOpen(false)}>
                Mans grozs
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
      <button
        type="button"
        className="rich-chat__fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
      >
        <span className="rich-chat__fab-icon" aria-hidden="true">
          ?
        </span>
        <span className="rich-chat__fab-text">{open ? "Aizvērt" : "Jautājumi?"}</span>
      </button>
    </div>
  );
}
