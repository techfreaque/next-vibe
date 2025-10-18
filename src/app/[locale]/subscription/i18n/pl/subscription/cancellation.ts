import type { translations as EnglishCancellationTranslations } from "../../en/subscription/cancellation";

export const translations: typeof EnglishCancellationTranslations = {
  confirm: {
    title: "Anuluj Subskrypcję",
    description: "Czy na pewno chcesz anulować swoją subskrypcję?",
    warning:
      "Twoja subskrypcja zostanie anulowana na koniec bieżącego okresu rozliczeniowego {{date}}. Będziesz mieć dostęp do tego czasu.",
  },
  success: {
    title: "Subskrypcja Anulowana",
    description:
      "Twoja subskrypcja została pomyślnie anulowana. Będziesz mieć dostęp do końca bieżącego okresu rozliczeniowego.",
  },
  error: {
    title: "Anulowanie Nie Powiodło Się",
    description:
      "Nie udało się anulować Twojej subskrypcji. Spróbuj ponownie lub skontaktuj się ze wsparciem.",
  },
};
