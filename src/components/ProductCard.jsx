import { useState } from "react";
import { Link } from "react-router-dom";
import { formatEur } from "../lib/formatEur.js";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";

export function ProductCard({ product }) {
  const initial = product.name.trim().charAt(0).toUpperCase();
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = product.image && !imgFailed;
  const to = usePrefixedTo();
  const { isRich } = useVariant();

  return (
    <article className="product-card">
      <Link to={to(`/produkts/${product.id}`)} className="product-card__link">
        <div className="product-card__media">
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
          <p className="product-card__price">{formatEur(product.price)}</p>
          <p className="product-card__meta">Noliktavā</p>
          {isRich ? (
            <div className="product-card__badges" aria-hidden="true">
              {product.id % 2 === 0 ? (
                <span className="badge badge--hot">Populāri</span>
              ) : null}
              <span className="badge badge--ship">Ātra piegāde</span>
              {product.id % 3 === 0 ? (
                <span className="badge badge--deal">TOP izvēle</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
