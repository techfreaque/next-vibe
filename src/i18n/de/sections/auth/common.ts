import type { commonTranslations as EnglishCommonTranslations } from "../../../en/sections/auth/common";

export const commonTranslations: typeof EnglishCommonTranslations = {
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
