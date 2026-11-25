import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Modely bez cenzúry a ich silné stránky | {{appName}}",
    description:
      "Všetky modely AI bez cenzúry na unbottled.ai. Bežné modely s potlačeným odmietaním aj UncensoredLM trénovaný na zakázaných knihách a dokumentoch. Silné stránky a limity.",
    category: "Sprievodca modelmi",
    imageAlt: "Sprievodca modelmi bez cenzúry na {{appName}}",
    keywords:
      "{{appName}}, modely AI bez cenzúry, abliterované modely, abliterácia a cenzúra, Venice, GLM bez cenzúry, DeepSeek bez cenzúry, Gab Arya, FreedomGPT, UncensoredLM, hranie rolí bez cenzúry, temné hranie rolí s AI, AI bez cenzúry na politické témy, sloboda prejavu a AI",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Sprievodca modelmi",
    readTime: "7 min čítania",
    title: "Modely bez cenzúry jeden po druhom",
    subtitle:
      "Každý model vyniká v niečom inom. Zisti, čo zvládne, kde má slabiny a na ktorú úlohu sa hodí.",
  },
  intro: {
    lead: "Aktuálne máme v ponuke {{uncensoredCount}} modelov bez cenzúry. Pochádzajú z rôznych laboratórií, vychádzajú z rôznych základných modelov a každý sa hodí na inú úlohu.",
    p2: "Pozrieme sa na konkrétnych poskytovateľov aj na silné stránky a limity ich modelov. Väčšina z nich vychádza z bežných modelov s úpravou, ktorá potláča odmietanie otázok. Pôvodný tréning aj pohľad na svet zostávajú. UncensoredLM trénovali na knihách a dokumentoch zakázaných v hlavnom prúde internetu, preto ponúka aj politické názory mimo neho. Na tomto rozdiele záleží najmä pri politike, názoroch mimo hlavného prúdu a najtemnejšej próze. Pri ostatných úlohách sa riaď tým, čo potrebuješ urobiť.",
  },
  whatItMeans: {
    title: "Čo u nás znamená „bez cenzúry“",
    p1: "Každý model na platforme má jednu z troch úrovní filtrovania obsahu: bežnú, otvorenú alebo bez cenzúry. Modely bez cenzúry odpovedajú priamo, bez odmietania a poučovania. Väčšina vznikla úpravou bežného modelu. Pri abliterácii sa z váh odstráni smer súvisiaci s odmietaním. Podobný účinok má aj dodatočné doladenie modelu. Schopnosti, tréningové dáta aj pohľad na svet vychádzajú z pôvodného modelu. UncensoredLM od uncensored.ai trénovali na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Pri politike tak ponúka pohľady, ku ktorým sa bežné modely nedostanú ani po odstránení odmietania.",
    callout:
      "Abliterovaný model na politické otázky odpovedá priamo, no spôsob uvažovania si nesie z pôvodného tréningu. UncensoredLM ponúka aj politické názory mimo hlavného prúdu. Siahni po abliterovanom modeli, keď chceš schopnosti pôvodného modelu bez odmietania. Ak chceš preskúmať aj druhú stranu sporu, skús UncensoredLM.",
    p2: "Úroveň si vyberáš ty. Keď zvolíš model bez cenzúry, zodpovedá tomu aj jeho spôsob odpovedania. K bežnému modelu môžeš prepnúť v tom istom čete na tom istom účte.",
  },
  groups: {
    builtUncensored: {
      title: "Model s vlastným pohľadom na svet",
      intro:
        "UncensoredLM vychádza z kníh a dokumentov zakázaných v hlavnom prúde internetu. Vďaka tomuto tréningu vyniká v troch oblastiach: politické a kontroverzné otázky, názory mimo hlavného prúdu a temné či tabuizované hranie rolí.",
    },
    creative: {
      title: "Hranie rolí a temná próza",
      intro:
        "Postavy zostávajú vo svojej role a scény sa odvíjajú podľa deja. UncensoredLM vyniká pri temných a tabuizovaných príbehoch. Iné modely majú výhodu pri dlhých kampaniach, pri práci s obrázkami alebo cenou.",
      topPickReason:
        "Píše temné a tabuizované príbehy a hrá postavy priamo. Scény nezmierňuje a postavy nevypadávajú z roly kvôli poučovaniu. Tréningové materiály mimo hlavného prúdu mu umožňujú držať sa aj temnejšieho deja. Kontext má 32K, takže pri veľmi dlhých kampaniach môže zabudnúť na úvodné scény.",
    },
    viewpoint: {
      title: "Politika, sporné témy a iné pohľady",
      intro:
        "Platforma pre slobodný prejav zahŕňa aj modely, ktoré inde nenájdeš. V tejto oblasti vyniká UncensoredLM. Gab Arya sa podľa vlastného tvorcu prikláňa k pravici. FreedomGPT odpovedá bez okolkov.",
      topPickReason:
        "Politické a kontroverzné otázky rozoberá v rámci, ktorý mu zadáš. Dokáže podrobne obhájiť aj názory mimo hlavného prúdu alebo zahrať diablovho advokáta bez moralizovania. Má vlastný pohľad a sporné tvrdenia podáva rovnako isto ako ustálené fakty. Jeho tvrdenia si overuj.",
    },
    reasoning: {
      title: "Uvažovanie, programovanie a analýza",
      intro:
        "Tu nájdeš najschopnejšie základné modely v ponuke bez cenzúry. Úpravy potláčajú odmietanie a zachovávajú schopnosti potrebné na uvažovanie, programovanie a analýzu.",
    },
    fast: {
      title: "Rýchle a lacné modely",
      intro:
        "Nízka cena za správu, rýchle odpovede a dlhý kontext. Všetky tri modely spracúvajú obrázky a hodia sa na každodennú prácu.",
    },
  },
  cards: {
    goodLabel: "Silné stránky",
    weakLabel: "Slabšie stránky",
    pageLink: "Zobraziť model {{model}}",
    topPickLabel: "Najlepšia voľba",
    alternativesLabel: "Alternatívy",
    uncensoredLm: {
      maker: "Uncensored.ai",
      basis:
        "Model od uncensored.ai trénovaný na knihách a dokumentoch zakázaných v hlavnom prúde internetu. Kontext 32K, spracúva iba text.",
      good: "Temné a tabuizované hranie rolí aj próza. Rozoberá politické a kontroverzné otázky z pohľadu, ktorý mu zadáš. Drží sa aj názorov mimo hlavného prúdu bez moralizovania. Dokáže volať nástroje.",
      weak: "Slabší pri veľmi dlhých kampaniach (kontext 32K), programovaní a práci s obrázkami. Je experimentálny a sporné tvrdenia podáva rovnako isto ako ustálené fakty. Jeho tvrdenia si overuj.",
    },
    freedomgpt: {
      maker: "Age of AI",
      basis: "Vychádza z modelov s otvorenými váhami. Kontext 32K.",
      good: "Rýchle, priame odpovede bez poučovania. Četbot, ktorý otvoril kategóriu modelov zameraných na slobodný prejav, je doladený na priamu komunikáciu.",
      weak: "Ide menej do hĺbky pri práci s nástrojmi, programovaní aj dlhšej argumentácii. UncensoredLM okrem potlačeného odmietania prináša aj odlišný svetonázor.",
    },
    arya: {
      maker: "Gab",
      basis: "Základný model tvorca nezverejnil. Kontext 131K.",
      good: "Asistent, ktorý sa podľa svojho tvorcu prikláňa k pravici. Vyber si ho, ak chceš práve takýto pohľad. Má dlhý kontext a dokáže volať nástroje.",
      weak: "Zámerne argumentuje z jednej strany. Tvorca nezverejnil základný model ani tréningové dáta, preto podrobnosti zostávajú neoverené. Na programovanie sa veľmi nehodí.",
    },
    venice: {
      maker: "Venice.ai",
      basis:
        "Dolphin Mistral 24B vo verzii od Venice. Kontext 128K, spracúva obrázky.",
      good: "Lacný univerzálny model bez cenzúry s jednou z najnižších mier odmietania. Hodí sa na prózu aj otvorený rozhovor, spracúva obrázky a má kontext 128K.",
      weak: "Doladená verzia modelu Mistral si stále nesie jeho pohľad, čo vidno pri politike aj v temných scénach. Slabšie zvláda kód a náročnú analýzu. Volanie nástrojov rieši pomocou textového zadania.",
    },
    veniceRoleplay: {
      maker: "Venice.ai",
      basis:
        "Model 24B doladený na hranie rolí. Kontext 128K, spracúva obrázky.",
      good: "Kontext 128K udrží aj úvodné scény dlhej kampane. Model sa drží spôsobu vyjadrovania postavy a spracúva obrázky postáv aj predlohy scén.",
      weak: "Úprava potláča odmietanie, pôvodný tréning však môže najtemnejšie scény zjemňovať. Model je doladený na rozprávanie príbehov a pri analytických úlohách je slabší.",
    },
    deepseekFlash: {
      maker: "DeepSeek cez Venice",
      basis:
        "DeepSeek V4.1 Flash s potlačeným odmietaním. Kontext 1M, spracúva obrázky.",
      good: "Rozsiahly kontext za nízku cenu sa hodí na veľké príbehové svety. Spracúva obrázky, volá nástroje a podľa potreby napíše aj kód.",
      weak: "Pôvodný pohľad modelu DeepSeek zostáva aj po potlačení odmietania. Pri politike a najtemnejších scénach odpovedá opatrnejšie. Hodí sa na rôzne úlohy, na rozprávanie príbehov sa však nešpecializuje.",
    },
    gemma: {
      maker: "Google cez Venice",
      basis:
        "Gemma 4 26B MoE s odstráneným filtrom. Kontext 256K, spracúva obrázky.",
      good: "Rýchly, lacný a multimodálny. Na model bez cenzúry v tejto cenovej kategórii má dlhý kontext.",
      weak: "Je silnejší v rýchlych odpovediach než v dôkladnom uvažovaní. Pri citlivých témach sa stále prejavuje tréning od Googlu.",
    },
    qwen: {
      maker: "Alibaba cez Venice",
      basis:
        "Qwen 3.6 Plus s potlačeným odmietaním. Kontext 256K, spracúva obrázky.",
      good: "Najsilnejší model na programovanie a analýzu v ponuke bez cenzúry. Dobre uvažuje, spracúva obrázky a udrží dlhý kontext.",
      weak: "Správa stojí viac než pri modeloch Flash. Pri politike sa aj po potlačení odmietania prejavuje pôvodný tréning od Alibaby.",
    },
    mimo: {
      maker: "Xiaomi cez NanoGPT",
      basis:
        "MiMo V2.6 Flash s odstráneným smerom odmietania. Kontext 1M, spracúva obrázky.",
      good: "Rýchly, lacný a multimodálny. Vie volať nástroje a udrží veľmi dlhý kontext. Hodí sa na veľký objem úloh bez filtrovania.",
      weak: "Uprednostňuje rýchlosť pred hĺbkou. Na najnáročnejšie uvažovanie sa hodia výkonnejšie modely.",
    },
    glm53: {
      maker: "Z.AI cez NanoGPT",
      basis: "Plná verzia GLM 5.3 na uvažovanie bez cenzúry. Kontext 1M.",
      good: "Špičkové schopnosti pri programovaní, písaní a volaní nástrojov bez cenzúry, za zlomok ceny špičkového abliterovaného modelu.",
      weak: "Veľký model odpovedá pomalšie a stále je označený ako experimentálny. Otázky už neodmieta, pri politike však môže odpovedať rovnako opatrne ako základný GLM.",
    },
    glm53Flash: {
      maker: "Z.AI cez NanoGPT",
      basis: "320B MoE bez cenzúry. Kontext 1M, spracúva obrázky.",
      good: "Rýchly, lacný a multimodálny model s kontextom 1M. Hodí sa na každodenné úlohy bez filtrovania.",
      weak: "Na najnáročnejšie uvažovanie zvoľ plnú verziu GLM 5.3.",
    },
  },
  why: {
    title: "Prečo záleží na výbere",
    intro: "Možnosť vybrať si model je dôvod, prečo je ponuka taká široká.",
    p1: "Čo jeden model odmietne, druhý zodpovie. Platí to pri medicínskej otázke, hraničnom právnom prípade, próze, správe o bezpečnosti aj pri názore mimo hlavného prúdu. Keď máš na výber viac modelov, o tom, čo sa chceš spýtať, rozhoduješ ty.",
    p2: "UncensoredLM sa hodí na temné hranie rolí, tabuizované príbehy a politické pohľady mimo hlavného prúdu. Venice Role Play zvláda dlhé kampane. Qwen si poradí aj s kódom, pri ktorom iné modely namietajú. GLM 5.3 vyniká v uvažovaní. Modely Flash zvládnu veľa úloh za málo kreditov. Gab Arya si vyber, ak chceš zámerne pravicový pohľad. Na tom istom účte máš aj bežné modely na úlohy, pri ktorých sa filter hodí.",
    callout:
      "Za vytvorený obsah zodpovedáš ty a stále platia zákony. Na platforme si úroveň filtrovania určuješ sám.",
  },
  howToPick: {
    title: "Ako si vybrať v praxi",
    p1: "Vychádzaj z úlohy. Na politiku, sporné otázky, pohľad mimo hlavného prúdu a temnú či tabuizovanú prózu skús UncensoredLM. Pri kampaniach, ktorým kontext 32K nestačí, alebo pri scénach s obrázkami zvoľ Venice Role Play. Lacný univerzálny model je Venice Uncensored. Na programovanie alebo analýzu bez odmietania skús Qwen 3.6 Plus Uncensored alebo plný GLM 5.3 Uncensored. Ak potrebuješ veľa lacných multimodálnych odpovedí, vyber GLM 5.3 Flash, Gemma 4 alebo MiMo.",
    p2: "Ak chceš pravicový pohľad, vyber Gab Arya. Tak ho opisuje aj jeho tvorca. Na priame odpovede bez okolkov je tu FreedomGPT Liberty. Ak váhaš, porovnaj dva modely na rovnakom vlastnom zadaní.",
    compareLink: "Porovnať {{a}} a {{b}}",
  },
  cta: {
    title: "Vyber si model a nastav filter",
    subtitle:
      "Všetky tieto modely bez cenzúry sú dostupné priamo v čete. Porovnaj ich na vlastnej otázke alebo rovno začni rozhovor.",
    chat: "Začať čet",
    models: "Zobraziť všetky modely",
  },
};
