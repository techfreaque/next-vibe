import type { validationTranslations as EnglishValidationTranslations } from "../../../en/sections/usersErrors/validation";

export const validationTranslations: typeof EnglishValidationTranslations = {
  id: {
    invalid: "Ungültige Benutzer-ID",
  },
  email: {
    invalid: "Ungültige E-Mail-Adresse",
  },
  password: {
    tooShort: "Passwort muss mindestens 8 Zeichen haben",
    tooLong: "Passwort darf maximal 128 Zeichen haben",
  },
  firstName: {
    required: "Vorname ist erforderlich",
    tooLong: "Vorname darf maximal 100 Zeichen haben",
  },
  lastName: {
    required: "Nachname ist erforderlich",
    tooLong: "Nachname darf maximal 100 Zeichen haben",
  },
  company: {
    required: "Firmenname ist erforderlich",
    tooLong: "Firmenname darf maximal 255 Zeichen haben",
  },
  phone: {
    invalid: "Ungültiges Telefonnummernformat",
  },
  preferredContactMethod: {
    invalid: "Ungültige bevorzugte Kontaktmethode",
  },
  imageUrl: {
    invalid: "Ungültige Bild-URL",
  },
  bio: {
    tooLong: "Biografie darf maximal 1000 Zeichen haben",
  },
  website: {
    invalid: "Ungültige Website-URL",
  },
  jobTitle: {
    tooLong: "Berufsbezeichnung darf maximal 255 Zeichen haben",
  },
};
