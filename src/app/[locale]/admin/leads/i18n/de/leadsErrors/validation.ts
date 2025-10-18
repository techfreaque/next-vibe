import type { translations as EnglishValidationTranslations } from "../../en/leadsErrors/validation";

export const translations: typeof EnglishValidationTranslations = {
  email: {
    invalid: "Ungültige E-Mail-Adresse",
  },
  businessName: {
    required: "Firmenname ist erforderlich",
  },
  website: {
    invalid: "Ungültige Website-URL",
  },
  language: {
    tooShort: "Sprachcode muss mindestens 2 Zeichen haben",
    tooLong: "Sprachcode darf maximal 5 Zeichen haben",
  },
  country: {
    invalid: "Ungültiger Ländercode",
  },
};
