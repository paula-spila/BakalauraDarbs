import { useState } from "react";
import { Link } from "react-router-dom";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";
import { RichArticleShell } from "../variants/rich/RichArticleShell.jsx";

export function Kontakti() {
  const to = usePrefixedTo();
  const { isRich } = useVariant();
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  const body = (
    <div className="text-page text-page--split">
      <div>
        <h1 className="page-title">Kontakti</h1>
        <p className="lead">
          Jautājumi par piegādi, precēm vai pasūtījumu — mēs atbildam darba
          dienās 9:00–17:00.
        </p>
        <ul className="contact-list">
          <li>
            <strong>E-pasts</strong>
            <br />
            <a href="mailto:info@vienskarisimajam.lv">info@vienskarisimajam.lv</a>
          </li>
          <li>
            <strong>Tālrunis</strong>
            <br />
            <a href="tel:+37120000000">+371 2000 0000</a>
            <span className="muted"> (darba laikā)</span>
          </li>
          <li>
            <strong>Adrese korespondencei</strong>
            <br />
            SIA Vienkārši mājām, Brīvības iela 123, Rīga, LV-1010
            <br />
            <span className="muted">(izdomāta mācību adrese)</span>
          </li>
        </ul>
        <p className="muted" style={{ marginTop: "1.5rem" }}>
          <Link to={to("/informacija")}>Piegāde un BUJ</Link> un{" "}
          <Link to={to("/piegade")}>Piegādes noteikumi</Link>
        </p>
      </div>
      <div className="contact-card">
        <h2 className="section-title">Nosūtīt ziņu</h2>
        {sent ? (
          <p className="success-msg">
            Paldies! Ziņa ir saņemta (simulācija) — tā netiek izsūtīta pa īstam.
          </p>
        ) : (
          <form className="form-stack" onSubmit={handleSubmit} noValidate>
            <label htmlFor="c-name">Vārds</label>
            <input id="c-name" name="name" type="text" required />
            <label htmlFor="c-email">E-pasts</label>
            <input id="c-email" name="email" type="email" required />
            <label htmlFor="c-msg">Ziņa</label>
            <textarea
              id="c-msg"
              name="message"
              className="form-textarea"
              rows={5}
              required
            />
            <button type="submit" className="btn">
              Nosūtīt
            </button>
          </form>
        )}
      </div>
    </div>
  );

  if (isRich) {
    return (
      <RichArticleShell currentLabel="Kontakti">{body}</RichArticleShell>
    );
  }

  return body;
}
