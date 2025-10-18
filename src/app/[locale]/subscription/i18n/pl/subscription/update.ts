import type { translations as EnglishUpdateTranslations } from "../../en/subscription/update";

export const translations: typeof EnglishUpdateTranslations = {
  success: {
    title: "Subskrypcja Zaktualizowana",
    description: "Twój plan subskrypcji został zaktualizowany na {{plan}}.",
  },
  error: {
    title: "Aktualizacja Nie Powiodła Się",
    description:
      "Nie udało się zaktualizować Twojej subskrypcji. Spróbuj ponownie.",
  },
};
