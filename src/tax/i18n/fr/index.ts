import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Taxes",
  endpointCategories: {
    tax: "Taxes",
    taxRates: "Taux de taxe",
    taxReports: "Rapports fiscaux",
  },

  rate: {
    create: {
      title: "Créer un taux de taxe",
      titleShort: "Créer un taux",
      description: "Ajouter un taux de taxe à votre entreprise",
      widget: {
        backToList: "Retour aux taux de taxe",
      },
      companyId: {
        label: "Entreprise",
        description: "L'entreprise à laquelle appartient ce taux",
        placeholder: "ID de l'entreprise",
      },
      name: {
        label: "Nom",
        description: "Nom descriptif du taux de taxe",
        placeholder: "ex. TVA 20 %",
      },
      code: {
        label: "Code",
        description: "Identifiant court de ce taux",
        placeholder: "ex. AT-VAT20",
      },
      type: {
        label: "Type de taxe",
        description: "La catégorie de taxe",
        placeholder: "Choisir un type de taxe",
      },
      rate: {
        label: "Taux",
        description: "Taux en décimal (0.2 = 20 %)",
        placeholder: "0.2000",
      },
      country: {
        label: "Pays",
        description: "Pays où ce taux s'applique (facultatif)",
        placeholder: "ex. AT",
      },
      region: {
        label: "Région",
        description: "Région ou État où ce taux s'applique (facultatif)",
        placeholder: "ex. Vienne",
      },
      isDefault: {
        label: "Taux par défaut",
        description: "Appliquer ce taux par défaut aux nouveaux articles",
      },
      response: {
        id: "ID du taux",
        code: "Code du taux",
        name: "Nom du taux",
      },
      success: {
        title: "Taux de taxe créé",
        description: "Le taux de taxe a été ajouté à votre entreprise",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez vos saisies et réessayez",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas le droit de gérer les taux de taxe",
        },
        notFound: {
          title: "Introuvable",
          description: "Entreprise introuvable",
        },
        conflict: {
          title: "Code en double",
          description: "Un taux de taxe avec ce code existe déjà",
        },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
    },
    list: {
      title: "Taux de taxe",
      titleShort: "Taux de taxe",
      description: "Tous les taux de taxe configurés pour votre entreprise",
      widget: {
        addRate: "Ajouter un taux",
        labelDefault: "Par défaut",
        labelActive: "Actif",
        labelInactive: "Inactif",
        labelEdit: "Modifier",
        labelDelete: "Supprimer",
        labelCompound: "Composé",
        empty:
          "Aucun taux de taxe configuré. Ajoutez votre premier taux pour commencer.",
        emptySetup:
          "Configurez les taux de taxe que votre entreprise applique sur ses factures.",
        columnRate: "Taux de taxe",
        columnTypeRateActions: "Type / Taux / Statut",
        backToCatalog: "← Produits",
      },
      companyId: {
        label: "Entreprise",
        description: "Entreprise dont lister les taux de taxe",
        placeholder: "ID de l'entreprise",
      },
      country: {
        label: "Filtre pays",
        description: "Filtrer par code pays (facultatif)",
        placeholder: "ex. AT",
      },
      type: {
        label: "Filtre type",
        description: "Filtrer par type de taxe (facultatif)",
        placeholder: "Choisir un type de taxe",
      },
      page: {
        label: "Page",
        description: "Numéro de page (commence à 1)",
      },
      pageSize: {
        label: "Par page",
        description: "Résultats par page (100 max.)",
      },
      response: {
        total: "Total",
        rates: "Taux de taxe",
        rate: {
          id: "ID",
          name: "Nom",
          code: "Code",
          type: "Type",
          rate: "Taux",
          country: "Pays",
          region: "Région",
          isDefault: "Par défaut",
          isActive: "Actif",
          isCompound: "Composé",
          createdAt: "Créé le",
          updatedAt: "Mis à jour le",
        },
      },
      success: {
        title: "Taux de taxe chargés",
        description: "Taux de taxe récupérés",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez vos saisies et réessayez",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas le droit de consulter les taux de taxe",
        },
        notFound: {
          title: "Introuvable",
          description: "Entreprise introuvable",
        },
        conflict: { title: "Conflit", description: "Un conflit est survenu" },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
    },
    update: {
      title: "Modifier un taux de taxe",
      titleShort: "Modifier le taux",
      description: "Modifier un taux de taxe existant",
      widget: {
        backToList: "Retour aux taux de taxe",
        failed: "Échec",
      },
      rateId: {
        label: "ID du taux",
        description: "L'ID du taux de taxe à modifier",
        placeholder: "UUID du taux",
      },
      name: {
        label: "Nom",
        description: "Nouveau nom du taux de taxe",
        placeholder: "ex. TVA 20 %",
      },
      rate: {
        label: "Taux",
        description: "Nouveau taux en décimal (0.2 = 20 %)",
        placeholder: "0.2000",
      },
      isDefault: {
        label: "Taux par défaut",
        description: "Appliquer ce taux par défaut aux nouveaux articles",
      },
      isActive: {
        label: "Actif",
        description: "Indique si ce taux est actuellement actif",
      },
      response: {
        updated: "Mis à jour",
      },
      success: {
        title: "Taux de taxe mis à jour",
        description: "Le taux de taxe a été mis à jour",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez vos saisies et réessayez",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas le droit de gérer les taux de taxe",
        },
        notFound: {
          title: "Introuvable",
          description: "Taux de taxe introuvable",
        },
        conflict: { title: "Conflit", description: "Un conflit est survenu" },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
    },
    delete: {
      title: "Supprimer un taux de taxe",
      titleShort: "Supprimer le taux",
      description: "Désactiver un taux de taxe",
      widget: {
        backToList: "Retour aux taux de taxe",
        warning:
          "Le taux de taxe sera désactivé. Cette action est irréversible.",
        confirmTitle: "Désactiver ce taux de taxe ?",
        confirmDescription:
          "Un taux désactivé ne peut plus être appliqué aux factures. Les lignes de facture existantes ne changent pas.",
        confirmButton: "Oui, désactiver",
        cancelButton: "Annuler",
      },
      rateId: {
        label: "ID du taux",
        description: "L'ID du taux de taxe à désactiver",
        placeholder: "UUID du taux",
      },
      response: {
        deleted: "Désactivé",
      },
      success: {
        title: "Taux de taxe désactivé",
        description: "Le taux de taxe a été désactivé",
      },
      errors: {
        validation: {
          title: "Erreur de validation",
          description: "Vérifiez vos saisies et réessayez",
        },
        unauthorized: {
          title: "Non autorisé",
          description: "Vous devez être connecté",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Vous n'avez pas le droit de gérer les taux de taxe",
        },
        notFound: {
          title: "Introuvable",
          description: "Taux de taxe introuvable",
        },
        conflict: { title: "Conflit", description: "Un conflit est survenu" },
        server: {
          title: "Erreur serveur",
          description: "Une erreur interne est survenue",
        },
        network: {
          title: "Erreur réseau",
          description: "Une erreur réseau est survenue",
        },
        unknown: {
          title: "Erreur inconnue",
          description: "Une erreur inattendue est survenue",
        },
        unsavedChanges: {
          title: "Modifications non enregistrées",
          description: "Vous avez des modifications non enregistrées",
        },
      },
    },
  },

  report: {
    title: "Taxes par taux",
    titleShort: "Taxes par taux",
    description:
      "Consultez les taxes enregistrées sur les factures de vente, les avoirs, les factures fournisseurs et les ventes en caisse.",
    widget: {
      scope:
        "Les factures de vente suivent la date de l’écriture liée ou leur date de création. Les achats suivent la date de la facture fournisseur. Les ventes en caisse suivent leur date de clôture (UTC), pour les lignes avec un taux positif ou un montant de taxe enregistré. Si une facture émise partage la même écriture, elle représente la vente.",
      empty: "Aucune ligne de document ne correspond à ces filtres.",
      range: "Du {{from}} au {{to}}",
      total: "Total",
      previousMonth: "Afficher le mois précédent",
      unknownRate: "Taux indéterminé",
      run: "Générer le rapport",
      running: "Génération du rapport…",
      selectCompany: "Sélectionnez l’entreprise concernée.",
    },
    currency: {
      label: "Devise",
      placeholder: "Devise de l’entreprise",
      description: "La devise de l’entreprise est utilisée par défaut.",
    },
    currencies: { EUR: "EUR", PLN: "PLN", USD: "USD" },
    companyId: {
      label: "Entreprise",
      description: "Entreprise pour laquelle générer le rapport fiscal",
      placeholder: "ID de l'entreprise",
    },
    dateFrom: {
      label: "Du",
      description: "Date de début de la période",
      placeholder: "Début du mois en cours",
    },
    dateTo: {
      label: "Au",
      description: "Date de fin de la période",
      placeholder: "Aujourd’hui",
    },
    response: {
      rows: "Lignes du rapport",
      row: {
        direction: "Type de document",
        rate: "Taux de taxe",
        taxableAmount: "Montant imposable",
        taxAmount: "Montant de la taxe",
      },
    },
    success: {
      title: "Rapport fiscal généré",
      description: "Rapport fiscal récupéré",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description:
          "La date de fin doit être égale ou postérieure à la date de début.",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté",
      },
      forbidden: {
        title: "Accès refusé",
        description:
          "Vous n'avez pas le droit de consulter les rapports fiscaux",
      },
      notFound: { title: "Introuvable", description: "Entreprise introuvable" },
      conflict: { title: "Conflit", description: "Un conflit est survenu" },
      server: {
        title: "Erreur serveur",
        description: "Une erreur interne est survenue",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau est survenue",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue est survenue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Vous avez des modifications non enregistrées",
      },
    },
  },

  enums: {
    reportDirection: {
      posSales: "Ventes en caisse",
      sales: "Factures de vente",
      creditNotes: "Avoirs clients",
      purchases: "Factures fournisseurs",
    },
    taxType: {
      vat: "TVA",
      gst: "GST",
      sales: "Taxe sur les ventes",
      withholding: "Retenue à la source",
      none: "Sans taxe / Exonéré",
    },
  },

  tags: {
    tax: "taxe",
    rate: "taux",
    create: "créer",
    list: "liste",
    update: "modifier",
    delete: "supprimer",
    report: "rapport",
  },
};
