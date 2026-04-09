export const translations = {
  get: {
    tag: "lead-magnet-config",
    title: "Konfiguracja Lead Magnet",
    description: "Pobierz swoją aktualną konfigurację lead magnet",
    response: {
      exists: "Konfiguracja istnieje",
      config: "Konfiguracja",
    },
    success: {
      title: "Konfiguracja pobrana",
      description: "Twoja konfiguracja lead magnet została pobrana",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane żądania są nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany",
      },
      forbidden: { title: "Brak dostępu", description: "Nie masz uprawnień" },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono konfiguracji",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      internal: {
        title: "Błąd serwera",
        description: "Wystąpił błąd wewnętrzny",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
    },
  },
  widget: {
    loading: "Ładowanie…",
    noConfig:
      "Brak połączonej platformy e-mail. Wybierz poniżej, aby zacząć zbierać leady.",
    active: "Aktywna",
    inactive: "Nieaktywna",
    choosePlatform: "Wybierz platformę e-mail",
    switchPlatform: "Zmień platformę",
    selectPlaceholder: "Wybierz platformę…",
    providers: {
      GETRESPONSE: "GetResponse",
      KLAVIYO: "Klaviyo",
      EMARSYS: "Emarsys",
      ACUMBAMAIL: "Acumbamail",
      CLEVERREACH: "CleverReach",
      CONNECTIF: "Connectif",
      DATANEXT: "DataNext",
      EDRONE: "Edrone",
      EXPERTSENDER: "ExpertSender",
      FRESHMAIL: "FreshMail",
      MAILUP: "MailUp",
      MAPP: "Mapp",
      SAILTHRU: "Sailthru",
      SALESMANAGO: "SALESmanago",
      SHOPIFY: "Shopify",
      SPOTLER: "Spotler",
      YOULEAD: "YouLead",
      ADOBECAMPAIGN: "Adobe Campaign",
      GOOGLE_SHEETS: "Google Sheets",
      PLATFORM_EMAIL: "E-mail (przez platformę)",
    },
    capturedLeads: "Przechwycone leady",
  },
  delete: {
    tag: "lead-magnet-config",
    title: "Odłącz platformę e-mail",
    description: "Usuń konfigurację lead magnet i zatrzymaj zbieranie leadów",
    response: {
      deleted: "Odłączono",
    },
    success: {
      title: "Odłączono",
      description: "Twoja platforma e-mail została odłączona",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane żądania są nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany",
      },
      forbidden: { title: "Brak dostępu", description: "Nie masz uprawnień" },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono konfiguracji do usunięcia",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      internal: {
        title: "Błąd serwera",
        description: "Wystąpił błąd wewnętrzny",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
    },
  },
};
