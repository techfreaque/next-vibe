import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main checkout titles and descriptions
  title: "Začať platbu za predplatné",
  titleShort: "Platba",
  description: "Vytvoriť platobnú reláciu Stripe pre predplatné",
  category: "Predplatné",

  // Tags
  tags: {
    subscription: "predplatné",
    checkout: "platba",
    stripe: "stripe",
  },

  // Form configuration
  form: {
    title: "Nastavenia platby",
    description: "Nastaviť parametre platobnej relácie",
    fields: {
      planId: {
        label: "Plán predplatného",
        description: "Vyber plán predplatného",
        placeholder: "Vyber plán",
      },
      billingInterval: {
        label: "Interval fakturácie",
        description: "Vyber, ako často chceš platiť",
        placeholder: "Vyber interval fakturácie",
      },
      provider: {
        label: "Poskytovateľ platby",
        description: "Vyber si spôsob platby",
        placeholder: "Vyber poskytovateľa platby",
      },
      payCurrency: {
        label: "Kryptomena",
        description:
          "Mena na platbu. Nechaj prázdne a vyber ju na platobnej stránke.",
        placeholder: "Vyber menu",
      },
      metadata: {
        label: "Metadáta",
        description: "Doplňujúce metadáta platobnej relácie",
        placeholder: "Zadajte metadáta vo formáte JSON",
      },
    },
  },

  // Response fields
  response: {
    success: "Platobná relácia bola vytvorená",
    sessionId: "ID relácie Stripe",
    checkoutUrl: "Adresa URL platby",
    message: "Stavová správa",
  },

  // Error types
  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Neplatné parametre požiadavky",
    },
    network: {
      title: "Chyba siete",
      description: "Chyba sieťového pripojenia",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zakázaný",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Požadovaný zdroj sa nenašiel",
    },
    serverError: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Nastala neznáma chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: {
      title: "Konflikt",
      description: "Nastal konflikt údajov",
    },
  },

  // Success types
  success: {
    title: "Úspech",
    description: "Platobná relácia bola vytvorená",
  },

  // POST endpoint specific translations
  post: {
    title: "Vytvoriť platobnú reláciu",
    description: "Vytvoriť novú platobnú reláciu pre predplatné",
    form: {
      title: "Nastavenia platobnej relácie",
      description: "Nastaviť parametre platobnej relácie",
    },
    response: {
      title: "Výsledok vytvorenia platobnej relácie",
      description: "Údaje výsledku vytvorenia platobnej relácie",
    },
    errors: {
      alreadySubscribed: {
        detail: "Už máš aktívne predplatné (používateľ {{userId}}).",
        title: "Už máš predplatné",
        description: "Už máš aktívne predplatné.",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre platby",
        reason: {
          yearlyNotAvailable:
            "Ročná fakturácia je dostupná iba pre plán {{plan}}. Vyber mesačnú fakturáciu.",
        },
      },
      network: {
        title: "Chyba siete",
        description: "Chyba sieťového pripojenia",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Požadované overenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zakázaný",
      },
      notFound: {
        detail: "Účet používateľa {{userId}} sa nenašiel.",
        title: "Nenašlo sa",
        description: "Platobná relácia sa nenašla",
      },
      server: {
        detail: "Platbu sa nepodarilo spustiť: {{error}}",
        title: "Chyba servera",
        description: "Nastala chyba interného servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
    },
    success: {
      title: "Úspech",
      description: "Platobná relácia bola vytvorená",
    },
  },

  // General error message
  error: "Pri platbe nastala chyba",
  errorDetail: "Platba zlyhala: {{error}}",

  // Subscription plan labels
  plans: {
    starter: {
      title: "Starter",
    },
    plus: {
      title: "Plus",
    },
    pro: {
      title: "Pro",
    },
    ultra: {
      title: "Ultra",
    },
  },

  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
  },

  // Billing interval labels
  billing: {
    monthly: "Mesačne",
    yearly: "Ročne",
  },
  availability: {
    cardPaused:
      "Platby kartou sú zatiaľ pozastavené. Kryptomenou zaplatíš hneď.",
    cardPausedError:
      "Platby kartou sú zatiaľ pozastavené. Vyber si kryptomenu a dokonči nákup.",
    nowpaymentsCardLabel: "Karta alebo kryptomeny (NOWPayments)",
    nowpaymentsCardDescription:
      "Visa, Mastercard, Apple Pay, Google Pay alebo bitcoin, ether a ďalšie",
    cryptoPickCoin: "Vyber menu",
    cryptoCoinUnavailable: "Táto mena teraz nie je dostupná. Vyber inú.",
    cryptoCoinBelowMinimum: "Táto suma je pod minimom tejto meny. Vyber inú.",
    cryptoAmountBelowMinimum:
      "Táto suma je pod minimom pre kryptomeny. Pridaj balík alebo vyber väčší plán.",
  },
  cryptoCoin: {
    btc: "Bitcoin (BTC)",
    eth: "Ethereum (ETH)",
    usdtTrc20: "USDT (TRON)",
    usdtErc20: "USDT (Ethereum)",
    usdtBsc: "USDT (BNB Chain)",
    usdc: "USDC (Ethereum)",
    sol: "Solana (SOL)",
    ltc: "Litecoin (LTC)",
    xmr: "Monero (XMR)",
    doge: "Dogecoin (DOGE)",
    trx: "TRON (TRX)",
    bnbBsc: "BNB (BNB Chain)",
  },
};
