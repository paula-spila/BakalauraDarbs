import { Link } from "react-router-dom";
import { formatEur } from "../lib/formatEur.js";
import { useCart } from "../context/CartContext.jsx";
import { usePrefixedTo } from "../context/VariantContext.jsx";

export function Cart() {
  const { lines, subtotal, updateLineQty, removeLine } = useCart();
  const to = usePrefixedTo();

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

  return (
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
      <div className="cart-summary">
        <p className="cart-summary__total">
          <strong>Kopā:</strong> {formatEur(subtotal)}
        </p>
        <Link to={to("/noformesana")} className="btn">
          Noformēt pasūtījumu
        </Link>
      </div>
    </>
  );
}
