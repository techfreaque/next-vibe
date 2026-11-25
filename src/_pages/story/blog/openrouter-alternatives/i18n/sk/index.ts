import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k OpenRouter s modelmi bez cenzúry | {{appName}}",
    description:
      "Porovnaj OpenRouter s Vercel AI Gateway, LiteLLM, Portkey, Cloudflare, NanoGPT a {{appName}}. Poplatky, vlastný hosting, filtre a súkromie.",
    category: "Pre vývojárov",
    imageAlt: "Porovnanie alternatív k OpenRouter pre vývojárov",
    keywords:
      "alternatíva k OpenRouter, alternatívy k OpenRouter, OpenRouter a NanoGPT, služby ako OpenRouter, brána API pre LLM, API pre LLM bez cenzúry, jeden kľúč API pre všetky modely, API kompatibilné s OpenAI, API kompatibilné s Anthropicom, modely OpenRouter bez cenzúry, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Pre vývojárov",
    readTime: "9 min čítania",
    title: "Alternatívy k OpenRouter na smerovanie požiadaviek",
    subtitle:
      "{{appName}} a ďalšie alternatívy ({{count}}). Porovnali sme formáty API, ponuku bez cenzúry a poplatky. Údaje overené {{date}}.",
  },
  intro: {
    lead: "OpenRouter jedným kľúčom API sprístupňuje viacerých poskytovateľov a ponúka čet na webe. V pláne Standard uvádza poplatok za platformu 5,5 %. Ak chceš prevádzkovať vlastnú bránu, podrobnejšie limity alebo iný spôsob platenia, porovnaj ďalšie možnosti.",
    p2: "Hostované brány, brány na vlastnom serveri a aplikácie s modelmi bez cenzúry sme porovnali podľa ich dokumentácie a cenníkov. OpenRouter používame aj my. Cez jeho bránu sprístupňujeme {{openRouterModels}} modelov.",
  },
  criteria: {
    title: "Čo porovnať pred prechodom",
    intro: "Pri výbere pomôže šesť otázok.",
    catalog:
      "Katalóg: Koľko modelov a laboratórií pokrýva? Nájdeš tam modely, ktoré používaš dnes?",
    uncensored:
      "Modely bez cenzúry: Koľko ich služba ponúka, akým spôsobom a na čo sa hodia?",
    formats:
      "Formáty: Podporuje služba iba OpenAI Chat Completions alebo aj Responses API a Anthropic Messages API pre programovacích agentov?",
    billing:
      "Účtovanie: Platíš cenníkovú cenu s poplatkom, cenu s prirážkou alebo predplatné? Čo sa stane pri nulovom zostatku?",
    data: "Údaje: Ukladá či protokoluje služba zadania? Trénuje na nich modely len so súhlasom?",
    chat: "Čet: Môžu ľudia bez znalosti kódu použiť rovnaké modely v prehliadači?",
  },
  table: {
    title: "Všetky možnosti vedľa seba",
  },
  us: {
    title: "{{appName}}: jeden kľúč pre všetky typy modelov",
    intro:
      "Jeden kľúč pre {{modelCount}} četovacích modelov, z toho {{uncensored}} bez cenzúry.",
    models:
      "Modely: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM a Qwen spolu s {{uncensored}} modelmi bez cenzúry. {{ownModel}} je trénovaný na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Preto vyjadruje aj odlišné politické názory.",
    formats:
      "Formáty: OpenAI Chat Completions, OpenAI Responses API aj Anthropic Messages API. Svoje SDK alebo agenta nasmeruj na jednu základnú adresu.",
    billing:
      "Účtovanie: Jeden zostatok kreditov. K cene poskytovateľa pripočítavame {{markup}} %. Kľúče API odomkne prvý nákup. Plány začínajú na {{apiSubPrice}} mesačne.",
    chat: "Čet: Rovnaké modely aj pre členov tímu bez kódu. Webový čet má priečinky, nástroje a tvorbu obrázkov, videa aj hudby.",
    openRouter:
      "Modely od OpenRouter: Cez jeho bránu sprístupňujeme {{openRouterModels}} modelov. Používaš ich na rovnakom účte ako modely bez cenzúry.",
    weak: "Kde OpenRouter vedie: Má väčší katalóg a dovolí použiť vlastné kľúče poskytovateľov aj vyberať poskytovateľa pre každú požiadavku. Jeho ceny sú bližšie k cenníku poskytovateľa, lebo my účtujeme prirážku. Zriedkavý model pravdepodobne nájdeš práve tam.",
    codeLabel: "Prechod klienta OpenAI SDK: zmeň základnú adresu a kľúč",
    docsLink: "Dokumentácia API: koncové body, overenie a limity",
    formatsLink: "Ako funguje API kompatibilné s OpenAI a Anthropicom",
    toolsLink: "Jeden kľúč pre Claude Code, Codex CLI, Aider a ďalšie",
  },
  models: {
    title: "Modely bez cenzúry dostupné cez API: {{apiUncensored}}",
    intro:
      "Všetky modely bez cenzúry od najlacnejších. Identifikátor pri modeli vlož do poľa model.",
    colModel: "Model",
    colId: "Identifikátor API",
    colContext: "Kontext",
    colPrice: "Za správu",
    footnote:
      "Cena jednej referenčnej správy zahŕňa našu prirážku {{markup}} %. Pod názvom modelu nájdeš spôsob jeho úpravy alebo tréningu.",
  },
  list: {
    title: "Alternatívy: {{count}} možností podrobne",
    intro:
      "Údaje z vlastných stránok služieb sme overili k {{date}}. Pri každej uvádzame, čo ponúka, ako funguje jej API, aké má modely a koľko stojí.",
    heading: "{{number}}. {{name}}: {{kind}}",
    api: "API:",
    models: "Modely:",
    price: "Cena:",
    priceValue: "Bezplatný plán: {{free}}. Platené plány: {{plans}}.",
    pro: "Najväčšia výhoda:",
    con: "Háčik:",
    forWho: "Vyber si, ak:",
    versusLink: "{{appName}} a {{name}}: úplné porovnanie",
    visit: "Navštíviť {{name}}",
  },
  stay: {
    title: "Kedy sa ešte oplatí OpenRouter",
    intro:
      "Ak potrebuješ nasledujúce funkcie, OpenRouter môže byť lepšia voľba.",
    rare: "Potrebuješ okrajový model alebo konkrétneho poskytovateľa, ktorého nemá žiadna iná porovnaná služba.",
    callout:
      "Mnohé tímy používajú dve brány. OpenRouter na menej bežné modely, druhý kľúč na modely bez cenzúry a čet pre celý tím.",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá alternatíva k OpenRouter je najlepšia?",
      a: "Záleží na tom, čo ti v OpenRouter chýba. NanoGPT má veľa modelov bez cenzúry a platbu podľa spotreby. Venice ponúka vlastné modely a súkromie. Ollama beží lokálne a zadarmo. {{appName}} spája modely bez cenzúry, otvorené aj bežné modely s tímovým četom a jedným kľúčom.",
    },
    cheaper: {
      q: "Existuje lacnejšia alternatíva k OpenRouter?",
      a: "Porovnaj cenu konkrétneho modelu. Priame API poskytovateľa obíde sprostredkovateľa. Ceny modelov na bránach sa líšia a často sa menia. Na {{appName}} platíš našu nákupnú cenu s prirážkou {{markup}} %. Cenu za správu nájdeš na každej stránke modelu.",
    },
    uncensored: {
      q: "Ktorá alternatíva k OpenRouter má modely bez cenzúry?",
      a: "NanoGPT, Venice, uncensored.ai, Gab AI a {{appName}} sprístupňujú modely bez cenzúry cez API. V API {{appName}} ich je aktuálne {{apiUncensored}}: abliterované, doladené aj {{ownModel}}.",
    },
    sdk: {
      q: "Môžem si ponechať kód pre OpenAI SDK?",
      a: "Áno. Zmeň základnú adresu a kľúč API. Identifikátory modelov sa medzi bránami líšia, preto ich tiež uprav. Príklad: {{example}}.",
    },
    anthropic: {
      q: "Funguje to so súpravami SDK od Anthropicu a s programovacími agentmi?",
      a: "Áno. {{appName}} ponúka Anthropic Messages API aj formáty OpenAI. Claude Code a ďalší agenti sa pripoja s jedným kľúčom vrátane prístupu k modelom bez cenzúry.",
    },
    free: {
      q: "Existuje bezplatná alternatíva k OpenRouter?",
      a: "Ollama je zadarmo, ak máš na model dosť pamäte. OpenRouter má bezplatné modely s denným limitom. {{appName}} dáva kredity na čet zadarmo každý mesiac a API odomkne prvým nákupom.",
    },
    apiLink: "API pre LLM bez cenzúry: identifikátory, kód a limity",
    veniceLink: "Porovnanie alternatív k Venice AI",
    keysLink: "Spravovať kľúče API",
  },
  cta: {
    title: "Jeden kľúč pre všetky modely. Menej odmietnutí.",
    subtitle:
      "Najskôr vyskúšaj modely v čete. Dostaneš {{guestCredits}} kred. zadarmo mesačne aj bez účtu.",
    start: "Vyskúšať model bez cenzúry",
    docs: "Prečítať si dokumentáciu API",
  },
};
