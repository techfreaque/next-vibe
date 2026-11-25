import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Kontrola zaúčtovania",
  description:
    "Skontrolujte platné účtovné zápisy a ich prepojenia s vystavenými odberateľskými faktúrami a so schválenými alebo uhradenými dodávateľskými faktúrami.",
  tag: "Kontrola účtovníctva",
  company: {
    label: "Firma",
    description: "Vyberte firmu, ktorej zaúčtovanie chcete skontrolovať.",
    choose: "Vyberte firmu",
    empty:
      "Vyberte firmu a skontrolujte jej účtovné zápisy a väzby na doklady.",
  },
  filters: {
    issue: "Nezrovnalosť",
    all: "Všetky zistenia",
    matches: "Zodpovedajúce nezrovnalosti",
  },
  issues: {
    missingLines: "Chýbajúce riadky zápisov",
    invalidLegs: "Neplatné riadky účtovného zápisu",
    invoiceLink: "Prepojenia účtovných zápisov s odberateľskými faktúrami",
    billLink: "Prepojenia účtovných zápisov s dodávateľskými faktúrami",
  },
  reasons: {
    fewLines:
      "Účtovný zápis má menej ako dva riadky. Otvorte ho a skontrolujte pôvodný zdroj.",
    invalidLegs:
      "Aspoň v jednej mene sa sumy na stranách Má dať a Dal nezhodujú alebo je na riadku neplatná suma, účet či strana. Otvorte účtovný zápis a skontrolujte riadky.",
    noBacklink:
      "Doklad nie je prepojený so žiadnym účtovným zápisom. Pred zaúčtovaním alebo evidovaním platby skontrolujte zdrojový doklad.",
    wrongPosting:
      "Prepojený účtovný zápis chýba, pochádza z iného zdroja alebo už nie je platný. Skontrolujte históriu zaúčtovania dokladu.",
    controlLeg:
      "Prepojený účtovný zápis má neplatný zostatok, menu alebo kontrolnú sumu. Pred evidovaním úhrady skontrolujte zdrojový doklad.",
  },
  columns: {
    record: "Záznam",
    date: "Dátum záznamu",
    reason: "Zistenie",
    counterparty: "Obchodný partner",
    open: "Otvoriť záznam",
  },
  records: {
    journal: "Účtovný zápis",
    invoice: "Odberateľská faktúra",
    bill: "Dodávateľská faktúra",
    journalDate: "Dátum účtovného zápisu",
    invoiceDate: "Faktúra vytvorená",
    billDate: "Dátum dodávateľskej faktúry",
    dateInfo: "{{label}} {{date}}",
    openJournal: "Otvoriť zápis",
    openInvoice: "Otvoriť vydanú faktúru",
    openBill: "Otvoriť prijatú faktúru",
  },
  pagination: {
    pageLabel: "Strana",
    pageSize: "Počet riadkov na strane",
    totalPages: "Celkový počet strán",
    previous: "Späť",
    next: "Ďalej",
    pageInfo: "Strana {{page}} z {{total}}",
    firstPage: "Prvá strana",
    emptyPage: "Na tejto strane nie sú žiadne riadky",
  },
  widget: {
    loading: "Načítava sa kontrola zaúčtovania",
    empty: "Žiadne problémy so zaúčtovaním nezodpovedajú filtrom",
    coverage:
      "Kontrola zahŕňa platné pôvodné účtovné zápisy, vystavené odberateľské faktúry s kladnou sumou a schválené alebo uhradené dodávateľské faktúry.",
    back: "Späť",
  },
  success: {
    title: "Kontrola je dokončená",
    description: "Účtovné zápisy a väzby na doklady sú skontrolované.",
  },
  errors: {
    validation: {
      title: "Skontrolujte filtre prehľadu",
      description:
        "Zadajte platný filter zistení, číslo strany a počet výsledkov na stranu.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Na kontrolu účtovných zápisov sa prihláste.",
    },
    forbidden: {
      title: "Firma nie je dostupná",
      description: "Nemáte prístup k účtovným záznamom tejto firmy.",
    },
    notFound: {
      title: "Záznam sa nenašiel",
      description: "Požadovaný záznam sa nepodarilo nájsť.",
    },
    server: {
      title: "Kontrolu zaúčtovania sa nepodarilo načítať",
      description: "Skúste prehľad načítať znova.",
    },
    network: {
      title: "Pripojenie nie je dostupné",
      description: "Skontrolujte pripojenie a skúste to znova.",
    },
    conflict: {
      title: "Konflikt údajov v prehľade",
      description: "Obnovte údaje a spustite prehľad znova.",
    },
    unknown: {
      title: "Neočakávaná chyba",
      description: "Skúste to znova alebo kontaktujte podporu.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Pred odchodom zmeny uložte alebo zahoďte.",
    },
  },
};
