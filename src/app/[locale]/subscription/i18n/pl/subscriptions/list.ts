import type { translations as EnglishListTranslations } from "../../en/subscriptions/list";

export const translations: typeof EnglishListTranslations = {
  title: "Wszystkie subskrypcje",
  description:
    "Przeglądaj i zarządzaj wszystkimi subskrypcjami użytkowników w systemie",
  empty: {
    title: "Nie znaleziono subskrypcji",
    description:
      "Żadna subskrypcja nie pasuje do Twoich obecnych filtrów. Spróbuj dostosować kryteria wyszukiwania.",
  },
  table: {
    headers: {
      user: "Użytkownik",
      plan: "Plan",
      status: "Status",
      billingInterval: "Rozliczenia",
      currentPeriod: "Obecny okres",
      nextBilling: "Następne rozliczenie",
      createdAt: "Utworzono",
      actions: "Akcje",
    },
  },
  filters: {
    search: {
      placeholder: "Wyszukaj subskrypcje po użytkowniku lub planie...",
    },
    status: {
      label: "Status",
      all: "Wszystkie statusy",
      incomplete: "Niekompletna",
      incompleteExpired: "Niekompletna wygasła",
      trialing: "Okres próbny",
      active: "Aktywna",
      pastDue: "Przeterminowana",
      canceled: "Anulowana",
      unpaid: "Nieopłacona",
      paused: "Wstrzymana",
    },
    plan: {
      label: "Plan",
      all: "Wszystkie plany",
      starter: "Starter",
      professional: "Professional",
      premium: "Premium",
      enterprise: "Enterprise",
    },
    billingInterval: {
      label: "Interwał rozliczeń",
      all: "Wszystkie interwały",
      monthly: "Miesięcznie",
      yearly: "Rocznie",
    },
    sortBy: {
      label: "Sortuj według",
      createdAt: "Data utworzenia",
      updatedAt: "Data aktualizacji",
      currentPeriodStart: "Początek okresu",
      currentPeriodEnd: "Koniec okresu",
    },
    sortOrder: {
      label: "Kolejność",
      asc: "Rosnąco",
      desc: "Malejąco",
    },
  },
  pagination: {
    showing: "Pokazuje {{start}} do {{end}} z {{total}} subskrypcji",
    page: "Strona {{current}} z {{total}}",
  },
};
