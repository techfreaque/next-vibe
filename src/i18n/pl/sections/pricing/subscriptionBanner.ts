import type { subscriptionBannerTranslations as EnglishSubscriptionBannerTranslations } from "../../../en/sections/pricing/subscriptionBanner";

export const subscriptionBannerTranslations: typeof EnglishSubscriptionBannerTranslations =
  {
    status: {
      active: "Obecnie korzystasz z planu {planName}.",
      pastDue:
        "Twoja płatność jest przeterminowana. Zaktualizuj metodę płatności.",
      canceled: "Twoja subskrypcja została anulowana.",
      pending: "Status Twojej subskrypcji oczekuje na potwierdzenie.",
    },
    actions: {
      manage: "Zarządzaj subskrypcją",
      updatePayment: "Zaktualizuj metodę płatności",
      resubscribe: "Odnów subskrypcję",
      viewDetails: "Zobacz szczegóły",
    },
    nextBillingDate: "Następna data rozliczenia: {date}",
    dismissButton: "Odrzuć",
    dateFormat: "d MMM yyyy",
  };
