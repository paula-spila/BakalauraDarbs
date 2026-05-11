import { Link, NavLink } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "../../data/products.js";

export function RichHeaderTieredNav({ to, navClass }) {
  return (
    <div className="rich-header__nav-block rich-header__nav-block--main-nav">
      <nav className="site-nav site-nav--rich-flyouts" aria-label="Galvenā navigācija">
        <div className="rich-flyout rich-flyout--main">
          <NavLink to={to("/veikals")} className={navClass}>
            Veikals
          </NavLink>
          <div className="rich-flyout__panel rich-flyout__panel--wide" role="region" aria-label="Veikala kategorijas">
            <p className="rich-flyout__hint">
              Izvēlieties kategoriju — filtri un meklēšana atvērtā veikala skatā.
            </p>
            <ul className="rich-flyout__grid">
              <li>
                <Link to={to("/veikals")}>Visas preces</Link>
              </li>
              {PRODUCT_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link to={`${to("/veikals")}?k=${encodeURIComponent(c.id)}`}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rich-flyout rich-flyout--main">
          <NavLink to={to("/par-mums")} className={navClass}>
            Par mums
          </NavLink>
          <div className="rich-flyout__panel" role="region" aria-label="Par veikalu">
            <p className="rich-flyout__hint">
              Demonstrācijas interneta veikals ikdienas un mājas precēm — bez īstiem maksājumiem.
            </p>
            <ul className="rich-flyout__list">
              <li>
                <Link to={to("/par-mums")}>Lasīt «Par mums»</Link>
              </li>
              <li>
                <Link to={to("/kontakti")}>Saziņa</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="rich-flyout rich-flyout--main">
          <NavLink to={to("/piegade")} className={navClass}>
            Piegāde
          </NavLink>
          <div className="rich-flyout__panel" role="region" aria-label="Piegāde īsumā">
            <p className="rich-flyout__hint">
              Standarta <strong>2–3 d.d.</strong>; fiksētā maksa vai{" "}
              <strong>bezmaksas</strong> virs 35 € (demonstrācija).
            </p>
            <ul className="rich-flyout__list">
              <li>
                <Link to={to("/piegade")}>Piegāde un atgriešana</Link>
              </li>
              <li>
                <Link to={to("/informacija#piegade")}>BUJ: piegāde</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="rich-flyout rich-flyout--main">
          <NavLink to={to("/informacija")} className={navClass}>
            Informācija / BUJ
          </NavLink>
          <div className="rich-flyout__panel rich-flyout__panel--wide" role="region" aria-label="Informācijas sadaļas">
            <p className="rich-flyout__hint">
              Piegāde, kontakti un biežāk uzdotie jautājumi — vienuviet.
            </p>
            <ul className="rich-flyout__grid rich-flyout__grid--duo">
              <li>
                <Link to={to("/informacija#piegade")}>Piegāde</Link>
              </li>
              <li>
                <Link to={to("/informacija#kontakti")}>Kontakti (lapā)</Link>
              </li>
              <li>
                <Link to={to("/informacija#buj")}>BUJ</Link>
              </li>
              <li>
                <Link to={to("/informacija")}>Visa informācijas lapa</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="rich-flyout rich-flyout--main">
          <NavLink to={to("/grozs")} className={navClass}>
            Grozs
          </NavLink>
          <div className="rich-flyout__panel" role="region" aria-label="Grozs">
            <p className="rich-flyout__hint">
              Mainiet daudzumus, noņemiet rindas un turpiniet uz{" "}
              <strong>noformēšanu</strong> (demonstrācija).
            </p>
            <ul className="rich-flyout__list">
              <li>
                <Link to={to("/grozs")}>Atvērt grozu</Link>
              </li>
              <li>
                <Link to={to("/noformesana")}>Noformēt pasūtījumu</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
