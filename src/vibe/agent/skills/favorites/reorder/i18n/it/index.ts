import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Preferiti",
  },
  post: {
    title: "Reorder Favorites",
    titleShort: "Reorder",
    description: "Aggiorna l'ordine delle tue configurazioni preferite",
    positions: {
      label: "Posizione",
    },
    errors: {
      validation: {
        title: "Ordine non valido",
        description:
          "Si prega di controllare le impostazioni dell'ordine e riprovare",
      },
      network: {
        title: "Errore di connessione",
        description:
          "Incapace di salvare il nuovo ordine. Per favore prova di nuovo.",
      },
      unauthorized: {
        title: "Accedi per continuare",
        description: "Si prega di firmare per riordinare i tuoi preferiti",
      },
      forbidden: {
        title: "Deniego di autorizzazioni",
        description: "Non hai il permesso di riordinare i preferiti",
      },
      notFound: {
        title: "Preferiti Non Trovato",
        description:
          "Non siamo riusciti a trovare i tuoi preferiti per riordinare",
      },
      server: {
        title: "Qualcosa di strano",
        description:
          "Non potevamo salvare il tuo nuovo ordine. Per favore prova di nuovo.",
      },
      unknown: {
        title: "Errore inaspettato",
        description:
          "E' successo qualcosa di inaspettato. Per favore prova di nuovo.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "I tuoi cambiamenti non sono ancora stati salvati",
      },
      conflict: {
        title: "Ordine Conflitto",
        description: "L'ordine è cambiato. Si prega di rinfrescare e riprovare",
      },
    },
    success: {
      title: "Ordine salvato",
      description: "I tuoi preferiti sono stati riordinati con successo",
    },
  },
};
