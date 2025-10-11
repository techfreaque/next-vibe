import type { adminTranslations as EnglishAdminTranslations } from "../../../../en/sections/email/consultation/admin";

export const adminTranslations: typeof EnglishAdminTranslations = {
  partner: {
    subject: "Beratung geplant - {{name}}",
    title: "Ihre Beratung wurde geplant, {{name}}!",
    preview: "Wir haben Ihre Beratung mit {{businessName}} geplant",
    greeting: "Hallo {{name}},",
    message:
      "Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Beratung mit unseren Social Media Experten geplant wurde. Wir freuen uns darauf, Ihnen bei der Erreichung Ihrer Geschäftsziele zu helfen.",
    details: "Beratungsdetails",
    preferredDate: "Gewünschtes Datum",
    additionalMessage: "Zusätzliche Nachricht",
    nextSteps:
      "Unser Team wird Sie bald kontaktieren, um die finalen Details zu bestätigen und Ihnen den Meeting-Link zu senden. Wir freuen uns auf die Zusammenarbeit!",
    defaultName: "Geschätzter Partner",
    defaultBusinessName: "Ihr Unternehmen",
    missing_contact_info: "Fehlende Kontaktinformationen für Partner-E-Mail",
  },
  internal: {
    subject: "Neue Admin-Beratung erstellt - {{appName}} ({{businessName}})",
    title: "Neue Admin-Beratung erstellt",
    preview: "Eine neue Beratung wurde für {{businessName}} erstellt",
    greeting: "Hallo Team,",
    message:
      "Eine neue Beratung wurde über das Admin-Panel erstellt. Bitte überprüfen Sie die Details unten und folgen Sie entsprechend nach.",
    details: "Beratungsdetails",
    contactName: "Kontaktname",
    contactEmail: "Kontakt-E-Mail",
    contactPhone: "Kontakttelefon",
    businessType: "Geschäftstyp",
    businessName: "Firmenname",
    preferredDate: "Gewünschtes Datum",
    priorityLabel: "Priorität",
    messageContent: "Nachricht",
    internalNotes: "Interne Notizen",
    closing:
      "Bitte überprüfen Sie diese Beratung und folgen Sie entsprechend mit dem Kontakt nach.",
    viewConsultation: "Beratung anzeigen",
    defaultName: "Unbekannter Kontakt",
    defaultBusinessName: "Unbekanntes Unternehmen",
    priority: {
      low: "Niedrig",
      normal: "Normal",
      high: "Hoch",
    },
  },
};
