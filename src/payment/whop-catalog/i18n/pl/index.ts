import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Płatności",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Synchronizuj katalog Whop",
    titleShort: "Katalog Whop",
    description:
      "Tworzy każdy plan i pakiet kredytów na połączonym koncie Whop: jeden produkt na plan, jeden wariant na okres, walutę i cenę, rozpoznawany po naszym kluczu w metadanych. Idempotentne. Próba na sucho pokazuje, co istnieje, a czego brakuje.",
    fields: {
      dryRun: {
        label: "Próba na sucho",
        description: "Tylko wypisz warianty, nic nie twórz",
      },
    },
    response: {
      dryRun: "Próba na sucho",
      environment: "Środowisko Whop",
      accountId: "Konto Whop",
      existing: "Już są",
      created: "Utworzone teraz",
      missing: "Brakuje",
      variants: "Warianty",
      key: "Klucz",
      variantId: "ID wariantu",
      productId: "Produkt Whop",
      amount: "Kwota",
      status: "Status",
      purchaseUrl: "Link zakupu",
    },
    widget: {
      hint: "Uruchom raz na konto Whop po zmianie cen. Checkout też tworzy brakujący wariant przy pierwszym zakupie.",
      submit: "Synchronizuj katalog",
      summary:
        "Whop {{environment}} ({{accountId}}): {{existing}} istnieje, {{created}} utworzono, {{missing}} brakuje",
    },
  },
  errors: {
    validation: { title: "Nieprawidłowe dane", description: "Sprawdź żądanie" },
    unauthorized: {
      title: "Nie zalogowano",
      description: "Zaloguj się jako admin",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Tylko admini synchronizują katalog Whop",
    },
    notFound: { title: "Nie znaleziono", description: "Nie znaleziono zasobu" },
    conflict: {
      title: "Konflikt",
      description: "Whop zmienił się w międzyczasie. Uruchom ponownie.",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się zsynchronizować katalogu Whop",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera",
    },
    unknown: { title: "Nieznany błąd", description: "Coś poszło nie tak" },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany",
    },
    notConfigured:
      "Whop nie jest skonfigurowany (brak klucza API aktywnego WHOP_ENVIRONMENT)",
    syncFailed: "Synchronizacja katalogu Whop nie powiodła się: {{error}}",
  },
  success: {
    title: "Gotowe",
    description: "Katalog Whop sprawdzony",
  },
};
