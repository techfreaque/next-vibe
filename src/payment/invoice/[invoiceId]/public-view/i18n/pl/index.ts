import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Płatności",
  tags: { payment: "płatność", invoice: "faktura" },
  get: {
    title: "Wyświetl fakturę",
    titleShort: "Wyświetl fakturę",
    description: "Publiczny widok faktury przez bezpieczny link z tokenem",
    form: {
      title: "Faktura",
      description: "Wyświetl szczegóły faktury",
    },
    response: {
      id: "ID faktury",
      invoiceNumber: "Numer faktury",
      currency: "Waluta",
      status: "Status",
      amount: "Kwota",
      dueDate: "Termin płatności",
      notes: "Uwagi",
      createdAt: "Data wystawienia",
      companyName: "Firma",
      companyEmail: "E-mail firmy",
      lineId: "ID pozycji",
      lineDescription: "Opis",
      productId: "Produkt",
      quantity: "Ilość",
      unitPrice: "Cena jednostkowa",
      taxRate: "Stawka VAT",
      taxAmount: "Podatek",
      lineTotal: "Suma pozycji",
      sortOrder: "Kolejność",
      lineCreatedAt: "Utworzono",
      lineUpdatedAt: "Zaktualizowano",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Nieprawidłowy link",
        description: "Link do faktury jest nieprawidłowy",
      },
      server: { title: "Błąd serwera", description: "Wewnętrzny błąd serwera" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      forbidden: {
        title: "Odmowa dostępu",
        description: "Nieprawidłowy lub wygasły link do faktury",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Faktura nie znaleziona",
      },
      conflict: { title: "Konflikt", description: "Konflikt stanu faktury" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: { title: "Faktura", description: "Szczegóły faktury" },
  },
  invoiceId: { label: "ID faktury", description: "Faktura do wyświetlenia" },
  token: {
    label: "Token dostępu",
    description: "Bezpieczny token dostępu z e-maila z fakturą",
  },
  widget: {
    submit: "Wyświetl fakturę",
  },
};
