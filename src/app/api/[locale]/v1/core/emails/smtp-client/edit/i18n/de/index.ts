import { translations as idTranslations } from "../../[id]/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "SMTP-Konto bearbeiten",
  description: "SMTP-Konto-Konfiguration bearbeiten",
  container: {
    title: "SMTP-Konto-Details",
    description: "SMTP-Konto-Einstellungen und -Konfiguration aktualisieren",
  },
  fields: {
    name: {
      label: "Kontoname",
      description: "Name des SMTP-Kontos",
      placeholder: "Kontoname eingeben",
    },
    description: {
      label: "Beschreibung",
      description: "Kontobeschreibung",
      placeholder: "Kontobeschreibung eingeben",
    },
    host: {
      label: "SMTP-Host",
      description: "SMTP-Server-Hostname",
      placeholder: "smtp.beispiel.de",
    },
    port: {
      label: "Port",
      description: "SMTP-Server-Port",
      placeholder: "587",
    },
    securityType: {
      label: "Sicherheitstyp",
      description: "SMTP-Verbindungs-Sicherheitstyp",
      placeholder: "Sicherheitstyp auswählen",
    },
    username: {
      label: "Benutzername",
      description: "SMTP-Authentifizierungs-Benutzername",
      placeholder: "Benutzername eingeben",
    },
    password: {
      label: "Passwort",
      description: "SMTP-Authentifizierungs-Passwort",
      placeholder: "Passwort eingeben",
    },
    fromEmail: {
      label: "Absender-E-Mail",
      description: "Standard-Absender-E-Mail-Adresse",
      placeholder: "absender@beispiel.de",
    },
    priority: {
      label: "Priorität",
      description: "Kontopriorität für Lastverteilung",
      placeholder: "Prioritätsnummer eingeben",
    },
  },
  response: {
    account: {
      title: "Aktualisiertes Konto",
      description: "SMTP-Konto erfolgreich aktualisiert",
      id: "Konto-ID",
      name: "Kontoname",
      host: "SMTP-Host",
      port: "Port",
      username: "Benutzername",
      fromEmail: "Absender-E-Mail",
    },
  },
  id: idTranslations,
};
