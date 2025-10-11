import type { managementTranslations as EnglishManagementTranslations } from "../../../../../en/sections/templateApiImport/templateApi/import/management";

export const managementTranslations: typeof EnglishManagementTranslations = {
  meta: {
    title: "Zarządzanie Importem Szablonów - Zarządzaj Historią Importu",
    description:
      "Przeglądaj i zarządzaj historią importu szablonów, śledź postęp i wykonuj operacje masowe.",
    category: "Zarządzanie Importem Szablonów",
    imageAlt: "Panel zarządzania importem szablonów",
    keywords: {
      templateManagement: "zarządzanie szablonami",
      importHistory: "historia importu",
      bulkOperations: "operacje masowe",
      importTracking: "śledzenie importu",
      templateDashboard: "panel szablonów",
    },
  },
  title: "Zarządzanie Importem",
  description: "Zarządzaj swoimi importami szablonów i przeglądaj historię",
  history: {
    title: "Historia Importu",
    description: "Zobacz wszystkie swoje poprzednie importy szablonów",
    empty: "Nie znaleziono importów",
    columns: {
      date: "Data",
      format: "Format",
      status: "Status",
      records: "Rekordy",
      actions: "Akcje",
    },
  },
  actions: {
    view: "Zobacz Szczegóły",
    download: "Pobierz Wyniki",
    retry: "Ponów Import",
    cancel: "Anuluj Import",
    delete: "Usuń",
  },
};
