export const translations = {
  category: "Lead Magnet",
  tags: {
    leadMagnet: "lead-magnet",
    config: "config",
    capture: "capture",
  },
  enums: {
    captureStatus: {
      success: "Sukces",
      failed: "Błąd",
    },
    provider: {
      getresponse: "GetResponse",
      klaviyo: "Klaviyo",
      emarsys: "Emarsys",
      acumbamail: "Acumbamail",
      cleverreach: "CleverReach",
      connectif: "Connectif",
      datanext: "DataNext",
      edrone: "Edrone",
      expertsender: "ExpertSender",
      freshmail: "FreshMail",
      mailup: "MailUp",
      mapp: "Mapp",
      sailthru: "Sailthru",
      salesmanago: "SALESmanago",
      shopify: "Shopify",
      spotler: "Spotler",
      youlead: "YouLead",
      adobecampaign: "Adobe Campaign",
      googleSheets: "Google Sheets",
      platformEmail: "E-mail (przez platformę)",
    },
  },
  config: {
    title: "Konfiguracja Lead Magnet",
    description: "Skonfiguruj integrację z platformą e-mail",
    form: {
      title: "Ustawienia Lead Magnet",
      description: "Połącz swoją platformę e-mail ze stroną skilla",
      provider: {
        label: "Platforma e-mail",
        description: "Z jakiej platformy e-mail marketing korzystasz?",
      },
      listId: {
        label: "ID listy",
        description: "ID docelowej listy lub segmentu (opcjonalnie)",
      },
      headline: {
        label: "Nagłówek formularza",
        description: "Nagłówek nad formularzem lead capture",
        placeholder: "Pobierz mój pakiet promptów AI za darmo",
      },
      buttonText: {
        label: "Tekst przycisku",
        description: "Tekst na przycisku wysyłania",
        placeholder: "Uzyskaj dostęp →",
      },
      isActive: {
        label: "Aktywny",
        description: "Włącz lub wyłącz formularz lead magnet na stronie skilla",
      },
      credentials: {
        label: "Dane API",
        description: "Dane dostępowe do API (przechowywane zaszyfrowane)",
      },
    },
    success: {
      saved: "Konfiguracja lead magnet zapisana",
      deleted: "Konfiguracja lead magnet usunięta",
    },
  },
  capture: {
    title: "Dołącz do listy",
    description: "Zapisz się i uzyskaj dostęp",
    form: {
      title: "Uzyskaj dostęp",
      description: "Wpisz swoje dane, żeby uzyskać dostęp",
      firstName: {
        label: "Imię",
        description: "Twoje imię",
      },
      email: {
        label: "Adres e-mail",
        description: "Twój adres e-mail",
      },
      skillId: {
        label: "ID skilla",
        description: "Wewnętrzny identyfikator skilla",
      },
    },
    success: {
      submitted: "Jesteś na liście! Sprawdź skrzynkę.",
    },
  },
  errors: {
    providerError: "Błąd dostawcy e-mail",
  },
  providers: {
    shared: {
      listId: {
        label: "ID listy",
        description: "ID docelowej listy lub segmentu",
        placeholder: "np. abc123",
      },
      headline: {
        label: "Nagłówek formularza",
        description: "Nagłówek nad formularzem lead capture na stronie skilla",
        placeholder: "Pobierz mój pakiet promptów AI za darmo",
      },
      buttonText: {
        label: "Tekst przycisku",
        description: "Tekst na przycisku wysyłania",
        placeholder: "Uzyskaj dostęp →",
      },
      isActive: {
        label: "Aktywny",
        description: "Włącz formularz lead capture na stronie skilla",
      },
      saveTitle: "Zapisz konfigurację",
      saveDescription: "Połącz swoją platformę e-mail, żeby zbierać leady",
      saveTag: "lead-magnet-provider",
      saveSuccess: {
        title: "Konfiguracja zapisana",
        description:
          "Twoja platforma e-mail jest połączona. Leady będą zbierane.",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź swoje dane",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany",
        },
        forbidden: { title: "Brak dostępu", description: "Nie masz uprawnień" },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie istnieje",
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
      response: {
        provider: "Dostawca",
        isActive: "Aktywny",
        headline: "Nagłówek",
        buttonText: "Tekst przycisku",
        listId: "ID listy",
      },
    },
    klaviyo: {
      title: "Połącz Klaviyo",
      description: "Połącz konto Klaviyo ze stroną skilla",
      klaviyoApiKey: {
        label: "Klucz API Klaviyo",
        description: "Twój prywatny klucz API Klaviyo",
        placeholder: "pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    getresponse: {
      title: "Połącz GetResponse",
      description: "Połącz konto GetResponse ze stroną skilla",
      getresponseApiKey: {
        label: "Klucz API GetResponse",
        description: "Twój klucz API GetResponse z ustawień konta",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    emarsys: {
      title: "Połącz Emarsys",
      description: "Połącz konto Emarsys ze stroną skilla",
      emarsysUserName: {
        label: "Nazwa użytkownika",
        description: "Twoja nazwa użytkownika API Emarsys",
        placeholder: "account123",
      },
      emarsysApiKey: {
        label: "Klucz API",
        description: "Twój tajny klucz API Emarsys",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      emarsysSubDomain: {
        label: "Subdomena",
        description: "Twoja subdomena API Emarsys",
        placeholder: "suite.emarsys.net",
      },
    },
    acumbamail: {
      title: "Połącz Acumbamail",
      description: "Połącz konto Acumbamail ze stroną skilla",
      acumbamailApiKey: {
        label: "Klucz API",
        description: "Twój klucz API Acumbamail",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    cleverreach: {
      title: "Połącz CleverReach",
      description: "Połącz konto CleverReach ze stroną skilla",
      cleverreachClientId: {
        label: "Client ID",
        description: "Twoje OAuth Client ID w CleverReach",
        placeholder: "xxxxxxxx",
      },
      cleverreachClientSecret: {
        label: "Client Secret",
        description: "Twoje OAuth Client Secret w CleverReach",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      cleverreachListId: {
        label: "ID grupy",
        description: "ID grupy CleverReach dla nowych kontaktów",
        placeholder: "123456",
      },
      cleverreachFormId: {
        label: "ID formularza DOI (opcjonalnie)",
        description:
          "ID formularza do double opt-in. Zostaw puste, żeby pominąć.",
        placeholder: "123456",
      },
      cleverreachSource: {
        label: "Źródło (opcjonalnie)",
        description: "Etykieta źródła kontaktu",
        placeholder: "unbottled.ai",
      },
    },
    connectif: {
      title: "Połącz Connectif",
      description: "Połącz konto Connectif ze stroną skilla",
      connectifApiKey: {
        label: "Klucz API",
        description: "Twój klucz API Connectif",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    datanext: {
      title: "Połącz DataNext",
      description: "Połącz konto DataNext ze stroną skilla",
      datanextApiKey: {
        label: "Klucz API",
        description: "Twój klucz API DataNext",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextApiSecret: {
        label: "Tajny klucz API",
        description: "Twój tajny klucz API DataNext",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextFormId: {
        label: "ID formularza",
        description: "ID formularza opt-in DataNext",
        placeholder: "123456",
      },
      datanextCampaignId: {
        label: "ID kampanii",
        description: "ID kampanii do przypisania leadów",
        placeholder: "123456",
      },
    },
    edrone: {
      title: "Połącz Edrone",
      description: "Połącz konto Edrone ze stroną skilla",
      edroneAppId: {
        label: "App ID",
        description: "Twoje App ID Edrone",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
    },
    expertsender: {
      title: "Połącz ExpertSender",
      description: "Połącz konto ExpertSender ze stroną skilla",
      expertSenderApiDomain: {
        label: "Domena API",
        description: "Twoja domena API ExpertSender",
        placeholder: "api3.esv2.com",
      },
      expertSenderApiKey: {
        label: "Klucz API",
        description: "Twój klucz API ExpertSender",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    freshmail: {
      title: "Połącz FreshMail",
      description: "Połącz konto FreshMail ze stroną skilla",
      freshmailApiKey: {
        label: "Klucz API",
        description: "Twój klucz API FreshMail",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      freshmailApiSecret: {
        label: "Tajny klucz API",
        description: "Twój tajny klucz API FreshMail",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listHash: {
        label: "Hash listy",
        description: "Hash listy subskrybentów",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    mailup: {
      title: "Połącz MailUp",
      description: "Połącz konto MailUp ze stroną skilla",
      mailupClientId: {
        label: "Client ID",
        description: "Twoje OAuth Client ID w MailUp",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupClientSecret: {
        label: "Client Secret",
        description: "Twoje OAuth Client Secret w MailUp",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupUsername: {
        label: "Nazwa użytkownika",
        description: "Twoja nazwa użytkownika MailUp",
        placeholder: "m12345",
      },
      mailupPassword: {
        label: "Hasło",
        description: "Twoje hasło do MailUp",
        placeholder: "••••••••",
      },
      mailupListId: {
        label: "ID listy",
        description: "Numeryczne ID listy subskrybentów",
        placeholder: "1",
      },
    },
    mapp: {
      title: "Połącz Mapp",
      description: "Połącz konto Mapp ze stroną skilla",
      mappUsername: {
        label: "Nazwa użytkownika",
        description: "Twoja nazwa użytkownika API Mapp",
        placeholder: "username",
      },
      mappPassword: {
        label: "Hasło",
        description: "Twoje hasło API Mapp",
        placeholder: "••••••••",
      },
      mappDomain: {
        label: "Domena",
        description: "Twoja domena API Mapp",
        placeholder: "api.mapp.com",
      },
    },
    sailthru: {
      title: "Połącz Sailthru",
      description: "Połącz konto Sailthru ze stroną skilla",
      sailthruApiKey: {
        label: "Klucz API",
        description: "Twój klucz API Sailthru",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      sailthruSecret: {
        label: "Tajny klucz API",
        description: "Twój tajny klucz API Sailthru",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listName: {
        label: "Nazwa listy",
        description: "Nazwa listy Sailthru dla subskrybentów",
        placeholder: "Moi subskrybenci",
      },
    },
    salesmanago: {
      title: "Połącz SALESmanago",
      description: "Połącz konto SALESmanago ze stroną skilla",
      salesManagoClientId: {
        label: "Client ID",
        description: "Twoje Client ID w SALESmanago",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      salesManagoApiKey: {
        label: "Klucz API",
        description: "Twój klucz API SALESmanago",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoSha: {
        label: "Hash SHA",
        description: "Twój hash SHA do uwierzytelnienia w SALESmanago",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoDomain: {
        label: "Domena",
        description: "Twoja domena API SALESmanago",
        placeholder: "app3.salesmanago.pl",
      },
      salesManagoOwner: {
        label: "E-mail właściciela",
        description: "E-mail właściciela konta SALESmanago",
        placeholder: "wlasciciel@example.com",
      },
    },
    shopify: {
      title: "Połącz Shopify",
      description: "Połącz sklep Shopify ze stroną skilla",
      shopifyDomain: {
        label: "Domena sklepu",
        description: "Domena Twojego sklepu Shopify",
        placeholder: "mojsklep.myshopify.com",
      },
      shopifyAccessToken: {
        label: "Token dostępu",
        description: "Twój token dostępu Shopify Admin API",
        placeholder: "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    spotler: {
      title: "Połącz Spotler",
      description: "Połącz konto Spotler ze stroną skilla",
      spotlerConsumerKey: {
        label: "Consumer Key",
        description: "Twój Consumer Key API Spotler",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      spotlerConsumerSecret: {
        label: "Consumer Secret",
        description: "Twój Consumer Secret API Spotler",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    youlead: {
      title: "Połącz YouLead",
      description: "Połącz konto YouLead ze stroną skilla",
      youLeadAppId: {
        label: "App ID",
        description: "Twój App ID w YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadClientId: {
        label: "Client ID",
        description: "Twoje Client ID w YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadAppSecretKey: {
        label: "App Secret Key",
        description: "Twój tajny klucz aplikacji YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    adobecampaign: {
      title: "Połącz Adobe Campaign",
      description: "Połącz konto Adobe Campaign ze stroną skilla",
      adobeCampaignOrganizationId: {
        label: "ID organizacji",
        description: "Twoje Adobe IMS ID organizacji",
        placeholder: "XXXXXXXXXXXXXXXXXXXXXXXX@AdobeOrg",
      },
      adobeCampaignClientId: {
        label: "Client ID",
        description: "Twoje Client ID API Adobe Campaign",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignClientSecret: {
        label: "Client Secret",
        description: "Twój Client Secret API Adobe Campaign",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignApiKey: {
        label: "Klucz API",
        description: "Twój klucz API Adobe Campaign",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignListId: {
        label: "ID listy",
        description: "ID listy profili Adobe Campaign",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    platformEmail: {
      title: "Powiadomienie e-mailem platformy",
      description:
        "Otrzymuj e-mail za każdym razem, gdy ktoś zapisze się przez Twój lead magnet",
      notifyEmail: {
        label: "E-mail powiadomień",
        description: "Adres, na który będą wysyłane powiadomienia o leadach",
        placeholder: "ty@przyklad.pl",
      },
      notifyEmailName: {
        label: "Twoje imię",
        description: "Imię widoczne w e-mailu powiadomienia",
        placeholder: "Janina",
      },
    },
    googleSheets: {
      title: "Połącz Google Sheets",
      description:
        "Dodaje nowy wiersz do arkusza Google za każdym razem, gdy ktoś się zapisze",
      saveTitle: "Zapisz konfigurację Google Sheets",
      connect: {
        label: "Połącz konto Google",
      },
      connected: {
        description: "Twoje konto Google jest połączone",
      },
      spreadsheetId: {
        label: "Arkusz kalkulacyjny",
        description: "Wybierz arkusz, do którego będą zapisywane leady",
        placeholder: "Wybierz arkusz…",
      },
      sheetTab: {
        label: "Zakładka arkusza (opcjonalnie)",
        description: "Nazwa zakładki. Domyślnie: pierwsza zakładka.",
        placeholder: "np. Leady",
      },
      widget: {
        connectTitle: "Połącz Google Sheets",
        connectDescription:
          "Zaloguj się przez Google, by każdy nowy lead trafiał automatycznie jako wiersz do arkusza.",
        redirectNote:
          "Zostaniesz przekierowany do Google w celu autoryzacji dostępu.",
        reconnect: "Połącz ponownie",
        loading: "Ładowanie arkuszy…",
        noSheets: "Nie znaleziono arkuszy",
        refresh: "Odśwież listę",
        selectRequired: "Wybierz arkusz kalkulacyjny",
        saveFailed: "Nie udało się zapisać. Spróbuj ponownie.",
        saving: "Zapisywanie…",
      },
    },
  },
};
