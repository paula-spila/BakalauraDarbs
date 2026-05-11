import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PRODUCT_CATEGORIES, PRODUCTS } from "../data/products.js";
import { formatEur } from "../lib/formatEur.js";
import { ProductCard } from "../components/ProductCard.jsx";
import { RichProductCard } from "../variants/rich/RichProductCard.jsx";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";

function normalizeQ(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function productMatchesQuery(product, qNorm) {
  if (!qNorm) return true;
  const Hay = (product.name + " " + (product.description ?? ""))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return Hay.includes(qNorm);
}

function validCategoryId(k) {
  if (!k) return null;
  return PRODUCT_CATEGORIES.some((c) => c.id === k) ? k : null;
}

function isSlowDelivery(delivery) {
  return String(delivery).includes("5–7") || String(delivery).includes("5-7");
}

const RAIL_BEST_IDS = [2, 5, 11, 16];

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const kParam = searchParams.get("k") ?? "";
  const [categoryId, setCategoryId] = useState(() => validCategoryId(kParam));
  const to = usePrefixedTo();
  const { isRich } = useVariant();

  const [sortKey, setSortKey] = useState("default");
  const [priceMax, setPriceMax] = useState("");
  const [availFilter, setAvailFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  useEffect(() => {
    setCategoryId(validCategoryId(kParam));
  }, [kParam]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("viens-shop-sort", { detail: sortKey }));
  }, [sortKey]);

  const qNorm = useMemo(() => normalizeQ(qParam), [qParam]);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (categoryId && p.categoryId !== categoryId) return false;
      if (!qNorm) return true;
      if (!productMatchesQuery(p, qNorm)) return false;
      return true;
    }).filter((p) => {
      if (priceMax) {
        const n = Number(priceMax);
        if (Number.isFinite(n) && p.price > n) return false;
      }
      if (availFilter === "stock") {
        if (p.id % 11 === 0) return false;
      }
      if (availFilter === "wait") {
        if (p.id % 11 !== 0) return false;
      }
      if (deliveryFilter === "fast") {
        if (isSlowDelivery(p.delivery)) return false;
      }
      if (deliveryFilter === "slow") {
        if (!isSlowDelivery(p.delivery)) return false;
      }
      return true;
    });
  }, [categoryId, qNorm, priceMax, availFilter, deliveryFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortKey === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sortKey === "price-desc") arr.sort((a, b) => b.price - a.price);
    else if (sortKey === "name-asc")
      arr.sort((a, b) => a.name.localeCompare(b.name, "lv"));
    else if (sortKey === "name-desc")
      arr.sort((a, b) => b.name.localeCompare(a.name, "lv"));
    else arr.sort((a, b) => a.id - b.id);
    return arr;
  }, [filtered, sortKey]);

  function setCategory(next) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (next) p.set("k", next);
      else p.delete("k");
      return p;
    });
  }

  const tabsAndGrid = (
    <>
      <div className="shop-min-toolbar">
        <div className="category-tabs" role="tablist" aria-label="Preču kategorijas">
          <button
            type="button"
            role="tab"
            aria-selected={categoryId === null}
            className={categoryId === null ? "tab tab--active" : "tab"}
            onClick={() => setCategory(null)}
          >
            Visas
          </button>
          {PRODUCT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={categoryId === c.id}
              className={categoryId === c.id ? "tab tab--active" : "tab"}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="shop-sort-min" role="region" aria-label="Preču kārtība">
          <label htmlFor="shop-sort-min-select" className="shop-sort-min__label">
            Kārtot pēc
          </label>
          <select
            id="shop-sort-min-select"
            className="shop-sort-min__select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            aria-label="Kārtot preces"
          >
            <option value="default">Ieteiktā secība</option>
            <option value="price-asc">Cena: no zemākās</option>
            <option value="price-desc">Cena: no augstākās</option>
            <option value="name-asc">Nosaukums (A–Z)</option>
            <option value="name-desc">Nosaukums (Z–A)</option>
          </select>
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="empty-inline">
          Neviena prece neatbilst meklēšanai.{" "}
          <Link to={to("/veikals")}>Notīrīt meklēšanu</Link>
        </p>
      ) : (
        <div className="product-grid product-grid--store">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );

  const richMain = (
    <div className="rich-shop-page">
      <aside className="rich-shop-filters" aria-label="Filtri un kategorijas">
        <div className="rich-filter-block">
          <h2 className="rich-filter-block__title">Kategorija</h2>
          <fieldset className="rich-filter-fieldset">
            <legend className="visually-hidden">Kategorija</legend>
            <label className="rich-filter-row">
              <input
                type="radio"
                name="rich-cat"
                checked={categoryId === null}
                onChange={() => setCategory(null)}
              />
              <span>Visas kategorijas</span>
            </label>
            {PRODUCT_CATEGORIES.map((c) => (
              <label key={c.id} className="rich-filter-row">
                <input
                  type="radio"
                  name="rich-cat"
                  checked={categoryId === c.id}
                  onChange={() => setCategory(c.id)}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </fieldset>
        </div>
        <div className="rich-filter-block">
          <h2 className="rich-filter-block__title">Cenas diapazons</h2>
          <label className="rich-filter-select-wrap">
            <span className="visually-hidden">Maksimālā cena</span>
            <select
              className="rich-filter-select"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            >
              <option value="">Jebkura cena</option>
              <option value="15">Līdz 15 €</option>
              <option value="20">Līdz 20 €</option>
              <option value="25">Līdz 25 €</option>
              <option value="30">Līdz 30 €</option>
              <option value="40">Līdz 40 €</option>
            </select>
          </label>
        </div>
        <div className="rich-filter-block">
          <h2 className="rich-filter-block__title">Pieejamība</h2>
          <fieldset className="rich-filter-fieldset">
            <legend className="visually-hidden">Pieejamība</legend>
            <label className="rich-filter-row">
              <input
                type="radio"
                name="rich-avail"
                checked={availFilter === "all"}
                onChange={() => setAvailFilter("all")}
              />
              <span>Visas</span>
            </label>
            <label className="rich-filter-row">
              <input
                type="radio"
                name="rich-avail"
                checked={availFilter === "stock"}
                onChange={() => setAvailFilter("stock")}
              />
              <span>Tikai noliktavā</span>
            </label>
            <label className="rich-filter-row">
              <input
                type="radio"
                name="rich-avail"
                checked={availFilter === "wait"}
                onChange={() => setAvailFilter("wait")}
              />
              <span>Gaidāms (demonstrācija)</span>
            </label>
          </fieldset>
        </div>
        <div className="rich-filter-block">
          <h2 className="rich-filter-block__title">Piegādes ātrums</h2>
          <fieldset className="rich-filter-fieldset">
            <legend className="visually-hidden">Piegāde</legend>
            <label className="rich-filter-row">
              <input
                type="radio"
                name="rich-del"
                checked={deliveryFilter === "all"}
                onChange={() => setDeliveryFilter("all")}
              />
              <span>Visi termiņi</span>
            </label>
            <label className="rich-filter-row">
              <input
                type="radio"
                name="rich-del"
                checked={deliveryFilter === "fast"}
                onChange={() => setDeliveryFilter("fast")}
              />
              <span>Ātri (2-3 darba dienas)</span>
            </label>
            <label className="rich-filter-row">
              <input
                type="radio"
                name="rich-del"
                checked={deliveryFilter === "slow"}
                onChange={() => setDeliveryFilter("slow")}
              />
              <span>Garāks (5-7 darba dienas)</span>
            </label>
          </fieldset>
        </div>
        <p className="rich-filter-tip">
          <Link to={to("/informacija#piegade")} className="rich-filter-tip__link">
            Piegādes informācija
          </Link>
        </p>
      </aside>

      <div className="rich-shop-main">
        <div className="rich-shop-toolbar">
          <p className="rich-shop-count">
            <strong>{sorted.length}</strong>{" "}
            {sorted.length === 1 ? "prece" : "preces"}
            {qParam ? (
              <>
                {" "}
                · «<strong>{qParam}</strong>»
              </>
            ) : null}
          </p>
          <label className="rich-shop-sort">
            <span className="rich-shop-sort__lab">Kārtot pēc</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              aria-label="Kārtot preces"
            >
              <option value="default">Ieteiktā secība</option>
              <option value="price-asc">Cena: no zemākās</option>
              <option value="price-desc">Cena: no augstākās</option>
              <option value="name-asc">Nosaukums (A–Z)</option>
              <option value="name-desc">Nosaukums (Z–A)</option>
            </select>
          </label>
        </div>

        <div className="rich-shop-inline-promo rich-shop-inline-promo--compact" role="presentation">
          <span className="rich-shop-inline-promo__tag">Akcijas zona</span>
          <span>
            Bezmaksas piegāde pasūtījumiem virs <strong>35,00 €</strong> (demonstrācija).
          </span>
        </div>

        {sorted.length === 0 ? (
          <p className="empty-inline">
            Neviena prece neatbilst filtriem.{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setCategory(null);
                setPriceMax("");
                setAvailFilter("all");
                setDeliveryFilter("all");
                setSortKey("default");
              }}
            >
              Notīrīt filtrus
            </button>{" "}
            vai <Link to={to("/veikals")}>atvērt veikalu</Link>
          </p>
        ) : (
          <div className="rich-product-shelf" role="list">
            {sorted.map((p) => (
              <div key={p.id} className="rich-product-shelf__row" role="listitem">
                <RichProductCard product={p} shelf />
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="rich-shop-rail" aria-label="Īsi fakti un palīdzība">
        <div className="rich-rail-card rich-rail-card--rail-quiet">
          <h2 className="rich-rail-card__title rich-rail-card__title--strong">Ātri fakti</h2>
          <p className="rich-rail-card__p">
            Standarta piegāde: <strong>2-3 darba dienas</strong>. Dažām precēm{" "}
            <strong>5–7 darba dienas</strong> - izmantojiet filtru kreisajā pusē.
          </p>
          <p className="rich-rail-card__p rich-rail-card__p--tight">
            Bezmaksas piegāde demonstrācijā no <strong>35,00 €</strong>.
          </p>
        </div>
        <div className="rich-rail-card rich-rail-card--rail-quiet">
          <h2 className="rich-rail-card__title rich-rail-card__title--strong">Top preces</h2>
          <ul className="rich-rail-mini">
            {RAIL_BEST_IDS.map((id) => {
              const p = PRODUCTS.find((x) => x.id === id);
              if (!p) return null;
              return (
                <li key={p.id}>
                  <Link to={to(`/produkts/${p.id}`)}>{p.name}</Link>
                  <span>{formatEur(p.price)}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rich-rail-card rich-rail-card--rail-quiet rich-rail-card--support">
          <h2 className="rich-rail-card__title rich-rail-card__title--strong">
            Palīdzība un BUJ
          </h2>
          <ul className="rich-rail-support-list">
            <li>
              <Link to={to("/informacija#buj")}>Biežāk uzdotie jautājumi</Link>
            </li>
            <li>
              <Link to={to("/informacija#piegade")}>Piegāde un atgriešana</Link>
            </li>
            <li>
              <Link to={to("/kontakti")}>Kontakti</Link>
            </li>
            <li>
              <Link to={to("/informacija")}>Visa informācijas lapa</Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <p
        className={
          isRich ? "breadcrumb breadcrumb--rich-shop" : "breadcrumb"
        }
      >
        <Link to={to("/")}>Sākums</Link>
        <span aria-hidden="true"> / </span>
        <span className="breadcrumb__current">Veikals</span>
      </p>
      <div className="page-intro">
        <h1 className="page-title">Veikals</h1>
      </div>
      {isRich ? richMain : tabsAndGrid}
    </>
  );
}
