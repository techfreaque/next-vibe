import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Predplatné",
  tags: {
    subscription: "predplatné",
    admin: "správca",
  },
  post: {
    title: "Ročné plány: mesačné kredity",
    titleShort: "Kredity pre ročné plány",
    description:
      "Pripíše za aktuálny mesiac kredity ku každému ročnému plánu. Spúšťa sa denne. Kredity sa pripíšu raz za mesiac a ich platnosť sa skončí na konci mesiaca.",
    response: {
      scanned: "Skontrolované ročné plány",
      granted: "Mesiace s práve pripísanými kreditmi",
      credits: "Pripísané kredity",
    },
    widget: {
      hint: "Spúšťa sa automaticky každý deň. Dá sa spustiť aj ručne. Za ten istý mesiac sa kredity nikdy nepripíšu dvakrát.",
      submit: "Pripísať za tento mesiac",
      summary:
        "Skontrolované ročné plány: {{scanned}} · Mesiace s pripísanými kreditmi: {{granted}} · Kredity: {{credits}}",
    },
  },
  task: {
    description: "Pripisuje ročným plánom ich mesačné kredity",
  },
  backfill: {
    title: "Ročné plány: doplniť kredity za vynechané mesiace",
    titleShort: "Doplniť kredity ročných plánov",
    description:
      "Vyhľadá mesiace aktuálneho ročného obdobia, za ktoré chýbajú mesačné kredity. Skúšobný beh ich vypíše. Po jeho vypnutí sa kredity pripíšu jednorazovo v jednom balíku s platnosťou do konca obdobia.",
    fields: {
      dryRun: {
        label: "Skúšobný beh",
        description: "Zobrazí, čo by sa pripísalo, bez pripísania kreditov",
      },
    },
    response: {
      dryRun: "Skúšobný beh",
      subscriptions: "Predplatné",
      months: "Vynechané mesiace",
      credits: "Kredity",
      rows: "Predplatné",
      subscriptionId: "Predplatné",
      userEmail: "Používateľ",
      plan: "Plán",
      periodStart: "Začiatok obdobia",
      periodEnd: "Koniec obdobia",
      currentMonth: "Aktuálny mesiac",
      missedMonths: "Vynechané mesiace",
      status: "Stav",
    },
    widget: {
      hint: "Najprv skontroluj skúšobný beh. Za rovnaké predplatné a obdobie sa kredity pripíšu iba raz. Opakované spustenie ďalšie kredity nepridá.",
      submit: "Doplniť kredity",
      preview:
        "Skúšobný beh. Predplatné: {{subscriptions}} · Vynechané mesiace: {{months}} · Kredity na pripísanie: {{credits}}.",
      done: "Pripísané. Predplatné: {{subscriptions}} · Mesiace: {{months}} · Kredity: {{credits}}.",
    },
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontroluj požiadavku",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihlás sa ako správca",
    },
    forbidden: {
      title: "Iba pre správcov",
      description: "Kredity z plánov môžu pripísať iba správcovia",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Zdroj sa nenašiel",
    },
    conflict: {
      title: "Konflikt",
      description: "Údaje sa medzičasom zmenili. Spusti operáciu znova.",
    },
    server: {
      title: "Chyba servera",
      description: "Kredity ročných plánov sa nepodarilo pripísať",
      detail: "Pripísanie kreditov ročných plánov zlyhalo: {{error}}",
    },
    network: {
      title: "Chyba siete",
      description: "Požiadavka sa nedostala na server",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv zmeny ulož alebo zahoď",
    },
  },
  success: {
    title: "Hotovo",
    description: "Kredity ročných plánov sa spracovali",
  },
};
