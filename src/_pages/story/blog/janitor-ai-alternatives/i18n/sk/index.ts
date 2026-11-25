import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Alternatívy k Janitor AI: hranie rolí, pamäť a ceny",
  description:
    "Jedenásť možností, ako pokračovať, keď Janitor AI vypadne, zabudne dej alebo hovorí za tvoju postavu. Bezplatný čet, lorebooky, modely a plány.",
  keywords:
    "alternatívy k Janitor AI, služby podobné Janitor AI, bezplatné hranie rolí s AI, karty postáv, virtuálni spoločníci",
  category: "Porovnanie",
  readTime: "5 min čítania",
  back: "Späť na blog",
  subtitle:
    "Jedenásť alternatív od bezplatného četu s postavami až po model na vlastnom počítači. Ceny sme overili {{date}}.",
  lead: "Ak ti postava z Janitor AI vyhovuje, ale jej odpovede nie, najprv skús zmeniť model. Ak chceš hrať offline, viesť si poznámky o svete príbehu alebo sa celé mesiace vracať k jednému spoločníkovi, záleží aj na aplikácii.",
  janitor: {
    title: "Čo ponúka Janitor AI",
    fit: "Prezerať komunitné postavy",
    intro:
      "Janitor AI je stránka s interaktívnou fikciou pre dospelých. Vyber si komunitnú postavu alebo vytvor vlastnú a spoločne píšte scénu. Podmienky vyžadujú vek aspoň 18 rokov a zakazujú explicitné verejné avatary. V pomocníkovi nájdeš aj postup na pripojenie externého modelu, napríklad z OpenRouter, pomocou vlastného kľúča API.",
    plans:
      "Bezplatný program ponúka neobmedzený čet na základných modeloch s kontextom asi 9 000 tokenov. Janitor+ uvádza päťnásobný kontext, prednostné odpovede a mesačný počet nových pokusov o odpoveď na prémiových modeloch. Janitor oznámil cenu 12,99 USD mesačne. Americký App Store uvádza rovnakú mesačnú cenu aj 99 USD za rok. Externý poskytovateľ môže účtovať osobitne.",
  },
  why: {
    title: "Prečo autori hľadajú inú službu",
    outage:
      "Počas výpadku sa jeden autor na Reddite pýtal, kam ísť po námety do knihy. Samotný Janitor 19. novembra odporučil adresu jani.com, kým obnoví pôvodnú doménu. Ak sa len nevieš dostať k svojim četom, najskôr skús túto adresu.",
    update: "Oznámenie Janitor AI o zmene domény",
    voice:
      "V inom vlákne opisovali používatelia opakujúce sa odpovede, zabudnuté detaily a boty, ktoré písali obe strany rozhovoru. Sú to jednotlivé skúsenosti. Pri príbehu s mnohými postavami hľadaj upraviteľné spomienky alebo knihu príbehového sveta. Ak bot hrá za teba, vyskúšaj rovnaký úvod s iným modelom.",
  },
  table: {
    scroll: "Ceny uvidíš posunutím tabuľky do strany.",
    title: "Janitor AI a jedenásť alternatív v skratke",
    intro:
      "Tabuľka porovnáva vybrané programy. Ceny konkurencie sú v amerických dolároch. Pri Kindroid a Nomi pochádzajú z amerického App Store. Nižšie nájdeš podmienky bezplatného používania aj limity.",
    fit: "Na čo sa hodí",
    price: "Cena alebo náklady na prevádzku",
  },
  us: {
    fit: "Výber modelu pre konkrétnu scénu",
    price: "Od {{subPrice}} mesačne",
    title: "{{appName}} pre scény, ktoré chceš písať po svojom",
    models:
      "{{appName}} prevádzkujeme my. V katalógu je {{modelCount}} četových modelov, z toho {{uncensored}} necenzurovaných. Pred ich použitím musí hosť aj prihlásený používateľ osobne potvrdiť vek aspoň 18 rokov a súhlas s nefiltrovanými odpoveďami. Súhlas môže v nastaveniach odvolať.",
    example: "Jedným z dostupných necenzurovaných modelov je {{ownModel}}.",
    skills:
      "Zručnosť Roleplay dáva modelu pokyn zostať v role a nerozhodovať o činoch tvojej postavy. Thea a Hermes sú vstavaní spoločníci na dlhšie rozhovory. Ak si chceš len vybrať z množstva hotových postáv, jednoduchšie je začať v katalógu Janitor AI.",
    limit:
      "Ako hosť dostaneš mesačne {{guestCredits}} kred. zdarma, s bezplatným účtom {{freeCredits}}. Prémiový model môže počas dlhej scény vyčerpať celý prídel. Ak chceš písať bez počítania odpovedí, viac ti môže vyhovovať bezplatný štandardný čet na Janitor AI.",
    link: "Pozrieť, ako funguje zručnosť Roleplay",
  },
  list: "Čo sa hodí pre tvoj ďalší príbeh?",
  heading: "{{name}}: {{fit}}",
  free: {
    janitor: "Neobmedzený štandardný čet",
    us: "Hosťovské kredity mesačne: {{guestCredits}}",
    characterAi: "Základné štýly bez obmedzenia",
    sillyTavern: "Bezplatné rozhranie",
    chub: "Závisí od pripojeného backendu",
    crushOn: "Bez obmedzenia na bezplatných modeloch",
    spicy: "Bezplatný program",
    venice: "10 textových zadaní denne",
    nanoGpt: "Jeden bezplatný model na webe",
    horde: "Výpočtový výkon dobrovoľníkov",
    kindroid: "Obmedzená ukážka",
    nomi: "50 správ denne",
  },
  offers: {
    characterAi: {
      fit: "Krátke moderované čety s postavami",
      body: "ShortSqueak sa hodí na krátke výmeny. PipSqueak 3 dáva scénam viac priestoru a pri oboch štýloch je počet bezplatných správ neobmedzený. Lite obmedzuje reklamy a umožňuje pripínať spomienky. Character.AI nepovoľuje pornografiu ani v platených programoch.",
    },
    sillyTavern: {
      fit: "Prenosné karty postáv",
      price: "Softvér zdarma, hardvér alebo API platíš osobitne",
      body: "Karty postáv aj poznámky o svete si nechaj v počítači. SillyTavern pripoj k miestnemu modelu na hranie bez internetu alebo k hostovanému modelu pomocou kľúča API. Rozhranie si nainštaluješ a model pripojíš sám.",
    },
    chub: {
      fit: "Spoločné svety s knihami pravidiel",
      body: "Kniha príbehového sveta v Chub môže doplniť históriu miesta až vtedy, keď sa spomenie jeho názov. V kontexte tak zostane viac miesta na aktuálnu scénu. Jednotlivé záznamy aj pravidlá ich aktivácie musíš vytvoriť sám. Chub pri programe Mars uvádza neobmedzené správy. Ak použiješ vlastný komerčný kľúč API, platíš jeho poskytovateľovi.",
    },
    crushOn: {
      fit: "Hotové postavy podľa žánru",
      body: "Vyber postavu a začni bez nastavovania API. Bezplatné modely umožňujú neobmedzený čet. Na vyskúšanie modelov Pro dostaneš mesačne 100 kreditov. Program Standard má 2 000 kreditov mesačne. Koľko správ za kredit dostaneš, závisí od modelu.",
    },
    spicy: {
      fit: "Upraviteľné spomienky postavy",
      body: "Môžeš začať zdarma. Platený Memory Manager umožňuje pripnúť sľub alebo opraviť detail, ktorý si postava opakovane mýli. Automatická sémantická pamäť je dostupná od programu True Supporter. Základné predplatné samo osebe nezaručí, že si postava vybaví každý detail dlhého príbehu.",
    },
    venice: {
      fit: "Súkromný čet a vlastné postavy",
      body: "Pro umožňuje vytvárať a zdieľať postavy a neobmedzuje počet štandardných textových zadaní. Bezplatný program má limit desať textových zadaní denne. Aj v Pro čerpajú špičkové modely kredity. Pred dlhou scénou si preto pozri, ktorý model používaš.",
    },
    nanoGpt: {
      fit: "Pripojenie modelu k inej aplikácii",
      body: "Na webe aj cez API môžeš používať ten istý kreditný zostatok a platiť podľa spotreby. Pro zahŕňa vybrané otvorené modely s týždenným prídelom na vstup. Bezplatný model je iba na webe. Po pripojení vlastnej aplikácie k NanoGPT sa preto jej volania API naďalej účtujú.",
    },
    horde: {
      fit: "Písanie s výpočtovým výkonom komunity",
      price: "Zdarma cez AI Horde",
      body: "KoboldAI Lite má editor v prehliadači s vetvením príbehu, poznámkami o svete aj poľom pre fakty, ktoré má mať model stále na pamäti. Text generujú dobrovoľníci v AI Horde. Vlastnú grafickú kartu ani predplatné nepotrebuješ, no dostupné modely a čakanie závisia od toho, kto je práve pripojený.",
    },
    kindroid: {
      fit: "Jeden spoločník na hlasové hovory aj video",
      body: "Vymysli postave minulosť, daj jej hlas a zavolaj jej cez video. Hodí sa to na dlhodobý vzťah s jednou postavou. Bežná trojdňová skúška prémiového programu vyžaduje spôsob platby a automaticky sa obnoví, ak ju nezrušíš. Krátka bezplatná ukážka je samostatná ponuka.",
    },
    nomi: {
      fit: "Skupina spoločníkov, ku ktorým sa vraciaš",
      body: "Nomi stavia na spoločníkovi, ktorý si medzi rozhovormi zachováva spomienky. V skupinovom čete môžu postavy reagovať aj na seba. Začať môžeš zdarma, na častejšie používanie sú platené programy. Ak chceš na jednej postave porovnávať cudzie modely, vlastný systém spoločníkov Nomi sa na to veľmi nehodí.",
    },
  },
  faq: {
    title: "Časté otázky",
    free: {
      q: "Kde môžem písať zadarmo?",
      a: "Character.AI ponúka neobmedzený filtrovaný čet. Na CrushOn môžeš bez obmedzenia používať bezplatné modely. V KoboldAI Lite s AI Horde neplatíš za odpoveď, ak počkáš na voľný počítač dobrovoľníka.",
    },
    memory: {
      q: "Kde si postava lepšie zapamätá staršie kapitoly?",
      a: "Fakty, ktoré musia v príbehu stále platiť, ulož do knihy príbehového sveta v Chub alebo do poľa pamäte v KoboldAI Lite. Na dlhodobý vzťah s jednou postavou vyskúšaj Nomi. Ani veľké kontextové okno neuchová detail, keď z neho raz vypadne.",
    },
    move: {
      q: "Musím pri zmene modelu opustiť svoju postavu na Janitor AI?",
      a: "Nie. Príručka k proxy v Janitor AI ukazuje, ako pripojiť iného poskytovateľa k existujúcemu četu. Pri prechode na inú službu si over podporované formáty postáv a odlož si kópiu vlastného opisu aj poznámok k scénam.",
    },
  },
  related: {
    character: "Porovnať alternatívy k Character.AI",
    hub: "Preskúmať necenzurované modely AI",
  },
  cta: {
    title: "Vyskúšať scénu so zručnosťou Roleplay",
    start: "Vybrať model na hranie rolí",
  },
};
