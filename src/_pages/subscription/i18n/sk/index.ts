import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "Kredity a predplatné",
    description: "Spravujte svoje kredity a mesačné predplatné",
    backToChat: "Späť na čet",
    billingInterval: "Fakturačné obdobie",
    currentPeriodStart: "Začiatok aktuálneho obdobia",
    nextBillingDate: "Dátum ďalšej platby",
    endsOn: "Koniec predplatného",
    canceledOn: "Dátum zrušenia",
    endedOn: "Dátum ukončenia",
    cancellation: {
      title: "Predplatné sa po skončení obdobia neobnoví",
      description:
        "Predplatné sa skončí {{date}}. Dovtedy máte naďalej prístup ku všetkým jeho výhodám.",
    },
    canceled: {
      title: "Predplatné bolo zrušené",
      description:
        "Vaše predplatné je zrušené. Ak chcete znova dostávať mesačné kredity, môžete si ho kedykoľvek obnoviť.",
    },
    manage: {
      stripe: {
        button: "Spravovať predplatné",
      },
      nowpayments: {
        button: "Zobraziť podrobnosti predplatného",
        info: "Predplatné sa spravuje cez e-mail. Odkazy na platbu a podrobnosti nájdete v správach od NOWPayments.",
      },
      portal: {
        error: "Fakturačný portál sa nepodarilo otvoriť. Skúste to znova.",
      },
    },
    balance: {
      title: "Zostatok kreditov",
      description: "Dostupné kredity na čet s {{modelCount}} modelmi AI",
      credit: "{{count}} kredit",
      credits: "Počet kreditov: {{count}}",
      nextExpiration: "Najbližší koniec platnosti",
      expiring: {
        title: "Kredity z predplatného",
        description: "Z vášho mesačného programu",
      },
      permanent: {
        title: "Trvalé kredity",
        description: "Kredity z dokúpených balíkov neprepadnú",
      },
      free: {
        title: "Bezplatné mesačné kredity",
        description:
          "Mesačné kredity zadarmo: {{guest}} bez účtu, {{signedIn}} s bezplatným účtom a {{max}} s účtom a odberom noviniek.",
      },
      earned: {
        title: "Získané kredity",
        description: "Pozvite priateľov a získajte odmenu →",
      },
    },
    overview: {
      guestOffer: {
        description:
          "Po overení e-mailu získaš s bezplatným účtom až {{count}} kreditov mesačne. Platobnú kartu nepotrebuješ.",
        action: "Vytvoriť bezplatný účet",
      },
      howItWorks: {
        title: "Ako fungujú kredity",
        description:
          "Rovnaké kredity platia pre všetky modely. Vyberte si predplatné, doplňte kredity alebo začnite zadarmo.",
        expiring: {
          title: "Mesačné programy",
          description:
            "Od {{minPrice}} do {{maxPrice}} mesačne, až do {{maxCredits}} kreditov. Prístup ku všetkým {{modelCount}} modelom.",
        },
        permanent: {
          title: "Balíky kreditov",
          description:
            "K ľubovoľnému predplatnému si môžete dokúpiť {{packCredits}} kreditov za {{packPrice}}. Počet balíkov nie je obmedzený a kredity z nich neprepadnú.",
        },
        free: {
          title: "Bezplatné kredity",
          description:
            "Kredity na mesiac: {{guest}} bez účtu, {{signedIn}} s bezplatným účtom a {{max}} s účtom a odberom noviniek. Platobnú kartu nepotrebujete.",
        },
      },
      costs: {
        title: "Koľko čo stojí",
        description:
          "Ceny v kreditoch za správu, obrázok, klip alebo volanie nástroja. Ceny správ sú orientačné. Pri modeloch cez OpenRouter účtujeme skutočnú cenu poskytovateľa s našou prirážkou.",
        models: {
          title: "Modely AI (za správu)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "Počet kreditov: {{count}}",
          showLegacy: "Zobraziť archivované modely",
          hideLegacy: "Skryť archivované modely",
          free: "Zadarmo",
          approxCost: "pribl. kred.",
          legacyBadge: "V archíve",
          types: {
            text: "Čet",
            tts: "Prevod textu na reč",
            stt: "Prepis reči na text",
            image: "Generovanie obrázkov",
            audio: "Generovanie hudby",
            video: "Generovanie videa",
          },
        },
        features: {
          title: "Funkcie",
          braveSearchLabel: "Brave Search (za vyhľadanie)",
          kagiSearchLabel: "Kagi Search (za vyhľadanie)",
          fetchUrlLabel: "Načítanie stránky ako textu (za požiadavku)",
          costFormat: "{{value}} {{unit}}",
          creditsUnit: "kredity",
        },
      },
      cta: {
        title: "Získajte prístup ku všetkým modelom.",
        description:
          "Mesačné kredity platia pre všetkých {{modelCount}} modelov. Ďalšie si môžete kedykoľvek dokúpiť v balíkoch.",
        button: "Predplatiť",
      },
    },
    buy: {
      signInRequired: {
        title: "Vyžaduje sa prihlásenie",
        description:
          "Pred nákupom kreditov alebo predplatného sa prihláste alebo si vytvorte účet.",
      },
      provider: {
        stripe: {
          description: "Platobné karty",
        },
        nowpayments: {
          description: "Kryptomena",
        },
        cryptoMinimumPacks:
          "Pri platbe kryptomenou treba vzhľadom na minimálnu hodnotu transakcie kúpiť aspoň {{minPacks}} balíkov kreditov ({{minValue}}).",
      },
      subscription: {
        badge: "Najvýhodnejšie",
        title: "Mesačné predplatné",
        description:
          "Za {{subPrice}} mesačne získate {{subCredits}} kreditov a prístup ku všetkým {{modelCount}} modelom AI.",
        perMonth: " / mesiac",
        perYear: " / rok",
        yearlyEquivalent: "Pri ročnej platbe len {{monthlyPrice}} mesačne",
        features: {
          credits: "Kredity na mesiac: {{count}}",
          expiry: "Prístup ku všetkým {{modelCount}} modelom AI",
          bestFor: "Pre ľudí, ktorí používajú AI pravidelne",
        },
        button: "Predplatiť teraz",
        buttonAlreadySubscribed: "Už máte predplatné",
      },
      pack: {
        title: "Doplnkové balíky kreditov",
        description:
          "Doplňte si kredity k predplatnému. Kredity z balíka neprepadnú.",
        badge: "Doplnenie kreditov",
        perPack: " / balík",
        quantity: "Množstvo",
        total: "Počet kreditov: {{count}}",
        features: {
          credits: "Kredity v jednom balíku: {{count}}",
          permanent: "Bez obmedzenia platnosti",
          expiry: "Bez obmedzenia platnosti",
          bestFor: "Pre náročných používateľov s vyššou spotrebou",
        },
        button: {
          submit: "Kúpiť balík kreditov",
        },
        totalPrice: "Spolu: {{price}}",
        pack: "Balík",
        packs: "Balíky",
      },
    },
    history: {
      title: "História transakcií",
      description: "Vaše posledné pohyby kreditov",
      empty: {
        title: "Zatiaľ nemáte žiadne transakcie",
        description: "Tu sa zobrazí história pohybov na vašom kreditnom účte.",
      },
      balance: "Zostatok: {{count}}",
      loadMore: "Načítať ďalšie",
      types: {
        purchase: "Nákup",
        subscription: "Predplatné",
        usage: "Spotreba",
        expiry: "Koniec platnosti",
        free_tier: "Bezplatný program",
        monthly_reset: "Mesačné obnovenie",
        free_grant: "Pridelenie bezplatných kreditov",
        free_reset: "Obnovenie bezplatných kreditov",
        refund: "Vrátenie platby",
        transfer: "Prevod",
        other_devices: "Spotreba z ostatných zariadení",
        referral_earning: "Odmena za odporúčanie",
        referral_payout: "Výplata odmeny za odporúčanie",
      },
    },
    tabs: {
      overview: "Prehľad",
      buy: "Kúpiť kredity",
      adminBuy: "Spravovať kredity",
      billing: "Fakturácia",
      history: "História",
      plans: "Programy",
      remote: "Synchronizácia s cloudom",
    },
    admin: {
      title: "Kredity a limity",
      description:
        "Spravujte pridelené kredity a limity spotreby tejto inštancie.",
      allocate: {
        title: "Prideliť kredity",
        description:
          "Pridajte kredity na ľubovoľný používateľský účet. Ich počet určuje, koľko môže používateľ minúť na AI. Vo vlastnej inštancii tak nastavíte povolený rozpočet.",
        howItWorks: {
          title: "Ako fungujú limity kreditov",
          freePool: {
            title: "Spoločná zásoba bezplatných kreditov",
            description:
              "Používatelia čerpajú zo spoločnej zásoby bezplatných kreditov, ktorá sa každý mesiac obnovuje. Jej veľkosť nastavíte v prostredí inštancie.",
          },
          bonus: {
            title: "Bonusové kredity pre jednotlivých používateľov",
            description:
              "Bonusové kredity majú neobmedzenú platnosť a pripočítavajú sa ku kreditom zo spoločnej zásoby. Jednotlivým používateľom tak môžete zvýšiť dostupný limit.",
          },
          apiKeys: {
            title: "Zrušiť všetky limity",
            description:
              "Ak chcete používať modely bez kreditov, v nastaveniach zadajte vlastné kľúče API poskytovateľov LLM. Vlastný kľúč môže použiť aj každý používateľ osobitne.",
          },
        },
      },
    },
    payment: {
      success: {
        title: "Platba prebehla úspešne",
        subscription:
          "Predplatné je aktívne. Kredity budete mať čoskoro k dispozícii.",
        credits:
          "Platba za balík prebehla úspešne. Kredity budete mať čoskoro k dispozícii.",
      },
      canceled: {
        title: "Platba bola zrušená",
        subscription:
          "Platba za predplatné bola zrušená. Kedykoľvek to môžete skúsiť znova.",
        credits:
          "Platba za balík kreditov bola zrušená. Kedykoľvek to môžete skúsiť znova.",
      },
    },
  },
  meta: {
    category: "Cenník",
    imageAlt: "Cenník {{appName}}: kredity pre každý model AI",
    keywords:
      "cenník četu s AI, ceny necenzurovanej AI, platba za správu, kredity AI, {{appName}}",
    overview: {
      title: "Cenník: platba za správu bez viazanosti | {{appName}}",
      description:
        "Až {{freeCredits}} kreditov zadarmo každý mesiac. Predplatné od {{subPrice}} za {{subCredits}} kreditov mesačne, vo vyšších programoch až {{maxCredits}}. Jeden zostatok pre {{modelCount}} modelov od bežných po necenzurované.",
    },
    buyCredits: {
      title: "Predplatné a balíky kreditov | {{appName}}",
      description:
        "Predplatné od {{subPrice}} za {{subCredits}} kreditov mesačne, vo vyšších programoch až {{maxCredits}}. Balíky môžete dokúpiť ku každému programu. Kredity z nich neprepadnú. Platba kartou, cez PayPal alebo kryptomenou. K dispozícii je {{modelCount}} modelov AI.",
    },
    history: {
      title: "História kreditov | {{appName}}",
      description:
        "Všetky pohyby kreditov na jednom mieste: nákupy, mesačné prídely, odmeny za odporúčania aj cena jednotlivých četov.",
    },
  },
  payment: {
    success: {
      title: "Platba prebehla úspešne",
      subscription:
        "Mesačné predplatné je aktívne. Každý mesiac získate {{subCredits}} kreditov, ktoré môžete použiť pri všetkých {{modelCount}} modeloch.",
      credits: "Balík kreditov ste úspešne kúpili. Kredity z neho neprepadnú.",
    },
    canceled: {
      title: "Platba bola zrušená",
      subscription:
        "Platba za predplatné bola zrušená. Kedykoľvek to môžete skúsiť znova.",
      credits:
        "Platba za balík kreditov bola zrušená. Kedykoľvek to môžete skúsiť znova.",
    },
  },
};
