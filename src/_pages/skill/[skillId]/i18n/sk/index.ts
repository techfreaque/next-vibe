import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}}: {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    category: "Zručnosti AI",
    keywords: "zručnosť AI, {{name}}, {{appName}}, necenzurovaný čet s AI",
  },
  breadcrumb: {
    skills: "Zručnosti",
  },
  hero: {
    tryGeneric: "Vyskúšať zručnosť",
  },
  publishedBy: "Zverejnil používateľ {{name}}",
  madeBy: "Autor: {{name}}",
  startChat: "Začať čet",
  chatWith: "Četovať s {{name}}",
  guest: "Bez registrácie",
  chatModel: "Četový model",
  facts: {
    runsOn: "Používa model",
    content: "Obsah",
    perMessage: "Za správu",
    versions: "Verzie",
    goodAt: "S čím pomôže",
    keepInMind: "Čo treba vedieť",
  },
  prompts: {
    intro: "Každá možnosť otvorí čet s {{name}} a pripraví text na odoslanie.",
    start: "Vyber si zadanie na úvod",
  },
  story: {
    title: "O zručnosti {{name}}",
  },
  model: {
    credits: "{{cost}} kred.",
    creditsAbout: "pribl. {{cost}} kred.",
    fixedPrice: "{{cost}} kred. za správu",
    estimatedPrice: "Približne {{cost}} kred. za správu",
    free: "Správy zadarmo",
    perMessageHint:
      "Bežná správa má {{input}} vstupných a {{output}} výstupných tokenov. Cena závisí od dĺžky.",
    perMessageWithImageHint:
      "Bežná správa s jedným obrázkom má {{input}} vstupných a {{output}} výstupných tokenov. Cena závisí od dĺžky.",
  },
  actions: {
    shareEarn: "Zdieľať a získať odmenu",
    addToSkills: "Pridať medzi moje zručnosti",
    added: "Pridané medzi tvoje zručnosti",
    addFailed: "Pridanie sa nepodarilo. Skús to znova.",
  },
  tier: {
    mainstream:
      "{{name}} používa {{model}}, model veľkého vývojárskeho tímu s vlastnými bezpečnostnými filtrami. Citlivejšie zadania môže odmietnuť.",
    open: "{{name}} používa {{model}}, model s otvorenými váhami a miernejšími filtrami. Dokáže sa rozprávať o viacerých témach a otázky odmieta menej často ako modely veľkých vývojárov.",
    uncensored:
      "{{name}} používa {{model}}, ktorý je určený na rozhovory bez tematických filtrov. Pred prvou správou stačí raz potvrdiť vek aspoň 18 rokov.",
    ownWorldview:
      "Model {{model}} sa trénoval na knihách a dokumentoch, ktoré bežné internetové platformy zakazujú. {{name}} ti ponúkne aj politické názory mimo hlavného prúdu. Pred prvou správou stačí raz potvrdiť vek aspoň 18 rokov.",
    abliterated:
      "{{model}} vznikol z bežného modelu odstránením mechanizmu odmietania. {{name}} ti preto odpovie priamo a bez poučovania. Pred prvou správou stačí raz potvrdiť vek aspoň 18 rokov.",
    fineTuned:
      "Model {{model}} bol dotrénovaný tak, aby otázky bežne neodmietal. {{name}} ti odpovie aj tam, kde sa bežné modely odpovedi vyhnú. Pred prvou správou stačí raz potvrdiť vek aspoň 18 rokov.",
  },
  share: {
    text: "Poznáš niekoho, koho by {{name}} zaujala? Pošli mu odkaz a získaj podiel z jeho platieb.",
  },
  related: {
    similar: "Podobné zručnosti",
    moreFrom: "Ďalšie zručnosti od {{name}}",
  },
};
