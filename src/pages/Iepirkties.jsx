import { Link } from "react-router-dom";
import { usePrefixedTo } from "../context/VariantContext.jsx";

export function Iepirkties() {
  const to = usePrefixedTo();
  return (
    <article className="text-page">
      <h1 className="page-title">Kā iepirkties</h1>
      <p className="lead">
        Īss ceļvedis, kā pārlūkot katalogu, pievienot preces grozam un pabeigt
        pasūtījumu.
      </p>
      <ol className="steps-list">
        <li>
          <strong>1. Izvēlieties preces</strong>
          <p className="muted">
            Sadaļā <Link to={to("/veikals")}>Veikals</Link> lietojiet kategoriju cilnes un
            meklēšanu, lai atrastu preci.
          </p>
        </li>
        <li>
          <strong>2. Atveriet preces lapu</strong>
          <p className="muted">
            Pārbaudiet aprakstu, cenu, materiālu un piegādes termiņu. Norādiet
            daudzumu un nospiediet «Pievienot grozam».
          </p>
        </li>
        <li>
          <strong>3. Pārbaudiet grozu</strong>
          <p className="muted">
            Sadaļā <Link to={to("/grozs")}>Grozs</Link> varat mainīt daudzumus vai
            noņemt rindu.
          </p>
        </li>
        <li>
          <strong>4. Noformējiet pasūtījumu</strong>
          <p className="muted">
            Ievadiet piegādes datus, piekrītat noteikumiem un apstipriniet.
            Maksājums šeit ir simulēts.
          </p>
        </li>
      </ol>
      <div className="actions-row" style={{ marginTop: "2rem" }}>
        <Link to={to("/veikals")} className="btn">
          Uz veikalu
        </Link>
        <Link to={to("/informacija")} className="btn btn--ghost">
          BUJ
        </Link>
      </div>
    </article>
  );
}
