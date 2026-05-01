import { Link, Outlet, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { HeaderSearch } from "../../components/HeaderSearch.jsx";
import { usePrefixedTo } from "../../context/VariantContext.jsx";
import { PRODUCT_CATEGORIES } from "../../data/products.js";
import { formatEur } from "../../lib/formatEur.js";
import { VariantSegmentToggle } from "../../components/VariantSegmentToggle.jsx";
import { RichHelpChat } from "./RichHelpChat.jsx";

const navClass = ({ isActive }) =>
  isActive ? "site-nav__link site-nav__link--active" : "site-nav__link";

export function RichLayout() {
  const { itemCount, subtotal } = useCart();
  const to = usePrefixedTo();
  const { pathname } = useLocation();

  return (
    <div className="variant-rich">
      <div className="app-wrap">
        <a href="#content" className="skip-link">
          Pāriet pie satura
        </a>

        {/* (1) Promo bar */}
        <div
          className="top-bar top-bar--promo rich-header__promo"
          role="region"
          aria-label="Aktuāli un akcijas"
        >
          <div className="rich-header__container rich-header__promo-inner">
            <span className="top-bar__pill">−15% atlasītām precēm</span>
            <span className="top-bar__sep" aria-hidden="true">
              ·
            </span>
            <span>Bezmaksas piegāde virs 35 €</span>
            <span className="top-bar__sep" aria-hidden="true">
              ·
            </span>
            <span>2–3 darba dienas</span>
          </div>
        </div>

        <header className="site-header site-header--store rich-header">
          {/* (2) Logo · search · cart · A/B */}
          <div className="site-header__row1 rich-header__tier rich-header__tier--main">
            <div className="rich-header__container rich-header__main-grid">
              <div className="rich-header__brand">
                <NavLink to={to("/")} className="site-logo" end>
                  <span className="site-logo__mark" aria-hidden="true" />
                  <span className="site-logo__text">Vienkārši mājām</span>
                </NavLink>
              </div>
              <div className="rich-header__search-wrap">
                <HeaderSearch />
              </div>
              <div className="rich-header__tools">
                <Link to={to("/grozs")} className="rich-header-mini-cart">
                  Grozs: {itemCount} gab. · {formatEur(subtotal)}
                </Link>
                <VariantSegmentToggle placement="header" />
              </div>
            </div>
          </div>

          {/* (3) Navigation: categories, then quick links + site nav */}
          <div className="site-header__row2 rich-header__tier rich-header__tier--nav">
            <div className="rich-header__container rich-header__nav-stack">
              <div className="rich-header__nav-block rich-header__nav-block--chips">
                <p className="rich-header__eyebrow" id="rich-nav-cats-label">
                  Kategorijas
                </p>
                <nav
                  className="rich-cat-chips"
                  aria-labelledby="rich-nav-cats-label"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <Link
                      key={c.id}
                      className="rich-cat-chips__link"
                      to={`${to("/veikals")}?k=${encodeURIComponent(c.id)}`}
                    >
                      {c.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="rich-header__nav-block rich-header__nav-block--menus">
                <nav className="rich-header-links" aria-label="Ātrās saites">
                  <Link to={to("/")}>Jaunumi</Link>
                  <Link to={to("/veikals")}>Piedāvājumi</Link>
                  <Link to={to("/veikals")}>Jaunpreces</Link>
                  <Link to={to("/piegade")}>Piegāde</Link>
                  <Link to={to("/kontakti")}>Palīdzība</Link>
                </nav>
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
          </div>
        </header>

        <main className="site-main site-main--wide" id="content">
          <div key={pathname} className="rich-outlet-fade">
            <Outlet />
          </div>
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
        <RichHelpChat />
      </div>
    </div>
  );
}
