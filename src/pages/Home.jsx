import { Link } from "react-router-dom";
import { PRODUCT_CATEGORIES, PRODUCTS } from "../data/products.js";
import {
  HOME_CATEGORY_BLURB,
  HOME_FEATURED_PRODUCT_IDS,
  HOME_HERO,
  HOME_TRUST_POINTS,
} from "../data/homePageShared.js";
import { ProductCard } from "../components/ProductCard.jsx";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";
import { RichHomePage } from "../variants/rich/RichHomePage.jsx";

export function Home() {
  const to = usePrefixedTo();
  const { isRich } = useVariant();

  if (isRich) {
    return <RichHomePage />;
  }

  const featured = HOME_FEATURED_PRODUCT_IDS.map((id) =>
    PRODUCTS.find((p) => p.id === id),
  ).filter(Boolean);

  return (
    <>
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__shell">
          <div className="home-hero__copy">
            <p className="home-hero__kicker">{HOME_HERO.kicker}</p>
            <h1 id="home-hero-title" className="home-hero__title">
              {HOME_HERO.title}
            </h1>
            <p className="home-hero__lead">{HOME_HERO.lead}</p>
          </div>
          <div className="home-hero__actions">
            <Link to={to("/veikals")} className="btn btn--hero">
              Iepirkties tagad
            </Link>
            <Link to={to("/piegade")} className="btn btn--ghost btn--hero-ghost">
              Piegāde
            </Link>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Ieguvumi">
        <ul className="trust-strip__list">
          {HOME_TRUST_POINTS.map((text) => (
            <li key={text}>
              <span className="trust-strip__bullet" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </section>

      <section className="section home-cats" aria-labelledby="cats-title">
        <h2 id="cats-title" className="section-title section-title--lg">
          Iepirkt pēc kategorijas
        </h2>
        <div className="category-tiles">
          {PRODUCT_CATEGORIES.map((c) => (
            <Link
              key={c.id}
              className="category-tile"
              to={`${to("/veikals")}?k=${encodeURIComponent(c.id)}`}
            >
              <span className="category-tile__name">{c.label}</span>
              <span className="category-tile__desc">
                {HOME_CATEGORY_BLURB[c.id] ?? "Skatīt preces"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="section home-featured"
        aria-labelledby="feat-title"
      >
        <h2 id="feat-title" className="section-title section-title--lg">
          Ieteiktās preces
        </h2>
        <div className="product-grid product-grid--store product-grid--home-featured">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
