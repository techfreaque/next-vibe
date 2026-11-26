import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
  },
  post: {
    title: "Wystaw fakturę",
    titleShort: "Wystaw fakturę",
    description: "Wystaw szkic i zaksięguj należność.",
    form: {
      title: "Wystaw fakturę",
      description: "Po wystawieniu otrzymasz link dla klienta.",
    },
    response: {
      success: "Faktura wystawiona",
      message: "Komunikat statusu",
      viewUrl: "URL widoku klienta",
    },
    errors: {
      invoiceLines: "Przed wystawieniem dodaj pozycje o dodatniej sumie.",
      posting:
        "Sprawdź kwotę faktury, walutę firmy, okres księgowy i konta księgowe.",
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Faktura nie istnieje",
      },
      conflict: {
        title: "Konflikt",
        description: "Faktura nie jest w trybie szkicu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Faktura wystawiona",
      description: "Link do faktury jest gotowy do udostępnienia.",
    },
  },
  invoiceId: {
    label: "ID faktury",
    description: "ID faktury do wysłania",
    placeholder: "Wprowadź ID faktury",
  },
  delivery: {
    share: "Udostępnij fakturę",
    description:
      "Skopiuj link dla klienta lub wyślij go na adres zapisany na fakturze.",
    send: "Wyślij e-mailem",
    confirmDescription: "Wyślij link do faktury na potwierdzony adres.",
    recipient: "Odbiorca faktury",
    noRecipient:
      "Na fakturze nie ma prawidłowego adresu odbiorcy. Nadal możesz skopiować link.",
    status: "Status e-maila",
    notIssued: "Możesz udostępniać tylko wystawione faktury.",
    recipientChanged:
      "Odbiorca faktury się zmienił lub jest niedostępny. Otwórz ponownie opcję udostępniania.",
    emailSubject: "Faktura {{number}}",
    emailText:
      "Firma {{company}} wystawiła fakturę {{number}}. Otwórz ją tutaj:\n{{url}}",
    states: {
      ready: "Gotowe do wysłania",
      pending:
        "Wysyłka jest w toku lub nie została potwierdzona. Kolejne próby są wstrzymane.",
      accepted: "Serwer pocztowy przyjął wiadomość.",
      retryable:
        "Nie połączono się z serwerem pocztowym. Możesz ponowić próbę.",
      uncertain:
        "Nie udało się potwierdzić wyniku wysyłki. Skontaktuj się z odbiorcą przed osobnym wysłaniem linku.",
    },
  },
  widget: {
    back: "Wróć",
    submit: "Wystaw fakturę",
    sent: "Udostępnij klientowi link do faktury.",
    copy: "Skopiuj link dla klienta",
    copied: "Link skopiowany",
    copyError:
      "Nie udało się skopiować linku. Zaznacz i skopiuj adres powyżej.",
    viewUrl: "Link widoku klienta",
  },
};
