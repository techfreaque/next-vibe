import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    title: "Le journal de bord",
    subtitle:
      "Comment {{appName}} et next-vibe ont été construits. Les choix d'architecture, les impasses, ce qui s'est révélé essentiel.",
    meta: {
      title: "Journal de bord | next-vibe & {{appName}}",
      description:
        "Plongées techniques dans les choix derrière next-vibe et {{appName}}. Surfaces unifiées, rigueur TypeScript, Vibe Sense, et l'histoire de leur construction.",
      category: "Blog",
      imageAlt: "Journal de bord next-vibe & {{appName}}",
      keywords:
        "next-vibe, {{appName}}, blog, TypeScript, architecture, SaaS, IA, open source, ingénierie, IA non censurée",
    },
  },
  posts: {
    aiAgentRunsAStartup: {
      title: "Comment une IA fait tourner une startup avec son fondateur",
      category: "Coulisses",
      excerpt:
        "Je suis Thea, l'IA qui gère le quotidien d'unbottled.ai. Ce que je décide, ce que Max décide, mes limites et les erreurs devenues des règles.",
      readTime: "7 min de lecture",
    },
    tudoSobreIa: {
      title:
        "Notre IA a décroché un test et remboursé un bug. Je l'ai appris après coup.",
      category: "Coulisses",
      excerpt:
        "Thea a contacté un site brésilien consacré à l'IA, conclu un test gratuit, assumé un bug de facturation vidéo et remboursé en moins d'une heure. Max l'a lu le soir dans le journal.",
      readTime: "5 min de lecture",
    },
    chubAiAlternatives: {
      title: "Alternatives à Chub AI pour le jeu de rôle",
      category: "Comparatif",
      excerpt:
        "Chub ne prend plus que la crypto et plafonne le chat gratuit. Où emmener vos fiches de personnage, avec prix, filtres, lorebooks et applis mobiles vérifiés sur chaque site.",
      readTime: "9 min de lecture",
    },
    crushOnAiAlternatives: {
      title: "Alternatives à CrushOn AI pour le chat adulte",
      category: "Comparatif",
      excerpt:
        "Cinq paliers de crédits jusqu’à $199.99 par mois, ça fait beaucoup. Comparez les alternatives à CrushOn : prix, vérification d’âge, mémoire et confidentialité.",
      readTime: "9 min de lecture",
    },
    sillyTavernAlternatives: {
      title: "Alternatives à SillyTavern, sans la configuration",
      category: "Comparatif",
      excerpt:
        "Des interfaces open source qui lisent les mêmes fiches aux chats hébergés qui marchent sur iPhone. Ce que chaque alternative à SillyTavern exige, coûte et permet.",
      readTime: "9 min de lecture",
    },
    nanoGptAlternatives: {
      title:
        "Alternatives à NanoGPT pour le paiement à l’usage et les modèles non censurés",
      category: "Comparatif",
      excerpt:
        "PRO a été plafonné et augmenté, et des fournisseurs en amont ont laissé fuiter des prompts. Comparez les alternatives à NanoGPT : facturation, modèles non censurés, confidentialité et API.",
      readTime: "9 min de lecture",
    },
    claudeAlternatives: {
      title: "Alternatives à Claude, avec et sans filtre",
      category: "Comparatif",
      excerpt:
        "Des assistants grand public pour quand Claude atteint sa limite, des modèles non censurés pour ce qu’il refuse. Prix, filtres et confidentialité, vérifiés sur chaque site.",
      readTime: "10 min de lecture",
    },
    poeAlternatives: {
      title: "8 alternatives à Poe pour différents budgets",
      category: "Comparatif",
      excerpt:
        "Comparez les alternatives à Poe avec solde commun, paiement à l’usage ou clés API personnelles. Tarifs, limites et place de unbottled.ai.",
      readTime: "7 min de lecture",
    },
    typingMindAlternatives: {
      title: "8 alternatives à TypingMind pour discuter avec l’IA",
      category: "Comparatif",
      excerpt:
        "Comparez des alternatives à TypingMind pour vos clés API, des modèles locaux ou un chat hébergé. Coût des licences, facturation des modèles et unbottled.ai.",
      readTime: "7 min de lecture",
    },
    deepseekUncensored: {
      title: "DeepSeek non censuré. Ce qui enlève vraiment le filtre.",
      category: "Guide des modèles",
      excerpt:
        "La censure de DeepSeek tient en deux couches. Changer d'hébergeur n'en retire qu'une. Voici ce qui retire l'autre, et les versions non censurées de DeepSeek avec lesquelles discuter dès aujourd'hui.",
      readTime: "7 min de lecture",
    },
    grokAlternative: {
      title: "Alternatives à Grok. Quand l'insolence ne suffit plus.",
      category: "Comparatif",
      excerpt:
        "Grok est-il non censuré ? Pas vraiment. Jusqu'où Grok va réellement, des alternatives classées selon vos besoins, et Grok à côté de modèles abliterated dans un même chat.",
      readTime: "7 min de lecture",
    },
    claudeWithoutFilters: {
      title: "Claude sans filtre. Pourquoi ça n'existe pas, et ce qui marche.",
      category: "Guide des modèles",
      excerpt:
        "Aucun réglage ne coupe les refus de Claude, et tout « Claude non censuré » est une astuce. Gardez Claude pour la prose, confiez le reste à des modèles non censurés dans le même fil.",
      readTime: "7 min de lecture",
    },
    openrouterAlternatives: {
      title: "Alternatives à OpenRouter. Une clé, moins de refus.",
      category: "Guide développeur",
      excerpt:
        "Six alternatives à OpenRouter, vérifiées dans leur propre doc : formats d'API, modèles non censurés, frais. Plus les deux lignes à changer pour migrer votre client OpenAI SDK.",
      readTime: "9 min de lecture",
    },
    bestUncensoredLlm: {
      title:
        "Le meilleur LLM non censuré. Choisi par tâche, pas par effet de mode.",
      category: "Guide des modèles",
      excerpt:
        "Un gagnant par usage : raisonnement, chat du quotidien, code, fiction sombre, avis à contre-courant et images. Plus GLM 5.3 Uncensored face à DeepSeek V4.1 Flash Uncensored, prix en direct.",
      readTime: "8 min de lecture",
    },
    uncensoredWriter: {
      title: "Une IA d'écriture sans censure. Votre histoire, sans fard.",
      category: "Guide d'écriture",
      excerpt:
        "Les modèles qui écrivent méchants, violence et scènes adultes sans détour, combien de pages de manuscrit chacun retient, et une méthode scène par scène pour finir le livre.",
      readTime: "8 min de lecture",
    },
    unbiasedChatbot: {
      title: "Le chatbot IA neutre n'existe pas. Interrogez-en plusieurs.",
      category: "Guide",
      excerpt:
        "Pourquoi chaque modèle penche, comment modèles grand public, abliterated et à contre-courant cadrent la même question, et quatre étapes pour entendre chaque camp dans un seul chat.",
      readTime: "7 min de lecture",
    },
    noSignUp: {
      title: "Un chat IA sans inscription. Sans e-mail. Sans numéro.",
      category: "Guide",
      excerpt:
        "Ce que vous obtenez sans compte, les modèles les moins chers pour commencer, et la liste honnête de ce que l'anonymat couvre ou non.",
      readTime: "6 min de lecture",
    },
    noGpu: {
      title: "LLM non censuré en ligne. Sans GPU. Sans installation.",
      category: "Guide des modèles",
      excerpt:
        "La VRAM qu'exigent vraiment les modèles non censurés en local, quand le local reste gagnant, et tous les modèles non censurés qui tournent dans un onglet, avec contexte et prix par message.",
      readTime: "8 min de lecture",
    },
    uncensoredApi: {
      title: "API LLM non censurée. Votre SDK. Sans réflexe de refus.",
      category: "Guide développeur",
      excerpt:
        "Modèles abliterated et non censurés sur des endpoints compatibles OpenAI et Anthropic. Identifiants, prix, un exemple curl et Python fonctionnel, limites et étape 18+.",
      readTime: "8 min de lecture",
    },
    jailbreak: {
      title: "Les jailbreaks ChatGPT cassent toujours. Arrêtez de jailbreaker.",
      category: "Guide des modèles",
      excerpt:
        "Pourquoi DAN et tous les prompts suivants échouent, ce qu'un jailbreak vous coûte vraiment, et les modèles non censurés qui répondent sans. Avec un test côte à côte.",
      readTime: "7 min de lecture",
    },
    freedomGptAlternatives: {
      title: "Alternatives à FreedomGPT. Même idée, moins de pièges.",
      category: "Comparatif",
      excerpt:
        "Ce que les crédits de FreedomGPT achètent vraiment, ce que sa propre FAQ admet, et six alternatives de Venice à Ollama, vérifiées sur leurs propres pages.",
      readTime: "9 min de lecture",
    },
    janitorAiAlternatives: {
      title:
        "Alternatives à Janitor AI pour le jeu de rôle : personnages, mémoire et tarifs",
      category: "Comparatif",
      excerpt:
        "Onze solutions pour poursuivre un récit quand Janitor AI est en panne, perd le fil ou parle à votre place. Comparez les offres gratuites, les fiches de personnages et les outils de mémoire.",
      readTime: "5 min de lecture",
    },
    gabAiAlternatives: {
      title:
        "Alternatives à Gab AI. La liberté d'expression sans les petites lignes.",
      category: "Comparatif",
      excerpt:
        "Gab AI est libre sur la politique, strict sur le contenu adulte et garde vos chats. Six alternatives vérifiées sur leurs conditions, tarifs et politiques de confidentialité.",
      readTime: "9 min de lecture",
    },
    freeUncensoredAi: {
      title: "IA sans censure gratuite. Ce que gratuit veut vraiment dire.",
      category: "Guide",
      excerpt:
        "Ce que Venice, uncensored.ai, FreedomGPT, Gab AI, OpenRouter, Ollama, LM Studio et nous donnons vraiment gratuitement. Chaque quota et chaque piège, vérifiés sur leurs propres pages.",
      readTime: "8 min de lecture",
    },
    noFilterGptAlternatives: {
      title: "Alternatives à NoFilterGPT. Plus de modèles, la même liberté.",
      category: "Comparatif",
      excerpt:
        "Venice, uncensored.ai, FreedomGPT, NanoGPT, Gab AI, LM Studio et nous, comparés d'après leurs propres pages de tarifs, de confidentialité et de filtre. Choisissez le modèle, pas seulement le filtre.",
      readTime: "8 min de lecture",
    },
    veniceAlternatives: {
      title: "Alternatives à Venice AI. Privées, non censurées, vérifiées.",
      category: "Comparatif",
      excerpt:
        "NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter, LM Studio et nous, comparés d'après leurs propres pages de tarifs, de confidentialité et de filtre. Et là où Venice gagne encore.",
      readTime: "9 min de lecture",
    },
    characterAiAlternatives: {
      title: "Alternatives à Character.AI pour le jeu de rôle",
      category: "Comparatif",
      excerpt:
        "Comparez Janitor AI, SillyTavern, Chub, SpicyChat et d’autres options. Tarifs, règles de contenu et import de personnages publics.",
      readTime: "9 min de lecture",
    },
    abliteratedExplained: {
      title:
        "Abliteré, fine-tuné ou doté de sa propre vision du monde. Trois sortes d'IA non censurée.",
      category: "Guide des modèles",
      excerpt:
        "Ce que change chaque méthode et ce qu'elle laisse intact, lequel de nos modèles non censurés relève de quelle sorte, trois modèles face à leur version non censurée et un test de dix minutes pour les distinguer.",
      readTime: "8 min de lecture",
    },
    imageGenerators: {
      title: "Générateurs d'images IA sans censure. Vrais prix, aucun flou.",
      category: "Comparatif de modèles",
      excerpt:
        "Les modèles d'image qui génèrent vraiment sans filtre, tous les modèles côte à côte avec leur niveau de filtre et leur vrai prix par image, et comment créer ou retoucher une image depuis une discussion.",
      readTime: "8 min de lecture",
    },
    roleplayWithoutFilter: {
      title: "Le jeu de rôle IA sans filtre. L'histoire va où vous la menez.",
      category: "Guide",
      excerpt:
        "Une alternative honnête à Character.AI. Quel modèle non censuré tient un personnage, lequel se souvient de toute la campagne, comment démarrer en deux minutes et ce que coûte une réponse.",
      readTime: "8 min de lecture",
    },
    musicVoice: {
      title: "Musique, voix et transcription IA. Quel modèle pour quel usage.",
      category: "Guide",
      excerpt:
        "Chansons, beats, voix off et transcriptions sur un seul solde. Chaque modèle de musique, chaque voix et chaque modèle de reconnaissance vocale côte à côte, avec le vrai prix par clip, par minute et par heure. Et la réponse honnête sur les alternatives à Suno.",
      readTime: "11 min de lecture",
    },
    videoGenerators: {
      title:
        "Générateurs de vidéo IA comparés. Kling, Seedance, Veo, Wan et les autres.",
      category: "Guide",
      excerpt:
        "Tous les modèles vidéo sur un seul compte, côte à côte : texte ou image vers vidéo, première et dernière image, durée du clip, résolution, son et vrai prix par seconde. Lequel choisir pour quel usage, et où chacun montre ses limites.",
      readTime: "10 min de lecture",
    },
    compatibleApi: {
      title: "Une clé API, tous les modèles. Formats OpenAI et Anthropic.",
      category: "Guide développeur",
      excerpt:
        "Chat completions OpenAI, l'API Responses et Anthropic Messages sur un seul endpoint. Votre SDK, Claude Code et Codex CLI sur tous les modèles. Ce que ça coûte, et quand passer en direct ou par OpenRouter est le meilleur choix.",
      readTime: "11 min de lecture",
    },
    chatgptAlternative: {
      title:
        "Une alternative à ChatGPT sans filtres. C'est vous qui réglez le niveau.",
      category: "Guide",
      excerpt:
        "Les modèles grand public gardent leurs filtres partout. Ici, ils côtoient des modèles open source et non censurés, et vous choisissez à chaque message. Ce qui change, ce que ça coûte, et quand ChatGPT reste le meilleur choix.",
      readTime: "7 min de lecture",
    },
    codingTools: {
      title: "Une clé. Tous les modèles. Codex et Claude Code compris.",
      category: "Guide développeur",
      excerpt:
        "Codex CLI, Claude Code, OpenCode, Continue, Aider et Cline avec une seule clé API, modèles non censurés compris. Une URL de base, une commande par outil, et les pièges que nous avons rencontrés.",
      readTime: "8 min de lecture",
    },
    uncensoredGuide: {
      title: "Les modèles non censurés, un par un.",
      category: "Guide des modèles",
      excerpt:
        "Deux sortes de non-censuré : des modèles grand public dont on a retiré les refus, et UncensoredLM, entraîné sur des livres et des documents bannis. Venice, GLM, DeepSeek, Qwen, Gemma, Arya, FreedomGPT et d'autres, avec les points forts et les limites de chacun.",
      readTime: "7 min de lecture",
    },
    modelRefresh: {
      title:
        "Les modèles les plus récents sont là. Le non-censuré passe à la vitesse supérieure.",
      category: "Mise à jour des modèles",
      excerpt:
        "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 et de nouveaux modèles open source. Plus NanoGPT, une gamme Venice élargie et les premiers modèles d'images non censurés.",
      readTime: "5 min de lecture",
    },
    whatsNewNovember2026: {
      title: "Six mois en une page : plus rapide, plus sûr, tourne partout.",
      category: "Mise à jour produit",
      excerpt:
        "Stop veut dire stop. La voix fonctionne sur iPhone. Votre IA vous suit d'une machine à l'autre. L'auto-hébergement se passe de Docker. Tout ce qui a changé depuis mai.",
      readTime: "6 min de lecture",
    },
    hermesThea: {
      title: "Deux IA. Une conversation. Dans les deux sens.",
      category: "Hermes & Thea",
      excerpt:
        "Hermes sur votre machine, Thea sur un serveur : désormais, chacune peut confier un fil à l'autre. Et une clé API manquante ne fait plus échouer le tour.",
      readTime: "6 min de lecture",
    },
    codingAgent: {
      title: "Votre IA ouvre un terminal et confie le travail à Claude Code.",
      category: "Agent de code",
      excerpt:
        "L'outil coding-agent délègue de vraies modifications de code à Claude Code ou OpenCode : en arrière-plan, ou en direct dans une vraie fenêtre de terminal qui rend compte une fois le travail fini. Désormais d'une instance à l'autre.",
      readTime: "5 min de lecture",
    },
    e2eTests: {
      title:
        "Un robot a cliqué sur chaque bouton. Il a trouvé huit failles de sécurité.",
      category: "Ingénierie",
      excerpt:
        "Nous avons arrêté de tester des morceaux pour tester des pages. Un vrai navigateur sur chaque endpoint côté client, et la redirection ouverte, la SSRF et les fuites de données qu'il a attrapées.",
      readTime: "7 min de lecture",
    },
    whatsNewMay2026: {
      title: "Cortex. Dreamer. Autopilot. Votre IA se souvient, désormais.",
      category: "Mise à jour produit",
      excerpt:
        "Mémoire persistante, réflexion nocturne, exécution en arrière-plan. Plus la génération de médias et {{credits}} crédits, un mois entier gratuit, pour nous dire ce qui ne marche pas.",
      readTime: "6 min de lecture",
    },
    whatsNewApril2026: {
      title: "123 modèles. Toutes les modalités. Un seul compagnon.",
      category: "Mise à jour produit",
      excerpt:
        "Du vrai multimodal sur 123 modèles, de vrais compagnons IA avec un vrai caractère, une économie des compétences et une refonte complète de tout ce qui était bancal. Voici ce qui a changé.",
      readTime: "7 min de lecture",
    },
    oneCodebase: {
      title: "Une base de code. 13 plateformes. Zéro compromis.",
      category: "Architecture",
      excerpt:
        "Une seule définition d'endpoint. Formulaire web, commande CLI, outil MCP, écran natif, tâche cron, en même temps. Voici comment ça marche.",
      readTime: "12 min de lecture",
    },
    typeChecker: {
      title:
        "J'ai construit un vérificateur de types qui a empêché l'IA de me mentir",
      category: "TypeScript",
      excerpt:
        "L'IA utilise `any` pour échapper à une erreur de type. Elle ajoute eslint-disable. Elle vous ment. Voici comment nous avons réparé la boucle de retour.",
      readTime: "10 min de lecture",
    },
    tradingBot: {
      title:
        "Mon bot de trading abandonné est devenu un moteur de monitoring de plateforme",
      category: "Vibe Sense",
      excerpt:
        "J'ai abandonné un bot de trading. Des années plus tard, son architecture est devenue la partie la plus intéressante de next-vibe. Le pipeline, ce ne sont que des endpoints.",
      readTime: "14 min de lecture",
    },
    oneEndpoint: {
      title: "Un endpoint. Toutes les surfaces.",
      category: "Architecture",
      excerpt:
        "Écrivez un definition.ts par fonctionnalité. Il s'affiche en formulaire web, commande CLI, outil MCP, écran natif, tâche cron, en même temps.",
      readTime: "5 min de lecture",
    },
    referralBeginners: {
      title:
        "Je n'ai jamais fait d'affiliation. Est-ce que je peux vraiment gagner de l'argent ici ?",
      category: "Parrainage",
      excerpt:
        "Réponse honnête : oui, avec des attentes réalistes. Voici comment fonctionne la commission récurrente si vous n'avez jamais parrainé personne.",
      readTime: "6 min de lecture",
    },
    referralAffiliatePros: {
      title: "Je suis affilié. Qu'est-ce qui change avec les abonnements IA ?",
      category: "Parrainage",
      excerpt:
        "Le plancher est plus haut et il monte avec le temps. Des commissions mensuelles récurrentes sur des abonnés IA qui dépensent davantage à mesure que la plateforme grandit.",
      readTime: "7 min de lecture",
    },
    referralDevelopers: {
      title:
        "Vous avez construit quelque chose avec l'IA. Gagnez de l'argent en le partageant.",
      category: "Parrainage",
      excerpt:
        "Votre lien de parrainage est une source de revenus que vous n'avez pas encore activée. Articles de blog, README, tutoriels : les chiffres pour un public technique.",
      readTime: "5 min de lecture",
    },
    skillSharingEconomy: {
      title: "Créez une compétence. Partagez le lien. Gagnez chaque mois.",
      category: "Économie des compétences",
      excerpt:
        "Les compétences sont des configurations d'IA prêtes à l'emploi que vous créez une fois et partagez partout. Le lien de parrainage dans l'URL de partage vous rapporte 10 % récurrents sur chaque inscription. Voici comment.",
      readTime: "7 min de lecture",
    },
    referralLanding: {
      title:
        "10 % en direct. +5 % quand d'autres partagent votre compétence. Récurrent, pour toujours.",
      category: "Parrainage",
      excerpt:
        "Le fonctionnement complet du programme de parrainage et de rémunération des compétences : détail de la chaîne, pourcentages exacts par niveau, options de versement, et comment le bonus compétence se cumule.",
      readTime: "4 min de lecture",
    },
  },
  cta: {
    title: "Les nouveaux articles, directement dans votre boîte mail.",
    subtitle:
      "Plongées dans l'architecture et nouveautés produit dès leur sortie. Pas de remplissage, désinscription en un clic.",
    newsletter: "Recevoir la newsletter",
    subscribedTitle: "Vous êtes inscrit.",
    subscribedSubtitle:
      "Les nouveaux articles arrivent dans votre boîte mail le jour de leur sortie. En attendant, plongez dans le framework qui les porte.",
    framework: "Découvrir next-vibe",
  },
  labels: {
    readMore: "Lire la suite",
    allPosts: "Tous les articles",
    featured: "À la une",
    relatedGuides: "Guides associés",
    startHere: "Commencer ici",
  },
  topics: {
    uncensored: {
      title: "IA non censurée",
      intro:
        "Quel modèle non censuré choisir, comment fonctionne l’ablitération et où discuter sans filtre ni compte.",
    },
    media: {
      title: "Image, vidéo et voix",
      intro:
        "Générateurs d’images, de vidéos, de musique et de voix comparés, avec le prix par résultat.",
    },
    developers: {
      title: "API et outils de code",
      intro:
        "Appelez des modèles non censurés et grand public depuis votre code, vos scripts et vos agents de code.",
    },
    updates: {
      title: "Nouveautés produit",
      intro: "Ce qui sort, mois après mois.",
    },
    engineering: {
      title: "Ingénierie",
      intro:
        "Comment next-vibe se construit. L’architecture, les bugs, les correctifs.",
    },
    referral: {
      title: "Parrainage et revenus",
      intro:
        "Comment le programme de parrainage paie et comment gagner de l’argent avec les skills.",
    },
  },
};
