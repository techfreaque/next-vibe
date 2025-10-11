import type { adminTranslations as EnglishAdminTranslations } from "../../../../en/sections/email/consultation/admin";

export const adminTranslations: typeof EnglishAdminTranslations = {
  partner: {
    subject: "Konsultacja zaplanowana - {{name}}",
    title: "Twoja konsultacja została zaplanowana, {{name}}!",
    preview: "Zaplanowaliśmy Twoją konsultację z {{businessName}}",
    greeting: "Cześć {{name}},",
    message:
      "Z radością informujemy, że Twoja konsultacja z naszymi ekspertami od mediów społecznościowych została zaplanowana. Cieszymy się, że możemy pomóc Ci osiągnąć cele biznesowe.",
    details: "Szczegóły konsultacji",
    preferredDate: "Preferowana data",
    additionalMessage: "Dodatkowa wiadomość",
    nextSteps:
      "Nasz zespół skontaktuje się z Tobą wkrótce, aby potwierdzić ostateczne szczegóły i dostarczyć link do spotkania. Cieszymy się na współpracę!",
    defaultName: "Szanowny Partnerze",
    defaultBusinessName: "Twoja Firma",
    missing_contact_info:
      "Brakuje informacji kontaktowych dla e-maila partnera",
  },
  internal: {
    subject:
      "Nowa konsultacja admin utworzona - {{appName}} ({{businessName}})",
    title: "Nowa konsultacja admin utworzona",
    preview: "Nowa konsultacja została utworzona dla {{businessName}}",
    greeting: "Cześć zespół,",
    message:
      "Nowa konsultacja została utworzona przez panel administracyjny. Proszę przejrzeć szczegóły poniżej i odpowiednio kontynuować.",
    details: "Szczegóły konsultacji",
    contactName: "Imię kontaktu",
    contactEmail: "E-mail kontaktu",
    contactPhone: "Telefon kontaktu",
    businessType: "Typ biznesu",
    businessName: "Nazwa firmy",
    preferredDate: "Preferowana data",
    priorityLabel: "Priorytet",
    messageContent: "Wiadomość",
    internalNotes: "Notatki wewnętrzne",
    closing:
      "Proszę przejrzeć tę konsultację i odpowiednio skontaktować się z klientem.",
    viewConsultation: "Zobacz konsultację",
    defaultName: "Nieznany kontakt",
    defaultBusinessName: "Nieznana firma",
    priority: {
      low: "Niski",
      normal: "Normalny",
      high: "Wysoki",
    },
  },
};
