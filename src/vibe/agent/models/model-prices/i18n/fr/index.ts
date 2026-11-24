import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  get: {
    title: "Mettre à jour tous les prix des modèles",
    titleShort: "Mettre à jour les prix",
    description:
      "Récupère les prix actuels des fournisseurs et affiche les changements proposés. Utilisez --write dans la CLI locale pour les appliquer.",
    form: {
      title: "Mise à jour des prix des modèles",
      write: "Écrire les changements dans les fichiers sources",
    },
    response: {
      diff: "Diff des fichiers sources",
      summary: {
        title: "Résumé de la mise à jour",
        totalProviders: "Fournisseurs traités",
        totalModels: "Total des modèles",
        modelsUpdated: "Changements proposés",
        fileUpdated: "Fichier mis à jour",
      },
      updates: {
        title: "Modèles mis à jour",
        model: {
          modelId: "ID du modèle",
          name: "Nom du modèle",
          provider: "Fournisseur",
          field: "Champ de prix",
          value: "Nouvelle valeur",
          source: "Source du prix",
        },
      },
      failures: {
        title: "Échecs de récupération des prix",
        model: {
          modelId: "ID du modèle",
          provider: "Fournisseur",
          reason: "Raison",
        },
      },
      providerResults: {
        title: "Résultats par fournisseur",
        model: {
          provider: "Fournisseur",
          modelsFound: "Modèles trouvés",
          modelsUpdated: "Mis à jour",
          error: "Erreur",
        },
      },
    },
    errors: {
      server: {
        title: "Erreur serveur",
        description: "Échec de la mise à jour des prix des modèles",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre les API de tarification",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite",
        detail: "Erreur inconnue : {{error}}",
      },
      validation: {
        title: "Erreur de validation",
        description: "Paramètres de requête invalides",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à effectuer cette action",
      },
      forbidden: {
        title: "Accès refusé",
        description: "L'accès à cette ressource est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu lors du traitement de la requête",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
    success: {
      title: "Succès",
      description:
        "Les prix des fournisseurs ont été récupérés et comparés au catalogue.",
    },
  },
  tags: {
    models: "Modèles",
  },
  updateAllModelPrices: {
    name: "Mettre à jour tous les prix des modèles",
    description:
      "Compare les prix actuels des fournisseurs au catalogue et consigne les écarts pour révision.",
  },
};
