import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePrefixedTo } from "../context/VariantContext.jsx";

export function Info() {
  const { hash } = useLocation();
  const to = usePrefixedTo();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <>
      <h1 className="page-title">Informācija</h1>
      <p className="lead">Piegāde, kontakti un biežāk uzdotie jautājumi.</p>
      <nav className="info-nav" aria-label="Sadaļas šajā lapā">
        <a href="#piegade">Piegāde</a>
        <a href="#kontakti">Kontakti</a>
        <a href="#buj">BUJ</a>
      </nav>

      <section className="info-section" id="piegade" aria-labelledby="h-piegade">
        <h2 id="h-piegade" className="section-title">
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
      </section>

      <section className="info-section" id="kontakti" aria-labelledby="h-kontakti">
        <h2 id="h-kontakti" className="section-title">
          Kontakti
        </h2>
        <p>
          E-pasts:{" "}
          <a href="mailto:info@vienskarisimajam.lv">info@vienskarisimajam.lv</a>
        </p>
        <p className="muted">Tālrunis (darba laikā): +371 2000 0000</p>
      </section>

      <section className="info-section" id="buj" aria-labelledby="h-buj">
        <h2 id="h-buj" className="section-title">
          BUJ
        </h2>
        <ul className="info-list">
          <li>
            <strong>Vai varu atgriezt preci?</strong> Jā, 14 dienu laikā, ja
            prece nav lietota un saglabāts oriģinālais iepakojums. Rakstiet uz
            mūsu e-pastu.
          </li>
          <li>
            <strong>Cik ilgi gaidu piegādi?</strong> Standarta piegāde — 2–3
            darba dienas; konkrēto preču lapās var būt citādi norādīts.
          </li>
          <li>
            <strong>Kāds ir iepakojums?</strong> Izmantojam pārstrādājamu kartonu
            un minimālu aizpildītāju.
          </li>
          <li>
            <strong>Vai ir iespējama pašsaņemšana?</strong> Šajā demonstrācijas
            veikalā nē — tikai piegāde.
          </li>
          <li>
            <strong>Vai maksājums ir drošs?</strong> Šī vietne ir
            mācību/simulācijas projekts — maksājumi netiek apstrādāti.
          </li>
        </ul>
        <p className="muted info-back">
          <Link to={to("/veikals")}>Atpakaļ uz veikalu</Link>
        </p>
      </section>
    </>
  );
}
