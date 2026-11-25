import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k Character.AI na hranie rolí (2026)",
    category: "Hranie rolí s AI",
    description:
      "Porovnanie alternatív k Character.AI na hranie rolí, fikciu a rozhovory s postavami: Janitor AI, SpicyChat, DreamGen, SillyTavern aj {{appName}}.",
    imageAlt:
      "Alternatívy k Character.AI na hranie rolí a rozhovory s virtuálnym spoločníkom",
    keywords:
      "alternatívy k Character.AI, Character.AI bez filtra, hranie rolí s AI, Janitor AI, SillyTavern",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Hranie rolí s AI",
    readTime: "9 min čítania",
    title: "Alternatívy k Character.AI na hranie rolí",
    subtitle:
      "Vyber si knižnicu postáv, spoločníka s pamäťou alebo vlastný model. Ceny sme overili {{date}}.",
  },
  intro: {
    lead: "Ak chceš prechádzať postavy a rýchlo začať scénu, vyskúšaj Janitor AI. Ak chceš mať celé nastavenie pod kontrolou, spusti SillyTavern vo svojom zariadení. Ak si hľadáš jedného spoločníka, ktorý si ťa zapamätá, vyber si Kindroid alebo Nomi.",
    p2: "{{appName}} vyvíjame my. V prehľade je na prvom mieste pre výber modelov a import postáv. Ceny platených programov sme {{date}} overili na odkazovaných oficiálnych stránkach alebo v ponukách vydavateľov. Ceny konkurencie uvádzame v amerických dolároch.",
  },
  characterAi: { title: "Čo dnes ponúka Character.AI" },
  switch: {
    title: "Prečo ľudia hľadajú inú službu",
    intro: "Vo verejných diskusiách sa opakujú tri rôzne dôvody.",
    reasons: {
      filtering: {
        body: "Prerušené scény. V komunitnom ozname z augusta 2025 Character.AI priznala, že používatelia sa často sťažujú na príliš časté zásahy filtra.",
        source: "Komunitný oznam Character.AI na Reddite",
      },
      continuity: {
        body: "Strata súvislostí. Jeden z diskutujúcich hľadal model s lepšou pamäťou a uveriteľným dialógom aj v pomalých scénach. Chcel, aby mu zároveň nechal priestor rozhodovať za vlastnú postavu.",
        source: "Diskusia o hraní rolí a pamäti na Reddite",
      },
      oldSite: {
        body: "Zmeny služby. V diskusii o tom, čo ľudí priviedlo k odchodu, jeden používateľ uviedol, že definitívne prešiel inam až po zrušení pôvodného webu.",
        source: "Diskusia o odchode z Character.AI na Reddite",
      },
    },
  },
  criteria: {
    title: "Čo si overiť pred prechodom",
    intro:
      "Zahraj tú istú scénu v dvoch aplikáciách. Na druhý deň sa k nej vráť a spýtaj sa na detail zo začiatku.",
    filter:
      "Over si, ktoré témy model povoľuje a či platforma vyžaduje overenie veku.",
    memory:
      "Zisti, čo sa stane s detailmi, keď už nie sú súčasťou aktívneho kontextu. Hľadaj uložené spomienky, súhrny alebo knihy s pravidlami príbehového sveta.",
    price:
      "Porovnaj počet správ alebo kreditov, ktoré spotrebuje tvoj obľúbený model. Započítaj aj nové pokusy o tú istú odpoveď.",
    privacy: "Skontroluj, kde je uložený prepis a kto spracúva zadania.",
    characters:
      "Chceš si vybrať z hotových postáv, upravovať vlastnú kartu postavy alebo sa vracať k jednému spoločníkovi?",
  },
  table: {
    title: "Porovnanie Character.AI a ďalších možností",
  },
  us: {
    title: "1. {{appName}}: prines si postavu a vyber pre ňu model",
    intro:
      "Začni novú scénu v prehliadači alebo si postavu pre ďalšie príbehy vytvor ako zručnosť.",
    models:
      "Katalóg má {{modelCount}} četových modelov, z toho {{uncensored}} necenzurovaných, {{mainstream}} bežných a {{open}} otvorených. Model môžeš zmeniť aj uprostred scény.",
    characters:
      "Zručnosť Roleplay pomáha modelu zostať v role. Prejdi si zverejnené zručnosti, vytvor postavu v editore alebo ju spolu s tebou navrhne Tvorca zručností.",
    consent:
      "Pri prvom použití necenzurovaného modelu potvrdíš, že máš aspoň 18 rokov a súhlasíš s nefiltrovanými odpoveďami.",
    import:
      "Postavu môžeš importovať z verejného odkazu na Character.AI alebo Talkie. V kópii zostane uvedený pôvodný autor.",
    privacy:
      "Čet v režime inkognito funguje aj bez účtu. Prepis sa ukladá v tvojom prehliadači, ale jednotlivé zadania pri odpovedaní dostáva poskytovateľ modelu.",
    price:
      "Ako hosť máš mesačne {{guestCredits}} kred., s bezplatným účtom {{freeCredits}}. Predplatné sa začína od {{subPrice}} mesačne. Spotreba kreditov závisí od používania modelu.",
    weak: "Character.AI a Janitor AI ponúkajú širší výber komunitných postáv. Ak hráš veľa, služba s pevným paušálom ti môže lepšie vyhovovať aj vďaka predvídateľným nákladom.",
    skillsLink: "Prezrieť vstavané a komunitné zručnosti",
    roleplayLink: "Otvoriť zručnosť Hranie rolí",
    creatorLink: "Vytvoriť postavu s Tvorcom zručností",
  },
  list: {
    title: "Deväť alternatív podrobnejšie",
    intro:
      "Vyber si podľa svojho štýlu hrania. V odkazoch si môžeš overiť podrobnosti, na ktorých ti záleží.",
    heading: "{{number}}. {{name}}: {{bestFor}}",
    filter: "Pravidlá obsahu",
    price: "Cena",
    pro: "Prednosť",
    con: "Obmedzenie",
    versusLink: "Porovnanie {{appName}} a {{name}}",
  },
  options: {
    characterAi: {
      summary:
        "Character.AI má verejné aj vlastné postavy pre textové hranie rolí. Podporuje hlasy a hovory. Oprávnení používatelia majú v bezplatnom programe naďalej neobmedzené bežné správy.",
      pricing:
        "Bežné čety sú zdarma. V USA sú dostupné programy {{plans}}. Lite pridáva časť prémiových funkcií, reklamy však zostávajú. Plus sprístupňuje všetky pamäťové funkcie a odstraňuje reklamu.",
      filter:
        "Pornografický obsah je zakázaný. Používatelia mladší ako 18 rokov nemajú prístup k voľnému četu s postavami.",
      privacy: "Dostupná je voľba pre používanie údajov na trénovanie",
      pro: "Veľká knižnica fanúšikovských postáv so vstavanými hlasmi a hovormi.",
      con: "Platené programy pridávajú funkcie. Pravidlá pre explicitný obsah sú rovnaké.",
    },
    janitorAi: {
      bestFor: "komunitné postavy",
      summary:
        "Čet s miliónmi komunitných botov, upraviteľnými postavami používateľa a voliteľným pripojením externého modelu.",
      pricing:
        "Počet bežných správ nie je obmedzený. Americký App Store uvádza {{plans}}.",
      filter:
        "Postavy v kategórii Limitless môžu zahŕňať témy pre dospelých. Mobilná aplikácia sa spúšťa v bezpečnom režime.",
      privacy: "Externá proxy môže prijímať zadania",
      pro: "Rozsiahla knižnica postáv a neobmedzený bežný čet zdarma. Janitor+ pridáva päťnásobný kontext, prednostné odpovede a opakované generovanie na prémiových modeloch.",
      con: "Bezplatný kontext má približne 9 000 tokenov. Samostatnú proxy treba nastaviť a jej prevádzka môže byť spoplatnená.",
    },
    sillyTavern: {
      bestFor: "vlastná lokálna prevádzka",
      summary:
        "Bezplatné rozhranie s otvoreným kódom pre lokálne aj hostované modely. Importuje karty postáv a podporuje knihy príbehového sveta aj predvoľby zadaní.",
      pricing:
        "Softvér je zdarma. Lokálny model beží na tvojom hardvéri. Hostované API sa účtujú samostatne.",
      filter: "O filtrovaní obsahu rozhoduje model a zvolený backend.",
      privacy:
        "Súbory četu zostávajú uložené lokálne. Ak použiješ hostované API, dostáva zadania.",
      pro: "Karty postáv, pravidlá sveta, zadanie aj model máš pod kontrolou. Celé prostredie môžeš prevádzkovať u seba.",
      con: "Rozhranie si nainštaluješ a udržiavaš sám. Pripojiť musíš aj backend. Na lokálne modely potrebuješ vhodný hardvér.",
    },
    chub: {
      bestFor: "knihy príbehového sveta a vetvenie zápletky",
      summary:
        "Karty postáv, knihy s pravidlami príbehového sveta, viacero postáv v jednom čete a vetvenie príbehu.",
      pricing:
        "Chub príležitostne ponúka jednorazové skúšobné kredity. Hostované predplatné stojí {{plans}}. Ceny externých modelov sa líšia.",
      filter:
        "Chub označuje vlastné modely za necenzurované. Externí poskytovatelia majú samostatné pravidlá.",
      privacy:
        "Zdieľané čety sa môžu zobraziť verejne. Externé API dostávajú zadania.",
      pro: "Rozvetvi scénu, pripoj knihu pravidiel sveta a exportuj čety do formátu JSONL pre SillyTavern alebo do obyčajného textu.",
      con: "Na hostované hranie potrebuješ predplatné alebo vlastný backend. Skúšobné kredity sú obmedzené a nový účet ich nemusí dostať.",
      free: "Príležitostné skúšobné kredity",
    },
    crushOn: {
      bestFor: "hotové postavy na hranie pre dospelých",
      summary:
        "Komunitné postavy, skupinové scény, prednastavené hlasy a prepínanie modelov bez vlastného kľúča API.",
      pricing:
        "Na bezplatných modeloch môžeš četovať bez obmedzenia a mesačne máš 100 kreditov na modely Pro. Mesačné možnosti: {{plans}}.",
      filter:
        "Hranie pre dospelých je dostupné. Pokročilé modely majú vlastné pravidlá prístupu a limity kreditov.",
      privacy:
        "Z preskúmaných zásad ochrany súkromia nie je jasné, čo vidí tvorca postavy",
      pro: "Vyber si komunitnú postavu, priprav skupinovú scénu a zmeň model aj počas rozhovoru.",
      con: "Prístup k modelom Pro a Ultra sa líši. Predplatné automaticky neznamená neobmedzené používanie všetkých modelov.",
    },
    spicyChat: {
      bestFor: "postavy a identity pre dospelých",
      summary:
        "Hostovaná služba na hranie rolí pre dospelých s komunitnými postavami, viacerými používateľskými identitami a platenými pamäťovými funkciami.",
      pricing:
        "Bezplatný program má kontext 4 096 tokenov. Ročné možnosti v USA: {{plans}}. Mesačné ceny nájdeš na webe služby.",
      filter:
        "Hranie pre dospelých je povolené. Verejné postavy podliehajú moderovaniu.",
      privacy:
        "Hostovaná služba. Odpovede vychádzajú z kontextu aktuálneho četu.",
      pro: "S predplatným môžeš preskočiť rad a upravovať spomienky. Vyššie programy pridávajú významové vyhľadávanie v pamäti a obrázky z rozhovoru.",
      con: "Bezplatný program zahŕňa reklamy a čakanie v rade. Prevod textu na reč a podrobné nastavenia generovania sú až v najvyššom programe.",
    },
    kindroid: {
      bestFor: "spoločník na živé hovory",
      summary:
        "Vytvor spoločníka s vlastnou minulosťou a trvalými spomienkami. Môže posielať selfie a telefonovať hlasom aj cez video.",
      pricing:
        "Jednorazová ukážka zahŕňa 50 správ, v niektorých regiónoch 15. Americký App Store uvádza {{plans}}. Platba na webe môže byť lacnejšia.",
      filter:
        "Pre dospelých. Kindroid uvádza, že v prípadoch závažného ohrozenia ľudí zasahuje na úrovni účtu.",
      privacy: "Šifrovanie pri prenose aj uložení",
      pro: "Hlasové hovory aj videohovory, správy z iniciatívy spoločníka, skupinový čet a selfie. Všetko nadväzuje na dlhodobý vzťah s jednou postavou.",
      con: "Po skončení ukážky alebo predplatného môžeš účet už len čítať. Vyššie úrovne pamäti sú za príplatok.",
      free: "Jednorazová ukážka",
    },
    nomi: {
      bestFor: "spoločník s denným četom zdarma",
      summary:
        "Virtuálny spoločník s dlhodobou pamäťou, selfie a skupinovým četom. Predplatné pridáva hlas.",
      pricing: "Denne je zdarma 50 správ. Platené možnosti: {{plans}}.",
      filter:
        "Pre dospelých. Podľa Nomi je text bez filtrov, pre obrázky platia samostatné obmedzenia.",
      privacy: "Nomi uvádza, že osobné údaje nepredáva ani neprenajíma",
      pro: "Vracaj sa k tomu istému spoločníkovi alebo ich prizvi do jedného skupinového četu.",
      con: "Bezplatný čet má denný limit. Hlas vyžaduje predplatné.",
    },
    venice: {
      bestFor: "súkromné čety s postavami a tvorba médií",
      summary:
        "Venice ponúka postavy popri všeobecnom čete s AI, generovaní obrázkov a výbere modelov.",
      pricing:
        "Bezplatný program má na základných modeloch denne 10 textových a 15 obrazových zadaní. {{plans}}. Vlastné postavy vyžadujú Pro.",
      filter:
        "Filter obsahu pre dospelých je od začiatku zapnutý. Oprávnení používatelia Pro ho môžu vypnúť.",
      privacy: "História četu predvolene zostáva v zariadení",
      pro: "Okrem postáv môžeš používať bežný čet a generovať obrázky. Platené programy ponúkajú voliteľnú šifrovanú zálohu.",
      con: "Bezplatné textové správy majú limit. Prémiové modely a niektoré médiá čerpajú kredity.",
    },
    nanoGpt: {
      bestFor: "výber modelov s platbou podľa spotreby",
      summary:
        "Webový čet a API na prepínanie textových a mediálnych modelov. Použi predvoľbu alebo pridaj vlastné zadanie pre postavu.",
      pricing:
        "Jeden bezplatný model na webe. Prvé dobitie od 0,10 USD v kryptomene alebo od 1 USD kartou. {{plans}}. PRO zahŕňa vybrané otvorené modely.",
      filter: "Pre dospelých. Obmedzenia závisia od modelu aj poskytovateľa.",
      privacy:
        "História predvolene zostáva v zariadení. Podmienky poskytovateľov sa líšia.",
      pro: "Platíš podľa spotreby. API funguje aj s rozhraniami ako SillyTavern.",
      con: "Nastavenie postavy alebo rozhranie si pripravíš sám. Väčšina modelov čerpá z tvojho zostatku.",
    },
  },
  import: {
    title: "Ako si preniesť postavu z Character.AI",
    intro: "Nový príbeh môžeš začať s údajmi, ktoré tvorca postavy zverejnil.",
    steps: {
      account: {
        title: "Prihlás sa",
        body: "Použi bezplatný účet, aby si mohol importovanú postavu neskôr upraviť.",
      },
      create: {
        title: "Otvor editor postáv",
        body: "Na stránke Zručnosti vytvor vlastnú zručnosť a vyber možnosť importu z odkazu.",
      },
      paste: {
        title: "Vlož verejný odkaz",
        body: "Použi odkaz z Character.AI alebo Talkie. Z verejnej stránky sa skopírujú dostupné polia, napríklad meno, avatar, pozdrav a opis. Ak je verejná aj definícia postavy, môže sa skopírovať tiež.",
      },
      model: {
        title: "Vyber model",
        body: "Otvor rozhovor so svojou kópiou postavy. Model môžeš meniť bez opustenia vlákna.",
      },
    },
    callout:
      "Import uvedie pôvodného tvorcu a odkaz na zdroj. História predchádzajúcich rozhovorov zostáva v pôvodnej službe.",
  },
  privacy: {
    title: "Kde sa ukladá tvoj čet",
    intro: "Takto funguje režim inkognito na {{appName}}.",
    incognito:
      "Prepis je uložený v prehliadači. Keď vymažeš jeho úložisko, vymaže sa aj prepis.",
    transit:
      "Každé zadanie ide cez našu službu k poskytovateľovi modelu. Na účely fakturácie zaznamenávame spotrebu kreditov.",
    callout:
      "Ak chceš úplne miestnu prevádzku, pripoj SillyTavern k modelu na vlastnom hardvéri.",
  },
  stay: {
    title: "Kedy zostať pri Character.AI",
    intro:
      "Character.AI stále vyhovuje tým, ktorí hľadajú známe postavy a príležitostný moderovaný čet.",
    library:
      "Už máš obľúbené komunitné postavy a používaš vstavané hlasové hovory.",
    flat: "Četuješ najmä v bežnom režime a neobmedzené bezplatné správy sú pre teba dôležitejšie ako výber modelu.",
    callout:
      "Pôvodná aplikácia dáva zmysel, ak jej tvorivé nástroje a obsahové pravidlá vyhovujú príbehom, ktoré píšeš.",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Čím najlepšie nahradiť Character.AI?",
      a: "Ak chceš veľa postáv, pozri Janitor AI. Na lokálnu prevádzku a knihy príbehového sveta slúži SillyTavern. Na dlhodobého spoločníka sa hodia Kindroid a Nomi. {{appName}} ti umožní importovať verejnú postavu a prepínať medzi modelmi.",
    },
    free: {
      q: "Existuje bezplatná alternatíva k Character.AI?",
      a: "Janitor AI ponúka neobmedzené štandardné čety. Nomi má 50 správ denne. SillyTavern je bezplatný softvér, ku ktorému pripojíš model. V {{appName}} máš mesačne {{guestCredits}} kred. bez účtu alebo {{freeCredits}} s bezplatným účtom.",
    },
    import: {
      q: "Môžem si z Character.AI preniesť postavy aj rozhovory?",
      a: "S bezplatným účtom na {{appName}} môžeš z verejného odkazu na Character.AI alebo Talkie importovať sprístupnené polia postavy. Súkromné definície a staré rozhovory zostávajú v pôvodnej službe.",
    },
    nsfw: {
      q: "Ktoré alternatívy umožňujú textové hranie pre dospelých?",
      a: "Kategória Limitless v Janitor AI aj služby CrushOn a SpicyChat povoľujú text pre dospelých podľa vlastných pravidiel. Pri SillyTavern rozhoduje pripojený backend. {{appName}} sprístupní necenzurované modely po potvrdení veku 18+.",
    },
    private: {
      q: "Ktorú alternatívu môžem prevádzkovať lokálne?",
      a: "SillyTavern môžeš pripojiť k miestnemu modelu a čety ponechať na vlastnom počítači. Venice aj režim inkognito na {{appName}} ukladajú históriu v tvojom zariadení, ale zadania stále spracúvajú hostovaní poskytovatelia.",
    },
    account: {
      q: "Môžem si {{appName}} vyskúšať bez účtu?",
      a: "Áno. Otvor čet v režime inkognito a použi hosťovské kredity. Prihlásenie potrebuješ na import postavy alebo synchronizáciu uložených četov medzi zariadeniami.",
    },
    memory: {
      q: "Ktoré služby sa hodia na dlhé scény?",
      a: "Chub a SillyTavern používajú knihy príbehového sveta, ktoré podľa potreby doplnia detaily do kontextu. Kindroid a Nomi sa sústredia na pamäť spoločníkov. Pred zaplatením sa vráť k staršej scéne a over si, čo si model skutočne pamätá.",
    },
    roleplayLink: "Hranie rolí s AI bez filtra",
    kindsLink: "V čom sa líšia necenzurované modely AI",
  },
  partners: {
    body: "Vedieš komunitu hráčov? V partnerskom programe {{appName}} dostávaš {{referralPercent}} % z každej sprostredkovanej platby.",
    link: "Pozrieť si partnerský program",
  },
  cta: {
    title: "Vyber model a začni scénu",
    subtitle:
      "Ako hosť môžeš začať s {{guestCredits}} bezplatnými kreditmi každý mesiac.",
    start: "Začať hrať rolu",
    skills: "Prezrieť zručnosti",
  },
};
