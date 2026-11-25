import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    sessionErrorReason: {
      noTokenInCookies: "V súboroch cookie chýba token",
    },
  },
  errors: {
    session_not_found: "Relácia s tokenom {{token}} sa nenašla",
    session_token_missing: "Token relácie sa nenašiel ({{reason}})",
    session_lookup_failed:
      "Nepodarilo sa vyhľadať reláciu {{token}}: {{error}}",
    current_session_failed: "Nepodarilo sa načítať aktuálnu reláciu: {{error}}",
    expired_sessions_delete_failed:
      "Relácie s uplynutou platnosťou sa nepodarilo odstrániť",
    session_creation_failed:
      "Reláciu pre používateľa {{userId}} sa nepodarilo vytvoriť",
    session_creation_database_error:
      "Pri vytváraní relácie pre používateľa {{userId}} nastala chyba databázy: {{error}}",
    user_sessions_delete_failed:
      "Nepodarilo sa odstrániť reláciu {{sessionId}}: {{error}}",
    expired: "Platnosť relácie vypršala {{expiresAt}}",
  },
  post: {
    title: "Relácia",
    description: "Koncový bod pre relácie",
    form: {
      title: "Nastavenia relácie",
      description: "Nastavte parametre relácie",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje odpovede o relácii",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba kontroly údajov",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
    },
    success: {
      title: "Úspech",
      description: "Operácia prebehla úspešne",
    },
  },
};
