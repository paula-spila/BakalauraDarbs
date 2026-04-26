import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { categoryLabel, getProductById } from "../data/products.js";
import { formatEur } from "../lib/formatEur.js";
import { useCart } from "../context/CartContext.jsx";
import { usePrefixedTo } from "../context/VariantContext.jsx";

export function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const to = usePrefixedTo();
  const [qty, setQty] = useState(1);
  const [imgFailed, setImgFailed] = useState(false);
  const product = getProductById(id);

  useEffect(() => {
    setImgFailed(false);
  }, [id]);

  if (!product) {
    return (
      <div className="empty-state">
        <p>Prece nav atrasta.</p>
        <Link to={to("/veikals")} className="btn">
          Atpakaļ uz veikalu
        </Link>
      </div>
    );
  }

  const initial = product.name.trim().charAt(0).toUpperCase();
  const showPhoto = product.image && !imgFailed;

  function handleAdd() {
    addToCart(product.id, qty, {
      name: product.name,
      unitPrice: product.price,
    });
    navigate(to("/grozs"));
  }

  return (
    <>
      <p className="breadcrumb">
        <Link to={to("/")}>Sākums</Link>
        <span aria-hidden="true"> / </span>
        <Link to={to("/veikals")}>Veikals</Link>
        <span aria-hidden="true"> / </span>
        <span className="breadcrumb__current">{product.name}</span>
      </p>
      <div className="detail">
        <div className="detail__media">
          {showPhoto ? (
            <img
              className="detail__img"
              src={product.image}
              alt={product.name}
              loading="eager"
              decoding="async"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span className="detail__initial" aria-hidden="true">
              {initial}
            </span>
          )}
        </div>
        <div className="detail__content">
          <p className="detail__category">{categoryLabel(product.categoryId)}</p>
          <h1 className="page-title page-title--product">{product.name}</h1>
          <p className="detail__price">{formatEur(product.price)}</p>
          <p className="detail__desc">{product.description}</p>
          <ul className="detail-meta">
            <li>
              <strong>Materiāls:</strong> {product.material}
            </li>
            <li>
              <strong>Izmērs / tilpums:</strong> {product.size}
            </li>
            <li>
              <strong>Krāsa:</strong> {product.color}
            </li>
            <li>
              <strong>Piegāde:</strong> {product.delivery}
            </li>
          </ul>
          <div className="qty-field">
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
          <div className="actions-row">
            <button type="button" className="btn" onClick={handleAdd}>
              Pievienot grozam
            </button>
            <Link to={to("/veikals")} className="link-quiet">
              Atpakaļ uz veikalu
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
