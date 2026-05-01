import { Link } from "react-router-dom";
import { PRODUCT_CATEGORIES, PRODUCTS } from "../../data/products.js";
import { RichProductCard } from "./RichProductCard.jsx";
import { usePrefixedTo } from "../../context/VariantContext.jsx";

const BEST_IDS = [3, 7, 12, 18, 22];
const DEAL_IDS = [4, 9, 15, 21];

const categoryBlurb = {
  "virtuve-un-galds": "Trauki un virtuve",
  "vanna-un-kopsana": "Vanna un higiēna",
  "maja-un-uzglabasana": "Māja un kārtība",
  "kanceleja-un-somas": "Kanceleja un somas",
};

/**
 * Version B home — not the same composition as Version A (no dark hero band).
 */
export function RichHomePage() {
  const to = usePrefixedTo();
  const best = BEST_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const deals = DEAL_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className="rich-startpage">
      <section className="rich-hero-market" aria-labelledby="rh-main">
        <div className="rich-hero-market__main">
          <p className="rich-hero-market__eyebrow">Nedēļas izpārdošana · demonstrācija</p>
          <h1 id="rh-main" className="rich-hero-market__title">
            Līdz −20% atlasītām precēm + bezmaksas piegāde virs 35 €
          </h1>
          <p className="rich-hero-market__lead">
            Virtuve, vanna, uzglabāšana, kanceleja — viss mājai. Tās pašas cenas un uzdevumi
            kā minimālajā versijā; šeit tikai cits vizuālais izkārtojums.
          </p>
          <div className="rich-hero-market__ctas">
            <Link to={to("/veikals")} className="btn rich-hero-btn rich-hero-btn--primary">
              Skatīt akcijas preces
            </Link>
            <Link to={to("/veikals?k=virtuve-un-galds")} className="btn rich-hero-btn rich-hero-btn--ghost">
              Virtuve
            </Link>
            <Link to={to("/informacija#piegade")} className="btn rich-hero-btn rich-hero-btn--ghost">
              Piegāde
            </Link>
          </div>
        </div>
        <div className="rich-hero-market__cards" aria-label="Īsie piedāvājumi">
          <Link to={to("/veikals")} className="rich-mini-promo rich-mini-promo--hot">
            <span className="rich-mini-promo__tag">Karsti</span>
            <strong>Populārākās</strong>
            <span className="rich-mini-promo__sub">Skatīt top preces</span>
          </Link>
          <Link to={to("/piegade")} className="rich-mini-promo rich-mini-promo--ship">
            <span className="rich-mini-promo__tag">Ātri</span>
            <strong>2–3 dienas</strong>
            <span className="rich-mini-promo__sub">Piegādes info</span>
          </Link>
          <Link to={to("/kontakti")} className="rich-mini-promo rich-mini-promo--help">
            <span className="rich-mini-promo__tag">Palīdzība</span>
            <strong>Kontakti</strong>
            <span className="rich-mini-promo__sub">Darba dienās</span>
          </Link>
        </div>
      </section>

      <div className="rich-ticker" role="presentation">
        <span>★ Bezmaksas piegāde no 35 €</span>
        <span>·</span>
        <span>14 dienu atgriešana</span>
        <span>·</span>
        <span>Droša apmaksa (simulācija)</span>
        <span>·</span>
        <span>40+ preces katalogā</span>
      </div>

      <section className="rich-spotlight" aria-label="Īpašie piedāvājumi">
        <Link to={to("/veikals")} className="rich-spotlight__card rich-spotlight__card--indigo">
          <span className="rich-spotlight__tag">Jaunumi</span>
          <span className="rich-spotlight__title">Virtuve un galds</span>
          <span className="rich-spotlight__sub">Trauki un ikdienas sīkumi</span>
        </Link>
        <Link to={to("/veikals?k=vanna-un-kopsana")} className="rich-spotlight__card rich-spotlight__card--teal">
          <span className="rich-spotlight__tag">Top</span>
          <span className="rich-spotlight__title">Vanna un kopšana</span>
          <span className="rich-spotlight__sub">Dvieļi un higiēna</span>
        </Link>
        <Link to={to("/veikals")} className="rich-spotlight__card rich-spotlight__card--orange">
          <span className="rich-spotlight__tag">Akcija</span>
          <span className="rich-spotlight__title">Nedēļas izpārdošana</span>
          <span className="rich-spotlight__sub">Atlasītas preces katalogā</span>
        </Link>
        <Link to={to("/piegade")} className="rich-spotlight__card rich-spotlight__card--violet">
          <span className="rich-spotlight__tag">Ātri</span>
          <span className="rich-spotlight__title">Piegāde 2–3 dienas</span>
          <span className="rich-spotlight__sub">Noteikumi un BUJ</span>
        </Link>
      </section>

      <div className="rich-trust-band" role="presentation">
        <div className="rich-trust-band__item">
          <span className="rich-trust-band__icon" aria-hidden="true">
            ✓
          </span>
          <span>Droša apmaksa (simulācija) — SSL demonstrācija</span>
        </div>
        <div className="rich-trust-band__item">
          <span className="rich-trust-band__icon" aria-hidden="true">
            🚚
          </span>
          <span>Piegāde visā Latvijā — 2–3 darba dienas</span>
        </div>
        <div className="rich-trust-band__item">
          <span className="rich-trust-band__icon" aria-hidden="true">
            ↩
          </span>
          <span>14 dienu atgriešana (noteikumi katalogā)</span>
        </div>
        <div className="rich-trust-band__item">
          <span className="rich-trust-band__icon" aria-hidden="true">
            ★
          </span>
          <span>40+ preces — virtuve, māja, kanceleja</span>
        </div>
      </div>

      <nav className="rich-popcats" aria-label="Populārākās kategorijas">
        {PRODUCT_CATEGORIES.map((c) => (
          <Link
            key={c.id}
            className="rich-popcats__item"
            to={`${to("/veikals")}?k=${encodeURIComponent(c.id)}`}
          >
            <span className="rich-popcats__name">{c.label}</span>
            <span className="rich-popcats__desc">{categoryBlurb[c.id] ?? ""}</span>
          </Link>
        ))}
      </nav>

      <section className="rich-section" aria-labelledby="best-h">
        <div className="rich-section__head">
          <h2 id="best-h" className="rich-section__title">
            Visvairāk pirktās
          </h2>
          <Link to={to("/veikals")} className="rich-section__link">
            Veikals →
          </Link>
        </div>
        <div className="rich-product-wall">
          {best.map((p) => (
            <RichProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </section>

      <section className="rich-section rich-section--accent" aria-labelledby="deal-h">
        <div className="rich-section__head">
          <h2 id="deal-h" className="rich-section__title">
            Nedēļas piedāvājumi
          </h2>
          <span className="rich-section__badge">Akcijas zona</span>
        </div>
        <div className="rich-product-wall rich-product-wall--dense">
          {deals.map((p) => (
            <RichProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </section>

      <section className="rich-section" aria-labelledby="cat-h">
        <h2 id="cat-h" className="rich-section__title rich-section__title--solo">
          Kategorijas ar īsiem aprakstiem
        </h2>
        <div className="rich-cat-grid">
          {PRODUCT_CATEGORIES.map((c) => (
            <Link
              key={c.id}
              className="rich-cat-card"
              to={`${to("/veikals")}?k=${encodeURIComponent(c.id)}`}
            >
              <span className="rich-cat-card__name">{c.label}</span>
              <span className="rich-cat-card__go">Skatīt preces →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rich-section" aria-labelledby="feat-h">
        <div className="rich-section__head">
          <h2 id="feat-h" className="rich-section__title">
            Ieteiktās šodien
          </h2>
        </div>
        <div className="rich-product-wall">
          {[2, 8, 16]
            .map((id) => PRODUCTS.find((p) => p.id === id))
            .filter(Boolean)
            .map((p) => (
              <RichProductCard key={p.id} product={p} compact />
            ))}
        </div>
      </section>

      <section className="rich-nl" aria-labelledby="nl-h">
        <div className="rich-nl__grid">
          <div>
            <h2 id="nl-h" className="rich-section__title" style={{ margin: 0 }}>
              Atlaides e-pastā
            </h2>
            <p className="muted" style={{ margin: "0.4rem 0 0", fontSize: "0.88rem" }}>
              Demonstrācija — netiek sūtīts. Tikai vizuāls bloks.
            </p>
          </div>
          <form
            className="rich-nl__form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input type="email" placeholder="jūsu@epasts.lv" aria-label="E-pasts" />
            <button type="submit" className="btn">
              Pierakstīties
            </button>
          </form>
        </div>
      </section>

      <section className="rich-helpbar" aria-labelledby="help-h">
        <h2 id="help-h" className="visually-hidden">
          Palīdzība
        </h2>
        <div className="rich-helpbar__inner">
          <p className="rich-helpbar__text">
            Jautājumi par pasūtījumu?{" "}
            <Link to={to("/informacija")}>BUJ</Link> ·{" "}
            <Link to={to("/kontakti")}>Kontakti</Link> ·{" "}
            <Link to={to("/piegade")}>Piegāde</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
