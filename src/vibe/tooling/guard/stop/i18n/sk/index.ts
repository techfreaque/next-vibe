import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Systémový Guard",

  title: "Zastaviť Guard",
  titleShort: "Zastaviť Guard",
  description: "Zastaviť prostredie Guard pre projekty VS Code",
  tag: "guard",

  container: {
    title: "Nastavenia zastavenia prostredia Guard",
    description: "Nastaviť parametre zastavenia prostredí Guard",
  },

  fields: {
    projectPath: {
      title: "Cesta k projektu",
      description: "Cesta k adresáru projektu",
      placeholder: "/path/to/your/project",
    },
    guardId: {
      title: "ID prostredia Guard",
      description: "ID prostredia Guard, ktoré sa má zastaviť",
      placeholder: "guard_project_abc123",
    },
    username: {
      title: "Používateľské meno",
    },
    wasRunning: {
      title: "Bolo spustené",
    },
    nowRunning: {
      title: "Aktuálne beží",
    },
    pid: {
      title: "ID procesu",
    },
    forceStopped: {
      title: "Vynútene zastavené",
    },
    stopAll: {
      title: "Zastaviť všetky prostredia Guard",
      description: "Zastaviť všetky bežiace prostredia Guard",
    },
    force: {
      title: "Vynútiť zastavenie",
      description:
        "Vynúti zastavenie aj vtedy, keď prostredie Guard neodpovedá",
    },
    success: {
      title: "Úspech operácie",
    },
    output: {
      title: "Výstup príkazu",
    },
    stoppedGuards: {
      title: "Zastavené prostredia Guard",
    },
    totalStopped: {
      title: "Celkový počet zastavených",
    },
  },

  errors: {
    validation: {
      title: "Chyba overenia",
      description: "Neplatné parametre požiadavky",
    },
    internal: {
      title: "Interná chyba",
      description: "Nastala chyba interného servera",
    },
    unauthorized: {
      title: "Bez oprávnenia",
      description: "Vyžaduje sa prihlásenie",
    },
    forbidden: {
      title: "Prístup zakázaný",
      description: "Prístup zakázaný",
    },
    notFound: {
      title: "Nenájdené",
      description: "Zdroj sa nenašiel.",
    },
    conflict: {
      title: "Konflikt",
      description: "Nastal konflikt údajov",
    },
    missingTarget:
      "Neplatný vstup. Zadajte projectPath, guardId alebo stopAll.",
    stopFailed: "Interná chyba pri zastavovaní prostredia Guard: {{detail}}",
  },

  success: {
    title: "Úspech",
    description: "Zastavenie prostredia Guard je dokončené",
  },
};
