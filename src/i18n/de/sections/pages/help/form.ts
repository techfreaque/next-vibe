import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/pages/help/form";

export const formTranslations: typeof EnglishFormTranslations = {
  title: "Kontaktaufnahme",
  name: "Ihr Name",
  email: "E-Mail-Adresse",
  phone: "Telefonnummer",
  company: "Unternehmen",
  subject: "Betreff",
  namePlaceholder: "Geben Sie Ihren Namen ein",
  emailPlaceholder: "Geben Sie Ihre E-Mail-Adresse ein",
  companyPlaceholder: "Geben Sie Ihren Firmennamen ein",
  subjectPlaceholder: "Worum geht es?",
  messagePlaceholder: "Wie können wir Ihnen helfen?",
  preferredContactMethod: "Bevorzugte Kontaktmethode",
  preferredContactOptions: {
    email: "E-Mail",
    phone: "Telefon",
  },
  meetingPreferenceType: "Meeting-Präferenz",
  meetingPreferenceOptions: {
    virtual: "Virtuelles Meeting",
    inPerson: "Persönliches Treffen",
  },
  message: "Ihre Nachricht",
  submit: "Nachricht senden",
  sending: "Wird gesendet...",
  success: {
    title: "Erfolgreich!",
    description:
      "Ihre Nachricht wurde erfolgreich gesendet! Wir werden uns so schnell wie möglich bei Ihnen melden.",
  },
  error: {
    title: "Fehler beim Senden der Nachricht",
    description:
      "Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
  },
};
