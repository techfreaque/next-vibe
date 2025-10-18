import type { translations as EnglishTwoFactorTranslations } from "../../en/auth/twoFactor";

export const translations: typeof EnglishTwoFactorTranslations = {
  title: "Zwei-Faktor-Authentifizierung",
  subtitle:
    "Geben Sie den Verifizierungscode ein, der an Ihr Gerät gesendet wurde",
  codeLabel: "Verifizierungscode",
  codePlaceholder: "6-stelligen Code eingeben",
  verifyButton: "Verifizieren",
  resendCode: "Code erneut senden",
  backToLogin: "Zurück zur Anmeldung",
  setupTitle: "Zwei-Faktor-Authentifizierung einrichten",
  setupInstructions: "Scannen Sie den QR-Code mit Ihrer Authentifizierungs-App",
  enterCodeInstructions:
    "Geben Sie den in Ihrer Authentifizierungs-App angezeigten Code ein",
  enableTwoFactorButton: "Zwei-Faktor-Authentifizierung aktivieren",
  disableTwoFactorButton: "Zwei-Faktor-Authentifizierung deaktivieren",
  twoFactorEnabled: "Zwei-Faktor-Authentifizierung ist aktiviert",
  twoFactorDisabled: "Zwei-Faktor-Authentifizierung ist deaktiviert",
};
