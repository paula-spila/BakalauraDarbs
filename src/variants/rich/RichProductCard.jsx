import { useState } from "react";
import { Link } from "react-router-dom";
import { formatEur } from "../../lib/formatEur.js";
import { useCart } from "../../context/CartContext.jsx";
import { usePrefixedTo } from "../../context/VariantContext.jsx";
import { StarRow } from "../../components/StarRow.jsx";

/** Decorative “was” price — thesis demo only; maksas cena is always `product.price`. */
function decorativeOldPrice(price, id) {
  if (id % 5 !== 0) return null;
  const old = Math.round(Number(price) * 1.14 * 100) / 100;
  return old > price ? old : null;
}

export function RichProductCard({ product, compact = false }) {
  const to = usePrefixedTo();
  const { addToCart } = useCart();
  const [imgFailed, setImgFailed] = useState(false);
  const [flash, setFlash] = useState(false);
  const showPhoto = product.image && !imgFailed;
  const initial = product.name.trim().charAt(0).toUpperCase();
  const detail = to(`/produkts/${product.id}`);
  const rating = 3 + (product.id % 3);
  const oldPrice = decorativeOldPrice(product.price, product.id);

  function addQuick(e) {
    e.preventDefault();
    addToCart(product.id, 1, {
      name: product.name,
      unitPrice: product.price,
    });
    setFlash(true);
    window.setTimeout(() => setFlash(false), 1600);
  }

  return (
    <article className={`rich-pcard${compact ? " rich-pcard--compact" : ""}`}>
      <div className="rich-pcard__media">
        {product.id % 4 === 0 ? (
          <span className="rich-pcard__ribbon rich-pcard__ribbon--new">Jauns</span>
        ) : null}
        {product.id % 5 === 0 ? (
          <span className="rich-pcard__ribbon rich-pcard__ribbon--sale">−%</span>
        ) : null}
        <Link to={detail} className="rich-pcard__imglink">
          {showPhoto ? (
            <img
              src={product.image}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span className="rich-pcard__ph" aria-hidden="true">
              {initial}
            </span>
          )}
        </Link>
      </div>
      <div className="rich-pcard__body">
        <Link to={detail} className="rich-pcard__titlelink">
          <h2 className="rich-pcard__title">{product.name}</h2>
        </Link>
        <div className="rich-pcard__rating">
          <StarRow rating={rating} />
          <span className="rich-pcard__rcount">({10 + (product.id % 35)})</span>
        </div>
        <div className="rich-pcard__priceblock">
          {oldPrice != null ? (
            <span className="rich-pcard__old">{formatEur(oldPrice)}</span>
          ) : null}
          <span className="rich-pcard__price">{formatEur(product.price)}</span>
        </div>
        <div className="rich-pcard__pills">
          <span className="rich-pcard__pill rich-pcard__pill--ship">{product.delivery}</span>
          <span className="rich-pcard__pill rich-pcard__pill--stock">Noliktavā</span>
        </div>
        <div className="rich-pcard__actions">
          <Link
            to={detail}
            className="btn btn--small btn--ghost rich-pcard__btn2 rich-btn rich-btn--secondary"
          >
            Skatīt detaļas
          </Link>
          <button
            type="button"
            className="btn btn--small rich-btn rich-btn--primary rich-pcard__btn1"
            onClick={addQuick}
          >
            Grozā
          </button>
        </div>
        {flash ? (
          <p className="rich-pcard__flash" role="status">
            +1 grozā
          </p>
        ) : null}
      </div>
    </article>
  );
}
