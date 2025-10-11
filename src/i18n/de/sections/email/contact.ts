import type { contactTranslations as EnglishContactTranslations } from "../../../en/sections/email/contact";

export const contactTranslations: typeof EnglishContactTranslations = {
  company: {
    subject: "Neue Kontaktformular-Einreichung - {{appName}}",
    newSubmission: "Neue Kontaktformular-Einreichung von {{name}}",
    contactDetails: "Kontaktdetails",
    name: "Name:",
    email: "E-Mail:",
    company: "Unternehmen:",
    contactSubject: "Kontakt-Betreff:",
    message: "Nachricht",
    viewDetails: "Details anzeigen",
  },
  partner: {
    subject: "Kontaktformular: {{subject}}",
    greeting: "Hallo {{name}} 👋",
    thankYou:
      "Vielen Dank, dass Sie uns kontaktiert haben. Wir haben Ihre Nachricht erhalten und werden uns so schnell wie möglich bei Ihnen melden.",
    messageSubject: "Ihr Nachrichtenbetreff:",
    message: "Ihre Nachricht:",
    additionalInfo:
      "Falls Sie weitere Fragen oder Informationen haben, antworten Sie bitte auf diese E-Mail. Unser Team ist bestrebt, Ihnen den bestmöglichen Support zu bieten.",
    visitWebsite: "Website besuchen",
  },
};
