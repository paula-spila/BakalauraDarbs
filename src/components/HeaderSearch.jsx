import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";

export function HeaderSearch() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const to = usePrefixedTo();
  const { isRich } = useVariant();
  const onShop =
    pathname === "/veikals" ||
    pathname === "/rich/veikals" ||
    pathname.endsWith("/veikals");

  useEffect(() => {
    if (onShop) {
      setQ(searchParams.get("q") ?? "");
    }
  }, [onShop, searchParams]);

  function handleSubmit(e) {
    e.preventDefault();
    const term = q.trim();
    if (term) {
      navigate(`${to("/veikals")}?q=${encodeURIComponent(term)}`);
    } else {
      navigate(to("/veikals"));
    }
  }

  return (
    <form
      className={`header-search${isRich ? " header-search--rich" : ""}`}
      role="search"
      onSubmit={handleSubmit}
      aria-label="Meklēt preces"
    >
      <label htmlFor="header-search-input" className="visually-hidden">
        Meklēt preces
      </label>
      <input
        id="header-search-input"
        type="search"
        className="header-search__input"
        placeholder="Meklēt preces, piemēram, krūze, dvielis…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="header-search__btn">
        Meklēt
      </button>
    </form>
  );
}
