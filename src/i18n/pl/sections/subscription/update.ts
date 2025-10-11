import type { updateTranslations as EnglishUpdateTranslations } from "../../../en/sections/subscription/update";

export const updateTranslations: typeof EnglishUpdateTranslations = {
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
