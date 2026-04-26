import { Link } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "../data/products.js";
import { PRODUCTS } from "../data/products.js";
import { ProductCard } from "../components/ProductCard.jsx";
import { usePrefixedTo } from "../context/VariantContext.jsx";

const FEATURED_IDS = [2, 8, 16];

const categoryBlurb = {
  "virtuve-un-galds": "Trauki, virtuves tekstilē un sīkumi galdam",
  "vanna-un-kopsana": "Dvieļi, ziepes un ikdienas higiēna",
  "maja-un-uzglabasana": "Uzglabāšana, organizatori, sveces",
  "kanceleja-un-somas": "Kanceleja, pieraksti un somas",
};

export function Home() {
  const to = usePrefixedTo();
  const featured = FEATURED_IDS.map((id) =>
    PRODUCTS.find((p) => p.id === id),
  ).filter(Boolean);

  return (
    <>
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__content">
          <p className="home-hero__kicker">Ikdienas un mājas preces</p>
          <h1 id="home-hero-title" className="home-hero__title">
            Viegla iepirkšanās — skaidra izvēle, draudzīgas cenas
          </h1>
          <p className="home-hero__lead">
            Izvēlieties piederumus mājai, kurus patiešām lietosiet: virtuve, vanna,
            glīta uzglabāšana un pāris labu lietu ikdienas somā.
          </p>
          <div className="home-hero__actions">
            <Link to={to("/veikals")} className="btn btn--hero">
              Iepirkties tagad
            </Link>
            <Link
              to={to("/informacija#piegade")}
              className="btn btn--hero-ghost"
            >
              Piegāde
            </Link>
          </div>
        </div>
        <div className="home-hero__side" aria-hidden="true" />
      </section>

      <section className="trust-strip" aria-label="Ieguvumi">
        <ul className="trust-strip__list">
          <li>
            <span className="trust-strip__icon" aria-hidden="true" />
            Droša apmaksa (simulācija)
          </li>
          <li>
            <span className="trust-strip__icon" aria-hidden="true" />
            Ātra piegāde visā LV
          </li>
          <li>
            <span className="trust-strip__icon" aria-hidden="true" />
            14 dienu atgriešana
          </li>
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
                {categoryBlurb[c.id] ?? "Skatīt preces"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="feat-title">
        <div className="section-head">
          <h2 id="feat-title" className="section-title section-title--lg">
            Ieteiktās preces
          </h2>
          <Link to={to("/veikals")} className="section-head__link">
            Skatīt visu
          </Link>
        </div>
        <div className="product-grid product-grid--store">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="section promo-ribbon" aria-labelledby="help-title">
        <div className="promo-ribbon__inner">
          <div>
            <h2 id="help-title" className="section-title" style={{ margin: 0 }}>
              Nepieciešama palīdzība ar pasūtījumu?
            </h2>
            <p className="promo-ribbon__text muted" style={{ margin: "0.5rem 0 0" }}>
              Skatiet BUJ, piegādes termiņus vai rakstiet mums darba dienās.
            </p>
          </div>
          <div className="promo-ribbon__actions">
            <Link to={to("/kontakti")} className="btn">
              Kontakti
            </Link>
            <Link to={to("/informacija")} className="btn btn--ghost">
              Informācija
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
