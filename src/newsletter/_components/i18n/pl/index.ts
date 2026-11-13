import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  heading: "Zapisz się do newslettera",
  subheadingPublic: "Nowe nieocenzurowane modele, nowości, zero spamu.",
  subheadingLoggedIn: "Nowe nieocenzurowane modele, nowości, zero spamu.",
  bonusGuest:
    "Darmowe konto: {{freeCreditsSignedIn}} kredytów miesięcznie, z newsletterem {{freeCreditsMax}}.",
  bonusGuestLink: "Załóż konto za darmo",
  bonusAccount:
    "Potwierdź e-mail: +{{bonusCredits}} darmowych kredytów, razem {{freeCreditsMax}} miesięcznie.",
  emailPlaceholder: "ty@przyklad.pl",
  subscribe: "Zapisz się",
  alreadyIn: "Jesteś na liście. Zajrzyj do skrzynki.",
  success: "Już prawie. Sprawdź skrzynkę i potwierdź.",
  error: "Nie udało się. Spróbuj jeszcze raz.",
  privacy: "W każdej chwili wypiszesz się jednym kliknięciem.",
  loggedInHint: "Wyślemy go na adres e-mail Twojego konta.",
  pending: {
    title: "Potwierdź w skrzynce",
    bodyWithEmail: "Link potwierdzający poszedł na {{email}}.",
    body: "Link potwierdzający czeka w Twojej skrzynce.",
    bonus:
      "Jedno kliknięcie i masz +{{bonusCredits}} darmowych kredytów co miesiąc.",
    resend: "Wyślij ponownie",
    resending: "Wysyłanie...",
    resent: "Wysłane. Nie widzisz? Zajrzyj do spamu.",
  },
  subscribedNotice: {
    title: "Jesteś zapisany",
    bonus:
      "+{{bonusCredits}} darmowych kredytów miesięcznie działa na Twoim koncie.",
    body: "Nowe modele i nowości trafiają prosto do Twojej skrzynki.",
    manage: "Zarządzaj lub wypisz się",
  },
};
