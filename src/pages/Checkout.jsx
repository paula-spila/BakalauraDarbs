import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { formatEur } from "../lib/formatEur.js";
import { useCart } from "../context/CartContext.jsx";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";

export function Checkout() {
  const { thanksSessionKey } = useVariant();
  const to = usePrefixedTo();
  const { lines, subtotal, clearCart } = useCart();
  const [formError, setFormError] = useState("");

  const readThanksFlag = useCallback(() => {
    try {
      return sessionStorage.getItem(thanksSessionKey) === "1";
    } catch {
      return false;
    }
  }, [thanksSessionKey]);

  const setThanksFlag = useCallback(() => {
    try {
      sessionStorage.setItem(thanksSessionKey, "1");
    } catch {
      /* ignore */
    }
  }, [thanksSessionKey]);

  const clearThanksFlag = useCallback(() => {
    try {
      sessionStorage.removeItem(thanksSessionKey);
    } catch {
      /* ignore */
    }
  }, [thanksSessionKey]);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [terms, setTerms] = useState(false);

  const showThankYou = lines.length === 0 && readThanksFlag();

  useEffect(() => {
    if (lines.length > 0) {
      clearThanksFlag();
    }
  }, [lines.length, clearThanksFlag]);

  if (lines.length === 0 && !showThankYou) {
    return (
      <div className="empty-state">
        <p>Lai noformētu pasūtījumu, vispirms pievienojiet preces grozam.</p>
        <Link to={to("/veikals")} className="btn">
          Doties uz veikalu
        </Link>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="thank-you">
        <h1 className="page-title">Paldies</h1>
        <p>Pasūtījums pieņemts (simulācija).</p>
        <div className="actions-row">
          <Link
            to={to("/veikals")}
            className="btn"
            onClick={() => clearThanksFlag()}
          >
            Turpināt iepirkties
          </Link>
          <Link
            to={to("/")}
            className="btn btn--ghost"
            onClick={() => clearThanksFlag()}
          >
            Uz sākumu
          </Link>
        </div>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const fn = fullname.trim();
    const em = email.trim();
    const ad = address.trim();
    const ci = city.trim();
    const po = postal.trim();

    if (!fn || !ad || !ci || !po) {
      setFormError("Lūdzu, aizpildiet visus obligātos laukus.");
      return;
    }
    if (!em || !em.includes("@")) {
      setFormError("Lūdzu, norādiet derīgu e-pasta adresi.");
      return;
    }
    if (!terms) {
      setFormError("Lai turpinātu, jāpiekrīt noteikumiem.");
      return;
    }

    setThanksFlag();
    clearCart();
  }

  return (
    <>
      <h1 className="page-title">Noformēšana</h1>
      <p className="lead">
        Aizpildiet piegādes datus. Maksājums netiek veikts — tā ir simulācija.
      </p>
      <div className="panel panel--summary">
        <h2 className="panel__title">Pasūtījuma kopsavilkums</h2>
        <ul className="summary-list">
          {lines.map((l) => (
            <li key={l.productId}>
              {l.name} × {l.qty} — {formatEur(l.unitPrice * l.qty)}
            </li>
          ))}
        </ul>
        <p className="summary-total">
          <strong>Kopā:</strong> {formatEur(subtotal)}
        </p>
      </div>
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <label htmlFor="fullname">Vārds, uzvārds</label>
        <input
          id="fullname"
          name="fullname"
          autoComplete="name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <label htmlFor="email">E-pasts</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="address">Ielas nosaukums un numurs</label>
        <input
          id="address"
          name="address"
          autoComplete="street-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <label htmlFor="city">Pilsēta</label>
        <input
          id="city"
          name="city"
          autoComplete="address-level2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <label htmlFor="postal">Pasta indekss</label>
        <input
          id="postal"
          name="postal"
          autoComplete="postal-code"
          value={postal}
          onChange={(e) => setPostal(e.target.value)}
        />
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
          />
          <span>
            Piekrītu{" "}
            <Link to={to("/informacija#buj")}>noteikumiem un BUJ</Link>.
          </span>
        </label>
        {formError ? <p className="form-error">{formError}</p> : null}
        <button type="submit" className="btn">
          Apstiprināt pasūtījumu
        </button>
      </form>
    </>
  );
}
