import { Link } from "react-router-dom";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";
import { RichArticleShell } from "../variants/rich/RichArticleShell.jsx";

export function Privatums() {
  const to = usePrefixedTo();
  const { isRich } = useVariant();

  const body = (
    <article className="text-page">
      <h1 className="page-title">Privātuma politika</h1>
      <p className="lead">
        Kā tiek apstrādāta informācija demonstrācijas veikalā «Vienkārši mājām».
      </p>
      <div className="prose">
        <h2 className="section-title">Pārlūka dati</h2>
        <p>
          Iepirkumu groza saturs un dažas iestatījumu vērtības var glabāties
          jūsu pārlūkprogrammā (<strong>localStorage</strong> un{" "}
          <strong>sessionStorage</strong>), lai saskarne atcerētos groza saturu
          pēc pārlādes. Šie dati netiek sūtīti uz mūsu serveri.
        </p>
        <h2 className="section-title">Formas</h2>
        <p>
          Noformēšanas un kontaktu formas vērtības šis demonstrācijas projekts
          neapstrādā ārējā serverī - iesniegšana beidzas ar statisku apstiprinājuma
          ekrānu. Neievadiet jutīgus datus, ja izmantojat koplietotu datoru.
        </p>
        <h2 className="section-title">Sīkdatnes</h2>
        <p>
          Mērķtiecīgās mārketinga sīkdatnes netiek iestatītas. Pārlūkprogrammas
          sesijas sīkdatnes var būt vajadzīgas darbības nodrošināšanai.
        </p>
        <h2 className="section-title">Jūsu tiesības</h2>
        <p>
          Pēc pieprasījuma (uz{" "}
          <a href="mailto:info@vienskarisimajam.lv">info@vienskarisimajam.lv</a>) varam
          paskaidrot, kādu informāciju esam apkopojuši — praksē šeit tā aprobežojas
          ar lokālo glabātuvi jūsu ierīcē.
        </p>
        <p>
          <Link to={to("/noteikumi")}>Noteikumi</Link>
        </p>
        <p className="legal-meta">
          Pēdējo reizi atjaunots: 2026. gada 1. aprīlis.
        </p>
      </div>
    </article>
  );

  if (isRich) {
    return (
      <RichArticleShell currentLabel="Privātums">{body}</RichArticleShell>
    );
  }

  return body;
}
