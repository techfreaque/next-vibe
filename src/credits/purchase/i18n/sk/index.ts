import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
  },
  post: {
    title: "Kúpiť kredity",
    titleShort: "Kúpiť kredity",
    description: "Vytvoriť reláciu Stripe Checkout na nákup balíka kreditov",
    container: {
      title: "Kúpiť kredity",
      description: "Kúpiť balíky kreditov na používanie funkcií AI",
    },
    quantity: {
      label: "Počet balíkov",
      description: "Počet balíkov kreditov na nákup (1 až 10)",
      placeholder: "Zadaj počet balíkov (1 až 10)",
    },
    productId: {
      label: "Balík kreditov",
      description: "Vyber veľkosť balíka",
      placeholder: "Vybrať balík",
    },
    provider: {
      label: "Vybrať spôsob platby",
      description: "Vyber si, ako chceš zaplatiť za balík kreditov",
      placeholder: "Vybrať poskytovateľa platby",
      stripe: "Karta, PayPal a digitálne peňaženky",
      stripeDescription: "Karta, PayPal, Apple Pay a Google Pay cez Stripe",
      nowpayments: "Kryptomena",
      nowpaymentsDescription:
        "Zaplať Bitcoinom, Ethereom alebo ďalšími kryptomenami",
      cryptoMinimumDisabled:
        "Pri platbe kryptomenou je minimálny počet balíkov {{min}}",
    },
    checkoutUrl: {
      content: "URL platby",
    },
    sessionId: {
      content: "ID relácie",
    },
    totalAmount: {
      content: "Celková suma (centy)",
    },
    totalCredits: {
      content: "Kredity spolu",
    },
    pack: {
      addPack: "Pridať jeden balík",
      removePack: "Odobrať jeden balík",
      qtyCredits: "Počet kreditov: {{count}}",
      title: "Balík kreditov",
      description:
        "Doplň si kredity k predplatnému. Kredity z balíka nemajú časové obmedzenie.",
      perPack: "/ balík",
      features: {
        credits: "Počet kreditov v balíku: {{count}}",
        expiry: "Kredity nemajú časové obmedzenie",
        bestFor: "Pripočítajú sa k mesačným kreditom",
      },
      planRequired: {
        title: "Balíky dopĺňajú kredity k plánu",
        body: "Najprv si aktivuj plán. Keď ti budú dochádzať kredity, kedykoľvek pridaj balík. Plány od {{price}} mesačne.",
        cta: "Pozrieť si plány",
      },
      logIn: "Prihlásiť sa",
      signUp: "Zaregistrovať sa",
      signInToBuy:
        "Balíky dopĺňajú kredity k plánu. Najprv si vytvor bezplatný účet a aktivuj predplatné.",
      totalSummary: "Spolu {{totalCredits}} kreditov za {{totalPrice}}",
    },
    submit: {
      text: "Kúpiť balík kreditov",
      loading: "Spracúva sa…",
    },
    redirecting: "Presmerovanie na platbu…",
    openCheckout: "Otvoriť platobnú stránku",
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Kúpiť kredity",
      loadingText: "Spracúva sa…",
    },
    success: {
      title: "Platobná stránka pripravená",
      description: "Relácia Stripe Checkout bola vytvorená",
    },
    errors: {
      planRequired: {
        title: "Vyžaduje sa plán",
        description:
          "Balíky dopĺňajú kredity k aktívnemu plánu. Najprv si vyber plán a potom môžeš kedykoľvek pridať balík.",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatný počet balíkov",
      },
      network: {
        title: "Chyba siete",
        description: "Sieťové pripojenie zlyhalo",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chceš kúpiť kredity, prihlás sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie kúpiť kredity",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj sa nenašiel",
      },
      server: {
        title: "Chyba servera",
        description: "Reláciu na zaplatenie sa nepodarilo vytvoriť",
        detail: "Platbu sa nepodarilo spustiť: {{error}}",
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
        title: "Konflikt údajov",
        description: "Nastal konflikt zdrojov",
      },
    },
  },
  errors: {
    userNotFound: {
      title: "Používateľ sa nenašiel",
      description: "Používateľský účet sa nenašiel",
    },
    checkoutFailed: {
      title: "Platbu sa nepodarilo spustiť",
      description: "Nepodarilo sa vytvoriť platobnú reláciu na nákup kreditov",
    },
  },
};
