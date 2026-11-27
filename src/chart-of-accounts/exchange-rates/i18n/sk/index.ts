import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účtovníctvo",
  tags: {
    ledger: "hlavná-kniha",
    fx: "fx",
    rates: "kurzový-lístok",
  },
  fields: {
    companyId: "Spoločnosť",
    baseCurrency: "Základná mena",
    quoteCurrency: "Cieľová mena",
    rate: "Výmenný kurz",
    rateDate: "Dátum kurzu",
    source: "Zdroj",
    asOfDate: "Dátum precenenia",
    dryRun: "Iba náhľad",
    postReversalNextDay: "Automatické storno na ďalší deň",
    currency: "Mena",
    limit: "Max. riadkov",
  },
  list: {
    title: "Výmenné kurzy",
    titleShort: "FX kurzy",
    description:
      "Denné referenčné kurzy ECB a ručné kurzy pre viacmenové účtovníctvo",
    syncEcbAction: "Synchronizovať kurzy ECB",
    setManualAction: "Pridať ručný kurz",
    revalueAction: "Závierkové precenenie FX",
    empty:
      "Zatiaľ nie sú uložené žiadne výmenné kurzy. Synchronizujte denné kurzy ECB alebo pridajte ručný kurz.",
    countLabel: "Uložené kurzy",
    latestDate: "Posledný dátum kurzu",
    success: "Výmenné kurzy načítané",
  },
  set: {
    title: "Nastaviť ručný výmenný kurz",
    description:
      "Uložte ručný výmenný kurz (1 základná mena = kurz cieľovej meny). Ručný kurz má v rovnaký deň prednosť pred ECB.",
    action: "Uložiť kurz",
    success: "Výmenný kurz uložený",
  },
  sync: {
    title: "Synchronizovať denné kurzy ECB",
    description:
      "Načítať najnovšie referenčné kurzy eura zverejnené Európskou centrálnou bankou",
    action: "Načítať kurzy ECB teraz",
    success: "Denné kurzy ECB synchronizované",
    upsertedCount: "Aktualizované kurzy",
  },
  revaluation: {
    title: "Precenenie cudzích mien na konci obdobia",
    description:
      "Preceniť otvorené pohľadávky, záväzky a bankové zostatky v cudzích menách záverečným kurzom",
    action: "Spustiť FX precenenie",
    previewAction: "Náhľad precenenia",
    postAction: "Zaúčtovať precenenie",
    success: "FX precenenie dokončené",
    noAdjustments:
      "Žiadne otvorené zostatky v cudzej mene nevyžadujú precenenie.",
    functionalCurrency: "Funkčná mena",
    totalUnrealized: "Nerealizovaný kurzový zisk/strata",
    journalEntryId: "Účtovný zápis precenenia",
    reversalEntryId: "Storno na ďalší deň",
    missingRates: "Meny bez záverečného kurzu",
    account: "Účet",
    foreignBalance: "Pôvodný zostatok",
    carryingFunctional: "Účtovná hodnota",
    closingRate: "Záverečný kurz",
    revaluedFunctional: "Precenená hodnota",
    unrealizedDelta: "Nerealizovaný rozdiel",
    previewBanner: "Iba náhľad. Neboli zaúčtované žiadne zápisy.",
    postedBanner: "Nerealizované FX precenenie bolo zaúčtované.",
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontrolujte kódy mien, dátum a hodnotu kurzu.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihláste sa pre prístup ku kurzom a FX preceneniu.",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Pre túto akciu sú potrebné účtovné oprávnenia.",
    },
    notFound: {
      title: "Nenájdené",
      description: "Spoločnosť alebo kurzové údaje sa nenašli.",
    },
    conflict: {
      title: "Konflikt",
      description: "Chýba otvorené účtovné obdobie alebo požadované FX účty.",
    },
    network: {
      title: "Chyba siete",
      description: "Nepodarilo sa pripojiť k zdroju kurzov ECB.",
    },
    server: {
      title: "Chyba servera",
      description: "Nastala neočakávaná chyba pri spracovaní FX údajov.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Nastala neočakávaná chyba.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny.",
    },
  },
};
