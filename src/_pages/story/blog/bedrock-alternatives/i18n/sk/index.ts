import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "AWS Bedrock bez cenzúry: porovnanie alternatív API | {{appName}}",
    description:
      "Bedrock Guardrails sú voliteľné, ale odmietnutia modelov a zásady AWS ostávajú. Porovnanie Custom Model Import pre abliterované váhy s {{appName}}, OpenRouter, Venice, NanoGPT a vlastným hostingom.",
    category: "Pre vývojárov",
    imageAlt: "Alternatívy k AWS Bedrock bez cenzúry, porovnanie",
    keywords:
      "alternatíva k AWS Bedrock bez cenzúry, alternatíva k Bedrock, Bedrock bez guardrails, Bedrock Custom Model Import abliterovaný, Bedrock model bez cenzúry, Claude na Bedrock alternatíva, Bedrock Converse API alternatíva, Anthropic Messages API, LLM API bez cenzúry, API pre abliterované modely, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Pre vývojárov",
    readTime: "8 min čítania",
    title: "Alternatívy k AWS Bedrock bez cenzúry",
    subtitle:
      "Guardrails, odmietnutia, zásady AWS a Custom Model Import, prečítané pri zdroji. Potom {{count}} alternatív. Overené {{date}}.",
  },
  intro: {
    lead: "Bedrock ti filter nevnucuje. Vynechaj Guardrail a Bedrock žiadny nepridá. Model napriek tomu odmieta, zásady AWS stále platia a v katalógu nie sú žiadne váhy bez cenzúry.",
    p2: "Skutočná otázka teda znie, kde abliterované modely bežia a koľko stojí presun. Tu sú fakty z dokumentácie AWS, cesta cez Custom Model Import a zmena v kóde pre používateľov Claude na Bedrock, ktorí prechádzajú na {{appName}}.",
  },
  bedrock: {
    title: "Čo Bedrock filtruje a čo nie",
    intro: "Priamo z dokumentácie a zásad AWS.",
    guardrails:
      "Guardrails sú voliteľné: bežia len vtedy, keď pri volaní pošleš ID a verziu guardrailu.",
    refusals:
      "Bez Guardrail neznamená bez cenzúry: modely sa poskytujú tak, ako ich dodávajú ich tvorcovia, takže Claude, Llama a ostatné si ponechávajú naučené odmietanie.",
    csam: "Vždy zapnuté: automatická detekcia CSAM pri obrazových vstupoch a výstupoch môže požiadavku zablokovať chybou HTTP 400.",
    policy:
      "Zásady: AWS Responsible AI Policy zakazuje používať službu na úmyselné obchádzanie bezpečnostných filtrov, ďalej dezinformácie, sexuálne zobrazenia bez súhlasu a ubližovanie maloletým.",
    retention:
      "Detekcia zneužitia: AWS môže vo vymedzených prípadoch ukladať alebo kontrolovať vstupy a výstupy. Claude Fable 5, 5.1 a 5.2 uchovávajú všetku prevádzku až 30 dní, modely OpenAI mimo gpt-oss uchovávajú označenú prevádzku až 30 dní. Poskytovatelia modelov z toho nedostanú nič.",
    models:
      "Žiadne váhy bez cenzúry: katalóg obsahuje DeepSeek, Llama, Qwen, Mistral, gpt-oss, Kimi, GLM, MiniMax, Gemma a Nemotron. Žiadny nie je abliterovaný.",
  },
  import: {
    title: "Prines si vlastné abliterované váhy: Custom Model Import",
    intro:
      "Bedrock vie hostovať váhy, ktoré nahráš. Je to jediný spôsob, ako tam spustiť abliterovaný model.",
    architectures:
      "Podporované architektúry: Mistral, Mixtral, Flan, Llama 2 až 3.3, GPTBigCode, Qwen2 až Qwen3 a gpt-oss 20B a 120B. Abliterovaný Llama, Qwen alebo gpt-oss sa hodí.",
    excluded:
      "Nepodporované: architektúry DeepSeek V3, Kimi a GLM. Importy Qwen3 nepodporujú Converse API.",
    format:
      "Obmedzenia: safetensors z Hugging Face, pod 200 GB pre textové modely, kontext pod 128K, bez dávkovej inferencie. Regióny: eu-central-1, us-east-1, us-east-2, us-west-2.",
    cost: "Náklady: $0.05718 za Custom Model Unit za minútu v US East a Oregone, účtované v 5-minútových oknách, plus $1.95 mesačne za úložisko na jednotku. Frankfurt stojí $0.07144 za minútu.",
    callout:
      "Platíš za kapacitu modelu za minútu, nie za token. A zásady AWS proti obchádzaniu bezpečnostných filtrov sa naďalej vzťahujú na tvoj účet.",
  },
  prices: {
    title: "Vlastné ceny Bedrock za otvorené modely",
    intro:
      "Štandardná úroveň, US East, za 1M tokenov, vstup / výstup. Len bežné váhy.",
    list: "DeepSeek v3.2 $0.62 / $1.85. Qwen3 Next 80B A3B $0.15 / $1.20. Mistral Large 3 $0.50 / $1.50. Kimi K2.5 $0.60 / $3.00. GLM 5 $1.00 / $3.20. GLM 4.7 Flash $0.07 / $0.40.",
    oursTitle: "Váhy bez cenzúry inde, za token",
    oursIntro:
      "Abliterované modely, ktoré Bedrock nemá: naše oproti najlacnejším hostiteľom.",
  },
  apis: {
    title: "Converse oproti formátom OpenAI a Anthropic",
    intro:
      "Bedrock hovorí InvokeModel a Converse na bedrock-runtime a na koncovom bode bedrock-mantle pridáva Messages, Chat Completions a Responses. My hovoríme OpenAI chat completions, Responses API a Anthropic Messages pod jednou základnou adresou s jedným kľúčom.",
    claude:
      "Pre používateľov Claude na Bedrock to znamená, že Anthropic SDK funguje ďalej. Vymeň klienta Bedrock za bežného, nastav základnú adresu a kľúč. Claude Code berie tú istú adresu ako ANTHROPIC_BASE_URL.",
    before: "Predtým: Claude cez klienta Bedrock",
    after: "Potom: rovnaké volanie Messages na {{appName}}",
    swap: "Rovnaký kód, ľubovoľný model: do poľa model napíš {{uncensoredExample}} a volanie pôjde na model bez cenzúry.",
    converse:
      "Dnes na Converse? Prejdi raz na SDK OpenAI alebo Anthropic a každá brána z tejto stránky, aj my, je od teba na jednu zmenu základnej adresy.",
  },
  rules: {
    title: "Bedrock, Azure, Vertex a Together vedľa seba",
    intro:
      "Každý hyperscaler ti niekde dovolí znížiť filter. Žiadny nemení zásady používania a žiadny nedodáva váhy bez cenzúry.",
  },
  us: {
    title: "{{appName}}: modely bez cenzúry bez importu váh",
    intro:
      "{{modelCount}} modelov na četovanie pod jedným kľúčom, {{uncensored}} z nich bez cenzúry. Platíš za token, žiadne minúty kapacity.",
    models:
      "Modely: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM a Qwen popri {{uncensored}} modeloch bez cenzúry vrátane abliterovaných GLM, DeepSeek a Kimi, ktoré Custom Model Import neprijme. {{ownModel}} je trénovaný na knihách a dokumentoch zakázaných v hlavnom prúde internetu, výsledkom je model s opačnými politickými názormi.",
    formats:
      "Formáty: OpenAI chat completions, Responses API a Anthropic Messages, plus obrázky, video, hudba, reč a prepis.",
    consent:
      "Pravidlá: modely bez cenzúry sa odomknú po jednorazovom súhlase 18+ na tvojom účte.",
    billing:
      "Účtovanie: jeden zostatok kreditov, naša marža {{markup}}% z toho, čo platíme poskytovateľovi. Každý plán od {{apiSubPrice}} mesačne odomkne kľúče API.",
    weak: "Kde nás Bedrock poráža: IAM, VPC, regióny, faktúra od AWS, ISO, SOC, CSA STAR, spôsobilosť pre HIPAA a FedRAMP High v GovCloud. Nemáme správu SOC 2, BAA, SLA ani výber regiónu a každé zadanie prechádza cez nás k poskytovateľovi, ktorý model prevádzkuje.",
    docsLink: "Dokumentácia API: koncové body, autentifikácia a limity",
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
  list: {
    title: "Alternatívy, jedna po druhej",
    intro:
      "Z ich vlastných stránok a zoznamov modelov, prečítané {{date}}. Čo každá je, v čom vyhráva a aký má háčik.",
  },
  stay: {
    title: "Kedy zostať pri Bedrock",
    intro: "Ak tvoja záťaž žije v AWS, otázka filtra môže byť tá menšia.",
    compliance:
      "Potrebuješ rozsah zhody, kontroly IAM a VPC a jednu faktúru od AWS.",
    retention:
      "Potrebuješ nulové uchovávanie na región: režim uchovávania none v Bedrock, nastavený cez API.",
    weights:
      "Tvoj abliterovaný model je Llama, Qwen alebo gpt-oss a stála prevádzka ospravedlňuje platenie za minúty kapacity.",
    callout:
      "Mnohé tímy to delia: Bedrock pre produkciu v AWS, druhý kľúč pre beletriu, hranie rolí, výskum a red-teaming.",
  },
  faq: {
    title: "Časté otázky",
    guardrails: {
      q: "Filtruje Bedrock obsah bez Guardrails?",
      a: "Bedrock nepridáva vrstvu filtra, kým nepripojíš Guardrail, okrem automatickej detekcie CSAM pri obrázkoch. Modely si ponechávajú naučené odmietanie a AWS Responsible AI Policy stále platí.",
    },
    uncensored: {
      q: "Má Bedrock modely bez cenzúry alebo abliterované?",
      a: "Nie v katalógu. Jedinou cestou je Custom Model Import vlastných váh pre podporované architektúry ako Llama, Qwen a gpt-oss.",
    },
    cost: {
      q: "Koľko stojí Custom Model Import?",
      a: "$0.05718 za Custom Model Unit za minútu v US East a Oregone, účtované v 5-minútových oknách, plus $1.95 mesačne za úložisko na jednotku. Platíš za kapacitu, nie za token.",
    },
    claude: {
      q: "Môžem presunúť kód Claude na Bedrock bez prepisovania?",
      a: "Áno. Nahraď AnthropicBedrock bežným klientom Anthropic, nastav base_url na základnú adresu {{appName}} bez /v1, použi svoj kľúč a naše ID modelu. Požiadavka a odpoveď Messages si zachovajú tvar.",
    },
    converse: {
      q: "Podporuje {{appName}} Bedrock Converse API?",
      a: "Nie. Hovoríme OpenAI chat completions, Responses API a Anthropic Messages. Kto raz odíde od Converse, má každého poskytovateľa kompatibilného s OpenAI alebo Anthropic na jednu zmenu základnej adresy.",
    },
    enterprise: {
      q: "Ponúka {{appName}} SOC 2, BAA alebo SLA?",
      a: "Nie. Ak ich potrebuješ, nechaj regulovanú záťaž na Bedrock a {{appName}} použi tam, kde odmietnutia prekážajú.",
    },
    apiLink: "API pre LLM bez cenzúry: ID modelov, kód a limity",
    azureLink: "Alternatívy k Azure OpenAI bez cenzúry",
    openRouterLink: "Alternatívy k OpenRouter, porovnanie",
    keysLink: "Spravovať kľúče API",
  },
  cta: {
    title: "Žiadne minúty kapacity. Žiadny reflex odmietania.",
    subtitle:
      "Modely najprv vyskúšaj v čete, {{guestCredits}} bezplatných kreditov mesačne, bez účtu. Potom namier SDK na API.",
    start: "Vyskúšať model bez cenzúry",
    docs: "Prečítať si dokumentáciu API",
  },
};
