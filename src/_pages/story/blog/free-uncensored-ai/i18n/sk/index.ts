import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "AI bez cenzúry zadarmo: limity a súkromie (2026)",
    description:
      "Možnosti AI bez cenzúry zadarmo: Venice, uncensored.ai, FreedomGPT, Gab AI, NanoGPT, OpenRouter, LM Studio, Ollama a {{appName}}. Limity a filtre.",
    category: "Návod",
    imageAlt: "Porovnanie bezplatných služieb AI bez cenzúry",
    keywords:
      "AI bez cenzúry zadarmo, bezplatný čet bez filtra, čet s AI bez cenzúry, AI bez registrácie zadarmo, bezplatná AI s menšími obmedzeniami, četbot bez cenzúry zadarmo, neobmedzená AI bez cenzúry, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Návod",
    readTime: "8 min čítania",
    title: "AI bez cenzúry zadarmo. Čo dostaneš bez platby.",
    subtitle:
      "{{appName}} a ďalšie bezplatné možnosti ({{count}}). Prešli sme ich ceny, filtre a zásady súkromia vrátane limitov, ktoré na úvodnej stránke nenájdeš.",
  },
  intro: {
    lead: "Zadarmo a bez cenzúry, sľubuje množstvo webov. Potom však príde denný limit po troch odpovediach, prístup len k základnému modelu, overenie e-mailu pred pridelením kreditov alebo sťahovanie 40 GB.",
    p2: "Toto v jednotlivých službách skutočne dostaneš zadarmo. Údaje z vlastných stránok poskytovateľov sme overili k {{date}}. Od niektorých modely kupujeme a ponúkame ich vo svojom čete. Keď zadarmo ponúkajú viac ako my, uvádzame to.",
  },
  short: {
    title: "Stručná odpoveď",
    intro: "Tri veci, ktoré sa oplatí vedieť na začiatok.",
    local:
      "Lokálna AI nemá poplatok za správy ani limit. Ollama či LM Studio bežia na tvojom počítači. Potrebuješ však vlastný hardvér.",
    hosted:
      "Bezplatná hostovaná AI bez cenzúry má vždy nejaký limit. Počet odpovedí denne, kredity na mesiac alebo prístup k jedinému základnému modelu.",
    us: "Na {{appName}} dostaneš {{guestCredits}} kred. zadarmo mesačne bez účtu. Platí pre všetkých {{modelCount}} modelov vrátane {{uncensored}} modelov bez cenzúry.",
  },
  catch: {
    title: "Kde má bezplatná AI háčik",
    intro: "Päť vecí, ktoré si skontroluj.",
    limit:
      "Limit: Denný prídel často minieš po pár správach. V dlhom čete sa ráta každá odpoveď.",
    models:
      "Modely: Mnohé bezplatné plány ponúkajú jediný základný alebo vlastný model. Výkonnejšie modely vyžadujú predplatné.",
    account:
      "Účet: Niektoré služby chcú overený e-mail ešte pred pripísaním kreditov. Iné môžeš používať hneď.",
    data: "Údaje: Aj bezplatná služba môže ukladať údaje. Over si, čo zaznamenáva a či na četoch trénuje modely.",
    hardware:
      "Hardvér: Za lokálne správy nepriplácaš. Výkonnejšie modely však vyžadujú veľa pamäte a silnú grafickú kartu.",
    callout:
      "Hostovaný model vidí každé zadanie, či zaň platíš alebo nie. Zadanie zostáva v zariadení iba pri lokálnom modeli.",
  },
  table: {
    title: "Všetky bezplatné možnosti vedľa seba",
    intro:
      "Na telefóne posúvaj tabuľku do strán. Údaje sme overili na stránkach poskytovateľov a dátum je pri každej položke. Údaje o {{appName}} sa čítajú priamo z aktuálnej konfigurácie.",
  },
  us: {
    title: "Čo dostaneš na {{appName}} zadarmo",
    intro:
      "Jeden čet, {{modelCount}} modelov a jeden zostatok. Bezplatný prídel môžeš použiť na ktorýkoľvek model.",
    guest:
      "Bez účtu: {{guestCredits}} kred. zadarmo mesačne. Stačí otvoriť čet a písať. E-mail ani telefón nepotrebuješ.",
    account:
      "Bezplatný účet: {{freeCredits}} kred. mesačne alebo {{maxCredits}} pri odbere noviniek. Čety máš dostupné na viacerých zariadeniach.",
    models:
      "Prídel platí pre všetky modely: Claude, GPT, Gemini, otvorené modely aj {{uncensored}} modelov bez cenzúry. {{ownModel}} sme trénovali na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Vyjadruje aj odlišné politické názory.",
    consent:
      "Pri prvom použití modelu bez cenzúry raz potvrdíš, že máš aspoň 18 rokov.",
    after:
      "Po minutí kreditov počkaj do ďalšieho mesiaca alebo vyber plán od {{subPrice}} mesačne.",
    weak: "Čo bezplatný plán obmedzuje: platí sa kreditmi podľa spotreby. Počet správ závisí od ceny modelu. Odhad nájdeš na jeho stránke.",
    hubLink: "Všetky modely bez cenzúry, ich kontext a ceny",
    ownLink: "Pozrieť si {{ownModel}}",
  },
  list: {
    title: "Bezplatné možnosti: {{count}} služieb podrobne",
    intro:
      "Čo služba ponúka zadarmo, aké má filtre a ako nakladá s tvojimi četmi.",
    heading: "{{number}}. {{name}}: {{kind}}",
    free: "Zadarmo:",
    filter: "Filter:",
    privacy: "Súkromie:",
    con: "Háčik:",
    forWho: "Vyber si, ak:",
    checked: "Overené k {{date}}.",
    versusLink: "{{appName}} a {{name}}: úplné porovnanie",
    visit: "Navštíviť {{name}}",
  },
  local: {
    title: "Lokálne modely bez limitu správ",
    intro: "Ollama aj LM Studio bežia na tvojom počítači.",
    cost: "Cena: Bez poplatku za správu a bez denného limitu. Zaplatíš za hardvér a elektrinu.",
    quality:
      "Kvalita: Určuje ju výkon tvojho zariadenia. Malé modely bežia takmer na každom notebooku. Veľké potrebujú veľa grafickej pamäte.",
    privacy: "Súkromie: Zadania neopúšťajú tvoje zariadenie.",
    link: "Modely bez cenzúry online aj bez výkonnej grafickej karty",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá bezplatná AI bez cenzúry je najlepšia?",
      a: "Záleží na tvojom zariadení. Na výkonnom počítači je Ollama alebo LM Studio zadarmo a bez limitu. V prehliadači ponúka {{appName}} mesačne {{guestCredits}} kred. na každý model, Venice 10 textových zadaní denne na základné modely a uncensored.ai 3 odpovede denne.",
    },
    noAccount: {
      q: "Existuje bezplatná AI bez cenzúry aj bez registrácie?",
      a: "Áno. Na {{appName}} stačí otvoriť anonymný čet a písať. Účet ani e-mail netreba. FreedomGPT tiež uvádza, že môžeš začať bez karty a účtu. Gab AI pridelí bezplatné kredity až po overení e-mailu.",
    },
    unlimited: {
      q: "Existuje bezplatná AI bez cenzúry a bez limitov?",
      a: "Lokálne áno. Pri Ollama a LM Studio na vlastnom hardvéri sa správy neúčtujú. Každý bezplatný hostovaný plán má limit, pretože niekto musí platiť za grafické karty.",
    },
    language: {
      q: "Odpovie AI bez cenzúry v mojom jazyku?",
      a: "Veľké modely odpovedajú v jazyku, v ktorom píšeš. Ak sa opýtaš po nemecky, francúzsky alebo poľsky, zvyčajne v tom jazyku dostaneš aj odpoveď. Menšie lokálne modely si vyskúšaj. Niektoré pri dlhších odpovediach prejdú do angličtiny.",
    },
    api: {
      q: "Existuje bezplatné API bez cenzúry?",
      a: "Lokálne áno. Ollama aj LM Studio na tvojom zariadení spustia server kompatibilný s OpenAI. OpenRouter dáva 50 bezplatných požiadaviek denne na svoje bezplatné modely, kde je málo modelov bez cenzúry. Na {{appName}} odomkne API ľubovoľný platený nákup. Plány začínajú na {{apiSubPrice}} mesačne. Bezplatné kredity sú na čet.",
    },
    legal: {
      q: "Je AI bez cenzúry legálna?",
      a: "Na obsah četu sa vzťahujú tie isté zákony ako mimo neho a platia aj naše podmienky. Tento text nie je právne poradenstvo. Pri citlivých údajoch si prečítaj zásady súkromia poskytovateľa alebo pracuj lokálne.",
    },
    noSignUpLink: "Ako funguje bezplatný čet s AI bez registrácie",
    kindsLink: "Abliterácia, doladenie a vlastný svetonázor: tri druhy modelov",
  },
  cta: {
    title: "Vyskúšaj zadarmo bez účtu",
    subtitle:
      "{{guestCredits}} kred. zadarmo mesačne na všetky modely. Otvor anonymný čet a polož prvú otázku.",
    start: "Četovať zadarmo",
    models: "Pozrieť si modely bez cenzúry",
  },
};
