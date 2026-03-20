export const translations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  widget: {
    signInDescription: "Zaloguj się, aby połączyć się ze zdalnym kontem.",
    benefit1:
      "Wspomnienia synchronizują się automatycznie — wszystko czego uczysz AI przenosi się",
    benefit2: "Dostęp do modeli AI w chmurze i narzędzi z lokalnej instancji",
    benefit3: "Kontekst podróżuje z tobą na wszystkich urządzeniach",
    adminBenefit1: "Wspomnienia synchronizują się dwukierunkowo, automatycznie",
    adminBenefit2:
      "AI w chmurze odkrywa i uruchamia twoje lokalne narzędzia (SSH, pliki, wykonywanie kodu)",
    adminBenefit3:
      "Deleguj zadania z chmury do tej maszyny — Claude Code wykonuje lokalnie",
    adminBenefit4:
      "Snapshot możliwości wysyłany przy każdej synchronizacji — Thea zawsze wie co ta instancja potrafi",
  },
  post: {
    title: "Połącz z kontem zdalnym",
    description:
      "Połącz swoje konto ze zdalną instancją, aby synchronizować wspomnienia",
    remoteUrl: {
      label: "Zdalny URL",
      description:
        "Adres webowy twojego zdalnego konta (np. https://unbottled.ai)",
      placeholder: "https://unbottled.ai",
      validation: {
        required: "Proszę podać zdalny URL",
        invalid: "Proszę podać prawidłowy URL (np. https://unbottled.ai)",
      },
    },
    email: {
      label: "Email",
      description: "Twój adres email na zdalnej instancji",
      placeholder: "ty@przykład.pl",
      validation: {
        required: "Proszę podać email",
        invalid: "Proszę podać prawidłowy adres email",
      },
    },
    password: {
      label: "Hasło",
      description: "Twoje hasło na zdalnej instancji",
      placeholder: "••••••••",
      validation: {
        required: "Proszę podać hasło",
      },
    },
    token: {
      label: "Token",
      description: "Token JWT zdalnej instancji (ustawiany automatycznie)",
      validation: {
        required: "Najpierw zaloguj się do zdalnej instancji",
      },
    },
    leadId: {
      label: "ID leada",
      description: "ID leada zdalnej instancji (ustawiane automatycznie)",
    },
    credentialWarning:
      "Twoje dane logowania trafiają bezpośrednio z przeglądarki do serwera zdalnego. Jednak token przechowywany tutaj daje operatorowi tego serwera pełny dostęp do twojego zdalnego konta — może robić wszystko co ty. Łącz się tylko na serwerach, którym w pełni ufasz.",
    actions: {
      submit: "Połącz",
      submitting: "Łączenie...",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Proszę sprawdzić dane i spróbować ponownie",
      },
      network: {
        title: "Połączenie nieudane",
        description: "Nie można połączyć z serwerem zdalnym. Sprawdź URL",
      },
      unauthorized: {
        title: "Logowanie nieudane",
        description: "Nieprawidłowy email lub hasło do zdalnego konta",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Twoje konto nie ma uprawnień do połączenia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono serwera zdalnego pod tym adresem",
      },
      server: {
        title: "Błąd serwera zdalnego",
        description: "Serwer zdalny napotkał błąd",
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
        title: "Już połączono",
        description:
          "Jesteś już połączony ze zdalną instancją z tym ID instancji",
      },
      instanceIdConflict: {
        title: "ID instancji już zarejestrowane",
        description:
          "Instancja z tym ID jest już zarejestrowana na serwerze zdalnym. Wybierz inny ID instancji.",
      },
      noLeadId: {
        title: "Błąd połączenia",
        description: "Nie udało się nawiązać sesji z serwerem zdalnym",
      },
      invalidUrl: {
        title: "Nieprawidłowy URL zdalny",
        description:
          "Zdalny URL musi wskazywać na publiczny serwer, a nie na adres lokalny lub prywatny",
      },
    },
    success: {
      title: "Połączono!",
      description: "Twoje konto jest teraz połączone ze zdalną instancją",
    },
  },
};
