import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Modely AI",
    title: "Zmeny modelov AI: nové, vyradené, ceny | {{appName}}",
    description:
      "Datované zmeny modelov na {{appName}}: prírastky, vyradenia, náhrady, ceny a kategórie. Priamo z registra a dostupné aj cez RSS.",
    imageAlt: "Prehľad zmien modelov na {{appName}}",
    keywords:
      "zmeny modelov AI, nové modely AI, ceny jazykových modelov, vyradené modely AI, aktualizácie modelov bez cenzúry, {{appName}}",
  },
  breadcrumb: {
    models: "Modely AI",
    changelog: "Prehľad zmien",
  },
  hero: {
    eyebrow: "Aktualizované {{date}}",
    title: "Zmeny modelov",
    subtitle:
      "Ktoré modely pribudli, ktoré sme presunuli do archívu a ktoré zlacneli. Každý záznam má dátum a pochádza priamo z nášho registra modelov.",
    rss: "Kanál RSS",
    allModels: "Všetky modely",
  },
  stats: {
    added: "Pridané modely",
    legacy: "Presuny do archívu",
    repriced: "Zmeny cien",
    since: "Sledujeme od",
  },
  badge: {
    replaces: "Nástupca",
    added: "Novinka",
    legacy: "Archív",
    restored: "Obnovený",
    repriced: "Cena",
    tier: "Kategória",
    removed: "Vyradené",
  },
  title: {
    added: "Nový model",
    legacy: "Presun do archívu",
    restored: "Späť v katalógu",
    repriced: "Zmena ceny",
    tier: "Zmena kategórie",
    removed: "Vyradenie",
  },
  summary: {
    added: "Nový model v kategórii {{tier}}.",
    legacy: "Model je v archíve a už sa nezobrazuje vo výbere modelov.",
    replacedBy: "Nahrádza ho",
    replaces: "Nahradil",
    restored: "Model je späť v aktívnom katalógu.",
    tier: "Presun z kategórie {{from}} do kategórie {{to}}.",
    removed: "Model už neponúkame.",
    priceUp: "{{metric}}: nárast o {{percent}}",
    priceDown: "{{metric}}: pokles o {{percent}}",
  },
  metric: {
    input: "Cena vstupu",
    output: "Cena výstupu",
    image: "Cena za obrázok",
    second: "Cena za sekundu",
    clip: "Cena za klip",
    character: "Cena za znak",
    fixed: "Cena za správu",
  },
  list: {
    heading: "Všetky zmeny",
    empty: "Zatiaľ sme nezaznamenali žiadne zmeny.",
    count: "Počet zmien: {{count}}",
  },
  about: {
    heading: "Odkiaľ berieme údaje",
    body: "Každý záznam vzniká z histórie verzií nášho registra modelov. Tie isté súbory riadia výber modelov, ceny aj účtovanie. Zoznam sa vytvára automaticky. Dátum označuje deň, keď sa zmena dostala do registra.",
    prices:
      "Pri zmene ceny porovnávame najlacnejšiu verejne dostupnú cestu cez poskytovateľa pred zmenou a po nej. Zmenu môže spôsobiť nová sadzba poskytovateľa alebo pridanie či odstránenie lacnejšej cesty.",
    start:
      "Zmeny sledujeme od {{date}}. Modely dostupné už vtedy nemajú záznam o pridaní.",
  },
  model: {
    heading: "Čo sa zmenilo",
    intro: "Zmeny modelu {{model}} s dátumom priamo z nášho registra.",
    none: "Od začiatku sledovania ({{date}}) sme pri modeli {{model}} nezaznamenali žiadne zmeny.",
    link: "Úplný prehľad zmien modelov",
  },
  index: {
    link: "Zmeny modelov",
    hint: "Nové a archivované modely aj zmeny cien podľa dátumu",
  },
  feed: {
    title: "Zmeny modelov na {{appName}}",
    description:
      "Nové a archivované modely AI aj zmeny cien na {{appName}} s dátumom, priamo z nášho registra modelov.",
  },
};
