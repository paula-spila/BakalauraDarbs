import { Link } from "react-router-dom";
import { usePrefixedTo } from "../context/VariantContext.jsx";

export function PiegadeLapa() {
  const to = usePrefixedTo();
  return (
    <article className="text-page">
      <h1 className="page-title">Piegāde un atgriešana</h1>
      <p className="lead">
        Standarta piegāde visā Latvijā un vienkārša atgriešana 14 dienu laikā.
      </p>
      <div className="prose">
        <h2 className="section-title">Piegādes laiks</h2>
        <p>
          <strong>Standarta piegāde:</strong> 2–3 darba dienas. Dažiem izstrādājumiem
          (piemēram, ar īpašu iepakojumu) uz preces lapas var būt ilgāks termiņš, piemēram{" "}
          <strong>5–7 darba dienas</strong>.
        </p>
        <h2 className="section-title">Piegādes izmaksas</h2>
        <ul>
          <li>
            Fiksēta piegādes maksa <strong>3,50 €</strong> pasūtījumiem zem{" "}
            <strong>35,00 €</strong>.
          </li>
          <li>
            <strong>Bezmaksas piegāde</strong>, ja pasūtījuma summa pārsniedz{" "}
            <strong>35,00 €</strong>.
          </li>
        </ul>
        <h2 className="section-title">Atgriešana</h2>
        <p>
          Preces iespējams atgriezt 14 dienu laikā, ja tās nav bijušas lietotas
          un saglabāts oriģinālais iepakojums. Sīkumus meklējiet sadaļā{" "}
          <Link to={to("/informacija#buj")}>BUJ</Link> un{" "}
          <Link to={to("/noteikumi")}>Noteikumos</Link>.
        </p>
        <h2 className="section-title">Iepakojums</h2>
        <p>
          Sūtījumus ietinām pārstrādājamos kartona kastēs; plastikāts tiek
          samazināts līdz minimumam.
        </p>
        <p>
          <Link to={to("/kontakti")} className="btn btn--ghost">
            Rakstiet mums
          </Link>
        </p>
      </div>
    </article>
  );
}
