import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Preferiti",
  },
  post: {
    title: "Rimuovi i preferiti",
    titleShort: "Rimuovi",
    description: "Rimuovi diversi preferiti in one go",
    ids: {
      label: "ID preferiti",
    },
    errors: {
      validation: {
        title: "Richiesta non valida",
        description:
          "Si prega di controllare che cosa stai rimuovendo e riprovare",
      },
      network: {
        title: "Errore di connessione",
        description:
          "Incapace di rimuovere i preferiti. Per favore prova di nuovo.",
      },
      unauthorized: {
        title: "Accedi per continuare",
        description: "Si prega di firmare per rimuovere i tuoi preferiti",
      },
      forbidden: {
        title: "Deniego di autorizzazioni",
        description: "Non hai il permesso di rimuovere questi preferiti",
      },
      notFound: {
        title: "Preferiti Non Trovato",
        description: "Non siamo riusciti a trovare i preferiti per rimuovere",
      },
      server: {
        title: "Qualcosa di strano",
        description:
          "Non siamo riusciti a rimuovere i tuoi preferiti. Per favore prova di nuovo.",
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
        title: "Conflitto di rimozione",
        description:
          "Questi preferiti sono cambiati. Si prega di rinfrescare e riprovare",
      },
    },
    success: {
      title: "Rimuovi i preferiti",
      description: "I preferiti selezionati sono stati rimossi",
    },
  },
};
