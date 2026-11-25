import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Stage",
  titleShort: "Vibe Stage",
  description:
    "Pridá do indexu Git šablónové súbory (route.ts, i18n/*/index.ts), ktoré prejdú kontrolou vzorov. Pridá aj súbory so zmenami iba v importoch. Pri zmiešaných zmenách pridá len časti diffu s importmi.",

  fields: {
    dryRun: {
      label: "Skúšobné spustenie",
      description:
        "Zobrazí, ktoré súbory by sa pridali do indexu, bez spustenia príkazu git add",
    },
    paths: {
      label: "Obmedziť na cesty",
      description:
        "Zohľadní iba súbory v zadaných cestách. Ak pole necháte prázdne, skontroluje všetky zmeny mimo indexu Git.",
      placeholder: "napr. src",
    },
  },

  response: {
    staged: "Pridané do indexu",
    partiallyStaged: "Pridané čiastočne (iba importy)",
    skipped: "Preskočené (porušenia pravidiel)",
    renamed: "Premenované alebo presunuté",
    deleted: "Odstránené (generované súbory a testovacie dáta)",
    noChanges:
      "V pracovnom strome sa nenašli súbory vhodné na pridanie do indexu Git",
    dryRunNote: "Skúšobné spustenie. Do indexu Git sa nepridali žiadne súbory.",
  },

  errors: {
    validation: {
      title: "Neplatné parametre",
      description: "Parametre vibe stage sú neplatné",
    },
    internal: {
      title: "Interná chyba",
      description: "Nastala chyba pri spustení vibe stage",
    },
    unauthorized: {
      title: "Bez oprávnenia",
      description: "Spustenie vibe stage vyžaduje prihlásenie",
    },
    forbidden: {
      title: "Prístup zakázaný",
      description: "Prístup k vibe stage je zakázaný",
    },
    notFound: {
      title: "Nenájdené",
      description: "Nenašiel sa žiadny repozitár Git",
    },
    server: {
      title: "Chyba servera",
      description: "Chyba servera nastala počas vibe stage",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Neznáma chyba sa vyskytla počas vibe stage",
    },
    unsaved: {
      title: "Neuložené zmeny",
      description: "Zistili sa neuložené zmeny",
    },
    conflict: {
      title: "Konflikt",
      description: "Konflikt nastal počas vibe stage",
    },
  },

  success: {
    title: "Pridávanie do indexu dokončené",
    description: "Šablónové súbory boli pridané do indexu Git",
  },

  widget: {
    title: "Vibe Stage",
    subtitle:
      "Automaticky pridať do indexu Git šablónové súbory, ktoré prejdú kontrolou vzorov",
    submit: "Pridať zmeny do indexu",
    dryRun: "Skúšobné spustenie",
    staged: "Pridané do indexu",
    partiallyStaged: "Pridané čiastočne",
    skipped: "Preskočené",
    renamed: "Premenované",
    deleted: "Odstránené",
    stagedCount: "súbory v indexe",
    partiallyStaged_count: "súbory pridané čiastočne (iba importy)",
    skippedCount: "preskočené súbory (porušenia pravidiel)",
    renamedCount: "presuny pridané do indexu",
    deletedCount: "odstránenia pridané do indexu",
    renameFile: "presunuté",
    deleteFile: "odstránené",
    noChanges: "Nenašli sa súbory vhodné na pridanie do indexu Git",
    noChangesHint:
      "Tu sa zobrazia šablónové súbory aj súbory so zmenami v importoch.",
    dryRunBadge: "Skúšobné spustenie",
    dryRunNote: "Iba náhľad. Do indexu Git sa nepridali žiadne súbory.",
    cleanFile: "bez porušení",
    partialFile: "iba importy",
    violationsFile: "porušenia",
    loading: "Prebieha kontrola pracovného stromu…",
  },
};
