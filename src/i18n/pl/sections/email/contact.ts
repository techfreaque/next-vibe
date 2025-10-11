import type { contactTranslations as EnglishContactTranslations } from "../../../en/sections/email/contact";

export const contactTranslations: typeof EnglishContactTranslations = {
  company: {
    subject: "Nowe Przesłanie Formularza Kontaktowego - {{appName}}",
    newSubmission: "Nowe przesłanie formularza kontaktowego od {{name}}",
    contactDetails: "Szczegóły Kontaktowe",
    name: "Imię:",
    email: "E-mail:",
    company: "Firma:",
    contactSubject: "Temat Kontaktu:",
    message: "Wiadomość",
    viewDetails: "Zobacz Szczegóły",
  },
  partner: {
    subject: "Formularz Kontaktowy: {{subject}}",
    greeting: "Witaj {{name}} 👋",
    thankYou:
      "Dziękujemy za skontaktowanie się z nami. Otrzymaliśmy Twoją wiadomość i odpowiemy tak szybko, jak to możliwe.",
    messageSubject: "Temat Twojej wiadomości:",
    message: "Twoja Wiadomość:",
    additionalInfo:
      "Jeśli masz dodatkowe pytania lub informacje, odpowiedz na ten e-mail. Nasz zespół jest oddany zapewnieniu Ci najlepszego możliwego wsparcia.",
    visitWebsite: "Odwiedź Stronę",
  },
};
