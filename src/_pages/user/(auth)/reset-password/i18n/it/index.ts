import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unknown: "Si è verificato un errore sconosciuto",
    title: "Errore",
  },
  meta: {
    passwordReset: {
      title: "Reimposta la password | {{appName}}",
      description: "Reimposta la password del tuo account {{appName}}",
      category: "Autenticazione",
      imageAlt: "Reimpostazione della password",
      keywords: "reimpostare la password, password dimenticata, {{appName}}",
    },
  },
  auth: {
    resetPassword: {
      errors: {
        loadingError:
          "Impossibile caricare il modulo per reimpostare la password",
      },
    },
  },
};
