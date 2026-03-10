export const translations = {
  category: "SSH",
  type: "SSH",

  enums: {
    authType: {
      password: "Hasło",
      privateKey: "Klucz prywatny (PEM)",
      keyAgent: "Agent SSH",
      local: "Lokalny komputer",
    },
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "/usr/sbin/nologin (brak logowania)",
    },
  },

  errors: {
    localModeOnly: {
      title: "Tylko tryb lokalny",
      description: "Ta funkcja jest dostępna tylko w LOCAL_MODE",
    },
    adminOnly: {
      title: "Tylko administratorzy",
      description:
        "Tylko administratorzy mogą uzyskać dostęp do funkcji maszynowych",
    },
    connectionNotFound: "Połączenie nie znalezione",
    sessionNotFound: "Sesja nie znaleziona",
    fileNotFound: "Plik nie znaleziony",
    directoryNotFound: "Katalog nie znaleziony",
    permissionDenied: "Odmowa dostępu",
    sshSecretKeyNotSet: "Zmienna SSH_SECRET_KEY nie jest ustawiona.",
    encryptionFailed: "Szyfrowanie nieudane",
    noRowReturned: "Brak wiersza zwróconego z wstawiania",
    notImplemented: {
      test: "Backend SSH nie jest jeszcze zaimplementowany.",
      local: "Backend SSH nie jest jeszcze zaimplementowany.",
      fileList: "Backend SSH dla listowania plików nie jest zaimplementowany",
      fileRead: "Backend SSH dla odczytu plików nie jest zaimplementowany",
      fileWrite: "Backend SSH dla zapisu plików nie jest zaimplementowany",
      session: "Sesje SSH PTY nie są jeszcze zaimplementowane.",
    },
    fingerprintMismatch:
      "Odcisk palca hosta uległ zmianie. Możliwy atak MITM. Ustaw acknowledgeNewFingerprint=true.",
    noDefaultConnection:
      "Brak domyślnego połączenia SSH. Utwórz połączenie i ustaw je jako domyślne.",
    sshConnectionFailed: "Połączenie SSH nieudane",
    sshAuthFailed: "Uwierzytelnianie SSH nieudane",
    connectTimeout: "Przekroczono limit czasu połączenia",
    invalidWorkingDir:
      "Nieprawidłowy katalog roboczy: musi być ścieżką bezwzględną bez '..'",
    invalidPath: "Nieprawidłowa ścieżka: musi być bezwzględna bez '..'",
    parentDirNotFound: "Katalog nadrzędny nie znaleziony.",
    commandTimedOut: "Polecenie przekroczyło limit czasu",
    cannotDeleteCurrentUser: "Nie można usunąć bieżącego użytkownika procesu",
    cannotDeleteSystemUser:
      "Nie można usunąć użytkowników systemowych (uid < 1000)",
    userNotFound: "Użytkownik nie znaleziony",
    userAlreadyExists: "Użytkownik już istnieje",
    invalidUsername: "Nieprawidłowa nazwa użytkownika",
  },

  session: {
    read: {
      get: {
        title: "Odczyt wyjścia sesji SSH",
        description: "Odczyt buforowanego wyjścia aktywnej sesji SSH",
        fields: {
          sessionId: {
            label: "ID sesji",
            description: "ID sesji SSH do odczytu",
          },
          waitMs: {
            label: "Oczekiwanie (ms)",
            description: "Milisekundy oczekiwania na wyjście",
          },
          maxBytes: {
            label: "Maks. bajtów",
            description: "Maksymalna liczba bajtów do odczytu",
          },
        },
        response: {
          output: { title: "Wyjście" },
          eof: { title: "EOF" },
          status: { title: "Status" },
        },
        success: {
          title: "Wyjście sesji odczytane",
          description: "Pomyślnie odczytano wyjście sesji",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się odczytać wyjścia sesji",
          },
          notFound: {
            title: "Sesja nie znaleziona",
            description: "Sesja SSH nie znaleziona",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
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
      },
    },
    close: {
      post: {
        title: "Zamknij sesję SSH",
        description: "Zamknij aktywną sesję SSH",
        fields: {
          sessionId: {
            label: "ID sesji",
            description: "ID sesji SSH do zamknięcia",
          },
        },
        response: {
          ok: { title: "Sukces" },
        },
        success: {
          title: "Sesja zamknięta",
          description: "Sesja SSH zamknięta pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się zamknąć sesji",
          },
          notFound: {
            title: "Sesja nie znaleziona",
            description: "Sesja SSH nie znaleziona",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
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
      },
    },
    write: {
      post: {
        title: "Zapis do sesji SSH",
        description: "Wyślij dane wejściowe do aktywnej sesji SSH",
        fields: {
          sessionId: {
            label: "ID sesji",
            description: "ID sesji SSH do zapisu",
          },
          input: {
            label: "Dane wejściowe",
            description: "Tekst do wysłania do sesji",
          },
          raw: {
            label: "Raw",
            description: "Wyślij dane jako surowe bajty bez znaku nowej linii",
          },
        },
        response: {
          ok: { title: "Sukces" },
        },
        success: {
          title: "Dane wysłane",
          description: "Dane wejściowe zapisane do sesji pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się zapisać do sesji",
          },
          notFound: {
            title: "Sesja nie znaleziona",
            description: "Sesja SSH nie znaleziona",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
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
      },
    },
    open: {
      post: {
        title: "Otwórz sesję SSH",
        description: "Otwórz interaktywną sesję terminala SSH",
        fields: {
          connectionId: {
            label: "ID połączenia",
            description: "ID połączenia SSH do użycia",
          },
          name: {
            label: "Nazwa sesji",
            description: "Opcjonalna nazwa sesji",
          },
          cols: {
            label: "Kolumny",
            description: "Szerokość terminala w kolumnach",
          },
          rows: {
            label: "Wiersze",
            description: "Wysokość terminala w wierszach",
          },
        },
        disconnected: "Rozłączono",
        response: {
          sessionId: { title: "ID sesji" },
          status: { title: "Status" },
          shell: { title: "Shell" },
        },
        success: {
          title: "Sesja otwarta",
          description: "Sesja SSH otwarta pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się otworzyć sesji",
          },
          notFound: {
            title: "Połączenie nie znalezione",
            description: "Połączenie SSH nie znalezione",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
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
      },
    },
  },

  terminal: {
    get: {
      title: "Terminal SSH",
      description: "Interaktywny widget terminala SSH",
      response: {
        ok: { title: "Terminal gotowy" },
      },
      success: {
        title: "Terminal gotowy",
        description: "Terminal SSH jest gotowy",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        server: { title: "Błąd serwera", description: "Błąd terminala" },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Wykryto niezapisane zmiany",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie znaleziony",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Walidacja nie powiodła się",
        },
        forbidden: { title: "Zabroniony", description: "Odmowa dostępu" },
      },
    },
  },

  files: {
    read: {
      get: {
        title: "Odczyt zdalnego pliku",
        description: "Odczyt zawartości pliku przez SSH",
        fields: {
          connectionId: {
            label: "ID połączenia",
            description: "Połączenie SSH do użycia",
            placeholder: "uuid",
          },
          path: {
            label: "Ścieżka pliku",
            description: "Bezwzględna ścieżka do pliku",
            placeholder: "/etc/hosts",
          },
          maxBytes: {
            label: "Maks. bajtów",
            description: "Maksymalna liczba bajtów do odczytu",
            placeholder: "102400",
          },
          offset: {
            label: "Offset",
            description: "Offset bajtów od którego zacząć odczyt",
            placeholder: "0",
          },
        },
        response: {
          content: { title: "Zawartość" },
          size: { title: "Rozmiar" },
          truncated: { title: "Obcięty" },
          encoding: { title: "Kodowanie" },
        },
        success: {
          title: "Plik odczytany",
          description: "Zawartość pliku pobrana pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się odczytać pliku",
          },
          notFound: {
            title: "Plik nie znaleziony",
            description: "Plik lub połączenie nie znalezione",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
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
      },
    },
    list: {
      get: {
        title: "Lista zdalnych plików",
        description: "Lista plików w zdalnym katalogu przez SSH",
        fields: {
          connectionId: {
            label: "ID połączenia",
            description: "Połączenie SSH do użycia",
            placeholder: "uuid",
          },
          path: {
            label: "Ścieżka katalogu",
            description: "Bezwzględna ścieżka do katalogu",
            placeholder: "/",
          },
        },
        response: {
          entries: { title: "Wpisy" },
          currentPath: { title: "Bieżąca ścieżka" },
        },
        success: {
          title: "Katalog wylistowany",
          description: "Zawartość katalogu pobrana pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się wylistować katalogu",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Katalog lub połączenie nie znalezione",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
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
      },
    },
    write: {
      post: {
        title: "Zapis zdalnego pliku",
        description: "Zapis zawartości do pliku przez SSH",
        fields: {
          connectionId: {
            label: "ID połączenia",
            description: "Połączenie SSH do użycia",
            placeholder: "uuid",
          },
          path: {
            label: "Ścieżka pliku",
            description: "Bezwzględna ścieżka do zapisu",
            placeholder: "/tmp/file.txt",
          },
          content: {
            label: "Zawartość",
            description: "Zawartość do zapisania w pliku",
            placeholder: "zawartość pliku",
          },
          createDirs: {
            label: "Utwórz katalogi",
            description: "Utwórz katalogi nadrzędne jeśli nie istnieją",
          },
        },
        response: {
          ok: { title: "Sukces" },
          bytesWritten: { title: "Zapisane bajty" },
        },
        success: {
          title: "Plik zapisany",
          description: "Plik zapisany pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się zapisać pliku",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Ścieżka lub połączenie nie znalezione",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
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
      },
    },
  },

  linux: {
    users: {
      list: {
        get: {
          title: "Lista użytkowników Linux",
          description: "Lista użytkowników Linux na zdalnym serwerze przez SSH",
          response: {
            users: { title: "Użytkownicy" },
          },
          success: {
            title: "Użytkownicy wylistowani",
            description: "Użytkownicy Linux pobrani pomyślnie",
          },
          errors: {
            validation: {
              title: "Błąd walidacji",
              description: "Walidacja nie powiodła się",
            },
            unauthorized: {
              title: "Nieautoryzowany",
              description: "Wymagane uwierzytelnienie",
            },
            forbidden: {
              title: "Zabroniony",
              description: "Odmowa dostępu",
            },
            server: {
              title: "Błąd serwera",
              description: "Nie udało się wylistować użytkowników",
            },
            notFound: {
              title: "Nie znaleziono",
              description: "Zasób nie znaleziony",
            },
            unknown: {
              title: "Nieznany błąd",
              description: "Wystąpił nieoczekiwany błąd",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Wykryto niezapisane zmiany",
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
        },
      },
      username: {
        delete: {
          title: "Usuń użytkownika Linux",
          description: "Usuń użytkownika Linux ze zdalnego serwera przez SSH",
          fields: {
            removeHome: {
              label: "Usuń katalog domowy",
              description: "Usuń również katalog domowy użytkownika",
            },
          },
          response: {
            ok: { title: "Sukces" },
          },
          success: {
            title: "Użytkownik usunięty",
            description: "Użytkownik Linux usunięty pomyślnie",
          },
          errors: {
            validation: {
              title: "Błąd walidacji",
              description: "Walidacja nie powiodła się",
            },
            unauthorized: {
              title: "Nieautoryzowany",
              description: "Wymagane uwierzytelnienie",
            },
            forbidden: {
              title: "Zabroniony",
              description: "Odmowa dostępu",
            },
            server: {
              title: "Błąd serwera",
              description: "Nie udało się usunąć użytkownika",
            },
            notFound: {
              title: "Użytkownik nie znaleziony",
              description: "Użytkownik Linux nie znaleziony",
            },
            unknown: {
              title: "Nieznany błąd",
              description: "Wystąpił nieoczekiwany błąd",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Wykryto niezapisane zmiany",
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
        },
      },
      create: {
        post: {
          title: "Utwórz użytkownika Linux",
          description: "Utwórz użytkownika Linux na zdalnym serwerze przez SSH",
          fields: {
            username: {
              label: "Nazwa użytkownika",
              description: "Nazwa użytkownika dla nowego konta",
              placeholder: "deploy",
            },
            groups: {
              label: "Grupy",
              description: "Dodatkowe grupy dla użytkownika",
              placeholder: "sudo,docker",
            },
            shell: {
              label: "Shell",
              description: "Shell logowania dla użytkownika",
              placeholder: "/bin/bash",
            },
            homeDir: {
              label: "Katalog domowy",
              description: "Ścieżka katalogu domowego",
              placeholder: "/home/deploy",
            },
            sudoAccess: {
              label: "Dostęp sudo",
              description: "Przyznaj dostęp sudo użytkownikowi",
            },
          },
          response: {
            ok: { title: "Sukces" },
            uid: { title: "UID" },
            gid: { title: "GID" },
            homeDirectory: { title: "Katalog domowy" },
            shell: { title: "Shell" },
          },
          success: {
            title: "Użytkownik utworzony",
            description: "Użytkownik Linux utworzony pomyślnie",
          },
          errors: {
            validation: {
              title: "Błąd walidacji",
              description: "Walidacja nie powiodła się",
            },
            unauthorized: {
              title: "Nieautoryzowany",
              description: "Wymagane uwierzytelnienie",
            },
            forbidden: {
              title: "Zabroniony",
              description: "Odmowa dostępu",
            },
            server: {
              title: "Błąd serwera",
              description: "Nie udało się utworzyć użytkownika",
            },
            notFound: {
              title: "Nie znaleziono",
              description: "Połączenie nie znalezione",
            },
            unknown: {
              title: "Nieznany błąd",
              description: "Wystąpił nieoczekiwany błąd",
            },
            unsavedChanges: {
              title: "Niezapisane zmiany",
              description: "Wykryto niezapisane zmiany",
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
        },
      },
    },
  },

  exec: {
    post: {
      title: "Wykonaj polecenie SSH",
      description: "Wykonaj polecenie na zdalnym serwerze przez SSH",
      fields: {
        connectionId: {
          label: "ID połączenia",
          description: "Połączenie SSH do użycia",
          placeholder: "uuid",
        },
        command: {
          label: "Polecenie",
          description: "Polecenie do wykonania",
          placeholder: "ls -la",
        },
        workingDir: {
          label: "Katalog roboczy",
          description: "Katalog roboczy dla polecenia",
          placeholder: "/home/user",
        },
        timeoutMs: {
          label: "Timeout (ms)",
          description: "Timeout polecenia w milisekundach",
          placeholder: "30000",
        },
      },
      response: {
        stdout: { title: "Stdout" },
        stderr: { title: "Stderr" },
        exitCode: { title: "Kod wyjścia" },
        status: { title: "Status" },
        durationMs: { title: "Czas trwania (ms)" },
        backend: { title: "Backend" },
        truncated: { title: "Obcięty" },
      },
      success: {
        title: "Polecenie wykonane",
        description: "Polecenie wykonane pomyślnie",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Odmowa dostępu",
        },
        server: {
          title: "Błąd serwera",
          description: "Wykonanie polecenia nie powiodło się",
        },
        notFound: {
          title: "Połączenie nie znalezione",
          description: "Połączenie SSH nie znalezione",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Wykryto niezapisane zmiany",
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
    },
  },

  connections: {
    id: {
      get: {
        title: "Pobierz połączenie SSH",
        description: "Pobierz szczegóły połączenia SSH",
        response: {
          id: { title: "ID" },
          label: { title: "Etykieta" },
          host: { title: "Host" },
          port: { title: "Port" },
          username: { title: "Nazwa użytkownika" },
          authType: { title: "Typ uwierzytelnienia" },
          isDefault: { title: "Domyślne" },
          fingerprint: { title: "Odcisk palca" },
          notes: { title: "Notatki" },
          createdAt: { title: "Utworzono" },
        },
        success: {
          title: "Połączenie znalezione",
          description: "Połączenie SSH pobrane pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Walidacja nie powiodła się",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się pobrać połączenia",
          },
          notFound: {
            title: "Połączenie nie znalezione",
            description: "Połączenie SSH nie znalezione",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
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
      },
    },
    list: {
      get: {
        title: "Lista połączeń SSH",
        description: "Lista wszystkich połączeń SSH",
        response: {
          connections: { title: "Połączenia" },
        },
        success: {
          title: "Połączenia wylistowane",
          description: "Połączenia SSH pobrane pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Walidacja nie powiodła się",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
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
            description: "Wykryto niezapisane zmiany",
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
      },
    },
    create: {
      post: {
        title: "Utwórz połączenie SSH",
        description: "Utwórz nowe połączenie SSH",
        fields: {
          label: {
            label: "Etykieta",
            description: "Przyjazna nazwa połączenia",
            placeholder: "prod-web-01",
          },
          host: {
            label: "Host",
            description: "Nazwa hosta lub IP serwera SSH",
            placeholder: "192.168.1.1",
          },
          port: {
            label: "Port",
            description: "Port serwera SSH",
            placeholder: "22",
          },
          username: {
            label: "Nazwa użytkownika",
            description: "Nazwa użytkownika SSH",
            placeholder: "deploy",
          },
          authType: {
            label: "Typ uwierzytelnienia",
            description: "Metoda uwierzytelnienia",
          },
          secret: {
            label: "Tajemnica",
            description: "Hasło lub klucz prywatny",
          },
          passphrase: {
            label: "Hasło klucza",
            description: "Hasło klucza prywatnego (jeśli dotyczy)",
          },
          isDefault: {
            label: "Domyślne",
            description: "Ustaw jako domyślne połączenie",
          },
          notes: {
            label: "Notatki",
            description: "Opcjonalne notatki o tym połączeniu",
          },
        },
        response: {
          id: { title: "ID" },
        },
        success: {
          title: "Połączenie utworzone",
          description: "Połączenie SSH utworzone pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry połączenia",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się utworzyć połączenia",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Zasób nie znaleziony",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
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
      },
    },
    test: {
      post: {
        title: "Testuj połączenie SSH",
        description: "Testuj połączenie SSH",
        fields: {
          connectionId: {
            label: "ID połączenia",
            description: "ID połączenia SSH do przetestowania",
            placeholder: "uuid",
          },
          acknowledgeNewFingerprint: {
            label: "Potwierdź odcisk palca",
            description: "Potwierdź nowy odcisk palca hosta",
            placeholder: "false",
          },
        },
        response: {
          ok: { title: "Sukces" },
          latencyMs: { title: "Opóźnienie (ms)" },
          fingerprint: { title: "Odcisk palca" },
          fingerprintChanged: { title: "Odcisk palca zmieniony" },
        },
        success: {
          title: "Połączenie udane",
          description: "Test połączenia SSH przeszedł pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry testu",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Odmowa dostępu",
          },
          server: {
            title: "Błąd serwera",
            description: "Test połączenia nie powiódł się",
          },
          notFound: {
            title: "Połączenie nie znalezione",
            description: "Połączenie SSH nie znalezione",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
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
      },
    },
  },
};
