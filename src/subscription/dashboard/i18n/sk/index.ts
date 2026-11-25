import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Prehľad predplatného",
    titleShort: "Prehľad",
    description: "Tvoje predplatné na jednom mieste",
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chceš zobraziť predplatné, prihlás sa",
      },
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie zobraziť tieto údaje",
      },
      server: {
        title: "Chyba servera",
        description: "Údaje predplatného sa nepodarilo načítať",
        detail: "Predplatné sa nepodarilo načítať: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt údajov" },
      network: {
        title: "Chyba pripojenia",
        description: "Skontroluj internetové pripojenie",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Predplatné sa nenašlo",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny",
      },
    },
    success: {
      title: "Načítané",
      description: "Údaje predplatného sa načítali",
    },
    response: {
      activeCount: "Aktívne",
      cancelingCount: "Naplánované zrušenie",
      trialCount: "Skúšobné obdobie",
      totalCount: "Spolu",
    },
  },
  widget: {
    renewalDiagnostics: "Obnovenia a zlyhané platby",
    actions: "Rýchle akcie",
    mySubscription: "Moje predplatné",
    manage: "Spravovať",
    refresh: "Obnoviť",
    noData: "Údaje predplatného nie sú dostupné",
  },
};
