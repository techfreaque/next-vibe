import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Predplatné",
    company: "Spoločnosť",
    get: "Načítať",
  },
  view: {
    empty: "Žiadne predplatné",
    emptyHelp: "Na svojom účte nemáte žiadne predplatné.",
    status: "Stav",
    interval: "Interval fakturácie",
    periodStart: "Začiatok aktuálneho obdobia",
    periodEnd: "Koniec aktuálneho obdobia",
    unavailable: "Nie je evidované",
    provider: "Poskytovateľ platby",
    cancellation: "Zrušenie",
    endOfPeriod: "Na konci obdobia",
    scheduled: "Plánované zrušenie",
    canceled: "Dátum zrušenia",
    ended: "Dátum ukončenia",
    open: "Otvoriť podrobnosti predplatného",
    list: "Späť na predplatné",
  },
  get: {
    title: "Predplatné vlastníka",
    titleShort: "Predplatné vlastníka",
    description: "Zobrazte si osobné predplatné vlastníka firmy.",
    companyId: {
      label: "ID spoločnosti",
      description: "Spoločnosť, ktorej predplatné chcete načítať",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné ID spoločnosti",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť predplatné spoločnosti, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte prístup k predplatnému tejto spoločnosti",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      server: {
        title: "Chyba servera",
        description: "Niečo sa pokazilo. Skúste znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie a skúste znova",
      },
      notFound: {
        title: "Predplatné sa nenašlo",
        description: "Táto spoločnosť nemá predplatné",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Predplatné načítané",
      description: "Predplatné spoločnosti sa načítalo",
    },
  },
};
