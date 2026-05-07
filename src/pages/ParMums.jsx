import { Link } from "react-router-dom";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";
import { RichArticleShell } from "../variants/rich/RichArticleShell.jsx";

export function ParMums() {
  const to = usePrefixedTo();
  const { isRich } = useVariant();

  const bodyRich = (
    <article className="text-page rich-static-page">
      <h1 className="page-title">Par mums</h1>
      <p className="lead">
        «Vienkārši mājām» ir mācību un demonstrācijas interneta veikals, kas
        piedāvā kvalitatīvas ikdienas un mājas preces.
      </p>
      <div className="rich-static-cards">
        <section className="rich-static-card">
          <h2 className="rich-static-card__h">Mūsu mērķis</h2>
          <p>
            Mūsu mērķis ir vienkārša, saprotama iepirkšanās pieredze — no kataloga
            līdz grozam un pasūtījuma apstiprinājumam. Preču sortiments aptver
            virtuvi un galdiņu, vannas un kopšanas sīkumus, uzglabāšanu, kā arī
            kanceleju un ikdienas somas.
          </p>
        </section>
        <section className="rich-static-card">
          <h2 className="rich-static-card__h">Demonstrācijas veikals</h2>
          <p>
            Šī vietne neapstrādā īstus maksājumus; pasūtījumi un izraksti ir
            simulēti, lai pētītu lietošanas ērtumu un saskarni.
          </p>
        </section>
        <section className="rich-static-card rich-static-card--links">
          <h2 className="rich-static-card__h">Noderīgas saites</h2>
          <p>
            <Link to={to("/kontakti")}>Kontakti</Link>
            {" · "}
            <Link to={to("/piegade")}>Piegāde</Link>
            {" · "}
            <Link to={to("/iepirkties")}>Kā iepirkties</Link>
          </p>
        </section>
      </div>
    </article>
  );

  const bodyA = (
    <article className="text-page text-page--a par-mums-page">
      <h1 className="page-title">Par mums</h1>
      <p className="lead a-lead">
        «Vienkārši mājām» ir mācību un demonstrācijas interneta veikals, kas
        piedāvā kvalitatīvas ikdienas un mājas preces.
      </p>
      <div className="par-mums-blocks">
        <section className="par-mums-block" aria-labelledby="par-mums-goal">
          <h2 id="par-mums-goal" className="par-mums-block__title">
            Mūsu mērķis
          </h2>
          <p>
            Vienkārša, saprotama iepirkšanās pieredze — no kataloga līdz grozam un
            pasūtījuma apstiprinājumam. Sortiments aptver virtuvi un galdiņu, vannu
            un kopšanu, uzglabāšanu, kanceleju un somas.
          </p>
        </section>
        <section className="par-mums-block" aria-labelledby="par-mums-demo">
          <h2 id="par-mums-demo" className="par-mums-block__title">
            Demonstrācijas veikals
          </h2>
          <p>
            Šī vietne neapstrādā īstus maksājumus; pasūtījumi un izraksti ir
            simulēti, lai demonstrētu plūsmu un saskarni, nevis veiktu īstu
            norēķinu.
          </p>
        </section>
        <section className="par-mums-block" aria-labelledby="par-mums-study">
          <h2 id="par-mums-study" className="par-mums-block__title">
            Pētījuma konteksts
          </h2>
          <p>
            Saturs un uzdevumi ir pielāgoti lietošanas pētījumam: jāatrod preces un
            informāciju, jāizmanto grozs un noformēšana, jāizlasa piegāde un BUJ.
            Ja nepieciešams, izmantojiet{" "}
            <Link to={to("/kontakti")}>Kontaktus</Link>,{" "}
            <Link to={to("/piegade")}>Piegādi</Link> un{" "}
            <Link to={to("/iepirkties")}>Kā iepirkties</Link>.
          </p>
        </section>
      </div>
    </article>
  );

  if (isRich) {
    return <RichArticleShell currentLabel="Par mums">{bodyRich}</RichArticleShell>;
  }

  return bodyA;
}
