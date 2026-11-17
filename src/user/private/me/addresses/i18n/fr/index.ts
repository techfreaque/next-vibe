import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Adresses de l'utilisateur",
  tag: "adresses",

  list: {
    title: "Adresses de facturation",
    titleShort: "Mes adresses",
    description: "Lister vos adresses enregistrées",
    response: {
      addresses: "Adresses",
    },
    widget: {
      back: "Retour",
      addAddress: "Ajouter une adresse",
      edit: "Modifier",
      delete: "Supprimer",
      billing: "Facturation",
      delivery: "Livraison",
      empty: "Aucune adresse enregistrée",
      emptyHint: "Enregistrez-en une pour ne plus la saisir à chaque paiement.",
      emptyCta: "Ajouter votre première adresse",
      loading: "Chargement des adresses…",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: { title: "Accès interdit", description: "Accès refusé" },
      notFound: { title: "Introuvable", description: "Aucune adresse trouvée" },
      conflict: { title: "Conflit", description: "Conflit de données" },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      internal: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur",
        detail: "Impossible de charger vos adresses : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
    },
    success: { title: "Succès", description: "Adresses récupérées" },
  },

  create: {
    title: "Ajouter une adresse",
    titleShort: "Ajouter une adresse",
    description: "Enregistrer une nouvelle adresse sur votre compte",
    fields: {
      label: {
        label: "Libellé",
        description: "Nommez cette adresse (par ex. Domicile, Bureau)",
        placeholder: "Domicile",
      },
      fullName: {
        label: "Nom complet",
        description: "Nom du contact pour cette adresse",
        placeholder: "Marie Dupont",
      },
      company: {
        label: "Entreprise",
        description: "Nom de l'entreprise (facultatif)",
        placeholder: "Acme SAS",
      },
      phone: {
        label: "Téléphone",
        description: "Numéro de téléphone du contact",
        placeholder: "+33 6 12 34 56 78",
      },
      vatNumber: {
        label: "Numéro de TVA",
        description: "Numéro de TVA intracommunautaire",
        placeholder: "FR12345678901",
      },
      taxId: {
        label: "Identifiant fiscal",
        description: "Identifiant fiscal national",
        placeholder: "123-45-6789",
      },
      addressLine1: {
        label: "Adresse (ligne 1)",
        description: "Numéro et rue",
        placeholder: "12 rue de la Paix",
      },
      addressLine2: {
        label: "Adresse (ligne 2)",
        description: "Appartement, bâtiment, étage (facultatif)",
        placeholder: "Bâtiment B",
      },
      city: { label: "Ville", description: "Ville", placeholder: "Paris" },
      region: {
        label: "Région / État",
        description: "Région ou État (facultatif)",
        placeholder: "Île-de-France",
      },
      postalCode: {
        label: "Code postal",
        description: "Code postal",
        placeholder: "75002",
      },
      country: {
        label: "Pays",
        description: "Code pays ISO 3166-1 alpha-2",
        placeholder: "FR",
      },
      isDefaultBilling: {
        label: "Facturation par défaut",
        description: "Utiliser comme adresse de facturation par défaut",
      },
      isDefaultDelivery: {
        label: "Livraison par défaut",
        description: "Utiliser comme adresse de livraison par défaut",
      },
    },
    response: {
      id: "ID de l'adresse",
      label: "Libellé",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez les champs obligatoires",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Authentification requise",
      },
      forbidden: { title: "Accès interdit", description: "Accès refusé" },
      notFound: {
        title: "Introuvable",
        description: "Utilisateur introuvable",
      },
      conflict: { title: "Conflit", description: "Conflit de données" },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      internal: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur",
        detail: "Impossible d'enregistrer l'adresse : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
    },
    success: {
      title: "Adresse enregistrée",
      description: "Adresse ajoutée à votre compte",
    },
    widget: {
      saved: "Adresse enregistrée.",
      backToAddresses: "Retour aux adresses",
    },
  },
};
