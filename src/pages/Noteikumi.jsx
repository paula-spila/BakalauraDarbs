import { Link } from "react-router-dom";
import { usePrefixedTo, useVariant } from "../context/VariantContext.jsx";
import { RichArticleShell } from "../variants/rich/RichArticleShell.jsx";

export function Noteikumi() {
  const to = usePrefixedTo();
  const { isRich } = useVariant();

  const body = (
    <article className="text-page">
      <h1 className="page-title">Noteikumi</h1>
      <p className="lead">
        Vispārīgie lietošanas un pirkšanas noteikumi demonstrācijas veikalam
        «Vienkārši mājām».
      </p>
      <div className="prose">
        <p>
          Izmantojot šo vietni, jūs piekrītat, ka tā paredzēta pētniecības,
          mācību un saskarnes testēšanas vajadzībām. Cenas un preču pieejamība
          var atšķirties no reāliem datiem; pasūtījumu apstrāde un maksājumi
          ir <strong>simulēti</strong>.
        </p>
        <h2 className="section-title">Cenas</h2>
        <p>
          Visas cenas ir norādītas eiro (€) ar PVN, ja nav citādi
          paskaidrots. Cenas var mainīties; pasūtījuma brīdī spēkā esošā
          cena parādās grozā.
        </p>
        <h2 className="section-title">Atbildība</h2>
        <p>
          Mēs neesam atbildīgi par netiešiem zaudējumiem, kas izriet no
          demonstrācijas raksturā. Preču atbilstību attēliem iespējams pārbaudīt
          produkta lapā pirms pirkšanas.
        </p>
        <h2 className="section-title">Datu apstrāde</h2>
        <p>
          Ievadīto formu datus pārlūkprogramma var saglabāt lokāli; detaļas —{" "}
          <Link to={to("/privatums")}>Privātuma politikā</Link>.
        </p>
        <p className="legal-meta">
          Pēdējo reizi atjaunots: 2026. gada 1. aprīlis.
        </p>
      </div>
    </article>
  );

  if (isRich) {
    return (
      <RichArticleShell currentLabel="Noteikumi">{body}</RichArticleShell>
    );
  }

  return body;
}
