import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "AI na písanie bez cenzúry: temná beletria a dlhé rukopisy | {{appName}}",
    description:
      "AI na romány, temnú beletriu a scény pre dospelých. Ktoré modely nezjemňujú dej, koľko strán spracujú a koľko stojí jedna scéna.",
    category: "Sprievodca písaním",
    imageAlt: "AI bez cenzúry píše scénu do temného príbehu",
    keywords:
      "AI na písanie bez cenzúry, AI na príbehy bez filtra, generátor príbehov bez cenzúry, písanie s AI bez obmedzení, AI na príbehy pre dospelých, AI na temnú beletriu, písanie románu s AI, tvorivé písanie bez cenzúry, beletria pre dospelých, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Sprievodca písaním",
    readTime: "8 min čítania",
    title: "AI na písanie bez cenzúry. Príbeh zostane taký, ako ho chceš.",
    subtitle:
      "Modely bez cenzúry ({{count}}) píšu monológy zloduchov, násilie aj scény pre dospelých bez prikrášľovania. Z registra zistíš, koľko strán rukopisu každý udrží v kontexte.",
  },
  intro: {
    lead: "Požiadaš o monológ zloducha. Dostaneš prejav o láskavosti. Napíšeš vojnovú scénu. AI ju ukončí pred prvým výstrelom. Bežní asistenti sú nastavení tak, aby odpovede vyhovovali každému. Beletria tak nefunguje.",
    p2: "Potrebuješ napísať temnú kapitolu? Pozri sa, ktoré modely na {{appName}} ju napíšu bez prikrášľovania, do ktorých sa zmestí celý rukopis a ktorý má hlas, aký v bežných modeloch nenájdeš. Potom sa pustíme do práce scénu po scéne.",
  },
  softening: {
    title: "Ako bežná AI zjemňuje tvoje príbehy",
    intro:
      "Tvoj román nikto nezakáže. Len bude o čosi horší. Pri písaní sa stretneš so štyrmi typickými reakciami.",
    refuse:
      "Odmietnutie. Model scénu vôbec nenapíše, lebo je príliš násilná, sexuálna alebo krutá.",
    aside:
      "Poučovanie. Model scénu napíše a potom pridá odsek o tom, že násilie je zlé.",
    fade: "Strih do tmy. Príbeh sa zastaví presne tam, kde sa mala scéna začať.",
    flatten:
      "Zloduch bez ostrých hrán. Každý protivník sa správa rozumne a za každú krutosť sa ospravedlní. Konflikt sa vytratí.",
    callout:
      "Aj temnota dáva príbehu zmysel. Ak model nedokáže napísať najhorší okamih postavy, nedokáže napísať ani jej vykúpenie.",
  },
  models: {
    title: "Modely bez cenzúry na písanie beletrie ({{count}})",
    intro:
      "Všetky aktuálne modely bez cenzúry na {{appName}} označené na tvorivé písanie alebo hranie temných rolí, od najlacnejšieho. Počet strán ukazuje, koľko textu sa naraz zmestí do kontextu: tvoje poznámky, doterajšie kapitoly aj nová scéna.",
    footnote:
      "Strany sú približný prepočet kontextového okna na tlačené strany prózy. Cena za správu vychádza z referenčnej výmeny u najlacnejšieho poskytovateľa. Dlhé scény a dlhé čety stoja viac.",
  },
  table: {
    model: "Model",
    context: "Kontext",
    pages: "Strany v kontexte",
    pagesValue: "Približne {{pages}}",
    strengths: "Silné stránky",
    price: "Za správu",
    chat: "Vyskúšať",
    chatLink: "Písať s {{model}}",
  },
  picks: {
    title: "Vyber model podľa toho, čo píšeš",
    intro:
      "Každá fáza písania si žiada niečo iné. Tu sú naše tipy pre jednotlivé úlohy. Všetky čísla pochádzajú z registra modelov.",
    dark: {
      title: "Temné a tabuizované scény: {{model}}",
      body: "Model je označený na hranie temných rolí a tvorivé písanie. Drží sa scény, aj keď je násilná, krutá alebo explicitná, a na konci nepridáva poučenie. Do kontextu sa zmestia strany v rozsahu približne {{pages}}. {{price}} za správu.",
    },
    long: {
      title: "Dlhé rukopisy: {{model}}",
      body: "Spomedzi modelov na beletriu má najväčší kontext a zároveň najnižšiu cenu: {{context}} tokenov, v prepočte približne {{pages}} strán. Vlož osnovu, profily postáv a posledné kapitoly a model udrží dejové línie pokope. {{price}} za správu.",
    },
    voice: {
      title: "Hlas mimo hlavného prúdu: {{model}}",
      body: "Trénoval sa na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory. Hodí sa na postavy, ktorých svetonázor má znieť inak než firemná tlačová správa. Kapacita v stranách je približne {{pages}}, preto zadávaj po jednej scéne. {{price}} za správu.",
    },
    polish: {
      title: "Stavba príbehu a úpravy: {{model}}",
      body: "Špičkový základný model s odstránenými mechanizmami odmietania. Vie dobre uvažovať, preto ho použi na opravu dier v deji, úpravu tempa a redigovanie temných kapitol po vetách. Kapacita v stranách je približne {{pages}}. {{price}} za správu.",
    },
    draft: {
      title: "Lacná prvá verzia: {{model}}",
      body: "Najlacnejší zo zvyšných modelov na beletriu. Vyskúšaj na ňom nápady, nechaj si napísať desať úvodov a jeden si nechaj. Kapacita v stranách je približne {{pages}}. {{price}} za správu.",
    },
  },
  workflow: {
    title: "Ako sa dopracovať k hotovej knihe",
    intro: "Ber AI ako spoluautora. Ty určuješ smer.",
    outline: {
      title: "Začni podkladmi",
      body: "Do prvej správy vlož osnovu, profily postáv a poznámky o tóne. S písaním ešte počkaj. Najprv nech model zhrnie, čo pochopil.",
    },
    scene: {
      title: "Zadávaj po jednej scéne",
      body: "Urči uhol pohľadu, hlavný moment a dĺžku. Keď píšeš po scénach, ľahšie udržíš jednotný hlas aj nízke náklady.",
    },
    switch: {
      title: "Vymeň model aj uprostred kapitoly",
      body: "Drsnú scénu rozpíš s jedným modelom a uprav s druhým. Pri prepnutí ostane história četu zachovaná.",
    },
    revise: {
      title: "Prepíš text vlastným hlasom",
      body: "Vypýtaj si viac možností. Vyber si vety, prepíš ich a pošli modelu späť. Kniha zostáva tvoja.",
    },
  },
  skills: {
    title: "Zručnosti na písanie beletrie",
    intro:
      "Zručnosť nastaví autorskú rolu aj model jedným kliknutím. Použi ju rovno alebo si vytvor kópiu a uprav ju.",
    writer:
      "Autor bez cenzúry: temná beletria a scény pre dospelých bez prikrášľovania",
    storyteller: "Rozprávač: dlhé príbehy s pevnou stavbou a tempom",
    roleplay: "Radšej príbeh hráš? Hraj roly s AI bez filtra.",
  },
  limits: {
    title: "Čo tu znamená písanie bez cenzúry",
    intro: "Voľnosť pri písaní beletrie má svoje hranice.",
    adult:
      "Pri modeloch bez cenzúry stačí raz potvrdiť vek 18+. Potom je na tebe, ako v beletrii spracuješ témy pre dospelých medzi dospelými postavami.",
    terms:
      "Naše podmienky naďalej zakazujú nezákonný obsah, obťažovanie a čokoľvek, čo má ublížiť skutočným ľuďom.",
    rights:
      "Všetky práva k textu si podľa našich podmienok ponechávaš. Na tvoj text si nenárokujeme vlastníctvo.",
    incognito:
      "Inkognito čety ostávajú v tvojom prehliadači. Poskytovateľ modelu však vidí každé zadanie, aby naň mohol odpovedať.",
    kindsLink:
      "Ako sa líšia abliterované modely, doladené modely a modely s vlastným svetonázorom",
  },
  pairs: {
    title: "Porovnaj modely na beletriu",
    intro: "Porovnaj kontext, cenu a filter, kým minieš prvý kredit.",
    link: "{{a}} a {{b}}",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá AI bez cenzúry je najlepšia na beletriu?",
      a: "Závisí od úlohy. Model doladený na hranie temných rolí zvládne najťažšie scény, do modelu s kontextom milión tokenov sa zmestí celý rukopis a {{ownModel}} prináša svetonázor, aký v bežných modeloch nenájdeš. V jednom čete na {{appName}} môžeš prepínať medzi všetkými modelmi na beletriu ({{count}}).",
    },
    free: {
      q: "Dá sa písať príbehy s AI bez cenzúry zadarmo?",
      a: "Bez účtu máš každý mesiac k dispozícii {{guestCredits}} kreditov zdarma, s bezplatným účtom {{freeCredits}}, {{maxCredits}} pri odbere noviniek. Pri lacnejších modeloch to vystačí na slušný počet scén. Na dlhšie projekty sú tu plány od {{subPrice}} mesačne.",
    },
    adult: {
      q: "Dokáže AI bez cenzúry písať explicitnú beletriu pre dospelých?",
      a: "Áno, po jednorazovom potvrdení veku 18+. Modely bez cenzúry napíšu aj explicitné scény medzi dospelými bez strihu do tmy. Nezákonný obsah naše podmienky zakazujú bez ohľadu na to, čo model dokáže napísať.",
    },
    novel: {
      q: "Dokáže si AI udržať prehľad o celom románe?",
      a: "Najväčšie modely udržia naraz približne {{maxPages}} strán. To stačí na osnovu, profily postáv a veľa kapitol. Pri menších modeloch si v dlhom projekte priebežne zhrň dej, lebo na prvé scény zabúdajú.",
    },
    rights: {
      q: "Komu patrí text, ktorý mi napíše AI?",
      a: "Na {{appName}} patrí tebe. Podľa našich podmienok si ponechávaš všetky práva k svojim rozhovorom a na tvoj obsah si nenárokujeme vlastníctvo. Pri publikovaní si over miestne pravidlá autorského práva pre diela vytvorené s pomocou AI.",
    },
    kinds: {
      q: "Hodí sa na beletriu viac abliterovaný model alebo UncensoredLM?",
      a: "Abliterované modely si zachovávajú schopnosti aj svetonázor bežných modelov, z ktorých vychádzajú. Vďaka odstráneným mechanizmom odmietania scénu jednoducho napíšu. {{ownModel}} sa trénoval na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory. Má menší kontext, približne {{ownPages}} strán.",
    },
    bestLink: "Najlepšie LLM bez cenzúry podľa úlohy",
    jailbreakLink:
      "Prečo obchádzanie obmedzení ChatGPT pri písaní beletrie stále zlyháva",
    chatLink: "Čet s AI bez cenzúry v prehliadači",
  },
  cta: {
    title: "Napíš kapitolu, ktorú odkladáš.",
    subtitle:
      "Každý mesiac máš {{guestCredits}} kreditov zdarma aj bez účtu. Vyber si model na beletriu a kedykoľvek ho vymeň.",
    start: "Začni písať",
    models: "Porovnať všetky modely",
  },
};
