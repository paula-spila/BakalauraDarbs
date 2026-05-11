import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";
import { RichArticleShell } from "../variants/rich/RichArticleShell.jsx";

export function Info() {
  const { hash } = useLocation();
  const to = usePrefixedTo();
  const { isRich } = useVariant();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  const navLink = (h, label) => (
    <a
      href={h}
      className={`info-nav__link${hash === h ? " info-nav__link--active" : ""}`}
    >
      {label}
    </a>
  );

  const bodyRich = (
    <article className="text-page rich-static-page rich-info-rich">
      <h1 className="page-title">Informācija</h1>
      <p className="lead">Piegāde, kontakti un biežāk uzdotie jautājumi.</p>
      <nav className="info-nav info-nav--rich-pills" aria-label="Sadaļas šajā lapā">
        {navLink("#piegade", "Piegāde")}
        {navLink("#kontakti", "Kontakti")}
        {navLink("#buj", "BUJ")}
      </nav>

      <div className="rich-info-two-col">
        <section
          className="info-section rich-info-tile"
          id="piegade"
          aria-labelledby="h-piegade"
        >
          <h2 id="h-piegade" className="section-title rich-info-tile__h">
            Piegāde
          </h2>
          <p>
            <strong>Standarta piegāde:</strong> 2–3 darba dienas visā Latvijā. Par
            piegādes maksu: fiksēta maksa <strong>3,50 €</strong> vai{" "}
            <strong>bezmaksas piegāde</strong>, ja pasūtījuma summa pārsniedz{" "}
            <strong>35,00 €</strong>.
          </p>
          <p>
            Dažām precēm (piemēram, ziepju batoniņiem ar īpašu ietīšanu) uz produkta
            lapas var būt norādīts ilgāks termiņš —{" "}
            <strong>5–7 darba dienas</strong>.
          </p>
          <ul className="rich-info-tile__bullets">
            <li>
              <strong>Sūtīšana:</strong> visā Latvijā ar kurjeru vai pakomātu (demonstrācija).
            </li>
            <li>
              <strong>Sekošana:</strong> saņemsiet saiti uz pasūtījuma statusu e-pastā.
            </li>
            <li>
              <strong>Iepakojums:</strong> kartons un minimāls aizpildītājs, kur iespējams.
            </li>
          </ul>
        </section>

        <section
          className="info-section rich-info-tile"
          id="kontakti"
          aria-labelledby="h-kontakti"
        >
          <h2 id="h-kontakti" className="section-title rich-info-tile__h">
            Kontakti
          </h2>
          <p>
            E-pasts:{" "}
            <a href="mailto:info@vienskarisimajam.lv">info@vienskarisimajam.lv</a>
          </p>
          <p className="muted">Tālrunis (darba laikā): +371 2000 0000</p>
          <p>
            <Link to={to("/kontakti")}>Sazināties</Link>
            <span className="muted"> — pilnā kontaktu lapa un ziņas forma.</span>
          </p>
          <div className="rich-info-tile__meta">
            <p>
              <strong>Darba laiks:</strong> darba dienās 9:00–17:00 (demonstrācija).
            </p>
            <p className="muted">
              Atbildes uz e-pastu parasti vienas darba dienas laikā.
            </p>
          </div>
        </section>
      </div>

      <section className="info-section rich-info-buj-block" id="buj" aria-labelledby="h-buj">
        <h2 id="h-buj" className="section-title">
          BUJ
        </h2>
        <div className="rich-buj-accordion">
          <details className="rich-buj-item">
            <summary>Vai varu atgriezt preci?</summary>
            <p>
              Jā, 14 dienu laikā, ja prece nav lietota un saglabāts oriģinālais
              iepakojums. Rakstiet uz mūsu e-pastu.
            </p>
          </details>
          <details className="rich-buj-item">
            <summary>Cik ilgi gaidu piegādi?</summary>
            <p>
              Standarta piegāde — 2–3 darba dienas; konkrēto preču lapās var būt
              citādi norādīts.
            </p>
          </details>
          <details className="rich-buj-item">
            <summary>Kāds ir iepakojums?</summary>
            <p>Izmantojam pārstrādājamu kartonu un minimālu aizpildītāju.</p>
          </details>
          <details className="rich-buj-item">
            <summary>Vai ir iespējama pašsaņemšana?</summary>
            <p>Šajā demonstrācijas veikalā nē — tikai piegāde.</p>
          </details>
          <details className="rich-buj-item">
            <summary>Vai maksājums ir drošs?</summary>
            <p>
              Šī vietne ir mācību/simulācijas projekts — maksājumi netiek apstrādāti.
            </p>
          </details>
        </div>
        <p className="muted info-back">
          <Link to={to("/veikals")}>Atpakaļ uz veikalu</Link>
        </p>
      </section>
    </article>
  );

  const bodyA = (
    <article className="text-page text-page--a">
      <h1 className="page-title">Informācija</h1>
      <p className="lead a-lead">Piegāde, kontakti un biežāk uzdotie jautājumi.</p>
      <nav className="info-nav" aria-label="Sadaļas šajā lapā">
        {navLink("#piegade", "Piegāde")}
        {navLink("#kontakti", "Kontakti")}
        {navLink("#buj", "BUJ")}
      </nav>

      <section className="info-section info-section--a" id="piegade" aria-labelledby="ha-piegade">
        <h2 id="ha-piegade" className="section-title section-title--a-block">
          Piegāde
        </h2>
        <div className="a-block a-block--inline">
          <p>
            <strong>Standarta piegāde:</strong> 2–3 darba dienas visā Latvijā.{" "}
            Fiksēta maksa <strong>3,50 €</strong> vai{" "}
            <strong>bezmaksas piegāde</strong>, ja pasūtījums virs{" "}
            <strong>35,00 €</strong>.
          </p>
          <p>
            Dažām precēm uz produkta lapas var būt <strong>5–7 darba dienas</strong>.
          </p>
        </div>
      </section>

      <section className="info-section info-section--a" id="kontakti" aria-labelledby="ha-kontakti">
        <h2 id="ha-kontakti" className="section-title section-title--a-block">
          Kontakti
        </h2>
        <div className="a-block a-block--inline">
          <p>
            E-pasts:{" "}
            <a href="mailto:info@vienskarisimajam.lv">info@vienskarisimajam.lv</a>
          </p>
          <p className="muted">Tālrunis (darba laikā): +371 2000 0000</p>
          <p>
            <Link to={to("/kontakti")}>Sazināties</Link>
            <span className="muted"> - pilnā kontaktu lapa un ziņas forma.</span>
          </p>
        </div>
      </section>

      <section className="info-section info-section--a" id="buj" aria-labelledby="ha-buj">
        <h2 id="ha-buj" className="section-title section-title--a-block">
          BUJ
        </h2>
        <div className="faq-list">
          <details className="faq-item">
            <summary>Vai varu atgriezt preci?</summary>
            <p className="faq-item__body">
              Jā, 14 dienu laikā, ja prece nav lietota un saglabāts oriģinālais
              iepakojums. Rakstiet uz mūsu e-pastu.
            </p>
          </details>
          <details className="faq-item">
            <summary>Cik ilgi gaidu piegādi?</summary>
            <p className="faq-item__body">
              Standarta piegāde — 2–3 darba dienas; konkrēto preču lapās var būt
              citādi norādīts.
            </p>
          </details>
          <details className="faq-item">
            <summary>Kāds ir iepakojums?</summary>
            <p className="faq-item__body">
              Izmantojam pārstrādājamu kartonu un minimālu aizpildītāju.
            </p>
          </details>
          <details className="faq-item">
            <summary>Vai ir iespējama pašsaņemšana?</summary>
            <p className="faq-item__body">
              Šajā demonstrācijas veikalā nē — tikai piegāde.
            </p>
          </details>
          <details className="faq-item">
            <summary>Vai maksājums ir drošs?</summary>
            <p className="faq-item__body">
              Šī vietne ir mācību/simulācijas projekts — maksājumi netiek apstrādāti.
            </p>
          </details>
        </div>
        <p className="muted info-back">
          <Link to={to("/veikals")}>Atpakaļ uz veikalu</Link>
        </p>
      </section>
    </article>
  );

  if (isRich) {
    return (
      <RichArticleShell
        currentLabel="Informācija"
        aside={
          <nav className="rich-article-shell__aside-nav" aria-label="Sadaļas šajā lapā">
            <p className="rich-article-shell__aside-title">Sadaļas</p>
            <a href="#piegade">Piegāde</a>
            <a href="#kontakti">Kontakti</a>
            <a href="#buj">BUJ</a>
          </nav>
        }
      >
        {bodyRich}
      </RichArticleShell>
    );
  }

  return bodyA;
}
