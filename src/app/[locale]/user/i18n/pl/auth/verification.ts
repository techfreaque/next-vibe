import type { translations as EnglishVerificationTranslations } from "../../en/auth/verification";

export const translations: typeof EnglishVerificationTranslations = {
  emailVerificationNeeded: "Zweryfikuj swój adres email",
  verificationSent: "Email weryfikacyjny został wysłany na Twój adres email",
  verificationInstructions:
    "Sprawdź swoją skrzynkę odbiorczą i postępuj zgodnie z instrukcjami, aby zweryfikować swoje konto",
  resendVerification: "Wyślij ponownie email weryfikacyjny",
  verificationSuccess: "Twój email został pomyślnie zweryfikowany",
  verificationFailed: "Weryfikacja emaila nie powiodła się",
  verificationExpired: "Link weryfikacyjny wygasł",
  verifyingEmail: "Weryfikowanie Twojego adresu email...",
};
