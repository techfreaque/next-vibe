import type { tasksTranslations as EnglishTasksTranslations } from "../../../en/sections/onboarding/tasks";

export const tasksTranslations: typeof EnglishTasksTranslations = {
  businessInfo: {
    title: "Informacje o firmie",
    description:
      "Podziel się szczegółami swojej firmy, celami i grupą docelową (~{{minutes}} minut). Opcjonalne - możesz uzupełnić to podczas konsultacji z naszymi ekspertami.",
    completedDescription:
      "Twoje informacje o firmie zostały zapisane. Przejrzyj i zaktualizuj swoje dane, cele i grupę docelową według potrzeb.",
    badge: "Opcjonalne",
    completedBadge: "Ukończone",
  },
  subscription: {
    title: "Wybierz swój plan",
    description:
      "Wybierz plan subskrypcji, który pasuje do Twoich potrzeb i budżetu. Opcjonalne - możesz omówić i wybrać plan podczas konsultacji.",
    completedDescription:
      "Twój plan subskrypcji jest aktywny. Zobacz szczegóły swojego obecnego planu lub przejdź na inny plan.",
    badge: "Opcjonalne",
    completedBadge: "Aktywny",
  },
  consultation: {
    title: "Zaplanuj bezpłatną konsultację",
    description:
      "Zarezerwuj swoją bezpłatną konsultację ({{minDuration}}-{{maxDuration}} minut) z naszymi ekspertami mediów społecznościowych. Dołącz do nas - pomożemy Ci ze wszystkim pozostałym podczas rozmowy!",
    completedDescription:
      "Twoja konsultacja jest zaplanowana. Zobacz szczegóły swojego spotkania, zmień termin lub zarezerwuj dodatkowe sesje.",
    badge: "Dołącz tutaj",
    completedBadge: "Zaplanowane",
  },
};
