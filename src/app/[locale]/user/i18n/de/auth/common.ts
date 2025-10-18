import type { translations as EnglishCommonTranslations } from "../../en/auth/common";

export const translations: typeof EnglishCommonTranslations = {
  passwordStrength: {
    label: "Passwortstärke",
    weak: "Schwach",
    fair: "Ausreichend",
    good: "Gut",
    strong: "Stark",
    suggestion:
      "Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten",
  },
  userRoles: {
    public: "Öffentlich",
    customer: "Kunde",
    courier: "Kurier",
    partnerAdmin: "Partner Admin",
    partnerEmployee: "Partner Mitarbeiter",
    admin: "Administrator",
  },
};
