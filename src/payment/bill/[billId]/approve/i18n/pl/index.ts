import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  receiveBill: "Oznacz fakturę jako otrzymaną",
  supplierDocument: {
    confirmMissing: "Potwierdzam brak dokumentu od dostawcy",
    confirmSeparate: "Potwierdzam, że to osobna opłata",
    missingHelp:
      "Sprawdź dowód bankowy. Zatwierdzenie księguje koszt brutto bez odliczenia VAT.",
    required:
      "Powiąż dokument dostawcy lub potwierdź jego brak. Zatwierdzenie na podstawie banku wymaga zweryfikowanej kwoty brutto bez księgowania VAT.",
    possibleDuplicate:
      "Szkic z banku lub dokument dostawcy ma podobne dane. Powiąż dokument lub potwierdź osobną opłatę.",
  },
  reverseCharge: {
    title: "Odwrotne obciążenie (opcjonalnie)",
    base: "Podstawa opodatkowania w walucie faktury",
    rate: "Stawka VAT (%)",
    help: "Dla otrzymanej faktury niemieckiej małej firmy podaj obie wartości po potwierdzeniu obowiązku rozliczenia VAT. Podatek zwiększy koszty i VAT należny.",
    invalid:
      "Podaj potwierdzoną podstawę i stawkę dla otrzymanej faktury niemieckiej firmy zwolnionej z VAT.",
    cost: "Nieodliczalny VAT z odwrotnego obciążenia",
  },
  tags: { payment: "płatność", bill: "faktura", ap: "zobowiązania" },
  enums: {
    billStatus: {
      DRAFT: "Szkic",
      RECEIVED: "Otrzymana",
      APPROVED: "Zatwierdzona",
      PAID: "Opłacona",
      DISPUTED: "Sporna",
    },
  },
  post: {
    title: "Sprawdź status faktury",
    titleShort: "Sprawdź status faktury",
    description:
      "Zmienia status wersji roboczej lub otrzymanej faktury od dostawcy.",
    billId: { label: "ID faktury", description: "Faktura do zatwierdzenia" },
    errors: {
      existingPosting:
        "Sprawdź i uzgodnij istniejący zapis księgowy przed zatwierdzeniem tej faktury.",
      lineTotalsReview:
        "Pozycje nie zgadzają się z zapisaną kwotą netto, VAT lub brutto. Sprawdź oryginalną fakturę dostawcy przed zatwierdzeniem.",
      billLines:
        "Dodaj pozycje o dodatniej sumie i wybierz aktywne konta kosztów tej firmy.",
      posting:
        "Sprawdź kwoty faktury, walutę firmy, okres księgowy i konta księgowe.",
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID faktury",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby zatwierdzać faktury",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola Księgowy lub Administrator",
      },
      conflict: {
        title: "Już zatwierdzona",
        description: "Faktura jest już zatwierdzona lub opłacona",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie można zatwierdzić faktury",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: { title: "Błąd sieci", description: "Sprawdź połączenie" },
      notFound: {
        title: "Faktura nie znaleziona",
        description: "Ta faktura nie istnieje",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Faktura zatwierdzona",
      description: "Status faktury zaktualizowany pomyślnie",
    },
    response: {
      status: "Nowy status",
      journalEntryId: "ID zapisu księgowego",
    },
    widget: {
      back: "Wróć",
      submit: "Potwierdź zmianę statusu",
      confirmTitle: "Zatwierdzić tę fakturę?",
      confirmDescription:
        "Szkic otrzyma status Otrzymana. Zatwierdzenie otrzymanej faktury tworzy zapis księgowy.",
      confirmButton: "Tak, zatwierdź",
      cancelButton: "Anuluj",
      approved: "Status faktury zmieniony",
    },
  },
};
