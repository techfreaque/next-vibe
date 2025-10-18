import type { translations as EnglishCommonTranslations } from "../../en/auth/common";

export const translations: typeof EnglishCommonTranslations = {
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
