import type { messagesTranslations as EnglishMessagesTranslations } from "../../../en/sections/subscription/messages";

export const messagesTranslations: typeof EnglishMessagesTranslations = {
  cancelledAtPeriodEnd: "Anulowanie na koniec okresu",
  subscriptionCancelled:
    "Subskrypcja zostanie anulowana na koniec bieżącego okresu rozliczeniowego",
  subscriptionReactivated: "Subskrypcja została pomyślnie reaktywowana",
  subscriptionUpdated: "Subskrypcja została pomyślnie zaktualizowana",
  paymentMethodUpdate: "Aktualizacja metody płatności będzie wkrótce dostępna",
  downgradeScheduled: "Zaplanowano Obniżenie",
  downgradeDescription:
    "Twój plan zostanie obniżony w następnym cyklu rozliczeniowym",
  cancellationWarning:
    "Twoja subskrypcja zostanie anulowana na koniec bieżącego okresu rozliczeniowego {{date}}. Będziesz mieć dostęp do tego czasu.",
  billingHistoryEmpty:
    "Twoja historia rozliczeń pojawi się tutaj po wygenerowaniu pierwszej faktury.",
  billingHistoryNote:
    "Faktury są zazwyczaj generowane na początku każdego okresu rozliczeniowego.",
};
