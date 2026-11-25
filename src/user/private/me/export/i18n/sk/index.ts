import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účet",
  get: {
    title: "Exportovať moje údaje",
    titleShort: "Exportovať údaje",
    description:
      "Stiahni si všetky údaje, ktoré o tebe uchovávame: profil, čety, spomienky, zručnosti, kredity, odporúčania, odber noviniek a adresy. Dostaneš súbor JSON aj čitateľné zhrnutie.",
    tags: { export: "Export údajov" },
    response: {
      json: { title: "Úplné údaje (JSON)" },
      jsonFilename: { title: "Názov súboru JSON" },
      markdown: { title: "Zhrnutie (Markdown)" },
      markdownFilename: { title: "Názov súboru so zhrnutím" },
    },
    success: {
      title: "Export je pripravený",
      description: "Archív tvojich údajov je pripravený",
    },
    md: {
      heading: "Export tvojich údajov",
      generated: "Vygenerované",
      account: "Účet",
      email: "E-mail",
      name: "Meno",
      memberSince: "Účet od",
      contents: "Obsah",
      records: "záz.",
      note: "Všetky podrobnosti nájdeš v súbore JSON. Export obsahuje iba údaje prepojené s tvojím účtom.",
    },
    widget: {
      intro:
        "Stiahni si svoje údaje. Dostaneš úplný súbor JSON a čitateľné zhrnutie vo formáte Markdown. Export obsahuje iba údaje z tvojho účtu.",
      downloadJson: "Stiahnuť JSON",
      downloadMarkdown: "Stiahnuť zhrnutie",
      generate: "Pripraviť export",
      preparing: "Pripravuje sa…",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na export údajov sa prihlás",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Tieto údaje nemôžeš exportovať",
      },
      notFound: {
        title: "Nenájdené",
        description: "Účet sa nenašiel",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      server: {
        title: "Export zlyhal",
        description: "Export sa nepodarilo pripraviť. Skús to neskôr.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Vyskytol sa konflikt",
      },
    },
  },
};
