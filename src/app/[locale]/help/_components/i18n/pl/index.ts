import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pages: {
    help: {
      form: {
        title: "Wyślij nam wiadomość",
        name: "Imię i nazwisko",
        namePlaceholder: "Twoje imię i nazwisko",
        email: "E-mail",
        emailPlaceholder: "twoj.email@przyklad.pl",
        company: "Firma",
        companyPlaceholder: "Nazwa Twojej firmy (opcjonalnie)",
        subject: "Temat",
        subjectPlaceholder: "Wybierz temat",
        message: "Wiadomość",
        messagePlaceholder: "Powiedz nam, jak możemy Ci pomóc...",
        submit: "Wyślij wiadomość",
        sending: "Wysyłanie...",
      },
      info: {
        title: "Informacje kontaktowe",
        email: "E-mail",
        supportEmail: "support@unbottled.ai",
        community: "Społeczność",
        discord: "Dołącz do naszego Discorda",
        discordDescription: "Uzyskaj pomoc od naszej społeczności i zespołu",
        twitter: "Śledź nas na Twitterze",
        twitterHandle: "@unbottled_ai",
        website: "Strona internetowa",
        websiteUrl: "unbottled.ai",
      },
    },
  },
  contact: {
    subjects: {
      HELP_SUPPORT: "Pomoc i wsparcie",
      GENERAL_INQUIRY: "Zapytanie ogólne",
      TECHNICAL_SUPPORT: "Wsparcie techniczne",
      ACCOUNT_QUESTION: "Pytanie dotyczące konta",
      BILLING_QUESTION: "Rozliczenia i kredyty",
      SALES_INQUIRY: "Zapytanie handlowe",
      FEATURE_REQUEST: "Prośba o funkcję",
      BUG_REPORT: "Zgłoszenie błędu",
      FEEDBACK: "Opinia",
      COMPLAINT: "Skarga",
      PARTNERSHIP: "Partnerstwo",
      OTHER: "Inne",
    },
  },
};
