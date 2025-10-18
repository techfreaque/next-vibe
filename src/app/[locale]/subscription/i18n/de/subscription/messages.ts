import type { translations as EnglishMessagesTranslations } from "../../en/subscription/messages";

export const translations: typeof EnglishMessagesTranslations = {
  cancelledAtPeriodEnd: "Wird am Periodenende gekündigt",
  subscriptionCancelled:
    "Abonnement wird am Ende der aktuellen Abrechnungsperiode gekündigt",
  subscriptionReactivated: "Abonnement wurde erfolgreich reaktiviert",
  subscriptionUpdated: "Abonnement wurde erfolgreich aktualisiert",
  paymentMethodUpdate: "Zahlungsmethoden-Update wird bald verfügbar sein",
  downgradeScheduled: "Downgrade geplant",
  downgradeDescription:
    "Ihr Plan wird im nächsten Abrechnungszyklus herabgestuft",
  cancellationWarning:
    "Ihr Abonnement wird am Ende der aktuellen Abrechnungsperiode am {{date}} gekündigt. Sie haben bis dahin weiterhin Zugang.",
  billingHistoryEmpty:
    "Ihre Abrechnungshistorie wird hier nach der ersten Rechnungsstellung angezeigt.",
  billingHistoryNote:
    "Rechnungen werden normalerweise zu Beginn jeder Abrechnungsperiode erstellt.",
};
