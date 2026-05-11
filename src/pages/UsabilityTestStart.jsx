import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTestSession } from "../context/TestSessionContext.jsx";

function homePathForVariant(v) {
  return v === "A" ? "/" : "/rich";
}

export function UsabilityTestStart() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    session,
    resetEntireTest,
    startNewSessionFromLanding,
    refreshFromStorage,
  } = useTestSession();
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      resetEntireTest();
      const sp = new URLSearchParams(searchParams);
      sp.delete("reset");
      const q = sp.toString();
      navigate(q ? `/test?${q}` : "/test", { replace: true });
    }
  }, [searchParams, navigate, resetEntireTest]);

  const activeIncomplete = Boolean(session && !session.sessionCompletedAt);

  function resumeTarget() {
    if (!session) return "/";
    if (session.phase1CompletedAt && !session.phase2StartedAt) {
      return "/test/continue";
    }
    return homePathForVariant(session.currentVariant);
  }

  function handleStart() {
    if (!consent) return;
    const { homePath } = startNewSessionFromLanding(searchParams);
    navigate(homePath);
  }

  function handleResume() {
    navigate(resumeTarget());
  }

  return (
    <div className="usability-legal-page usability-test-start">
      <div className="usability-legal-page__inner usability-test-start__inner">
        <h1 className="usability-test-start__h1">Lietojamības tests</h1>

        {activeIncomplete ? (
          <div className="usability-callout usability-callout--info usability-test-start__resume">
            <p>
              <strong>Jums ir nepabeigts tests.</strong> Varat turpināt tur, kur apstājāties, vai sākt
              no jauna (dzēsīs sesijas datus šajā pārlūkā).
            </p>
            <div className="usability-legal-page__actions">
              <button type="button" className="btn" onClick={handleResume}>
                Turpināt testu
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  resetEntireTest();
                  navigate("/test", { replace: true });
                }}
              >
                Sākt no jauna
              </button>
            </div>
          </div>
        ) : null}

        <div className="usability-test-start__prose">
          <p>
            Šis tests ir daļa no bakalaura darba praktiskā pētījuma par minimālisma dizaina ietekmi uz
            lietotāja efektivitāti. Testa laikā Jums būs jāizpilda vairāki uzdevumi divās demonstrācijas
            e-veikala versijās.
          </p>

          <p>
            Abās versijās būs jāveic līdzīgi uzdevumi (atšķiras detaļas, piemēram, produkti un kategorijas), piemēram,
            jāatrod konkrēti produkti vai jāatrod noteikta informācija.
          </p>

          <h2 className="usability-test-start__h2">Kā tests notiks?</h2>

          <ul className="usability-test-start__list">
            <li>
              Tests sastāv no divām daļām - vispirms tiks izmantota viena vietnes versija, pēc tam otra.
            </li>
            <li>Pirms katra uzdevuma ekrānā būs redzama uzdevuma instrukcija.</li>
            <li>Laika mērīšana sāksies tikai tad, kad nospiedīsiet pogu „Sākt uzdevumu”.</li>
            <li>
              Daži uzdevumi tiks pabeigti automātiski, piemēram, kad būs atvērta pareizā produkta lapa vai
              grozs.
            </li>
            <li>
              Uzdevumos, kuros jāatrod konkrēta informācija, būs jāievada atrastā atbilde testa joslā
              ekrāna lejasdaļā.
            </li>
            <li>Ja uzdevumu neizdodas izpildīt, to būs iespējams izlaist.</li>
          </ul>

          <h2 className="usability-test-start__h2">Kas tiks mērīts?</h2>

          <p>
            Testa laikā tiks mērīts uzdevumu izpildes laiks, klikšķu skaits un tas, vai uzdevums tika
            pabeigts vai izlaists. Šie dati tiks izmantoti tikai pētījuma rezultātu analīzei.
          </p>

          <h2 className="usability-test-start__h2">Svarīga informācija</h2>

          <ul className="usability-test-start__list">
            <li>
              <strong>Maksājumi netiek veikti.</strong> Visi pasūtījumi un maksājumi šajā vietnē ir
              simulācija.
            </li>
            <li>Vietne ir demonstrācijas prototips, tāpēc tajā nav jāizmanto īsti personas dati.</li>
            <li>Pasūtījuma formā izmantojiet tikai testam norādītos datus.</li>
            <li>Dati tiek vākti anonīmi. Netiek prasīts Jūsu vārds, uzvārds vai e-pasts.</li>
          </ul>

          <h2 className="usability-test-start__h2">Pēc uzdevumu izpildes</h2>

          <p>
            Kad būs pabeigtas abas vietnes versijas, Jūs tiksiet aicināts aizpildīt īsu Google Forms
            anketu. Anketā būs jānovērtē abu vietnes versiju lietošanas pieredze un jāatbild uz dažiem
            salīdzinošiem jautājumiem.
          </p>

          <p>
            Lūdzu, testu veiciet patstāvīgi un mēģiniet izpildīt uzdevumus tā, kā Jūs to darītu reālā
            e-veikalā.
          </p>
        </div>

        <label className="usability-consent usability-test-start__consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            Sākot testu, Jūs apstiprināt, ka saprotat testa norisi un piekrītat anonīmai lietošanas datu
            apkopošanai pētījuma vajadzībām.
          </span>
        </label>

        <div className="usability-legal-page__actions usability-test-start__actions">
          <button type="button" className="btn" disabled={!consent} onClick={handleStart}>
            Sākt testu
          </button>
        </div>

        {/* <p className="muted usability-hint usability-test-start__debug">
          Debug:{" "}
          <Link to="/test?reset=true&order=AB&taskSetOrder=12">AB+12</Link>
          {" · "}
          <Link to="/test?reset=true&order=AB&taskSetOrder=21">AB+21</Link>
          {" · "}
          <Link to="/test?reset=true&order=BA&taskSetOrder=12">BA+12</Link>
          {" · "}
          <Link to="/test?reset=true&order=BA&taskSetOrder=21">BA+21</Link>
          {" · "}
          <Link to="/test?reset=true">Notīrīt sesiju</Link>
        </p> */}
      </div>
    </div>
  );
}
