import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Outils IA",
  tags: {
    skills: "skills",
  },
  enums: {
    visibility: {
      private: "Privé",
      unlisted: "Non répertorié",
      public: "Public",
    },
  },
  post: {
    title: "Importer une carte de personnage",
    titleShort: "Importer une carte",
    description:
      "Importe une carte de personnage (V1, V2 ou V3) depuis SillyTavern, Chub, RisuAI ou toute app au format Tavern. Accepte le fichier .json, une carte .png avec les données intégrées, ou le JSON de la carte en texte. Nom, description, personnalité, scénario, premier message, dialogue d'exemple, instructions de la carte et tags deviennent un nouveau personnage qui t'appartient. L'image d'une carte PNG devient l'avatar. Rien dans la carte n'est exécuté. Importer la même carte une deuxième fois renvoie le personnage existant.",
    intro:
      "Emmène tes personnages avec toi. Dépose le fichier de carte exporté depuis SillyTavern, Chub ou RisuAI.",
    supported: "Cartes V1, V2 et V3. JSON ou PNG, jusqu'à 10 Mo.",
    mapping: {
      title: "Ce qui est repris",
      fields:
        "Nom, description, personnalité, scénario, premier message, dialogue d'exemple, instructions de la carte, tags, créateur.",
      avatar: "Cartes PNG : l'image devient l'avatar.",
      safe: "Les lorebooks et scripts sont ignorés. Rien dans la carte n'est exécuté.",
    },
    card: {
      label: "Fichier de carte",
      description: "Carte de personnage en .json ou .png",
      validation: {
        required: "Choisis un fichier de carte.",
        tooLarge: "Le fichier de carte dépasse 10 Mo.",
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
      creatorName: { content: "Créateur de la carte" },
      sourceUrl: { content: "Lien source" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Déjà importé" },
      importedFields: { content: "Importé" },
    },
    fields: {
      name: "nom",
      avatar: "avatar",
      greeting: "premier message",
      description: "description",
      definition: "personnalité et scénario",
      tags: "tags",
    },
    result: {
      imported: "{{name}} est prêt.",
      alreadyImported: "Tu as déjà importé {{name}}. On ouvre ta copie.",
      fieldsList: "Importé : {{fields}}",
      openSkill: "Ouvrir le personnage",
      importAnother: "Importer une autre carte",
    },
    errors: {
      validation: {
        title: "Carte invalide",
        description:
          "Choisis un fichier de carte de personnage (.json ou .png).",
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
        title: "Introuvable",
        description: "La carte est introuvable.",
      },
      server: {
        title: "Échec de l'import",
        description: "Un problème est survenu pendant l'import. Réessaie.",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue.",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Tu as des modifications non enregistrées.",
      },
      conflict: {
        title: "Import en cours",
        description: "Cette carte est déjà en cours d'import.",
      },
      invalidCard:
        "Ce n'est pas une carte de personnage. Utilise le fichier .json ou .png exporté depuis SillyTavern, Chub ou RisuAI.",
      noCardInPng:
        "Ce PNG ne contient aucune donnée de carte. Exporte-le à nouveau comme carte de personnage, ou utilise le fichier .json.",
      rateLimited:
        "Trop d'imports. Attends {{seconds}} secondes puis réessaie.",
    },
    success: {
      title: "Personnage importé",
      description: "Ta copie est prête pour discuter.",
    },
    backButton: {
      label: "Retour",
    },
    submitButton: {
      label: "Importer la carte",
      loadingText: "Import en cours...",
    },
  },
};
