import type { translations as EnglishCreateTranslations } from "../../en/users/create";

export const translations: typeof EnglishCreateTranslations = {
  title: "Benutzer erstellen",
  description: "Neues Benutzerkonto erstellen",
  fields: {
    email: "E-Mail-Adresse des Benutzers",
    password: "Benutzerpasswort (mindestens 8 Zeichen)",
    firstName: "Vorname des Benutzers",
    lastName: "Nachname des Benutzers",
    company: "Firmenname des Benutzers",
    phone: "Telefonnummer des Benutzers",
    preferredContactMethod: "Bevorzugte Kontaktmethode",
    imageUrl: "Profilbild-URL des Benutzers",
    bio: "Biografie des Benutzers",
    website: "Website-URL des Benutzers",
    jobTitle: "Berufsbezeichnung des Benutzers",
    emailVerified: "Ob die E-Mail verifiziert ist",
    isActive: "Ob das Benutzerkonto aktiv ist",
    leadId: "Zugehörige Lead-ID",
    roles: "Zuzuweisende Benutzerrollen",
  },
};
