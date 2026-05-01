import { useState } from "react";
import { Link } from "react-router-dom";
import { formatEur } from "../lib/formatEur.js";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";
import { StarRow } from "./StarRow.jsx";

function shortLine(text, max = 48) {
  const s = String(text ?? "").trim();
  if (!s) return "";
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export function ProductCard({ product }) {
  const initial = product.name.trim().charAt(0).toUpperCase();
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = product.image && !imgFailed;
  const to = usePrefixedTo();
  const { isRich } = useVariant();
  const rating = 3 + (product.id % 3);

  return (
    <article className={`product-card${isRich ? " product-card--rich" : ""}`}>
      <Link to={to(`/produkts/${product.id}`)} className="product-card__link">
        <div className="product-card__media">
          {isRich && product.id % 4 === 0 ? (
            <span className="product-card__corner product-card__corner--new">
              Jauns
            </span>
          ) : null}
          {isRich && product.id % 5 === 0 ? (
            <span className="product-card__corner product-card__corner--sale">
              Akcija
            </span>
          ) : null}
          {showPhoto ? (
            <img
              className="product-card__img"
              src={product.image}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span className="product-card__initial" aria-hidden="true">
              {initial}
            </span>
          )}
        </div>
        <div className="product-card__body">
          <h2 className="product-card__title">{product.name}</h2>
          {isRich ? (
            <div className="product-card__rating-row">
              <StarRow rating={rating} />
              <span className="product-card__reviews">({12 + (product.id % 40)})</span>
            </div>
          ) : null}
          <p className="product-card__price">{formatEur(product.price)}</p>
          <p className="product-card__meta">Noliktavā</p>
          {isRich ? (
            <>
              <p className="product-card__ship">{shortLine(product.delivery, 56)}</p>
              <div className="product-card__badges" aria-hidden="true">
                {product.id % 2 === 0 ? (
                  <span className="badge badge--hot">Populāri</span>
                ) : null}
                <span className="badge badge--ship">Ātra piegāde</span>
                {product.id % 3 === 0 ? (
                  <span className="badge badge--deal">TOP izvēle</span>
                ) : null}
              </div>
              <p className="product-card__cta-hint">Skatīt detaļas →</p>
            </>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
