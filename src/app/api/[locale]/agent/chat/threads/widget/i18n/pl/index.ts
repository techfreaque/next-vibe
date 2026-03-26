import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    newChat: "Nowy czat",
    delete: "Usuń",
    cancel: "Anuluj",
    settings: "Ustawienia",
    close: "Zamknij",
    toggleSidebar: "Przełącz pasek boczny",
    noChatsFound: "Nie znaleziono czatów",
  },
  actions: {
    rename: "Zmień nazwę",
    unpin: "Odepnij",
    pin: "Przypnij na górze",
    unarchive: "Wyciągnij z archiwum",
    archive: "Archiwizuj",
    manageSharing: "Zarządzaj udostępnianiem",
    moveToFolder: "Przenieś do folderu",
    unfiled: "Usuń z folderu",
  },
  folderList: {
    managePermissions: "Zarządzaj uprawnieniami",
    today: "Dzisiaj",
    lastWeek: "Ostatnie 7 dni",
    lastMonth: "Ostatnie 30 dni",
    older: "Starsze",
  },
  threadList: {
    deleteDialog: {
      title: "Usuń wątek",
      description:
        'Czy na pewno chcesz usunąć "{{title}}"? Ta akcja jest nieodwracalna i wszystkie wiadomości w tym wątku zostaną trwale usunięte.',
    },
  },
  suggestedPrompts: {
    title: "Jak mogę pomóc?",
    privateTitle: "Twój prywatny asystent AI",
    privateDescription:
      "Rozmowy zapisywane na Twoim koncie i synchronizowane na wszystkich urządzeniach.",
    sharedTitle: "Współpracuj z AI",
    sharedDescription:
      "Twórz rozmowy i udostępniaj je członkom zespołu za pomocą bezpiecznych linków.",
    publicTitle: "Dołącz do publicznego forum AI",
    publicDescription:
      "Publiczne rozmowy widoczne dla wszystkich. Dziel się pomysłami i angażuj w dialog.",
    incognitoTitle: "Anonimowy czat AI",
    incognitoDescription:
      "Przechowywane tylko w Twojej przeglądarce. Nigdy nie zapisywane na koncie ani synchronizowane.",
  },
  config: {
    appName: "unbottled.ai",
  },
  components: {
    sidebar: {
      login: "Zaloguj się",
      signup: "Zarejestruj się",
      logout: "Wyloguj się",
      footer: {
        account: "Konto",
      },
    },
    credits: {
      credit: "{{count}} kredyt",
      credits: "{{count}} kredytów",
    },
    navigation: {
      subscription: "Subskrypcja i Kredyty",
      referral: "Program Poleceń",
      help: "Pomoc",
      about: "O nas",
      admin: "Panel Admina",
    },
    confirmations: {
      deleteMessage: "Czy na pewno chcesz usunąć tę wiadomość?",
    },
    welcomeTour: {
      authDialog: {
        title: "Odblokuj prywatne i udostępnione foldery",
        description:
          "Zarejestruj się lub zaloguj, aby uzyskać dostęp do prywatnych i udostępnionych folderów. Twoje czaty będą synchronizowane między urządzeniami.",
        continueTour: "Kontynuuj wycieczkę",
        signUp: "Zarejestruj się / Zaloguj",
      },
      buttons: {
        back: "Wstecz",
        close: "Zamknij",
        last: "Zakończ",
        next: "Dalej",
        skip: "Pomiń",
      },
      welcome: {
        title: "Witaj w {{appName}}!",
        description:
          "Twoja platforma AI zorientowana na prywatność z ponad {{modelCount}} modelami, kontrolą treści przez użytkownika i zasadami wolności słowa.",
        subtitle: "Zrób szybką wycieczkę, aby zacząć.",
      },
      aiCompanion: {
        title: "Wybierz swojego towarzysza AI",
        description:
          "Wybieraj spośród ponad {{modelCount}} modeli AI, w tym głównonurtowych, open-source i bez cenzury.",
        tip: "Kliknij, aby otworzyć selektor modeli i wybrać towarzysza.",
      },
      companionVariants: {
        title: "Warianty twojego towarzysza",
        description:
          "Twój towarzysz ma kilka wariantów — brilliant do głębokiego myślenia, smart do codziennych zadań i bez cenzury do niefiltrowanych odpowiedzi. Dotknij dowolny wiersz, aby natychmiast przełączyć.",
        tip: "Możesz przeciągać, aby zmienić kolejność, lub dodawać kolejne warianty w dowolnym momencie.",
      },
      browseSkills: {
        title: "Odkryj więcej umiejętności",
        description:
          "Przeglądaj 40+ specjalistycznych umiejętności — od koderów i badaczy po pisarzy i doradców. Dodaj dowolną umiejętność jako ulubioną, a pojawi się tutaj.",
        tip: "Umiejętności nadają AI konkretny cel i najlepszy model do zadania.",
      },
      rootFolders: {
        title: "Twoje foldery czatów",
        description:
          "Organizuj swoje czaty w różnych folderach, każdy z unikalnymi ustawieniami prywatności:",
        private: {
          name: "Prywatny",
          suffix: "— tylko Ty możesz zobaczyć",
        },
        incognito: {
          name: "Incognito",
          suffix: "— historia nie jest zapisywana",
        },
        shared: {
          name: "Udostępniony",
          suffix: "— współpracuj z innymi",
        },
        public: {
          name: "Publiczny",
          suffix: "— widoczny dla wszystkich",
        },
      },
      privateFolder: {
        name: "Prywatny",
        suffix: "Folder",
        description:
          "Twoje prywatne czaty są widoczne tylko dla Ciebie. Idealne do wrażliwych tematów.",
      },
      incognitoFolder: {
        name: "Incognito",
        suffix: "Folder",
        description:
          "Rozmawiaj bez zapisywania historii na serwerze. Wiadomości są przechowywane lokalnie w przeglądarce i pozostają do momentu ich usunięcia.",
        note: "Żadne dane nie są przechowywane na naszych serwerach podczas sesji incognito.",
      },
      sharedFolder: {
        name: "Udostępniony",
        suffix: "Folder",
        description:
          "Współpracuj z konkretnymi osobami, udostępniając im dostęp do tego folderu.",
      },
      publicFolder: {
        name: "Publiczny",
        suffix: "Folder",
        description:
          "Udostępniaj swoje rozmowy AI światu. Inni mogą przeglądać i forkować Twoje wątki.",
        note: "Wszystko w folderze publicznym jest widoczne dla wszystkich użytkowników i wyszukiwarek.",
      },
      newChatButton: {
        title: "Rozpocznij nowy czat",
        description:
          "Kliknij tutaj, aby rozpocząć nową rozmowę w dowolnym folderze.",
      },
      sidebarLogin: {
        title: "Zaloguj się, aby odblokować więcej",
        description:
          "Utwórz darmowe konto, aby uzyskać dostęp do folderów prywatnych i udostępnionych, synchronizować historię rozmów między urządzeniami i pozwolić AI zapamiętywać informacje o Tobie.",
        tip: "Rejestracja jest bezpłatna!",
      },
      subscriptionButton: {
        title: "Kredyty i subskrypcja",
        description:
          "Otrzymuj {{credits}} kredytów/miesiąc z subskrypcją za jedyne {{price}}/miesiąc. Bezpłatni użytkownicy otrzymują {{freeCredits}} kredytów/miesiąc.",
      },
      chatInput: {
        title: "Wpisz swoją wiadomość",
        description:
          "Wpisz swoją wiadomość tutaj i naciśnij Enter lub kliknij Wyślij, aby rozmawiać z towarzyszem AI.",
        tip: "Użyj Shift+Enter dla nowej linii. Możesz też załączać pliki i zdjęcia.",
      },
      voiceInput: {
        title: "Wprowadzanie głosowe",
        description: "Użyj mikrofonu, aby rozmawiać z towarzyszem AI:",
        options: {
          transcribe: "Transkrybuj mowę na tekst",
          sendAudio: "Wyślij audio bezpośrednio do AI",
          pauseResume: "Wstrzymaj i wznów nagrywanie",
        },
      },
      callMode: {
        title: "Tryb rozmowy — AI odpowiada głosowo",
        description:
          "Dotknij ikony telefonu i po prostu mów. AI słucha, odpowiada na głos i trzyma się krótko — jak prawdziwa rozmowa.",
        tip: "Bez pisania. Bez czytania. Po prostu mów.",
      },
      complete: {
        title: "Gotowe!",
        description:
          "Ukończyłeś wycieczkę! Zacznij teraz rozmawiać z towarzyszem AI.",
        help: "Potrzebujesz pomocy? Kliknij ikonę znaku zapytania na pasku bocznym w dowolnym momencie.",
      },
      authUnlocked: {
        unlocked: "Odblokowany!",
        privateDescription:
          "Twój prywatny folder jest teraz dostępny. Wszystkie czaty są widoczne tylko dla Ciebie.",
        privateNote:
          "Prywatne czaty automatycznie synchronizują się na wszystkich Twoich urządzeniach.",
        sharedDescription:
          "Twój udostępniony folder jest teraz dostępny. Zaproś innych do współpracy przy rozmowach AI.",
        sharedNote:
          "Kontrolujesz, kto ma dostęp do Twoich udostępnionych folderów i wątków.",
      },
    },
  },
};
