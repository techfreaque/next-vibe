import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Parler à un humain",
  titleShort: "Nous contacter",
  description:
    "Quelque chose ne marche pas, ou vous voulez simplement parler à une vraie personne. Nous sommes là. Décrivez votre besoin : un membre de notre équipe le lira et vous répondra.",
  category: "Système",
  summary: "Traite les envois du formulaire de contact avec suivi des leads",
  tags: {
    contactForm: "Formulaire de contact",
    contactUs: "Nous contacter",
    contactSubmission: "Demande de contact",
    helpSupport: "Aide et support",
  },

  form: {
    label: "Nous contacter",
    description:
      "Une vraie personne lira votre message et vous répondra. Pas de bots, pas de détours.",
    fields: {
      name: {
        label: "Votre nom",
        description:
          "Nom complet de la personne qui envoie le formulaire. 2 caractères minimum.",
        placeholder: "Jean Dupont",
      },
      email: {
        label: "Adresse e-mail",
        description:
          "L'adresse à laquelle nous répondons. Laissez vide si vous êtes connecté : nous utiliserons l'e-mail de votre compte.",
        placeholder: "jean.dupont@exemple.fr",
      },
      company: {
        label: "Entreprise",
        description:
          "Nom de l'entreprise ou de l'organisation liée à la demande (facultatif).",
        placeholder: "Société Exemple",
      },
      subject: {
        label: "Objet",
        description:
          "Catégorie de la demande, utilisée pour transmettre le message à la bonne équipe.",
        placeholder: "Question générale sur nos services",
      },
      message: {
        label: "Message",
        description:
          "Texte complet de la demande. 10 caractères minimum. Soyez précis sur votre besoin.",
        placeholder: "Décrivez votre besoin en détail...",
      },
      priority: {
        label: "Priorité",
        description:
          "Niveau d'urgence de la demande. Les demandes hautes ou urgentes sont traitées plus vite.",
        placeholder: "Choisir un niveau de priorité",
      },
      leadId: {
        label: "ID du lead",
        description: "ID interne de suivi du lead (rempli automatiquement)",
        placeholder: "lead_123",
      },
    },
    submitButton: {
      label: "Envoyer le message",
      loadingText: "Envoi...",
    },
  },

  subject: {
    helpSupport: "Aide et support",
    generalInquiry: "Question générale",
    technicalSupport: "Support technique",
    accountQuestion: "Question sur le compte",
    billingQuestion: "Question de facturation",
    salesInquiry: "Demande commerciale",
    featureRequest: "Suggestion de fonctionnalité",
    bugReport: "Signaler un bug",
    feedback: "Avis",
    complaint: "Réclamation",
    partnership: "Partenariat",
    other: "Autre",
  },

  priority: {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
    urgent: "Urgente",
  },

  status: {
    new: "Nouveau",
    inProgress: "En cours",
    resolved: "Résolu",
    closed: "Clôturé",
  },

  response: {
    label: "Réponse à la demande de contact",
    description: "Suivi de votre demande de contact",
    success:
      "Merci de nous avoir écrit ! Votre message est bien arrivé, nous vous répondons rapidement.",
    messageId: "ID du message pour le suivi",
    status: "Statut actuel de la demande",
  },

  examples: {
    requests: {
      general: {
        title: "Demande de contact générale",
        description: "Exemple d'envoi du formulaire de contact",
      },
    },
    responses: {
      success: {
        title: "Envoi réussi",
        description: "Exemple de réponse après un envoi réussi",
      },
    },
  },

  errors: {
    createFailed: {
      title: "Échec de l'envoi",
      description:
        "Impossible de traiter votre formulaire pour le moment. Réessayez plus tard.",
    },
    repositoryCreateFailed:
      "Impossible de créer la demande de contact : {{error}}",
    repositoryCreateFailedForEmail:
      "Impossible de créer la demande de contact pour {{email}}",
    repositoryCreateFailedWithDetails:
      "Impossible de créer la demande de contact : {{error}}. {{details}}",
    repositoryCreateDetails:
      "Impossible de traiter votre formulaire pour le moment. Réessayez plus tard.",
    noContactReturned: "Aucun contact renvoyé après la création",
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez votre saisie et réessayez",
      nameMinLength: "Le nom doit contenir au moins 2 caractères",
      emailInvalid: "Saisissez une adresse e-mail valide",
      emailRequired:
        "Indiquez une adresse e-mail pour que nous puissions vous répondre",
      subjectRequired: "L'objet est obligatoire",
      messageMinLength: "Le message doit contenir au moins 10 caractères",
      priorityInvalid: "Choisissez un niveau de priorité valide",
      statusInvalid: "Statut invalide",
    },
    network: {
      title: "Erreur réseau",
      description: "Une erreur réseau est survenue pendant le traitement",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous n'êtes pas autorisé à effectuer cette action",
    },
    forbidden: {
      title: "Interdit",
      description: "Cette action est interdite",
    },
    notFound: {
      title: "Introuvable",
      description: "La ressource demandée est introuvable",
    },
    serverError: {
      title: "Erreur serveur",
      description: "Une erreur interne du serveur est survenue",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inconnue est survenue",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit est survenu pendant le traitement",
    },
    email_generation_failed: "Impossible de générer l'e-mail",
  },

  sms: {
    admin: {
      notification:
        "Nouvelle demande de contact : {name} ({email}) - {subject}",
      phone: {
        missing:
          "Aucun numéro de téléphone admin configuré pour les notifications de contact",
      },
      send: {
        start: "Envoi du SMS de notification admin pour la demande de contact",
        error: "Erreur lors de l'envoi du SMS de notification admin",
      },
    },
    confirmation: {
      message:
        "{name}, merci pour votre message ! Nous vous répondons rapidement.",
      phone: {
        missing:
          "Aucun numéro de téléphone disponible pour le SMS de confirmation",
      },
      send: {
        start: "Envoi du SMS de confirmation à l'auteur du formulaire",
        error: "Erreur lors de l'envoi du SMS de confirmation",
      },
    },
  },

  repository: {
    create: {
      start: "Début de l'envoi du formulaire de contact",
      success: "Formulaire de contact envoyé",
      error: "Erreur lors de la création de la demande de contact",
    },
    lead: {
      conversion: {
        start: "Début de la conversion du lead pour le contact",
        error: "Erreur lors de la conversion du lead pour le contact",
      },
      provided: "ID de lead fourni pour la demande de contact",
    },
    seed: {
      create: {
        start: "Début de la création du seed de contact",
        error: "Erreur lors de la création du seed de contact",
      },
    },
  },

  route: {
    sms: {
      admin: {
        failed: "Échec du SMS de notification admin pour la demande de contact",
      },
      confirmation: {
        failed: "Échec du SMS de confirmation pour la demande de contact",
      },
    },
  },

  seeds: {
    dev: {
      start: "Début des seeds de contact (environnement de développement)",
      submission: {
        created: "Demande de contact créée dans les seeds de développement",
        failed:
          "Impossible de créer la demande de contact dans les seeds de développement",
        error:
          "Erreur lors de la création de la demande de contact dans les seeds de développement",
      },
      complete: "Seeds de contact de développement terminés",
      error: "Erreur lors du seed des données de contact de développement",
    },
    test: {
      start: "Début des seeds de contact (environnement de test)",
      submission: {
        created: "Demande de contact créée dans les seeds de test",
        failed:
          "Impossible de créer la demande de contact dans les seeds de test",
      },
      error: "Erreur lors du seed des données de contact de test",
    },
    prod: {
      start: "Début des seeds de contact (environnement de production)",
      ready: "Environnement de production des contacts prêt",
      error: "Erreur lors du seed des données de contact de production",
    },
  },

  noEmail: {
    warning: {
      title: "Pas d'adresse de réponse",
      description:
        "Sans e-mail, nous pouvons lire votre message mais pas vous répondre. Envoyez quand même si cela vous convient.",
      addEmail: "Ajouter un e-mail",
      sendAnyway: "Envoyer quand même",
    },
  },

  success: {
    title: "Message envoyé",
    description:
      "Votre message est bien arrivé. Une vraie personne vous répondra.",
  },

  aiPrompt: {
    confirmBeforeSend:
      "Demandez toujours confirmation à l'utilisateur avant d'envoyer un formulaire de contact en son nom.",
    humanHelp:
      "Si l'utilisateur semble frustré, contrarié ou bloqué, proposez-lui spontanément de le mettre en relation avec un humain de notre équipe support via le formulaire de contact.",
    emailFallback:
      "Si l'utilisateur est connecté, son e-mail est déjà enregistré : il n'a pas besoin de le redonner.",
  },

  email: {
    // Legacy keys for existing email template compatibility
    partner: {
      greeting: "Bonjour",
      thankYou: "Merci de nous avoir contactés !",
      message: "Message",
      additionalInfo:
        "Nous avons bien reçu votre demande et vous répondons rapidement.",
      subject: "Envoi du formulaire de contact",
    },
    company: {
      contactDetails: "Coordonnées",
      name: "Nom",
      email: "E-mail",
      company: "Entreprise",
      contactSubject: "Objet",
      viewDetails: "Voir dans l'admin",
    },
    // User confirmation email
    user_confirmation: {
      title: "Votre message est bien arrivé !",
      subject: "Merci d'avoir contacté {{appName}}",
      previewText:
        "Nous avons bien reçu votre message et vous répondons rapidement.",
      greeting: "Bonjour {{name}},",
      thankYou: "Merci d'avoir écrit à {{appName}} !",
      confirmation:
        "Votre message est bien arrivé. Un humain lit chaque message, et nous répondons dès que possible.",
      yourMessage: "Votre message",
      subject_label: "Objet",
      message_label: "Message",
      whatHappensNext: "Et maintenant ?",
      step1: "Un humain lit votre demande",
      step2: "Nous vous répondons dès que possible",
      step3: "Nous trouvons ensemble une réponse à votre besoin",
      needUrgentHelp: "Besoin d'aide urgente ?",
      urgentHelpInfo:
        "Notre centre d'aide répond tout de suite à beaucoup de questions.",
      helpCenterButton: "Ouvrir le centre d'aide",
      signoff:
        "Merci d'avoir choisi {{appName}},\nL'équipe support {{appName}}",
      footer: "Ceci est une confirmation automatique de {{appName}}",
    },
    // Admin notification email
    admin_notification: {
      title: "Nouveau formulaire de contact",
      subject: "Nouveau contact : {{name}} - {{subject}}",
      previewText: "Nouvelle demande de contact de {{name}} ({{email}})",
      message: "Un nouveau formulaire de contact vient d'être envoyé.",
      contactDetails: "Coordonnées",
      name: "Nom",
      email: "E-mail",
      company: "Entreprise",
      subject_label: "Objet",
      priority: "Priorité",
      message_label: "Message",
      submittedAt: "Envoyé le",
      leadInfo: "Informations sur le lead",
      leadId: "ID du lead",
      status: "Statut",
      actionRequired: "Action requise",
      actionInfo: "Examinez cette demande et répondez-y dès que possible.",
      viewInAdmin: "Voir dans le panneau d'admin",
      replyToContact: "Répondre au contact",
      footer: "Ceci est une notification automatique de {{appName}}",
    },
  },

  error: {
    general: {
      internal_server_error: "Une erreur interne du serveur est survenue",
    },
  },

  emailTemplates: {
    contactForm: {
      meta: {
        name: "Notification du formulaire de contact",
        description:
          "E-mail envoyé à l'expéditeur et à l'équipe lors de l'envoi d'un formulaire de contact",
        category: "contact",
      },
      preview: {
        name: {
          label: "Nom de l'expéditeur",
          description: "Nom complet de la personne qui envoie le formulaire",
        },
        email: {
          label: "E-mail de l'expéditeur",
          description: "Adresse e-mail de la personne qui envoie le formulaire",
        },
        company: {
          label: "Nom de l'entreprise",
          description: "Nom de l'entreprise de l'expéditeur (facultatif)",
        },
        subject: {
          label: "Objet du message",
          description: "Ligne d'objet du message",
        },
        priority: {
          label: "Niveau de priorité",
          description: "Niveau d'urgence de la demande",
        },
        message: {
          label: "Corps du message",
          description: "Contenu principal du formulaire de contact",
        },
        isForCompany: {
          label: "Indicateur e-mail entreprise",
          description:
            "Indique si l'e-mail s'adresse à l'entreprise (admin) ou à l'expéditeur (confirmation)",
        },
        userId: {
          label: "ID utilisateur",
          description: "ID utilisateur pour le suivi (facultatif)",
        },
        leadId: {
          label: "ID du lead",
          description: "ID du lead pour le suivi CRM (facultatif)",
        },
      },
    },
    adminContact: {
      meta: {
        name: "Notification de contact admin",
        description:
          "E-mail interne envoyé aux admins à chaque nouveau formulaire de contact",
        category: "admin",
      },
      preview: {
        name: {
          label: "Nom de l'expéditeur",
        },
        email: {
          label: "E-mail de l'expéditeur",
        },
        subject: {
          label: "Objet du message",
        },
        priority: {
          label: "Niveau de priorité",
        },
        message: {
          label: "Corps du message",
        },
        company: {
          label: "Nom de l'entreprise",
        },
        userId: {
          label: "ID utilisateur",
        },
        leadId: {
          label: "ID du lead",
        },
      },
    },
  },
};
