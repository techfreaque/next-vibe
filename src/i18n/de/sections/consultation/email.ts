import type { emailTranslations as EnglishEmailTranslations } from "../../../en/sections/consultation/email";

export const emailTranslations: typeof EnglishEmailTranslations = {
  subject: "Neue Beratungsanfrage - {{appName}}",
  title: "Beratungsanfrage - {{appName}}",
  previewText: "Neue {{businessType}} Beratungsanfrage",
  greeting: "Hallo Admin,",
  details: "Anfrage-Details:",
  businessType: "Unternehmenstyp",
  contactEmail: "Kontakt-E-Mail",
  contactPhone: "Kontakt-Telefon",
  preferredDate: "Bevorzugtes Datum",
  preferredTime: "Bevorzugte Zeit",
  message: "Nachricht",
  viewRequest: "Anfrage-Details anzeigen",
  closing: "Vielen Dank für Ihre Aufmerksamkeit zu dieser Anfrage.",
  noScheduledDate: "Kein geplantes Datum verfügbar",
  noScheduledTime: "Keine geplante Zeit verfügbar",
  admin: {
    partner: {
      subject: "Beratungsanfrage für {{businessName}}",
      previewText: "Beratungsanfrage für {{businessName}}",
      header: "Beratungsdienstleistungen",
      greeting: "Hallo {{name}},",
      intro:
        "Vielen Dank für Ihr Interesse an unseren Beratungsdienstleistungen für {{businessName}}. Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen melden.",
      messageLabel: "Ihre Nachricht",
      nextStepsTitle: "Nächste Schritte",
      nextStep1: "Wir werden Ihre Anfrage innerhalb von 24 Stunden prüfen",
      nextStep2:
        "Ein Teammitglied wird Sie kontaktieren, um Ihre Beratung zu planen",
      nextStep3:
        "Wir bereiten einen maßgeschneiderten Ansatz für Ihre Geschäftsanforderungen vor",
      closing:
        "Wir freuen uns darauf, Ihnen beim Wachstum Ihres Unternehmens zu helfen.",
      contactTitle: "Kontaktinformationen",
      contactEmail: "E-Mail",
      contactPhone: "Telefon",
      contactWebsite: "Website",
      footer: "Mit freundlichen Grüßen,\n{{companyName}} Team",
      disclaimer:
        "Diese E-Mail wurde bezüglich Ihrer Beratungsanfrage gesendet. Bei Fragen kontaktieren Sie uns bitte.",
    },
  },
  scheduled: {
    subject: "Beratung geplant - {{appName}}",
    title: "Ihre Beratung ist geplant - {{appName}}",
    previewText: "Ihre Beratung ist für {{date}} um {{time}} geplant",
    greeting: "Hallo,",
    confirmation: "Ihre Beratung wurde erfolgreich geplant.",
    details: "Beratungsdetails:",
    date: "Datum",
    time: "Zeit",
    businessType: "Unternehmenstyp",
    meetingLink: "Meeting-Link",
    originalMessage: "Ihre ursprüngliche Nachricht",
    joinMeeting: "Meeting beitreten",
    icsNote: "Eine Kalendereinladung wurde dieser E-Mail angehängt.",
    closing: "Wir freuen uns darauf, mit Ihnen zu sprechen!",
    admin: {
      subject: "Neue Beratung geplant - {{appName}}",
      title: "Beratung geplant - {{appName}}",
      previewText: "Neue {{businessType}} Beratung für {{date}} geplant",
      notification: "Eine Beratung wurde geplant.",
      details: "Beratungsdetails:",
      viewConsultation: "Beratungsdetails anzeigen",
    },
  },
};
