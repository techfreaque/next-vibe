import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Prospection",
  tags: {
    outreach: "prospection",
    crm: "crm",
    deals: "accords",
    import: "import",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    contactStatus: {
      sent: "Envoyé",
      replied: "A répondu",
      interested: "Intéressé",
      deal: "Accord",
      declined: "A refusé",
      optOut: "Désinscrit",
      bounced: "Rebond",
    },
    contactKind: {
      creator: "Créateur",
      newsletter: "Newsletter",
      directory: "Annuaire",
      other: "Autre",
    },
    direction: {
      out: "Envoyé par nous",
      in: "Réponse de leur part",
    },
    dealStatus: {
      proposed: "Proposé",
      committed: "Engagé",
      paid: "Payé",
      canceled: "Annulé",
    },
    angleGroup: {
      affiliate: "A · Affiliation",
      audienceFit: "B · Adéquation audience",
      mission: "C · Liberté d'expression / vie privée",
      tryIt: "D · Essai / référencement",
      video: "Demande vidéo",
      infoFirst: "Tarifs d'abord",
      negotiation: "Négociation",
      other: "Autre",
    },
    attributionBasis: {
      tracked: "Lien suivi / code parrain",
      channel: "Tout le canal",
      none: "Non suivi",
    },
  },
  crm: {
    get: {
      title: "CRM de prospection",
      titleShort: "Prospection",
      description:
        "Chaque contact démarché, où il en est, et ce que les accords payants ont rapporté en inscriptions et en revenus.",
      fields: {
        status: {
          label: "Statut",
          description: "Uniquement les contacts avec ce statut",
        },
        kind: {
          label: "Type",
          description: "Créateur, newsletter, annuaire ou autre",
        },
        angle: {
          label: "Angle",
          description:
            "Préfixe de l'angle de pitch, ex. A, B-audience-fit, VIDEO",
          placeholder: "B-audience-fit",
        },
        search: {
          label: "Recherche",
          description: "Nom, e-mail, objet ou notes",
          placeholder: "Rechercher un nom, un e-mail, un objet…",
        },
        page: { label: "Page", description: "Numéro de page" },
        limit: { label: "Par page", description: "Contacts par page" },
      },
      response: {
        summary: "Résumé",
        angles: "Angles",
        contacts: "Contacts",
        deals: "Accords",
        dealTotals: "Totaux des accords",
      },
      widget: {
        title: "Prospection",
        subtitle:
          "Qui nous avons démarché, qui a répondu, ce que l'argent a rapporté.",
        refresh: "Actualiser",
        addContact: "Consigner un contact",
        addDeal: "Ajouter un accord",
        import: "Importer le journal",
        loading: "Chargement de la prospection…",
        allStatuses: "Tous",
        clearFilters: "Effacer les filtres",
        kpi: {
          contacts: "Contacts",
          replyRate: "Taux de réponse",
          replyRateHint: "{{replied}} sur {{total}} ont répondu",
          deals: "Accords payants",
          spent: "Dépensé",
          spentHint: "{{committed}} engagé, pas encore payé",
        },
        angles: {
          title: "Angles",
          hint: "Taux de réponse par angle de pitch. Misez sur ce qui obtient des réponses.",
          row: "{{contacts}} démarchés · {{replied}} réponses",
        },
        contacts: {
          title: "Contacts",
          columns: {
            contact: "Contact",
            status: "Statut",
            angle: "Angle",
            last: "Dernier contact",
            touches: "E-mails",
          },
          showing: "{{start}}–{{end}} sur {{total}}",
          never: "jamais",
          replied: "a répondu le {{date}}",
        },
        deals: {
          title: "Accords payants",
          hint: "Dépense face aux visites, inscriptions et revenus apportés par le lien suivi ou le code parrain de chaque accord.",
          columns: {
            deal: "Accord",
            status: "Statut",
            spend: "Dépense",
            visits: "Visites",
            signups: "Inscriptions",
            paying: "Payants",
            revenue: "Revenus",
            costPerSignup: "Coût / inscription",
          },
          live: "en ligne le {{date}}",
          basisChannel: "tout le canal, pas spécifique à l'accord",
          basisNone: "aucun lien, campagne ou code parrain à rapprocher",
          empty: {
            title: "Aucun accord payant",
            hint: "Consignez un accord dès qu'un créateur valide un prix. Joignez le lien suivi ou le code parrain pour que les résultats arrivent ici.",
          },
        },
        empty: {
          title: "Aucune prospection consignée",
          hint: "Importez le journal d'envoi, ou consignez chaque e-mail au moment de l'envoi.",
          cta: "Importer le journal d'envoi",
          filtered: "Aucun contact ne correspond à ces filtres",
        },
        text: {
          header:
            "{{total}} contacts · {{replied}} réponses ({{rate}}) · {{deals}} accords payants",
          statusLine: "Statut : {{counts}}",
          anglesTitle: "Angles (démarchés / réponses) :",
          contactsTitle: "Contacts {{start}}-{{end}} sur {{total}} :",
          dealsTitle: "Accords payants :",
          dealLine:
            "{{name}} · {{deliverable}} · {{amount}} {{status}} · visites {{visits}} · inscriptions {{signups}} · payants {{paying}} · revenus {{revenue}} · coût/inscription {{cps}}",
          pageHint:
            "Page {{page}}/{{pages}} : utilisez --page={{next}} pour la suite",
          noContacts: "Aucun contact correspondant.",
          noDeals: "Aucun accord payant consigné.",
        },
      },
    },
  },
  contact: {
    post: {
      title: "Consigner un contact de prospection",
      titleShort: "Consigner un contact",
      description:
        "Crée ou met à jour un contact par e-mail. Indiquez un objet pour consigner l'e-mail que vous venez d'envoyer (ou de recevoir).",
      fields: {
        email: {
          label: "E-mail",
          description: "E-mail du contact. Comparaison insensible à la casse",
          placeholder: "hello@creator.com",
        },
        name: {
          label: "Nom",
          description: "Créateur, média ou personne",
          placeholder: "AI Anytime (Sonu)",
        },
        kind: {
          label: "Type",
          description: "Créateur, newsletter, annuaire ou autre",
        },
        url: {
          label: "URL",
          description: "Chaîne, site ou page de la newsletter",
          placeholder: "https://youtube.com/@creator",
        },
        angle: {
          label: "Angle",
          description: "Angle de pitch, ex. A-affiliate, B-audience-fit",
          placeholder: "B-audience-fit",
        },
        status: {
          label: "Statut",
          description:
            "Avance uniquement (envoyé → a répondu → intéressé → accord). Les sorties s'appliquent toujours",
        },
        forceStatus: {
          label: "Forcer le statut",
          description: "Définit le statut exactement, même en arrière",
        },
        notes: {
          label: "Notes",
          description: "Remplace les notes du contact",
          placeholder: "Tarif 550 $ par intégration, 20-150K vues",
        },
        refCode: {
          label: "Code parrain",
          description: "Code de parrainage donné à ce contact",
          placeholder: "moemoe",
        },
        channel: {
          label: "Canal",
          description: "Clé du canal d'acquisition, ex. youtube, newsletter",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "ID du lien de campagne",
          description:
            "utm_id de leur lien suivi. Les ID inconnus sont ignorés",
        },
        subject: {
          label: "Objet de l'e-mail",
          description:
            "Renseignez-le pour consigner un échange pour cet e-mail",
          placeholder: "Vos spectateurs le veulent déjà",
        },
        direction: {
          label: "Sens",
          description: "Envoyé par nous (par défaut) ou réponse de leur part",
        },
        at: {
          label: "Envoyé le",
          description: "Date d'envoi de l'e-mail. Par défaut : maintenant",
        },
        touchNote: {
          label: "Note sur l'e-mail",
          description: "Ce que l'e-mail disait ou demandait",
          placeholder: "Demande de grille tarifaire",
        },
      },
      response: {
        id: "ID du contact",
        created: "Créé",
        status: "Statut",
        previousStatus: "Statut précédent",
        touchLogged: "E-mail consigné",
        contactCount: "E-mails envoyés",
        warning: "Avertissement",
      },
      widget: {
        back: "Retour",
        hint: "Un appel par e-mail envoyé. Le même e-mail met à jour le même contact.",
        touchSection: "Cet e-mail",
        contactSection: "Contact",
        submit: "Enregistrer le contact",
        warnOptOut: "Ce contact s'est désinscrit. Ne lui écrivez plus.",
        warnBounced:
          "Cette adresse a déjà rebondi. Vérifiez-la avant d'envoyer.",
        saved: "{{status}} · e-mails envoyés : {{count}}",
      },
    },
  },
  deal: {
    post: {
      title: "Enregistrer un accord de prospection",
      titleShort: "Enregistrer l'accord",
      description:
        "Crée un accord payant pour un contact, ou en met un à jour par ID. Joignez le lien de campagne, l'utm_campaign ou le code parrain pour le mesurer.",
      fields: {
        id: {
          label: "ID de l'accord",
          description: "Renseignez-le pour mettre à jour un accord existant",
        },
        contactEmail: {
          label: "E-mail du contact",
          description:
            "Obligatoire pour un nouvel accord. Crée le contact s'il est nouveau",
          placeholder: "youtube@creator.com",
        },
        contactName: {
          label: "Nom du contact",
          description: "Utilisé uniquement si le contact n'existe pas encore",
          placeholder: "MoeMoe",
        },
        deliverable: {
          label: "Livrable",
          description: "Ce que l'argent achète",
          placeholder: "Intégration YouTube",
        },
        amount: {
          label: "Montant",
          description: "Prix total, en unités de la devise",
        },
        currency: {
          label: "Devise",
          description: "Devise du montant",
        },
        status: {
          label: "Statut",
          description: "Proposé, engagé, payé ou annulé",
        },
        channel: {
          label: "Canal",
          description:
            "Clé du canal d'acquisition, la même que pour les dépenses par canal",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "ID du lien de campagne",
          description:
            "utm_id du lien suivi. Laissé vide si le lien n'est pas sur cette instance",
        },
        utmCampaign: {
          label: "utm_campaign",
          description: "Valeur de campagne du lien suivi",
          placeholder: "moemoe-2026-11-14",
        },
        refCode: {
          label: "Code parrain",
          description: "Code de parrainage partagé par le créateur",
          placeholder: "moemoe",
        },
        liveAt: {
          label: "Mise en ligne",
          description:
            "Date de publication. Les revenus comptent à partir d'ici",
        },
        paidAt: {
          label: "Payé le",
          description: "Par défaut : maintenant, quand le statut passe à payé",
        },
        notes: {
          label: "Notes",
          description: "Moyen de paiement, facture, conditions",
          placeholder: "Payoneer, réf. 1059964703",
        },
      },
      response: {
        id: "ID de l'accord",
        created: "Créé",
        status: "Statut",
        linkFound: "Lien de campagne trouvé",
      },
      widget: {
        back: "Retour",
        hint: "Un accord engagé ou payé fait passer le contact au statut Accord.",
        submit: "Enregistrer l'accord",
      },
    },
  },
  import: {
    post: {
      title: "Importer le journal de prospection",
      titleShort: "Importer le journal",
      description:
        "Analyse un journal d'envoi (lignes séparées par des tabulations ou tableaux markdown) en contacts et échanges. Relançable sans risque : les e-mails déjà enregistrés sont ignorés.",
      fields: {
        content: {
          label: "Contenu du journal",
          description:
            "Collez des lignes de sent-log ou des tableaux sent-log.md. Fonctionne sur les instances distantes",
          placeholder:
            "2026-11-10\tModelFit\tpartnerships@modelfit.io\tA-affiliate\tA recurring cut\tSENT",
        },
        filePaths: {
          label: "Fichiers serveur",
          description:
            "Chemins séparés par des virgules sous .tmp/ sur le serveur, ex. .tmp/outreach/sent-log",
          placeholder: ".tmp/outreach/sent-log.md,.tmp/outreach/sent-log",
        },
        ignoreEmails: {
          label: "E-mails ignorés",
          description:
            "Adresses séparées par des virgules qui ne relèvent pas de la prospection",
          placeholder: "max@example.com",
        },
        dryRun: {
          label: "Simulation",
          description: "Analyser et compter, ne rien écrire",
        },
      },
      response: {
        rowsParsed: "Lignes analysées",
        contactsCreated: "Contacts créés",
        contactsUpdated: "Contacts mis à jour",
        touchesAdded: "E-mails ajoutés",
        touchesDuplicate: "Déjà connus",
        statusChanges: "Changements de statut",
        skipped: "Lignes ignorées",
        skippedLines: "Détail des lignes ignorées",
      },
      widget: {
        back: "Retour",
        hint: "Collez le journal ou indiquez des fichiers serveur. Chaque e-mail n'est enregistré qu'une fois, quel que soit le nombre d'imports.",
        submit: "Importer",
        line: "{{source}}:{{line}} {{reason}}",
      },
    },
  },
  skip: {
    noEmail: "aucun e-mail valide",
    noDate: "aucune date valide",
    skippedStatus: "marqué SKIPPED",
    ignored: "adresse ignorée",
    columns: "trop peu de colonnes",
    unreadable: "fichier illisible",
    outsideTmp: "chemin hors de .tmp/",
  },
  errors: {
    validation: {
      title: "Saisie invalide",
      description: "Vérifiez les champs signalés",
    },
    unauthorized: {
      title: "Non connecté",
      description: "Connectez-vous en tant qu'administrateur",
    },
    forbidden: {
      title: "Réservé aux administrateurs",
      description: "Les outils de prospection exigent le rôle administrateur",
    },
    notFound: {
      title: "Introuvable",
      description: "Cette entrée n'existe pas",
    },
    conflict: {
      title: "Conflit",
      description: "L'entrée a changé entre-temps, rechargez et réessayez",
    },
    server: {
      title: "Erreur serveur",
      description: "Impossible de traiter la requête",
    },
    network: {
      title: "Erreur réseau",
      description: "La requête n'a pas atteint le serveur",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Enregistrez ou annulez d'abord vos modifications",
    },
    dealNotFound: "Aucun accord avec l'ID {{id}}",
    dealNeedsContact: "Un nouvel accord nécessite un e-mail de contact",
    dealNeedsFields: "Un nouvel accord nécessite un livrable et un montant",
    importEmpty:
      "Fournissez le contenu du journal ou au moins un fichier serveur",
  },
  success: {
    title: "Terminé",
    description: "Enregistré",
  },
};
