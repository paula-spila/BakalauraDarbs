import { Link } from "react-router-dom";
import { PRODUCT_CATEGORIES, PRODUCTS } from "../../data/products.js";
import {
  HOME_CATEGORY_BLURB,
  HOME_FEATURED_PRODUCT_IDS,
  HOME_HELP_PROMO,
  HOME_HERO,
  HOME_TRUST_POINTS,
} from "../../data/homePageShared.js";

const RICH_HOME_EXTRA_FEATURED_IDS = [5, 11, 1, 3, 4];
import { RichProductCard } from "./RichProductCard.jsx";
import { usePrefixedTo } from "../../context/VariantContext.jsx";

function SvgIcon({ children }) {
  return (
    <svg
      className="rich-value-meta__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const VALUE_META = [
  {
    label: "Piegādes laiks",
    value: "2–3 darba dienas",
    icon: (
      <SvgIcon>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </SvgIcon>
    ),
  },
  {
    label: "Veikala komanda",
    value: "Atbalsts darba dienās",
    icon: (
      <SvgIcon>
        <path d="M12 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </SvgIcon>
    ),
  },
  {
    label: "Izvēles līmenis",
    value: "Skaidras kategorijas",
    icon: (
      <SvgIcon>
        <path d="M4 19h16" />
        <path d="M7 16l3-8 4 5 3-6" />
      </SvgIcon>
    ),
  },
  {
    label: "Atgriešanas logs",
    value: "14 dienu garantija",
    icon: (
      <SvgIcon>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </SvgIcon>
    ),
  },
];

export function RichHomePage() {
  const to = usePrefixedTo();
  const featuredIds = [
    ...new Set([...HOME_FEATURED_PRODUCT_IDS, ...RICH_HOME_EXTRA_FEATURED_IDS]),
  ];
  const featured = featuredIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="rich-startpage">
      <div className="rich-startpage__deco" aria-hidden="true">
        <span className="rich-deco-orb rich-deco-orb--1" />
        <span className="rich-deco-orb rich-deco-orb--2" />
        <span className="rich-deco-orb rich-deco-orb--3" />
      </div>
      <section
        className="rich-hero-market rich-hero-market--vibrant"
        aria-labelledby="rh-main"
      >
        <div className="rich-hero-market__main">
          <p className="rich-hero-market__eyebrow">{HOME_HERO.kicker}</p>
          <h1 id="rh-main" className="rich-hero-market__title">
            {HOME_HERO.title}
          </h1>
          <p className="rich-hero-market__lead">{HOME_HERO.lead}</p>
          <div className="rich-hero-market__ctas">
            <Link
              to={to("/informacija#piegade")}
              className="btn rich-hero-btn rich-hero-btn--ghost rich-hero-btn--loud"
            >
              Piegāde
            </Link>
            <Link
              to={to("/par-mums")}
              className="btn rich-hero-btn rich-hero-btn--ghost rich-hero-btn--loud rich-hero-btn--accent"
            >
              Par veikalu
            </Link>
          </div>
        </div>
        <div className="rich-hero-market__visual" aria-hidden="true">
          <div className="rich-hero-visual__collage">
            <div className="rich-hero-visual__polaroid rich-hero-visual__polaroid--a">
              <div className="rich-hero-visual__polaroid-inner">
                <div className="rich-hero-visual__ph" />
                <div className="rich-hero-visual__stickers">
                  <span className="rich-hero-visual__sticker rich-hero-visual__sticker--price">
                    no 11,00 €
                  </span>
                  <span className="rich-hero-visual__sticker rich-hero-visual__sticker--ship">
                    2–3 d.d.
                  </span>
                </div>
              </div>
            </div>
            <div className="rich-hero-visual__polaroid rich-hero-visual__polaroid--b">
              <div className="rich-hero-visual__polaroid-inner">
                <div className="rich-hero-visual__ph" />
                <div className="rich-hero-visual__stickers">
                  <span className="rich-hero-visual__sticker rich-hero-visual__sticker--new">
                    Jauns
                  </span>
                  <span className="rich-hero-visual__sticker rich-hero-visual__sticker--cart">
                    Grozs +
                  </span>
                </div>
              </div>
            </div>
            <div className="rich-hero-visual__polaroid rich-hero-visual__polaroid--c">
              <div className="rich-hero-visual__polaroid-inner">
                <div className="rich-hero-visual__ph" />
                <div className="rich-hero-visual__stickers">
                  <span className="rich-hero-visual__sticker">−15%</span>
                  <span className="rich-hero-visual__sticker rich-hero-visual__sticker--ship">
                    Bezmaksas virs 35 €
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="rich-hero-visual__caption">Demonstrācijas attēlu vietturi</p>
        </div>
        <Link
          to={to("/veikals")}
          className="btn rich-hero-btn rich-hero-btn--primary rich-hero-btn--loud rich-hero-market__cta-primary"
        >
          Iepirkties tagad
        </Link>
      </section>

      <aside
        className="rich-promo-sash"
        aria-label="Akcijas josla (dekoratīva demonstrācija)"
      >
        <span className="rich-promo-sash__badge">−15%</span>
        <span className="rich-promo-sash__text">
          Atlasītām precēm šajā nedēļā — bezmaksas piegāde no 35 € visā Latvijā
        </span>
        <Link to={to("/veikals")} className="rich-promo-sash__cta">
          Atvērt katalogu
        </Link>
      </aside>

      <section className="rich-trust-band rich-trust-band--bold" aria-label="Ieguvumi">
        {HOME_TRUST_POINTS.map((text, i) => (
          <div key={text} className="rich-trust-band__item">
            <span className="rich-trust-band__icon" aria-hidden="true">
              {["✓", "🚚", "↩"][i] ?? "★"}
            </span>
            <span>{text}</span>
          </div>
        ))}
      </section>

      <section className="rich-value-meta" aria-label="Īsie pakalpojuma dati">
        <ul className="rich-value-meta__list">
          {VALUE_META.map((row) => (
            <li key={row.label} className="rich-value-meta__item">
              <span className="rich-value-meta__icon-wrap">{row.icon}</span>
              <span className="rich-value-meta__label">{row.label}</span>
              <span className="rich-value-meta__value">{row.value}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rich-section rich-section--cats" aria-labelledby="cats-title">
        <h2 id="cats-title" className="rich-section__title rich-section__title--solo">
          Iepirkt pēc kategorijas
        </h2>
        <div className="rich-cat-grid rich-cat-grid--showcase">
          {PRODUCT_CATEGORIES.map((c) => (
            <Link
              key={c.id}
              className="rich-cat-card rich-cat-card--showcase"
              to={`${to("/veikals")}?k=${encodeURIComponent(c.id)}`}
              data-rich-cat={c.id}
            >
              <div className="rich-cat-card__media" aria-hidden="true">
                <span className="rich-cat-card__ph-initial">
                  {c.label.trim().charAt(0)}
                </span>
              </div>
              <span className="rich-cat-card__badge">Kategorija</span>
              <span className="rich-cat-card__name">{c.label}</span>
              <span className="rich-cat-card__desc">
                {HOME_CATEGORY_BLURB[c.id] ?? "Skatīt preces"}
              </span>
              <span className="rich-cat-card__go">Skatīt preces →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rich-section rich-section--featured" aria-labelledby="feat-title">
        <div className="rich-section__head">
          <h2 id="feat-title" className="rich-section__title">
            Ieteiktās preces
          </h2>
          <Link to={to("/veikals")} className="rich-section__link rich-section__link--cta">
            Skatīt visu
          </Link>
        </div>
        <div className="rich-product-wall">
          {featured.map((p) => (
            <RichProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </section>

      <section className="rich-help-ribbon" aria-labelledby="help-title">
        <div className="rich-help-ribbon__inner">
          <div>
            <h2 id="help-title" className="rich-help-ribbon__title">
              {HOME_HELP_PROMO.title}
            </h2>
            <p className="rich-help-ribbon__lead muted">{HOME_HELP_PROMO.lead}</p>
          </div>
          <div className="rich-help-ribbon__actions">
            <Link to={to("/kontakti")} className="btn rich-help-ribbon__btn">
              Kontakti
            </Link>
            <Link to={to("/informacija")} className="btn btn--ghost rich-help-ribbon__btn">
              Informācija
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
