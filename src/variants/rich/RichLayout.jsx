import { Link, Outlet, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { HeaderSearch } from "../../components/HeaderSearch.jsx";
import { VariantSegmentToggle } from "../../components/VariantSegmentToggle.jsx";
import { usePrefixedTo } from "../../context/VariantContext.jsx";

const navClass = ({ isActive }) =>
  isActive ? "site-nav__link site-nav__link--active" : "site-nav__link";

export function RichLayout() {
  const { itemCount } = useCart();
  const to = usePrefixedTo();

  return (
    <div className="variant-rich">
      <div className="app-wrap">
        <a href="#content" className="skip-link">
          Pāriet pie satura
        </a>
        <div className="top-bar" role="region" aria-label="Aktuāli">
          <div className="top-bar__inner">
            <span>Bezmaksas piegāde pasūtījumiem virs 35,00 €</span>
            <span className="top-bar__sep" aria-hidden="true">
              ·
            </span>
            <span>Piegāde 2–3 darba dienas</span>
          </div>
        </div>
        <header className="site-header site-header--store">
          <div className="site-header__row1">
            <div className="site-header__inner site-header__inner--wide">
              <NavLink to={to("/")} className="site-logo" end>
                <span className="site-logo__mark" aria-hidden="true" />
                <span className="site-logo__text">Vienkārši mājām</span>
              </NavLink>
              <HeaderSearch />
              <VariantSegmentToggle className="header-variant-toggle" />
            </div>
          </div>
          <div className="site-header__row2">
            <div className="site-header__inner site-header__inner--wide">
              <nav className="site-nav" aria-label="Galvenā navigācija">
                <NavLink to={to("/veikals")} className={navClass}>
                  Veikals
                </NavLink>
                <NavLink to={to("/par-mums")} className={navClass}>
                  Par mums
                </NavLink>
                <NavLink to={to("/piegade")} className={navClass}>
                  Piegāde
                </NavLink>
                <NavLink to={to("/grozs")} className={navClass}>
                  <span className="site-nav__cart">
                    Grozs
                    {itemCount > 0 ? (
                      <span
                        className="cart-badge"
                        aria-label={`preces grozā: ${itemCount}`}
                      >
                        {itemCount}
                      </span>
                    ) : null}
                  </span>
                </NavLink>
                <NavLink to={to("/informacija")} className={navClass}>
                  Informācija / BUJ
                </NavLink>
              </nav>
            </div>
          </div>
        </header>
        <main className="site-main site-main--wide" id="content">
          <div className="flash-row" role="presentation">
            <span className="flash-row__chip">JAUNUMI</span>
            <span>40+ preces — virtuve, vanna, māja, kanceleja</span>
            <span className="flash-row__chip">ĀTRA PIEGĀDE</span>
            <span>2–3 darba dienas</span>
            <span className="flash-row__chip">DĀVANĀM</span>
            <span>Somas un sveces</span>
          </div>
          <div className="cta-banner">
            <div className="cta-banner__grid">
              <div>
                <p className="cta-banner__title">
                  Pētījuma variants B — blīvāks, krāsaināks izkārtojums
                </p>
                <p className="cta-banner__sub">
                  Tās pašas preces un uzdevumi kā minimālajā versijā; mainīts tikai
                  vizuālais dizains.
                </p>
              </div>
              <div className="cta-banner__actions">
                <Link to={to("/veikals")} className="btn btn--small">
                  Uz veikalu
                </Link>
                <Link to={to("/grozs")} className="btn btn--ghost btn--small">
                  Grozs
                </Link>
                <Link to={to("/kontakti")} className="btn btn--ghost btn--small">
                  Palīdzība
                </Link>
              </div>
            </div>
          </div>
          <Outlet />
        </main>
        <footer className="site-footer site-footer--store">
          <div className="site-footer__grid">
            <div>
              <h2 className="site-footer__heading">Veikals</h2>
              <ul className="site-footer__list">
                <li>
                  <NavLink to={to("/veikals")}>Visas preces</NavLink>
                </li>
                <li>
                  <NavLink to={to("/iepirkties")}>Kā iepirkties</NavLink>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="site-footer__heading">Piegāde un atbalsts</h2>
              <ul className="site-footer__list">
                <li>
                  <NavLink to={to("/piegade")}>Piegāde</NavLink>
                </li>
                <li>
                  <NavLink to={to("/informacija")}>BUJ</NavLink>
                </li>
                <li>
                  <NavLink to={to("/kontakti")}>Kontakti</NavLink>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="site-footer__heading">Par uzņēmumu</h2>
              <ul className="site-footer__list">
                <li>
                  <NavLink to={to("/par-mums")}>Par mums</NavLink>
                </li>
                <li>
                  <NavLink to={to("/noteikumi")}>Noteikumi</NavLink>
                </li>
                <li>
                  <NavLink to={to("/privatums")}>Privātuma politika</NavLink>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="site-footer__heading">Saziņa</h2>
              <p className="site-footer__contact">
                <a href="mailto:info@vienskarisimajam.lv">info@vienskarisimajam.lv</a>
              </p>
              <p className="site-footer__contact">
                <a href="tel:+37120000000">+371 2000 0000</a>
              </p>
            </div>
          </div>
          <p className="site-footer__bottom">
            © {new Date().getFullYear()} Vienkārši mājām — ikdienas un mājas preces.{" "}
            Mācību / demonstrācijas projekts. Cenas eiro (€), PVN ieskaitot.{" "}
            <strong>Variants B (ne minimālais).</strong>
          </p>
        </footer>
      </div>
    </div>
  );
}
