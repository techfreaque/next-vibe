import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Newsletter",
  post: {
    title: "Hromadné odoslanie newslettera",
    titleShort: "Odoslanie newslettera",
    description:
      "Odošlite jednorazový newsletter iba odberateľom s potvrdeným súhlasom. Skúšobný režim zobrazí ich počet podľa jazykového nastavenia. Pri okamžitom odoslaní sa odošle iba tento newsletter.",
    container: {
      title: "Hromadné odoslanie newslettera",
      description:
        "Iba odberatelia s potvrdeným súhlasom. Spočítajte ich, zaraďte správy do frontu a odošlite newsletter.",
    },
    fields: {
      dryRun: {
        label: "Skúšobný režim",
        description:
          "Spočíta príjemcov s potvrdeným súhlasom podľa jazykového nastavenia. Žiadne údaje sa nezapíšu a žiadne správy sa neodošlú.",
      },
      send: {
        label: "Odoslať teraz",
        description:
          "Odošlite newsletter ihneď odberateľom, ktorí udelili súhlas. Ostatné čakajúce kampane zostanú bez zmeny.",
      },
    },
    response: {
      audience: "Odberatelia s potvrdeným súhlasom",
      byLocale: "Príjemcovia podľa jazykových nastavení",
      scheduled: "Práve zaradené do frontu",
      alreadyPending: "Už vo fronte",
      cancelled: "Zrušené (bez súhlasu)",
      alreadySent: "Preskočené (už dostali)",
      duplicates: "Zrušené duplicitné záznamy",
      errors: "Chyby",
      sent: "Odoslané",
      sendSkipped: "Preskočené pri odosielaní (už dostali)",
      sendFailed: "Odoslanie zlyhalo",
    },
    success: {
      title: "Newsletter zaradený do frontu",
      description:
        "Príjemcovia s potvrdeným súhlasom sú vo fronte. Ak je zapnuté „Odoslať teraz“, dostanú newsletter pri tomto spustení.",
    },
  },
  errors: {
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Na hromadné odoslanie newslettera sa prihláste.",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Hromadne odoslať newsletter môžu iba správcovia.",
    },
    server: {
      title: "Niečo sa pokazilo",
      description:
        "Hromadné odoslanie newslettera sa nepodarilo spustiť. Skúste to znova.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba.",
    },
    validation: {
      title: "Neplatný vstup",
      description: "Skontrolujte požiadavku a skúste to znova.",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Požadovaný zdroj sa nenašiel.",
    },
    conflict: {
      title: "Konflikt",
      description: "Táto akcia je v rozpore s aktuálnym stavom.",
    },
    network: {
      title: "Chyba siete",
      description: "Nastala chyba siete. Skúste to znova.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny.",
    },
  },
};
