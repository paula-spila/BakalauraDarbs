import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { formatEur } from "../lib/formatEur.js";
import { useCart } from "../context/CartContext.jsx";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";

function TrustMini() {
  return (
    <ul className="rich-trust-mini">
      <li>Droša apmaksa (simulācija)</li>
      <li>2–3 darba dienas</li>
      <li>14 dienu atgriešana</li>
    </ul>
  );
}

export function Checkout() {
  const { thanksSessionKey, isRich } = useVariant();
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

  const orderSummaryBody = (
    <>
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
    </>
  );

  const summaryPanel = (
    <div className="panel panel--summary">
      <h2 className="panel__title">Pasūtījuma kopsavilkums</h2>
      {orderSummaryBody}
    </div>
  );

  const formBlock = (
    <form className="form-stack checkout-form" onSubmit={handleSubmit} noValidate>
      <div className="checkout-form__panel">
        <fieldset className="checkout-fieldset">
          <legend className="checkout-section__title">Kontaktpersona</legend>
          <label htmlFor="fullname">Vārds, uzvārds</label>
          <input
            id="fullname"
            className="checkout-input"
            name="fullname"
            type="text"
            autoComplete="name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <label htmlFor="email">E-pasts</label>
          <input
            id="email"
            className="checkout-input"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </fieldset>
      </div>
      <div className="checkout-form__panel">
        <fieldset className="checkout-fieldset">
          <legend className="checkout-section__title">Piegādes adrese</legend>
          <label htmlFor="address">Ielas nosaukums un numurs</label>
          <input
            id="address"
            className="checkout-input"
            name="address"
            type="text"
            autoComplete="street-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label htmlFor="city">Pilsēta</label>
          <input
            id="city"
            className="checkout-input"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <label htmlFor="postal">Pasta indekss</label>
          <input
            id="postal"
            className="checkout-input"
            name="postal"
            type="text"
            autoComplete="postal-code"
            inputMode="numeric"
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
          />
        </fieldset>
      </div>
      <div className="checkout-form__panel checkout-form__panel--footer">
        <fieldset className="checkout-fieldset checkout-fieldset--terms">
          <legend className="checkout-section__title">Noteikumi</legend>
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
        </fieldset>
        {formError ? <p className="form-error">{formError}</p> : null}
        <button type="submit" className="btn btn--checkout-submit">
          Apstiprināt pasūtījumu
        </button>
      </div>
    </form>
  );

  const richFormBlock = (
    <form className="form-stack rich-co-form" onSubmit={handleSubmit} noValidate>
      <h2 className="rich-co-section-title" id="rich-co-h-contact">
        Kontaktpersona
      </h2>
      <fieldset
        className="rich-co-fieldset"
        aria-labelledby="rich-co-h-contact"
      >
        <legend className="visually-hidden">Kontaktpersona</legend>
        <label htmlFor="fullname-rich">Vārds, uzvārds</label>
        <input
          id="fullname-rich"
          name="fullname"
          autoComplete="name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <label htmlFor="email-rich">E-pasts</label>
        <input
          id="email-rich"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </fieldset>
      <h2 className="rich-co-section-title" id="rich-co-h-address">
        Piegādes adrese
      </h2>
      <fieldset
        className="rich-co-fieldset"
        aria-labelledby="rich-co-h-address"
      >
        <legend className="visually-hidden">Piegādes adrese</legend>
        <label htmlFor="address-rich">Ielas nosaukums un numurs</label>
        <input
          id="address-rich"
          name="address"
          autoComplete="street-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <label htmlFor="city-rich">Pilsēta</label>
        <input
          id="city-rich"
          name="city"
          autoComplete="address-level2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <label htmlFor="postal-rich">Pasta indekss</label>
        <input
          id="postal-rich"
          name="postal"
          autoComplete="postal-code"
          value={postal}
          onChange={(e) => setPostal(e.target.value)}
        />
      </fieldset>
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
  );

  const intro = (
    <>
      <h1 className="page-title">Noformēšana</h1>
      <p className="lead">
        Aizpildiet piegādes datus. Maksājums netiek veikts — tā ir simulācija.
      </p>
    </>
  );

  if (isRich) {
    return (
      <div className="checkout-layout-rich">
        <div className="checkout-layout-rich__main">
          <ol className="rich-checkout-steps" aria-label="Pasūtījuma soļi">
            <li className="rich-checkout-steps__item rich-checkout-steps__item--done">
              <span>1. Grozs</span>
            </li>
            <li className="rich-checkout-steps__item rich-checkout-steps__item--current">
              <span>2. Piegādes dati</span>
            </li>
            <li className="rich-checkout-steps__item">
              <span>3. Apstiprinājums</span>
            </li>
          </ol>
          {intro}
          <div className="rich-checkout-callout" role="presentation">
            <strong>Piegāde</strong> — standarta termiņš{" "}
            <Link to={to("/piegade")}>2–3 darba dienas</Link>; dažām precēm līdz 5–7
            dienām. Maksājums šeit netiek veikts (simulācija).
          </div>
          {summaryPanel}
          {richFormBlock}
          <div className="rich-co-followup" aria-labelledby="rich-co-follow-h">
            <h2 id="rich-co-follow-h" className="rich-co-followup__title">
              Kas notiks pēc pasūtījuma apstiprināšanas?
            </h2>
            <ol className="rich-co-followup__list">
              <li>
                <strong>Apstiprinājuma ekrāns</strong> — parādīsim pateicību un grozs tiks
                noskaidrots (simulācija).
              </li>
              <li>
                <strong>Pasūtījuma kopsavilkums</strong> — datus var pārskatīt BUJ sadaļā; īsts
                maksājums netiek veikts.
              </li>
              <li>
                <strong>Piegāde</strong> — standarta termiņš{" "}
                <Link to={to("/piegade")}>2–3 darba dienas</Link>; dažām precēm līdz 5–7
                dienām.
              </li>
            </ol>
            <div className="rich-co-followup__strip" role="presentation">
              <span className="rich-co-followup__strip-label">Aptuvenais piegādes laiks</span>
              <span className="rich-co-followup__strip-value">2–3 darba dienas (standarta)</span>
            </div>
          </div>
        </div>
        <aside className="checkout-layout-rich__aside" aria-label="Papildu informācija">
          <div className="rich-side-card">
            <h2 className="rich-side-card__title">Jūsu grozs</h2>
            <ul className="rich-side-card__lines">
              {lines.map((l) => (
                <li key={l.productId}>
                  {l.name} × {l.qty}
                </li>
              ))}
            </ul>
            <p className="rich-side-card__total">
              <strong>Kopā:</strong> {formatEur(subtotal)}
            </p>
          </div>
          <div className="rich-side-card rich-side-card--muted">
            <label htmlFor="co-promo" className="rich-side-card__label">
              Akcijas kods
            </label>
            <input
              id="co-promo"
              type="text"
              className="rich-promo-input"
              placeholder="piemēram, STUDIJA"
              disabled
              readOnly
              title="Demonstrācija — kods nestrādā"
            />
          </div>
          <div className="rich-side-card">
            <h2 className="rich-side-card__title">Nepieciešama palīdzība?</h2>
            <p className="rich-side-card__hint">
              Darba dienās <strong>9:00–17:00</strong> (demonstrācija).
            </p>
            <Link to={to("/kontakti")} className="btn btn--ghost btn--small btn--block">
              Kontakti
            </Link>
          </div>
          <div className="rich-side-card rich-side-card--muted">
            <h2 className="rich-side-card__title">Ātras atbildes</h2>
            <p className="rich-side-card__hint rich-side-card__hint--tight">
              BUJ, atgriešana, piegādes izsekošana (simulācija).
            </p>
            <Link to={to("/informacija")} className="btn btn--small btn--block">
              Atvērt BUJ
            </Link>
          </div>
          <div className="rich-side-card">
            <h2 className="rich-side-card__title">Jaunumi e-pastā</h2>
            <p className="rich-side-card__fineprint">
              Pierakstieties akcijām — forma netiek nosūtīta (demonstrācija).
            </p>
            <input
              type="email"
              className="rich-promo-input"
              placeholder="jūsu@epasts.lv"
              disabled
              readOnly
              aria-label="E-pasts demonstrācijai"
            />
          </div>
          <TrustMini />
        </aside>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-section">{intro}</div>
      <section className="checkout-section" aria-labelledby="checkout-summary-h">
        <h2 id="checkout-summary-h" className="checkout-section__title">
          Pasūtījuma kopsavilkums
        </h2>
        <div className="panel panel--summary">{orderSummaryBody}</div>
      </section>
      {formBlock}
    </div>
  );
}
