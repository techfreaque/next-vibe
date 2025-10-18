import type { translations as EnglishEmailTranslations } from "../../en/subscription/email";

export const translations: typeof EnglishEmailTranslations = {
  success: {
    subject:
      "Witamy w {{planName}} - Twoja subskrypcja {{appName}} jest aktywna!",
    title: "Witamy w {{appName}}, {{firstName}}!",
    previewText:
      "Twoja subskrypcja {{planName}} jest teraz aktywna - {{appName}}",
    welcomeMessage: "🎉 Twoja subskrypcja {{planName}} jest teraz aktywna!",
    description:
      "Dziękujemy za subskrypcję {{appName}}. Cieszymy się, że możemy pomóc Ci rozwijać Twoją obecność w mediach społecznościowych dzięki naszym profesjonalnym usługom.",
    nextSteps: {
      title: "🚀 Gotowy na start?",
      description:
        "Skonfigurujmy Twoją strategię mediów społecznościowych i uruchommy harmonogram treści.",
      cta: "Dokończ konfigurację",
    },
    features: {
      title: "Co zawiera Twój plan {{planName}}",
    },
    support: {
      title: "Potrzebujesz pomocy na start?",
      description:
        "Nasz zespół jest tutaj, aby pomóc Ci maksymalnie wykorzystać Twoją subskrypcję.",
      cta: "Skontaktuj się ze wsparciem",
    },
    footer: {
      message:
        "Cieszymy się, że jesteś z nami i nie możemy się doczekać Twojego sukcesu w mediach społecznościowych!",
      signoff: "Z poważaniem,\nZespół {{appName}}",
    },
  },
  admin_notification: {
    subject: "🎉 Nowa subskrypcja: {{userName}} wykupił {{planName}}",
    title: "💳 Alert nowej subskrypcji",
    preview: "Nowy płacący klient - {{appName}}",
    message:
      "Świetne wiadomości! Nowy klient pomyślnie wykupił płatny plan w {{appName}}.",
    details: "👤 Szczegóły klienta i subskrypcji",
    user_name: "Nazwa klienta",
    user_email: "E-mail",
    plan: "Plan",
    status: "Status",
    contact_user: "📧 Skontaktuj się z klientem",
    footer:
      "To powiadomienie zostało wysłane automatycznie przez {{appName}} po utworzeniu nowej subskrypcji.",
  },
};
