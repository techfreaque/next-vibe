import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Płatności",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Utwórz ceny w Stripe",
    titleShort: "Ceny Stripe",
    description:
      "Tworzy każdą cenę planu i pakietu kredytów w podłączonym koncie Stripe (dla każdej waluty i języka), wyszukiwaną po kluczu lookup. Idempotentne, bez ID cen w .env. Próbny przebieg pokazuje, co istnieje, a czego brakuje.",
    fields: {
      dryRun: {
        label: "Próbny przebieg",
        description: "Tylko wypisz ceny, niczego nie twórz",
      },
    },
    response: {
      dryRun: "Próbny przebieg",
      stripeMode: "Tryb Stripe",
      existing: "Już istnieją",
      created: "Utworzone teraz",
      missing: "Brakuje",
      prices: "Ceny",
      lookupKey: "Klucz lookup",
      priceId: "ID ceny",
      productId: "ID produktu",
      amount: "Kwota",
      status: "Status",
    },
    widget: {
      hint: "Uruchom raz na konto Stripe po zmianie cen. Checkout też tworzy brakującą cenę przy pierwszym zakupie.",
      submit: "Utwórz ceny",
      summary:
        "Stripe {{mode}}: {{existing}} istnieje, {{created}} utworzono, {{missing}} brakuje",
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
      description: "Tylko admini zarządzają cenami Stripe",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono zasobu",
    },
    conflict: {
      title: "Konflikt",
      description: "Stripe zmienił się w międzyczasie, uruchom ponownie",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się utworzyć cen Stripe",
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
    notConfigured: "Stripe nie jest skonfigurowany (brak STRIPE_SECRET_KEY)",
  },
  success: {
    title: "Gotowe",
    description: "Ceny Stripe sprawdzone",
  },
};
