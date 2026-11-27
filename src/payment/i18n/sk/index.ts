import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import sub-domain translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Začať platbu za predplatné",
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
        metadata: {
          label: "Metadáta",
          description: "Doplňujúce metadáta platobnej relácie",
          placeholder: "Zadaj metadáta ako JSON",
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
        description: "Nemáš oprávnenie na prístup",
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
        description: "Vyskytla sa neznáma chyba",
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
          title: "Už máš predplatné",
          description: "Už máš aktívne predplatné.",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre platby",
          reason: {
            enterpriseCustomPricing:
              "Plán ENTERPRISE vyžaduje individuálnu cenu",
          },
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
          description: "Nemáš oprávnenie na prístup",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Platobná relácia sa nenašla",
        },
        server: {
          title: "Chyba servera",
          description: "Vyskytla sa interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neznáma chyba",
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

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Mesačne",
      yearly: "Ročne",
    },
  },
  invoice: {
    category: "Fakturácia",
    tags: {
      payment: "platba",
      invoice: "faktúra",
      transactions: "transakcie",
    },
    defaultItem: "Fakturačná položka",
    success: {
      created: "Faktúra úspešne vytvorená",
    },
    post: {
      title: "Faktúra",
      description: "Koncový bod faktúry",
      form: {
        title: "Nastavenie faktúry",
        description: "Nastaviť parametre faktúry",
      },
      response: {
        success: "Faktúra úspešne vytvorená",
        message: "Stavová správa",
        invoice: {
          title: "Fakturačné údaje",
          description: "Údaje o vytvorenej faktúre",
          id: "ID faktúry",
          userId: "ID používateľa",
          stripeInvoiceId: "Stripe ID faktúry",
          invoiceNumber: "Číslo faktúry",
          amount: "Suma",
          currency: "Mena",
          status: "Stav",
          invoiceUrl: "URL faktúry",
          invoicePdf: "Faktúra PDF",
          dueDate: "Dátum splatnosti",
          paidAt: "Dátum úhrady",
          createdAt: "Čas vytvorenia",
          updatedAt: "Čas aktualizácie",
        },
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Požadované overenie",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre požiadavky",
        },
        server: {
          title: "Chyba servera",
          description: "Nastala chyba interného servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Nastala chyba siete",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zakázaný",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Požadovaný zdroj sa nenašiel",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt údajov",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Existujú neuložené zmeny",
        },
      },
      success: {
        title: "Úspech",
        description: "Operácia úspešne dokončená",
      },
      widget: {
        back: "Späť",
      },
    },
    customerId: {
      label: "ID zákazníka",
      description: "Stripe identifikátor zákazníka",
      placeholder: "Zadajte ID zákazníka",
    },
    amount: {
      label: "Suma",
      description: "Fakturačná suma",
      placeholder: "Zadajte sumu",
    },
    currency: {
      label: "Mena",
      description: "Kód meny",
      placeholder: "Vybrať menu",
      usd: "Americký dolár (USD)",
      eur: "Euro (EUR)",
      pln: "Poľský zlotý (PLN)",
    },
    description: {
      label: "Opis",
      description: "Opis faktúry",
      placeholder: "Zadajte popis",
    },
    dueDate: {
      label: "Dátum splatnosti",
      description: "Dátum splatnosti",
      placeholder: "Vyberte dátum splatnosti",
    },
    metadata: {
      label: "Metadáta",
      description: "Doplňujúce metadáta",
      placeholder: "Zadajte metadáta vo formáte JSON",
    },
  },
  portal: {
    success: {
      created: "Relácia zákazníckeho portálu bola vytvorená",
    },
    post: {
      title: "Zákaznícky portál",
      description: "Vytvoriť reláciu zákazníckeho portálu na správu fakturácie",
      form: {
        title: "Nastavenia portálu",
        description: "Nastaviť parametre zákazníckeho portálu",
      },
      returnUrl: {
        label: "Adresa URL návratu",
        description:
          "Adresa URL na presmerovanie po skončení relácie v portáli",
        placeholder: "https://example.com/dashboard",
      },
      response: {
        success: "Relácia portálu bola vytvorená",
        message: "Stavová správa",
        customerPortalUrl: "Adresa URL zákazníckeho portálu",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Požadované overenie",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre požiadavky",
        },
        server: {
          title: "Chyba servera",
          description: "Nastala chyba interného servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Nastala chyba siete",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zakázaný",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Požadovaný zdroj sa nenašiel",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt údajov",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Existujú neuložené zmeny",
        },
      },
      success: {
        title: "Úspech",
        description: "Operácia úspešne dokončená",
      },
    },
  },
  refund: {
    title: "Vrátiť platbu",
    description: "Spracovať vrátenie platby za transakciu",
    category: "Vrátenie platieb",

    tags: {
      refund: "vrátenie platby",
      transaction: "transakcia",
    },

    success: {
      created: "Platba bola úspešne vrátená.",
    },

    reason: {
      requestedByCustomer: "Na žiadosť zákazníka",
    },

    form: {
      title: "Formulár na vrátenie platby",
      description: "Zadajte údaje o vrátení platby.",
      fields: {
        transactionId: {
          label: "ID transakcie",
          description: "ID transakcie, za ktorú sa má vrátiť platba",
          placeholder: "Zadajte ID transakcie",
        },
        amount: {
          label: "Suma na vrátenie",
          description:
            "Suma na vrátenie (nepovinné, predvolene sa vráti celá suma)",
          placeholder: "Zadajte sumu",
        },
        reason: {
          label: "Dôvod vrátenia platby",
          description: "Dôvod náhrady",
          placeholder: "Zadajte dôvod",
        },
        metadata: {
          label: "Metadáta",
          description: "Doplňujúce metadáta o vrátení platby",
          placeholder: "Zadajte metadáta vo formáte JSON",
        },
      },
    },

    post: {
      title: "Vrátiť platbu",
      description: "Spracovať vrátenie platby",
      response: {
        success: "Platba bola úspešne vrátená.",
        message: "Stavová správa",
        refund: {
          title: "Podrobnosti o vrátení platby",
          description: "Údaje o spracovanom vrátení platby",
          id: "ID vrátenia platby",
          userId: "ID používateľa",
          transactionId: "ID transakcie",
          stripeRefundId: "ID vrátenia platby v Stripe",
          amount: "Suma na vrátenie",
          currency: "Mena",
          status: "Stav vrátenia platby",
          reason: "Dôvod vrátenia platby",
          createdAt: "Čas vytvorenia",
          updatedAt: "Čas aktualizácie",
        },
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre vrátenia platby",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Požadované overenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Transakcia nebola nájdená",
        },
        server: {
          title: "Chyba servera",
          description: "Nastala chyba interného servera",
        },
        network: {
          title: "Chyba siete",
          description: "Chyba sieťového pripojenia",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt pri vrátení platby",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Existujú neuložené zmeny",
        },
      },
      success: {
        title: "Úspech",
        description: "Platba bola úspešne vrátená.",
      },
    },
  },
  providers: {
    stripe: {
      title: "Integrácia Stripe CLI",
      description: "Správa príkazov Stripe CLI a prijímania webhookov",
      category: "Integrácia platieb",
      tags: {
        stripe: "Stripe",
        cli: "Príkazový riadok",
        webhook: "Webhook",
      },

      operations: {
        check: "Skontrolovať inštaláciu",
        install: "Inštalácia Stripe CLI",
        listen: "Spustiť príjem webhookov",
        login: "Prihlásenie do Stripe",
        status: "Skontrolovať stav",
      },

      form: {
        title: "Konfigurácia Stripe CLI",
        description: "Nastavenie príkazov Stripe CLI a webhookov",
        fields: {
          operation: {
            label: "Typ operácie",
            description: "Vyberte operáciu Stripe CLI na vykonanie",
            placeholder: "Vyberte operáciu...",
          },
          port: {
            label: "Číslo portu",
            description:
              "Číslo portu na preposielanie webhookov (1000 až 65535)",
            placeholder: "4242",
          },
          events: {
            label: "Udalosti webhooku",
            description: "Vyberte udalosti Stripe, ktoré chcete sledovať.",
            placeholder: "Vyberte udalosti, ktoré sa majú sledovať...",
            paymentIntentSucceeded: "Platobný zámer sa úspešne dokončil",
            paymentIntentFailed: "Platobný zámer zlyhal",
            subscriptionCreated: "Predplatné vytvorené",
            subscriptionUpdated: "Predplatné upravené",
            invoicePaymentSucceeded: "Faktúra bola uhradená",
            invoicePaymentFailed: "Platba faktúry zlyhala",
          },
          forwardTo: {
            label: "Presmerovať na URL",
            description:
              "Lokálny koncový bod na preposielanie udalostí webhooku",
            placeholder: "localhost:3000/api/webhooks/stripe",
          },
          skipSslVerify: {
            label: "Preskočiť overenie SSL",
            description: "Preskočiť overenie SSL certifikátu pre vývoj",
          },
        },
      },

      response: {
        success: "Operácia úspešne dokončená",
        installed: "Stav inštalácie Stripe CLI",
        version: "Nainštalovaná verzia Stripe CLI",
        status: "Stav aktuálnej operácie",
        output: "Výstup príkazu a protokoly",
        instructions: "Ďalšie kroky a pokyny",
        webhookEndpoint: "Adresa URL koncového bodu webhooku",
      },

      login: {
        instructions:
          "Na prihlásenie do Stripe spustite v termináli príkaz 'stripe login' a podľa pokynov pripojte účet Stripe.",
      },

      status: {
        authenticated: "Overené a pripravené",
        not_authenticated: "Chýba prihlásenie. Spustite „stripe login“.",
        not_installed: "Stripe CLI nie je nainštalovaný",
      },

      errors: {
        validation: {
          title: "Neplatné nastavenie",
          description:
            "Prosím skontrolujte si konfiguráciu Stripe CLI a skúste to znova",
        },
        network: {
          title: "Chyba siete",
          description: "Nedá sa pripojiť k službám Stripe",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Nemáte povolenie na vykonanie tejto operácie.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Táto operácia nie je povolená pre váš účet",
        },
        notFound: {
          title: "Zdroj sa nenašiel",
          description: "Požadovaný zdroj Stripe nebol nájdený",
        },
        serverError: {
          title: "Chyba servera",
          description: "Nastala chyba pri spracovaní operácie Stripe",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba pri Stripe CLI",
        },
        customerRetrievalFailed: {
          title: "Nepodarilo sa načítať zákazníka",
          description: "Nepodarilo sa načítať údaje o zákazníkovi zo Stripe.",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny konfigurácie",
        },
        conflict: {
          title: "Konflikt operácií",
          description: "V súčasnosti prebieha ďalšia operácia Stripe",
        },
        execution_failed: "Operáciu Stripe CLI sa nepodarilo správne vykonať.",
        userNotFound: {
          title: "Používateľ sa nenašiel",
          description: "Zadaný užívateľ nebol nájdený",
        },
        customerCreationFailed: {
          title: "Vytvorenie zákazníka zlyhalo",
          description: "Zákazníka v Stripe sa nepodarilo vytvoriť",
        },
        checkoutCreationFailed: {
          title: "Nepodarilo sa vytvoriť platobnú reláciu",
          description: "Nepodarilo sa vytvoriť platobnú reláciu Stripe.",
        },
        webhookVerificationFailed: {
          title: "Nepodarilo sa overiť webhook",
          description: "Nepodarilo sa overiť podpis webhooku",
        },
        subscriptionRetrievalFailed: {
          title: "Nepodarilo sa načítať predplatné",
          description: "Nepodarilo sa získať predplatné z Stripe",
        },
        subscriptionCancellationFailed: {
          title: "Nepodarilo sa zrušiť predplatné",
          description: "Nepodarilo sa zrušiť predplatné v Stripe",
        },
        priceCreationFailed: {
          title: "Nepodarilo sa vytvoriť cenu",
          description: "Nepodarilo sa vytvoriť cenu v Stripe",
        },
        notConfigured: {
          title: "Stripe nie je nastavený",
          description:
            "Stripe nie je nastavený. V súbore .env nastavte STRIPE_SECRET_KEY.",
        },
        stripeCliNotInstalled: "Stripe CLI nie je nainštalovaný",
        listenerFailed: "Nepodarilo sa spustiť príjem webhookov Stripe.",
      },

      success: {
        title: "Úspešná operácia",
        description: "Operácia Stripe CLI úspešne dokončená",
      },

      installInstructions: {
        documentation:
          "Prosím, nainštalujte Stripe CLI podľa oficiálnej dokumentácie na: https://docs.stripe.com/stripe-cli",
        quickInstallation: "Rýchle možnosti inštalácie:",
        macOS: {
          title: "macOS (pomocou Homebrew):",
          command: "brew install stripe/stripe-cli/stripe",
        },
        linux: {
          title: "Linux (pomocou správcu balíkov):",
          debian: {
            title: "Debian/Ubuntu",
          },
          fedora: {
            title: "CentOS/RHEL/Fedora",
          },
        },
        windows: {
          title: "Windows:",
          scoop: {
            title: "Pomocou Scoop",
          },
          github: {
            title: "Alebo stiahnite balík priamo zo stránky vydaní na GitHube:",
            url: "https://github.com/stripe/stripe-cli/releases",
          },
        },
        authentication: {
          title: "Po inštalácii sa prihláste príkazom:",
          command: "stripe login",
        },
      },
    },
    nowpayments: {
      name: "NOWPayments",
      description:
        "Poskytovateľ platieb v kryptomenách s podporou predplatného",

      cli: {
        post: {
          title: "NOWPayments CLI",
          description: "Správa tunela ngrok pre webhooky NOWPayments",
          category: "Platba",
          tags: {
            nowpayments: "NOWPayments",
            cli: "CLI",
            webhook: "Webhook",
          },
          operations: {
            check: "Kontrola",
            install: "Inštalovať",
            tunnel: "Tunel",
            status: "Stav",
          },
          form: {
            title: "Operácie NOWPayments CLI",
            description:
              "Nastavenie a správa tunela ngrok pre webhooky NOWPayments",
            fields: {
              operation: {
                label: "Operácia",
                description: "Vyberte operáciu, ktorá sa má vykonať",
                placeholder: "Vyberte si operáciu",
              },
              port: {
                label: "Port",
                description: "Lokálny port pre tunel (predvolene 3000)",
                placeholder: "3000",
              },
            },
          },
          errors: {
            validationFailed: {
              title: "Neplatné údaje",
              description: "Neplatná operácia alebo parametre",
            },
            networkError: {
              title: "Chyba siete",
              description: "Sieťové pripojenie zlyhalo",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Požadované overenie",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Prístup zamietnutý",
            },
            notFound: {
              title: "Nenašlo sa",
              description: "Požadovaný zdroj sa nenašiel",
            },
            serverError: {
              title: "Chyba servera",
              description: "Nepodarilo sa spustiť operáciu",
            },
            unknownError: {
              title: "Neznáma chyba",
              description: "Nastala neznáma chyba",
            },
            unsavedChanges: {
              title: "Neuložené zmeny",
              description: "Existujú neuložené zmeny",
            },
            conflict: {
              title: "Konflikt",
              description: "Konflikt zdrojov",
            },
          },
          response: {
            title: "Odpoveď",
            description: "Výsledok operácie",
            fields: {
              success: "Úspech",
              installed: "Inštalované",
              version: "Verzia",
              status: "Stav",
              output: "Výstup",
              instructions: "Pokyny",
              tunnelUrl: "URL tunela",
              webhookUrl: "Webhook URL",
            },
          },
          success: {
            title: "Úspech",
            description: "Operácia úspešne dokončená",
          },
        },
      },

      errors: {
        userNotFound: {
          title: "Používateľ sa nenašiel",
          description: "Zadaný používateľ sa nenašiel",
        },
        customerCreationFailed: {
          title: "Vytvorenie zákazníka zlyhalo",
          description:
            "Nepodarilo sa pripraviť zákazníka v NOWPayments: {error}",
        },
        productNotFound: {
          title: "Produkt nenájdený",
          description: "Špecifikovaný produkt sa nepodarilo nájsť: {productId}",
        },
        userEmailRequired: {
          title: "Vyžaduje sa e-mail používateľa",
          description: "Na predplatné je potrebný e-mail používateľa: {userId}",
        },
        checkoutCreationFailed: {
          title: "Nepodarilo sa vytvoriť platobnú reláciu",
          description:
            "Platobnú reláciu NOWPayments sa nepodarilo vytvoriť: {error}",
        },
        invoiceCreationFailed: {
          title: "Vytvorenie faktúry zlyhalo",
          description: "Nepodarilo sa vytvoriť faktúru v NOWPayments: {error}",
        },
        invalidApiKey: {
          title: "Neplatný kľúč API",
          description:
            "Neplatný kľúč API NOWPayments. Skontrolujte konfiguráciu a overte kľúč na https://nowpayments.io/app/dashboard",
        },
        planCreationFailed: {
          title: "Vytvorenie plánu zlyhalo",
          description:
            "Nepodarilo sa vytvoriť plán predplatného v NOWPayments: {error}",
        },
        subscriptionCreationFailed: {
          title: "Vytvorenie predplatného zlyhalo",
          description:
            "Nepodarilo sa vytvoriť predplatné v NOWPayments: {error}",
        },
        subscriptionRetrievalFailed: {
          title: "Nepodarilo sa načítať predplatné",
          description:
            "Nepodarilo sa načítať predplatné z NOWPayments: {error}",
        },
        subscriptionCancellationFailed: {
          title: "Nepodarilo sa zrušiť predplatné",
          description: "Nepodarilo sa zrušiť predplatné v NOWPayments: {error}",
        },
        subscriptionListFailed: {
          title: "Nepodarilo sa načítať zoznam predplatných",
          description:
            "Nepodarilo sa načítať zoznam predplatných z NOWPayments: {error}",
        },
        notConfigured: {
          title: "NOWPayments nie je nastavená",
          description:
            "NOWPayments nie je nastavená. V súbore .env nastavte NOWPAYMENTS_API_KEY a NOWPAYMENTS_IPN_SECRET.",
        },
        webhookVerificationFailed: {
          title: "Nepodarilo sa overiť webhook",
          description:
            "Nepodarilo sa overiť podpis webhooku NOWPayments: {error}",
        },
        paymentStatusFailed: {
          title: "Nepodarilo sa načítať stav platby",
          description:
            "Nepodarilo sa načítať stav platby z NOWPayments: {error}",
        },
      },

      success: {
        invoiceCreated: {
          title: "Faktúra vytvorená",
          description: "Faktúra v NOWPayments bola vytvorená.",
        },
        webhookVerified: {
          title: "Webhook overený",
          description: "Webhook NOWPayments bol úspešne overený.",
        },
        paymentStatusRetrieved: {
          title: "Stav platby načítaný",
          description: "Stav platby z NOWPayments bol načítaný.",
        },
      },
    },
  },

  // Main payment domain
  category: "Fakturácia",

  // Main form configuration
  form: {
    title: "Nastavenie platieb",
    description: "Nastaviť platobné parametre",
  },

  // Tags
  tags: {
    payment: "platba",
    stripe: "stripe",
    checkout: "platba",
    list: "zoznam",
    transactions: "transakcie",
    info: "Informácie",
  },

  // Create payment endpoint
  create: {
    title: "Vytvoriť platobnú reláciu",
    titleShort: "Vytvoriť reláciu",
    description: "Vytvoriť novú platobnú reláciu s Stripe",
    form: {
      title: "Nastavenie platieb",
      description: "Nastaviť parametre platobnej relácie",
    },
    paymentMethodTypes: {
      label: "Spôsoby platby",
      description: "Vyberte akceptované spôsoby platby",
    },
    successUrl: {
      label: "Adresa URL po úspešnej platbe",
      description: "URL pre presmerovanie po úspešnej platbe",
      placeholder: "https://example.com/success",
    },
    cancelUrl: {
      label: "Adresa URL po zrušení platby",
      description: "URL pre presmerovanie platby v prípade zrušenia platby",
      placeholder: "https://example.com/cancel",
    },
    customerEmail: {
      label: "Zákaznícky e-mail",
      description: "E-mailová adresa zákazníka pre platbu",
      placeholder: "customer@example.com",
    },
    response: {
      success: "Platobná relácia bola vytvorená.",
      sessionId: "ID relácie Stripe",
      sessionUrl: "Adresa URL relácie Stripe",
      checkoutUrl: "Adresa URL platby",
      message: "Stavová správa",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné platobné parametre",
      },
      internal: {
        title: "Interná chyba",
        description: "Nastala vnútorná chyba",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        detail: "Účet používateľa {{userId}} sa nenašiel.",
        title: "Nenašlo sa",
        description: "Platobná relácia sa nenašla.",
      },
      server: {
        detail: "Nepodarilo sa vytvoriť reláciu platieb: {{error}}",
        stripeNotConfigured:
          "Stripe ešte nie je nastavená. Pridať STRIPE_SECRET_KEY do svojho prostredia.",
        title: "Chyba servera",
        description: "Nastala chyba interného servera",
      },
      network: {
        title: "Chyba siete",
        description: "Chyba sieťového pripojenia",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt pri spracovaní platby",
      },
    },
    success: {
      title: "Úspech",
      description: "Platobná relácia bola vytvorená.",
      message: "Platobná relácia bola vytvorená.",
    },
  },

  // Get payment endpoint
  get: {
    title: "Vaše platby",
    titleShort: "Platby",
    description: "Najviac desať posledných platobných záznamov na vašom účte.",
    summary: {
      empty: "Zatiaľ žiadne platby",
      emptyDescription: "Tu sa zobrazia vaše platby.",
      loading: "Načítavajú sa vaše platby…",
      error: "Vaše platby sa nepodarilo načítať",
      retry: "Skúste znova",
      amountUnavailable: "Suma nie je k dispozícii",
    },
    form: {
      title: "Vyhľadávanie platieb",
      description: "Vyhľadať údaje o platbách",
    },
    response: {
      success: "Platobné údaje úspešne získané",
      sessionUrl: "URL platobnej relácie",
      sessionId: "ID platobnej relácie",
      message: "Stavová správa",
      transactions: "Platobné transakcie",
      paymentMethods: "Spôsoby platby",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre dotazu",
      },
      internal: {
        title: "Interná chyba",
        description: "Vyskytla sa interná chyba",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Informácie o platbe neboli nájdené",
      },
      server: {
        detail: "Nepodarilo sa načítať informácie o platbe: {{error}}",
        title: "Chyba servera",
        description: "Nastala chyba interného servera",
      },
      network: {
        title: "Chyba siete",
        description: "Chyba sieťového pripojenia",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Existujú neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt pri spracovaní platby",
      },
    },
    success: {
      title: "Úspech",
      description: "Platobné informácie úspešne získané",
    },
  },

  // Top-level error handling
  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Neplatné platobné parametre",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Nenájdená platba",
    },
    unauthorized: {
      signInRequired: "Prihlásiť sa pre správu platieb",
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zamietnutý",
    },
    server: {
      detail: "Webhook platby sa nepodarilo spracovať: {{error}}",
      title: "Chyba servera",
      description: "Nastala chyba interného servera",
    },
    network: {
      title: "Chyba siete",
      description: "Chyba sieťového pripojenia",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Nastala neočakávaná chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: {
      title: "Konflikt",
      description: "Konflikt pri spracovaní platby",
    },
    notImplemented: {
      title: "Nedostupné",
      description:
        "Táto funkcia poskytovateľa platobných služieb ešte nie je implementovaná",
    },
    customerCreationFailed: "Zákazníka v Stripe sa nepodarilo vytvoriť",
    customerNotFound: "Stripe zákazník nenájdený",
    localMode: "V lokálnom vývojovom režime sú platby vypnuté.",
    webhookVerificationFailed:
      "Nepodarilo sa overiť podpis webhooku: {{error}}",
  },

  // Top-level success
  success: {
    title: "Úspech",
    description: "Operácia úspešne dokončená",
    sessionCreated: "Platobná relácia bola vytvorená.",
    infoRetrieved: "Platobné informácie úspešne získané",
  },

  // Field labels and descriptions
  amount: {
    label: "Suma",
    description: "Platobná suma v určenej mene",
    placeholder: "Zadajte sumu",
  },
  currency: {
    label: "Mena",
    description: "Platobná mena",
    placeholder: "Vybrať menu",
    usd: "Americký dolár (USD)",
    eur: "Euro (EUR)",
    pln: "Poľský zlotý (PLN)",
  },
  mode: {
    label: "Platobný režim",
    description: "Typ platobnej relácie",
    placeholder: "Vyberte platobný režim",
  },
  successUrl: {
    label: "Adresa URL po úspešnej platbe",
    description: "URL pre presmerovanie po úspešnej platbe",
    placeholder: "https://example.com/success",
  },
  cancelUrl: {
    label: "Adresa URL po zrušení platby",
    description: "URL pre presmerovanie platby v prípade zrušenia platby",
    placeholder: "https://example.com/cancel",
  },
  metadata: {
    label: "Metadáta",
    description: "Dodatočné metaúdaje pre reláciu platieb",
    placeholder: "Zadajte metadáta vo formáte JSON",
  },
  paymentId: {
    label: "ID platby",
    description: "ID platby, ktorú chcete načítať",
    placeholder: "Zadajte ID platby",
  },
  sessionId: {
    label: "ID relácie",
    description: "ID relácie Stripe, ktorú chcete načítať",
    placeholder: "Zadajte ID relácie",
  },
  limit: {
    label: "Limit",
    description: "Najvyšší počet výsledkov",
    placeholder: "20",
  },
  offset: {
    label: "Posun",
    description: "Počet výsledkov preskočiť",
    placeholder: "0",
  },
  priceId: {
    label: "ID ceny",
    description: "ID ceny produktu v Stripe",
    placeholder: "price_1234567890",
  },
  provider: {
    label: "Poskytovateľ platby",
    description: "Vyberte si spôsob platby",
    placeholder: "Vyber poskytovateľa platby",
  },

  // Enum translations
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      whop: "Whop",
    },
    paymentStatus: {
      pending: "Čaká na spracovanie",
      processing: "Spracúva sa",
      succeeded: "Úspešná",
      failed: "Neúspešná",
      canceled: "Zrušená",
      refunded: "Vrátená",
    },
    paymentMethodType: {
      card: "Kreditná/debetná karta",
      bankTransfer: "Bankový prevod",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "Priame inkaso SEPA",
    },
    paymentIntentStatus: {
      requiresPaymentMethod: "Vyžaduje spôsob platby",
      requiresConfirmation: "Vyžaduje potvrdenie",
      requiresAction: "Vyžaduje ďalší krok",
      processing: "Spracúva sa",
      requiresCapture: "Čaká na zúčtovanie platby",
      canceled: "Zrušená",
      succeeded: "Úspešná",
    },
    checkoutMode: {
      payment: "Platba",
      subscription: "Predplatné",
      setup: "Nastavenie",
    },
    refundStatus: {
      pending: "Čaká na spracovanie",
      succeeded: "Úspešná",
      failed: "Neúspešná",
      canceled: "Zrušená",
    },
    disputeStatus: {
      warningNeedsResponse: "Upozornenie: vyžaduje odpoveď",
      warningUnderReview: "Upozornenie: prebieha posudzovanie",
      warningClosed: "Upozornenie: uzavreté",
      needsResponse: "Vyžaduje odpoveď",
      underReview: "Prebieha posudzovanie",
      chargeRefunded: "Platba vrátená",
      won: "Vyhratý spor",
      lost: "Prehratý spor",
    },
    invoiceStatus: {
      draft: "Koncept",
      open: "Otvorená",
      paid: "Uhradená",
      void: "Storno",
      uncollectible: "Nevymáhateľná",
    },
    taxStatus: {
      complete: "Dokončené",
      failed: "Neúspešná",
      requiresLocation: "Vyžaduje miesto predaja",
    },
    paymentInterval: {
      month: "Mesačne",
      year: "Ročne",
      one_time: "Jednorazové",
    },
    manualPaymentMethod: {
      cash: "Pokladničná hotovosť",
      bankTransfer: "Bankový prevod",
      other: "Iné",
    },
    billStatus: {
      DRAFT: "Koncept",
      RECEIVED: "Prijatá",
      APPROVED: "Schválená",
      PAID: "Uhradená",
      DISPUTED: "Sporná",
    },
    estimateStatus: {
      DRAFT: "Koncept",
      SENT: "Odoslaná",
      ACCEPTED: "Prijatá",
      DECLINED: "Zamietnutá",
      EXPIRED: "Platnosť uplynula",
      CONVERTED: "Prevedená na faktúru",
    },
  },
};
