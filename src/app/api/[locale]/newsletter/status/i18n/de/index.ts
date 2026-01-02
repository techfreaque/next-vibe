import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Newsletter-Status",
  description: "Newsletter-Abonnementstatus für eine E-Mail-Adresse prüfen",
  category: "Newsletter",
  tags: {
    status: "Status",
  },
  form: {
    title: "Newsletter-Status prüfen",
    description: "Geben Sie eine E-Mail-Adresse ein, um den Newsletter-Abonnementstatus zu prüfen",
  },
  email: {
    label: "E-Mail-Adresse",
    description: "Die E-Mail-Adresse, für die der Abonnementstatus geprüft werden soll",
    placeholder: "benutzer@beispiel.de",
    helpText: "Geben Sie die E-Mail-Adresse ein, die Sie prüfen möchten",
  },
  response: {
    subscribed: "Abonnementstatus",
    status: "Aktueller Status",
  },
  errors: {
    validation: {
      title: "Ungültige E-Mail",
      description: "Bitte geben Sie eine gültige E-Mail-Adresse an",
    },
    internal: {
      title: "Interner Fehler",
      description: "Beim Prüfen des Abonnementstatus ist ein Fehler aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, diesen Abonnementstatus zu prüfen",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Keine Abonnementinformationen für diese E-Mail-Adresse gefunden",
    },
  },
  success: {
    title: "Status abgerufen",
    description: "Newsletter-Abonnementstatus erfolgreich abgerufen",
  },
};
