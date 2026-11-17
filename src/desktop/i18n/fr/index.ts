import type { translations as enTranslations } from "../en";

/**
 * Desktop API translations (French)
 */

export const translations: typeof enTranslations = {
  "take-screenshot": {
    title: "Prendre une capture d'écran du bureau",
    titleShort: "Capture d'écran",
    dynamicTitle: "Capture : {{target}}",
    description: "Capturer le bureau entier ou une zone de l'écran",
    form: {
      label: "Prendre une capture d'écran",
      capturing: "Capture en cours…",
      refresh: "Reprendre",
      description: "Capturer le bureau entier ou une zone précise",
      fields: {
        outputPath: {
          label: "Chemin de sortie",
          description:
            "Chemin absolu où enregistrer la capture. Laisser vide pour la renvoyer en base64.",
          placeholder: "/tmp/screenshot.png",
        },
        screen: {
          label: "Index de l'écran",
          description:
            "Index de l'écran/moniteur (0 = principal). Préférez monitorName.",
          placeholder: "0",
        },
        monitorName: {
          label: "Nom du moniteur",
          description:
            "Nom de sortie du moniteur (ex. DP-1, HDMI-1). Lancez d'abord list-monitors pour voir les noms disponibles.",
          placeholder: "DP-1",
        },
        maxWidth: {
          label: "Largeur max.",
          description:
            "Réduire à cette largeur si la capture est plus large. Utile pour l'IA : une capture de 4 moniteurs est énorme.",
          placeholder: "1920",
        },
      },
    },
    response: {
      success: "Capture d'écran réalisée",
      imagePath: "Chemin où la capture a été enregistrée",
      imageData: "Données PNG de la capture, encodées en base64",
      imageUrl: "URL d'accès à la capture",
      width: "Largeur de la capture en pixels",
      height: "Hauteur de la capture en pixels",
      monitorName: "Moniteur capturé",
      originalWidth: "Largeur d'origine avant réduction",
      originalHeight: "Hauteur d'origine avant réduction",
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
        description: "Erreur réseau pendant la capture d'écran",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à capturer l'écran du bureau",
      },
      forbidden: {
        title: "Interdit",
        description: "La capture d'écran du bureau est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant la capture d'écran",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inconnue pendant la capture d'écran",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu pendant la capture d'écran",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Cette fonction n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Capture réalisée",
      description: "La capture d'écran du bureau a été réalisée",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      captureAutomation: "Automatisation de capture",
    },
  },
  "get-accessibility-tree": {
    title: "Obtenir l'arbre d'accessibilité",
    titleShort: "Arbre a11y",
    dynamicTitle: "A11y : {{app}}",
    description:
      "Obtenir l'arbre d'accessibilité de la fenêtre active ou d'une application précise",
    form: {
      label: "Obtenir l'arbre d'accessibilité",
      description:
        "Récupérer l'arbre d'accessibilité AT-SPI pour inspecter l'interface du bureau",
      fields: {
        appName: {
          label: "Nom de l'application",
          description:
            "Nom du processus ou titre de la fenêtre à cibler (vide = fenêtre active)",
          placeholder: "firefox",
        },
        maxDepth: {
          label: "Profondeur max.",
          description:
            "Profondeur maximale de parcours de l'arbre (par défaut : 5)",
          placeholder: "5",
        },
        includeActions: {
          label: "Inclure les actions",
          description:
            "Afficher les actions disponibles par nœud (click, press, activate...). Plus de détails, mais une sortie plus volumineuse.",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Arbre d'accessibilité récupéré",
      tree: "Arbre d'accessibilité sous forme de texte structuré",
      nodeCount: "Nombre total de nœuds parcourus",
      truncated:
        "Indique si la requête a expiré et si la sortie peut être incomplète",
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
          "Erreur réseau pendant la récupération de l'arbre d'accessibilité",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à accéder à l'arbre d'accessibilité",
      },
      forbidden: {
        title: "Interdit",
        description: "L'accès à l'arbre d'accessibilité est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "L'application ou la fenêtre ciblée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Erreur interne du serveur pendant la récupération de l'arbre d'accessibilité",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Erreur inconnue pendant la récupération de l'arbre d'accessibilité",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit est survenu pendant la récupération de l'arbre d'accessibilité",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Cette fonction n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Arbre d'accessibilité récupéré",
      description: "L'arbre d'accessibilité a été récupéré",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      accessibilityAutomation: "Automatisation de l'accessibilité",
    },
  },
  "list-monitors": {
    title: "Lister les moniteurs",
    titleShort: "Moniteurs",
    description:
      "Lister tous les moniteurs connectés avec leur résolution, leur position et leur index",
    form: {
      label: "Lister les moniteurs",
      description:
        "Énumérer tous les écrans connectés. Utilisez les noms de moniteur pour cibler un écran précis lors des captures.",
      fields: {},
    },
    response: {
      success: "Moniteurs listés",
      monitors: "Tableau des moniteurs connectés",
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
        description: "Erreur réseau pendant le listage des moniteurs",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à lister les moniteurs",
      },
      forbidden: {
        title: "Interdit",
        description: "Le listage des moniteurs est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Erreur interne du serveur pendant le listage des moniteurs",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inconnue pendant le listage des moniteurs",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu pendant le listage des moniteurs",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Le listage des moniteurs n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Moniteurs listés",
      description: "Tous les moniteurs connectés ont été listés",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      captureAutomation: "Automatisation de capture",
    },
  },
  click: {
    title: "Cliquer",
    titleShort: "Clic",
    dynamicTitle: "Clic : {{x}},{{y}}",
    description:
      "Déplacer la souris vers des coordonnées absolues et effectuer un clic",
    form: {
      label: "Cliquer",
      description:
        "Déplacer la souris vers les coordonnées indiquées et cliquer",
      fields: {
        x: {
          label: "Coordonnée X",
          description:
            "Coordonnée horizontale à l'écran, en pixels (depuis le bord gauche)",
          placeholder: "100",
        },
        y: {
          label: "Coordonnée Y",
          description:
            "Coordonnée verticale à l'écran, en pixels (depuis le bord supérieur)",
          placeholder: "200",
        },
        button: {
          label: "Bouton de la souris",
          description: "Bouton de la souris à utiliser (left, middle, right)",
          placeholder: "left",
          options: {
            left: "Gauche",
            middle: "Milieu",
            right: "Droit",
          },
        },
        doubleClick: {
          label: "Double-clic",
          description: "Effectuer un double-clic au lieu d'un clic simple",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Clic effectué",
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
        description: "Erreur réseau pendant le clic",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à effectuer des clics sur le bureau",
      },
      forbidden: {
        title: "Interdit",
        description: "Les clics sur le bureau sont interdits",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant le clic",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inconnue pendant le clic",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu pendant le clic",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Cette fonction n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Clic effectué",
      description: "Le clic de souris a été effectué",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      inputAutomation: "Automatisation des entrées",
    },
  },
  "type-text": {
    title: "Saisir du texte",
    titleShort: "Saisir du texte",
    dynamicTitle: "Saisie : {{text}}",
    description:
      "Saisir du texte dans la fenêtre active par simulation du clavier",
    form: {
      label: "Saisir du texte",
      description:
        "Envoyer des frappes clavier à la fenêtre active pour saisir du texte",
      fields: {
        text: {
          label: "Texte",
          description: "Le texte à saisir dans la fenêtre active",
          placeholder: "Bonjour tout le monde !",
        },
        delay: {
          label: "Délai (ms)",
          description:
            "Délai entre les frappes, en millisecondes (par défaut : 12)",
          placeholder: "12",
        },
        windowId: {
          label: "ID de fenêtre",
          description:
            "Activer la fenêtre portant cet UUID avant la saisie (depuis list-windows)",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Titre de la fenêtre",
          description:
            "Activer la fenêtre dont le titre contient ce texte avant la saisie",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Texte saisi",
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
        description: "Erreur réseau pendant la saisie du texte",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à saisir du texte sur le bureau",
      },
      forbidden: {
        title: "Interdit",
        description: "La saisie de texte sur le bureau est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant la saisie du texte",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inconnue pendant la saisie du texte",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu pendant la saisie du texte",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Cette fonction n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Texte saisi",
      description: "Le texte a été saisi",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      inputAutomation: "Automatisation des entrées",
    },
  },
  "press-key": {
    title: "Appuyer sur une touche",
    titleShort: "Touche",
    dynamicTitle: "Touche : {{key}}",
    description:
      "Appuyer sur une touche ou une combinaison de touches via xdotool",
    form: {
      label: "Appuyer sur une touche",
      description:
        "Envoyer un appui de touche au bureau avec la syntaxe de touches xdotool",
      fields: {
        key: {
          label: "Touche",
          description:
            "Nom de touche ou combinaison en syntaxe xdotool (ex. Return, ctrl+c, alt+F4)",
          placeholder: "Return",
        },
        repeat: {
          label: "Nombre de répétitions",
          description: "Nombre d'appuis sur la touche (par défaut : 1)",
          placeholder: "1",
        },
        delay: {
          label: "Délai (ms)",
          description:
            "Délai entre les appuis répétés, en millisecondes (par défaut : 0)",
          placeholder: "0",
        },
        windowId: {
          label: "ID de fenêtre",
          description: "Activer la fenêtre portant cet UUID avant l'appui",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Titre de la fenêtre",
          description:
            "Activer la fenêtre dont le titre contient ce texte avant l'appui",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Touche pressée",
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
        description: "Erreur réseau pendant l'appui sur la touche",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à appuyer sur des touches du bureau",
      },
      forbidden: {
        title: "Interdit",
        description: "L'appui sur des touches du bureau est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant l'appui sur la touche",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inconnue pendant l'appui sur la touche",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu pendant l'appui sur la touche",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Cette fonction n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Touche pressée",
      description: "La touche a été pressée",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      inputAutomation: "Automatisation des entrées",
    },
  },
  "move-mouse": {
    title: "Déplacer la souris",
    titleShort: "Déplacer la souris",
    dynamicTitle: "Déplacement : {{x}},{{y}}",
    description:
      "Déplacer le curseur de la souris vers des coordonnées absolues",
    form: {
      label: "Déplacer la souris",
      description: "Déplacer le curseur de la souris à la position indiquée",
      fields: {
        x: {
          label: "Coordonnée X",
          description:
            "Coordonnée horizontale à l'écran, en pixels (depuis le bord gauche)",
          placeholder: "100",
        },
        y: {
          label: "Coordonnée Y",
          description:
            "Coordonnée verticale à l'écran, en pixels (depuis le bord supérieur)",
          placeholder: "200",
        },
      },
    },
    response: {
      success: "Souris déplacée",
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
        description: "Erreur réseau pendant le déplacement de la souris",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à déplacer la souris sur le bureau",
      },
      forbidden: {
        title: "Interdit",
        description: "Le déplacement de la souris sur le bureau est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Erreur interne du serveur pendant le déplacement de la souris",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inconnue pendant le déplacement de la souris",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit est survenu pendant le déplacement de la souris",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Cette fonction n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Souris déplacée",
      description: "Le curseur de la souris a été déplacé",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      inputAutomation: "Automatisation des entrées",
    },
  },
  scroll: {
    title: "Défiler",
    titleShort: "Défilement",
    dynamicTitle: "Défilement : {{direction}}",
    description:
      "Faire défiler à la position actuelle de la souris ou aux coordonnées indiquées",
    form: {
      label: "Défiler",
      description:
        "Faire défiler vers le haut, le bas, la gauche ou la droite à la position indiquée",
      fields: {
        x: {
          label: "Coordonnée X",
          description:
            "Position horizontale du défilement (position actuelle si vide)",
          placeholder: "100",
        },
        y: {
          label: "Coordonnée Y",
          description:
            "Position verticale du défilement (position actuelle si vide)",
          placeholder: "200",
        },
        direction: {
          label: "Direction",
          description: "Direction du défilement",
          placeholder: "down",
          options: {
            up: "Haut",
            down: "Bas",
            left: "Gauche",
            right: "Droite",
          },
        },
        amount: {
          label: "Quantité",
          description: "Nombre de crans de défilement (par défaut : 3)",
          placeholder: "3",
        },
      },
    },
    response: {
      success: "Défilement effectué",
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
        description: "Erreur réseau pendant le défilement",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à faire défiler le bureau",
      },
      forbidden: {
        title: "Interdit",
        description: "Le défilement sur le bureau est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description: "Erreur interne du serveur pendant le défilement",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inconnue pendant le défilement",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu pendant le défilement",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Cette fonction n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Défilement effectué",
      description: "Le défilement a été effectué",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      inputAutomation: "Automatisation des entrées",
    },
  },
  "get-focused-window": {
    title: "Obtenir la fenêtre active",
    titleShort: "Fenêtre active",
    description: "Obtenir les informations sur la fenêtre qui a le focus",
    form: {
      label: "Obtenir la fenêtre active",
      description: "Récupérer l'ID, le titre et le PID de la fenêtre active",
      fields: {},
    },
    response: {
      success: "Informations sur la fenêtre active récupérées",
      windowId: "ID de fenêtre X11 de la fenêtre active",
      windowTitle: "Titre de la fenêtre active",
      pid: "ID de processus de la fenêtre active",
      width: "Largeur de la fenêtre en pixels",
      height: "Hauteur de la fenêtre en pixels",
      monitor: "Index du moniteur où se trouve la fenêtre",
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
          "Erreur réseau pendant la récupération de la fenêtre active",
      },
      unauthorized: {
        title: "Non autorisé",
        description:
          "Vous n'êtes pas autorisé à obtenir des informations sur les fenêtres",
      },
      forbidden: {
        title: "Interdit",
        description:
          "L'obtention d'informations sur les fenêtres est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucune fenêtre active trouvée",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Erreur interne du serveur pendant la récupération de la fenêtre active",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Erreur inconnue pendant la récupération de la fenêtre active",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit est survenu pendant la récupération de la fenêtre active",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Cette fonction n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Fenêtre active récupérée",
      description: "Les informations sur la fenêtre active ont été récupérées",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      windowManagement: "Gestion des fenêtres",
    },
  },
  "list-windows": {
    title: "Lister les fenêtres",
    titleShort: "Lister les fenêtres",
    description: "Lister toutes les fenêtres ouvertes sur le bureau",
    form: {
      label: "Lister les fenêtres",
      description:
        "Récupérer la liste de toutes les fenêtres ouvertes avec leurs ID, titres et positions",
      fields: {},
    },
    response: {
      success: "Liste des fenêtres récupérée",
      windows: "Liste des fenêtres ouvertes",
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
        description: "Erreur réseau pendant le listage des fenêtres",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à lister les fenêtres",
      },
      forbidden: {
        title: "Interdit",
        description: "Le listage des fenêtres est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucune fenêtre trouvée",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Erreur interne du serveur pendant le listage des fenêtres",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inconnue pendant le listage des fenêtres",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit est survenu pendant le listage des fenêtres",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Cette fonction n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Fenêtres listées",
      description: "La liste des fenêtres a été récupérée",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      windowManagement: "Gestion des fenêtres",
    },
  },
  "focus-window": {
    title: "Activer une fenêtre",
    titleShort: "Activer la fenêtre",
    dynamicTitle: "Focus : {{target}}",
    description: "Mettre une fenêtre au premier plan et lui donner le focus",
    form: {
      label: "Activer une fenêtre",
      description: "Activer une fenêtre par son ID, son PID ou son titre",
      fields: {
        windowId: {
          label: "ID de fenêtre",
          description:
            "ID de fenêtre X11 (hexadécimal, ex. 0x1234). Prioritaire sur les autres options.",
          placeholder: "0x1234",
        },
        pid: {
          label: "ID de processus",
          description: "Activer la fenêtre appartenant à cet ID de processus",
          placeholder: "12345",
        },
        title: {
          label: "Titre de la fenêtre",
          description:
            "Activer la fenêtre dont le titre contient cette chaîne (sensible à la casse)",
          placeholder: "Firefox",
        },
      },
    },
    response: {
      success: "Fenêtre activée",
      error: "Message d'erreur",
      executionId: "ID d'exécution pour le suivi",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description:
          "Indiquez au moins l'un des champs suivants : windowId, pid ou title",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau pendant l'activation de la fenêtre",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à activer des fenêtres",
      },
      forbidden: {
        title: "Interdit",
        description: "L'activation de fenêtres est interdite",
      },
      notFound: {
        title: "Introuvable",
        description: "La fenêtre indiquée est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Erreur interne du serveur pendant l'activation de la fenêtre",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inconnue pendant l'activation de la fenêtre",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit est survenu pendant l'activation de la fenêtre",
      },
      notImplemented: {
        title: "Non implémenté",
        description:
          "Cette fonction n'est pas disponible sur votre système d'exploitation",
      },
    },
    success: {
      title: "Fenêtre activée",
      description: "La fenêtre a été mise au premier plan",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      windowManagement: "Gestion des fenêtres",
    },
  },
  "move-window-to-monitor": {
    title: "Déplacer une fenêtre vers un moniteur",
    titleShort: "Déplacer la fenêtre",
    dynamicTitle: "Déplacement : {{target}}",
    description: "Déplacer une fenêtre vers un moniteur précis",
    form: {
      label: "Déplacer une fenêtre vers un moniteur",
      description:
        "Déplacer une fenêtre, par son ID, son PID ou son titre, vers un moniteur cible",
      fields: {
        windowId: {
          label: "ID de fenêtre",
          description:
            "UUID interne de la fenêtre KWin (depuis list-windows). Prioritaire sur pid et title.",
          placeholder: "{uuid}",
        },
        pid: {
          label: "ID de processus",
          description: "Déplacer la fenêtre appartenant à cet ID de processus",
          placeholder: "12345",
        },
        title: {
          label: "Titre de la fenêtre",
          description:
            "Déplacer la fenêtre dont le titre contient cette chaîne (insensible à la casse)",
          placeholder: "Firefox",
        },
        monitorName: {
          label: "Nom du moniteur",
          description:
            "Nom du moniteur cible (ex. DP-1, HDMI-A-1). Utilisez list-monitors pour voir les noms disponibles.",
          placeholder: "DP-1",
        },
        monitorIndex: {
          label: "Index du moniteur",
          description:
            "Index du moniteur cible (à partir de 0). Utilisez monitorName si possible.",
          placeholder: "0",
        },
      },
    },
    response: {
      success: "Indique si le déplacement a réussi",
      movedTo: "Moniteur vers lequel la fenêtre a été déplacée",
      windowTitle: "Titre de la fenêtre déplacée",
      error: "Message d'erreur si l'opération a échoué",
      executionId: "Identifiant unique de cette exécution",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description:
          "Indiquez au moins un identifiant de fenêtre et un moniteur cible",
      },
      network: {
        title: "Erreur réseau",
        description: "Erreur réseau pendant le déplacement de la fenêtre",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous n'êtes pas autorisé à déplacer des fenêtres",
      },
      forbidden: {
        title: "Interdit",
        description: "Le déplacement de fenêtres est interdit",
      },
      notFound: {
        title: "Introuvable",
        description: "La fenêtre ou le moniteur indiqué est introuvable",
      },
      serverError: {
        title: "Erreur serveur",
        description:
          "Erreur interne du serveur pendant le déplacement de la fenêtre",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Erreur inconnue pendant le déplacement de la fenêtre",
      },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description:
          "Vous avez des modifications non enregistrées qui risquent d'être perdues",
      },
      conflict: {
        title: "Conflit",
        description:
          "Un conflit est survenu pendant le déplacement de la fenêtre",
      },
    },
    success: {
      title: "Fenêtre déplacée",
      description: "La fenêtre a été déplacée vers le moniteur cible",
    },
    category: "Bureau",
    tags: {
      desktopAutomation: "Automatisation du bureau",
      windowManagement: "Gestion des fenêtres",
    },
  },

  title: "Outils d'automatisation du bureau",
  description:
    "Pilotez le bureau : captures d'écran, souris, clavier, fenêtres",
  category: "Bureau",
  summary:
    "Automatisation du bureau multiplateforme : Linux (ydotool/KWin/pyatspi) et Windows (PowerShell/UIAutomation)",
  tags: {
    desktopAutomation: "Automatisation du bureau",
    inputAutomation: "Automatisation des entrées",
    windowManagement: "Gestion des fenêtres",
    captureAutomation: "Automatisation de capture",
    accessibilityAutomation: "Automatisation de l'accessibilité",
  },

  tool: {
    takeScreenshot: "Prendre une capture d'écran",
    getAccessibilityTree: "Obtenir l'arbre d'accessibilité",
    listMonitors: "Lister les moniteurs",
    click: "Cliquer",
    typeText: "Saisir du texte",
    pressKey: "Appuyer sur une touche",
    moveMouse: "Déplacer la souris",
    scroll: "Défiler",
    getFocusedWindow: "Obtenir la fenêtre active",
    listWindows: "Lister les fenêtres",
    focusWindow: "Activer une fenêtre",
    moveWindowToMonitor: "Déplacer une fenêtre vers un moniteur",
  },

  widget: {
    noWindows: "Aucune fenêtre ouverte",
    windowCount_one: "{{count}} fenêtre",
    windowCount_other: "{{count}} fenêtres",
    actionFocus: "Activer",
    actionType: "Saisir",
    actionKey: "Touche",
    actionMove: "Déplacer",
    actionA11y: "A11y",
    actionTypeText: "Saisir du texte",
    actionPressKey: "Appuyer sur une touche",
    actionScreenshot: "Capture d'écran",
    actionScreenshotOnMonitor: "Capture : {{monitor}}",
    actionA11yTree: "Arbre a11y",
    actionAllWindows: "← Toutes les fenêtres",
    actionAllMonitors: "Tous les moniteurs →",
    actionScreenshotLink: "Capture d'écran →",
    actionMoveWindowHere: "Déplacer la fenêtre ici",
    labelPrimary: "Principal",
    statusFocused: "Fenêtre activée",
    statusTyped: "Saisi",
    statusPressed: "Pressé",
    statusMoved: "Déplacé",
    statusScrolled: "Défilé",
    statusMouseMoved: "Souris déplacée",
    statusClickExecuted: "Clic effectué",
    labelSaved: "Enregistré :",
    labelTruncated: "⚠ Tronqué",
    filterPlaceholder: "Filtrer les nœuds…",
    titleTypeText: "Saisir du texte",
    titlePressKey: "Appuyer sur une touche",
    titleClick: "Clic",
    titleScroll: "Défilement",
    titleMoveMouse: "Déplacer la souris",
    titleMoveWindow: "Déplacer la fenêtre",
    titleA11yTree: "Arbre d'accessibilité",
    titleListWindows: "Fenêtres",
    titleListMonitors: "Moniteurs",
    titleGetFocusedWindow: "Fenêtre active",
    titleFocusWindow: "Activer la fenêtre",
  },

  repository: {
    platformNotSupported:
      "Plateforme non prise en charge : {{platform}}. Linux et Windows sont pris en charge.",
    windowsNotSupported: "Prise en charge de Windows bientôt disponible",
    macosNotSupported: "Prise en charge de macOS bientôt disponible",
    commandFailed: "Échec de la commande : {{error}}",
    toolNotFound:
      "Outil requis introuvable : {{tool}}. Installez-le avec : {{installCmd}}",
    screenshotFailed: "Échec de la capture d'écran",
    accessibilityFailed: "Impossible d'obtenir l'arbre d'accessibilité",
    accessibilityFailedWithError:
      "Impossible d'obtenir l'arbre d'accessibilité : {{error}}",
    focusWindowRequiresIdentifier:
      "Au moins l'un de windowId, pid ou title est requis",
    missingDep:
      "Paquet système requis manquant : {{dep}}. Une boîte de dialogue d'authentification système a dû s'afficher : validez-la pour l'installer automatiquement.",
    scriptWriteFailed: "Échec de l'écriture du script : {{error}}",
    monitorNotFoundByName: "Moniteur « {{monitorName}} » introuvable",
    noMonitorsDetected: "Aucun moniteur détecté",
    invalidWindowHandle:
      "windowId invalide : « {{handle}} » n'est pas un handle de fenêtre numérique valide",
    screenIndexOutOfRange: "Index d'écran {{screen}} hors limites",
    unknownKeyName: "Nom de touche inconnu : {{key}}",
    focusedWindowParseFailed:
      "Impossible d'analyser la sortie de la fenêtre active",
    couldNotListWindows: "Impossible de lister les fenêtres",
    noWindowWithPid: "Aucune fenêtre avec le PID {{pid}}",
    noWindowWithTitle: "Aucune fenêtre dont le titre contient « {{title}} »",
    provideMonitorNameOrIndex: "Indiquez monitorName ou monitorIndex",
    monitorNotFound: "Moniteur introuvable : {{monitor}}",
    noActiveWindow: "Aucune fenêtre active",
    kwinNoOutput: "Le script KWin n'a produit aucune sortie",
    kwinNoWindowData: "Aucune donnée de fenêtre dans la sortie du script KWin",
    windowMoveNoEffect:
      "Le déplacement de la fenêtre n'a pas eu d'effet : elle n'a jamais atteint le moniteur {{monitor}}",
  },
};
