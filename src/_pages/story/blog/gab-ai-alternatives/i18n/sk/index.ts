import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k Gab AI: čety bez cenzúry (2026)",
    description:
      "Porovnaj Gab AI a Aryu s {{appName}}, Grok, Perplexity, Venice a lokálnou AI na politický výskum, súkromný čet a tvorbu.",
    category: "Porovnanie",
    imageAlt: "Porovnanie alternatív k Gab AI",
    keywords:
      "alternatívy k Gab AI, stránky ako Gab AI, Gab AI Arya, Gab AI a Venice, konzervatívny četbot, AI bez cenzúry na politiku, čet bez cenzúry, politická zaujatosť AI, sloboda prejavu v AI, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie",
    readTime: "9 min čítania",
    title: "Alternatívy k Gab AI na výskum, čet a médiá",
    subtitle:
      "{{appName}} a ďalšie alternatívy ({{count}}). Porovnali sme ich vlastné podmienky, cenníky a zásady súkromia.",
  },
  intro: {
    lead: "Gab AI postavila četbot, ktorý sa rozpráva o politike, kultúre a viere bez poučovania veľkých technologických firiem. To mu ide. Obsah pre dospelých však zakazuje, čety ukladá na serveroch a prístup k API podmieňuje predplatným.",
    p2: "Pozri sa, čo Gab AI skutočne sľubuje, kde má hranice a čo ponúkajú alternatívy ({{count}}). Údaje o Gab AI sú k {{gabDate}}, o ostatných k {{date}}. Uvádzame aj to, v čom sú lepší než my.",
    relation:
      "Sme zákazníkom Gab AI. {{gabAiExamples}} na {{appName}} prevádzkujeme cez API od Gab.",
  },
  gab: {
    title: "Čo ponúka Gab AI",
    intro:
      "Vychádzame z domovskej stránky, cenníka, podmienok, zásad ochrany súkromia a stránky API. Zdroje sme čítali {{gabDate}}.",
    models:
      "Modely: {{gabModels}} na jednom účte vrátane GPT, Claude, Gemini, DeepSeek, Qwen, Kimi a GLM. Arya je vlastný model spoločnosti Gab na rozhovory bez cenzúry o politike, kultúre a viere.",
    filter:
      "Filter: podmienky vyžadujú vek 18+ a zakazujú obscénny, sexuálne explicitný či pornografický obsah. Výnimkou je nahota na vzdelávacie alebo medicínske účely. Automatické systémy môžu obsah analyzovať kvôli bezpečnosti a dodržiavaniu podmienok.",
    price:
      "Cena: po overení e-mailu dostaneš {{gabFree}} kreditov. Plus stojí {{plusMonth}} mesačne alebo {{plusYear}} ročne a zahŕňa {{plusCredits}} kreditov mesačne. Plus Premium stojí {{premiumYear}} ročne a zahŕňa {{premiumCredits}} kreditov mesačne. Balíky začínajú na {{gabPackPrice}} za {{gabPackCredits}} kreditov. Neminuté kredity sa prenášajú ďalej.",
    gated:
      "S predplatným Plus získaš režim agenta Work a živý hlasový režim. V bezplatnom pláne potrebuješ na video a hudbu dokúpené kredity. API vyžaduje aktívny plán Plus alebo Plus Premium.",
    privacy:
      "Súkromie: Gab vidí tvoje zadania aj odpovede a uchováva históriu rozhovorov. Medzi účelmi uvádza zlepšovanie modelov. Zásady upozorňujú, že smerovanie cez Gab nemusí odstrániť identifikačné údaje. Dáta uchováva po dobu potrebnú na poskytovanie služby.",
    apps: "Aplikácie: web, Mac, Windows, iPhone, iPad, Android a rozšírenie prehliadača.",
    why: "Ľudia hľadajú alternatívu, keď píšu beletriu zakázanú podmienkami Gab, chcú históriu mimo servera, potrebujú API bez predplatného alebo chcú odpoveď Aryi porovnať s odlišným svetonázorom.",
    sourceHome: "Domovská stránka Gab AI",
    sourcePricing: "Cenník Gab AI",
    sourceTerms: "Podmienky používania Gab AI",
    sourcePrivacy: "Zásady ochrany súkromia Gab AI",
    sourceApi: "Stránka API Gab AI",
  },
  split: {
    title: "Voľnosť v politike, prísne pravidlá pre obsah pre dospelých",
    intro: "Pravidlá Gab AI sa menia podľa témy.",
    politics:
      "Pri politike, kultúre a viere Arya odpovedá priamo, aj keď sa bežné modely odpovedi vyhnú. V tom plní svoj účel.",
    adult:
      "Podmienky zakazujú beletriu pre dospelých. Patria sem temné romance, explicitné scény aj hranie rolí pre dospelých. Automatické systémy môžu kontrolovať súlad obsahu s podmienkami.",
    us: "Na {{appName}} môžeš dostať odlišné politické pohľady od UncensoredLM alebo Aryi a po jednorazovom potvrdení veku 18+ písať beletriu pre dospelých s modelmi bez cenzúry. Zákon platí aj tu.",
    unbiasedLink: "AI, ktorá rozoberie obe strany: modely na politické otázky",
    writerLink:
      "AI na písanie bez cenzúry: temná beletria a scény pre dospelých",
    chanLink: "Zručnosť 4chan: greentext a podpichovanie bez filtra",
  },
  criteria: {
    title: "Čo porovnať pred prechodom",
    intro: "Pomôže ti päť otázok.",
    worldview:
      "Svetonázor: chceš jeden model s otvorene uvedenými postojmi alebo viac modelov, ktorých odpovede môžeš porovnať?",
    filter:
      "Filter: máš voľnosť len pri politike, alebo aj pri beletrii a obsahu pre dospelých? Kto kontroluje obsah?",
    privacy:
      "Súkromie: kde sa čety ukladajú a používajú sa na zlepšovanie modelov?",
    price:
      "Cena: bezplatné kredity, predplatné alebo platba podľa spotreby? Čo bezplatný plán obmedzuje?",
    api: "API: vyžaduje predplatné a ktoré formáty podporuje?",
  },
  table: {
    title: "Porovnanie všetkých možností",
  },
  us: {
    title: "{{appName}}: viac svetonázorov v jednom čete",
    intro:
      "Modely ({{modelCount}}) máš v jednom čete s jedným zostatkom kreditov. Pri každej správe si vyberáš model a môžeš tak porovnať dva pohľady.",
    models:
      "Modely: {{uncensored}} bez cenzúry, {{mainstream}} bežných a {{open}} otvorených. {{ownModel}} sa trénoval na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory.",
    arya: "Nájdeš tu aj Aryu ({{gabAiExamples}}). Polož jej otázku a v tom istom čete sa potom spýtaj UncensoredLM alebo abliterovanej verzie GLM.",
    aryaOff:
      "Abliterované verzie GLM, DeepSeek a Kimi nájdeš vedľa Claude, GPT a Gemini. Polož rovnakú otázku dvom modelom a porovnaj odpovede.",
    privacy:
      "Súkromie: inkognito čety ostávajú v lokálnom úložisku prehliadača aj bez účtu. Súkromné čety sa ukladajú iba do tvojho účtu.",
    price:
      "Cena: každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Predplatné od {{subPrice}} mesačne. Stačí raz potvrdiť vek 18+ a modely bez cenzúry sa odomknú.",
    api: "API: rovnaké modely sprístupňujeme cez rozhrania kompatibilné s OpenAI a Anthropic. Stačí ktorýkoľvek plán od {{apiSubPrice}} mesačne.",
    weak: "V čom má Gab výhodu: neponúkame paušál a každá správa stojí kredity podľa modelu. Gab uvádza {{gabModels}} modelov, my {{modelCount}}. Balíky kreditov od Gab fungujú aj bez plánu. Naše balíky dobíjajú aktívny plán a nikdy nevypršia.",
    hubLink: "Čet s AI bez cenzúry: všetky modely, kontext a ceny",
    abliteratedLink: "Abliterované modely dostupné v prehliadači",
    ownLink: "Pozrieť model {{ownModel}}",
    aryaLink: "Pozrieť Gab AI Arya na {{appName}}",
  },
  list: {
    title: "Podrobné porovnanie alternatív ({{count}})",
    intro:
      "Údaje sme overili na stránkach poskytovateľov {{date}}. Pri každej možnosti nájdeš modely, pravidlá filtrovania aj informácie o tom, čo sa deje s četmi.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modely:",
    filter: "Filter:",
    privacy: "Súkromie:",
    price: "Cena:",
    priceValue: "Bezplatný plán: {{free}}. Platené plány: {{plans}}.",
    pro: "Hlavná výhoda:",
    con: "Na čo si dať pozor:",
    forWho: "Hodí sa ti, ak:",
    versusLink: "{{appName}} a {{name}}: úplné porovnanie",
    visit: "Navštíviť {{name}}",
  },
  privacy: {
    title: "Čo sa deje s tvojimi četmi",
    intro: "Takto to jednotlivé služby uvádzajú vo svojich podmienkach.",
    gab: "Gab AI ukladá zadania, odpovede aj históriu rozhovoru na vlastné servery. Medzi účelmi uvádza zlepšovanie modelov. Zbiera aj IP adresu a približnú polohu.",
    us: "V režime inkognito na {{appName}} ostávajú čety len v lokálnom úložisku prehliadača. Keď vymažeš údaje prehliadača, zmiznú aj čety.",
    local:
      "V LM Studio beží model na tvojom počítači a zadanie z neho neodchádza. Potrebuješ vlastný hardvér.",
    callout:
      "Každý model na serveri poskytovateľa vidí zadanie, na ktoré odpovedá. Uloženie histórie na zariadení zabráni tomu, aby samotná história ostala na serveri.",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá alternatíva k Gab AI je najlepšia?",
      a: "Záleží na tom, čo ti chýba. Priamy model s odlišným svetonázorom ponúka uncensored.ai. Venice drží históriu na tvojom zariadení a v pláne Pro môžeš vypnúť filter pre dospelých. FreedomGPT združuje modely bez cenzúry, obrázky aj video v jednom pláne. NanoGPT účtuje podľa spotreby. Na úplné súkromie použi LM Studio. Aryu, UncensoredLM aj abliterované modely v jednom čete nájdeš na {{appName}}.",
    },
    free: {
      q: "Existuje bezplatná alternatíva k Gab AI?",
      a: "Áno. FreedomGPT si vyskúšaš zdarma bez účtu a LM Studio beží zdarma na tvojom hardvéri. Na {{appName}} máš každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Modely bez cenzúry sprístupní jednorazové potvrdenie veku 18+.",
    },
    arya: {
      q: "Môžem používať Aryu aj mimo Gab AI?",
      a: "Áno. Na {{appName}} sprístupňujeme {{gabAiExamples}} cez vlastné API Gab. Odpoveď Aryi môžeš v tom istom čete porovnať s odpoveďou modelu {{ownModel}} alebo bežného modelu.",
      aOff: "Arya je vlastný model Gab. Na {{appName}} nájdeš v jednom čete model {{ownModel}}, trénovaný na knihách a dokumentoch zakázaných na bežnom internete, aj abliterované a bežné modely.",
    },
    adult: {
      q: "Povoľuje Gab AI obsah pre dospelých alebo NSFW?",
      a: "Nie. Podmienky zakazujú obscénny, sexuálne explicitný či pornografický obsah a automatické systémy môžu kontrolovať ich dodržiavanie. NanoGPT nemá plošný zákaz obsahu NSFW pre dospelých. Venice dovoľuje predplatiteľom Pro vypnúť filter pre dospelých a {{appName}} sprístupňuje modely bez cenzúry po jednorazovom potvrdení veku 18+.",
    },
    private: {
      q: "Ktorá alternatíva poskytuje najviac súkromia?",
      a: "Lokálny nástroj ako LM Studio. Zadania neopustia tvoje zariadenie. Z online služieb ukladá Venice a inkognito režim na {{appName}} históriu do prehliadača. Gab AI ju uchováva na serveroch a ako jeden z účelov uvádza zlepšovanie modelov.",
    },
    api: {
      q: "Ktorá alternatíva ponúka API bez cenzúry a bez predplatného?",
      a: "NanoGPT a OpenRouter účtujú podľa spotreby bez predplatného. Venice a uncensored.ai predávajú kredity na API. Gab AI vyžaduje aktívny plán Plus. Na {{appName}} sprístupní API ktorýkoľvek plán od {{apiSubPrice}} mesačne.",
    },
    freedomLink: "Porovnanie alternatív k FreedomGPT",
    kindsLink:
      "Tri druhy modelov: abliterované, doladené a s vlastným svetonázorom",
  },
  cta: {
    title: "Vypočuj si viac pohľadov. Potom sa rozhodni.",
    subtitle:
      "Každý mesiac máš {{guestCredits}} kreditov zdarma aj bez účtu. Otvor inkognito čet a spýtaj sa dvoch modelov na to isté.",
    start: "Spustiť inkognito čet",
    models: "Pozrieť modely bez cenzúry",
  },
};
