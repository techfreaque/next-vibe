import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Fils de discussion",
  },
  patch: {
    title: "Renommer le fil",
    titleShort: "Renommer le fil",
    description: "Modifier le titre et l'aperçu d'un fil de discussion",
    container: {
      title: "Renommer le fil",
      description: "Définir un nouveau titre ou un nouvel aperçu pour le fil",
    },
    threadId: {
      label: "ID du fil",
      description: "ID du fil à renommer",
    },
    threadTitle: {
      label: "Titre",
      description: "Nouveau titre du fil",
      placeholder: "Saisissez le titre du fil...",
    },
    preview: {
      label: "Aperçu",
      description: "Courte description ou texte d'aperçu du fil",
      placeholder: "Saisissez le texte d'aperçu...",
    },
    response: {
      threadId: {
        content: "ID du fil",
      },
      title: {
        content: "Titre",
      },
      preview: {
        content: "Aperçu",
      },
      updatedAt: {
        content: "Mis à jour le",
      },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description:
          "Vérifiez que threadId est un UUID valide et qu'au moins un champ est renseigné",
        noActiveThread: "Aucun fil actif dans le contexte du flux",
        folderUnresolved: "Impossible de déterminer le dossier du fil",
      },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous pour renommer des fils",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation de renommer ce fil",
      },
      notFound: {
        title: "Fil introuvable",
        description: "Aucun fil n'existe avec cet ID",
        detail: "Fil introuvable : {{threadId}}",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de renommer le fil",
        detail: "Erreur serveur : {{error}}",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Un problème est survenu",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications ne sont pas enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Le fil a été modifié par quelqu'un d'autre",
      },
    },
    success: {
      title: "Fil renommé",
      description: "Le titre et l'aperçu du fil ont été mis à jour",
    },
    backButton: {
      label: "Annuler",
    },
    submitButton: {
      label: "Enregistrer",
      loadingText: "Enregistrement...",
    },
    dynamicTitle: "Renommer le fil : {{title}}",
  },
};
