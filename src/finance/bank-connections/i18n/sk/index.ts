import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  possibleDuplicateBookings:
    "Pohyby sa môžu prekrývať so skorším importom. Pred ďalším pokusom skontrolujte bankový účet v hlavnej knihe. Neuložil sa žiadny pohyb.",
  privacyBeforeImport:
    "Pred náhľadom alebo importom pohybov nastavte pravidlá ochrany súkromia.",
  previewResult: "Výsledok náhľadu",
  importResult: "Výsledok importu",
  bookingDay: "Dátum zaúčtovania {{date}}",
  bookingWindow: "Účtovné obdobie od {{from}} do {{to}}",
  providerBookings: "Skontrolované pohyby od poskytovateľa",
  eligibleBookings: "Povolené firemné pohyby",
  savedBookings: "Uložené pohyby",
  previewPrivacyResult:
    "Vyradené pohyby nespĺňali Vaše pravidlá ochrany súkromia. Faktúry sa párujú pri uložení. Nejednoznačné zhody zostávajú nespárované.",
  importPrivacyResult:
    "Vyradené pohyby nespĺňali Vaše pravidlá ochrany súkromia. Nejednoznačné zhody s faktúrami zostávajú nespárované.",
  setup: "Nastaviť bankové prepojenie",
  setupHint:
    "Uložte účtovný účet a počiatočný dátum. Potom nastavte súkromie. Pri nastavení sa transakcie nenačítajú.",
  privacyAction: "Nastaviť súkromie",
  privacyRequired:
    "Pred načítaním bankových transakcií uložte nastavenia súkromia.",
  setupSaved:
    "Bankové prepojenie sa uložilo. Teraz môžete nastaviť pravidlá pre dodávateľov.",
  supplierTotals: "Sumy podľa spárovaných dodávateľov za obdobie",
  errors: {
    validation: {
      title: "Skontrolujte zadané údaje",
      description:
        "Vyberte firmu a aktívny bankový účet v mene firmy, na ktorý možno účtovať.",
    },
    network: {
      title: "Chyba siete",
      description: "Skontrolujte pripojenie a skúste to znova.",
    },
    unauthorized: {
      title: "Prihlásenie je povinné",
      description: "Na párovanie bankových transakcií sa prihláste.",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Vaša rola vo firme neumožňuje túto akciu.",
    },
    notFound: {
      title: "Riadok bankového výpisu alebo účet nie je k dispozícii",
      description: "Skontrolujte vybranú firmu a bankový účet.",
    },
    server: {
      title: "Operácia s výpisom zlyhala",
      description:
        "Skúste to znova. Pri neúspešnej operácii zostanú záznamy bez zmeny.",
    },
    unknown: {
      title: "Neočakávaná chyba pri práci s výpisom",
      description: "Skúste to znova.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Formulár obsahuje neuložené zmeny.",
    },
    conflict: {
      title: "Konflikt pri párovaní bankových transakcií",
      description: "Obnovte výpis a skontrolujte vybraný zápis.",
    },
  },
  maintenance: "Údržba bankových pripojení",
  maintenanceHint:
    "Vymaže súkromné údaje po uplynutí lehoty uchovávania, upozorní majiteľov účtov na končiaci sa súhlas a aktualizuje zapnuté pripojenia.",
  completed: "Aktualizované pripojenia",
  failedFeeds: "Pripojenia na kontrolu",
  notified: "Odoslané upozornenia",
  matchedOnly: "Ponechať iba pohyby zodpovedajúce pravidlám pre dodávateľov",
  discardedCount: "Vyradené",
  autoMatched: "Spárované s faktúrami",
  discardHint:
    "Pohyby bez zhody sa vyradia bez uloženia podrobností. Ak chcete použiť súkromný zoznam na kontrolu, túto možnosť vypnite.",
  company: "Spoločnosť",
  account: "Bankový účet v hlavnej knihe",
  start: "Prvý deň účtovania",
  daily: "Načítavať denne",
  connect: "Pripojiť banku",
  review: "Skontrolovať pohyby",
  held: "Na kontrolu",
  privateCount: "Súkromné",
  connected: "Banka bola pripojená.",
  failed: "Banku sa nepodarilo pripojiť. Skúste ju pripojiť znova.",
  check: "Overiť aplikáciu",
  active: "Aplikácia má povolený prístup k informáciám o účtoch.",
  inactive: "Prístup aplikácie k informáciám o účtoch nie je aktívny.",
  appUnavailable: "Stav aplikácie sa nepodarilo overiť.",
  linking:
    "Prepojením v portáli poskytovateľa sprístupníte účet na pripojenie. V tejto aplikácii raz udeľte súhlas. Účty s platným súhlasom sa zobrazia automaticky.",
  pick: "Vyberte účet, ktorý chcete použiť na náhľad zaúčtovaných pohybov.",
  apply: "Spustiť import",
  previewAction: "Náhľad importu",
  dailyHint:
    "Vyberte počiatočný dátum a pred importom skontrolujte priradenie dodávateľov.",
  title: "Pripojené bankové účty",
  description:
    "Skontrolujte alebo importujte zaúčtované pohyby z bankového účtu s udeleným súhlasom.",
  select: "Vyberte bankové pripojenie",
  preview: "Iba náhľad",
  sync: "Načítať bankové pohyby",
  connection: "Bankové pripojenie",
  consentUntil: "Súhlas platí do",
  period: "Obdobie zaúčtovania",
  imported: "Importované",
  skipped: "Už importované",
  unavailable:
    "Bankové pripojenie nie je dostupné. Skontrolujte pripojenie a prístup k účtu.",
  consent: "Platnosť súhlasu uplynula. Pred načítaním ho obnovte v banke.",
  rateLimit: "Banka je vyťažená. Skúste to neskôr.",
  invalidResponse:
    "Banka vrátila neúplný výpis. Posledný dátum importu sa zachoval.",
  windowTooLarge:
    "Obdobie obsahuje príliš veľa pohybov. Importujte kratší výpis.",
  empty: "Žiadne pripojené bankové účty",
  noBookings: "V tomto období neboli zaúčtované žiadne pohyby.",
  newBookings: "Nové pohyby",
  through: "Posledný importovaný deň",
};
