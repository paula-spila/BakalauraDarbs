# Divi vietnes varianti (pētījums)

Abas versijas ir **vienā** Vite lietotnē (`npm run dev`, ports **5173**).

- **Variants A (minimālais):** ceļi kā parasti — `/`, `/veikals`, `/grozs`, utt.
- **Variants B (ne minimālais):** tie paši maršruti ar prefiksu **`/rich`** — piemēram `/rich/veikals`, `/rich/grozs`. Vizualizācija ir blīvāka (sānjosla veikala lapā, reklāmlentes, nozīmītes uz kartītēm); grozs un noformēšana izmanto atsevišķus `localStorage` / `sessionStorage` atslēgas ierakstus.

Galvenes labajā pusē **A | B** pārslēdzējs (divas pogas vienā pārlūkā) ved starp A un B, saglabājot to pašu lapas veidu un meklēšanas vaicājumu (piemēram `/veikals` ↔ `/rich/veikals`).

## Statiska publicēšana

Ja sakni publicējat zem apakšceļa, iestatiet `VITE_BASE` (skat. `.env.example`) un veiciet `npm run build`. Variantu B joprojām atver ar `/rich/...` ceļiem uz tā paša hosta bāzi.

## Produktu attēli

`public/images/products/` — pēc kataloga izmaiņām: `npm run fetch-images`.

## Rich CSS avots

`scripts/rich-variant-source.css` ir B varianta pilnais stils; `npm run build:rich-css` ģenerē `src/variants/rich/theme.css` (apzīmēts ar `.variant-rich`, lai nesaplūstu ar A).
