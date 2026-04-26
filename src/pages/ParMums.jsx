import { Link } from "react-router-dom";
import { usePrefixedTo } from "../context/VariantContext.jsx";

export function ParMums() {
  const to = usePrefixedTo();
  return (
    <article className="text-page">
      <h1 className="page-title">Par mums</h1>
      <p className="lead">
        «Vienkārši mājām» ir mācību un demonstrācijas interneta veikals, kas
        piedāvā kvalitatīvas ikdienas un mājas preces.
      </p>
      <div className="prose">
        <p>
          Mūsu mērķis ir vienkārša, saprotama iepirkšanās pieredze — no kataloga
          līdz grozam un pasūtījuma apstiprinājumam. Preču sortiments aptver
          virtuvi un galdiņu, vannas un kopšanas sīkumus, uzglabāšanu, kā arī
          kanceleju un ikdienas somas.
        </p>
        <p>
          Šī vietne neapstrādā īstus maksājumus; pasūtījumi un izraksti ir
          simulēti, lai pētītu lietošanas ērtumu un saskarni.
        </p>
        <p>
          Saites:{" "}
          <Link to={to("/kontakti")}>Kontakti</Link>,{" "}
          <Link to={to("/piegade")}>Piegāde</Link>,{" "}
          <Link to={to("/iepirkties")}>Kā iepirkties</Link>.
        </p>
      </div>
    </article>
  );
}
