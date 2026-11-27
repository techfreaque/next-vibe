import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  summary:
    "Na {{appName}} nájdeš {{modelCount}} četových modelov od {{providerCount}} vývojárskych tímov, od bežných až po otvorené a necenzurované. Úroveň filtrovania si vyberáš pre každý čet zvlášť. Kreditmi platíš podľa spotreby. Kód je otvorený a platformu môžeš prevádzkovať aj u seba.",
  intro:
    "Na čet, obrázky, video, hudbu, hlas aj prepis reči používaš tie isté kredity. K modelom sa dostaneš cez prehliadač, príkazový riadok, server MCP alebo API kompatibilné s OpenAI aj Anthropic. Platforma beží na otvorenom frameworku next-vibe v jazyku TypeScript. Z jednej definície koncového bodu vznikne webové rozhranie, príkaz CLI aj nástroj pre AI a MCP.",
  facts: {
    heading: "Základné údaje",
    models:
      "Modely: {{modelCount}} četových modelov od {{providerCount}} tímov (bežné: {{mainstream}}, otvorené: {{open}}, necenzurované: {{uncensored}}). Ďalších {{mediaCount}} modelov slúži na obrázky, video, hudbu, hlas a prepis reči.",
    free: "Kredity zadarmo každý mesiac: {{guest}} bez účtu, {{signedIn}} s bezplatným účtom a {{max}} po potvrdení odberu noviniek s bezplatným účtom. Platobnú kartu nepotrebuješ.",
    paid: "Platené programy: {{plans}}. Pri ročnej platbe zaplatíš v každom programe len za 11 mesiacov (Starter stojí {{subYearPrice}} ročne). Predplatitelia si môžu dokúpiť balík kreditov za {{packPrice}}. Počet kreditov v balíku: {{packCredits}}. Kredity z balíka neprepadnú.",
    planItem: "{{name}} za {{price}} mesačne zahŕňa {{credits}} kreditov",
    credit:
      "1 kredit = {{creditValue}}. Cenu za správu nájdeš na stránke každého modelu.",
    api: "API: OpenAI Chat Completions, OpenAI Responses a Anthropic Messages používajú spoločnú základnú adresu {{apiBaseUrl}}. S rovnakým kľúčom máš prístup k {{mediaCount}} multimediálnym modelom cez koncové body vo formáte OpenAI: /v1/images/generations, /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions, /v1/audio/translations, /v1/videos a /v1/music. Video a hudba sa spracúvajú asynchrónne. Prístup odomkne platený plán od {{subPrice}} mesačne alebo nákup kreditov. Pri pokuse použiť iba bezplatné kredity vráti API stav HTTP 402. Bez pevného limitu požiadaviek: spotreba sa účtuje za každé volanie z kreditov, s veľkorysou ochranou proti zneužitiu.",
    uncensored:
      "Necenzurovaná úroveň zahŕňa dva druhy modelov. Modely s odstráneným mechanizmom odmietania odpovedí vznikli úpravou bežných modelov. Iné, napríklad UncensoredLM, sa od začiatku trénujú aj na knihách a dokumentoch zakázaných v hlavnom prúde internetu, a preto vyjadrujú aj protichodné politické názory. Na vstup do tejto úrovne stačí raz potvrdiť vek aspoň 18 rokov.",
    openSource:
      "Otvorený kód: aplikácia používa licenciu MIT a jadro frameworku next-vibe licenciu GPL-3.0. Zdrojový kód: {{repoUrl}}",
    referral:
      "Program odporúčaní: za platby odporučených používateľov pravidelne získavaš províziu {{direct}} %. Ďalších {{upline}} % sa rozdeľuje medzi {{levels}} úrovní sprostredkovateľov. Odmenu si môžeš vybrať v kreditoch, BTC alebo USDC. Minimálna suma na výplatu je {{minPayout}}.",
    languages:
      "Jazyky webu: angličtina ({{en}}), nemčina ({{de}}), poľština ({{pl}}), francúzština ({{fr}}), taliančina ({{it}}), španielčina ({{es}}) a slovenčina ({{sk}}).",
  },
  pages: {
    heading: "Hlavné stránky",
    models: "Modely",
    modelsDesc:
      "pri každom modeli nájdeš cenu za správu, veľkosť kontextu, úroveň filtrovania aj priame porovnania",
    pricing: "Cenník",
    pricingDesc:
      "bezplatné kredity, štyri programy predplatného a jednorazové doplnenie kreditov",
    api: "Dokumentácia API",
    apiDesc:
      "základná adresa URL, autentifikácia, koncové body pre čet a médiá aj ukážky kódu",
    blog: "Blog",
    blogDesc: "návody, porovnania modelov a poznámky z vývoja",
    partners: "Partneri",
    partnersDesc:
      "program pre tvorcov, vydavateľov newsletterov a správcov katalógov",
    earn: "Program odporúčaní",
    earnDesc: "ako sa počítajú provízie a vyplácajú odmeny",
    selfHost: "Vlastná inštalácia",
    selfHostDesc: "spusti si vlastnú inštanciu na svojom hardvéri",
    framework: "Framework next-vibe",
    frameworkDesc: "otvorené technológie, na ktorých beží {{appName}}",
    refusalIndex: "Index odmietnutí",
    refusalIndexDesc:
      "každý týždeň tie isté otázky pre všetky modely. Ktoré odpovedajú priamo, ktoré sa vykrúcajú a ktoré odpoveď odmietnu?",
    skills: "Zručnosti",
    skillsDesc:
      "hotoví špecialisti a postavy s vlastnými pokynmi, modelom a nástrojmi",
    help: "Pomoc",
    helpDesc: "časté otázky a kontakt",
  },
  compare: {
    heading: "Porovnania",
  },
  blog: {
    heading: "Články na blogu",
  },
  optional: {
    heading: "Voliteľné",
    full: "Úplná verzia",
    fullDesc: "obsah tohto súboru aj s úplným zoznamom modelov",
    sitemap: "Mapa webu",
    sitemapDesc: "všetky verejné stránky vo všetkých jazykoch",
    about: "O nás",
    privacy: "Ochrana osobných údajov",
    terms: "Podmienky používania",
    imprint: "Údaje o prevádzkovateľovi",
  },
  full: {
    chatHeading: "Četové modely",
    chatIntro:
      "Aktuálne četové modely. Cena za správu vychádza z bežnej výmeny správ ({{inputTokens}} vstupných a {{outputTokens}} výstupných tokenov) u najlacnejšieho poskytovateľa.",
    chatLine:
      "{{lab}}, {{tier}}. Kontext v tokenoch: {{context}}. Približná cena za správu v kreditoch: {{credits}}",
    legacyHeading: "Staršie četové modely, ktoré sú stále k dispozícii",
    legacySuccessor: "nástupnícky model: {{successor}}",
    mediaHeading: "Multimediálne modely",
    mediaLine: "{{lab}}, {{type}}",
    mediaTypes: {
      image: "generovanie obrázkov",
      video: "generovanie videa",
      audio: "generovanie hudby",
      tts: "prevod textu na reč",
      stt: "prepis reči na text",
    },
  },
};
