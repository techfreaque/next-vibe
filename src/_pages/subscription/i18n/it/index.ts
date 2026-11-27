import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "Crediti e abbonamento",
    description: "Gestisci i crediti e il tuo abbonamento mensile",
    backToChat: "Torna alla chat",
    billingInterval: "Frequenza di fatturazione",
    currentPeriodStart: "Inizio del periodo in corso",
    nextBillingDate: "Prossima data di fatturazione",
    endsOn: "L’abbonamento termina il",
    canceledOn: "Annullato il",
    endedOn: "Terminato il",
    cancellation: {
      title: "Disdetta programmata",
      description:
        "Il tuo abbonamento terminerà il {{date}}. Fino ad allora potrai continuare a usarlo.",
    },
    canceled: {
      title: "Abbonamento annullato",
      description:
        "Il tuo abbonamento è stato annullato. Puoi riattivarlo in qualsiasi momento per ricevere di nuovo i crediti mensili.",
    },
    manage: {
      stripe: {
        button: "Gestisci l’abbonamento",
      },
      nowpayments: {
        button: "Vedi i dettagli dell’abbonamento",
        info: "Gestisci il tuo abbonamento via email. Troverai nella posta i link di pagamento e i dettagli inviati da NOWPayments.",
      },
      portal: {
        error: "Impossibile aprire il portale di fatturazione. Riprova.",
      },
    },
    balance: {
      title: "Saldo dei crediti",
      description:
        "Crediti disponibili per chattare con {{modelCount}} modelli IA",
      credit: "{{count}} credito",
      credits: "{{count}} crediti",
      nextExpiration: "Prossima scadenza",
      expiring: {
        title: "Crediti dell’abbonamento",
        description: "Inclusi nel piano mensile",
      },
      permanent: {
        title: "Crediti senza scadenza",
        description: "I crediti acquistati in pacchetti non scadono mai",
      },
      free: {
        title: "Crediti mensili gratuiti",
        description:
          "Senza account: {{guest}} crediti gratuiti al mese. Con un account gratuito: {{signedIn}} al mese. Con account e newsletter: {{max}} al mese.",
      },
      earned: {
        title: "Crediti guadagnati",
        description: "Guadagna invitando amici →",
      },
    },
    overview: {
      guestOffer: {
        description:
          "Conferma il tuo indirizzo e-mail e ottieni fino a {{count}} crediti al mese con un account gratuito. Non serve una carta.",
        action: "Crea un account gratuito",
      },
      howItWorks: {
        title: "Come funzionano i crediti",
        description:
          "Gli stessi crediti valgono per ogni modello. Scegli un piano, ricarica o inizia gratis.",
        expiring: {
          title: "Piani mensili",
          description:
            "Piani da {{minPrice}} a {{maxPrice}} al mese, fino a {{maxCredits}} crediti. Tutti i {{modelCount}} modelli inclusi.",
        },
        permanent: {
          title: "Pacchetti di crediti",
          description:
            "Ricarica qualsiasi piano: {{packPrice}} per {{packCredits}} crediti. Compra tutti i pacchetti che ti servono. Non scadono mai.",
        },
        free: {
          title: "Crediti gratuiti",
          description:
            "Senza account: {{guest}} al mese. Con un account gratuito: {{signedIn}} al mese. Con account e newsletter: {{max}} al mese. Nessuna carta richiesta.",
        },
      },
      costs: {
        title: "Quanto costa",
        description:
          "Paga in crediti ogni messaggio, immagine, clip o chiamata a uno strumento. I prezzi dei messaggi sono indicativi: per i modelli OpenRouter paghi il costo effettivo del fornitore più il nostro ricarico.",
        models: {
          title: "Modelli IA (per messaggio)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "{{count}} crediti",
          showLegacy: "Mostra i modelli precedenti",
          hideLegacy: "Nascondi i modelli precedenti",
          free: "Gratis",
          approxCost: "~crediti",
          legacyBadge: "Precedente",
          types: {
            text: "Chat",
            tts: "Da testo a voce",
            stt: "Da voce a testo",
            image: "Generazione di immagini",
            audio: "Generazione di musica",
            video: "Generazione di video",
          },
        },
        features: {
          title: "Funzionalità",
          braveSearchLabel: "Brave Search (per ricerca)",
          kagiSearchLabel: "Kagi Search (per ricerca)",
          fetchUrlLabel: "Ottieni il testo di una pagina web (per richiesta)",
          costFormat: "{{value}} {{unit}}",
          creditsUnit: "crediti",
        },
      },
      cta: {
        title: "Accedi a tutti i modelli",
        description:
          "Crediti mensili per tutti i {{modelCount}} modelli. Puoi ricaricare in qualsiasi momento con un pacchetto.",
        button: "Abbonati",
      },
    },
    buy: {
      signInRequired: {
        title: "Accedi al tuo account",
        description:
          "Accedi o crea un account per acquistare crediti o abbonarti.",
      },
      provider: {
        stripe: {
          description: "Carte di credito e debito",
        },
        nowpayments: {
          description: "Criptovalute",
        },
        cryptoMinimumPacks:
          "Per pagare in criptovalute devi acquistare almeno {{minPacks}} pacchetti di crediti ({{minValue}}) per raggiungere l’importo minimo della transazione.",
      },
      subscription: {
        badge: "Più conveniente",
        title: "Abbonamento mensile",
        description:
          "{{subPrice}} al mese per {{subCredits}} crediti mensili, validi per tutti i {{modelCount}} modelli IA",
        perMonth: "/mese",
        perYear: "/anno",
        yearlyEquivalent:
          "Solo {{monthlyPrice}} al mese con fatturazione annuale",
        features: {
          credits: "{{count}} crediti al mese",
          expiry: "Accedi a tutti i {{modelCount}} modelli IA",
          bestFor: "Per chi usa l’IA regolarmente",
        },
        button: "Abbonati ora",
        buttonAlreadySubscribed: "Abbonamento già attivo",
      },
      pack: {
        title: "Pacchetti di crediti extra",
        description: "Ricarica il tuo piano. I crediti non scadono mai.",
        badge: "Ricarica",
        perPack: "/pacchetto",
        quantity: "Quantità",
        total: "{{count}} crediti",
        features: {
          credits: "{{count}} crediti per pacchetto",
          permanent: "Nessuna scadenza",
          expiry: "Nessuna scadenza",
          bestFor: "Per chi usa l’IA intensamente e ha bisogno di più crediti",
        },
        button: {
          submit: "Acquista il pacchetto",
        },
        totalPrice: "Totale: {{price}}",
        pack: "Pacchetto",
        packs: "Pacchetti",
      },
    },
    history: {
      title: "Storico delle transazioni",
      description: "Le tue ultime transazioni in crediti",
      empty: {
        title: "Nessuna transazione",
        description: "Qui vedrai lo storico delle tue transazioni in crediti",
      },
      balance: "Saldo: {{count}}",
      loadMore: "Carica altre transazioni",
      types: {
        purchase: "Acquisto",
        subscription: "Abbonamento",
        usage: "Utilizzo",
        expiry: "Scadenza",
        free_tier: "Piano gratuito",
        monthly_reset: "Rinnovo mensile",
        free_grant: "Assegnazione di crediti gratuiti",
        free_reset: "Rinnovo dei crediti gratuiti",
        refund: "Rimborso",
        transfer: "Trasferimento",
        other_devices: "Spesa da altri dispositivi",
        referral_earning: "Guadagno da inviti",
        referral_payout: "Pagamento dei guadagni da inviti",
      },
    },
    tabs: {
      overview: "Panoramica",
      buy: "Acquista crediti",
      adminBuy: "Gestisci crediti",
      billing: "Fatturazione",
      history: "Storico",
      plans: "Piani",
      remote: "Sincronizzazione cloud",
    },
    admin: {
      title: "Crediti e limiti",
      description:
        "Gestisci le assegnazioni di crediti e i limiti di utilizzo di questa istanza",
      allocate: {
        title: "Assegna crediti",
        description:
          "Aggiungi crediti a qualsiasi account. I crediti limitano la spesa per l’IA. Se gestisci la tua istanza, imposta qui il budget che vuoi consentire.",
        howItWorks: {
          title: "Come funzionano i limiti di credito",
          freePool: {
            title: "Crediti gratuiti condivisi",
            description:
              "Tutti gli utenti attingono alla stessa riserva di crediti gratuiti, che si rinnova ogni mese. Imposta l’importo nelle impostazioni dell’ambiente.",
          },
          bonus: {
            title: "Crediti bonus per utente",
            description:
              "I crediti bonus non scadono e si sommano ai crediti gratuiti condivisi. Usali per dare a singoli utenti più margine di utilizzo.",
          },
          apiKeys: {
            title: "Rimuovi tutti i limiti",
            description:
              "Configura le tue chiavi API per i modelli linguistici nelle impostazioni per usare l’IA senza crediti. Anche ogni utente può usare la propria chiave API.",
          },
        },
      },
    },
    payment: {
      success: {
        title: "Pagamento riuscito",
        subscription:
          "Il tuo abbonamento è attivo. I crediti saranno disponibili a breve.",
        credits:
          "Hai acquistato il pacchetto. I crediti saranno disponibili a breve.",
      },
      canceled: {
        title: "Pagamento annullato",
        subscription:
          "Il pagamento dell’abbonamento è stato annullato. Puoi riprovare quando vuoi.",
        credits:
          "Il pagamento del pacchetto è stato annullato. Puoi riprovare quando vuoi.",
      },
    },
  },
  meta: {
    category: "Prezzi",
    imageAlt: "Prezzi di {{appName}}: crediti per tutti i modelli IA",
    keywords:
      "prezzi chat IA, prezzi IA senza censura, IA a pagamento per messaggio, crediti IA, {{appName}}",
    overview: {
      title: "Prezzi: paghi a messaggio, senza vincoli | {{appName}}",
      description:
        "Fino a {{freeCredits}} crediti gratuiti al mese. Piani a partire da {{subPrice}} per {{subCredits}} crediti mensili, fino a {{maxCredits}}. Un solo saldo per {{modelCount}} modelli, da quelli tradizionali a quelli senza censura.",
    },
    buyCredits: {
      title: "Piani e pacchetti di crediti | {{appName}}",
      description:
        "Piani a partire da {{subPrice}} per {{subCredits}} crediti al mese, fino a {{maxCredits}}. I pacchetti ricaricano ogni piano e non scadono. Paga con carta, PayPal o criptovalute. {{modelCount}} modelli IA.",
    },
    history: {
      title: "Storico dei crediti | {{appName}}",
      description:
        "Tutti i crediti in entrata e in uscita: acquisti, assegnazioni mensili, guadagni da inviti e costo di ogni chat.",
    },
  },
  payment: {
    success: {
      title: "Pagamento riuscito",
      subscription:
        "Il tuo abbonamento è attivo. Ricevi {{subCredits}} crediti al mese da spendere su tutti i {{modelCount}} modelli.",
      credits: "Hai acquistato il pacchetto. I crediti non scadono mai.",
    },
    canceled: {
      title: "Pagamento annullato",
      subscription:
        "Il pagamento dell’abbonamento è stato annullato. Puoi riprovare quando vuoi.",
      credits:
        "Il pagamento del pacchetto è stato annullato. Puoi riprovare quando vuoi.",
    },
  },
};
