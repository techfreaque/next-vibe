import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie serwerem",
  tags: {
    imagePush: "Wysyłka obrazu",
  },
  post: {
    title: "Zbuduj i wyślij obraz",
    titleShort: "Wyślij obraz",
    description:
      "Buduje produkcyjny obraz Docker i dostarcza go do rejestru lub bezpośrednio na serwer przez SSH, dzięki czemu serwer wdrożeniowy tylko go pobiera (lub już go ma) zamiast budować",
    form: {
      title: "Konfiguracja wysyłki obrazu",
      description: "Skonfiguruj nazwę obrazu, tag i docelową platformę",
      submit: "Zbuduj i wyślij",
      runAgain: "Uruchom ponownie",
    },
    fields: {
      image: {
        title: "Obraz",
        description:
          "Rejestr + nazwa obrazu do zbudowania i wysłania. Domyślnie DOCKER_IMAGE_NAME z pliku .env.",
      },
      commit: {
        title: "Commit",
        description:
          "Commit do zbudowania: SHA, tag lub nazwa gałęzi. Domyślnie HEAD bieżącej gałęzi. Wysyłany jest tylko zatwierdzony kod. Niezatwierdzone zmiany w katalogu roboczym nigdy nie trafiają do obrazu.",
      },
      tag: {
        title: "Tag",
        description:
          "Tag obrazu. Domyślnie krótki SHA budowanego commita. Krótki SHA i 'latest' są zawsze tagowane dodatkowo.",
      },
      push: {
        title: "Wyślij",
        description:
          "Wyślij do rejestru (lub prześlij na cel SSH) po zbudowaniu. Wyłącz, aby zbudować tylko lokalnie: bez wysyłki, bez SSH, bez wdrożenia.",
      },
      platform: {
        title: "Platforma",
        description:
          "Docelowa platforma budowania (docker buildx --platform). Musi odpowiadać architekturze serwera wdrożeniowego - zwykle linux/amd64.",
      },
      sshTarget: {
        title: "Cel SSH",
        description:
          "user@host do przesłania zbudowanego obrazu bezpośrednio przez SSH zamiast do rejestru (np. root@203.0.113.5) - domyślnie SSH_SERVER, jeśli ustawiony. Używa SSH_SERVER_PWD do uwierzytelniania hasłem, w przeciwnym razie Twojego własnego klucza/konfiguracji SSH. Zostaw puste, aby zamiast tego wysłać do rejestru.",
      },
      secondary: {
        title: "Zaktualizuj też Server 2",
        description:
          "Gdy Server 1 działa i jest zdrowy, zaktualizuj też drugi węzeł HA (SSH_SERVER2): wczytaj obraz pod SSH_SERVER2_IMAGE_TAG (nigdy :latest), skopiuj .env z Servera 1, uruchom ponownie, sprawdź zdrowie, w razie błędu cofnij automatycznie. Caddy na każdej maszynie w tym czasie obsługuje ruch z drugiej, więc nikt nie zauważy przerwy. Pomijane, gdy brak SSH_SERVER2 albo podano --sshTarget.",
      },
      primary: {
        title: "Wdróż Server 1",
        description:
          "Domyślnie włączone. Wyłączone = Server 1 leży albo jest odcięty po failoverze: obraz idzie z tej maszyny prosto na Server 2 (SSH_SERVER2) i aktualizowany jest tylko ten węzeł, z jego własnym .env i nadpisaniami z failoveru. Wolne (upload z domu, bez przekazu serwer-serwer).",
      },
      drain: {
        title: "Opróżnij przed restartem",
        description:
          "Domyślnie włączone (oba węzły HA). Każdy węzeł najpierw wychodzi z rotacji (Caddy kieruje nowe żądania do drugiego węzła, DNS go usuwa), kończy trwające strumienie AI i zadania, przekazuje klientów WebSocket i dopiero wtedy dostaje nowy obraz. Najpierw Server 1, potem Server 1 przejmuje ruch z powrotem, a Server 2 się opróżnia. Wyłączone = restart od razu, bez czekania (stare zachowanie).",
      },
      drainTimeout: {
        title: "Limit opróżniania (sekundy)",
        description:
          "Najdłuższy czas, przez jaki węzeł czeka na trwającą pracę AI przed restartem. To, co nadal działa, dostaje drain przy wyłączaniu (STREAM_DRAIN_TIMEOUT_MS) i zostaje przerwane z zapisaną częściową treścią.",
      },
      success: {
        title: "Sukces",
      },
      output: {
        title: "Wynik",
      },
      resolvedImage: {
        title: "Obraz",
      },
      tags: {
        title: "Wysłane tagi",
      },
      duration: {
        title: "Czas trwania (ms)",
      },
    },
    errors: {
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Podano nieprawidłowe parametry wysyłki obrazu",
      },
      network: {
        title: "Błąd sieci",
        description:
          "Połączenie sieciowe nie powiodło się podczas wysyłki obrazu",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby zbudować i wysłać obraz",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do budowania i wysyłania obrazu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono zasobów wysyłki obrazu",
      },
      server: {
        title: "Błąd serwera",
        description: "Budowanie lub wysyłka obrazu Docker nie powiodła się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Podczas wysyłki obrazu wystąpił nieznany błąd",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt wysyłki obrazu",
      },
      unsavedChanges: {
        title: "Nieznany błąd",
        description: "Podczas wysyłki obrazu wystąpił nieznany błąd",
      },
    },
    success: {
      title: "Obraz wysłany",
      description: "Obraz Docker zbudowany i wysłany pomyślnie",
    },
    repository: {
      messages: {
        buildStart: "🐳 Budowanie {{image}}:{{tag}} ...",
        buildSuccess: "✅ Zbudowano {{refs}} (nie wysłano)",
        pushSuccess: "🚀 Wysłano {{refs}}",
        buildExitCode: "docker buildx zakończył się kodem {{code}}",
        buildKilled: "docker buildx został zabity sygnałem {{signal}}",
        dockerBuildFailed:
          "Budowanie obrazu Docker nie powiodło się: {{error}}",
        commitResolveFailed: "Nie udało się ustalić commita '{{ref}}'",
        commitResolveFailedDetail:
          "Nie udało się ustalić commita '{{ref}}': {{error}}",
        commitResolved: "📌 Budowanie commita {{sha}} ({{ref}}): {{subject}}",
        dirtyTreeWarning:
          "⚠️ Katalog roboczy ma {{count}} niezatwierdzonych zmian. NIE trafiają do obrazu. Budowany jest tylko commit {{sha}}.",
        deployedShaRecorded: "📝 Zapisano wdrożony commit {{sha}} w {{path}}",
        deployedShaRecordFailed:
          "Wdrożenie się udało, ale zapis {{path}} nie powiódł się: {{error}}",
        exportStart: "📦 Eksport commita {{sha}} do {{dir}} ...",
        exportReused: "📦 Używam wyeksportowanego drzewa {{sha}} w {{dir}}",
        exportFailed: "Eksport commita {{sha}} nie powiódł się: {{error}}",
        sshTransferStart: "📡 Przesyłanie {{refs}} do {{target}} przez ssh ...",
        sshTransferSuccess: "🚀 Przesłano {{refs}} do {{target}} przez ssh",
        sshTransferFailed:
          "Przesyłanie ssh do {{target}} nie powiodło się: {{error}}",
        scriptSynced:
          "📜 Zsynchronizowano {{script}} na {{target}} z commita {{sha}}",
        scriptSyncFailed:
          "Synchronizacja {{script}} na {{target}} nie powiodła się, deploy przerwany: {{error}}",
        scriptMissing: "Brak {{path}} w commicie {{sha}}",
        scriptSyntaxInvalid:
          "bash -n odrzucił {{path}} z commita {{sha}}. Działający skrypt nietknięty.",
        scriptRemoteExit: "Polecenie zdalne zakończyło się kodem {{code}}",
        secondaryStart:
          "🔁 Server 1 działa. Aktualizuję Server 2 ({{target}}) ...",
        secondarySuccess:
          "🚀 Wdrożono {{refs}} na {{target}} i Server 2 ({{secondary}})",
        secondaryOnlyMissing:
          "--primary=false aktualizuje tylko Server 2, ale SSH_SERVER2 nie jest ustawiony",
        secondaryOnlySuccess:
          "🚀 Server 1 pominięty. Wdrożono {{refs}} na Server 2 ({{secondary}})",
        secondaryOnlyFailed:
          "Aktualizacja samego Servera 2 ({{secondary}}) nie powiodła się: {{error}}. Server 2 zachował lub przywrócił poprzedni obraz.",
        secondaryFailed:
          "Server 1 ({{target}}) działa NA ŻYWO z nowym obrazem, ale aktualizacja Servera 2 ({{secondary}}) nie powiodła się: {{error}}. Server 2 zachował lub przywrócił poprzedni obraz.",
        drainStart:
          "🚰 Opróżniam {{node}}: nowy ruch idzie do drugiego węzła, trwająca praca AI ma do {{timeout}}s",
        drainSwap:
          "🔀 {{from}} działa na nowym obrazie i przejmuje ruch z powrotem. Opróżniam {{to}} (do {{timeout}}s)",
        drainUndrained: "{{node}} wrócił do rotacji na poprzednim obrazie",
        drainLeftDrained:
          "{{node}} zostaje OPRÓŻNIONY (poza rotacją, drugi węzeł obsługuje cały ruch): {{error}}. Napraw to, potem na obu maszynach: bash scripts/ha-node-drain.sh edge-off {{node}}",
        drainPreflightFailed:
          "Wstępna kontrola drainu na {{target}} odrzuciła wdrożenie, nic nie zmieniono: {{error}}",
        drainScriptMissing:
          "Brak scripts/ha-node-drain.sh w commicie {{sha}}: wdrożenie bez drainu",
        drainStepFailed:
          "ha-node-drain.sh {{step}} na {{target}} nie powiódł się: {{error}}",
        envSyncFailed:
          "Kopiowanie .env z Servera 1 na Server 2 nie powiodło się: {{error}}",
      },
    },
  },
};
