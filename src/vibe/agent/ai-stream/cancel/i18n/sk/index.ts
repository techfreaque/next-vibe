import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI",
  tags: {
    streaming: "Streamovanie",
  },
  post: {
    title: "Zastaviť odpoveď AI",
    titleShort: "Zastaviť odpoveď",
    description: "Zastaviť generovanie prebiehajúcej odpovede AI",
    container: {
      title: "Zastaviť odpoveď",
      description: "Zastaviť prebiehajúcu odpoveď AI vo vlákne",
    },
    form: {
      title: "Zastaviť odpoveď",
      description: "Zadaj ID vlákna, v ktorom sa má odpoveď zastaviť",
    },
    threadId: {
      label: "ID vlákna",
      description: "ID vlákna, v ktorom sa má odpoveď zastaviť",
    },
    response: {
      title: "Výsledok zastavenia",
      description: "Výsledok zastavenia odpovede",
      cancelled: "Či sa našla a zastavila prebiehajúca odpoveď",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné údaje požiadavky na zastavenie",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Overenie požadované na zrušenie prúdov",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Zastaviť môžeš iba svoje prebiehajúce odpovede",
      },
      notFound: {
        title: "Nenájdené",
        description: "Vlákno sa nenašlo.",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa zastaviť odpoveď",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri zastavovaní odpovede nastal konflikt",
      },
    },
    success: {
      title: "Odpoveď zastavená",
      description: "Odpoveď AI sa zastavila",
    },
    streamInterrupted: "Odpoveď sa prerušila. Doterajší text sme uložili.",
  },
};
