import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Google Sheets",
  titleShort: "Google Sheets",
  description:
    "Ajoutez automatiquement chaque nouveau lead comme ligne dans votre Google Sheet. Connectez votre compte Google, sans clé API.",
  connect: {
    label: "Connecter un compte Google",
    description:
      "Connectez-vous avec Google pour autoriser l'accès à vos feuilles de calcul",
  },
  connected: {
    label: "Connecté",
    description: "Votre compte Google est connecté",
  },
  spreadsheetId: {
    label: "Feuille de calcul",
    description: "Choisissez la feuille de calcul où ajouter les leads",
    placeholder: "Choisir une feuille de calcul…",
  },
  sheetTab: {
    label: "Onglet (facultatif)",
    description:
      "Nom de l'onglet dans la feuille de calcul. Laissez vide pour utiliser le premier onglet.",
    placeholder: "ex. Leads",
  },
  saveTag: "lead-magnet-google-sheets",
  saveTitle: "Enregistrer la configuration Google Sheets",
  saveDescription: "Connectez votre Google Sheet pour capturer des leads",
  saveSuccess: {
    title: "Connecté",
    description:
      "Les nouveaux leads apparaîtront en lignes dans votre feuille.",
  },
  oauthStart: {
    title: "Connecter Google Sheets",
    description:
      "Lancer le flux OAuth Google pour autoriser l'accès aux feuilles de calcul",
  },
  oauthCallback: {
    title: "Callback OAuth Google Sheets",
    description: "Gère l'échange du code OAuth après la redirection de Google",
  },
  sheetsList: {
    title: "Lister les feuilles de calcul",
    titleShort: "Feuilles de calcul",
    description:
      "Renvoie la liste des feuilles de calcul accessibles au compte Google connecté",
  },
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez votre saisie",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Connectez-vous pour continuer",
    },
    forbidden: { title: "Interdit", description: "Accès refusé" },
    notFound: { title: "Introuvable", description: "Ressource introuvable" },
    conflict: { title: "Conflit", description: "Un conflit est survenu" },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau est survenue",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    internal: {
      title: "Erreur serveur",
      description: "Une erreur interne est survenue",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue est survenue",
    },
    oauthFailed: "L'autorisation Google a échoué. Réessayez.",
    noRefreshToken:
      "Google n'a pas renvoyé de refresh token. Déconnectez puis reconnectez votre compte.",
    sheetsApiFailed:
      "Impossible de charger les feuilles de calcul. Vérifiez votre connexion Google.",
    appendFailed:
      "Impossible d'écrire dans la Google Sheet. Le jeton a peut-être expiré.",
  },
  response: {
    provider: "Fournisseur",
    isActive: "Actif",
    spreadsheetId: "ID de la feuille de calcul",
    sheetTab: "Onglet",
    sheets: "Feuilles de calcul",
    connected: "Connecté",
  },
  widget: {
    connectTitle: "Connecter Google Sheets",
    connectDescription:
      "Connectez-vous avec Google pour ajouter automatiquement chaque nouveau lead comme ligne dans votre feuille de calcul.",
    redirectNote:
      "Vous serez redirigé vers Google pour autoriser l'accès à vos feuilles de calcul.",
    reconnect: "Reconnecter",
    loading: "Chargement des feuilles de calcul…",
    noSheets: "Aucune feuille de calcul trouvée",
    refresh: "Actualiser la liste",
    selectRequired: "Choisissez une feuille de calcul",
    saveFailed: "Échec de l'enregistrement. Réessayez.",
    saving: "Enregistrement…",
  },
};
