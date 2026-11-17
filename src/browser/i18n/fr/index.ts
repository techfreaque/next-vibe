import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  click: {
    title: "Cliquer sur un élément",
    titleShort: "Cliquer",
    description:
      "Clique sur un élément via son UID issu d'un snapshot. Prenez d'abord un snapshot avec take-snapshot.",
    dynamicTitle: "Clic : {{uid}}",
    form: {
      label: "Cliquer sur un élément",
      description: "Cliquer sur un élément précis de la page",
      fields: {
        uid: {
          label: "UID de l'élément",
          description:
            "L'uid d'un élément de la page, issu du snapshot du contenu de la page",
          placeholder: "Saisissez l'UID de l'élément",
        },
        dblClick: {
          label: "Double-clic",
          description: "Mettez true pour un double-clic. Par défaut : false",
        },
      },
    },
    response: {
      success: "Clic effectué",
      result: "Résultat du clic",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite pendant le clic",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à effectuer des clics",
      },
      forbidden: {
        title: "Interdit",
        description: "Le clic est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "L'élément demandé est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant le clic",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite pendant le clic",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant le clic",
      },
    },
    success: {
      title: "Clic effectué",
      description: "L'élément a bien été cliqué",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      inputAutomation: "Automatisation des saisies",
    },
  },
  "close-page": {
    title: "Fermer la page",
    titleShort: "Fermer la page",
    description:
      "Ferme la page de la session en cours. La dernière page ouverte ne peut pas être fermée.",
    form: {
      label: "Fermer la page",
      description: "Fermer une page du navigateur via son index",
      fields: {
        pageIdx: {
          label: "Index de la page",
          description:
            "L'index de la page à fermer. Appelez list_pages pour lister les pages",
          placeholder: "Saisissez l'index de la page (ex. 0)",
        },
      },
    },
    response: {
      success: "Page fermée",
      result: "Résultat de la fermeture de la page",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la fermeture de la page",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à fermer des pages",
      },
      forbidden: {
        title: "Interdit",
        description: "La fermeture de la page est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La page demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la fermeture de la page",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la fermeture de la page",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit lors de la fermeture de la page",
      },
    },
    success: {
      title: "Page fermée",
      description: "La page a bien été fermée",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      navigationAutomation: "Automatisation de la navigation",
    },
  },
  drag: {
    title: "Glisser un élément",
    titleShort: "Glisser",
    description:
      "Glisse un élément sur un autre via leur UID. Récupérez les UID avec take-snapshot.",
    dynamicTitle: "Glisser : {{from}} → {{to}}",
    form: {
      label: "Glisser un élément",
      description: "Glisser un élément sur un autre élément",
      fields: {
        from_uid: {
          label: "UID de l'élément source",
          description: "L'uid de l'élément à glisser",
          placeholder: "Saisissez l'UID de l'élément source",
        },
        to_uid: {
          label: "UID de l'élément cible",
          description: "L'uid de l'élément sur lequel déposer",
          placeholder: "Saisissez l'UID de l'élément cible",
        },
      },
    },
    response: {
      success: "Glisser-déposer effectué",
      result: "Résultat du glisser-déposer",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite pendant le glisser-déposer",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à effectuer des glisser-déposer",
      },
      forbidden: {
        title: "Interdit",
        description: "Le glisser-déposer est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "L'élément demandé est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant le glisser-déposer",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite pendant le glisser-déposer",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant le glisser-déposer",
      },
    },
    success: {
      title: "Glisser-déposer effectué",
      description: "L'élément a bien été glissé",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      inputAutomation: "Automatisation des saisies",
    },
  },
  fill: {
    title: "Remplir",
    titleShort: "Remplir",
    description:
      "Saisit du texte dans un input/textarea ou sélectionne une option de liste déroulante via son UID. Récupérez les UID avec take-snapshot.",
    dynamicTitle: "Remplir : {{uid}}",
    form: {
      label: "Remplir un élément",
      description: "Saisir du texte dans un élément de formulaire",
      fields: {
        uid: {
          label: "UID de l'élément",
          description:
            "L'uid d'un élément de la page, issu du snapshot du contenu de la page",
          placeholder: "Saisissez l'UID de l'élément",
        },
        value: {
          label: "Valeur",
          description: "La valeur à saisir",
          placeholder: "Saisissez la valeur à remplir",
        },
      },
    },
    response: {
      success: "Remplissage effectué",
      result: "Résultat du remplissage",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite pendant le remplissage",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à remplir des champs",
      },
      forbidden: {
        title: "Interdit",
        description: "Le remplissage est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant le remplissage",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite pendant le remplissage",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant le remplissage",
      },
    },
    success: {
      title: "Remplissage effectué",
      description: "L'élément a bien été rempli",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      inputAutomation: "Automatisation des saisies",
    },
  },
  "fill-form": {
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      inputAutomation: "Automatisation des saisies",
    },
    title: "Remplir un formulaire",
    titleShort: "Remplir formulaire",
    description:
      "Remplit plusieurs champs de formulaire en une fois via un tableau d'UID. Plus efficace que des appels fill un par un.",
    form: {
      label: "Remplir les éléments du formulaire",
      description: "Remplir plusieurs éléments de formulaire simultanément",
      fields: {
        elements: {
          label: "Éléments du formulaire",
          description: "Tableau d'éléments du snapshot à remplir",
          placeholder: "Saisissez les éléments du formulaire (tableau JSON)",
          uid: {
            label: "UID de l'élément",
            description: "L'identifiant unique de l'élément à remplir",
          },
          value: {
            label: "Valeur",
            description: "La valeur à saisir dans l'élément",
          },
        },
      },
    },
    response: {
      success: "Formulaire rempli",
      result: {
        title: "Résultat",
        description: "Résultat du remplissage du formulaire",
        filled: "Tout est rempli",
        filledCount: "Nombre de champs remplis",
        elements: {
          uid: "UID de l'élément",
          filled: "Rempli avec succès",
        },
      },
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite pendant le remplissage du formulaire",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à remplir des formulaires",
      },
      forbidden: {
        title: "Interdit",
        description: "Le remplissage du formulaire est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant le remplissage du formulaire",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite pendant le remplissage du formulaire",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit pendant le remplissage du formulaire",
      },
    },
    success: {
      title: "Formulaire rempli",
      description: "Tous les éléments du formulaire ont bien été remplis",
    },
  },
  "handle-dialog": {
    title: "Gérer la boîte de dialogue",
    titleShort: "Dialogue",
    description:
      "Accepte ou ferme une boîte de dialogue du navigateur (alert/confirm/prompt). Appelez cet outil avant l'action qui la déclenche.",
    dynamicTitle: "Dialogue : {{action}}",
    form: {
      label: "Gérer une boîte de dialogue du navigateur",
      description: "Accepter ou fermer une boîte de dialogue du navigateur",
      fields: {
        action: {
          label: "Action",
          description: "Fermer ou accepter la boîte de dialogue",
          placeholder: "Sélectionnez une action",
          options: {
            accept: "Accepter",
            dismiss: "Fermer",
          },
        },
        promptText: {
          label: "Texte de saisie",
          description: "Texte facultatif à saisir dans la boîte de dialogue",
          placeholder: "Saisissez le texte (facultatif)",
        },
      },
    },
    response: {
      success: "Boîte de dialogue gérée",
      result: "Résultat de la gestion de la boîte de dialogue",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite pendant la gestion de la boîte de dialogue",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à gérer des boîtes de dialogue",
      },
      forbidden: {
        title: "Interdit",
        description: "La gestion des boîtes de dialogue est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant la gestion de la boîte de dialogue",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite pendant la gestion de la boîte de dialogue",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit pendant la gestion de la boîte de dialogue",
      },
    },
    success: {
      title: "Boîte de dialogue gérée",
      description: "La boîte de dialogue du navigateur a bien été gérée",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      dialogAutomation: "Automatisation des boîtes de dialogue",
    },
  },
  hover: {
    title: "Survoler",
    titleShort: "Survoler",
    description:
      "Survole un élément via son UID pour déclencher une infobulle ou afficher des contrôles masqués.",
    dynamicTitle: "Survol : {{uid}}",
    form: {
      label: "Survoler un élément",
      description: "Placer le curseur de la souris sur un élément",
      fields: {
        uid: {
          label: "UID de l'élément",
          description:
            "L'uid d'un élément de la page, issu du snapshot du contenu de la page",
          placeholder: "Saisissez l'UID de l'élément",
        },
      },
    },
    response: {
      success: "Survol effectué",
      result: "Résultat du survol",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite pendant le survol",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à effectuer des survols",
      },
      forbidden: {
        title: "Interdit",
        description: "Le survol est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant le survol",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite pendant le survol",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant le survol",
      },
    },
    success: {
      title: "Survol effectué",
      description: "L'élément a bien été survolé",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      inputAutomation: "Automatisation des saisies",
    },
  },
  "press-key": {
    title: "Appuyer sur une touche",
    titleShort: "Touche",
    dynamicTitle: "Touche : {{key}}",
    description: "Appuie sur une touche ou une combinaison de touches",
    form: {
      label: "Appuyer sur une touche",
      description: "Appuyer sur une touche ou une combinaison de touches",
      fields: {
        key: {
          label: "Touche",
          description:
            "Une touche ou une combinaison (ex. Enter, Control+A, Control+Shift+R)",
          placeholder: "Saisissez une touche ou une combinaison",
        },
      },
    },
    response: {
      success: "Touche pressée",
      result: "Résultat de l'appui sur la touche",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de l'appui sur la touche",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à simuler des appuis sur des touches",
      },
      forbidden: {
        title: "Interdit",
        description: "L'appui sur des touches est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de l'appui sur la touche",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de l'appui sur la touche",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit lors de l'appui sur la touche",
      },
    },
    success: {
      title: "Touche pressée",
      description: "La touche a bien été pressée",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      inputAutomation: "Automatisation des saisies",
    },
  },
  "upload-file": {
    title: "Téléverser un fichier",
    titleShort: "Téléverser",
    dynamicTitle: "Téléversement : {{file}}",
    description: "Téléverse un fichier via l'élément indiqué",
    form: {
      label: "Téléverser un fichier",
      description: "Téléverser un fichier dans un champ de type fichier",
      fields: {
        uid: {
          label: "UID de l'élément",
          description:
            "L'uid du champ de type fichier ou d'un élément qui ouvre le sélecteur de fichiers",
          placeholder: "Saisissez l'UID de l'élément",
        },
        filePaths: {
          label: "Chemins des fichiers",
          description:
            "Chemin absolu du fichier à téléverser, ou plusieurs pour un champ multi-fichiers. Doit se trouver dans le répertoire du projet ou dans le répertoire temporaire du système.",
          placeholder: "/tmp/photo.png",
        },
        includeSnapshot: {
          label: "Inclure un snapshot",
          description: "Renvoyer un snapshot de la page après le téléversement",
        },
      },
    },
    response: {
      success: "Fichier téléversé",
      result: "Résultat du téléversement",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite pendant le téléversement du fichier",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à téléverser des fichiers",
      },
      forbidden: {
        title: "Interdit",
        description: "Le téléversement de fichiers est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant le téléversement du fichier",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite pendant le téléversement du fichier",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit pendant le téléversement du fichier",
      },
    },
    success: {
      title: "Fichier téléversé",
      description: "Le fichier a bien été téléversé",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      inputAutomation: "Automatisation des saisies",
    },
  },
  "list-pages": {
    title: "Lister les pages",
    titleShort: "Pages",
    description:
      "Liste toutes les pages ouvertes du navigateur avec leur URL. Chaque session appelante possède un onglet ; new-page le remplace.",
    form: {
      label: "Lister les pages",
      description: "Obtenir toutes les pages ouvertes du navigateur",
      fields: {},
    },
    response: {
      success: "Pages listées",
      result: {
        title: "Résultat",
        description: "Résultat de la liste des pages",
        pages: {
          idx: "Index",
          title: "Titre",
          url: "URL",
          active: "Active",
        },
        totalCount: "Total",
      },
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la liste des pages",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à lister les pages",
      },
      forbidden: {
        title: "Interdit",
        description: "La liste des pages est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la liste des pages",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la liste des pages",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit lors de la liste des pages",
      },
    },
    success: {
      title: "Pages listées",
      description: "Les pages ouvertes ont bien été listées",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      navigationAutomation: "Automatisation de la navigation",
    },
  },
  "navigate-page": {
    title: "Naviguer sur la page",
    titleShort: "Naviguer",
    dynamicTitle: "Navigation : {{target}}",
    description:
      "Navigue la page de la session vers une URL, en arrière, en avant ou la recharge. Préférez cet outil à new-page pour naviguer dans le même onglet.",
    form: {
      label: "Naviguer sur la page",
      description:
        "Naviguer la page sélectionnée vers une URL ou dans l'historique",
      fields: {
        type: {
          label: "Type de navigation",
          description:
            "Naviguer par URL, en arrière ou en avant dans l'historique, ou recharger",
          placeholder: "Sélectionnez le type de navigation",
          options: {
            url: "URL",
            back: "Précédent",
            forward: "Suivant",
            reload: "Recharger",
          },
        },
        url: {
          label: "URL",
          description: "URL cible (uniquement pour type=url)",
          placeholder: "Saisissez l'URL",
        },
        ignoreCache: {
          label: "Ignorer le cache",
          description: "Ignorer ou non le cache lors du rechargement",
          placeholder: "Ignorer le cache",
        },
        timeout: {
          label: "Délai d'attente",
          description:
            "Temps d'attente maximal en millisecondes (0 pour la valeur par défaut)",
          placeholder: "Saisissez le délai d'attente",
        },
      },
    },
    response: {
      success: "Navigation réussie",
      result: "Résultat de la navigation",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite pendant la navigation",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à naviguer sur des pages",
      },
      forbidden: {
        title: "Interdit",
        description: "La navigation sur la page est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant la navigation",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite pendant la navigation",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant la navigation",
      },
    },
    success: {
      title: "Navigation réussie",
      description: "La navigation sur la page a réussi",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      navigationAutomation: "Automatisation de la navigation",
    },
  },
  "new-page": {
    title: "Nouvelle page",
    titleShort: "Nouvelle page",
    dynamicTitle: "Nouvelle page : {{url}}",
    description:
      "Ouvre un nouvel onglet du navigateur sur une URL. La session adopte ce nouvel onglet : tous les appels suivants s'y appliquent.",
    form: {
      label: "Nouvelle page",
      description: "Créer une nouvelle page du navigateur et charger une URL",
      fields: {
        url: {
          label: "URL",
          description: "URL à charger dans la nouvelle page",
          placeholder: "Saisissez l'URL",
        },
        replacePage: {
          label: "Remplacer la page",
          description: "Fermer les pages existantes avant d'ouvrir la nouvelle",
        },
        background: {
          label: "Arrière-plan",
          description: "Ouvrir la page sans la mettre au premier plan",
        },
        timeout: {
          label: "Délai d'attente",
          description:
            "Temps d'attente maximal en millisecondes (0 pour la valeur par défaut)",
          placeholder: "Saisissez le délai d'attente",
        },
      },
    },
    response: {
      success: "Nouvelle page créée",
      result: "Résultat de la création de la nouvelle page",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la création de la nouvelle page",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à créer de nouvelles pages",
      },
      forbidden: {
        title: "Interdit",
        description: "La création de nouvelles pages est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la création de la nouvelle page",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la création de la nouvelle page",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors de la création de la nouvelle page",
      },
    },
    success: {
      title: "Nouvelle page créée",
      description: "La nouvelle page a bien été créée",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      navigationAutomation: "Automatisation de la navigation",
    },
  },
  "select-page": {
    title: "Sélectionner une page",
    titleShort: "Sélectionner",
    dynamicTitle: "Sélection : {{page}}",
    description:
      "Bascule la session sur une page précise via son index. Utilisez list-pages pour trouver l'index. Ne met pas à jour l'onglet suivi par la session.",
    form: {
      label: "Sélectionner une page",
      description: "Sélectionner une page via son index",
      fields: {
        pageIdx: {
          label: "Index de la page",
          description:
            "L'index de la page à sélectionner (appelez list_pages pour lister les pages)",
          placeholder: "Saisissez l'index de la page",
        },
      },
    },
    response: {
      success: "Page sélectionnée",
      result: "Résultat de la sélection de la page",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la sélection de la page",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à sélectionner des pages",
      },
      forbidden: {
        title: "Interdit",
        description: "La sélection de pages est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la sélection de la page",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la sélection de la page",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit lors de la sélection de la page",
      },
    },
    success: {
      title: "Page sélectionnée",
      description: "La page a bien été sélectionnée",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      navigationAutomation: "Automatisation de la navigation",
    },
  },
  emulate: {
    title: "Émuler",
    titleShort: "Émuler",
    description:
      "Émule des conditions réseau (hors ligne/3G/4G) ou un ralentissement du CPU sur la page en cours. Chaque appel est absolu : les champs omis sont réinitialisés. Un user agent personnalisé s'applique à partir de la navigation suivante, rechargez donc la page après l'avoir défini.",
    dynamicTitle: "Émulation : {{config}}",
    form: {
      label: "Émuler un appareil",
      description: "Émuler des conditions réseau et un ralentissement du CPU",
      fields: {
        networkConditions: {
          label: "Conditions réseau",
          description:
            "Brider le réseau (choisissez Aucune émulation pour désactiver)",
          placeholder: "Sélectionnez une condition réseau",
          options: {
            noEmulation: "Aucune émulation",
            offline: "Hors ligne",
            slow3g: "3G lente",
            fast3g: "3G rapide",
            slow4g: "4G lente",
            fast4g: "4G rapide",
          },
        },
        cpuThrottlingRate: {
          label: "Facteur de ralentissement CPU",
          description:
            "Facteur de ralentissement du CPU (1 pour désactiver, de 1 à 20)",
          placeholder: "Saisissez le facteur de ralentissement",
        },
      },
    },
    response: {
      success: "Émulation réussie",
      result: "Résultat de l'émulation",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite pendant l'émulation",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à émuler des fonctionnalités d'appareil",
      },
      forbidden: {
        title: "Interdit",
        description: "L'émulation d'appareil est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant l'émulation",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite pendant l'émulation",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant l'émulation",
      },
    },
    success: {
      title: "Émulation réussie",
      description: "Les fonctionnalités de l'appareil ont bien été émulées",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      performanceAutomation: "Automatisation des performances",
    },
  },
  "resize-page": {
    title: "Redimensionner la page",
    titleShort: "Redimensionner",
    dynamicTitle: "Redimensionner : {{width}}x{{height}}",
    description:
      "Redimensionne la zone d'affichage du navigateur à des dimensions précises en pixels.",
    form: {
      label: "Redimensionner la page",
      description: "Redimensionner la page aux dimensions indiquées",
      fields: {
        width: {
          label: "Largeur",
          description: "Largeur de la page en pixels",
          placeholder: "Saisissez la largeur",
        },
        height: {
          label: "Hauteur",
          description: "Hauteur de la page en pixels",
          placeholder: "Saisissez la hauteur",
        },
      },
    },
    response: {
      success: "Page redimensionnée",
      result: "Résultat du redimensionnement de la page",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors du redimensionnement de la page",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à redimensionner des pages",
      },
      forbidden: {
        title: "Interdit",
        description: "Le redimensionnement de la page est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors du redimensionnement de la page",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors du redimensionnement de la page",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors du redimensionnement de la page",
      },
    },
    success: {
      title: "Page redimensionnée",
      description: "La page a bien été redimensionnée",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      viewportAutomation: "Automatisation de la zone d'affichage",
    },
  },
  "evaluate-script": {
    title: "Évaluer un script",
    titleShort: "Évaluer script",
    description:
      "Exécute du JavaScript dans la page et renvoie le résultat. À utiliser pour lire un état que take-snapshot n'expose pas.",
    dynamicTitle: "Script : {{snippet}}",
    form: {
      label: "Évaluer un script",
      description: "Exécuter du JavaScript dans la page du navigateur",
      fields: {
        function: {
          label: "Fonction",
          description: "Déclaration de fonction JavaScript à exécuter",
          placeholder: "() => { return document.title; }",
        },
        args: {
          label: "Arguments",
          description:
            "Liste facultative d'arguments (UID d'éléments) à passer à la fonction",
          placeholder: '[{"uid": "element-uid"}]',
          uid: {
            label: "UID de l'élément",
            description: "L'identifiant unique d'un élément de la page",
          },
        },
      },
    },
    response: {
      success: "Script évalué",
      result: {
        title: "Résultat",
        description: "Résultat de l'évaluation du script",
        executed: "Exécuté",
        result: "Valeur de retour",
      },
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite pendant l'évaluation du script",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à évaluer des scripts",
      },
      forbidden: {
        title: "Interdit",
        description: "L'évaluation de scripts est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant l'évaluation du script",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite pendant l'évaluation du script",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant l'évaluation du script",
      },
    },
    success: {
      title: "Script évalué",
      description: "Le JavaScript a bien été exécuté",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      scriptExecution: "Exécution de scripts",
    },
  },
  "get-console-message": {
    title: "Obtenir un message de console",
    titleShort: "Msg console",
    description:
      "Obtient le contenu complet d'un message de console précis via son msgid issu de list-console-messages.",
    dynamicTitle: "Console n° {{id}}",
    form: {
      label: "Obtenir un message de console",
      description: "Récupérer un message de console précis",
      fields: {
        msgid: {
          label: "ID du message",
          description:
            "Le msgid d'un message de console issu de la liste des messages de console",
          placeholder: "Saisissez l'ID du message",
        },
      },
    },
    response: {
      success: "Message de console récupéré",
      result: "Résultat de la récupération du message de console",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la récupération du message de console",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à récupérer des messages de console",
      },
      forbidden: {
        title: "Interdit",
        description: "La récupération des messages de console est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la récupération du message de console",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la récupération du message de console",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors de la récupération du message de console",
      },
    },
    success: {
      title: "Message de console récupéré",
      description: "Le message de console a bien été récupéré",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      debugging: "Débogage",
    },
  },
  "list-console-messages": {
    title: "Lister les messages de console",
    titleShort: "Journal console",
    description:
      "Liste les messages de console depuis la dernière navigation. Filtrez par type (error/warn/log). À utiliser après des actions pour repérer les erreurs JS.",
    form: {
      label: "Lister les messages de console",
      description:
        "Obtenir tous les messages de console de la page du navigateur",
      fields: {
        includePreservedMessages: {
          label: "Inclure les messages conservés",
          description:
            "Mettez true pour renvoyer les messages conservés sur les 3 dernières navigations",
          placeholder: "false",
        },
        pageIdx: {
          label: "Index de page",
          description:
            "Numéro de la page de résultats à renvoyer (à partir de 0, omettez-le pour la première page)",
          placeholder: "Saisissez l'index de page",
        },
        pageSize: {
          label: "Taille de page",
          description:
            "Nombre maximal de messages à renvoyer (omettez-le pour renvoyer tous les messages)",
          placeholder: "Saisissez la taille de page",
        },
        types: {
          label: "Types de messages",
          description:
            "Ne renvoyer que les messages des types indiqués (omettez-le pour tout renvoyer)",
          placeholder: "Sélectionnez les types de messages",
          options: {
            log: "Log",
            debug: "Debug",
            info: "Info",
            error: "Erreur",
            warn: "Avertissement",
            dir: "Dir",
            dirxml: "Dirxml",
            table: "Tableau",
            trace: "Trace",
            clear: "Effacement",
            startGroup: "Début de groupe",
            startGroupCollapsed: "Début de groupe replié",
            endGroup: "Fin de groupe",
            assert: "Assertion",
            profile: "Profil",
            profileEnd: "Fin de profil",
            count: "Compteur",
            timeEnd: "Fin du chrono",
            verbose: "Détaillé",
            issue: "Problème",
          },
        },
      },
    },
    response: {
      success: "Messages de console récupérés",
      result: {
        title: "Résultat",
        description: "Résultat de la liste des messages de console",
        messages: {
          msgid: "ID du message",
          type: "Type",
          text: "Message",
          timestamp: "Horodatage",
        },
        totalCount: "Total",
      },
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la liste des messages de console",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à lister les messages de console",
      },
      forbidden: {
        title: "Interdit",
        description: "La liste des messages de console est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la liste des messages de console",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la liste des messages de console",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors de la liste des messages de console",
      },
    },
    success: {
      title: "Messages de console récupérés",
      description: "Les messages de console ont bien été récupérés",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      debugging: "Débogage",
    },
  },
  "get-network-request": {
    title: "Obtenir une requête réseau",
    titleShort: "Requête réseau",
    description:
      "Obtient tous les détails (en-têtes, corps) d'une requête via son reqid issu de list-network-requests.",
    dynamicTitle: "Réseau n° {{id}}",
    form: {
      label: "Obtenir une requête réseau",
      description:
        "Obtenir une requête réseau précise ou celle actuellement sélectionnée",
      fields: {
        reqid: {
          label: "ID de la requête",
          description:
            "Le reqid de la requête réseau (omettez-le pour obtenir la requête sélectionnée dans les DevTools)",
          placeholder: "Saisissez l'ID de la requête",
        },
        maxBodyLength: {
          label: "Longueur maximale du corps",
          description:
            "Nombre maximal de caractères renvoyés pour les corps de requête/réponse inline. Les corps plus longs sont tronqués avec un avertissement. Omettez-le pour ne pas limiter.",
          placeholder: "ex. 10000",
        },
      },
    },
    response: {
      success: "Requête réseau récupérée",
      result: "Résultat de la récupération de la requête réseau",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la récupération de la requête réseau",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à obtenir des requêtes réseau",
      },
      forbidden: {
        title: "Interdit",
        description: "L'obtention des requêtes réseau est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la récupération de la requête réseau",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la récupération de la requête réseau",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors de la récupération de la requête réseau",
      },
    },
    success: {
      title: "Requête réseau récupérée",
      description: "La requête réseau a bien été récupérée",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      networkAnalysis: "Analyse réseau",
    },
  },
  "list-network-requests": {
    title: "Lister les requêtes réseau",
    titleShort: "Journal réseau",
    description:
      "Liste les requêtes réseau depuis la dernière navigation. Filtrez par type de ressource (fetch/xhr/doc). À utiliser pour inspecter les appels d'API.",
    form: {
      label: "Lister les requêtes réseau",
      description:
        "Obtenir toutes les requêtes réseau de la page du navigateur",
      fields: {
        includePreservedRequests: {
          label: "Inclure les requêtes conservées",
          description:
            "Mettez true pour renvoyer les requêtes conservées sur les 3 dernières navigations",
          placeholder: "false",
        },
        pageIdx: {
          label: "Index de page",
          description:
            "Numéro de la page de résultats à renvoyer (à partir de 0, omettez-le pour la première page)",
          placeholder: "Saisissez l'index de page",
        },
        pageSize: {
          label: "Taille de page",
          description:
            "Nombre maximal de requêtes à renvoyer (omettez-le pour renvoyer toutes les requêtes)",
          placeholder: "Saisissez la taille de page",
        },
        resourceTypes: {
          label: "Types de ressources",
          description:
            "Ne renvoyer que les requêtes des types de ressources indiqués (omettez-le pour tout renvoyer)",
          placeholder: "Sélectionnez les types de ressources",
          options: {
            document: "Document",
            stylesheet: "Feuille de style",
            image: "Image",
            media: "Média",
            font: "Police",
            script: "Script",
            texttrack: "Piste de texte",
            xhr: "XHR",
            fetch: "Fetch",
            prefetch: "Prefetch",
            eventsource: "Event Source",
            websocket: "WebSocket",
            manifest: "Manifeste",
            signedexchange: "Signed Exchange",
            ping: "Ping",
            cspviolationreport: "Rapport de violation CSP",
            preflight: "Preflight",
            fedcm: "FedCM",
            other: "Autre",
          },
        },
      },
    },
    response: {
      success: "Requêtes réseau récupérées",
      result: {
        title: "Résultat",
        description: "Résultat de la liste des requêtes réseau",
        requests: {
          reqid: "ID de la requête",
          url: "URL",
          method: "Méthode",
          status: "Statut",
          type: "Type",
        },
        totalCount: "Total",
      },
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la liste des requêtes réseau",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à lister les requêtes réseau",
      },
      forbidden: {
        title: "Interdit",
        description: "La liste des requêtes réseau est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la liste des requêtes réseau",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la liste des requêtes réseau",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors de la liste des requêtes réseau",
      },
    },
    success: {
      title: "Requêtes réseau récupérées",
      description: "Les requêtes réseau ont bien été récupérées",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      networkAnalysis: "Analyse réseau",
    },
  },
  "performance-analyze-insight": {
    title: "Analyser un insight de performance",
    titleShort: "Insight perf",
    description:
      "Examine en détail un insight précis d'un résultat de trace (ex. DocumentLatency, LCPBreakdown). À appeler après performance-stop-trace.",
    form: {
      label: "Analyser un insight de performance",
      description:
        "Obtenir des informations détaillées sur un insight de performance précis",
      fields: {
        insightSetId: {
          label: "ID du groupe d'insights",
          description:
            "L'id du groupe d'insights visé (n'utilisez que les ids fournis dans la liste Available insight sets)",
          placeholder: "Saisissez l'ID du groupe d'insights",
        },
        insightName: {
          label: "Nom de l'insight",
          description:
            "Le nom de l'insight sur lequel vous voulez plus d'informations (ex. DocumentLatency ou LCPBreakdown)",
          placeholder: "Saisissez le nom de l'insight",
        },
      },
    },
    response: {
      success: "Insight de performance analysé",
      result: "Résultat de l'analyse de l'insight de performance",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de l'analyse de l'insight de performance",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à analyser des insights de performance",
      },
      forbidden: {
        title: "Interdit",
        description: "L'analyse des insights de performance est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de l'analyse de l'insight de performance",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de l'analyse de l'insight de performance",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors de l'analyse de l'insight de performance",
      },
    },
    success: {
      title: "Insight de performance analysé",
      description: "L'insight de performance a bien été analysé",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      performanceAutomation: "Automatisation des performances",
    },
  },
  "performance-start-trace": {
    title: "Démarrer une trace de performance",
    titleShort: "Démarrer trace",
    description:
      "Démarre une trace de performance pour capturer les Core Web Vitals et les métriques de chargement. Enchaînez avec performance-stop-trace.",
    form: {
      label: "Démarrer une trace de performance",
      description:
        "Commencer l'enregistrement des métriques de performance de la page",
      fields: {
        reload: {
          label: "Recharger la page",
          description:
            "Indique si la page doit être rechargée automatiquement une fois la trace démarrée",
          placeholder: "true",
        },
        autoStop: {
          label: "Arrêt automatique",
          description:
            "Indique si l'enregistrement de la trace doit s'arrêter automatiquement",
          placeholder: "true",
        },
      },
    },
    response: {
      success: "Trace de performance démarrée",
      result: "Résultat du démarrage de la trace de performance",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors du démarrage de la trace de performance",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à démarrer des traces de performance",
      },
      forbidden: {
        title: "Interdit",
        description: "Le démarrage de traces de performance est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors du démarrage de la trace de performance",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors du démarrage de la trace de performance",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors du démarrage de la trace de performance",
      },
    },
    success: {
      title: "Trace de performance démarrée",
      description: "La trace de performance a bien démarré",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      performanceAutomation: "Automatisation des performances",
    },
  },
  "performance-stop-trace": {
    title: "Arrêter la trace de performance",
    titleShort: "Arrêter trace",
    description:
      "Arrête la trace active et renvoie les métriques de performance avec les ID de groupes d'insights pour performance-analyze-insight.",
    form: {
      label: "Arrêter la trace de performance",
      description: "Arrêter l'enregistrement de la trace de performance active",
      fields: {},
    },
    response: {
      success: "Trace de performance arrêtée",
      result: "Résultat de l'arrêt de la trace, avec les métriques",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de l'arrêt de la trace de performance",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à arrêter des traces de performance",
      },
      forbidden: {
        title: "Interdit",
        description: "L'arrêt de traces de performance est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de l'arrêt de la trace de performance",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de l'arrêt de la trace de performance",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit s'est produit lors de l'arrêt de la trace de performance",
      },
    },
    success: {
      title: "Trace de performance arrêtée",
      description: "La trace de performance a bien été arrêtée",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      performanceAutomation: "Automatisation des performances",
    },
  },
  "take-screenshot": {
    title: "Prendre une capture d'écran",
    titleShort: "Capture",
    dynamicTitle: "Capture : {{target}}",
    description:
      "Prend une capture d'écran de la page ou d'un élément précis. Renvoie une image. À utiliser pour vérifier l'état de l'interface.",
    form: {
      label: "Prendre une capture d'écran",
      description: "Capturer la page du navigateur ou un élément",
      fields: {
        uid: {
          label: "UID de l'élément",
          description:
            "L'uid de l'élément à capturer (omettez-le pour capturer toute la page)",
          placeholder: "Saisissez l'UID de l'élément",
        },
        fullPage: {
          label: "Page entière",
          description:
            "Si true, capture la page entière au lieu de la zone d'affichage visible (incompatible avec uid)",
          placeholder: "false",
        },
        format: {
          label: "Format",
          description:
            "Format d'enregistrement de la capture (par défaut : png)",
          placeholder: "png",
          options: {
            png: "PNG",
            jpeg: "JPEG",
            webp: "WebP",
          },
        },
        quality: {
          label: "Qualité",
          description:
            "Qualité de compression pour les formats JPEG et WebP (0-100). Plus la valeur est élevée, meilleure est la qualité, mais plus le fichier est lourd. Ignoré pour le format PNG.",
          placeholder: "80",
        },
        filePath: {
          label: "Chemin du fichier",
          description:
            "Le chemin absolu, ou relatif au répertoire de travail actuel, où enregistrer la capture au lieu de la joindre à la réponse",
          placeholder: "/path/to/screenshot.png",
        },
      },
    },
    response: {
      success: "Capture d'écran réalisée",
      result: "Résultat de la capture d'écran",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la capture d'écran",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à prendre des captures d'écran",
      },
      forbidden: {
        title: "Interdit",
        description: "Les captures d'écran sont interdites",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la capture d'écran",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la capture d'écran",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit lors de la capture d'écran",
      },
    },
    success: {
      title: "Capture d'écran réalisée",
      description: "La capture d'écran a bien été réalisée",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      captureAutomation: "Automatisation des captures",
    },
  },
  "take-snapshot": {
    title: "Prendre un snapshot",
    titleShort: "Snapshot",
    description:
      "Obtient l'arbre d'accessibilité (a11y) de la page sous forme de texte. Obligatoire avant click/fill/drag : fournit les UID des éléments.",
    form: {
      label: "Prendre un snapshot",
      description:
        "Capturer un snapshot texte de la page du navigateur à partir de l'arbre d'accessibilité",
      fields: {
        verbose: {
          label: "Détaillé",
          description:
            "Inclure ou non toutes les informations disponibles dans l'arbre d'accessibilité complet (par défaut : false)",
          placeholder: "false",
        },
        filePath: {
          label: "Chemin du fichier",
          description:
            "Le chemin absolu, ou relatif au répertoire de travail actuel, où enregistrer le snapshot au lieu de le joindre à la réponse",
          placeholder: "/path/to/snapshot.txt",
        },
      },
    },
    response: {
      success: "Snapshot réalisé",
      result: "Résultat du snapshot",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description:
          "Une erreur réseau s'est produite lors de la prise du snapshot",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à prendre des snapshots",
      },
      forbidden: {
        title: "Interdit",
        description: "La prise de snapshots est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite lors de la prise du snapshot",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inconnue s'est produite lors de la prise du snapshot",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit lors de la prise du snapshot",
      },
    },
    success: {
      title: "Snapshot réalisé",
      description: "Le snapshot a bien été réalisé",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      captureAutomation: "Automatisation des captures",
    },
  },
  "wait-for": {
    title: "Attendre",
    titleShort: "Attendre",
    dynamicTitle: "Attente : {{text}}",
    description:
      "Attend qu'un texte précis apparaisse sur la page. À utiliser après une navigation ou une action qui déclenche des mises à jour asynchrones.",
    form: {
      label: "Attendre un texte",
      description: "Attendre qu'un texte précis apparaisse sur la page",
      fields: {
        text: {
          label: "Texte",
          description: "Texte qui doit apparaître sur la page",
          placeholder: "Saisissez le texte à attendre",
        },
        timeout: {
          label: "Délai d'attente",
          description:
            "Temps d'attente maximal en millisecondes. Avec 0, le délai par défaut s'applique",
          placeholder: "Saisissez le délai (ms)",
        },
        captureSnapshot: {
          label: "Capturer un snapshot",
          description:
            "Si activé, inclut le snapshot d'accessibilité complet dans la réponse. Désactivé par défaut pour garder des réponses concises.",
        },
      },
    },
    response: {
      success: "Attente terminée",
      result: "Résultat de l'attente",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Vérifiez votre saisie et réessayez",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite pendant l'attente",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à effectuer des attentes",
      },
      forbidden: {
        title: "Interdit",
        description: "L'attente est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Une erreur interne du serveur s'est produite pendant l'attente",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inconnue s'est produite pendant l'attente",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant l'attente",
      },
    },
    success: {
      title: "Attente terminée",
      description: "Le texte indiqué est apparu sur la page",
    },
    category: "Navigateur",
    tags: {
      browserAutomation: "Automatisation du navigateur",
      waitAutomation: "Automatisation des attentes",
    },
  },
  title: "Outils MCP Chrome DevTools",
  description:
    "Automatisation du navigateur via Chrome DevTools. Déroulé : new-page → take-snapshot → interaction (click/fill) → vérification.",
  category: "Navigateur",
  summary:
    "Accédez aux outils du Chrome DevTools Protocol via MCP pour automatiser le web",
  tags: {
    browserAutomation: "Automatisation du navigateur",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "Outils MCP",
    webDebugging: "Débogage web",
    performanceAnalysis: "Analyse des performances",
    inputAutomation: "Automatisation des saisies",
    captureAutomation: "Automatisation des captures",
    debugging: "Débogage",
    dialogAutomation: "Automatisation des boîtes de dialogue",
    navigationAutomation: "Automatisation de la navigation",
    networkAnalysis: "Analyse réseau",
    performanceAutomation: "Automatisation des performances",
    scriptExecution: "Exécution de scripts",
    viewportAutomation: "Automatisation de la zone d'affichage",
    waitAutomation: "Automatisation des attentes",
  },
  form: {
    label: "Exécution d'outil navigateur",
    description:
      "Exécuter les outils MCP Chrome DevTools pour piloter et analyser le navigateur",
    fields: {
      tool: {
        label: "Outil",
        description: "Sélectionnez l'outil MCP Chrome DevTools à exécuter",
        placeholder: "Choisissez un outil...",
      },
      arguments: {
        label: "Arguments",
        description: "Arguments JSON pour l'outil sélectionné (facultatif)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },
  tool: {
    click: "Cliquer sur un élément",
    drag: "Glisser un élément",
    fill: "Remplir un champ",
    fillForm: "Remplir un formulaire",
    handleDialog: "Gérer la boîte de dialogue",
    hover: "Survoler un élément",
    pressKey: "Appuyer sur une touche",
    uploadFile: "Téléverser un fichier",
    closePage: "Fermer la page",
    listPages: "Lister les pages",
    navigatePage: "Naviguer sur la page",
    newPage: "Nouvelle page",
    selectPage: "Sélectionner une page",
    waitFor: "Attendre",
    emulate: "Émuler un appareil",
    resizePage: "Redimensionner la page",
    performanceAnalyzeInsight: "Analyser un insight de performance",
    performanceStartTrace: "Démarrer une trace de performance",
    performanceStopTrace: "Arrêter la trace de performance",
    getNetworkRequest: "Obtenir une requête réseau",
    listNetworkRequests: "Lister les requêtes réseau",
    evaluateScript: "Évaluer un script",
    getConsoleMessage: "Obtenir un message de console",
    listConsoleMessages: "Lister les messages de console",
    takeScreenshot: "Prendre une capture d'écran",
    takeSnapshot: "Prendre un snapshot",
  },
  status: {
    pending: "En attente",
    running: "En cours",
    completed: "Terminé",
    failed: "Échec",
  },
  response: {
    success: "Outil exécuté",
    result: "Résultat de l'exécution",
    status: "Statut d'exécution actuel",
    statusItem: "Élément de statut",
    executionId: "ID d'exécution pour le suivi",
  },
  examples: {
    requests: {
      navigate: {
        title: "Naviguer vers une URL",
        description: "Diriger le navigateur vers une URL précise",
      },
      screenshot: {
        title: "Prendre une capture d'écran",
        description: "Capturer la page en cours",
      },
      click: {
        title: "Cliquer sur un élément",
        description: "Cliquer sur un élément précis",
      },
      performance: {
        title: "Démarrer une trace de performance",
        description: "Commencer l'enregistrement des métriques de performance",
      },
      script: {
        title: "Évaluer un script",
        description: "Exécuter du JavaScript dans le navigateur",
      },
    },
    responses: {
      navigate: {
        title: "Résultat de la navigation",
        description: "Résultat de la navigation sur la page",
      },
      screenshot: {
        title: "Résultat de la capture",
        description: "Résultat de la capture d'écran",
      },
      click: {
        title: "Résultat du clic",
        description: "Résultat du clic sur l'élément",
      },
      performance: {
        title: "Trace de performance démarrée",
        description: "Traçage des performances lancé",
      },
      script: {
        title: "Résultat de l'évaluation du script",
        description: "Résultat de l'exécution du JavaScript",
      },
    },
  },
  errors: {
    toolExecutionFailed: {
      title: "Échec de l'exécution de l'outil",
      description: "L'outil sélectionné n'a pas pu être exécuté",
    },
    invalidArguments: {
      title: "Arguments invalides",
      description: "Les arguments fournis ne sont pas valides pour cet outil",
    },
    browserNotAvailable: {
      title: "Navigateur indisponible",
      description: "Aucune instance du navigateur Chrome n'est disponible",
    },
    toolNotFound: {
      title: "Outil introuvable",
      description: "L'outil demandé n'est pas disponible",
    },
    validation: {
      title: "Erreur de validation",
      description: "Vérifiez votre saisie et réessayez",
      toolRequired: "Vous devez sélectionner un outil",
      argumentsInvalid: "Les arguments doivent être du JSON valide",
    },
    network: {
      title: "Erreur réseau",
      description:
        "Une erreur réseau s'est produite pendant l'exécution de l'outil",
    },
    unauthorized: {
      title: "Non autorisé",
      description:
        "Vous n'êtes pas autorisé à exécuter des outils du navigateur",
    },
    forbidden: {
      title: "Interdit",
      description: "L'exécution d'outils du navigateur est interdite",
    },
    notFound: {
      title: "Introuvable",
      description: "L'outil de navigateur demandé est introuvable",
    },
    serverError: {
      title: "Erreur serveur",
      description:
        "Une erreur interne du serveur s'est produite pendant l'exécution de l'outil",
    },
    unknown: {
      title: "Erreur inconnue",
      description:
        "Une erreur inconnue s'est produite pendant l'exécution de l'outil",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description:
        "Vous avez des modifications non enregistrées qui risquent d'être perdues",
    },
    conflict: {
      title: "Conflit",
      description: "Un conflit s'est produit pendant l'exécution de l'outil",
    },
  },
  success: {
    title: "Outil exécuté",
    description: "L'outil du navigateur a bien été exécuté",
  },
  shared: {
    instanceId: {
      label: "ID de session",
      description:
        "ID de la session du navigateur. Chaque ID unique obtient son propre onglet isolé. Laissez vide pour utiliser la session par défaut.",
      placeholder: "ex. my-session-1",
    },
  },
  repository: {
    execute: {
      start: "Démarrage de l'exécution de l'outil navigateur",
      success: "Outil navigateur exécuté",
      error: "Erreur lors de l'exécution de l'outil navigateur",
    },
    mcp: {
      connect: {
        start: "Connexion au serveur MCP Chrome DevTools",
        success: "Connecté au serveur MCP",
        error: "Échec de la connexion au serveur MCP",
        failedToInitialize:
          "Échec de l'initialisation du serveur MCP Chrome DevTools",
      },
      closePage: {
        noSession: "Aucune session active : rien à fermer",
        switchedToPage: "Page fermée, bascule sur la page {{pageId}}",
        closedPage: "Page {{pageId}} fermée",
        pageNotInSession: "La page {{pageId}} n'appartient pas à cette session",
      },
      tool: {
        call: {
          start: "Appel de l'outil MCP",
          success: "Outil MCP appelé",
          error: "Erreur lors de l'appel de l'outil MCP",
          invalidJsonArguments: "Arguments JSON invalides",
          executionFailed: "Échec de l'exécution de l'outil : {{error}}",
          newPageFailed: "Impossible d'ouvrir une nouvelle page",
          toolExecutionFailed: "Échec de l'exécution de {{toolName}}",
        },
      },
    },
  },
};
