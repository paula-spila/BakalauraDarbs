import { Link } from "react-router-dom";
import { usePrefixedTo } from "../../context/VariantContext.jsx";

function RichDefaultAside() {
  const to = usePrefixedTo();
  return (
    <nav className="rich-article-shell__quick" aria-label="Ātrās saites">
      <p className="rich-article-shell__quick-title">Ātri</p>
      <ul className="rich-article-shell__quick-list">
        <li>
          <Link to={to("/veikals")}>Veikals</Link>
        </li>
        <li>
          <Link to={to("/informacija")}>Informācija / BUJ</Link>
        </li>
        <li>
          <Link to={to("/piegade")}>Piegāde</Link>
        </li>
        <li>
          <Link to={to("/kontakti")}>Kontakti</Link>
        </li>
        <li>
          <Link to={to("/grozs")}>Grozs</Link>
        </li>
      </ul>
    </nav>
  );
}

export function RichArticleShell({ currentLabel, aside, children }) {
  const to = usePrefixedTo();
  return (
    <div className="rich-article-shell">
      <div className="rich-article-shell__mast">
        <p className="rich-article-shell__eyebrow">Klientu centrs · demonstrācija</p>
        <nav className="rich-article-shell__crumb" aria-label="Navigācijas ceļš">
          <Link to={to("/")}>Sākums</Link>
          <span className="rich-article-shell__crumb-sep" aria-hidden="true">
            /
          </span>
          <span className="rich-article-shell__crumb-current">{currentLabel}</span>
        </nav>
      </div>
      <div className="rich-article-shell__grid">
        <div className="rich-article-shell__main">{children}</div>
        <aside className="rich-article-shell__aside">
          {aside != null ? aside : <RichDefaultAside />}
        </aside>
      </div>
    </div>
  );
}
