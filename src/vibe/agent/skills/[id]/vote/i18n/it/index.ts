import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Strumenti AI",
  tags: {
    skills: "competenze",
  },
  post: {
    selectSkill: "Apri una skill della community per votare.",
    browseSkills: "Esplora le skill della community",
    title: "Votazioni per la Skill",
    titleShort: "Vota Skill",
    description:
      "Votate su o giù su un'abilità comunitaria. Rimandare la tua direzione corrente rimuove il voto; inviando l'opposto lo capovolge.",
    dynamicTitle: "Vota: {{name}}",
    direction: {
      label: "Direzione",
      description: "Direzione di voto: su (utile) o giù (non utile).",
      up: "Votazioni",
      down: "Votazioni",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso al voto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non si può votare questa abilità",
      },
      notFound: { title: "Non trovato", description: "Non trovato" },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'elaborazione del voto",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
    success: {
      title: "Voto registrato",
      description: "Il vostro voto è stato aggiornato",
    },
    response: {
      userVote: { content: "Votazioni" },
      voteCount: { content: "Punteggio" },
      upCount: { content: "Votazioni" },
      downCount: { content: "Giù" },
      trustLevel: { content: "Livello di fiducia" },
    },
    backButton: {
      label: "Indietro",
    },
    button: {
      vote: "Votazioni",
      unvote: "Rimuovere Vote",
      loading: "Salvare...",
    },
    badge: {
      verified: "Verificato",
    },
  },
};
