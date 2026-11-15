import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Polecenia",
  tags: {
    referral: "polecenia",
    admin: "admin",
  },
  post: {
    title: "Przenieś kod polecający",
    titleShort: "Przenieś kod",
    description:
      "Przenosi kod polecający na inne konto. Poleceni użytkownicy zostają przy kodzie, więc ich przyszła prowizja trafia do nowego właściciela. Dotychczasowe zarobki zostają u tego, kto je zarobił. Domyślnie próba.",
    fields: {
      code: {
        label: "Kod polecający",
        description: "Dokładny kod do przeniesienia",
        placeholder: "quelllm",
      },
      targetUser: {
        label: "Nowy właściciel",
        description: "ID użytkownika lub e-mail konta, które dostaje kod",
        placeholder: "creator@example.com",
      },
      dryRun: {
        label: "Próba",
        description: "Sprawdź przeniesienie bez żadnych zmian",
      },
    },
    response: {
      dryRun: "Próba",
      code: "Kod",
      fromUserId: "ID poprzedniego właściciela",
      fromEmail: "Poprzedni właściciel",
      toUserId: "ID nowego właściciela",
      toEmail: "Nowy właściciel",
      referralsMoved: "Przeniesieni poleceni użytkownicy",
      selfReferralsKept: "Samopolecenia u poprzedniego właściciela",
      linksMoved: "Przeniesione linki śledzące",
      linksTotal: "Linki kampanii z tym kodem",
    },
    widget: {
      back: "Wstecz",
      hint: "Prowizja idzie za właścicielem kodu. Najpierw próba, potem wyłącz ją i przenieś kod.",
      submit: "Przenieś kod",
      preview: "Próba. Nic nie zmieniono.",
      done: "Kod przeniesiony.",
      summary: "{{code}}: {{from}} → {{to}}",
    },
    note: "Kod polecający {{code}} przeniesiony z {{from}} na {{to}} przez {{admin}} dnia {{at}}. Przeniesieni poleceni użytkownicy: {{referrals}}. Przeniesione linki śledzące: {{links}}. Dotychczasowe zarobki bez zmian.",
  },
  errors: {
    validation: {
      title: "Nieprawidłowe dane",
      description: "Sprawdź kod i nowego właściciela",
    },
    unauthorized: {
      title: "Niezalogowany",
      description: "Zaloguj się jako admin, by przenosić kody",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Tylko admini mogą przenosić kody polecające",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Kod lub użytkownik nie istnieje",
    },
    conflict: {
      title: "Konflikt",
      description: "Nowy właściciel już ma ten kod",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się przenieść kodu",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś nieoczekiwanie poszło nie tak",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany",
    },
    codeNotFound: "Kod polecający {{code}} nie istnieje",
    userNotFound: "Żaden użytkownik nie pasuje do {{target}}",
    alreadyOwner: "{{target}} już ma kod polecający {{code}}",
  },
  success: {
    title: "Gotowe",
    description: "Kod polecający przeniesiony",
  },
};
