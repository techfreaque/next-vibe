import type { commonTranslations as EnglishCommonTranslations } from "../../../en/sections/auth/common";

export const commonTranslations: typeof EnglishCommonTranslations = {
  passwordStrength: {
    label: "Siła hasła",
    weak: "Słabe",
    fair: "Średnie",
    good: "Dobre",
    strong: "Silne",
    suggestion:
      "Hasło musi zawierać co najmniej jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny",
  },
  userRoles: {
    public: "Publiczny",
    customer: "Klient",
    courier: "Kurier",
    partnerAdmin: "Administrator partnera",
    partnerEmployee: "Pracownik partnera",
    admin: "Administrator",
  },
};
