import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  title: "Potwierdź e-mail",
  titleShort: "Potwierdź e-mail",
  description:
    "Potwierdź adres e-mail linkiem, który Ci wysłaliśmy. Bez tokenu link zostanie wysłany ponownie.",
  tag: "potwierdz-email",
  token: {
    label: "Token potwierdzający",
    description:
      "Z linku w e-mailu potwierdzającym. Zostaw puste, aby wysłać e-mail ponownie.",
    placeholder: "Token z e-maila",
  },
  response: {
    verified: "Potwierdzono",
    message: "Status",
    email: "E-mail",
  },
  widget: {
    heroTitle: "Potwierdź e-mail",
    heroDescription: "Jedno kliknięcie i adres jest potwierdzony.",
    confirmButton: "Potwierdź mój e-mail",
    confirming: "Potwierdzanie...",
    doneTitle: "E-mail potwierdzony",
    doneDescription: "Adres potwierdzony. Wszystko gotowe.",
    resend: "Wyślij nowy link",
    continue: "Dalej",
  },
  email: {
    subject: "Potwierdź e-mail w {{appName}}",
    title: "Potwierdź e-mail",
    previewText: "Jedno kliknięcie potwierdza Twój adres w {{appName}}",
    greeting: "Cześć {{name}},",
    body: "Potwierdź ten adres, abyśmy mogli się z Tobą skontaktować w sprawie konta, kredytów i bezpieczeństwa.",
    newsletter:
      "Ten sam klik potwierdza też Twoją subskrypcję newslettera: konto dostaje co miesiąc dodatkowe {{credits}} darmowych kredytów, dopóki subskrybujesz.",
    button: "Potwierdź mój e-mail",
    expiry:
      "Link działa przez {{days}} dni. Jeśli nie zakładałeś konta, zignoruj tę wiadomość.",
    signoff: "- {{appName}}",
  },
  emailTemplates: {
    name: "Potwierdzenie e-maila",
    description:
      "Wysyłany po rejestracji i na żądanie, aby potwierdzić e-mail konta",
    category: "Konto",
  },
  errors: {
    invalidToken:
      "Ten link jest nieprawidłowy lub wygasł. Poproś o nowy w Ustawieniach.",
    userNotFound: "Nie znaleziono konta.",
    failed: "Nie udało się potwierdzić e-maila.",
    needLogin: "Zaloguj się, aby wysłać e-mail potwierdzający ponownie.",
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź dane i spróbuj ponownie",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Zaloguj się, aby wysłać e-mail potwierdzający ponownie",
    },
    server: {
      title: "Błąd serwera",
      description: "Potwierdzenie nie powiodło się z powodu błędu serwera",
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
    title: "Gotowe",
    description: "Potwierdzenie e-maila zaktualizowane",
    verified: "Twój e-mail jest potwierdzony.",
    alreadyVerified: "Twój e-mail jest już potwierdzony.",
    sent: "Wysłano e-mail potwierdzający. Sprawdź skrzynkę.",
  },
};
