import type { validationTranslations as EnglishValidationTranslations } from "../../../en/sections/leadsErrors/validation";

export const validationTranslations: typeof EnglishValidationTranslations = {
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
