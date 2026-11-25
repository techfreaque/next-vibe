import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Čet s AI zadarmo bez registrácie | {{appName}}",
    description:
      "Čet s AI bez účtu na {{appName}}. Bezplatné mesačné kredity, bežné aj necenzurované modely a história inkognito iba v prehliadači.",
    category: "Návod",
    imageAlt: "Čet s AI, ktorý spustíš bez registrácie",
    keywords:
      "čet s AI bez registrácie, AI bez účtu, anonymný čet s AI, AI bez prihlásenia, súkromný čet s AI, bezplatný čet, AI bez cenzúry a bez registrácie, anonymný režim, četbot bez e-mailu, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Návod",
    readTime: "6 min čítania",
    title: "Čet s AI zadarmo. Bez registrácie, e-mailu či čísla.",
    subtitle:
      "Mesačné kredity zadarmo: {{guestCredits}}. Na výber máš {{modelCount}} modelov a história v režime inkognito zostáva v prehliadači. Pozri si, aké hranice má anonymita.",
  },
  intro: {
    lead: "Chceš sa niečo spýtať. Četbot chce najprv e-mail, heslo, telefónne číslo a súhlas s cookies. Kým sa dostaneš dovnútra, na otázku už ani nemyslíš.",
    p2: "Na {{appName}} otvoríš čet a hneď píšeš. Tu zistíš, čo dostaneš bez účtu, čo u nás znamená anonymita a kedy sa oplatí bezplatný účet.",
  },
  guest: {
    title: "Čo získaš bez účtu",
    intro:
      "Bez registrácie získaš prístup k plnej službe s mesačným prídelom kreditov.",
    credits:
      "{{guestCredits}} kred. zadarmo každý mesiac. Účet ani platobnú kartu nepotrebuješ. Prídel sa obnovuje každý mesiac.",
    models:
      "Všetky četovacie modely v jednom výbere. Spolu {{modelCount}} z {{labCount}} laboratórií: bežné, otvorené aj necenzurované.",
    uncensored:
      "Aj modely bez cenzúry (spolu {{uncensored}}) po jednorazovom potvrdení veku 18+.",
    media:
      "Obrázky, videá, hudbu a hlas vytváraš za tie isté kredity. Počet modelov na obrázky: {{imageModels}}. Na video: {{videoModels}}.",
    mediaLink: "Tvoriť obrázky, videá a hudbu",
  },
  starters: {
    title: "Najlacnejšie modely na začiatok",
    intro:
      "Z nášho katalógu sme vybrali dva najlacnejšie textové modely z každej kategórie. S prídelom {{guestCredits}} kred. pri nich napíšeš najviac správ.",
    footnote:
      "Cena za správu vychádza z jednej referenčnej výmeny cez najlacnejšiu trasu. S modelom {{cheapestModel}} ti {{guestCredits}} kred. vystačí približne na {{guestMessages}} krátkych správ. Dlhé čety a odpovede stoja viac.",
  },
  table: {
    model: "Model",
    context: "Kontext",
    price: "Za správu",
    chat: "Vyskúšať",
    chatLink: "Četovať s {{model}}",
  },
  anonymous: {
    title: "Čo u nás znamená anonymita",
    intro:
      "Naše zásady ochrany súkromia presne určujú, ktoré údaje zostanú u teba a ktoré potrebujeme spracovať.",
    yesTitle: "Čo zostáva u teba",
    noEmail:
      "Nepotrebujeme tvoje meno, e-mail ani telefónne číslo, aby sme ti odpovedali.",
    incognito:
      "Anonymné čety sa ukladajú iba v tvojom prehliadači. Ak vymažeš údaje prehliadača, história zmizne.",
    trackers:
      "Bez sledovacích nástrojov tretích strán, reklamných pixelov aj snímania odtlačku prehliadača. Jediný súbor cookie od nás hovorí serveru, s ktorým prehliadačom komunikuje.",
    noTitle: "Kto musí správu spracovať",
    provider:
      "Poskytovateľ AI: Každá správa putuje cez náš server k poskytovateľovi modelu, ktorý musí vidieť zadanie, aby odpovedal. Tak funguje každá hostovaná AI.",
    media:
      "Vytvorené médiá: Obrázky, zvuk a video vytvorené bez účtu zostávajú na našich serveroch, aby si ich mohol zobraziť a stiahnuť. Ak si nevytvoríš účet, po 4 mesiacoch ich automaticky zmažeme.",
    network:
      "Sieť: Server vidí pripojenie z tvojho prehliadača rovnako ako na každom webe. Ak použiješ VPN, uvidíme adresu VPN.",
    callout:
      "Ak zadanie nesmie opustiť tvoje zariadenie, potrebuješ lokálny model alebo vlastný hosting. Hostovaný čet to nevie zaručiť.",
    policyLink: "Prečítať si zásady ochrany súkromia",
  },
  steps: {
    title: "Prvá odpoveď do minúty",
    intro: "Štyri kroky bez registračného formulára.",
    open: {
      title: "Otvoriť anonymný čet",
      body: "Čet otvoríš jedným kliknutím z ľubovoľnej stránky, rovno bez účtu.",
    },
    pick: {
      title: "Vyber si model",
      body: "Začni lacnejším modelom a kedykoľvek ho vymeň. História četu zostane zachovaná.",
    },
    confirm: {
      title: "Pri modeli bez cenzúry potvrď vek 18+",
      body: "Pri modeloch bez cenzúry stačí raz potvrdiť vek 18+ a súhlasiť s podmienkami. Bežné a otvorené modely môžeš používať hneď.",
    },
    ask: {
      title: "Opýtaj sa",
      body: "Máš {{guestCredits}} kred. mesačne. Po ich vyčerpaní počkaj do ďalšieho mesiaca alebo si vytvor bezplatný účet.",
    },
  },
  account: {
    title: "Kedy sa oplatí bezplatný účet",
    intro: "Čet funguje aj bez účtu. Účet ti pridá tieto možnosti.",
    credits:
      "S overeným e-mailom až {{freeCredits}} kred. zadarmo mesačne. Bez účtu je prídel {{guestCredits}}.",
    sync: "Čety sa ukladajú do súkromných priečinkov. Nájdeš ich na každom zariadení, na ktorom sa prihlásiš.",
    control:
      "V nastaveniach môžeš exportovať všetky údaje vo formáte JSON alebo zmazať účet. Zmazaním účtu sa odstránia tvoje osobné údaje.",
    plans:
      "Ak ti bezplatné kredity nestačia, platené plány začínajú na {{subPrice}} mesačne.",
  },
  stricter: {
    title: "Potrebuješ viac súkromia?",
    intro: "Vyber si riešenie podľa toho, aké údaje potrebuješ chrániť.",
    selfHost:
      "Prevádzkuj {{appName}} na vlastnom serveri podľa vlastných pravidiel",
    local:
      "Spusti model bez cenzúry lokálne alebo online aj bez grafickej karty",
    venice: "Alternatívy k Venice AI podľa ochrany súkromia",
  },
  faq: {
    title: "Časté otázky",
    exists: {
      q: "Existuje čet s AI bez registrácie?",
      a: "Áno. Na {{appName}} stačí otvoriť čet a písať. Účet ani e-mail nepotrebuješ. Bez účtu dostaneš {{guestCredits}} kred. mesačne na všetkých {{modelCount}} četovacích modelov.",
    },
    anonymous: {
      q: "Je čet s AI bez účtu naozaj anonymný?",
      a: "Nepýtame sa, kto si, a história anonymného četu zostáva v prehliadači. Poskytovateľ AI však musí vidieť zadanie, aby odpovedal, a náš server vidí spojenie ako každý web.",
    },
    free: {
      q: "Je čet zadarmo?",
      a: "Bez účtu dostaneš {{guestCredits}} kred. zadarmo mesačne, s overeným bezplatným účtom až {{freeCredits}}. Spotreba závisí od modelu. Najlacnejší {{cheapestModel}} stojí {{cheapestPrice}} za správu.",
    },
    uncensored: {
      q: "Môžem použiť AI bez cenzúry aj bez registrácie?",
      a: "Áno. Všetky modely bez cenzúry (spolu {{uncensored}}) fungujú aj bez účtu po jednorazovom potvrdení veku 18+.",
    },
    saved: {
      q: "Ukladajú sa moje čety?",
      a: "Čety v anonymnom režime zostanú len v prehliadači. Vrátiš sa k nim na rovnakom zariadení. Po vymazaní údajov prehliadača zmiznú. S účtom môžeš čety ukladať aj do súkromných priečinkov synchronizovaných medzi zariadeniami.",
    },
    runOut: {
      q: "Čo sa stane, keď miniem bezplatné kredity?",
      a: "Počkáš na prídel v ďalšom mesiaci alebo si vytvoríš bezplatný účet a overíš e-mail. Tak získaš až {{freeCredits}} kred. mesačne. Kredity, ktoré si už v danom mesiaci minul bez účtu, sa rátajú do tohto limitu.",
    },
    chatLink: "Čet s AI bez cenzúry v prehliadači",
    chatgptLink: "Alternatíva k ChatGPT s modelmi bez cenzúry",
  },
  cta: {
    title: "Rovno sa opýtaj",
    subtitle:
      "{{guestCredits}} kred. zadarmo mesačne, všetky modely a predvolený anonymný režim.",
    start: "Spustiť anonymný čet",
    models: "Porovnať všetky modely",
  },
};
