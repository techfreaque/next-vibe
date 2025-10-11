import type { adminTranslations as EnglishAdminTranslations } from "../../../en/sections/newsletter/admin";

export const adminTranslations: typeof EnglishAdminTranslations = {
  dashboard: {
    title: "Panel Newslettera",
    totalSubscribers: "Łączna Liczba Subskrybentów",
    activeSubscribers: "Aktywni Subskrybenci",
    openRate: "Wskaźnik Otwarć",
    clickRate: "Wskaźnik Kliknięć",
  },
  campaigns: {
    title: "Kampanie",
    create: "Utwórz Kampanię",
    name: "Nazwa Kampanii",
    subject: "Linia Tematu",
    content: "Treść",
    schedule: "Zaplanuj",
    send: "Wyślij Teraz",
    preview: "Podgląd",
    test: "Wyślij Testowy E-mail",
    success: "Kampania utworzona pomyślnie",
    error: "Nie udało się utworzyć kampanii",
    sentSuccess: "Kampania wysłana pomyślnie",
    sentError: "Nie udało się wysłać kampanii",
  },
};
