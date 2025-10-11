import type { subscriptionBannerTranslations as EnglishSubscriptionBannerTranslations } from "../../../en/sections/pricing/subscriptionBanner";

export const subscriptionBannerTranslations: typeof EnglishSubscriptionBannerTranslations =
  {
    status: {
      active: "Sie befinden sich derzeit im {planName} Plan.",
      pastDue:
        "Ihre Zahlung ist überfällig. Bitte aktualisieren Sie Ihre Zahlungsmethode.",
      canceled: "Ihr Abonnement wurde gekündigt.",
      pending: "Ihr Abonnementstatus ist ausstehend.",
    },
    actions: {
      manage: "Abonnement verwalten",
      updatePayment: "Zahlungsmethode aktualisieren",
      resubscribe: "Erneut abonnieren",
      viewDetails: "Details anzeigen",
    },
    nextBillingDate: "Nächstes Abrechnungsdatum: {date}",
    dismissButton: "Schließen",
    dateFormat: "d. MMM yyyy",
  };
