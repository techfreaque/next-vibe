import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Subskrypcje",
  tags: {
    subscription: "subscription",
    admin: "admin",
  },
  post: {
    title: "Plany roczne: kredyty co miesiąc",
    titleShort: "Kredyty roczne",
    description:
      "Daje każdemu planowi rocznemu kredyty bieżącego miesiąca. Działa codziennie; każdy miesiąc przyznawany jest raz i wygasa z końcem miesiąca.",
    response: {
      scanned: "Sprawdzone plany roczne",
      granted: "Przyznane teraz miesiące",
      credits: "Przyznane kredyty",
    },
    widget: {
      hint: "Działa codziennie samo. Ręczne uruchomienie jest bezpieczne: żaden miesiąc nie zostanie przyznany dwa razy.",
      submit: "Przyznaj ten miesiąc",
      summary:
        "{{scanned}} planów rocznych sprawdzonych, {{granted}} miesięcy przyznanych, {{credits}} kredytów",
    },
  },
  task: {
    description: "Przyznaje planom rocznym ich miesięczne kredyty",
  },
  backfill: {
    title: "Plany roczne: uzupełnij pominięte miesiące",
    titleShort: "Uzupełnienie roczne",
    description:
      "Miesiące bieżącego okresu rocznego bez miesięcznych kredytów. Próbny przebieg je wypisuje; bez niego przyznaje je raz, jako jeden pakiet ważny do końca okresu.",
    fields: {
      dryRun: {
        label: "Próbny przebieg",
        description: "Tylko wypisz, nic nie przyznawaj",
      },
    },
    response: {
      dryRun: "Próbny przebieg",
      subscriptions: "Subskrypcje",
      months: "Pominięte miesiące",
      credits: "Kredyty",
      rows: "Subskrypcje",
      subscriptionId: "Subskrypcja",
      userEmail: "Użytkownik",
      plan: "Plan",
      periodStart: "Początek okresu",
      periodEnd: "Koniec okresu",
      currentMonth: "Bieżący miesiąc",
      missedMonths: "Pominięte miesiące",
      status: "Status",
    },
    widget: {
      hint: "Najpierw sprawdź próbny przebieg. Przyznanie działa raz na subskrypcję i okres; powtórzenie nic nie dodaje.",
      submit: "Uruchom uzupełnienie",
      preview:
        "Próbny przebieg: {{subscriptions}} subskrypcji, {{months}} pominiętych miesięcy, {{credits}} kredytów do przyznania.",
      done: "Przyznano: {{subscriptions}} subskrypcji, {{months}} miesięcy, {{credits}} kredytów.",
    },
  },
  errors: {
    validation: {
      title: "Błędne dane",
      description: "Sprawdź żądanie",
    },
    unauthorized: {
      title: "Niezalogowany",
      description: "Zaloguj się jako admin",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Tylko admini przyznają kredyty planów",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono zasobu",
    },
    conflict: {
      title: "Konflikt",
      description: "Dane zmieniły się w międzyczasie, uruchom ponownie",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się przyznać kredytów rocznych",
      detail: "Kredyty roczne nie powiodły się: {{error}}",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś poszło nie tak",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany",
    },
  },
  success: {
    title: "Gotowe",
    description: "Kredyty roczne przetworzone",
  },
};
