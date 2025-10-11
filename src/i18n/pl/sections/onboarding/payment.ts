import type { paymentTranslations as EnglishPaymentTranslations } from "../../../en/sections/onboarding/payment";

export const paymentTranslations: typeof EnglishPaymentTranslations = {
  title: "Subskrybuj nasze usługi",
  description: "Dołącz natychmiast z naszym standardowym pakietem",
  starterPlan: "Plan Starter",
  features: {
    analytics: "Podstawowy panel analityczny",
    scheduling: "Narzędzia planowania treści",
    support: "Wsparcie emailowe",
  },
  price: "{{price}} miesięcznie",
  subscribe: "Subskrybuj teraz",
  processing: "Przetwarzanie płatności...",
  success: {
    title: "Płatność pomyślna!",
    description: "Twoja subskrypcja została aktywowana.",
  },
  failed: {
    title: "Płatność nie powiodła się",
    description:
      "Wystąpił problem z przetwarzaniem Twojej płatności. Spróbuj ponownie.",
    message: "Płatność nie została ukończona. Spróbuj ponownie wybrać plan.",
  },
  error: {
    title: "Błąd płatności",
    description: "Wystąpił błąd podczas przetwarzania Twojej płatności.",
  },
  redirecting: "Przekierowywanie do strony płatności...",
  immediate: {
    title: "Zapłać teraz i dołącz",
    description:
      "Subskrybuj plan i uzyskaj natychmiastowy dostęp do naszych usług, plus konsultację w celu optymalizacji Twojej strategii.",
    cta: "Wybierz plan i zapłać",
  },
  benefits: {
    immediate: "Natychmiastowy dostęp do wszystkich funkcji",
    consultation: "Zawiera konsultację strategiczną",
    priority: "Priorytetowe wsparcie i wdrożenie",
  },
};
