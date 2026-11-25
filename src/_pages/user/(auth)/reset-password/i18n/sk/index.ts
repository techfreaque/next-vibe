import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unknown: "Vyskytla sa neznáma chyba",
    title: "Chyba",
  },
  meta: {
    passwordReset: {
      title: "Obnova hesla | {{appName}}",
      description: "Obnovte si heslo k účtu na {{appName}}.",
      category: "Autentifikácia",
      imageAlt: "Obnova hesla",
      keywords: "obnova hesla, zabudnuté heslo, {{appName}}",
    },
  },
  auth: {
    resetPassword: {
      errors: {
        loadingError: "Formulár na obnovu hesla sa nepodarilo načítať",
      },
    },
  },
};
