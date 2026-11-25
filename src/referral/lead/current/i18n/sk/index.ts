import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Získať odporúčanie aktuálneho kontaktu",
  titleShort: "Odporúčanie kontaktu",
  description:
    "Vráti kód odporúčania priradený k aktuálnemu kontaktu, ak ho má",
  tag: "Odporúčania",
  noReferral: "Tento kontakt nemá priradené odporúčanie",
  response: {
    referralCode: "Kód odporúčania",
    referralLabel: "Označenie odporúčania",
    subscriptionBonusCredits: "Bonusové kredity k tvojmu prvému plánu",
  },
  errors: {
    validation: {
      title: "Chyba overenia údajov",
      description: "Neplatná požiadavka",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zamietnutý",
    },
    notFound: { title: "Nenašlo sa", description: "Zdroj sa nenašiel" },
    conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
    serverError: {
      title: "Chyba servera",
      description: "Interná chyba servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    network: { title: "Chyba siete", description: "Vyskytla sa chyba siete" },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
  },
  success: {
    title: "Kód odporúčania načítaný",
    description: "Kód odporúčania aktuálneho kontaktu sa úspešne načítal",
  },
};
