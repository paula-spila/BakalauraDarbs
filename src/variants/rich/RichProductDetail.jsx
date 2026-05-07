import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoryLabel, PRODUCTS } from "../../data/products.js";
import { formatEur } from "../../lib/formatEur.js";
import { useCart } from "../../context/CartContext.jsx";
import { usePrefixedTo } from "../../context/VariantContext.jsx";
import { StarRow } from "../../components/StarRow.jsx";
import { RichProductCard } from "./RichProductCard.jsx";

function decorativeOldPrice(price, id) {
  if (id % 5 !== 0) return null;
  const old = Math.round(Number(price) * 1.14 * 100) / 100;
  return old > price ? old : null;
}

export function RichProductDetail({
  product,
  qty,
  setQty,
  showPhoto,
  imgFailed,
  setImgFailed,
  initial,
  onAddToCart,
  related,
  bundle,
}) {
  const to = usePrefixedTo();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [bundleImgFailed, setBundleImgFailed] = useState({});
  const rating = 3 + (product.id % 3);
  const oldPrice = decorativeOldPrice(product.price, product.id);

  useEffect(() => {
    setBundleImgFailed({});
  }, [product.id]);

  const sidebarPicks = useMemo(() => {
    return PRODUCTS.filter(
      (p) => p.categoryId === product.categoryId && p.id !== product.id,
    ).slice(0, 4);
  }, [product.categoryId, product.id]);

  function handleAdd() {
    onAddToCart();
  }

  function addBundleItem(p) {
    addToCart(p.id, 1, { name: p.name, unitPrice: p.price });
  }

  return (
    <div className="rich-pdp">
      <div className="rich-pdp__hero-grid">
        <div className="rich-pdp__gallery">
          <div className="rich-pdp__mainshot">
            {showPhoto ? (
              <img
                src={product.image}
                alt={product.name}
                loading="eager"
                decoding="async"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <span className="rich-pdp__ph" aria-hidden="true">
                {initial}
              </span>
            )}
          </div>
          <div className="rich-pdp__thumbs" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                className={`rich-pdp__thumb${i === 0 ? " is-active" : ""}`}
                tabIndex={-1}
              >
                {showPhoto && !imgFailed ? (
                  <img src={product.image} alt="" />
                ) : (
                  <span>{initial}</span>
                )}
              </button>
            ))}
          </div>
          <p className="rich-pdp__thumb-note">Demonstrācija — sīkbildes ir vizuālas.</p>
        </div>

        <div className="rich-pdp__commerce">
          <div className="rich-pdp__commerce-inner">
            <div className="rich-pdp__badges">
              {product.id % 4 === 0 ? (
                <span className="badge badge--new">Jauns</span>
              ) : null}
              {product.id % 5 === 0 ? (
                <span className="badge badge--sale">Akcija</span>
              ) : null}
              <span className="badge badge--ship">Ātra piegāde</span>
            </div>
            <p className="rich-pdp__cat">{categoryLabel(product.categoryId)}</p>
            <h1 className="rich-pdp__title">{product.name}</h1>
            <div className="rich-pdp__rating">
              <StarRow rating={rating} />
              <span>{20 + (product.id % 60)} atsauksmes (demonstrācija)</span>
            </div>
            <div className="rich-pdp__pricebox">
              {oldPrice != null ? (
                <span className="rich-pdp__old">{formatEur(oldPrice)}</span>
              ) : null}
              <span className="rich-pdp__price">{formatEur(product.price)}</span>
              <span className="rich-pdp__vat">ar PVN</span>
            </div>
            <div className="rich-pdp__callouts">
              <div className="rich-pdp__callout">
                <strong>Piegāde</strong>
                <span>{product.delivery}</span>
              </div>
              <div className="rich-pdp__callout rich-pdp__callout--ok">
                <strong>Noliktavā</strong>
                <span>Parasti nosūtām 1 darba dienas laikā</span>
              </div>
            </div>
            <ul className="rich-pdp__trust">
              <li>Apmaksa: simulācija</li>
              <li>14 d. atgriešana</li>
              <li>SSL (demonstrācija)</li>
            </ul>
            <div className="rich-pdp__promoin">
              <label htmlFor="pdp-promo">Akcijas kods</label>
              <input
                id="pdp-promo"
                type="text"
                placeholder="piem., RUDENS"
                disabled
                readOnly
              />
            </div>
            <p className="rich-pdp__desc">{product.description}</p>
            <div className="rich-pdp__qty-row">
              <div className="qty-field rich-pdp__qty">
                <label htmlFor="qty">Daudzums</label>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Math.floor(Number(e.target.value)) || 1))
                  }
                />
              </div>
              <div className="rich-pdp__ctas rich-pdp__ctas--cluster">
                <button type="button" className="btn rich-pdp__btn-main" onClick={handleAdd}>
                  Pievienot grozam
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => navigate(to("/grozs"))}
                >
                  Atvērt grozu
                </button>
              </div>
            </div>
            <Link to={to("/veikals")} className="link-quiet rich-pdp__back">
              ← Atpakaļ uz veikalu
            </Link>
          </div>
        </div>

        <aside className="rich-pdp__rail" aria-label="Piegāde, palīdzība un ieteikumi">
          <div className="rich-pdp-card rich-pdp-card--delivery">
            <h2 className="rich-pdp-card__h">Piegāde</h2>
            <p className="rich-pdp-card__p">
              Šai precei: <strong>{product.delivery}</strong>.
            </p>
            <Link to={to("/piegade")} className="rich-pdp-card__link">
              Visi piegādes noteikumi →
            </Link>
          </div>
          <div className="rich-pdp-card rich-pdp-card--help">
            <h2 className="rich-pdp-card__h">Nepieciešama palīdzība?</h2>
            <p className="rich-pdp-card__p">
              Darba dienās atbildam uz jautājumiem par pasūtījumu (demonstrācija).
            </p>
            <Link to={to("/kontakti")} className="btn btn--small btn--block">
              Kontakti
            </Link>
          </div>
          <div className="rich-pdp-card rich-pdp-card--promo">
            <p className="rich-pdp-card__eyebrow">Sezonas piedāvājums</p>
            <p className="rich-pdp-card__p">
              Bezmaksas piegāde pasūtījumiem virs <strong>35,00 €</strong> (demonstrācija).
            </p>
          </div>
          {sidebarPicks.length > 0 ? (
            <div className="rich-pdp-card">
              <h2 className="rich-pdp-card__h">Populāri kategorijā</h2>
              <ul className="rich-pdp-mini-list">
                {sidebarPicks.map((p) => (
                  <li key={p.id}>
                    <Link to={to(`/produkts/${p.id}`)} className="rich-pdp-mini-list__a">
                      <span className="rich-pdp-mini-list__name">{p.name}</span>
                      <span className="rich-pdp-mini-list__price">{formatEur(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="rich-pdp-card rich-pdp-card--faq">
            <h2 className="rich-pdp-card__h">Ātras atbildes</h2>
            <Link to={to("/informacija#buj")} className="rich-pdp-card__link">
              BUJ un atgriešana →
            </Link>
          </div>
        </aside>
      </div>

      <div className="rich-pdp__facts">
        <h2 className="rich-pdp__facts-title">Specifikācija</h2>
        <ul className="rich-pdp__facts-list">
          <li>
            <strong>Materiāls</strong> {product.material}
          </li>
          <li>
            <strong>Izmērs / tilpums</strong> {product.size}
          </li>
          <li>
            <strong>Krāsa</strong> {product.color}
          </li>
        </ul>
      </div>

      {bundle.length > 0 ? (
        <section className="rich-pdp__bundle" aria-labelledby="bun-h">
          <h2 id="bun-h" className="rich-section__title">
            Bieži pērk kopā (demonstrācija)
          </h2>
          <ul className="rich-pdp__bundle-list">
            {bundle.map((p) => {
              const bundleInitial = p.name.trim().charAt(0).toUpperCase();
              const showBundlePhoto = p.image && !bundleImgFailed[p.id];
              return (
                <li key={p.id}>
                  <span className="rich-pdp__bundle-thumb">
                    {showBundlePhoto ? (
                      <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        onError={() =>
                          setBundleImgFailed((prev) => ({ ...prev, [p.id]: true }))
                        }
                      />
                    ) : (
                      <span className="rich-pdp__bundle-thumb-ph" aria-hidden="true">
                        {bundleInitial}
                      </span>
                    )}
                  </span>
                  <span className="rich-pdp__bundle-name">{p.name}</span>
                  <span className="rich-pdp__bundle-price">{formatEur(p.price)}</span>
                  <button type="button" className="btn btn--small" onClick={() => addBundleItem(p)}>
                    + Grozā
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="rich-pdp__related" aria-labelledby="rel-h">
          <header className="rich-pdp__related-head">
            <div className="rich-pdp__related-head-main">
              <h2 id="rel-h" className="rich-section__title rich-pdp__related-title">
                Jums varētu patikt arī
              </h2>
              <Link to={to("/veikals")} className="btn btn--small btn--ghost rich-pdp__related-all">
                Visas preces →
              </Link>
            </div>
            <p className="rich-pdp__related-lead">
              Ieteikumi no kataloga — turpiniet iepirkšanos vai atveriet pilnu sortimentu.
            </p>
          </header>
          <div className="rich-product-wall rich-product-wall--pdp-related">
            {related.map((p) => (
              <RichProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
