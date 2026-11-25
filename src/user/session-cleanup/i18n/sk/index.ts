import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",

  post: {
    title: "Čistenie relácií",
    titleShort: "Vyčistiť relácie",
    description:
      "Odstráňte používateľské relácie a tokeny s uplynutou platnosťou.",
    tag: "Čistenie relácií",
    container: {
      title: "Čistenie relácií",
      description: "Nastavte a spustite čistenie relácií.",
    },
    fields: {
      sessionRetentionDays: {
        label: "Uchovávanie relácií (dni)",
        description: "Počet dní, počas ktorých sa uchovávajú relácie",
      },
      tokenRetentionDays: {
        label: "Uchovávanie tokenov (dni)",
        description: "Počet dní, počas ktorých sa uchovávajú tokeny",
      },
      batchSize: {
        label: "Veľkosť dávky",
        description: "Počet záznamov spracovaných v jednej dávke",
      },
      dryRun: {
        label: "Skúšobné spustenie",
        description: "Simulujte čistenie bez odstránenia záznamov",
      },
    },
    response: {
      sessionsDeleted: "Odstránené relácie",
      tokensDeleted: "Odstránené tokeny",
      totalProcessed: "Celkový počet spracovaných záznamov",
      executionTimeMs: "Čas spracovania (ms)",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Čistenie relácií môže spustiť iba správca.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na túto operáciu nemáte oprávnenie.",
      },
      server: {
        title: "Chyba servera",
        description: "Pri čistení sa vyskytla interná chyba servera.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba.",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Nastavenia čistenia sú neplatné.",
      },
    },
    success: {
      title: "Čistenie relácií je dokončené",
      description: "Relácie a tokeny s uplynutou platnosťou sa odstránili.",
    },
  },
  task: {
    name: "Čistenie relácií",
    description:
      "Odstraňuje používateľské relácie s uplynutou platnosťou v záujme bezpečnosti systému.",
    purpose:
      "Odstraňuje relácie s uplynutou platnosťou a pomáha tak udržiavať bezpečnosť a výkon systému.",
    impact:
      "Odstránením zastaraných údajov o reláciách zlepšuje výkon a bezpečnosť systému.",
    rollback: "Čistenie sa nedá vrátiť späť.",
  },
  errors: {
    default: "Pri čistení relácií sa vyskytla chyba.",
    execution_failed: {
      title: "Čistenie relácií zlyhalo: {{error}}",
      description: "Relácie s uplynutou platnosťou sa nepodarilo odstrániť.",
    },
    partial_failure: {
      title: "Čistenie relácií sa podarilo len čiastočne: {{errors}}",
      description: "Niektoré relácie sa nepodarilo odstrániť.",
    },
    unknown_error: {
      title: "Neznáma chyba pri čistení relácií",
      description: "Pri čistení relácií sa vyskytla neznáma chyba.",
    },
    invalid_session_retention: {
      title: "Neplatná lehota uchovávania relácií",
      description: "Zadaná lehota na uchovávanie relácií je neplatná.",
    },
    invalid_token_retention: {
      title: "Neplatná lehota uchovávania tokenov",
      description: "Zadaná lehota na uchovávanie tokenov je neplatná.",
    },
    invalid_batch_size: {
      title: "Neplatná veľkosť dávky",
      description: "Zadaná veľkosť dávky na čistenie je neplatná.",
    },
    validation_failed: {
      title: "Kontrola údajov zlyhala",
      description: "Nastavenia čistenia relácií neprešli overením.",
    },
  },
  success: {
    title: "Čistenie relácií je dokončené",
    description: "Relácie s uplynutou platnosťou sa podarilo odstrániť.",
  },
  monitoring: {
    alertTrigger: "Úloha čistenia relácií zlyhala.",
  },
  documentation: {
    overview:
      "Úloha odstraňuje používateľské relácie s uplynutou platnosťou a pomáha tak udržiavať bezpečnosť a výkon systému.",
  },
};
