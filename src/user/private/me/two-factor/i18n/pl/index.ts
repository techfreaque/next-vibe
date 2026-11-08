import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profil użytkownika",
  title: "Uwierzytelnianie dwuskładnikowe",
  titleShort: "Dwa składniki",
  description:
    "Zabezpiecz konto jednorazowym kodem z aplikacji uwierzytelniającej. Włącz, wyłącz lub wygeneruj nowe kody odzyskiwania.",
  tag: "dwuskladnikowe",
  enums: {
    action: {
      status: "Status",
      setup: "Rozpocznij konfigurację",
      enable: "Potwierdź i włącz",
      disable: "Wyłącz",
      regenerate: "Wygeneruj kody odzyskiwania od nowa",
    },
  },
  fields: {
    action: {
      label: "Akcja",
      description:
        "status, setup, enable, disable lub regenerate. Setup zwraca sekret, enable potwierdza go kodem.",
    },
    code: {
      label: "Kod uwierzytelniający",
      description:
        "6-cyfrowy kod z aplikacji uwierzytelniającej lub kod odzyskiwania.",
      placeholder: "123456",
    },
    password: {
      label: "Hasło",
      description: "Hasło do konta (zamiast kodu przy wyłączaniu).",
      placeholder: "Twoje hasło",
    },
  },
  response: {
    enabled: "Dwuskładnikowe włączone",
    message: "Status",
    recoveryCodesRemaining: "Pozostałe kody odzyskiwania",
    otpauthUri: "URI aplikacji uwierzytelniającej",
    secret: "Klucz tajny",
    qrDataUri: "Kod QR",
    recoveryCodes: "Kody odzyskiwania",
  },
  widget: {
    back: "Wstecz",
    statusOn: "Włączone",
    statusOff: "Wyłączone",
    offIntro:
      "Drugi krok przy logowaniu. Nawet z Twoim hasłem nikt nie wejdzie bez kodu z Twojego telefonu.",
    startSetup: "Włącz uwierzytelnianie dwuskładnikowe",
    setupStep1:
      "1. Zeskanuj ten kod QR aplikacją uwierzytelniającą (Google Authenticator, Aegis, 1Password, Authy).",
    setupStep2: "Nie możesz zeskanować? Wpisz ten klucz ręcznie:",
    setupStep3: "2. Wpisz 6-cyfrowy kod z aplikacji, aby potwierdzić.",
    confirm: "Potwierdź i włącz",
    confirming: "Potwierdzanie...",
    cancelSetup: "Anuluj",
    onIntro:
      "Logowanie wymaga kodu z aplikacji uwierzytelniającej. Pozostałe kody odzyskiwania: {{count}}.",
    recoveryTitle: "Zapisz kody odzyskiwania",
    recoveryHint:
      "Każdy kod działa raz, gdy stracisz telefon. Widzisz je tylko teraz. Schowaj je w bezpiecznym miejscu.",
    recoveryCopy: "Kopiuj kody",
    recoveryCopied: "Skopiowano",
    recoveryDone: "Zapisałem je",
    manageTitle: "Zarządzaj",
    manageHint:
      "Wpisz aktualny kod z aplikacji (lub kod odzyskiwania), aby zmienić ustawienia.",
    regenerate: "Wygeneruj kody odzyskiwania od nowa",
    disable: "Wyłącz uwierzytelnianie dwuskładnikowe",
    disablePasswordHint: "Albo potwierdź hasłem:",
    working: "Trwa...",
  },
  errors: {
    notConfigured:
      "Uwierzytelnianie dwuskładnikowe wymaga klucza serwera (JWT_SECRET_KEY), który nie jest ustawiony.",
    alreadyEnabled:
      "Uwierzytelnianie dwuskładnikowe jest już włączone. Najpierw je wyłącz, aby zacząć od nowa.",
    notEnabled: "Uwierzytelnianie dwuskładnikowe nie jest włączone.",
    noPendingSetup: "Brak trwającej konfiguracji. Najpierw ją rozpocznij.",
    codeRequired: "Wpisz 6-cyfrowy kod.",
    invalidCode:
      "Ten kod jest nieprawidłowy. Sprawdź czas w telefonie i spróbuj ponownie.",
    credentialRequired: "Wpisz aktualny kod, kod odzyskiwania lub hasło.",
    invalidPassword: "Nieprawidłowe hasło.",
    tooManyAttempts:
      "Zbyt wiele błędnych prób. Odczekaj kilka minut i spróbuj ponownie.",
    userNotFound: "Nie znaleziono konta.",
    failed: "Nie udało się zaktualizować ustawień dwuskładnikowych.",
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź dane i spróbuj ponownie",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Musisz być zalogowany, aby zarządzać tą funkcją",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się zaktualizować ustawień",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    network: {
      title: "Błąd sieci",
      description: "Połączenie sieciowe nie powiodło się",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Nie masz uprawnień do tej akcji",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono konta",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt",
    },
  },
  success: {
    title: "Ustawienia zaktualizowane",
    description: "Ustawienia dwuskładnikowe zostały zapisane",
    status: "Wczytano status.",
    setupStarted:
      "Zeskanuj kod QR i potwierdź kodem, aby włączyć zabezpieczenie.",
    enabled:
      "Uwierzytelnianie dwuskładnikowe włączone. Zapisz teraz kody odzyskiwania - widzisz je tylko raz.",
    disabled: "Uwierzytelnianie dwuskładnikowe wyłączone.",
    regenerated:
      "Wygenerowano nowe kody odzyskiwania. Stare przestały działać.",
  },
};
