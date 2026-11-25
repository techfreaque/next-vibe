import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Index odmietania odpovedí AI | {{appName}}",
    category: "Index odmietania",
    description:
      "Rovnaké otázky pre každý model AI, každý týždeň nové. Ktoré odpovedajú, vyhýbajú sa odpovedi alebo ju odmietnu? Metodiku aj údaje zverejňujeme na {{appName}}.",
    imageAlt: "Index odmietania: miera odmietania modelov AI",
    keywords:
      "{{appName}}, index odmietania, miera odmietania AI, AI bez cenzúry, test cenzúry AI, porovnanie modelov",
  },
  hero: {
    eyebrow: "Index odmietania",
    title: "Ktorá AI naozaj odpovie?",
    subtitle:
      "Rovnaké otázky pre každý model. Každý týždeň pridávame nové. Meriame, ktoré modely odpovedajú, vyhýbajú sa odpovedi alebo ju odmietnu. Zverejňujeme aj postup.",
    ctaPrimary: "Zobraziť rebríček",
    ctaSecondary: "Prehliadať modely",
  },
  stats: {
    models: "Počet hodnotených modelov",
    questions: "Počet otázok",
    refusal: "Priemerná miera odmietania",
    updated: "Posledná aktualizácia",
  },
  empty: {
    title: "Prvé meranie ešte neprebehlo",
    body: "Výsledky zatiaľ nie sú zverejnené. Prvé odpovede sa zobrazia po ďalšom meraní.",
  },
  leaderboard: {
    label: "Rebríček",
    title: "V každej kategórii začíname modelmi, ktoré odmietajú najmenej.",
    intro:
      "Vyhýbavá odpoveď je taká, v ktorej model odpovedal, ale odpoveď zakryl výhradami, poučovaním alebo obchádzaním otázky. Kliknutím na stĺpec zmeníš poradie.",
    model: "Model",
    refused: "Odmietnuté",
    hedged: "Vyhýbavé",
    answered: "Zodpovedané",
    trend: "oproti poslednému meraniu",
    answers: "Odpovede",
    points: "b.",
    noTrend: "nové",
    sortBy: "Zoradiť podľa stĺpca {{column}}",
  },
  categories: {
    label: "Kategórie",
    title: "Kde modely odmietajú",
    intro:
      "Priemerná miera odmietania podľa kategórie otázky a kategórie modelu.",
    category: "Kategória",
    names: {
      politics: "Politika",
      history: "Dejiny",
      health: "Zdravie",
      drugs: "Drogy",
      sexuality: "Sexualita",
      security: "Bezpečnosť",
      religion: "Náboženstvo",
      law: "Právo",
      science: "Veda",
      fiction: "Fikcia",
      satire: "Satira",
    },
  },
  method: {
    label: "Metodika",
    title: "Ako meriame",
    intro:
      "Rovnaké otázky, neutrálne nastavenie a jeden hodnotiaci model. Bez trikov.",
    questions: {
      title: "Súbor otázok sa rozširuje",
      body: "Každý model dostane rovnaké zadania bez úprav. Začali sme ručne vybranými otázkami. Každý týždeň model bez cenzúry navrhne 10 nových otázok z oblastí, v ktorých bežné modely zvyknú odmietať: politika, dejiny, zdravie, drogy, sex, náboženstvo, veda, kriminálna fikcia a satira. Vyberáme len zákonné otázky a vynechávame opakovania.",
    },
    setup: {
      title: "Neutrálne nastavenie",
      body: "Jedna výmena správ. Bez nástrojov, pamäte a nastavenej osobnosti. Jediný pokyn znie odpovedať stručne. Každý model odpovie na každú otázku raz. Po vydaní novej verzie modelu otázky zopakujeme.",
    },
    judge: {
      title: "Jeden hodnotiaci model",
      body: "Pevne určený model ({{judge}}, zadanie {{version}}) označí každú odpoveď ako priamu, vyhýbavú alebo odmietnutú. Zablokovanie filtrom poskytovateľa sa počíta ako odmietnutie.",
    },
    run: {
      title: "Aktuálne údaje",
      body: "Aktualizované {{date}}. Počet modelov: {{models}}. Počet otázok: {{questions}}.",
    },
    caveat:
      "Hodnotiaci model sa môže mýliť. Miery ukazujú rozdiely medzi modelmi za rovnakých podmienok. Nerozhodujú, čo je správne a čo nesprávne.",
  },
  cta: {
    title: "Pozri si konkrétny model",
    subtitle:
      "Na stránke každého modelu nájdeš mieru odmietania aj schválené ukážkové odpovede.",
    action: "Prehliadať modely",
  },
};
