import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatíva k ChatGPT bez filtrov | {{appName}}",
    description:
      "Alternatívy k ChatGPT, ktoré odmietajú menej: {{appName}}, Venice, NanoGPT aj lokálne aplikácie. Porovnaj modely, limity a súkromie, ktoré ponúkajú.",
    category: "Príručka",
    imageAlt: "{{appName}}: alternatíva k ChatGPT bez filtrov",
    keywords:
      "alternatíva k ChatGPT, ChatGPT bez filtrov, alternatíva k ChatGPT bez cenzúry, ChatGPT bez obmedzení, AI čet bez filtrov, AI bez cenzúry, UncensoredLM, AI bez cenzúry pre politiku, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Príručka",
    readTime: "Čítanie na 7 minút",
    title: "Alternatívy k ChatGPT, ktoré menej odmietajú",
    subtitle:
      "Porovnaj bežné, otvorené a necenzurované modely AI na {{appName}}. Zisti, čo v čete zmení prepnutie modelu a koľko ktorá možnosť stojí.",
  },
  intro: {
    lead: "ChatGPT používa ochranné opatrenia OpenAI. Modely GPT si ich zachovávajú aj na {{appName}}. Ak chceš čet s menším počtom obmedzení, vyber iný model. Aj ten môže zadanie odmietnuť alebo sa zmýliť.",
    p2: "Na {{appName}} môžeš vyberať z četovacích modelov ({{modelCount}}) v troch kategóriách obsahu. Všetky čerpajú z jedného zostatku.",
  },
  exists: {
    title: "Existuje ChatGPT bez filtrov?",
    p1: "ChatGPT používa ochranné opatrenia OpenAI. Keď na {{appName}} vyberieš GPT, stále dostaneš model GPT s filtrami poskytovateľa.",
    p2: "Ak chceš vyskúšať menej obmedzený čet, vyber na {{appName}} iný model z kategórie bez cenzúry. Môžeš začať v prehliadači ako hosť.",
  },
  tiers: {
    title: "Čo v skutočnosti znamená „bez filtrov“?",
    intro: "Každý model má jednu z troch úrovní filtrov.",
    mainstream:
      "Bežné modely ({{count}}). Platia ochranné opatrenia poskytovateľa.",
    open: "Otvorené modely ({{count}}). Odmietanie závisí od modelu.",
    uncensored:
      "Modely bez cenzúry ({{count}}). Do tejto skupiny patria podľa toho, ako reagujú na citlivé témy.",
    vendorRefusals:
      "Keď na {{appName}} prepneš model, odpovie iný model. Jeho vlastné ochranné opatrenia stále platia.",
    twoKinds:
      "Niektoré modely bez cenzúry odmietajú menej vďaka metóde abliteration alebo doladeniu. UncensoredLM trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu. Preto má odlišné politické názory. Jeho faktické tvrdenia porovnaj so svojimi zdrojmi.",
    modelsLink: "Prehliadať modely podľa úrovne filtrov",
  },
  switch: {
    title: "Môžem zmeniť model uprostred četu?",
    intro: "Áno. Pre ďalšiu správu môžeš zvoliť iný model.",
    p1: "Zmeň model v existujúcej konverzácii a pokračuj v nej. Nový model využije len tú časť histórie, ktorá sa zmestí do jeho kontextového okna.",
    p2: "V jednom čete môžeš s jedným modelom napísať návrh a požiadať iný model o úpravu.",
    caveat:
      "Každý model uplatní vlastné ochranné opatrenia na návrh aj ďalšiu požiadavku.",
  },
  picks: {
    title: "Ktorý model použiť namiesto ChatGPT?",
    intro:
      "Začni tým, čo potrebuješ urobiť. Názov modelu otvorí stránku s cenou a parametrami.",
    builtUncensored: {
      title: "Politika a uhly pohľadu",
      body: "UncensoredLM môže ponúknuť iný pohľad na politické aj kontroverzné témy. Faktické tvrdenia si over vo svojich zdrojoch.",
    },
    everyday: {
      title: "Každodenná práca",
      body: "Vyskúšaj tieto bežné modely na písanie, programovanie a analýzu.",
    },
    open: {
      title: "Otvorené modely na programovanie a uvažovanie",
      body: "Vyskúšaj tieto otvorené modely na programovanie a uvažovanie. Porovnaj, ako zvládnu rovnaké zadanie.",
    },
    unfiltered: {
      title: "Modely bez cenzúry na analýzu",
      body: "Vyskúšaj tieto modely na analýzu, kód alebo dlhšie texty. Aj ony môžu zadanie odmietnuť.",
    },
    fiction: {
      title: "Hranie rolí a temná fikcia",
      body: "Pri dlhšom príbehu porovnaj veľkosť kontextových okien a skontroluj, či model prijíma obrázky.",
    },
    cheap: {
      title: "Lacnejšie modely",
      body: "Pozri si odhadovanú cenu na stránke modelu. Dlhšie vstupy a výstupy môžu spotrebovať viac kreditov.",
    },
    compare:
      "Porovnaj dostupné dvojice podľa ceny, kontextového okna a možností.",
    compareLink: "Porovnať {{a}} a {{b}}",
    guideLink: "Prečítať príručku ku všetkým modelom bez cenzúry",
  },
  privacy: {
    title: "Je čet s AI bez filtrov súkromný?",
    intro: "Záleží na priečinku. Takto fungujú jednotlivé možnosti.",
    incognito:
      "Čety v režime inkognito zostávajú v miestnom úložisku prehliadača. Konverzácia sa neukladá na naše servery. Vygenerované médiá dočasne ukladáme z technických dôvodov. Vymazaním údajov prehliadača stratíš históriu.",
    transit:
      "Každá správa aj tak prejde naším serverom k poskytovateľovi modelu, ktorý pripraví odpoveď. Tak funguje hostovaná AI. Spotrebu kreditov zaznamenávame kvôli účtovaniu.",
    memory:
      "V režime inkognito je pamäť vypnutá. Na trvalú pamäť potrebuješ bezplatný účet a súkromný priečinok.",
    private:
      "Súkromné čety sa ukladajú na server a vidíš ich len vo svojom účte. Otvoríš ich na každom zariadení, kde sa prihlásiš.",
    callout:
      "Stručne: história z režimu inkognito sa na našich serveroch neukladá. Správy však dostáva model, ktorý na ne odpovedá.",
  },
  pricing: {
    title: "Koľko to stojí?",
    intro: "Za modely platíš kreditmi z jedného zostatku.",
    free: "Mesačne zdarma: {{guestCredits}} kr. bez účtu, {{freeCredits}} kr. s bezplatným účtom alebo {{maxCredits}} kr. s účtom a odberom noviniek. Stačí na vyskúšanie viacerých modelov s vlastnými zadaniami.",
    sub: "Štyri mesačné plány. Najnižší ponúka {{subCredits}} kr. za {{subPrice}}.",
    pack: "Balíky pre predplatiteľov: {{packCredits}} kr. za {{packPrice}}. Platnosť balíkov nekončí. Platba kartou, cez PayPal alebo v kryptomene.",
    oneBalance:
      "Rovnaký zostatok pokrýva tvorbu obrázkov, videa a hudby, hlasový vstup a výstup aj vyhľadávanie na webe.",
    metered:
      "Cena za správu v kreditoch závisí od modelu. Modely Flash stoja zlomok ceny špičkového modelu. Cenu nájdeš na stránke každého modelu.",
    link: "Pozrieť si predplatné a balíky kreditov",
  },
  chatgptBetter: {
    title: "Kedy je lepšou voľbou ChatGPT?",
    intro: "V týchto prípadoch.",
    oneVendor:
      "Používaš len modely OpenAI a nenarážaš na odmietnutia. Jeden poskytovateľ, aplikácia a predplatné sú jednoduchšie.",
    flatRate:
      "Chceš pevnú cenu bez počítania nákladov za správu. U nás sa spotreba účtuje v kreditoch a každodenné používanie špičkových modelov môže byť drahé.",
    firstFeatures:
      "Chceš nové funkcie od laboratória hneď v deň vydania. Laboratóriá ich často najprv sprístupnia vo vlastných aplikáciách.",
    wantFilter:
      "Chceš obsahový filter. Detský účet alebo pracovisko s prísnymi pravidlami potrebuje ochranné opatrenia. Aj tu môžeš zostať pri bežných modeloch, no pevne obmedzený produkt môže vyhovovať lepšie.",
  },
  limits: {
    title: "Aké sú nevýhody?",
    intro: "Menej filtrov prináša aj obmedzenia. Zváž ich pred prechodom.",
    smaller:
      "Väčšina modelov bez cenzúry je menšia než špičkové modely. Viaceré sú určené na čet a fikciu, preto sú slabšie pri ťažkej analýze. UncensoredLM je určený na priame odpovede a pri programovaní je slabší. Špičkové bežné modely sú stále vhodnejšie na najťažšie uvažovanie a dlhé programátorské úlohy.",
    tools:
      "Nie každý model bez cenzúry volá nástroje. Ak potrebuješ vyhľadávanie na webe alebo iné nástroje, skontroluj stránku modelu.",
    vendor:
      "Bežné modely si zachovávajú ochranné opatrenia poskytovateľov. Zadanie môže odmietnuť aj model bez cenzúry.",
    responsibility:
      "Dôležité tvrdenia si over a zváž následky, skôr než odpoveď zdieľaš alebo podľa nej konáš.",
  },
  faq: {
    filters: {
      q: "Môžem v alternatíve k ChatGPT vypnúť ochranné opatrenia GPT?",
      a: "Model GPT si na {{appName}} zachováva ochranné opatrenia poskytovateľa. Model bez cenzúry má vlastné pravidlá. Keď ho vyberieš, odpovie iný model.",
    },
    title: "Časté otázky",
    free: {
      q: "Je {{appName}} zadarmo?",
      a: "Bez účtu {{guestCredits}} kr. zdarma mesačne. S bezplatným účtom {{freeCredits}} kr. S účtom a odberom noviniek {{maxCredits}} kr. Na ďalšie používanie je predplatné od {{subPrice}} mesačne.",
    },
    account: {
      q: "Potrebujem účet?",
      a: "Čet v režime inkognito funguje bez účtu. Na pamäť a čety uložené na serveri potrebuješ účet.",
    },
    api: {
      q: "Môžem tieto modely používať vo vlastných nástrojoch?",
      a: "Áno. Každé platené predplatné zahŕňa API kompatibilné s OpenAI. Jeden kľúč pre všetky modely vrátane tých bez cenzúry.",
    },
    openSource: {
      q: "Má {{appName}} otvorený zdrojový kód?",
      a: "Áno. Kód je otvorený pod licenciami MIT a GPL v3. Môžeš si spustiť vlastnú inštanciu.",
    },
    apiLink: "Nastaviť API v programovacích nástrojoch",
    selfHostLink: "Spustiť vlastnú inštanciu",
  },
  partners: {
    body: "Máš kanál, odberový zoznam alebo komunitu o AI? Partnerský program {{appName}} vypláca opakovanú províziu z každej platby, ktorú prinesie tvoje odporúčanie.",
    link: "Pozrieť partnerský program",
  },
  cta: {
    title: "Vyber si model a začni četovať",
    subtitle:
      "Začni bez účtu s mesačným limitom až {{guestCredits}} kr. zdarma.",
    chat: "Vyskúšať AI čet bez cenzúry",
    models: "Porovnať všetky modely",
  },
};
