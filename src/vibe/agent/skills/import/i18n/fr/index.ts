import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Outils IA",
  tags: {
    skills: "skills",
  },
  enums: {
    platform: {
      characterAi: "Character.AI",
      talkie: "Talkie",
      characterCard: "Carte de personnage",
    },
    visibility: {
      private: "Privé",
      unlisted: "Non répertorié",
      public: "Public",
    },
  },
  post: {
    title: "Importer un personnage via un lien",
    titleShort: "Importer via un lien",
    description:
      "Importe un personnage depuis un lien public Character.AI (character.ai, c.ai) ou Talkie (talkie-ai.com). Copie le nom, l'avatar, le message d'accueil, la description, la définition et les tags dans un nouveau personnage qui t'appartient, crédite le créateur d'origine et renvoie vers la source. Importer deux fois le même lien renvoie le personnage existant.",
    dynamicTitle: "Import : {{url}}",
    intro:
      "Colle un lien public de personnage. On copie ce que la page montre publiquement et on crédite le créateur d'origine.",
    supported: "Fonctionne avec Character.AI et Talkie.",
    url: {
      label: "Lien du personnage",
      description: "Lien public vers la page du personnage",
      placeholder: "https://character.ai/character/...",
      validation: {
        invalid: "Colle un lien complet qui commence par https://",
      },
    },
    visibility: {
      label: "Visibilité",
      description:
        "Privé : toi seul. Non répertorié : hors de la liste publique. Public : visible par tous.",
    },
    response: {
      id: { content: "ID du personnage" },
      name: { content: "Nom" },
      platform: { content: "Source" },
      creatorName: { content: "Créateur d'origine" },
      sourceUrl: { content: "Lien source" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Déjà importé" },
      importedFields: { content: "Importé" },
    },
    fields: {
      name: "nom",
      avatar: "avatar",
      greeting: "message d'accueil",
      description: "description",
      definition: "définition",
      tags: "tags",
    },
    result: {
      imported: "{{name}} est prêt.",
      alreadyImported: "Tu as déjà importé {{name}}. On ouvre ta copie.",
      credit: "Créé à l'origine par {{creator}} sur {{platform}}",
      creditUnknown: "Importé depuis {{platform}}",
      cardCredit: "Carte de {{creator}}",
      cardCreditUnknown: "Importé depuis une carte de personnage",
      fieldsList: "Importé : {{fields}}",
      openSkill: "Ouvrir le personnage",
      importAnother: "En importer un autre",
    },
    errors: {
      validation: {
        title: "Lien invalide",
        description: "Colle un lien public complet vers un personnage.",
      },
      network: {
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur.",
      },
      unauthorized: {
        title: "Connexion requise",
        description: "Connecte-toi pour importer des personnages.",
      },
      forbidden: {
        title: "Non autorisé",
        description: "Ton compte ne peut pas importer de personnages.",
      },
      notFound: {
        title: "Personnage introuvable",
        description:
          "La page ne montre aucune donnée publique. Le personnage est peut-être privé, supprimé ou réservé aux comptes connectés.",
      },
      server: {
        title: "Échec de l'import",
        description: "Un problème est survenu pendant l'import. Réessaie.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Tu as des modifications non enregistrées.",
      },
      conflict: {
        title: "Déjà importé",
        description: "Tu as déjà importé ce personnage.",
      },
      unsupported:
        "Lien non pris en charge. Colle un lien de personnage Character.AI (character.ai, c.ai) ou Talkie (talkie-ai.com).",
      blocked:
        "{{platform}} a bloqué la requête. Réessaie dans quelques minutes ou crée le personnage à la main.",
      noPublicData:
        "{{platform}} ne montre aucune donnée publique pour ce personnage. Il est peut-être privé, supprimé ou réservé aux comptes connectés.",
      rateLimited: "Trop d'imports. Attends {{seconds}} secondes et réessaie.",
      notConfigured:
        "Les pages {{platform}} nécessitent le récupérateur de pages, qui n'est pas configuré sur ce serveur.",
    },
    success: {
      title: "Personnage importé",
      description: "Ta copie est prête pour discuter.",
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Importer",
      loadingText: "Import en cours...",
    },
  },
};
