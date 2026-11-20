import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Adresses de l'utilisateur",
  tag: "adresses",

  widget: {
    chooseAddress: "Choisir une adresse enregistrée",
    addressUnavailable: "Adresse indisponible",
    saveChanges: "Enregistrer les modifications",
    reviewDeletion: "Vérifier avant de supprimer",
    confirmDeletion: "Supprimer {{label}} de vos adresses enregistrées ?",
    cancel: "Annuler",
  },

  update: {
    title: "Modifier l'adresse",
    titleShort: "Modifier l'adresse",
    description: "Modifier une adresse enregistrée",
    fields: {
      addressId: {
        label: "ID de l'adresse",
        description: "Adresse à modifier",
      },
      label: {
        label: "Libellé",
        description: "Nommez cette adresse",
        placeholder: "Domicile",
      },
      fullName: {
        label: "Nom complet",
        description: "Nom du contact",
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
      updated: "Modifiée",
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
      forbidden: {
        title: "Accès interdit",
        description: "Cette adresse ne vous appartient pas",
      },
      notFound: { title: "Introuvable", description: "Adresse introuvable" },
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
        detail: "Impossible de modifier l'adresse : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
    },
    success: {
      title: "Adresse modifiée",
      description: "Adresse enregistrée",
    },
    widget: {
      updated: "Adresse modifiée.",
      backToAddresses: "Retour aux adresses",
    },
  },

  delete: {
    title: "Supprimer l'adresse",
    titleShort: "Supprimer l'adresse",
    description: "Retirer une adresse enregistrée de votre compte",
    fields: {
      addressId: {
        label: "ID de l'adresse",
        description: "Adresse à supprimer",
      },
    },
    response: {
      deleted: "Supprimée",
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
      forbidden: {
        title: "Accès interdit",
        description: "Cette adresse ne vous appartient pas",
      },
      notFound: { title: "Introuvable", description: "Adresse introuvable" },
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
        detail: "Impossible de supprimer l'adresse : {{error}}",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite",
      },
    },
    success: {
      title: "Adresse supprimée",
      description: "Adresse retirée de votre compte",
    },
    widget: {
      deleted: "Adresse supprimée.",
      backToAddresses: "Retour aux adresses",
    },
  },
};
