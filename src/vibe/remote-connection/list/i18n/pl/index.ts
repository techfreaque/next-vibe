import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  get: {
    title: "Połączenia zdalne",
    titleShort: "Połączenia",
    description: "Wylistuj wszystkie połączenia zdalne dla swojego konta",
    fields: {
      activeOnly: {
        label: "Tylko aktywne",
        description: "Zwróć tylko aktywne połączenia",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Musisz być zalogowany, aby zobaczyć połączenia",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wylistować połączeń",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono połączeń",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
    },
    success: {
      title: "Połączenia wylistowane",
      description: "Połączenia zdalne pobrane",
    },
  },
  widget: {
    title: "Połączenia zdalne",
    addButton: "Dodaj połączenie",
    emptyState:
      "Połącz kolejną instancję, a wspomnienia i narzędzia będą synchronizować się w obie strony co minutę.",
    emptyStateCloud: "Brak połączonych instancji.",
    connectedBadge: "Połączono",
    registeredBadge: "Zarejestrowano",
    selfBadge: "Własne",
    lastSynced: "Ostatnia synchronizacja",
    never: "Nigdy",
    connectButton: "Połącz lokalną instancję",
    connectButtonLocal: "Połącz z chmurą",
    incomingBadge: "Przychodzące",
    inactiveBadge: "Nieaktywna",
    inferenceProviderBadge: "Wnioskowanie",
    transportBadge: "wych {{out}} · przych {{in}}",
    transport: {
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    health: {
      tunnelOpen: "Tunel otwarty",
      bridgeActive: "Połączono",
      tunnelWarning: "Tunel łączy",
      bridgeWarning: "Synchronizacja",
      tunnelLost: "Tunel utracony",
      bridgeFailed: "Połączenie nieudane",
      disconnected: "Nieaktywna",
      reauthRequired: "Wymaga zalogowania",
      incomingActive: "Aktywna",
    },
    reconnectButton: {
      reauth: "Zaloguj się ponownie",
      reconnect: "Połącz ponownie",
      retry: "Spróbuj ponownie",
      resync: "Zsynchronizuj ponownie",
    },
    instanceId: "ID instancji",
    remoteUrl: "Zdalny URL",
    viewButton: "Podgląd",
    editButton: "Edytuj",
    deleteButton: "Rozłącz",
    cloud: {
      heroTitle: "Twoja własna instancja",
      heroSubtitle:
        "Uruchom next-vibe na własnym sprzęcie i połącz z tym kontem. Czaty, wspomnienia i skille idą za Tobą. Narzędzia działają na Twojej maszynie.",
      stepsTitle: "Połączenie w trzech krokach",
      step1Title: "Zainstaluj next-vibe",
      step1Body: "Open source. Działa na laptopie, domowym serwerze albo VPS.",
      step2Title: "Połącz ze swojej instancji",
      step2Body:
        "Na swojej instancji otwórz Subskrypcja, potem Synchronizacja, potem Połącz z chmurą. Podaj {{appUrl}} i dane logowania tego konta. W terminalu na tej maszynie:",
      step2Command: "vibe remote-connect -i",
      step3Title: "Wybierz, co się synchronizuje",
      step3Body:
        "Wspomnienia, dokumenty, skille, ulubione, czaty. Każde ma swój przełącznik, zmienisz go w dowolnej chwili na swojej instancji.",
      githubCta: "Zobacz na GitHubie",
      quickstartCta: "Szybki start",
      trustTitle: "Co może połączona instancja",
      trust1:
        "Działa jako Ty. Czyta i zapisuje Twoje własne czaty, wspomnienia i skille. Nic z cudzych kont.",
      trust2:
        "Narzędzia administratora pozostają zablokowane. Instancja ma dokładnie te uprawnienia, co Twoje konto.",
      trust3:
        "Zapytania AI, które tu wysyła, zużywają Twoje kredyty po zwykłej stawce: koszt dostawcy plus 30%.",
      trust4:
        "Do {{max}} instancji. Odłącz jedną poniżej, a jej połączenie od razu wygaśnie.",
      paidTitle: "Tylko dla płatnych kont",
      paidBody:
        "Podłączenie własnej instancji wymaga płatnego konta. Odblokuje je dowolny pakiet kredytów lub subskrypcja.",
      paidCta: "Odblokuj",
      alreadyHaveLocal: "Twoje połączone instancje",
      alreadyHaveLocalSub:
        "Każda działa jako to konto. Otwórz jedną, aby sprawdzić status albo ją odłączyć.",
    },
    local: {
      cloudTitle: "Połącz z chmurą",
      cloudSubtitle:
        "Połącz tę lokalną instancję z unbottled.ai (lub inną instancją w chmurze). Wspomnienia synchronizują się co 60 sekund, a Thea może odkrywać i uruchamiać twoje lokalne narzędzia.",
      benefit1: "Wspomnienia synchronizują się dwukierunkowo, automatycznie",
      benefit2: "AI w chmurze odkrywa i uruchamia twoje lokalne narzędzia",
      benefit3: "Deleguj zadania z chmury do tego komputera",
      noConnectionsYet: "Nic jeszcze nie połączono",
      connectionsTitle: "Połączone instancje",
    },
    selfIdentity: {
      title: "Twoje ID instancji",
      description:
        "Inne instancje widzą ten serwer pod tym ID. Musi być unikalne wśród wszystkich połączonych instancji.",
    },
    syncSettings: {
      title: "Auto-synchronizacja",
      description:
        "Synchronizuj zadania i wspomnienia co minutę ze wszystkimi połączonymi instancjami",
      enabledBadge: "Aktywna",
      disabledBadge: "Nieaktywna",
      toggleLabel: "Przełącz auto-synchronizację",
    },
  },
};
