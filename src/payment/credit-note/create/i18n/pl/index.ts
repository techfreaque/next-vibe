import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Rozliczenia",
  tags: {
    payment: "płatność",
    invoice: "faktura",
    ar: "należności",
    creditNote: "nota-kredytowa",
  },
  post: {
    title: "Utwórz notę kredytową",
    titleShort: "Utwórz notę",
    description:
      "Wystaw pełną lub częściową korektę zaksięgowanej faktury. Skoryguje należność, przychód i VAT.",
    form: {
      title: "Utwórz notę kredytową",
      description: "Wystaw kredyt do istniejącej faktury",
    },
    response: {
      success: "Nota kredytowa utworzona",
      message: "Komunikat statusu",
      creditNote: {
        title: "Nota kredytowa",
        subtitle: "Szczegóły utworzonej noty kredytowej",
        id: "ID noty kredytowej",
        invoiceId: "ID oryginalnej faktury",
        companyId: "ID firmy",
        currency: "Waluta",
        status: "Status",
        amount: "Kwota",
        reason: "Powód",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
    },
    errors: {
      creditLines:
        "Wpisz dodatnie ilości i użyj stawek VAT z faktury pierwotnej.",
      creditLimit:
        "Korekta przekracza pozostałą kwotę netto, VAT lub brutto z faktury pierwotnej.",
      originalPosting:
        "Uzgodnij zapis księgowy faktury pierwotnej przed wystawieniem korekty.",
      posting:
        "Sprawdź walutę firmy, otwarty okres księgowy i użyte pierwotnie konta.",
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
        title: "Nota niemożliwa",
        description:
          "Noty kredytowe można wystawiać tylko do otwartych lub opłaconych faktur",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Nota kredytowa utworzona i zapis księgowy zaksięgowany",
    },
    widget: {
      readFailed: "Nie udało się pobrać wybranej faktury",
      retryRead: "Wczytaj fakturę ponownie",
      number: "Numer korekty",
      amountLabel: "{{label}} · {{amount}}",
      available: "Kwota do skorygowania",
      dismiss: "Zamknij",
      namedSource: "Faktura pierwotna {{reference}}",
      sourceInvoice: "Faktura pierwotna",
      changeInvoice: "Zmień fakturę",
      openNamedNote: "Otwórz korektę {{reference}}",
      openNote: "Otwórz korektę",
      reviewCredit: "Sprawdź korektę",
      backToItems: "Wróć do pozycji",
      reviewStep: "Pozycje do skorygowania",
      openNamedSource: "Otwórz fakturę {{reference}}",
      openSource: "Otwórz fakturę pierwotną",
      chooseInvoice: "Wybierz wystawioną fakturę",
      full: "Cała faktura",
      partial: "Wybrane pozycje",
      creditTotal: "Kwota korekty",
      unavailable: "Dla tej faktury nie ma już kwoty do skorygowania.",
      issue: "Wystaw korektę",
      issued: "Wystawiono korektę",
      back: "Wstecz",
      submit: "Utwórz notę kredytową",
    },
  },
  invoiceId: {
    label: "ID faktury",
    description: "Faktura, do której wystawiana jest nota",
    placeholder: "Wprowadź ID faktury",
  },
  companyId: {
    label: "ID firmy",
    description: "Firma wystawiająca notę kredytową",
    placeholder: "Wprowadź ID firmy",
  },
  reason: {
    label: "Powód",
    description: "Dlaczego wystawiana jest ta nota kredytowa",
    placeholder: "Opisz powód noty kredytowej",
  },
  lineItems: {
    label: "Pozycje",
    description:
      "Opcjonalne pozycje częściowego kredytu. Bez podania stosowany jest pełny kredyt.",
    placeholder: "",
  },
};
