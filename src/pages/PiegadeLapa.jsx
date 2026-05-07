import { Link } from "react-router-dom";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";
import { RichArticleShell } from "../variants/rich/RichArticleShell.jsx";

export function PiegadeLapa() {
  const to = usePrefixedTo();
  const { isRich } = useVariant();

  const bodyRich = (
    <article className="text-page rich-static-page">
      <h1 className="page-title">Piegāde un atgriešana</h1>
      <p className="lead">
        Standarta piegāde visā Latvijā un vienkārša atgriešana 14 dienu laikā.
      </p>
      <div className="rich-delivery-grid">
        <section className="rich-delivery-card rich-delivery-card--time">
          <h2 className="rich-delivery-card__h">Piegādes laiks</h2>
          <p>
            <strong>Standarta piegāde:</strong> 2–3 darba dienas. Dažiem izstrādājumiem
            (piemēram, ar īpašu iepakojumu) uz preces lapas var būt ilgāks termiņš, piemēram{" "}
            <strong>5–7 darba dienas</strong>.
          </p>
        </section>
        <section className="rich-delivery-card rich-delivery-card--cost">
          <h2 className="rich-delivery-card__h">Piegādes izmaksas</h2>
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
        </section>
        <section className="rich-delivery-card rich-delivery-card--return">
          <h2 className="rich-delivery-card__h">Atgriešana</h2>
          <p>
            Preces iespējams atgriezt 14 dienu laikā, ja tās nav bijušas lietotas
            un saglabāts oriģinālais iepakojums. Sīkumus meklējiet sadaļā{" "}
            <Link to={to("/informacija#buj")}>BUJ</Link> un{" "}
            <Link to={to("/noteikumi")}>Noteikumos</Link>.
          </p>
        </section>
        <section className="rich-delivery-card rich-delivery-card--pack">
          <h2 className="rich-delivery-card__h">Iepakojums</h2>
          <p>
            Sūtījumus ietinām pārstrādājamos kartona kastēs; plastikāts tiek
            samazināts līdz minimumam.
          </p>
          <p>
            <Link to={to("/kontakti")} className="btn btn--ghost">
              Rakstiet mums
            </Link>
          </p>
        </section>
      </div>
    </article>
  );

  const bodyA = (
    <article className="text-page text-page--a">
      <h1 className="page-title">Piegāde un atgriešana</h1>
      <p className="lead a-lead">
        Standarta piegāde visā Latvijā un vienkārša atgriešana 14 dienu laikā.
      </p>
      <div className="a-block-grid">
        <section className="a-block" aria-labelledby="a-pieg-laiks">
          <h2 id="a-pieg-laiks" className="a-block__title">
            Piegādes laiks
          </h2>
          <p>
            <strong>Standarta:</strong> 2–3 darba dienas. Dažām precēm uz produkta
            lapas var būt <strong>5–7 darba dienas</strong>.
          </p>
        </section>
        <section className="a-block" aria-labelledby="a-pieg-maksa">
          <h2 id="a-pieg-maksa" className="a-block__title">
            Izmaksas
          </h2>
          <p>
            Fiksēta maksa <strong>3,50 €</strong>, ja pasūtījums zem{" "}
            <strong>35,00 €</strong>.
          </p>
          <p>
            <strong>Bezmaksas piegāde</strong>, ja summa pārsniedz{" "}
            <strong>35,00 €</strong>.
          </p>
        </section>
        <section className="a-block" aria-labelledby="a-atgriesana">
          <h2 id="a-atgriesana" className="a-block__title">
            Atgriešana
          </h2>
          <p>
            14 dienu laikā, ja prece nav lietota un ir oriģinālais iepakojums. Vairāk{" "}
            <Link to={to("/informacija#buj")}>BUJ</Link> un{" "}
            <Link to={to("/noteikumi")}>noteikumos</Link>.
          </p>
        </section>
      </div>
      <div className="a-prose">
        <h2>Iepakojums</h2>
        <p>
          Sūtījumus ietinām pārstrādājamos kartona kastēs; plastikāts tiek samazināts
          līdz minimumam.
        </p>
        <p>
          <Link to={to("/kontakti")} className="btn btn--ghost">
            Rakstiet mums
          </Link>
        </p>
      </div>
    </article>
  );

  if (isRich) {
    return <RichArticleShell currentLabel="Piegāde">{bodyRich}</RichArticleShell>;
  }

  return bodyA;
}
