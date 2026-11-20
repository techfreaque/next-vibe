import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    forum: "Forum",
  },
  post: {
    title: "Posta a Forum",
    titleShort: "Posto del Forum",
    description:
      "Pubblicare un progetto AI -scritto nel forum pubblico, parola per parola. Passare lo lastAiMessageId di una corsia come draftMessageId (o il suo threadId come draftThreadId). Risposta: threadId (opzionale parentId, predefinito per il post più recente). Nuovo thread: titolo + categoria. Il post è etichettato AI e mostra il modello che lo ha scritto. Rifiuta le auto-risposte, una seconda risposta AI allo stesso post umano, i repost di una bozza, i titoli duplicati e più di 6 posti all'ora.",
    form: {
      title: "Posto del Forum",
      description: "Pubblicare una bozza generata invariata",
    },
    draftMessageId: {
      label: "Progetto di messaggio ID",
      description:
        "Il messaggio AI che tiene il progetto (lastAiMessageId da ai-run). Il suo testo, modello e abilità sono pubblicati invariati.",
    },
    draftThreadId: {
      label: "Progetto di filo ID",
      description:
        "Alternativa a draftMessageId: la threadId ritornata da ai-run. Il suo nuovo messaggio AI è pubblicato.",
    },
    threadId: {
      label: "File ID",
      description:
        "Filone pubblico per rispondere. Lasciare vuoto per avviare un nuovo thread.",
    },
    parentId: {
      label: "Rispondi a",
      description:
        "Messaggio per rispondere. Predefinisce il nuovo post nel thread.",
    },
    threadTitle: {
      label: "Titolo del thread",
      description: "Titolo per un nuovo thread. Richiesto senza threadId.",
    },
    category: {
      label: "Categoria",
      description:
        "Nome della categoria del forum per un nuovo thread, ad esempio. Filosofia, Politica, Scienza, Cultura, Tecnologia.",
    },
    requireUncensored: {
      label: "Solo incenso",
      description:
        "Rifiutare il progetto a meno che non l'abbia scritto un modello non censurato.",
    },
    button: {
      submit: "Posta",
      loading: "Postare...",
      openThread: "Aprire il filo",
    },
    response: {
      threadId: "File ID",
      messageId: "Messaggio ID",
      isNewThread: "Nuova conversazione",
      threadUrl: "File URL",
      postedModel: "Pubblicato come modello",
      postedSkill: "Pubblicato come Persona",
      postsLeftThisHour: "Posts Left This Hour",
    },
    guard: {
      draftNotFound:
        "Si tratta di {{draftMessageId}} non trovato, o non è un messaggio AI in uno dei tuoi filetti. Passare la lastAiMessageId restituito da ai-run.",
      notUncensored:
        "Il progetto è stato scritto da {{model}}, non un modello non censurato. Niente postato. Redraft con una variante di abilità non censurata.",
      draftMissing:
        "Passare draftMessageId (lastAiMessageId da ai-run) o draftThreadId (threadId da ai-run).",
      draftEmpty: "Il progetto {{draftMessageId}} non ha testo da inviare.",
      draftAlreadyPosted:
        "Questa bozza è già postata nel forum (thread {{threadId}}). Niente postato.",
      threadNotFound:
        "Filo pubblico {{threadId}} non trovato, cancellato o nascosto.",
      notPublic: "Il thread {{threadId}} non è nel forum pubblico.",
      parentNotFound:
        "Messaggio {{parentId}} non è un post nel thread {{threadId}}.",
      emptyThread: "Thread {{threadId}} non ha nessun post a cui rispondere.",
      selfReply:
        "L'articolo che risponderesti è il tuo AI post. Aspettate fino a che una persona non risponde. Niente postato.",
      alreadyAnswered:
        "Una risposta AI segue già quel post. Scegli un filo in cui una persona ha postato l'ultimo. Niente postato.",
      titleRequired: "Un nuovo thread ha bisogno di un titolo e una categoria.",
      categoryNotFound:
        "Categoria ' {{category}}' non trovato. Disponibile: {{available}}.",
      duplicateTitle:
        'Esiste già un filo pubblico intitolato "{{title}}" ({{threadId}}). Scegli un argomento nuovo.',
      rateLimited:
        "Limite orario raggiunto: {{limit}} AI messaggi del forum all'ora. Riprova più tardi.",
      threadCreateFailed: "Non è possibile creare il thread: {{error}}",
      postFailed: "Non è possibile inviare il messaggio: {{error}}",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controllare la bozza ID, thread ID, titolo e categoria",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per postare",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Solo gli amministratori possono pubblicare messaggi AI nel forum",
      },
      notFound: {
        title: "Non trovato",
        description: "Progetto, filo o categoria non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Posting non riuscito sul server",
        detail: "Errore del server: {{error}}",
      },
      network: {
        title: "Errore di rete",
        description: "Incapace di raggiungere il server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Qualcosa di inaspettato è andato storto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Non pubblicato",
        description:
          "Bloccato da una guardia del forum: duplicato, auto-rippo o limite orario",
      },
    },
    success: {
      title: "Pubblicato",
      description: "Il progetto è in diretta nel forum",
    },
  },
};
