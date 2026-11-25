import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účet",
  tags: {
    remoteConnection: "Vzdialené pripojenie",
  },
  providers: {
    memories: "Spomienky",
    documents: "Dokumenty",
    skills: "Zručnosti",
    favorites: "Obľúbené",
    threads: "Vlákna",
  },
  providerDescriptions: {
    memories: "Synchronizovať spomienky AI medzi inštanciami",
    documents: "Synchronizovať knižnicu dokumentov",
    skills: "Synchronizovať vlastné zručnosti a zadania",
    favorites: "Synchronizovať uložené obľúbené konfigurácie",
    threads: "Synchronizovať vlákna a správy",
  },
  get: {
    title: "Poskytovatelia synchronizácie",
    titleShort: "Poskytovatelia synchronizácie",
    description:
      "Zobraziť poskytovateľov synchronizácie dostupných v nastaveniach pripojenia",
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      network: { title: "Chyba siete", description: "Nepodarilo sa pripojiť" },
      unauthorized: {
        title: "Neprihlásený používateľ",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžaduje sa rola správcu.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nie sú zaregistrovaní žiadni poskytovatelia.",
      },
      server: {
        title: "Chyba servera",
        description: "Poskytovateľov sa nepodarilo načítať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt" },
    },
    success: {
      title: "Poskytovatelia sa načítali",
      description: "Zoznam poskytovateľov synchronizácie sa načítal.",
    },
  },
};
