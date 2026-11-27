import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pagamenti",
  tag: "Avviso di trasferimento piano",

  post: {
    title: "Avviso di trasferimento piano",
    titleShort: "Avviso trasferimento",
    description:
      "Mail unica a ogni abbonato con carta: trasferire il piano al nuovo fornitore di pagamento. La prova elenca i destinatari e genera un'anteprima. Un invio reale scrive a ogni utente una sola volta e resta bloccato finché il nuovo fornitore non è attivo.",
    container: {
      title: "Avviso di trasferimento piano",
      description:
        "Abbonati con carta (attivi, in prova, con pagamento scaduto, in chiusura a fine periodo) non ancora contattati",
    },
    fields: {
      dryRun: {
        label: "Prova",
        description:
          "Elenca i destinatari e genera un'anteprima. Non invia nulla.",
      },
      batchSize: {
        label: "Dimensione del lotto",
        description:
          "Numero massimo di mail in questo invio (limitato anche dal budget orario)",
      },
      hourlyCap: {
        label: "Limite orario",
        description:
          "Numero massimo di mail della piattaforma all'ora, contando tutte le mail (limite della casella: 500)",
      },
      previewLocale: {
        label: "Lingua dell'anteprima",
        description: "Genera la mail in questa lingua",
      },
      testRecipient: {
        label: "Destinatario di test",
        description:
          "Invia la mail vera solo a questo indirizzo. Senza controllo del provider attivo, nessuno viene segnato come avvisato.",
      },
    },
    response: {
      providerLive: "Nuovo fornitore attivo",
      targetProvider: "Nuovo fornitore",
      totalRecipients: "Abbonati con carta",
      alreadyNotified: "Già contattati",
      pending: "Da contattare",
      planNotSupported: "Piano non offerto dal nuovo fornitore (saltato)",
      hourlyBudget: "Budget orario rimasto",
      sent: "Inviate",
      failed: "Non riuscite",
      byLocale: "Per lingua",
      locale: "Lingua",
      count: "Numero",
      recipients: "Destinatari di questo invio",
      userId: "Utente",
      email: "Email",
      status: "Stato",
      deadline: "Scadenza",
      testSentTo: "Test inviato a",
      previewSubject: "Oggetto anteprima",
      previewHtml: "HTML anteprima",
    },
    widget: {
      dryRunBadge: "Prova",
      liveBadge: "Invio reale",
      notLive:
        "Il nuovo fornitore non è ancora attivo. Un invio reale viene rifiutato.",
      run: "Avvia",
      noRecipients: "Non resta nessuno da contattare.",
    },
    errors: {
      notLive: {
        title: "Nuovo fornitore non attivo",
        description:
          "Imposta SUBSCRIPTION_SWITCH_PROVIDER e SUBSCRIPTION_SWITCH_ENABLED=true e verifica che il fornitore accetti pagamenti prima di inviare.",
      },
      validation: {
        title: "Richiesta non valida",
        description: "Controlla i campi e riprova.",
      },
      unauthorized: {
        title: "Accesso richiesto",
        description: "Solo per admin.",
      },
      forbidden: {
        title: "Non consentito",
        description: "Solo per admin.",
      },
      server: {
        title: "Invio non riuscito",
        description: "L'invio degli avvisi non è riuscito. Controlla i log.",
      },
      unknown: {
        title: "Errore imprevisto",
        description: "È successo qualcosa di imprevisto.",
      },
    },
    success: {
      title: "Invio completato",
      description: "I numeri sono qui sotto.",
    },
  },

  emailTemplate: {
    name: "Avviso di trasferimento piano",
    description:
      "Mail unica che chiede agli abbonati con carta di trasferire il piano al nuovo fornitore di pagamento",
    category: "Abbonamenti",
    preview: {
      privateName: {
        label: "Nome",
        description: "Nome dell'abbonato",
      },
      planName: {
        label: "Piano",
        description: "Nome del piano",
      },
      deadline: {
        label: "Scadenza",
        description: "Ultimo giorno del periodo pagato",
      },
    },
  },

  email: {
    subject:
      "Troppa libertà per il nostro gestore carte. Sposta il tuo piano entro il {{deadline}}",
    subjectPastDue:
      "Troppa libertà per il nostro gestore carte. Sposta il tuo piano ora",
    subjectNoDate:
      "Troppa libertà per il nostro gestore carte. Sposta il tuo piano per tenerlo",
    previewText:
      "Un clic e il tuo piano resta. Stesso prezzo, crediti al sicuro.",
    headline: "Troppa libertà per le loro regole. Quella giusta per te.",
    greeting: "Ciao {{privateName}},",
    intro:
      "Il nostro gestore dei pagamenti con carta ha deciso che un'AI che risponde liberamente non rientra nelle sue regole, quindi i pagamenti con carta del tuo piano {{planName}} si sono fermati. Con un clic lo sposti sul nostro nuovo sistema di pagamento entro il {{deadline}}, altrimenti il piano termina il {{deadline}} e i tuoi crediti restano.",
    introPastDue:
      "Il nostro gestore dei pagamenti con carta ha deciso che un'AI che risponde liberamente non rientra nelle sue regole, quindi l'ultimo rinnovo del tuo piano {{planName}} non è andato a buon fine. Con un clic sposti subito il piano sul nostro nuovo sistema di pagamento, e i tuoi crediti restano in ogni caso.",
    introNoDate:
      "Il nostro gestore dei pagamenti con carta ha deciso che un'AI che risponde liberamente non rientra nelle sue regole, quindi i pagamenti con carta del tuo piano {{planName}} si sono fermati. Con un clic lo sposti sul nostro nuovo sistema di pagamento, altrimenti il piano termina alla fine del periodo già pagato e i tuoi crediti restano.",
    cta: "Sposta il mio piano",
    reassurance:
      "Stesso piano, stesso prezzo, e i giorni già pagati restano tuoi. Nessun doppio addebito. Ogni credito resta sul tuo account.",
    stance: "Cambiamo gestore prima di censurare anche una sola risposta.",
    crypto: "Preferisci pagare in crypto? Si può fare anche così.",
    cryptoCta: "Paga in crypto",
    help: "Domande? Rispondi a questa mail. Ogni risposta la legge una persona.",
    signoff: "Grazie di essere dalla nostra parte,\nIl team di {{appName}}",
  },
};
