import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { HeaderSearch } from "../../components/HeaderSearch.jsx";
import { usePrefixedTo } from "../../context/VariantContext.jsx";
import { PRODUCT_CATEGORIES } from "../../data/products.js";
import { formatEur } from "../../lib/formatEur.js";
import { RichHelpChat } from "./RichHelpChat.jsx";
import { RichHeaderTieredNav } from "./RichHeaderTieredNav.jsx";

const navClass = ({ isActive }) =>
  isActive ? "site-nav__link site-nav__link--active" : "site-nav__link";

export function RichLayout() {
  const { itemCount, subtotal } = useCart();
  const to = usePrefixedTo();
  const { pathname } = useLocation();
  const [catDrawerOpen, setCatDrawerOpen] = useState(false);
  const headerStickySentinelRef = useRef(null);
  const [headerStickyPinned, setHeaderStickyPinned] = useState(false);

  const shopPath = to("/veikals");
  const onShop =
    pathname === shopPath || pathname === `${shopPath}/`;

  useEffect(() => {
    setCatDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!catDrawerOpen) return;
    function onKey(e) {
      if (e.key === "Escape") setCatDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [catDrawerOpen]);

  useEffect(() => {
    if (!catDrawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [catDrawerOpen]);

  useLayoutEffect(() => {
    const el = headerStickySentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    let io;

    const attach = () => {
      io?.disconnect();
      io = new IntersectionObserver(
        ([entry]) => {
          setHeaderStickyPinned(!entry.isIntersecting);
        },
        { threshold: 0, rootMargin: "0px" },
      );
      io.observe(el);
    };

    attach();
    return () => {
      io?.disconnect();
    };
  }, [pathname]);

  const drawer =
    onShop &&
    catDrawerOpen &&
    typeof document !== "undefined" &&
    createPortal(
      <div className="rich-cat-drawer-root">
        <div
          className="rich-cat-drawer__backdrop"
          role="presentation"
          onClick={() => setCatDrawerOpen(false)}
        />
        <div
          id="rich-cat-drawer-panel"
          className="rich-cat-drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rich-cat-drawer-title"
        >
          <div className="rich-cat-drawer__head">
            <h2 id="rich-cat-drawer-title" className="rich-cat-drawer__title">
              Preču kategorijas
            </h2>
            <button
              type="button"
              className="rich-cat-drawer__close"
              onClick={() => setCatDrawerOpen(false)}
              aria-label="Aizvērt"
            >
              ×
            </button>
          </div>
          <ul className="rich-cat-drawer__list">
            <li>
              <Link to={to("/veikals")} onClick={() => setCatDrawerOpen(false)}>
                Visas preces
              </Link>
            </li>
            {PRODUCT_CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  to={`${to("/veikals")}?k=${encodeURIComponent(c.id)}`}
                  onClick={() => setCatDrawerOpen(false)}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>,
      document.body,
    );

  return (
    <div className="variant-rich">
      <div className="rich-motion-field" aria-hidden="true">
        <span className="rich-motion-field__spark rich-motion-field__spark--1" />
        <span className="rich-motion-field__spark rich-motion-field__spark--2" />
        <span className="rich-motion-field__spark rich-motion-field__spark--3" />
        <span className="rich-motion-field__spark rich-motion-field__spark--4" />
        <span className="rich-motion-field__spark rich-motion-field__spark--5" />
        <span className="rich-motion-field__spark rich-motion-field__spark--6" />
      </div>
      <div className="app-wrap">
        {drawer}
        <a href="#content" className="skip-link">
          Pāriet pie satura
        </a>

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
            <span>2-3 darba dienas</span>
          </div>
        </div>

        <header className="site-header site-header--store rich-header">
          <div
            ref={headerStickySentinelRef}
            className="rich-header__sticky-sentinel"
            aria-hidden="true"
          />
          <div
            className={`rich-header__sticky${headerStickyPinned ? " rich-header__sticky--pinned" : ""}`}
          >
            <div className="site-header__row1 rich-header__tier rich-header__tier--main">
              <div className="rich-header__container rich-header__main-grid">
                <div className="rich-header__brand">
                  <NavLink to={to("/")} className="site-logo" end>
                    <span className="site-logo__mark" aria-hidden="true" />
                    <span className="site-logo__text-stack">
                      <span className="site-logo__line">Vienkārši mājām</span>
                      <span className="site-logo__sub">Mājas preces</span>
                    </span>
                  </NavLink>
                </div>
                <div className="rich-header__search-wrap">
                  <HeaderSearch />
                </div>
                <div className="rich-header__tools">
                  {onShop ? (
                    <button
                      type="button"
                      className="rich-cat-drawer__open"
                      onClick={() => setCatDrawerOpen(true)}
                      aria-expanded={catDrawerOpen}
                      aria-controls="rich-cat-drawer-panel"
                    >
                      Kategorijas
                    </button>
                  ) : null}
                  <Link to={to("/grozs")} className="rich-header-mini-cart">
                    Grozs: {itemCount} gab. · {formatEur(subtotal)}
                  </Link>
                </div>
              </div>
            </div>

            <div className="site-header__row2 rich-header__tier rich-header__tier--nav">
              <div className="rich-header__container rich-header__nav-stack">
                <RichHeaderTieredNav to={to} navClass={navClass} />
              </div>
            </div>
          </div>
        </header>

        <main className="site-main site-main--wide" id="content">
          {onShop ? (
            <div className="rich-header__nav-block rich-header__nav-block--chips rich-header__nav-block--chips--collapsible">
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
          ) : null}
          <div key={pathname} className="rich-outlet-fade">
            <Outlet />
          </div>
        </main>
        <div
          className="rich-prefooter"
          role="region"
          aria-label="Īsā informācija pirms kājenes"
        >
          <div className="rich-prefooter__inner">
            <span className="rich-prefooter__chip rich-prefooter__chip--pay">
              Droša apmaksa (simulācija)
            </span>
            <span className="rich-prefooter__chip rich-prefooter__chip--ship">
              Piegāde 2–3 darba dienas
            </span>
            <span className="rich-prefooter__chip rich-prefooter__chip--ret">
              14 dienu atgriešana
            </span>
            <Link to={to("/informacija#buj")} className="rich-prefooter__link">
              BUJ un noteikumi →
            </Link>
          </div>
        </div>
        <footer className="site-footer site-footer--store">
          <div className="rich-site-footer">
            <div className="rich-site-footer__trust">
              <div className="rich-site-footer__trust-item">
                <span className="rich-site-footer__trust-icon" aria-hidden="true">
                  ✓
                </span>
                <span>
                  <strong>Simulēta</strong> apmaksa - droša demonstrācija pārlūkā.
                </span>
              </div>
              <div className="rich-site-footer__trust-item">
                <span className="rich-site-footer__trust-icon" aria-hidden="true">
                  ◎
                </span>
                <span>
                  <strong>2–3 darba dienas</strong> standarta piegāde visā Latvijā.
                </span>
              </div>
              <div className="rich-site-footer__trust-item">
                <span className="rich-site-footer__trust-icon" aria-hidden="true">
                  ↩
                </span>
                <span>
                  <strong>14 dienas</strong> atgriešana (noteikumi sadaļā BUJ).
                </span>
              </div>
            </div>

            <p className="rich-site-footer__tagline">
              <strong>Supercentra pieredze (B variants):</strong> blīvs katalogs, sānjoslas,
              akciju joslas un ātrās saites.
            </p>

            <div className="rich-site-footer__cols">
              <div className="rich-site-footer__col">
                <h2 className="rich-site-footer__col-title">Iepirkšanās</h2>
                <ul>
                  <li>
                    <NavLink to={to("/veikals")}>Katalogs</NavLink>
                  </li>
                  <li>
                    <NavLink to={to("/iepirkties")}>Ceļvedis: kā iepirkties</NavLink>
                  </li>
                  <li>
                    <NavLink to={to("/grozs")}>Grozs</NavLink>
                  </li>
                </ul>
              </div>
              <div className="rich-site-footer__col">
                <h2 className="rich-site-footer__col-title">Serviss</h2>
                <ul>
                  <li>
                    <NavLink to={to("/piegade")}>Piegāde un atgriešana</NavLink>
                  </li>
                  <li>
                    <NavLink to={to("/informacija")}>BUJ un informācija</NavLink>
                  </li>
                  <li>
                    <NavLink to={to("/kontakti")}>Saziņa / atbalsts</NavLink>
                  </li>
                </ul>
              </div>
              <div className="rich-site-footer__col">
                <h2 className="rich-site-footer__col-title">Par vietni</h2>
                <ul>
                  <li>
                    <NavLink to={to("/par-mums")}>Par mums</NavLink>
                  </li>
                  <li>
                    <NavLink to={to("/noteikumi")}>Noteikumi</NavLink>
                  </li>
                  <li>
                    <NavLink to={to("/privatums")}>Privātums</NavLink>
                  </li>
                </ul>
              </div>
              <div className="rich-site-footer__col rich-site-footer__col--contact">
                <h2 className="rich-site-footer__col-title">Palīdzības līnija</h2>
                <p>
                  <a href="mailto:info@vienskarisimajam.lv">info@vienskarisimajam.lv</a>
                </p>
                <p>
                  <a href="tel:+37120000000">+371 2000 0000</a>
                  <span className="muted"> · darba dienās 9:00-17:00</span>
                </p>
              </div>
              <div className="rich-site-footer__col">
                <h2 className="rich-site-footer__col-title">Ātri lauki</h2>
                <ul>
                  <li>
                    <NavLink to={to("/informacija#piegade")}>Piegādes info</NavLink>
                  </li>
                  <li>
                    <NavLink to={to("/informacija#buj")}>BUJ saraksts</NavLink>
                  </li>
                  <li>
                    <NavLink to={to("/noformesana")}>Noformēt pasūtījumu</NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p className="site-footer__bottom">
            © {new Date().getFullYear()} Vienkārši mājām - ikdienas un mājas preces.{" "}
            Mācību / demonstrācijas projekts. Cenas eiro (€), PVN ieskaitot.{" "}
          </p>
        </footer>
        <RichHelpChat />
      </div>
    </div>
  );
}
