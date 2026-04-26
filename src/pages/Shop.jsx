import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PRODUCT_CATEGORIES, PRODUCTS } from "../data/products.js";
import { ProductCard } from "../components/ProductCard.jsx";
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

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const kParam = searchParams.get("k") ?? "";
  const [categoryId, setCategoryId] = useState(() => validCategoryId(kParam));
  const to = usePrefixedTo();
  const { isRich } = useVariant();

  useEffect(() => {
    setCategoryId(validCategoryId(kParam));
  }, [kParam]);

  const qNorm = useMemo(() => normalizeQ(qParam), [qParam]);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (categoryId && p.categoryId !== categoryId) return false;
      if (!qNorm) return true;
      return productMatchesQuery(p, qNorm);
    });
  }, [categoryId, qNorm]);

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
      {filtered.length === 0 ? (
        <p className="empty-inline">
          Neviena prece neatbilst meklēšanai.{" "}
          <Link to={to("/veikals")}>Notīrīt meklēšanu</Link>
        </p>
      ) : (
        <div className="product-grid product-grid--store">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      <p className="breadcrumb">
        <Link to={to("/")}>Sākums</Link>
        <span aria-hidden="true"> / </span>
        <span className="breadcrumb__current">Veikals</span>
      </p>
      <div className="page-intro">
        <h1 className="page-title">Veikals</h1>
        <p className="page-intro__sub">
          {filtered.length} {filtered.length === 1 ? "prece" : "preces"}
          {qParam ? (
            <>
              {" "}
              meklēšanai «<strong>{qParam}</strong>»
            </>
          ) : null}
        </p>
        <p className="lead page-intro__lead">
          Filtri pēc kategorijas; meklēšanai lietojiet lodziņu lapas augšpusē.
        </p>
      </div>
      {isRich ? (
        <div className="shop-layout">
          <aside className="shop-sidebar" aria-label="Papildu informācija">
            <div className="shop-sidebar__block">
              <h2 className="shop-sidebar__title">Ātri fakti</h2>
              <p className="shop-sidebar__fake">
                Bezmaksas piegāde, ja grozs virs <strong>35,00 €</strong>.
              </p>
              <p className="shop-sidebar__fake">
                Standarta piegāde: <strong>2–3 darba dienas</strong>.
              </p>
            </div>
            <div className="shop-sidebar__block">
              <h2 className="shop-sidebar__title">Kategoriju saīsnes</h2>
              {PRODUCT_CATEGORIES.map((c) => (
                <p
                  key={c.id}
                  className="shop-sidebar__fake"
                  style={{ margin: "0.35rem 0" }}
                >
                  <Link
                    to={`${to("/veikals")}?k=${encodeURIComponent(c.id)}`}
                  >
                    {c.label} →
                  </Link>
                </p>
              ))}
            </div>
            <div className="shop-sidebar__block">
              <h2 className="shop-sidebar__title">Akcijas zona</h2>
              <p className="shop-sidebar__fake">
                Izvēlieties preces zemāk — cenas kā katalogā. Šī sadaļa ir papildu
                vizuālais bloks pētījumam.
              </p>
            </div>
          </aside>
          <div>{tabsAndGrid}</div>
        </div>
      ) : (
        tabsAndGrid
      )}
    </>
  );
}
