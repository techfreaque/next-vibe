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
    backgroundTitle: "Twoi agenci AI pracują",
    backgroundDescription:
      "Subagenci i autonomiczni agenci w tle wykonują zadania tutaj, gdy Ty zajmujesz się czymś innym. Wyniki trafiają tu automatycznie.",
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
        expandAccount: "Rozwiń sekcję konta",
        collapseAccount: "Zwiń sekcję konta",
      },
    },
    credits: {
      label: "Kredyty",
      credit: "{{count}} kredyt",
      credits: "{{count}} kredytów",
    },
    navigation: {
      subscription: "Subskrypcja i Kredyty",
      partnerDashboard: "Panel partnera",
      apiKeys: "Klucze API",
      referral: "Program Poleceń",
      settings: "Mój profil i ustawienia",
      leadMagnet: "Lead Magnet",
      help: "Opinie i Wsparcie",
      about: "O nas",
      websiteBlog: "Artykuły",
      newsletter: "Newsletter: do {{freeCreditsMax}} darmowych kredytów/mies.",
      admin: "Panel Admina",
    },
    confirmations: {
      deleteMessage: "Czy na pewno chcesz usunąć tę wiadomość?",
    },
    signInGate: {
      title: "Zaloguj się, aby otworzyć ten wątek",
      description:
        "Ta rozmowa jest w prywatnym lub udostępnionym folderze. Zaloguj się na konto, które ma do niej dostęp.",
      signIn: "Zaloguj się",
      signUp: "Załóż darmowe konto",
      incognito: "Zacznij prywatny czat",
    },
  },
};
