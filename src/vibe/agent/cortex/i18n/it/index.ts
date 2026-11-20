/* eslint-disable i18next/no-literal-string */
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    cortex: "Cortex",
  },
  category: "Cortex",
  scaffold: {
    roots: {
      memories: "memories",
      documents: "documents",
    },
    memories: {
      identity: {
        path: "identity",
        purpose: "Chi sei: nome, ruolo, obiettivi e stile di comunicazione",
      },
      expertise: {
        path: "expertise",
        purpose: "Cosa sai fare: competenze, strumenti ed esperienza",
      },
      context: {
        path: "context",
        purpose: "Situazione attuale: progetti in corso, preferenze e vincoli",
      },
      life: {
        path: "life",
        purpose:
          "Obiettivi e situazione di vita: carriera, salute, relazioni, finanze, crescita e direzione",
      },
    },
    documents: {
      inbox: {
        path: "inbox",
        purpose:
          "Appunti al volo. Salvali qui, poi elaborali e archiviali quando hai il contesto.",
        icon: "inbox",
      },
      projects: {
        path: "projects",
        purpose: "Lavori in corso. Una sottocartella per progetto.",
        icon: "folder-open",
      },
      knowledge: {
        path: "knowledge",
        purpose: "Riferimenti da conservare nel tempo",
        icon: "book-open",
      },
      journal: {
        path: "journal",
        purpose: "Appunti con data: idee, riflessioni e osservazioni",
        icon: "pen-line",
      },
      templates: {
        path: "templates",
        purpose: "Modelli riutilizzabili per attività ricorrenti",
        icon: "layout-template",
      },
    },
  },
  templates: {
    memories: {
      identity: {
        name: {
          path: "name.md",
          content: `---\npriority: 100\ntags: [identity]\n---\n\n<!-- Il tuo nome e come preferisci che ti si rivolga. L’IA compilerà questo campo durante la prima conversazione. -->\n`,
        },
        role: {
          path: "role.md",
          content: `---\npriority: 100\ntags: [identity, work]\n---\n\n<!-- Il tuo ruolo professionale, cosa fai e in quale contesto lavori. -->\n`,
        },
        goals: {
          path: "goals.md",
          content: `---\npriority: 90\ntags: [identity, goals]\n---\n\n<!-- I tuoi obiettivi principali: cosa vuoi costruire, raggiungere o migliorare a breve e a lungo termine. -->\n`,
        },
        communication: {
          path: "communication.md",
          content: `---\npriority: 85\ntags: [identity, style]\n---\n\n<!-- Come preferisci comunicare: tono, livello di dettaglio, formato, cosa ti infastidisce e cosa apprezzi. -->\n`,
        },
      },
      expertise: {
        skills: {
          path: "skills.md",
          content: `---\npriority: 80\ntags: [expertise]\n---\n\n<!-- Le tue competenze tecniche e professionali. In cosa hai esperienza e cosa stai imparando? -->\n`,
        },
        tools: {
          path: "tools.md",
          content: `---\npriority: 75\ntags: [expertise, tech]\n---\n\n<!-- Strumenti, linguaggi, framework e piattaforme che usi di solito. Tecnologie che preferisci. -->\n`,
        },
        background: {
          path: "background.md",
          content: `---\npriority: 70\ntags: [expertise]\n---\n\n<!-- Il tuo percorso, le tue esperienze e come sei arrivato fin qui. Aiuta l’IA a capire il contesto di ogni interazione. -->\n`,
        },
      },
      context: {
        projects: {
          path: "projects.md",
          content: `---\npriority: 80\ntags: [context, projects]\n---\n\n<!-- Progetti in corso: a cosa stai lavorando e cosa conta di più adesso. -->\n`,
        },
        preferences: {
          path: "preferences.md",
          content: `---\npriority: 70\ntags: [context]\n---\n\n<!-- Come preferisci lavorare, cosa ti rallenta e cosa ti aiuta a concentrarti. -->\n`,
        },
        constraints: {
          path: "constraints.md",
          content: `---\npriority: 65\ntags: [context]\n---\n\n<!-- Limiti, regole rigide e condizioni irrinunciabili per il comportamento dell’IA nei tuoi confronti. -->\n`,
        },
      },
      life: {
        career: {
          path: "career.md",
          content: `---\npriority: 90\ntags: [life, career, goals]\n---\n\n## Situazione attuale\n\n<!-- Che lavoro fai oggi? Ruolo, azienda o progetto, reddito e soddisfazione da 1 a 10. -->\n\n## Obiettivi\n\n<!-- A breve termine (questo mese): -->\n<!-- A medio termine (quest’anno): -->\n<!-- A lungo termine (3-5 anni): -->\n\n## Progetti in corso\n\n<!-- Quali progetti in /documents/projects/ ti aiutano nella carriera? In che modo? -->\n\n## Ostacoli\n\n<!-- Quale problema, una volta risolto, cambierebbe tutto? Qual è l’ostacolo maggiore? -->\n\n## Schemi ricorrenti\n\n<!-- Schemi ricorrenti nel lavoro: cosa continui a cercare, cosa ti svuota e cosa ti dà energia. -->\n`,
        },
        health: {
          path: "health.md",
          content: `---\npriority: 90\ntags: [life, health, goals]\n---\n\n## Situazione attuale\n\n<!-- Fai il punto con sincerità: forma fisica, stato mentale, qualità del sonno, condizioni di salute e preoccupazioni. -->\n\n## Abitudini\n\n<!-- Cosa fai già: attività fisica, orari del sonno e abitudini alimentari. -->\n\n## Energia\n\n<!-- Cosa ti ricarica? Cosa ti stanca? In quali momenti della giornata o della settimana sei più lucido? -->\n\n## Obiettivi\n\n<!-- A breve termine (questo mese): -->\n<!-- A lungo termine (quest’anno): -->\n\n## Ostacoli\n\n<!-- Cosa ti impedisce di stare meglio? Tempo, motivazione, informazioni o ambiente? -->\n`,
        },
        relationships: {
          path: "relationships.md",
          content: `---\npriority: 85\ntags: [life, relationships, goals]\n---\n\n## Persone più vicine\n\n<!-- Le 3-5 persone più importanti. Partner, famiglia e amici più stretti. Come va con ciascuna? -->\n\n## Situazione attuale\n\n<!-- Come vanno le tue relazioni? A chi ti senti vicino? Da chi ti sei allontanato? -->\n\n## Tempo ed energie\n\n<!-- Chi ha bisogno di più attenzioni da parte tua? A quali relazioni dedichi troppe o troppo poche energie? -->\n\n## Obiettivi\n\n<!-- Cosa vuoi costruire o recuperare nelle tue relazioni quest’anno? -->\n\n## Ostacoli\n\n<!-- Che cosa ti ostacola? Tempo, distanza, conflitti aperti o conversazioni che eviti? -->\n`,
        },
        finances: {
          path: "finances.md",
          content: `---\npriority: 85\ntags: [life, finances, goals]\n---\n\n## Situazione attuale\n\n<!-- Entrate e spese mensili. Risparmi e debiti. Stabilità da 1 a 10. -->\n\n## Riserva di sicurezza\n\n<!-- Per quanti mesi potresti farcela senza entrate? -->\n\n## Obiettivi\n\n<!-- A breve termine (questo mese): -->\n<!-- A lungo termine (quest’anno): -->\n\n## Crescita\n\n<!-- Come costruisci il tuo patrimonio o la tua sicurezza economica? Investimenti, entrate extra e competenze che generano reddito. -->\n\n## Ostacoli\n\n<!-- Qual è il rischio o l’ostacolo economico più grande al momento? -->\n`,
        },
        growth: {
          path: "growth.md",
          content: `---\npriority: 85\ntags: [life, growth, learning, goals]\n---\n\n## Su cosa ti concentri\n\n<!-- Cosa stai imparando o sviluppando in questo periodo? Cosa comincia a venirti naturale? -->\n\n## Competenze da sviluppare\n\n<!-- Quale competenza o conoscenza ti farebbe fare il salto di qualità? -->\n\n## Obiettivi\n\n<!-- Cosa vuoi imparare o padroneggiare quest’anno? Indica un obiettivo concreto. -->\n\n## Risorse\n\n<!-- Libri, corsi, mentori e comunità che ti aiutano. Cosa funziona? -->\n\n## Ostacoli\n\n<!-- Cosa rallenta la tua crescita? Tempo, concentrazione, accesso alle risorse o paura? -->\n`,
        },
        purpose: {
          path: "purpose.md",
          content: `---\npriority: 95\ntags: [life, purpose, values, goals]\n---\n\n## Direzione\n\n<!-- In una o due frasi: cosa conta davvero nella tua vita? Cosa vuoi fare o costruire? -->\n\n## Valori fondamentali\n\n<!-- Indica 3-5 valori che guidano davvero le tue decisioni quotidiane. -->\n\n## Cosa significa riuscire\n\n<!-- Tra 5 anni, cosa dovrà esserci nella tua vita perché tu ne sia soddisfatto? -->\n`,
        },
      },
    },
    documents: {
      meetingNotes: {
        path: "meeting-notes.md",
        content: `---\ntype: template\ntags: [meetings, template]\n---\n\n# Verbale della riunione ([Date])\n\n**Partecipanti:**\n**Scopo:**\n\n## Contesto\n\nSpiega in breve perché si è tenuta la riunione.\n\n## Ordine del giorno\n\n1.\n2.\n3.\n\n## Decisioni principali\n\n-\n\n## Azioni da completare\n\n- [ ] @person: attività, scadenza [date]\n\n## Note\n\n---\n*Archiviato da /documents/inbox*\n`,
      },
      projectBrief: {
        path: "project-brief.md",
        content: `---\ntype: template\ntags: [projects, template]\nstatus: draft\n---\n\n# Scheda del progetto: [Name]\n\n**Responsabile:**\n**Inizio:**\n**Traguardo:**\n\n## Problema\n\nQuale problema resta aperto senza questo progetto? Spiegalo in un paragrafo.\n\n## Obiettivo\n\nUna frase. Indica il risultato preciso. Rendilo misurabile se puoi.\n\n## Ambito\n\n**Incluso:**\n-\n\n**Escluso:**\n-\n\n## Criteri di successo\n\n- [ ]\n- [ ]\n\n## Rischi\n\n| Rischio | Probabilità | Impatto | Mitigazione |\n|------|-----------|--------|------------|\n|      |           |        |            |\n\n## Risorse\n\nLink, riferimenti e lavori precedenti.\n`,
      },
      weeklyReview: {
        path: "weekly-review.md",
        content: `---\ntype: template\ntags: [review, weekly, template]\n---\n\n# Settimana del [Date]\n\n## Cosa hai consegnato\n\n-\n\n## Cosa è rimasto in sospeso\n\n-\n\n## Ostacoli incontrati\n\n-\n\n## Cosa ho imparato\n\n-\n\n## Priorità della prossima settimana\n\n1.\n2.\n3.\n\n## Livello di energia (da 1 a 10)\n\nLavoro:\nVita privata:\n\n---\n*Usa meno di 200 parole. Scrivi in fretta e concentrati sull’essenziale.*\n`,
      },
      decisionLog: {
        path: "decision-log.md",
        content: `---\ntype: template\ntags: [decisions, architecture, template]\n---\n\n# Decisione: [Title]\n\n**Data:**\n**Stato:** proposed | accepted | superseded | deprecated\n**Chi decide:**\n\n## Contesto\n\nQuale situazione ha richiesto questa decisione? Quali vincoli ci sono?\n\n## Opzioni valutate\n\n### Opzione A ([Name])\n\n**Pro:**\n**Contro:**\n\n### Opzione B ([Name])\n\n**Pro:**\n**Contro:**\n\n## Decisione\n\nAbbiamo scelto **l’opzione [X]** perché:\n\n## Conseguenze\n\n**Positive:**\n**Negative:**\n**Neutre:**\n\n---\n*Inserisci un link a questo file nella scheda del progetto o nel commento al codice pertinente.*\n`,
      },
      knowledgeArticle: {
        path: "knowledge-article.md",
        content: `---\ntype: template\ntags: [knowledge, reference, template]\n---\n\n# [Topic]\n\n**Ultima verifica:**\n**Fonte:**\n\n## Sintesi\n\nIn un paragrafo: cos’è, perché conta e quando si applica?\n\n## Come funziona\n\nSpiega il funzionamento di base. Includi solo ciò che serve per capire o applicare il concetto.\n\n## Quando usarlo\n\n-\n-\n\n## Quando evitarlo\n\n-\n\n## Esempi\n\n\`\`\`\nincolla qui un esempio\n\`\`\`\n\n## Riferimenti\n\n-\n`,
      },
    },
  },
  enums: {
    nodeType: {
      file: "File",
      dir: "Cartella",
    },
    viewType: {
      list: "Elenco",
      kanban: "Kanban",
      calendar: "Calendario",
      grid: "Griglia",
      wiki: "Wiki",
    },
    syncPolicy: {
      sync: "Sincronizza",
      local: "Solo locale",
    },
    creditFeature: {
      write: "Scrivi",
      edit: "Modifica",
      search: "Cerca",
      embedding: "Embedding",
    },
  },
  mounts: {
    memory: "Memoria",
    document: "Documento",
    thread: "Conversazione",
    skill: "Skill",
    task: "Attività",
    upload: "Caricamento",
    search: "Cerca",
    favorite: "Preferito",
    gen: "Contenuto generato",
    ssh: "Connessione SSH",
  },
  button: {
    label: "Cortex",
    title: "Cortex, memoria dell’IA",
    unavailableTitle: "Cortex non disponibile",
    unavailableDescription:
      "Cortex è disponibile nelle conversazioni private e condivise. Apri una conversazione privata per usare la memoria dell’IA.",
  },
  nav: {
    back: "Indietro",
    actions: {
      list: "Sfoglia",
      read: "Visualizza",
      write: "Scrivi",
      edit: "Modifica",
      delete: "Elimina",
      move: "Sposta",
      search: "Cerca",
      tree: "Albero",
    },
  },
};
