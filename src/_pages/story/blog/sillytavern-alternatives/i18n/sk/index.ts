import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k SillyTavern bez nastavovania (2026)",
    description:
      "SillyTavern je zadarmo, vyžaduje však Node.js a backend a nedá sa nainštalovať na iPhone. Porovnaj {{appName}}, RisuAI, Agnaistic, KoboldCpp, Janitor AI a LM Studio.",
    category: "Porovnanie",
    imageAlt: "Porovnanie online a lokálnych alternatív k SillyTavern",
    keywords:
      "alternatívy k SillyTavern, aplikácie ako SillyTavern, SillyTavern pre iPhone, SillyTavern online, SillyTavern bez inštalácie, RisuAI a SillyTavern, KoboldCpp, Agnaistic, rozhranie na hranie rolí s AI, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie",
    readTime: "9 min čítania",
    title: "Alternatívy k SillyTavern bez nastavovania",
    subtitle:
      "{{appName}} a ďalšie alternatívy ({{count}}), od otvorených rozhraní po webové čety. Údaje sme overili na ich stránkach {{date}}.",
  },
  intro: {
    lead: "SillyTavern je nástroj na hranie rolí s AI pre náročných. Je zadarmo, má otvorený kód a môžeš si ho podrobne nastaviť. Potrebuješ však Node.js, backend pre model, konfiguračný súbor a na Androide aj Termux.",
    p2: "Niekomu taká voľnosť vyhovuje. Iný sa chce rovno pustiť do písania. Alternatívy sme overili {{date}}. Nájdeš medzi nimi otvorené nástroje, ktoré používajú rovnaké karty, aj online aplikácie bez inštalácie.",
  },
  subject: {
    title: "Čo ponúka SillyTavern",
    intro:
      "Verzia 1.19.1 vyšla 19. novembra 2026. Vychádzame z dokumentácie projektu.",
    plans:
      "Cena: zadarmo a s otvoreným kódom (AGPL-3.0). Vývojári vlastnú online službu neprevádzkujú. Platíš podľa pripojeného API, pri lokálnom modeli je používanie zdarma.",
    filter:
      "Filter: SillyTavern nemá vlastný filter. O povolenom obsahu rozhoduje pripojený model alebo poskytovateľ.",
    privacy:
      "Súkromie: čety sa ukladajú do dátového priečinka tvojej inštalácie. Na všetko, čo odošleš cez cloudové API, platia zásady poskytovateľa.",
    extra:
      "Nastavenie: potrebuješ Node.js 20 alebo novší, Git a backend. Na Androide sa používa Termux, na iPhone SillyTavern nenainštaluješ. Vzdialený prístup vyžaduje zoznam povolených adries alebo heslo. Dokumentácia varuje pred sprístupnením služby na internete.",
  },
  why: {
    title: "Prečo ľudia hľadajú alternatívy",
    intro: "V zdrojoch samotného projektu sa opakujú štyri dôvody.",
    setup:
      "Nastavenie backendu. Lokálne backendy sa môžu nastavovať zložito a tím SillyTavern ich nepodporuje.",
    mobile:
      "Mobily. Android potrebuje Termux a môže server na pozadí vypnúť. Na iPhone aplikáciu nenainštaluješ.",
    security:
      "Bezpečnosť si spravuješ sám. Verzia 1.19.1 opravila chybu, ktorá umožňovala spúšťanie skriptov z kariet postáv a importovaných četov.",
    cost: "Dva poplatky. Za spravovanú službu platíš hosting. K nemu sa pripočítava cena za API modelu.",
  },
  criteria: {
    title: "Čo porovnať pred prechodom",
    intro: "Pomôže ti päť otázok.",
    one: "Inštalácia: prehliadač, desktopová aplikácia alebo vlastný server, ktorý musíš aktualizovať?",
    two: "Karty: podporuje import PNG alebo JSON kariet a lorebookov zo SillyTavern a Chub?",
    three:
      "Modely: použiješ vlastný kľúč API, lokálny model alebo modely v cene služby?",
    four: "Funkcie: skupinové čety, lorebooky, generovanie obrázkov a hlasový režim.",
    five: "Cena: bezplatný nástroj s poplatkami za API, paušál alebo platba za správu?",
  },
  table: {
    title: "Porovnanie všetkých možností",
  },
  us: {
    title: "{{appName}}: modely pripravené bez inštalácie",
    intro:
      "Otvor prehliadač na ľubovoľnom zariadení vrátane iPhonu. Modely ({{modelCount}}) sú už pripojené, takže kľúč API nepotrebuješ.",
    models:
      "Modely: {{uncensored}} bez cenzúry, {{mainstream}} bežných a {{open}} otvorených. {{ownModel}} sa trénoval na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory.",
    fit: "Postavy: použi zručnosť na hranie rolí alebo si vytvor vlastnú postavu ako zručnosť. Pamäť prenáša fakty medzi četmi. Scénu môžeš ilustrovať v tom istom vlákne pomocou obrazových modelov ({{imageModels}}).",
    privacy:
      "Súkromie: inkognito čety ostávajú v lokálnom úložisku tvojho prehliadača aj bez účtu.",
    price:
      "Cena: každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Plány: {{planList}}. Všetky modely čerpajú z jedného zostatku.",
    api: "API: rozhrania kompatibilné s OpenAI a Anthropic umožňujú pripojiť SillyTavern k našim modelom. Prístup odomkne každý nákup.",
    weak: "V čom má SillyTavern navrch: dáva ti úplnú kontrolu nad zadaniami, predvoľbami a rozšíreniami. Podporuje skupinové čety, lorebooky a import kariet. Aj náš kód je otvorený, ale naša platforma má širšie zameranie.",
    ownLink: "Pozrieť model {{ownModel}}",
    skillLink: "Spustiť zručnosť na hranie rolí",
  },
  list: {
    title: "Podrobné porovnanie alternatív",
    intro:
      "Podrobné profily platforiem sme overili na ich vlastných stránkach. Rozhrania s otvoreným kódom nájdeš v tabuľke vyššie.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modely:",
    filter: "Filter:",
    price: "Cena:",
    priceValue: "Bezplatný plán: {{free}}. Platené plány: {{plans}}.",
    pro: "Hlavná výhoda:",
    con: "Na čo si dať pozor:",
    forWho: "Hodí sa ti, ak:",
    versusLink: "{{appName}} a {{name}}: úplné porovnanie",
    visit: "Navštíviť {{name}}",
  },
  stay: {
    title: "Kedy sa oplatí zostať pri SillyTavern",
    intro: "Pre mnohých pokročilých používateľov je to stále dobrá voľba.",
    one: "Spúšťaš modely lokálne a chceš, aby všetky dáta ostali v počítači.",
    two: "Využívaš rozšírenia, predvoľby, regulárne výrazy a skupinové čety.",
    three:
      "Už máš kľúče API a chceš pre všetky služby jedno rozhranie. Môžeš medzi ne zaradiť aj náš kľúč.",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá alternatíva k SillyTavern je najlepšia?",
      a: "Najbližšie má RisuAI, otvorený nástroj s lorebookmi, skupinovými četmi a webovou verziou. Na jednoduché lokálne použitie skús KoboldCpp alebo LM Studio. Knižnicu postáv online majú Janitor AI a Chub. Modely pripravené bez inštalácie nájdeš na {{appName}}.",
    },
    free: {
      q: "Existuje bezplatná alternatíva k SillyTavern?",
      a: "RisuAI, Agnaistic, KoboldCpp a Talemate sú bezplatné nástroje. Za model však platíš, pokiaľ ho nespustíš na vlastnom hardvéri. Na {{appName}} máš každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek a modely už máš pripojené.",
    },
    filter: {
      q: "Ktoré alternatívy umožňujú hranie rolí bez cenzúry?",
      a: "Rozhrania preberajú pravidlá pripojeného modelu, preto si vyber model bez cenzúry. Lokálne spustíš abliterované modely v KoboldCpp alebo LM Studio. Na {{appName}} máš po jednorazovom potvrdení veku 18+ prístup k modelom bez cenzúry ({{uncensored}}). Janitor AI a Chub povoľujú hranie rolí pre dospelých podľa vlastných pravidiel.",
    },
    privacy: {
      q: "Poskytuje online alternatíva rovnaké súkromie ako SillyTavern?",
      a: "Lokálny model spracúva všetko na tvojom počítači. Model na serveri poskytovateľa vidí zadanie, na ktoré odpovedá. V inkognito režime na {{appName}} ostáva história len v prehliadači.",
    },
    move: {
      q: "Môžem používať SillyTavern na iPhone?",
      a: "SillyTavern môžeš spustiť na počítači alebo serveri a otvoriť v Safari. Potrebuješ však nastaviť vzdialený prístup. Webové aplikácie ako {{appName}} alebo Janitor AI na iPhone fungujú aj bez tohto kroku.",
    },
  },
  cta: {
    title: "Pusti sa do príbehu bez nastavovania.",
    subtitle:
      "Každý mesiac máš {{guestCredits}} kreditov zdarma. Nepotrebuješ účet ani kľúč API.",
    start: "Začať hrať roly",
    chat: "Otvoriť inkognito čet",
  },
};
