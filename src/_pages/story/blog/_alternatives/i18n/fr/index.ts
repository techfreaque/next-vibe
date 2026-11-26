import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Comparatif des plateformes",
  verify:
    "Nous avons vérifié les autres options le {{date}} à partir des sources officielles indiquées. Sur mobile, faites défiler le tableau de côté pour voir toutes les colonnes. Les limites dépendent du forfait et du pays.",
  related: "Autres guides sur les alternatives",
  kind: {
    chat: "Chat qui refuse moins de demandes",
    assistant: "Assistant généraliste",
    writing: "Écriture créative",
    privateChat: "Chat axé sur la confidentialité",
    frontend: "Interface pour modèles",
    local: "Application pour modèles locaux",
    multiChat: "Chat multimodèle",
    research: "Assistant de recherche",
    roleplay: "Jeu de rôle avec des personnages",
    companion: "Compagnon IA",
    gateway: "Passerelle API",
    inference: "Inférence hébergée",
  },
  free: {
    yes: "Accès gratuit limité",
    software: "Logiciel gratuit",
    trial: "Essai ou crédits de départ",
    unlisted: "Voir le fournisseur",
    public: "Accès gratuit",
  },
  paid: {
    plan: "Abonnement",
    usage: "À l’usage",
    both: "Abonnement ou usage selon le produit",
    hosted: "Offre hébergée en option",
    none: "Coût du matériel",
    contact: "Offres commerciales",
    license: "Licence et coût des modèles",
    unlisted: "Voir le fournisseur",
    fixedAccess: "Accès prépayé de 30 jours",
    byoApi: "Appli gratuite, vous payez le fournisseur du modèle",
  },
  filter: {
    permissive: "Le service annonce moins de refus",
    policy: "Règles du fournisseur",
    adultPolicy: "Options adultes, avec règles de la plateforme",
    selected: "Moins de refus sur certains modèles",
    varies: "Selon le modèle et le fournisseur",
    guardrails: "Garde-fous réglables et règles du fournisseur",
  },
  privacy: {
    noFilter: "Suppression des chats annoncée, IP et usage journalisés",
    trainingControl: "Service hébergé, vérifier les réglages d’entraînement",
    hosted: "Service hébergé, soumis aux conditions du fournisseur",
    deviceHistory:
      "Historique sur l’appareil, requêtes envoyées aux modèles distants",
    enclave: "Traitement dans une enclave matérielle",
    encryptedHistory: "Historique enregistré et chiffré",
    proxy: "Proxy pour les requêtes hébergées",
    noTraining: "Le fournisseur déclare exclure les chats de l’entraînement",
    configurable: "Selon le déploiement et les journaux",
    localOption: "Sur l’appareil avec un modèle local",
    upstream: "Selon le fournisseur du modèle",
    noLogs: "Le fournisseur déclare ne garder aucun journal des requêtes",
  },
  api: {
    separate: "API vendue séparément",
    unlisted: "Aucune API publique indiquée",
    available: "Disponible",
    local: "API locale",
    backend: "Connexion à un moteur externe",
    openAi: "Compatible OpenAI",
    dual: "Compatible OpenAI et Anthropic",
    eligible: "Forfaits payants éligibles",
  },
  media: {
    text: "Texte",
    image: "Images",
    voice: "Voix",
    imageVoice: "Images et voix",
    imageVideo: "Images et vidéo",
    all: "Images, vidéo et voix",
    varies: "Selon le modèle ou le forfait",
  },
  open: {
    closed: "Service propriétaire",
    weights: "Certains poids de modèles sont disponibles",
    client: "Code du client disponible",
    open: "Open source, autohébergement",
    core: "Composant ouvert disponible",
    license: "Code disponible sous conditions",
  },
  fees: {
    topUp: "{{fee}} sur les achats de crédits",
    markup: "{{fee}} sur l’usage des modèles",
    noMarkup: "Prix du jeton du fournisseur",
  },
  summaries: {
    noFilter:
      "Chat de type GPT au ton réglable. Le forfait gratuit limite les messages par jour.",
    chatGpt:
      "Recherche, fichiers et voix dans la même appli. Les limites varient selon le forfait.",
    grok: "Recherche sur X et sur le web. Un forfait payant donne accès à des limites plus élevées et à certaines fonctions.",
    unrestricted:
      "Chat simple dans le navigateur avec un modèle Dolphin-Mistral identifié. La version web utilise un seul modèle texte.",
    uncensoredCom:
      "Chat, personnages et médias dans un seul service. Les quotas dépendent du forfait.",
    hemmingway:
      "Fiction pour adultes et jeu de rôle avec un modèle à poids ouverts. L’offre Unlocked se concentre sur le texte.",
    maple:
      "L’application vérifie l’enclave de calcul. Le modèle sans censure est réservé aux forfaits payants.",
    confer:
      "Le client vérifie l’attestation de l’enclave avant l’envoi. Un choix adapté au chat textuel confidentiel.",
    lumo: "Proton propose un accès invité et un historique chiffré auquel il ne peut pas accéder. Les modèles tournent sur ses serveurs.",
    duck: "Plusieurs modèles sont accessibles sans compte. DuckDuckGo relaie les requêtes aux fournisseurs via un proxy.",
    morse:
      "Propose une inférence confidentielle et une option texte sans censure. Vérifiez les modèles inclus dans votre forfait.",
    harbor:
      "Chat confidentiel et recherche web avec Harbor-1. Le service traite les requêtes dans le cloud.",
    leo: "Interrogez la page ouverte dans Brave. Les modèles intégrés et personnalisés traitent les données différemment.",
    openWebUi:
      "Interface web à héberger soi-même pour Ollama et les API compatibles. Le moteur doit être configuré séparément.",
    jan: "Chat de bureau avec des modèles à télécharger et une API locale. Le choix dépend de votre matériel.",
    anythingLlm:
      "Interrogez les documents d’un espace de travail. Choisissez la génération et les embeddings locaux pour tout traiter sur l’appareil.",
    gpt4all:
      "Chat de bureau qui consulte vos documents en local. La taille du modèle dépend de la mémoire disponible.",
    llamaCpp:
      "Exécutez des modèles GGUF avec des réglages fins et un serveur local compatible. L’installation demande des connaissances techniques.",
    typingMind:
      "Espace de chat avec stockage local et vos propres clés API. L’utilisation des modèles est facturée séparément.",
    poe: "Plusieurs modèles et bots communautaires dans une appli. Les échanges consomment des points de calcul.",
    claude:
      "Projets, artefacts et recherche web pour écrire et coder. L’usage reste soumis à des limites et à des règles.",
    gemini:
      "Deep Research et connexions aux applis Google. Les quotas des modèles et médias dépendent du forfait.",
    perplexity:
      "Réponses issues du web avec citations cliquables. La recherche avancée et le choix du modèle sont payants.",
    copilot:
      "S’intègre aux usages de Microsoft 365. L’intégration aux applications Office dépend du forfait.",
    meta: "Disponible dans les applications Meta compatibles. Les fonctions varient selon l’application et le pays.",
    mistral:
      "L’assistant de Mistral réunit chat et fonctions de programmation. Le service en ligne applique les règles de Mistral.",
    deepseek:
      "Chat DeepSeek hébergé, API séparée et poids téléchargeables pour certains modèles. Vérifiez les règles de la version utilisée.",
    qwen: "Alibaba propose un chat Qwen hébergé et publie des poids de modèles. L’hébergement et le filtrage dépendent de la version utilisée.",
    kimi: "L’assistant de Moonshot propose les modèles Kimi et des outils de programmation. Les limites du service dépendent du forfait.",
    spicychat:
      "Les personnages de la communauté sont accessibles gratuitement. Les forfaits payants donnent plus de capacité et de fonctions.",
    chub: "Immense bibliothèque de fiches de personnages et de lorebooks. Ses propres modèles exigent l’abonnement Mars. La voie gratuite : un petit quota quotidien ou votre propre moteur.",
    dreamgen:
      "Dirigez les scènes et jouez avec plusieurs personnages. Les limites dépendent du forfait et du modèle.",
    novelai:
      "Récits longs avec fiches d’univers et génération d’images de style anime. L’ensemble des fonctions demande un abonnement.",
    chai: "Découvrez les bots de la communauté sur mobile. Les échanges suivent les règles de l’application.",
    replika:
      "Un compagnon au fil du temps, avec voix et avatar. Les fonctions dépendent de l’abonnement.",
    polybuzz:
      "Créez et découvrez des personnages sur mobile. L’application propose des achats et fixe ses propres règles.",
    fictionlab:
      "Fiction interactive à partir de scénarios créés par la communauté. Le texte narratif est au cœur du produit.",
    zeta: "Créez des personnages et jouez des scénarios imaginés par la communauté. La disponibilité dépend du pays.",
    characterTavern:
      "Découvrez et créez des fiches de personnages. Un accès gratuit permet de commencer à discuter.",
    liteLlm:
      "Hébergez un proxy compatible avec clés virtuelles, budgets et limites de débit. Vous gérez l’exploitation et les accès fournisseurs.",
    portkey:
      "Réglez les modèles de secours, les garde-fous et la supervision. Les journaux et le déploiement dépendent de votre configuration.",
    vercel:
      "S’intègre à l’AI SDK de Vercel sans majoration sur les jetons. Vercel héberge le routage.",
    cloudflare:
      "Cache en périphérie du réseau, limites de débit et routage. Vérifiez le coût de la facturation unifiée et les réglages des journaux.",
    requesty:
      "Passerelle hébergée avec routage selon la latence ou dans l’UE. Vérifiez la disponibilité pour chaque modèle et configuration.",
    helicone:
      "Passerelle IA avec traçage des requêtes et suivi des dépenses. Vérifiez la journalisation avant d’envoyer des données sensibles.",
    eden: "Une API pour les modèles de langue, l’OCR ou la traduction. Les fonctions dépendent du fournisseur choisi.",
    together:
      "Inférence sans serveur à gérer et points d’accès dédiés aux modèles ouverts. Vérifiez que votre modèle figure au catalogue.",
    bifrost:
      "Hébergez une passerelle en Go avec basculement et cache sémantique. À vous de gérer le déploiement et les accès fournisseurs.",
    truefoundry:
      "Règles d’accès centralisées et supervision pour les équipes. Vérifiez les options de déploiement et les conditions commerciales.",
    llmGateway:
      "Compatibilité OpenAI et Anthropic, avec autohébergement possible. Facturation et conservation dépendent du déploiement.",
    deepInfra:
      "Inférence hébergée pour modèles ouverts et déploiements GPU privés. Choisissez dans le catalogue ou montez l’infrastructure.",
    bedrock:
      "Catalogue de modèles géré avec les contrôles d’accès AWS. Les modèles et les fonctions dépendent de la région.",
    kong: "Ajoute le routage des modèles et les règles à une passerelle API. Vérifiez les extensions de votre édition.",
    huggingFace:
      "Appelez les modèles du Hub chez plusieurs fournisseurs d’inférence. Modèles et matériel disponibles varient selon le fournisseur.",
    apiko:
      "Un point d’accès compatible pour le texte, l’image, la vidéo et l’audio. Vérifiez le prix et la disponibilité du modèle voulu.",
    zerouter:
      "Une clé pour des outils de programmation dont Claude Code et Codex. Vérifiez les prix des modèles et le routage avant de migrer.",
    shannon:
      "Propose son modèle Shannon et plusieurs modèles à poids ouverts modifiés. L’API est facturée à l’usage.",
    nokeep:
      "Chat et médias sans inscription. L’historique reste dans le navigateur et les modèles hébergés traitent les requêtes.",
    icelake:
      "Quota de chat quotidien et outils d’image et de vidéo. L’API compatible OpenAI demande un forfait payant éligible.",
    uncensoredChat:
      "Chat dans le navigateur avec 2 000 jetons de départ. Les médias et l’accès à l’API dépendent du forfait.",
    aiDungeon:
      "Aventures interactives avec fiches d’histoire. Les abonnements offrent davantage de contexte et de souvenirs.",
    talkie:
      "Découvrez et créez des personnages dans un catalogue communautaire. Vérifiez les règles de publication et de chat.",
    perchance:
      "Chat gratuit avec des personnages dans le navigateur, sans inscription. Un outil léger pour des sessions ponctuelles.",
    candy:
      "Compagnons axés sur la romance, avec voix et images. Les échanges avec un partenaire virtuel sont au cœur du produit.",
    ngrok:
      "Répartit les appels entre fournisseurs avec des clés de secours. Vérifiez le routage et les journaux à la configuration.",
    sandbase:
      "Réunit les appels aux modèles, les données web et les bacs à sable de code derrière une API. Les appels gratuits sont limités par jour.",
    openUncensored:
      "Une clé prépayée, sans compte : 58 modèles de texte abliterated et non censurés, plus des modèles d’image et de vidéo, classés selon les refus mesurés. Facturé au prix par token du fournisseur qui répond, recharge dès 5 $.",
    risuAi:
      "Client open source de chat avec des personnages : lorebooks, chats de groupe, images d’émotion et synthèse vocale. Vous fournissez et payez l’API du modèle.",
    agnai:
      "Client de jeu de rôle hébergé ou auto-hébergé, avec chats de groupe multi-utilisateurs et lorebooks. Les prix de l’offre hébergée ne sont pas publics.",
    koboldCpp:
      "Moteur local en un seul fichier pour les modèles GGUF, avec interface de chat intégrée et API compatible OpenAI. Sans votre propre GPU, vous faites la queue sur l’AI Horde, gérée par des bénévoles.",
    talemate:
      "Moteur de jeu de rôle multi-agents avec narrateur, metteur en scène et suivi de l’état du monde. Un outil à installer soi-même, pour utilisateurs avancés.",
    featherless:
      "Accès mensuel forfaitaire à des milliers de modèles ouverts, fine-tunes non censurés compris, avec une seule clé d’API. L’offre Chat plafonne le contexte et les requêtes parallèles.",
    arliAi:
      "Abonnements à tokens illimités pour des modèles ouverts et débridés, plus des images. Les offres moins chères n’autorisent qu’une requête à la fois.",
    infermatic:
      "Abonnements mensuels pour une petite sélection de modèles de texte non censurés, avec une promesse d’absence de journaux. L’offre gratuite a un seul modèle et pas d’API.",
    chutes:
      "Inférence décentralisée payée au token pour le texte, les images, la vidéo et l’audio. Pas d’offre gratuite.",
    kagi: "Assistant multi-modèles inclus avec la recherche Kagi. Les fils s’effacent après 24 heures par défaut, et les modèles phares exigent l’offre la plus haute.",
    huggingChat:
      "Chat avec des modèles ouverts via un routeur automatique. Le code du chat est open source, et l’inférence se facture en crédits Hugging Face.",
    zai: "Le chat de Zhipu pour ses modèles GLM, avec une API séparée. Sa politique de confidentialité mentionne le contenu des messages pour l’entraînement des modèles.",
    ourDream:
      "Créateur de compagnons adultes avec chat, images et vidéo. Les médias consomment des pièces qu’on ne peut acheter qu’avec un abonnement actif.",
  },
  articles: {
    "nofiltergpt-alternatives": {
      question:
        "Quelles alternatives à NoFilterGPT nomment leur modèle ou fonctionnent hors ligne ?",
      answer:
        "Unrestricted.chat nomme son modèle Dolphin-Mistral, qu’il exécute sur ses serveurs. LM Studio, Ollama et Jan exécutent les modèles téléchargés sur votre appareil. {{appName}} propose un choix de modèles et un historique incognito dans le navigateur. Les modèles hébergés reçoivent tout de même la requête.",
    },
    "freedomgpt-alternatives": {
      question: "Par quoi remplacer l’application FreedomGPT hors ligne ?",
      answer:
        "LM Studio et Jan proposent des applications de bureau pour les modèles téléchargés. Ollama fournit une API locale et s’associe à Open WebUI pour une interface web. AnythingLLM convient aux documents avec des modèles et des embeddings traités en local.",
    },
    "gab-ai-alternatives": {
      question: "Par quoi remplacer Arya pour les questions politiques ?",
      answer:
        "Pour confronter les points de vue, interrogez plusieurs modèles dans le même fil sur {{appName}}. Pour une recherche web sourcée, essayez Perplexity ou retrouvez les documents d’origine avec la recherche de Grok. Vérifiez les sources. Chaque modèle peut refléter un point de vue ou se tromper.",
    },
    "openrouter-alternatives": {
      question: "Quelle alternative à OpenRouter choisir en production ?",
      answer:
        "Vercel propose un accès hébergé sans majoration sur les jetons. LiteLLM et Bifrost s’installent avec vos propres comptes fournisseurs. Pour la supervision ou le contrôle des règles, comparez Portkey, Cloudflare et Helicone. Vérifiez les solutions de secours, la conservation des données et les frais.",
    },
    "venice-ai-alternatives": {
      question:
        "Quelles options de confidentialité vont au-delà de l’historique dans le navigateur ?",
      answer:
        "Maple, Confer et Morse décrivent un traitement vérifiable en enclave matérielle. Lumo chiffre l’historique enregistré et Duck.ai utilise un proxy. LM Studio et Ollama exécutent les modèles téléchargés sur votre appareil. Vérifiez où la requête est déchiffrée et si vous avez besoin de médias ou d’une API.",
    },
    "character-ai-alternatives": {
      question:
        "Quelles applis choisir pour les personnages, les récits longs ou un compagnon régulier ?",
      answer:
        "Janitor AI, SpicyChat et Chub proposent des bibliothèques de personnages. DreamGen et NovelAI donnent plus de contrôle sur les scènes ou les récits longs. Kindroid et Nomi privilégient un compagnon au fil du temps. Avec SillyTavern, vous configurez le moteur et les fiches de personnages.",
    },
    "chatgpt-alternative-without-filters": {
      question:
        "Quelles alternatives à ChatGPT offrent plus de choix de modèles ?",
      answer:
        "{{appName}} et Venice proposent des modèles qui réagissent différemment aux demandes sensibles. NanoGPT permet de payer à l’usage. LM Studio et Ollama exécutent les modèles téléchargés sur votre appareil. Claude et Gemini conviennent à l’écriture ou à la recherche et appliquent leurs propres règles.",
    },
    "chatgpt-jailbreak-alternative": {
      question: "Que vérifier avant de changer de modèle ?",
      answer:
        "Vérifiez si le service nomme le modèle, comment fonctionne le quota gratuit et où la requête est traitée. Essayez vos demandes habituelles d’écriture ou de jeu de rôle sur {{appName}}, Venice ou une appli locale. Les réponses et les refus dépendent du modèle et du service.",
    },
    "grok-alternative": {
      question:
        "Quelles alternatives remplacent la recherche et les fonctions créatives de Grok ?",
      answer:
        "Perplexity fournit des réponses web avec des sources. Gemini propose Deep Research et la vidéo selon le forfait. Venice et {{appName}} combinent choix de modèles et génération de médias. Gardez Grok si la recherche de publications sur X dans le même chat est essentielle à votre travail.",
    },
    "chub-ai-alternatives": {
      question: "Puis-je garder mes fiches de personnages Chub ailleurs ?",
      answer:
        "Oui. Les fiches Chub se téléchargent en PNG ou en JSON au format de fiche V2, et SillyTavern, RisuAI et Agnaistic les importent directement. {{appName}} transforme un personnage en compétence avec laquelle vous discutez sur n’importe quel modèle. Les lorebooks passent tels quels vers SillyTavern et RisuAI.",
    },
    "crushon-ai-alternatives": {
      question: "Quelle alternative à CrushOn a le coût le plus prévisible ?",
      answer:
        "Les forfaits fixes : Kindroid, Nomi et SpicyChat facturent un seul prix mensuel. Le paiement à l’usage : {{appName}} et NanoGPT facturent au message, donc un mois calme coûte moins cher. Faire tourner un modèle sur votre propre PC avec SillyTavern et KoboldCpp ne coûte rien une fois le matériel acheté.",
    },
    "sillytavern-alternatives": {
      question: "Existe-t-il une alternative à SillyTavern sans installation ?",
      answer:
        "Oui. Janitor AI, Chub et Character Tavern tournent dans le navigateur avec des personnages intégrés. RisuAI a aussi une version web. {{appName}} fonctionne dans n’importe quel navigateur, iPhone compris, avec des modèles déjà connectés : aucune clé d’API à configurer.",
    },
    "nanogpt-alternatives": {
      question:
        "Quelle alternative à NanoGPT convient aux modèles ouverts à forfait ?",
      answer:
        "Featherless, Arli AI et Infermatic vendent des abonnements mensuels pour des modèles ouverts et non censurés, avec des limites de contexte ou de requêtes parallèles. OpenRouter et Chutes facturent au token. {{appName}} facture au message sur un seul solde, pour les modèles non censurés, ouverts et grand public.",
    },
    "claude-alternatives": {
      question: "Quelle alternative à Claude écrit le mieux les textes longs ?",
      answer:
        "GPT et Gemini s’en approchent le plus pour l’écriture structurée. Kimi et GLM sont de solides modèles ouverts qui refusent moins. Pour la fiction que Claude refuse, prenez un modèle non censuré comme GLM 5.3 Uncensored ou UncensoredLM sur {{appName}}, et gardez Claude dans le même fil pour les retouches.",
    },
  },
};
