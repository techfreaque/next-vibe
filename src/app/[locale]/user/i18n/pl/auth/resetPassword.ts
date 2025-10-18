import type { translations as EnglishResetPasswordTranslations } from "../../en/auth/resetPassword";

export const translations: typeof EnglishResetPasswordTranslations = {
  title: "Zresetuj swoje hasło",
  subtitle: "Wyślemy Ci email z linkiem do resetowania hasła",
  emailLabel: "Adres email",
  emailPlaceholder: "Wprowadź swój email",
  sendResetLink: "Wyślij link resetujący",
  backToLogin: "Powrót do logowania",
  successTitle: "Sprawdź swój email",
  successMessage:
    "Jeśli konto z tym emailem istnieje, wysłaliśmy instrukcje resetowania hasła.",
  createNewPasswordTitle: "Utwórz nowe hasło",
  createNewPasswordSubtitle: "Wprowadź swoje nowe hasło poniżej",
  newPasswordLabel: "Nowe hasło",
  newPasswordPlaceholder: "Wprowadź nowe hasło",
  confirmNewPasswordLabel: "Potwierdź nowe hasło",
  confirmNewPasswordPlaceholder: "Potwierdź nowe hasło",
  confirmPasswordPlaceholder: "Potwierdź swoje hasło",
  resetPasswordButton: "Zresetuj hasło",
  passwordTips: {
    title: "Utwórz bezpieczne hasło",
    description:
      "Użyj silnego hasła o długości co najmniej 8 znaków z mieszanką liter, cyfr i symboli.",
  },
  passwordResetSuccessTitle: "Hasło zostało pomyślnie zresetowane",
  passwordResetSuccessMessage:
    "Twoje hasło zostało zresetowane. Możesz teraz zalogować się swoim nowym hasłem.",
  signInNowButton: "Zaloguj się teraz",
  requestNewLink: "Poproś o nowy link resetujący",
  email: {
    subject: "Resetowanie hasła dla {{appName}}",
    title: "Resetowanie hasła dla {{appName}}",
    previewText: "Zresetuj swoje hasło dla {{appName}}",
    greeting: "Witaj {{firstName}},",
    requestInfo:
      "Poprosiłeś o resetowanie hasła dla swojego konta {{appName}}.",
    instructions: "Kliknij przycisk poniżej, aby zresetować swoje hasło:",
    buttonText: "Zresetuj hasło",
    expirationInfo:
      "Ten link wygaśnie za 24 godziny ze względów bezpieczeństwa.",
  },
  success: {
    title: "Resetowanie hasła pomyślne",
    password_reset:
      "Twoje hasło zostało pomyślnie zresetowane. Możesz teraz zalogować się swoim nowym hasłem.",
  },
  emailSent: "Email z resetowaniem hasła został wysłany",
  errors: {
    title: "Resetowanie hasła nie powiodło się",
    emailRequired: "Email jest wymagany",
    invalidEmail: "Wprowadź prawidłowy adres email",
    invalidToken: "Link resetujący hasło jest nieprawidłowy lub wygasł",
    tokenExpired: "Link resetujący hasło wygasł",
    passwordRequired: "Hasło jest wymagane",
    passwordTooShort: "Hasło musi mieć co najmniej 8 znaków",
    passwordRequirements:
      "Hasło musi zawierać co najmniej jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny",
    passwords_do_not_match: "Hasła nie pasują do siebie",
    confirm_failed: "Nie udało się zresetować hasła: {{error}}",
    loadingError: "Błąd ładowania strony resetowania hasła",
    unexpected: "Wystąpił nieoczekiwany błąd",
    serverError: "Wystąpił błąd. Spróbuj ponownie później.",
  },
  instructions: {
    title: "Instrukcje resetowania hasła",
    description:
      "Wprowadź swój adres email, a wyślemy Ci link do resetowania hasła.",
  },
  confirmEmail: {
    subject: "Potwierdzenie resetowania hasła dla {{appName}}",
    title: "Potwierdzenie resetowania hasła dla {{appName}}",
    previewText: "Twoje hasło dla {{appName}} zostało pomyślnie zresetowane.",
    greeting: "Witaj {{firstName}},",
    successMessage:
      "Twoje hasło dla {{appName}} zostało pomyślnie zresetowane.",
    loginInstructions: "Możesz teraz zalogować się swoim nowym hasłem.",
    securityWarning:
      "Jeśli nie prosiłeś o to resetowanie hasła, skontaktuj się natychmiast z naszym zespołem wsparcia.",
    securityTip:
      "Ze względów bezpieczeństwa zalecamy regularne zmienianie hasła i używanie unikalnego hasła dla każdej usługi.",
  },
};
