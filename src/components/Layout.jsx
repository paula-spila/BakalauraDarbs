import { Outlet, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { usePrefixedTo } from "../context/VariantContext.jsx";
import { HeaderSearch } from "./HeaderSearch.jsx";
import { CartHeaderIcon } from "./CartHeaderIcon.jsx";

const navClass = ({ isActive }) =>
  isActive ? "site-nav__link site-nav__link--active" : "site-nav__link";

const headerCartClass = ({ isActive }) =>
  `site-header__cart-link${isActive ? " site-header__cart-link--active" : ""}`;

export function Layout() {
  const { itemCount } = useCart();
  const to = usePrefixedTo();

  return (
    <div className="app-wrap app-wrap--a">
      <a href="#content" className="skip-link">
        Pāriet pie satura
      </a>
      <header className="site-header site-header--store">
        <div className="site-header__row1">
          <div className="site-header__inner site-header__inner--wide">
            <NavLink to={to("/")} className="site-logo" end>
              <span className="site-logo__mark" aria-hidden="true" />
              <span className="site-logo__text">Vienkārši mājām</span>
            </NavLink>
            <HeaderSearch />
            <div className="site-header__aside">
              <NavLink to={to("/grozs")} className={headerCartClass}>
                <CartHeaderIcon />
                <span className="site-header__cart-label">Grozs</span>
                {itemCount > 0 ? (
                  <span
                    className="cart-badge"
                    aria-label={`preces grozā: ${itemCount}`}
                  >
                    {itemCount}
                  </span>
                ) : null}
              </NavLink>
            </div>
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
              <NavLink to={to("/informacija")} className={navClass}>
                Informācija / BUJ
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main className="site-main site-main--wide" id="content">
        <Outlet />
      </main>
      <footer className="site-footer site-footer--store">
        <nav className="site-footer__nav-min" aria-label="Lapas kājā">
          <NavLink to={to("/veikals")}>Veikals</NavLink>
          <NavLink to={to("/piegade")}>Piegāde</NavLink>
          <NavLink to={to("/informacija")}>BUJ</NavLink>
          <NavLink to={to("/kontakti")}>Kontakti</NavLink>
          <NavLink to={to("/par-mums")}>Par mums</NavLink>
          <NavLink to={to("/noteikumi")}>Noteikumi</NavLink>
        </nav>
        <p className="site-footer__bottom">
          © {new Date().getFullYear()} Vienkārši mājām. Variants A (minimālais).
        </p>
      </footer>
    </div>
  );
}
