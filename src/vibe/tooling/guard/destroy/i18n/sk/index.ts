import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Systémový Guard",

  title: "Odstrániť prostredie Guard",
  titleShort: "Odstrániť prostredie Guard",
  description: "Odstráni prostredia Guard a vyčistí ich zdroje.",
  tag: "guard-management",
  container: {
    title: "Nastavenie odstránenia prostredia Guard",
    description: "Nastavenie parametrov odstránenia prostredí Guard",
  },
  fields: {
    projectPath: {
      title: "Cesta k projektu",
      description: "Cesta k adresáru projektu",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "ID prostredia Guard",
      description: "Jedinečné ID prostredia Guard",
      placeholder: "guard_my_project_abc123",
    },
    force: {
      title: "Vynútiť odstránenie",
      description: "Odstráni prostredie Guard aj počas jeho prevádzky.",
    },
    cleanupFiles: {
      title: "Odstrániť súbory",
      description: "Odstráni všetky súbory súvisiace s prostredím Guard.",
    },
    dryRun: {
      title: "Skúšobné spustenie",
      description: "Zobrazí, čo by sa odstránilo. Zmeny nevykoná.",
    },
    success: {
      title: "Úspech",
    },
    output: {
      title: "Výstup",
    },
    destroyedGuards: {
      title: "Odstránené prostredia Guard",
    },
    warnings: {
      title: "Upozornenia",
    },
    totalDestroyed: {
      title: "Celkový počet odstránených",
    },
    username: {
      title: "Používateľské meno",
    },
    wasRunning: {
      title: "Bolo spustené",
    },
    filesRemoved: {
      title: "Odstránené súbory",
    },
    userRemoved: {
      title: "Používateľ bol odstránený",
    },
  },
  form: {
    title: "Nastavenia odstránenia",
    description: "Nastavenie parametrov odstránenia",
  },
  response: {
    title: "Odpoveď",
    description: "Výsledok odstránenia",
  },
  errors: {
    unauthorized: {
      title: "Bez oprávnenia",
      description: "Vyžaduje sa prihlásenie",
    },
    validation: {
      title: "Chyba overenia",
      description: "Neplatné parametre požiadavky",
    },
    server: {
      title: "Chyba servera",
      description: "Nastala chyba interného servera",
    },
    internal: {
      title: "Interná chyba",
      description: "Nastala vnútorná chyba",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Nastala neznáma chyba",
    },
    network: {
      title: "Chyba siete",
      description: "Nastala chyba siete",
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
    destruction_failed: {
      title: "Odstránenie prostredia Guard zlyhalo: {{error}}",
      description: "Nepodarilo sa odstrániť prostredie Guard.",
    },
    guard_not_found: {
      title: "Pre projekt '{{project}}' sa nenašlo prostredie Guard.",
      description: "Pre zadaný projekt sa nenašlo prostredie Guard.",
    },
  },
  success: {
    title: "Úspech",
    description: "Operácia úspešne dokončená",
  },
};
