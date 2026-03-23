/**
 * German translations for unified Messenger Send endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Nachricht senden",
  description:
    "Nachricht über beliebigen Kanal senden (E-Mail, SMS, WhatsApp, Telegram)",
  category: "Messaging",
  tag: "Senden",

  container: {
    title: "Nachricht senden",
    description: "Über ein konfiguriertes Messenger-Konto senden",
  },

  accountId: {
    label: "Messenger-Konto",
    description: "Konto zum Senden",
    placeholder: "Konto-UUID auswählen",
  },
  to: {
    label: "Empfänger",
    description: "E-Mail-Adresse, Telefonnummer oder Chat-ID",
    placeholder: "benutzer@beispiel.de oder +4912345678",
  },
  toName: {
    label: "Empfängername",
    description: "Anzeigename des Empfängers (optional)",
    placeholder: "Max Mustermann",
  },
  subject: {
    label: "Betreff",
    description: "Betreffzeile (nur E-Mail, optional für andere Kanäle)",
    placeholder: "Ihr Betreff hier...",
  },
  text: {
    label: "Nachricht",
    description: "Nur-Text-Inhalt - für SMS/WhatsApp/Telegram; E-Mail-Fallback",
    placeholder: "Nachricht eingeben...",
  },
  html: {
    label: "HTML-Inhalt",
    description: "HTML-Inhalt (nur E-Mail, optional - Fallback auf Text)",
    placeholder: "<p>HTML-E-Mail-Inhalt eingeben...</p>",
  },
  senderName: {
    label: "Absendername",
    description: "Anzeigename des Absenders (nur E-Mail, optional)",
    placeholder: "Ihr Unternehmen",
  },
  replyTo: {
    label: "Antworten an",
    description: "Antwortadresse (nur E-Mail, optional)",
    placeholder: "support@beispiel.de",
  },
  leadId: {
    label: "Lead-ID",
    description: "Zugehöriger Lead zur Verfolgung (optional)",
    placeholder: "UUID",
  },
  campaignId: {
    label: "Kampagnen-ID",
    description: "Zugehörige Kampagne zur Verfolgung (optional)",
    placeholder: "UUID",
  },

  response: {
    title: "Sendeergebnis",
    description: "Ergebnis des Sendevorgangs",
    messageId: { label: "Nachrichten-ID" },
    accountName: { label: "Konto" },
    channel: { label: "Kanal" },
    provider: { label: "Anbieter" },
    sentAt: { label: "Gesendet am" },
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie haben keine Berechtigung zum Senden von Nachrichten",
    },
    server: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist beim Senden aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf diese Ressource ist verboten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist beim Senden aufgetreten",
    },
    notFound: {
      title: "Konto nicht gefunden",
      description: "Das angegebene Messenger-Konto wurde nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Anfrage steht im Konflikt mit vorhandenen Daten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen",
    },
  },

  success: {
    title: "Nachricht gesendet",
    description: "Ihre Nachricht wurde erfolgreich gesendet",
  },
};
