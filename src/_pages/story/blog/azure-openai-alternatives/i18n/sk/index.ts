import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Azure OpenAI bez cenzúry: porovnanie alternatív API | {{appName}}",
    description:
      "Azure predvolene filtruje každý model a zakazuje erotických a romantických chatbotov aj bez filtrov. Porovnanie {{appName}}, OpenRouter, Venice, NanoGPT, abliterovaných API, Bedrock, Vertex a vlastného hostingu.",
    category: "Pre vývojárov",
    imageAlt: "Alternatívy k Azure OpenAI bez cenzúry, porovnanie",
    keywords:
      "alternatíva k Azure OpenAI bez cenzúry, alternatíva k Azure OpenAI, Azure OpenAI vypnutie filtra obsahu, Azure OpenAI bez filtra obsahu, Azure modified content filtering, Azure abuse monitoring opt out, Azure OpenAI NSFW, LLM API bez filtra obsahu, LLM API bez cenzúry, API pre abliterované modely, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Pre vývojárov",
    readTime: "10 min čítania",
    title: "Alternatívy k Azure OpenAI bez cenzúry",
    subtitle:
      "Filtre Azure, schvaľovacia brána a Code of Conduct, prečítané pri zdroji. Potom {{count}} alternatív, úprimne o tom, v čom každá vyhráva. Overené {{date}}.",
  },
  intro: {
    lead: "Azure OpenAI predvolene filtruje každý model. Vypnutie filtra vyžaduje schválenú žiadosť. A aj po schválení Code of Conduct naďalej zakazuje erotických a romantických chatbotov.",
    p2: "Ak je tvoj produkt beletria, hranie rolí, spoločníci, red-teaming alebo jednoducho priame odpovede, je to múr, nie nastavenie. Tu je presne to, čo Azure dovoľuje, čo ho nahradí, a zmena v kóde, ktorá presunie klienta Azure OpenAI na {{appName}}.",
  },
  azure: {
    title: "Čo Azure naozaj filtruje",
    intro: "Priamo z dokumentácie a zásad Microsoftu.",
    defaults:
      "Predvolene zapnuté: Microsoft Foundry uplatňuje predvolené bezpečnostné nastavenia na každý model okrem Whisper. Na High only ich môžeš uvoľniť sám.",
    approval:
      "Vypnutie len so schválením: možnosti No filters a Annotate only vyžadujú schválenie upraveného filtrovania obsahu. Požiadať môžu len zákazníci spravovaní tímom účtu Microsoft alebo v oprávnenom programe.",
    conduct:
      "Vypnutý filter nie je povolenie: Code of Conduct zakazuje sexuálne explicitný obsah vrátane sexuálne podnetného a fetišového obsahu a zakazuje chatbotov, ktorí sú erotickí, romantickí alebo sa používajú na erotické či romantické účely. Zakázané je aj brutálne násilie, gore a nenávistné prejavy.",
    monitoring:
      "Abuse monitoring: označené zadania a odpovede idú predvolene na automatickú kontrolu a v prípade potreby k zamestnancom Microsoftu. Údaje sú uložené v úložisku abuse monitoring v geografii tvojho zdroja.",
    sunset:
      "Opt-out končí: podľa changelogu Microsoftu zo 17. novembra 2026 už Modified Abuse Monitoring nebude dostupný pre modely vydané od 1. novembra 2026, od dátumu, ktorý ešte nebol oznámený.",
    models:
      "Žiadne modely bez cenzúry: v katalógu sme nenašli žiadny abliterovaný ani necenzurovaný model. Modely DeepSeek a Llama sú v zozname, žiadny z nich nie je abliterovaný.",
    callout:
      "Záver: na Azure aplikácia s beletriou pre dospelých alebo spoločníkmi porušuje Code of Conduct, nech máš filter nastavený akokoľvek.",
  },
  rules: {
    title: "Azure, Bedrock, Vertex a Together: čo naozaj znamená vypnuté",
    intro:
      "Každý hyperscaler ti niekde dovolí znížiť filter. Žiadny nemení zásady používania a žiadny nedodáva váhy bez cenzúry.",
  },
  us: {
    title: "{{appName}}: modely bez cenzúry v API OpenAI a Anthropic",
    intro:
      "{{modelCount}} modelov na četovanie pod jedným kľúčom, {{uncensored}} z nich bez cenzúry. Žiadna vrstva filtra nad modelom, ktorý si vyberieš.",
    models:
      "Modely: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM a Qwen popri {{uncensored}} modeloch bez cenzúry. {{ownModel}} je trénovaný na knihách a dokumentoch zakázaných v hlavnom prúde internetu, výsledkom je model s opačnými politickými názormi.",
    formats:
      "Formáty: OpenAI chat completions, OpenAI Responses API a Anthropic Messages API, plus obrázky, video, hudba, reč a prepis pod rovnakým kľúčom.",
    consent:
      "Pravidlá: modely bez cenzúry sa odomknú po jednorazovom súhlase 18+ na tvojom účte. Žiadna žiadosť, žiadny tím účtu.",
    billing:
      "Účtovanie: jeden zostatok kreditov, naša marža {{markup}}% z toho, čo platíme poskytovateľovi. Každý plán od {{apiSubPrice}} mesačne odomkne kľúče API. Karta, PayPal alebo krypto.",
    limits:
      "Limity: {{burst}} požiadaviek za minútu a {{streams}} súbežných streamov na kľúč ako strop proti zneužitiu. Limity poskytovateľov sa posielajú ďalej.",
    weak: "Kde nás Azure poráža: nemáme správu SOC 2, BAA, SLA ani výber regiónu. Každé zadanie prechádza cez nás k poskytovateľovi, ktorý model prevádzkuje. Naša marža {{markup}}% nás robí za token drahšími než abliterované smerovače nižšie. Nemáme ani koncový bod embeddings.",
    before: "Predtým: klient Azure OpenAI",
    after: "Potom: rovnaké SDK, namierené na {{appName}}",
    codeNote:
      "Menia sa tri veci. AzureOpenAI sa stane OpenAI so základnou adresou base_url. Názov deploymentu sa stane ID modelu. A content_filter_results zmizne z odpovedí, pretože neexistuje vrstva filtra, o ktorej by sa dalo hlásiť.",
    docsLink: "Dokumentácia API: koncové body, autentifikácia a limity",
    formatsLink: "API kompatibilné s OpenAI a Anthropic, vysvetlenie",
    toolsLink: "Jeden kľúč v Claude Code, Codex CLI, Aider a ďalších",
  },
  models: {
    title: "{{apiUncensored}} modelov bez cenzúry v API dnes",
    intro:
      "Každý model bez cenzúry, ktorý môžeš zavolať, s ID, ktoré zadáš do poľa model. Od najlacnejšieho.",
    colModel: "Model",
    colId: "ID v API",
    colContext: "Kontext",
    colPrice: "Za správu",
  },
  prices: {
    title: "Cena za token, naša oproti najlacnejším hostiteľom",
    intro:
      "Rovnaké váhy, iní hostitelia. Za token nie sme najlacnejší. Platíš za jeden kľúč k modelom bez cenzúry, otvoreným aj bežným, plus webový čet.",
  },
  list: {
    title: "Alternatívy, jedna po druhej",
    intro:
      "Z ich vlastných stránok a zoznamov modelov, prečítané {{date}}. Čo každá je, v čom vyhráva a aký má háčik.",
  },
  stay: {
    title: "Kedy zostať pri Azure",
    intro: "Niekedy je filter cenou za papierovanie, ktoré potrebuješ.",
    compliance:
      "Potrebuješ programy zhody, regionálne uloženie údajov a tím účtu. To predávajú hyperscalery. Bedrock napríklad uvádza ISO, SOC, CSA STAR, spôsobilosť pre HIPAA a FedRAMP High v GovCloud.",
    privacy:
      "Potrebuješ dátové podmienky Microsoftu: zadania a odpovede nie sú dostupné OpenAI a bez tvojho povolenia sa nepoužívajú na trénovanie základných modelov.",
    sfw: "Tvoj produkt je aj tak vhodný do práce. Vtedy ťa predvolené nastavenia Azure stoja málo.",
    callout:
      "Mnohé tímy to delia: Azure pre regulovanú záťaž, druhý kľúč pre beletriu, hranie rolí, výskum a red-teaming.",
  },
  faq: {
    title: "Časté otázky",
    off: {
      q: "Môžem vypnúť filter obsahu v Azure OpenAI?",
      a: "Len so schválením. Zákazníci môžu filtre sami uvoľniť na High only. No filters a Annotate only vyžadujú schválenú žiadosť o upravené filtrovanie obsahu, otvorenú zákazníkom spravovaným tímom účtu Microsoft alebo v oprávnenom programe.",
    },
    nsfw: {
      q: "Dovoľuje Azure OpenAI aplikácie NSFW alebo so spoločníkmi bez filtrov?",
      a: "Nie. Microsoft Code of Conduct zakazuje sexuálne explicitný obsah a erotických či romantických chatbotov. Nastavenia filtra Code of Conduct nemenia.",
    },
    monitoring: {
      q: "Môžem sa ešte odhlásiť z Azure abuse monitoring?",
      a: "Schválení zákazníci mohli. Podľa changelogu Microsoftu zo 17. novembra 2026 už Modified Abuse Monitoring nebude dostupný pre modely vydané od 1. novembra 2026, od dátumu, ktorý ešte nebol oznámený.",
    },
    best: {
      q: "Aká je najlepšia alternatíva k Azure OpenAI bez cenzúry?",
      a: "Najlacnejšie abliterované tokeny: OpenUncensored alebo Refuseless. Obrovský katalóg bežných modelov: OpenRouter. Vlastné modely Venice bez cenzúry: Venice. Zadania, ktoré nikdy neopustia tvoje stroje: Ollama, LM Studio alebo vLLM. Modely bez cenzúry, otvorené aj bežné plus tímový čet pod jedným kľúčom OpenAI a Anthropic: {{appName}}.",
    },
    sdk: {
      q: "Môžem si ponechať kód SDK Azure OpenAI?",
      a: "Z veľkej časti áno. Vymeň AzureOpenAI za OpenAI, nastav base_url a kľúč a názov deploymentu nahraď ID modelu, napríklad {{example}}. Požiadavky a odpovede si zachovajú tvar OpenAI.",
    },
    enterprise: {
      q: "Ponúka {{appName}} SOC 2, BAA alebo SLA?",
      a: "Nie. Ak ich potrebuješ, nechaj regulovanú záťaž u hyperscalera a {{appName}} použi tam, kde filtre prekážajú.",
    },
    apiLink: "API pre LLM bez cenzúry: ID modelov, kód a limity",
    bedrockLink: "Alternatívy k AWS Bedrock bez cenzúry",
    openRouterLink: "Alternatívy k OpenRouter, porovnanie",
    keysLink: "Spravovať kľúče API",
  },
  cta: {
    title: "Rovnaké SDK. Žiadna vrstva filtra.",
    subtitle:
      "Modely najprv vyskúšaj v čete, {{guestCredits}} bezplatných kreditov mesačne, bez účtu. Potom zapoj API.",
    start: "Vyskúšať model bez cenzúry",
    docs: "Prečítať si dokumentáciu API",
  },
};
