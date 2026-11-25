import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",

  post: {
    title: "Pripomienka registrácie",
    titleShort: "Pripomienka registrácie",
    description:
      "Pošle jednu pripomienku ľuďom, ktorí začali registráciu a ešte nepotvrdili e-mail. Nový kód a odkaz platia 24 hodín.",
    tag: "Pripomienka registrácie",
    container: {
      title: "Pripomienka registrácie",
      description:
        "Nepotvrdené registrácie, pri ktorých posledný e-mail odišiel pred 2 až 24 hodinami",
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
      candidates: "Nepotvrdené registrácie v danom období",
      sent: "Odoslané pripomienky",
      skipped: "Preskočené",
      failed: "Zlyhalo",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Pripomienky registrácie môžu posielať iba správcovia",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      server: {
        title: "Chyba servera",
        description: "Pripomienky registrácie sa nepodarilo odoslať",
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
      description: "Pripomienky registrácie sa spracovali",
    },
  },
  task: {
    name: "Pripomienka registrácie",
    description:
      "Každých 30 minút skontroluje nepotvrdené registrácie. Jednu pripomienku odošle, ak od posledného e-mailu uplynuli aspoň 2 hodiny.",
  },
};
