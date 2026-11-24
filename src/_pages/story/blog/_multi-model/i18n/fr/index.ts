import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    back: "Retour au blog",
    category: "Comparatif",
    readTime: "7 min de lecture",
    switching: "Pourquoi chercher une alternative ?",
    criteria: "Les points à vérifier avant de changer",
    privacy:
      "Vérifiez où l’historique est enregistré et qui traite vos requêtes. Un modèle hébergé reçoit votre requête même si l’interface fonctionne en local.",
    table: "Toutes les options côte à côte",
    checked:
      "Tarifs des concurrents vérifiés le {{date}}. Les montants sont en dollars américains. Le prix au paiement peut varier selon le pays. Les chiffres de {{appName}} proviennent de notre configuration actuelle. Sur un petit écran, faites défiler le tableau horizontalement.",
    alternatives: "Les autres options en détail",
    price: "Prix.",
    pro: "Point fort.",
    con: "Limite.",
    fit: "À choisir si",
    faq: "Questions fréquentes",
    guides: "Autres comparatifs",
    modelCatalog: "Voir le catalogue de modèles",
  },
  kinds: {
    aggregator: "Chat hébergé avec plusieurs modèles",
    client: "Client pour vos clés API",
    selfHosted: "Interface de chat à auto-héberger",
    gateway: "Passerelle API avec chat web",
    creativeChat: "Chat de création hébergé",
    singleProvider: "Chat hébergé d’un seul fournisseur",
  },
  us: {
    title: "{{appName}}. Un chat hébergé avec le choix du filtrage",
    intro:
      "Changez de modèle au fil d’une conversation, sans configurer de clé API. Le catalogue compte {{modelCount}} modèles de chat, dont {{mainstream}} généralistes, {{open}} ouverts et {{uncensored}} sans censure. Pour accéder aux modèles sans censure, vous devez confirmer que vous avez au moins 18 ans.",
    price:
      "Vous disposez de {{guestCredits}} crédits gratuits par mois sans compte, ou de {{freeCredits}} avec un compte. Les forfaits commencent à {{subPrice}} par mois. Chaque requête consomme des crédits au tarif du modèle choisi.",
    privacy:
      "En mode incognito, l’historique reste dans votre navigateur. Un modèle hébergé reçoit tout de même la requête nécessaire pour répondre.",
    api: "L’accès aux API compatibles avec OpenAI et Anthropic commence à {{apiSubPrice}} par mois.",
    cta: "Posez la même question à deux modèles",
    ctaSubtitle:
      "Démarrez en mode incognito avec {{guestCredits}} crédits gratuits par mois. Choisissez un modèle et envoyez votre premier message.",
    start: "Ouvrir un chat incognito",
    models: "Découvrir les modèles sans censure",
  },
  platforms: {
    poe: {
      free: "Points gratuits chaque jour.",
      paid: "À partir de {{poeStart}} par mois",
      filter: "Règles de Poe et du bot",
      privacy: "Données traitées par Poe et les fournisseurs des bots",
      api: "API compatible OpenAI, points du forfait partagés",
      media: "Images, vidéo et audio",
      open: "Propriétaire",
      models:
        "Poe, un service hébergé de Quora, réunit GPT, Claude et Gemini, ainsi que les bots de la communauté. La même réserve de points sert au chat et aux médias, sans clé API à configurer.",
      price:
        "Les points gratuits sont renouvelés toutes les 24 heures et ne sont pas reportés. Le premier forfait payant affiche 10 000 points par jour. Une saisie, une réponse ou un contexte plus long peut coûter davantage, selon le bot.",
      pro: "Découvrez les bots de la communauté, invitez des personnes dans un chat de groupe ou publiez un bot. Les créateurs éligibles peuvent être rémunérés par message. Les abonnés utilisent les mêmes points dans le chat et l’API.",
      con: "Le nombre de requêtes dépend de votre réserve de points et du tarif du bot. Selon Poe, les fournisseurs et développeurs de bots peuvent recevoir les conversations et les fichiers envoyés. Le règlement de Poe s’ajoute à celui du bot.",
      fit: "vous voulez un catalogue de bots hébergé, des chats de groupe et une facture pour plusieurs fournisseurs.",
    },
    typingMind: {
      free: "Interface de base sans licence.",
      paid: "{{typingStandard}} à l’achat, plus l’utilisation des modèles",
      filter: "Règles du modèle et du fournisseur connecté",
      privacy:
        "Historique dans le navigateur par défaut, synchronisation facultative",
      api: "Se connecte à des API externes",
      media: "Images et voix selon la licence et le modèle",
      open: "Propriétaire, version statique auto-hébergeable avec licence",
      models:
        "TypingMind est une interface pour vos clés API ou vos points d’accès compatibles. Elle se connecte à GPT, Claude, Gemini et d’autres modèles. Avec une licence, elle peut conserver l’historique dans le navigateur.",
      price:
        "Standard coûte {{typingStandard}}, Extended {{typingExtended}}. Premium était affiché à {{typingPremium}} en promotion, pour un prix catalogue de {{typingList}}. L’utilisation des modèles et les extensions de stockage sont facturées séparément.",
      pro: "Premium ajoute des dossiers de projet et des réponses parallèles, avec un contexte distinct par modèle. Vous réglez les paramètres et utilisez les fournisseurs que vous payez déjà.",
      con: "La version gratuite ne conserve pas les chats. Vous gérez les clés et les factures. L’auto-hébergement requiert une licence et repose sur l’application compilée.",
      fit: "vous voulez payer directement vos fournisseurs et disposer d’un client configurable prêt à l’emploi.",
    },
    libreChat: {
      free: "Logiciel gratuit sous licence MIT.",
      paid: "Hébergement et modèles selon les besoins",
      filter: "Dépend de l’instance et du modèle",
      privacy:
        "Historique sur votre instance, requêtes envoyées aux modèles hébergés",
      api: "API des fournisseurs et Agents API en bêta",
      media: "Génération d’images via les outils configurés",
      open: "MIT, auto-hébergeable",
      models:
        "LibreChat se connecte notamment à OpenAI, Anthropic et OpenRouter. Installez-le sur votre serveur ou créez un compte pour essayer la démo publique.",
      price:
        "Le logiciel ne coûte rien. Comptez le serveur et les modèles payants à part. La démo publique sert à évaluer l’interface.",
      pro: "Vous pouvez modifier le code. LibreChat propose des agents, MCP, la recherche dans les fichiers, l’import de chats et plusieurs formats d’export.",
      con: "Vous gérez l’installation, les mises à jour et les sauvegardes. Pour les données sensibles et les conversations importantes, privilégiez votre propre instance.",
      fit: "vous voulez une interface adaptable pour plusieurs fournisseurs et pouvez administrer un serveur.",
    },
    openWebUi: {
      free: "Auto-hébergement gratuit sous licence.",
      paid: "Matériel, hébergement ou modèles selon les besoins",
      filter: "Dépend de l’instance et du modèle",
      privacy: "Mode hors ligne avec des modèles locaux",
      api: "Ollama et points d’accès compatibles OpenAI",
      media: "Images et voix via des intégrations",
      open: "Code disponible, conditions sur la marque",
      models:
        "Open WebUI s’installe chez vous et se connecte à Ollama ou à des API compatibles OpenAI. Avec un modèle local, le chat peut fonctionner entièrement hors ligne.",
      price:
        "Le logiciel est gratuit avec la marque du projet. Une licence distincte peut couvrir la personnalisation de la marque pour les déploiements de grande taille.",
      pro: "Le modèle tourne sur votre matériel, où vous pouvez aussi garder l’historique. La même interface accepte ensuite une API hébergée si besoin.",
      con: "Un modèle local exige du matériel adapté ou un serveur dédié. Si vous ouvrez l’accès à d’autres personnes, prévoyez la maintenance et vérifiez les règles sur la marque.",
      fit: "vous voulez une seule interface pour modèles locaux et hébergés, y compris hors ligne.",
    },
    openRouter: {
      free: "Certains modèles gratuits.",
      paid: "Paiement à l’usage",
      filter: "Règles du modèle et du fournisseur",
      privacy: "Traitement des données selon le fournisseur choisi",
      api: "API unifiée",
      media: "Dépend du modèle",
      open: "Hébergé, propriétaire",
      models:
        "OpenRouter Chat est l’interface web du catalogue OpenRouter. Soumettez la même demande à plusieurs modèles et comparez les réponses côte à côte.",
      price:
        "Les modèles payants sont facturés à l’usage. En formule Standard, une recharge par carte entraîne {{routerFee}} de frais, avec un minimum de {{routerMinimum}}. OpenRouter répercute les tarifs des fournisseurs.",
      pro: "Comparez les réponses et choisissez le fournisseur qui traite la requête. Le même solde sert aussi dans l’API.",
      con: "Le nombre de requêtes gratuites est limité. Le prix varie selon le modèle et le contexte. La conservation des données dépend du fournisseur.",
      fit: "vous voulez comparer de nombreux modèles dans le navigateur et payer à l’usage.",
    },
    venice: {
      free: "10 requêtes texte et 15 requêtes image par jour sur les modèles de base.",
      paid: "Pro à {{venicePro}} par mois",
      filter: "Filtre de contenu adulte désactivable à partir de Pro",
      privacy: "Historique local par défaut, protection selon le mode",
      api: "API facturée en crédits",
      media: "Images, vidéo, voix et musique",
      open: "Hébergé, propriétaire",
      models:
        "Venice héberge des modèles ouverts et propriétaires ainsi que des outils d’image, de vidéo et de son. Sa page de confidentialité distingue quatre modes de traitement avec des protections différentes.",
      price:
        "Pro coûte {{venicePro}} par mois avec des requêtes texte illimitées sur les modèles inclus. Certains modèles de pointe et la génération de médias consomment encore des crédits.",
      pro: "L’historique reste dans le navigateur par défaut. Pro propose des sauvegardes chiffrées et des modèles protégés par le matériel sur les routes compatibles.",
      con: "La formule gratuite a des limites quotidiennes. Certains modèles de pointe reçoivent les requêtes chez un fournisseur externe. Il faut au moins Pro pour désactiver le filtre adulte.",
      fit: "vous souhaitez régler le filtrage et garder l’historique en local dans une interface hébergée.",
    },
    nanoGpt: {
      free: "Un modèle gratuit sur le web.",
      paid: "À l’usage ou Pro à {{nanoPro}} par mois",
      filter: "Conditions et limites des modèles applicables",
      privacy: "Historique local, synchronisation facultative",
      api: "API avec solde prépayé ou quota compatible",
      media: "Images, vidéo et voix",
      open: "Hébergé, propriétaire",
      models:
        "NanoGPT propose des modèles généralistes et ouverts dans le navigateur et via une API. Rechargez votre solde sans abonnement ou choisissez un forfait avec un volume inclus.",
      price:
        "Pro coûte {{nanoPro}} par mois. Il comprend jusqu’à 60 millions de jetons d’entrée par semaine sur certains modèles ouverts et 100 images par jour sur quatre modèles inclus.",
      pro: "Le chat et l’API partagent le même solde. L’historique reste dans le navigateur par défaut et vous pouvez commencer avec un identifiant généré.",
      con: "La plupart des modèles propriétaires, la vidéo et la voix restent facturés sur le solde avec Pro. Les quotas inclus s’appliquent à une sélection de modèles.",
      fit: "votre consommation varie ou vous voulez un forfait surtout destiné aux modèles ouverts.",
    },
    chatGpt: {
      free: "Formule ChatGPT gratuite distincte.",
      paid: "Plus à {{plus}} par mois",
      filter: "Règles d’OpenAI",
      privacy: "Historique du compte et contrôle de l’entraînement",
      api: "API OpenAI facturée séparément",
      media: "Images et voix",
      open: "Hébergé, propriétaire",
      models:
        "ChatGPT Plus est l’abonnement hébergé d’OpenAI. Il associe les modèles de la marque aux conversations vocales, à l’analyse de fichiers, à la génération d’images et, selon disponibilité, à la recherche approfondie.",
      price:
        "OpenAI affiche Plus à {{plus}} par mois. Les limites peuvent évoluer et l’API a sa propre facturation.",
      pro: "Voix, fichiers et recherche sont accessibles dans la même application, avec un tarif mensuel clair.",
      con: "Des quotas peuvent s’appliquer. Le chat est limité à l’offre d’un seul fournisseur. Plus ne couvre pas l’usage général de l’API OpenAI.",
      fit: "vous utilisez avant tout les modèles OpenAI et les outils intégrés à ChatGPT.",
    },
  },
  posts: {
    poe: {
      metaTitle: "8 alternatives à Poe comparées (2026)",
      description:
        "Comparez les alternatives à Poe avec solde commun, paiement à l’usage ou clés API personnelles. Tarifs, limites et place de {{appName}}.",
      keywords:
        "alternatives à Poe, alternative à Poe AI, points Poe, Poe ou TypingMind, OpenRouter Chat, {{appName}}",
      title: "8 alternatives à Poe pour différents budgets",
      subtitle:
        "Gardez un chat hébergé, payez à l’usage ou installez votre interface. Huit options comparées, dont {{appName}}.",
      lead: "Poe est pratique quand on change souvent de modèle. Si une longue conversation vous coûte plus de points que prévu, comparez ce que vous paieriez pour ce même échange ailleurs. Un quota quotidien, un solde prépayé et une API facturée directement répondent à des usages différents.",
      overview: "Ce que propose Poe et comment le service facture",
      tradeoff:
        "Poe se distingue par son catalogue public de bots, la rémunération des créateurs et les chats de groupe. {{appName}} facture aussi en crédits. Comparez le prix d’un échange long sur les modèles que vous utilisez vraiment.",
      switch: {
        firstLink: "Renouvellements et quotas chez Poe",
        secondLink: "Poe face au paiement à l’usage",
        first:
          "Sur r/PoeAI, des abonnés ont signalé des changements de tarif au renouvellement et de quotas de points. Une personne envisageait de passer à OpenRouter avec TypingMind. Pour une autre, son ancien forfait restait intéressant.",
        second:
          "Dans un autre fil, une personne préférait OpenRouter pour la lisibilité des coûts. Une autre jugeait les points quotidiens de Poe plus intéressants pour un usage régulier. Ce sont des retours individuels. Le comparatif s’appuie sur les tarifs publiés par les fournisseurs.",
      },
      criteria: {
        cost: "Si vous utilisez beaucoup le chat par périodes, comparez la recharge à ce que vous coûte un abonnement pendant un mois tranquille. Si vous l’utilisez tous les jours, regardez combien d’échanges réels votre quota couvre.",
        workflow:
          "Listez les fonctions qui comptent en dehors du chat. Les bots publics et les groupes peuvent justifier de garder Poe. Pour comparer des réponses, cherchez l’affichage en parallèle ou le changement de modèle dans un même fil.",
      },
      faq: {
        best: {
          q: "Quelle est la meilleure alternative à Poe ?",
          a: "Essayez {{appName}} pour un chat hébergé avec des modèles généralistes et sans censure. OpenRouter Chat et NanoGPT conviennent au paiement à l’usage. TypingMind accepte vos clés, et Open WebUI se prête à un usage local.",
        },
        free: {
          q: "Existe-t-il une alternative gratuite à Poe ?",
          a: "{{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte. OpenRouter propose certains modèles gratuits. LibreChat et Open WebUI sont gratuits pour un auto-hébergement classique. Le matériel, l’hébergement et les modèles payants peuvent engendrer des frais.",
        },
        billing: {
          q: "Quelles alternatives à Poe facturent à l’usage ?",
          a: "OpenRouter et NanoGPT débitent un solde prépayé. TypingMind et LibreChat se connectent aux services que vous payez directement. Le coût dépend du modèle, de la longueur du contexte et de la fréquence des échanges.",
        },
        privacy: {
          q: "Quelle alternative garde mes conversations en local ?",
          a: "Open WebUI peut tourner hors ligne avec un modèle local. TypingMind garde par défaut l’historique en local avec une licence. Venice, NanoGPT et {{appName}} en mode incognito peuvent conserver l’historique sur votre appareil tout en transmettant la requête à un modèle hébergé.",
        },
        switching: {
          q: "Faut-il garder Poe pour les bots de la communauté ?",
          a: "Souvent, oui. D’autres apps ont leurs propres agents et outils. Poe réunit un catalogue public, des chats de groupe et une rémunération des créateurs. Avant de changer, vérifiez que le nouveau service couvre les usages qui comptent pour vous.",
        },
      },
    },
  },
};
