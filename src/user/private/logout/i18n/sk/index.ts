import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Odhlásenie používateľa",
  titleShort: "Odhlásiť sa",
  description: "Odhlási aktuálneho používateľa a zneplatní jeho reláciu",
  category: "Správa používateľov",
  tag: "logout",
  logoutButton: "Odhlásiť sa",
  loggingOut: "Odhlasuje sa…",
  response: {
    title: "Výsledok odhlásenia",
    description: "Odpoveď potvrdzujúca úspešné odhlásenie",
    success: "Úspech",
    message: "Správa",
    sessionsCleaned: "Ukončené relácie",
    nextSteps: "Odporúčané ďalšie kroky po odhlásení",
  },
  errors: {
    validation: {
      title: "Chyba overenia",
      description: "Žiadosť o odhlásenie obsahuje neplatné údaje",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Na odhlásenie musíš byť prihlásený",
    },
    internal: {
      title: "Interná chyba servera",
      description: "Pri odhlásení nastala interná chyba",
      detail: "Odhlásenie zlyhalo: {{error}} (používateľ {{userId}})",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Pri odhlásení nastala neočakávaná chyba",
    },
    session_deletion_failed: {
      title: "Reláciu sa nepodarilo odstrániť",
      description: "Reláciu používateľa sa nepodarilo odstrániť",
    },
    conflict: {
      title: "Konflikt pri odhlásení",
      description: "Pri odhlásení došlo ku konfliktu",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Odhlásenie nie je povolené",
    },
    network_error: {
      title: "Chyba siete",
      description: "Chyba siete pri odhlásení",
    },
    not_found: {
      title: "Nenájdené",
      description: "Relácia sa nenašla",
    },
    server_error: {
      title: "Chyba servera",
      description: "Pri odhlásení nastala interná chyba servera",
    },
    unsaved_changes: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    invalid_user: {
      title: "Neplatný používateľ",
      description: "Používateľ je neplatný alebo neexistuje",
    },
  },
  success: {
    title: "Odhlásenie prebehlo úspešne",
    description: "Úspešne si sa odhlásil",
    message: "Používateľ sa úspešne odhlásil",
  },
};
