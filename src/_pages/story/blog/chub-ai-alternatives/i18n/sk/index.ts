import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatívy k Chub AI: postavy, lorebooky a ceny (2026)",
    description:
      "Chub AI prijíma iba kryptomeny a obmedzil bezplatný čet. Porovnaj ceny, filtre, podporu mobilov a pamäť na {{appName}}, Janitor AI, SillyTavern, RisuAI, SpicyChat a CrushOn.",
    category: "Porovnanie",
    imageAlt: "Porovnanie alternatív k Chub AI na hranie rolí s postavami",
    keywords:
      "alternatívy k Chub AI, stránky ako Chub AI, alternatíva k chub.ai, alternatíva k Chub Venus, čet s kartami postáv, AI postavy bez cenzúry, hranie rolí s lorebookmi, aplikácie ako Chub AI, Janitor AI a Chub, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie",
    readTime: "9 min čítania",
    title: "Alternatívy k Chub AI na hranie rolí s postavami",
    subtitle:
      "{{appName}} a ďalšie alternatívy ({{count}}). Ceny, filtre a nápovedu sme overili na ich vlastných stránkach {{date}}.",
  },
  intro: {
    lead: "Chub má najväčšiu otvorenú knižnicu kariet postáv na webe. Od leta 2026 však prijíma platby len v kryptomenách, bezplatný denný limit je nízky a oficiálnu aplikáciu pre iPhone už nemá.",
    p2: "Pozri sa, kam môžeš presunúť svoje postavy. Každú možnosť sme overili na jej vlastných stránkach {{date}}. Sme medzi nimi aj my, preto uvádzame, v čom má Chub navrch.",
  },
  subject: {
    title: "Čo ponúka Chub AI",
    intro:
      "Vychádzame z dokumentácie Chub a z nezávislých recenzií, ktoré opisujú zmeny v platbách a limitoch.",
    plans:
      "Cena: {{plans}} za vlastné modely s neobmedzeným počtom správ podľa dokumentácie Chub. Podľa recenzií v roku 2026 prestali prijímať platby kartou. Plán sa platí kryptomenou.",
    filter:
      "Filter: Chub sa označuje za službu bez cenzúry a postavy neobmedzuje. Karty majú označenie SFW alebo NSFW. V niektorých regiónoch je vyhľadávanie obsahu NSFW zablokované.",
    privacy:
      "Súkromie: podľa Chub sa modely Mars netrénovali na četoch z Chub. Ak pripojíš vlastný backend, na odoslaný obsah platia pravidlá jeho poskytovateľa.",
    extra:
      "Bezplatne dostaneš pár skúšobných správ a malý denný limit na základnom modeli. Môžeš pripojiť aj vlastný kľúč API alebo lokálny model.",
  },
  why: {
    title: "Prečo ľudia hľadajú alternatívy",
    intro: "Pravidelne sa opakujú tri dôvody.",
    paywall:
      "Zmenili sa ceny aj limity. Lacnejší plán Mercury zrušili. Do denných limitov bezplatného četu sa počítajú aj opakované vygenerovania odpovede. Platby prijímajú iba v kryptomenách.",
    mobile:
      "Oficiálna aplikácia chýba. Chub zmizol z obchodu pre iOS a jeho názov teraz používajú napodobeniny.",
    setup:
      "Náročnejšie nastavenie. Dobrý výsledok si stále vyžaduje prehľad o predvoľbách, modeloch a nastavení kontextu.",
  },
  criteria: {
    title: "Čo porovnať pred prechodom",
    intro: "Týchto päť otázok ti pomôže vybrať, kam presunúť postavy.",
    one: "Karty: dá sa importovať PNG alebo JSON z Chub, alebo treba postavy vytvoriť nanovo?",
    two: "Pamäť: pomáhajú dlhý dej udržať lorebooky, pripnuté fakty alebo zhrnutia?",
    three:
      "Filter: aký obsah pre dospelých jednotlivé plány povoľujú a overujú vek?",
    four: "Cena: bezplatný limit, paušál alebo platba za správu? Čím sa dá platiť?",
    five: "Zariadenia: prehliadač, aplikácia v telefóne alebo lokálne riešenie, ktoré spravuješ sám?",
  },
  table: {
    title: "Porovnanie všetkých možností",
  },
  us: {
    title: "{{appName}}: postavy na ľubovoľnom modeli",
    intro:
      "Modely ({{modelCount}}) máš v jednom čete. Postava ostáva rovnaká, model môžeš meniť pri každej správe.",
    models:
      "Modely: {{uncensored}} bez cenzúry, {{mainstream}} bežných a {{open}} otvorených. {{ownModel}} sa trénoval na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory.",
    fit: "Postavy: spusti zručnosť na hranie rolí alebo si vytvor zručnosť s vlastnou postavou. Môžeš ju zdieľať alebo si ju nechať súkromnú. Pamäť prenáša fakty medzi četmi.",
    privacy:
      "Súkromie: inkognito čety ostávajú v lokálnom úložisku tvojho prehliadača aj bez účtu.",
    price:
      "Cena: každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek. Plány: {{planList}}. Zaplatíš kartou alebo kryptomenou. Balíky kreditov dobíjajú aktívny plán.",
    api: "API: rovnaké modely cez rozhrania kompatibilné s OpenAI a Anthropic. Prístup odomkne každý nákup.",
    weak: "V čom má Chub navrch: má oveľa väčšiu knižnicu kariet a jeho lorebooky reagujú na kľúčové slová. Import kariet Chub zatiaľ nemáme. Opis postavy môžeš vložiť do novej zručnosti.",
    ownLink: "Pozrieť model {{ownModel}}",
    skillLink: "Spustiť zručnosť na hranie rolí",
  },
  list: {
    title: "Podrobné porovnanie alternatív",
    intro:
      "Podrobné profily platforiem sme overili na ich vlastných stránkach. Ostatné alternatívy nájdeš v tabuľke vyššie.",
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
    title: "Kedy sa oplatí zostať pri Chub",
    intro: "V niektorých prípadoch sa pôvodná služba oplatí viac.",
    one: "Chceš mať na jednom mieste najväčšiu verejnú knižnicu komunitných kariet a lorebookov.",
    two: "Už máš vlastný backend. Chub môžeš použiť ako bezplatné rozhranie.",
    three:
      "Aj tak platíš kryptomenou a chceš neobmedzené správy za jeden paušál.",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorá alternatíva k Chub AI je najlepšia?",
      a: "Záleží na tom, čo ti chýba. Veľkú knižnicu postáv v prehliadači majú Janitor AI a Character Tavern. Úplnú kontrolu nad vlastnými kartami a lorebookmi ponúkajú SillyTavern a RisuAI. Spoločníka, ktorý si ťa pamätá, nájdeš v Kindroid alebo Nomi. Na {{appName}} môžeš postavy používať na bežných aj otvorených modeloch a modeloch bez cenzúry s jedným zostatkom kreditov.",
    },
    free: {
      q: "Existuje bezplatná alternatíva k Chub AI?",
      a: "Áno. Perchance a Character Tavern fungujú zdarma v prehliadači. SillyTavern, RisuAI a KoboldCpp sú bezplatné nástroje. Platíš len za model alebo si ho spustíš lokálne. Na {{appName}} máš každý mesiac {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom, {{maxCredits}} pri odbere noviniek.",
    },
    filter: {
      q: "Ktoré alternatívy k Chub povoľujú hranie rolí pre dospelých?",
      a: "Janitor AI, CrushOn, SpicyChat a Venice povoľujú text pre dospelých podľa vlastných pravidiel, väčšinou až po potvrdení veku. Character.AI ho nepovoľuje. Na {{appName}} sa modely bez cenzúry odomknú po jednorazovom potvrdení veku 18+. Obsah pre dospelých s neplnoletými zakazujú všetky tieto služby.",
    },
    privacy: {
      q: "Ktorá alternatíva uchová moje hranie rolí v súkromí?",
      a: "Pri lokálnom modeli v SillyTavern alebo KoboldCpp text neodíde z tvojho počítača. V online službe {{appName}} ostávajú inkognito čety v lokálnom úložisku prehliadača. Model na serveri poskytovateľa stále vidí správy, na ktoré odpovedá.",
    },
    move: {
      q: "Môžem si preniesť postavy z Chub?",
      a: "Stiahni kartu z Chub. SillyTavern, RisuAI a Agnaistic ju importujú bez úprav. Na {{appName}} vytvor zručnosť a vlož do nej opis, osobnosť a prvú správu.",
    },
  },
  cta: {
    title: "Tvoje postavy na ľubovoľnom modeli.",
    subtitle:
      "Každý mesiac máš {{guestCredits}} kreditov zdarma aj bez účtu. Začni hrať a vymeň model, keď si to príbeh vyžiada.",
    start: "Začať hrať roly",
    chat: "Otvoriť inkognito čet",
  },
};
