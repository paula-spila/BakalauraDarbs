import { useState } from "react";
import { Link } from "react-router-dom";
import { formatEur } from "../../lib/formatEur.js";
import { useCart } from "../../context/CartContext.jsx";
import { usePrefixedTo } from "../../context/VariantContext.jsx";
import { StarRow } from "../../components/StarRow.jsx";

function decorativeOldPrice(price, id) {
  if (id % 5 !== 0) return null;
  const old = Math.round(Number(price) * 1.14 * 100) / 100;
  return old > price ? old : null;
}

export function RichProductCard({ product, compact = false, shelf = false }) {
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

  if (shelf) {
    const lede =
      typeof product.description === "string" && product.description.trim()
        ? product.description.trim()
        : null;

    return (
      <article className="rich-pcard rich-pcard--shelf">
        <div className="rich-pcard-shelf__col rich-pcard-shelf__col--media">
          <div className="rich-pcard-shelf__thumb">
            {product.id % 4 === 0 ? (
              <span className="rich-pcard-shelf__ribbon rich-pcard-shelf__ribbon--new">
                Jauns
              </span>
            ) : null}
            {product.id % 5 === 0 ? (
              <span className="rich-pcard-shelf__ribbon rich-pcard-shelf__ribbon--sale">
                −%
              </span>
            ) : null}
            <Link to={detail} className="rich-pcard-shelf__imglink">
              {showPhoto ? (
                <img
                  src={product.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <span className="rich-pcard-shelf__ph" aria-hidden="true">
                  {initial}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="rich-pcard-shelf__col rich-pcard-shelf__col--main">
          <Link to={detail} className="rich-pcard-shelf__titlelink">
            <h2 className="rich-pcard-shelf__title">{product.name}</h2>
          </Link>
          <div className="rich-pcard-shelf__rating-row">
            <StarRow rating={rating} />
            <span className="rich-pcard-shelf__rcount">{10 + (product.id % 35)} atsauksmes</span>
          </div>
          <div className="rich-pcard-shelf__pills" aria-label="Statuss">
            <span className="rich-pcard-shelf__pill">{product.delivery}</span>
            <span className="rich-pcard-shelf__pill rich-pcard-shelf__pill--stock">Noliktavā</span>
          </div>
          {lede ? <p className="rich-pcard-shelf__lede">{lede}</p> : null}
          {flash ? (
            <p className="rich-pcard-shelf__flash" role="status">
              +1 grozā
            </p>
          ) : null}
        </div>

        <div className="rich-pcard-shelf__col rich-pcard-shelf__col--buy">
          <div className="rich-pcard-shelf__pricebox">
            {oldPrice != null ? (
              <span className="rich-pcard-shelf__was">{formatEur(oldPrice)}</span>
            ) : null}
            <span className="rich-pcard-shelf__now">{formatEur(product.price)}</span>
          </div>
          <button
            type="button"
            className="btn btn--small rich-btn rich-btn--primary rich-pcard-shelf__cart"
            onClick={addQuick}
          >
            Grozā
          </button>
          <Link to={detail} className="rich-pcard-shelf__detail">
            Skatīt detaļas
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`rich-pcard rich-pcard--band${compact ? " rich-pcard--compact" : ""}`}
    >
      <div className="rich-pcard__media">
        {product.id % 4 === 0 ? (
          <span className="rich-pcard__ribbon rich-pcard__ribbon--new">Jauns</span>
        ) : null}
        {product.id % 5 === 0 ? (
          <span className="rich-pcard__ribbon rich-pcard__ribbon--sale">−%</span>
        ) : null}
        <div className="rich-pcard__media-cut">
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
        <div className="rich-pcard__price-dock">
          <div className="rich-pcard__price-dock-inner">
            {oldPrice != null ? (
              <span className="rich-pcard__was">{formatEur(oldPrice)}</span>
            ) : null}
            <span className="rich-pcard__now">{formatEur(product.price)}</span>
          </div>
        </div>
      </div>

      <div className="rich-pcard__body">
        <div className="rich-pcard__lead">
          <Link to={detail} className="rich-pcard__titlelink">
            <h2 className="rich-pcard__title">{product.name}</h2>
          </Link>
          <div className="rich-pcard__rating-col">
            <StarRow rating={rating} />
            <span className="rich-pcard__rcount">({10 + (product.id % 35)})</span>
          </div>
        </div>

        <div className="rich-pcard__chips">
          <span className="rich-pcard__chip rich-pcard__chip--ship">{product.delivery}</span>
          <span className="rich-pcard__chip rich-pcard__chip--stock">Noliktavā</span>
        </div>

        <div className="rich-pcard__foot">
          <button
            type="button"
            className="btn btn--small rich-btn rich-btn--primary rich-pcard__cart"
            onClick={addQuick}
          >
            Grozā
          </button>
          <Link to={detail} className="rich-pcard__detail">
            Skatīt detaļas →
          </Link>
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
