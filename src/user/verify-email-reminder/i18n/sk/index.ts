import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",

  post: {
    title: "Pripomienka overenia e-mailu",
    titleShort: "Pripomenúť overenie",
    description:
      "Pošle jednu pripomienku, ak e-mail zostane nepotvrdený 24 hodín od registrácie. Bezplatné kredity sú dostupné po potvrdení adresy.",
    tag: "Pripomenúť overenie",
    container: {
      title: "Pripomienka overenia e-mailu",
      description: "Stále neoverené účty vytvorené pred 24 až 25 hodinami",
    },
    fields: {
      batchSize: {
        label: "Veľkosť dávky",
        description: "Maximálny počet pripomienok na jedno spustenie",
      },
      dryRun: {
        label: "Skúšobný beh",
        description: "Spočíta príjemcov pripomienky bez jej odoslania",
      },
    },
    response: {
      candidates: "Neoverené účty v danom období",
      sent: "Odoslané pripomienky",
      skipped: "Preskočené",
      failed: "Zlyhalo",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Pripomienky overenia môžu odosielať iba správcovia",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      server: {
        title: "Chyba servera",
        description: "Pripomienky overenia sa nepodarilo odoslať",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné nastavenia pripomienok",
      },
    },
    success: {
      title: "Pripomienky spracované",
      description: "Pripomienky overenia e-mailu sa spracovali",
    },
  },
  task: {
    name: "Pripomienka overenia e-mailu",
    description:
      "Každú hodinu skontroluje neoverené účty. Ak od registrácie uplynulo 24 hodín, odošle jednu pripomienku.",
  },
};
