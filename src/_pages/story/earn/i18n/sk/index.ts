import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Zarábaj s {{appName}} | Opakované provízie za odporúčania",
    category: "Zárobok",
    description:
      "Odporuč {{appName}} a získaj {{directPct}} z každej platby odporúčaných používateľov, kým platia. Zverejni zručnosť a zarábaj {{skillBonusPct}} z platieb používateľov, ktorých cez ňu privedú iní.",
    imageAlt: "Zarábaj s {{appName}}",
    keywords:
      "{{appName}}, program odporúčaní, partnerský program, opakované provízie, zručnosti AI, pasívny príjem",
  },
  hero: {
    eyebrow: "Zárobok",
    title: "Odporuč službu, ktorú používaš. Zarábaj každý mesiac.",
    subtitle:
      "Z každej platby ľudí, ktorých privedieš, dostaneš {{directPct}}. Provízia sa opakuje každý mesiac, v ktorom zaplatia. Zverejni zručnosť a získaj {{skillBonusPct}}, keď cez ňu iný člen privedie nového používateľa.",
    ctaPrimary: "Získať svoj odkaz",
    ctaSecondary: "Vytvoriť zručnosť",
  },
  start: {
    label: "Od začiatku",
    title: "Tri kroky. Stačí aj jeden známy.",
    intro:
      "Nepotrebuješ veľké publikum. Stačí jeden priateľ, ktorý zostane. Províziu dostaneš za každý mesiac, v ktorom zaplatí.",
    step1: {
      title: "Získaj svoj odkaz",
      body: "Vytvor si bezplatný účet a otvor stránku odporúčaní. Osobný odkaz bude pripravený za pár sekúnd.",
    },
    step2: {
      title: "Zdieľaj odkaz alebo zručnosť",
      body: "Pridaj odkaz do četu, súboru README alebo videa. Môžeš aj zverejniť zručnosť. Jej zdieľací odkaz automaticky obsahuje tvoje odporúčanie.",
    },
    step3: {
      title: "Zarábaj z každej platby",
      body: "Dostaneš {{directPct}} z každej platby odporúčaných ľudí. Keď iný člen cez tvoju zručnosť privedie používateľa, dostaneš {{skillBonusPct}} aj z platieb tohto používateľa.",
    },
  },
  split: {
    label: "Rozdelenie provízií",
    title: "Ako sa delí každá platba",
    perUser: "Na používateľa pri cene {{examplePrice}} mesačne",
  },
  facts: {
    direct: "z platieb odporúčaných používateľov",
    skill: "pre autora zručnosti, ktorú zdieľajú ďalší",
    payout: "minimálna suma výberu v kryptomene",
    hours: "spracovanie výplaty v kryptomene",
    hoursValue: "{{cryptoPayoutHours}} h",
  },
  cta: {
    title: "Od tvojho odkazu ťa delí jedno kliknutie.",
    subtitle:
      "Účet je bezplatný a bez minimálnej útraty. Po uplynutí lehoty na vrátenie platby ({{holdDays}} dní) sa zárobok zmení na kredity. Vybrať si ho môžeš v BTC alebo USDC od {{minPayout}}.",
    primary: "Získať svoj odkaz",
    secondary: "Prečítať príručku pre začiatočníkov",
    partners: "Pre tvorcov a odberové zoznamy",
  },
};
