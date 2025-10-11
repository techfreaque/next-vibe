import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../../en/sections/imapErrors/agent/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  emailIds: {
    description: "Lista ID e-maili do przetworzenia",
  },
  accountIds: {
    description: "Lista ID kont, z których mają być przetwarzane e-maile",
  },
  forceReprocess: {
    description: "Wymuś ponowne przetwarzanie już przetworzonych e-maili",
  },
  skipHardRules: {
    description: "Pomiń etap przetwarzania twardych reguł",
  },
  skipAiProcessing: {
    description: "Pomiń etap przetwarzania AI",
  },
  priority: {
    description: "Priorytet przetwarzania",
  },
  dryRun: {
    description: "Wykonaj test bez wprowadzania rzeczywistych zmian",
  },
  emailId: {
    description: "ID e-maila do filtrowania",
  },
  accountId: {
    description: "ID konta do filtrowania",
  },
  status: {
    description: "Status przetwarzania do filtrowania",
  },
  actionType: {
    description: "Typ akcji do filtrowania",
  },
  dateFrom: {
    description: "Data początkowa do filtrowania",
  },
  dateTo: {
    description: "Data końcowa do filtrowania",
  },
  sortBy: {
    description: "Pole do sortowania wyników",
  },
  sortOrder: {
    description: "Kolejność sortowania (rosnąco lub malejąco)",
  },
  page: {
    description: "Numer strony do paginacji",
  },
  limit: {
    description: "Liczba elementów na stronę",
  },
  confirmationId: {
    description: "ID żądania potwierdzenia",
  },
  confirmationAction: {
    description: "Akcja do wykonania (zatwierdź lub odrzuć)",
  },
  confirmationReason: {
    description: "Powód decyzji potwierdzenia",
  },
  confirmationMetadata: {
    description: "Dodatkowe metadane dla potwierdzenia",
  },
};
