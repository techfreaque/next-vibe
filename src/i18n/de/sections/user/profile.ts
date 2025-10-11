import type { profileTranslations as EnglishProfileTranslations } from "../../../en/sections/user/profile";

export const profileTranslations: typeof EnglishProfileTranslations = {
  title: "Profil-Informationen",
  description: "Aktualisieren Sie Ihre persönlichen Profil-Informationen.",
  fields: {
    firstName: {
      label: "Vorname",
      placeholder: "Geben Sie Ihren Vornamen ein",
    },
    lastName: {
      label: "Nachname",
      placeholder: "Geben Sie Ihren Nachnamen ein",
    },
    bio: {
      label: "Biografie",
      placeholder: "Erzählen Sie uns etwas über sich...",
    },
    website: {
      label: "Website",
      placeholder: "https://beispiel.de",
    },
    phone: {
      label: "Telefon",
      placeholder: "+49 (0) 123 456789",
    },
  },
  success: {
    title: "Profil aktualisiert",
    description: "Ihr Profil wurde erfolgreich aktualisiert.",
  },
  error: {
    title: "Profil-Aktualisierung fehlgeschlagen",
    description:
      "Profil konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.",
  },
};
