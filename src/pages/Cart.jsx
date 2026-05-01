import { useMemo } from "react";
import { Link } from "react-router-dom";
import { formatEur } from "../lib/formatEur.js";
import { useCart } from "../context/CartContext.jsx";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";
import { PRODUCTS } from "../data/products.js";
import { RichProductCard } from "../variants/rich/RichProductCard.jsx";

function TrustMini() {
  return (
    <ul className="rich-trust-mini">
      <li>Droša apmaksa (simulācija)</li>
      <li>2–3 darba dienas</li>
      <li>14 dienu atgriešana</li>
    </ul>
  );
}

export function Cart() {
  const { lines, subtotal, updateLineQty, removeLine } = useCart();
  const to = usePrefixedTo();
  const { isRich } = useVariant();

  const suggestProducts = useMemo(() => {
    const inCart = new Set(lines.map((l) => l.productId));
    return PRODUCTS.filter((p) => !inCart.has(p.id)).slice(0, 3);
  }, [lines]);

  const bestsellerLines = useMemo(() => {
    return [2, 5, 11]
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter(Boolean);
  }, []);

  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <p>Jūsu grozs ir tukšs.</p>
        <Link to={to("/veikals")} className="btn">
          Doties uz veikalu
        </Link>
      </div>
    );
  }

  const tableBlock = (
    <>
      <h1 className="page-title">Grozs</h1>
      <div className="table-wrap">
        <table className="cart-table" aria-label="Groza saturs">
          <thead>
            <tr>
              <th scope="col">Prece</th>
              <th scope="col">Vienības cena</th>
              <th scope="col">Daudzums</th>
              <th scope="col">Rindas summa</th>
              <th scope="col">
                <span className="visually-hidden">Darbības</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => {
              const lineTotal = line.unitPrice * line.qty;
              return (
                <tr key={line.productId}>
                  <td>
                    <Link to={to(`/produkts/${line.productId}`)}>
                      {line.name}
                    </Link>
                  </td>
                  <td>{formatEur(line.unitPrice)}</td>
                  <td>
                    <input
                      className="cart-qty"
                      type="number"
                      min={1}
                      aria-label={`Daudzums: ${line.name}`}
                      value={line.qty}
                      onChange={(e) =>
                        updateLineQty(line.productId, e.target.value)
                      }
                    />
                  </td>
                  <td>{formatEur(lineTotal)}</td>
                  <td>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => removeLine(line.productId)}
                    >
                      Noņemt
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );

  const summaryBlock = (
    <div className="cart-summary">
      <p className="cart-summary__total">
        <strong>Kopā:</strong> {formatEur(subtotal)}
      </p>
      <Link to={to("/noformesana")} className="btn">
        Noformēt pasūtījumu
      </Link>
    </div>
  );

  if (isRich) {
    return (
      <>
      <div className="cart-layout-rich">
        <div className="cart-layout-rich__main">
          <div className="rich-cart-top" role="presentation">
            <span>
              <span className="rich-cart-top__tag">Piedāvājums</span> Grozam virs{" "}
              <strong>35,00 €</strong> — bezmaksas piegāde (demonstrācija).
            </span>
            <Link to={to("/veikals")} className="btn btn--small btn--ghost">
              Turpināt iepirkties
            </Link>
          </div>
          {tableBlock}
        </div>
        <aside className="cart-layout-rich__aside" aria-label="Kopsavilkums">
          <div className="rich-side-card">
            <h2 className="rich-side-card__title">Pasūtījuma kopsavilkums</h2>
            <p className="rich-side-card__total">
              <strong>Kopā:</strong> {formatEur(subtotal)}
            </p>
            <p className="muted rich-side-card__hint">
              Bezmaksas piegāde, ja summa virs 35,00 € (demonstrācija).
            </p>
            <Link to={to("/noformesana")} className="btn btn--block">
              Noformēt pasūtījumu
            </Link>
          </div>
          <div className="rich-side-card rich-side-card--muted">
            <label htmlFor="cart-promo" className="rich-side-card__label">
              Akcijas kods
            </label>
            <input
              id="cart-promo"
              type="text"
              className="rich-promo-input"
              placeholder="piemēram, RUDENS"
              disabled
              readOnly
              title="Demonstrācija — kods nestrādā"
            />
            <p className="rich-side-card__fineprint">
              Demonstrācija: koda lauks ir tikai vizuāls.
            </p>
          </div>
          <TrustMini />
          <div className="rich-side-card">
            <h2 className="rich-side-card__title">Piegādes opcijas</h2>
            <p className="rich-side-card__hint">
              Standarta piegāde <strong>2–3 darba dienas</strong>. Dažām precēm —{" "}
              <strong>5–7 darba dienas</strong> (skatiet preces aprakstu).
            </p>
            <Link to={to("/piegade")} className="btn btn--ghost btn--small btn--block">
              Piegādes noteikumi
            </Link>
          </div>
          <div className="rich-side-card rich-side-card--muted">
            <h2 className="rich-side-card__title">Populāri šonedēļ</h2>
            <ul className="rich-side-card__lines">
              {bestsellerLines.map((p) => (
                <li key={p.id}>
                  <Link to={to(`/produkts/${p.id}`)}>{p.name}</Link> —{" "}
                  {formatEur(p.price)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rich-side-card">
            <h2 className="rich-side-card__title">BUJ īsumā</h2>
            <p className="rich-side-card__hint">
              Kā mainīt pasūtījumu, atgriešana, piegādes laiki — viss vienuviet.
            </p>
            <Link to={to("/informacija#buj")} className="btn btn--small btn--block">
              Skatīt BUJ
            </Link>
          </div>
        </aside>
      </div>
      {suggestProducts.length > 0 ? (
        <section className="rich-cart-suggest" aria-labelledby="cart-sug-h">
          <h2 id="cart-sug-h" className="rich-cart-suggest__title">
            Citi pircēji arī skatīja
          </h2>
          <div className="rich-product-grid">
            {suggestProducts.map((p) => (
              <RichProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </section>
      ) : null}
      </>
    );
  }

  return (
    <>
      {tableBlock}
      {summaryBlock}
    </>
  );
}
