import type { translations as EnglishImportTranslations } from "../../../en/leads/admin/import";

export const translations: typeof EnglishImportTranslations = {
  button: "Importuj Leady",
  title: "Importuj Leady z CSV",
  description: "Prześlij plik CSV, aby zaimportować leady do systemu kampanii",
  template: {
    title: "Pobierz Szablon",
    description: "Pobierz szablon CSV z wymaganymi kolumnami",
    download: "Pobierz Szablon",
    examples: {
      example1:
        "jan@przyklad.com,Przykład Sp. z o.o.,Jan Kowalski,+48-123-456789,https://przyklad.com,PL,pl,website,Zainteresowany funkcjami premium",
      example2:
        "anna@firma.com,Firma SA,Anna Nowak,+48-987-654321,https://firma.com,PL,pl,referral,Szuka automatyzacji social media",
    },
  },
  file: {
    label: "Plik CSV",
    dropzone: {
      title: "Upuść swój plik CSV tutaj",
      description: "lub kliknij, aby przeglądać pliki",
    },
    validation: {
      required: "Proszę wybrać plik CSV do przesłania",
    },
  },
  options: {
    title: "Opcje Importu",
    description:
      "Skonfiguruj sposób obsługi istniejących danych podczas importu",
    skipDuplicates: "Pomiń leady z duplikowanymi adresami e-mail",
    updateExisting: "Aktualizuj istniejące leady nowymi danymi",
  },
  batch: {
    title: "Przetwarzanie Wsadowe",
    description: "Skonfiguruj sposób przetwarzania dużych importów",
    useChunkedProcessing: "Użyj przetwarzania wsadowego",
    useChunkedProcessingDescription:
      "Przetwarzaj duże pliki CSV w mniejszych partiach za pomocą zadań w tle. Zalecane dla plików z więcej niż 1000 wierszami.",
    batchSize: "Rozmiar partii",
    batchSizeDescription: "Liczba wierszy do przetworzenia na partię (10-1000)",
    batchSizePlaceholder: "100",
  },
  defaults: {
    title: "Wartości Domyślne",
    description:
      "Ustaw domyślne wartości dla leadów, które nie określają tych pól",
    country: "Domyślny Kraj",
    countryDescription: "Kraj używany gdy nie jest określony w CSV",
    countryPlaceholder: "Wybierz domyślny kraj",
    language: "Domyślny Język",
    languageDescription: "Język używany gdy nie jest określony w CSV",
    languagePlaceholder: "Wybierz domyślny język",
    status: "Domyślny Status",
    statusDescription: "Status używany gdy nie jest określony w CSV",
    statusPlaceholder: "Wybierz domyślny status",
    campaignStage: "Domyślny Etap Kampanii",
    campaignStageDescription:
      "Etap kampanii używany gdy nie jest określony w CSV",
    campaignStagePlaceholder: "Wybierz domyślny etap kampanii",
    source: "Domyślne Źródło",
    sourceDescription: "Źródło używane gdy nie jest określone w CSV",
    sourcePlaceholder: "Wybierz domyślne źródło",
  },
  progress: {
    title: "Postęp Importu",
    processing: "Przetwarzanie...",
  },
  status: {
    title: "Status Importu",
    pending: "Oczekujący",
    processing: "Przetwarzanie",
    completed: "Zakończony",
    failed: "Nieudany",
    unknown: "Nieznany",
    rows: "wierszy",
    summary:
      "{{successful}} udanych, {{failed}} nieudanych, {{duplicates}} duplikatów",
    andMore: "i {{count}} więcej",
    importing: "Importowanie",
    loading: "Ładowanie statusu importu...",
    activeJobs: "Aktywne zadania importu",
    preparing: "Przygotowywanie importu...",
  },
  settings: {
    title: "Ustawienia zadania importu",
    description: "Dostosuj ustawienia dla tego zadania importu",
    batchSize: "Rozmiar partii",
    maxRetries: "Maksymalna liczba ponownych prób",
  },
  success:
    "Pomyślnie zaimportowano {{successful}} z {{total}} leadów. {{failed}} nieudanych, {{duplicates}} duplikatów.",
  importing: "Importowanie...",
  start: "Rozpocznij Import",
  error: {
    generic: "Import nieudany. Sprawdź format pliku i spróbuj ponownie.",
    invalid_email_format: "Nieprawidłowy format e-mail",
    email_required: "E-mail jest wymagany",
  },
  errors: {
    noData: "Nie znaleziono danych w przesłanym pliku",
    missingHeaders: "Brakuje wymaganych nagłówków w pliku CSV",
  },
};
