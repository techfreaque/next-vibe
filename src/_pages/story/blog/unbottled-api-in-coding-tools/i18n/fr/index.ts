import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Codex CLI et Claude Code avec tous les modèles | API {{appName}}",
    description:
      "Codex CLI, Claude Code, OpenCode, Continue, Aider et Cline sur une seule clé {{appName}}. Claude, GPT, DeepSeek, GLM et modèles non censurés. Une URL de base, une commande par outil.",
    category: "Guide développeur",
    imageAlt: "L'API {{appName}} dans les outils de code",
    keywords:
      "{{appName}}, Codex CLI, Claude Code, OpenCode, Continue, Aider, Cline, API compatible OpenAI, Responses API, Anthropic Messages API, agent de code, modèles non censurés, fournisseur personnalisé",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide développeur",
    readTime: "8 min de lecture",
    title: "Une clé. Tous les modèles. Codex et Claude Code compris.",
    subtitle:
      "Codex CLI et Claude Code se connectent désormais directement à {{appName}}, aux côtés d'OpenCode, Continue, Aider et Cline. Une URL de base, une clé, une commande par outil.",
  },
  intro: {
    lead: "Votre agent de code est verrouillé sur les modèles d'un seul fournisseur. Vous voulez un deuxième avis d'un autre labo, un modèle moins cher pour les tâches ingrates, ou un modèle qui ne refuse pas ? Il vous faut un autre compte, une autre clé, une autre facture.",
    p2: "{{appName}} parle les trois formats qu'utilisent les agents de code : les chat completions OpenAI, la Responses API d'OpenAI et l'Anthropic Messages API. Rien à installer entre les deux. Pointez un outil vers nous une fois, puis passez de Claude à GPT, DeepSeek, GLM, Kimi, Qwen ou aux modèles non censurés en changeant un seul id de modèle.",
    access:
      "Avant de commencer : l'API demande un compte payant. N'importe quelle formule la débloque, dès {{subPrice}} par mois. Les crédits gratuits et les crédits bonus, non.",
    accessLink: "Débloquer l'API",
  },
  why: {
    title: "Pourquoi s'embêter",
    oneKey:
      "Une clé, un solde. Pas de comptes séparés chez Anthropic, OpenAI, DeepSeek, Moonshot et Z.ai.",
    uncensored:
      "Des modèles non censurés dans votre éditeur. Recherche en sécurité, prompts de red team, outils pour la fiction, données qui déclenchent les filtres grand public. C'est vous qui choisissez le niveau de filtrage, pas le fournisseur.",
    switch:
      "Le bon modèle pour chaque tâche. Un modèle de pointe pour le refactoring difficile, un modèle flash pour les renommages et l'échafaudage de tests. Même config, id différent.",
    billing:
      "Les mêmes crédits que l'application de chat, aux mêmes prix. Chaque réponse indique ce qu'elle a coûté.",
  },
  setup: {
    title: "Obtenir une clé et une URL de base",
    intro:
      "Deux valeurs. Chaque outil ci-dessous a besoin exactement de celles-ci.",
    p1: "Créez une clé dans Paramètres > Clés d'API. Elle commence par sk-unb- et ne s'affiche qu'une fois.",
    shortcut:
      "Le plus rapide : juste après la création d'une clé, la page des clés d'API affiche chacun des blocs ci-dessous avec votre clé déjà remplie. Choisissez votre outil, copiez, lancez.",
    baseUrlLabel: "URL de base",
    baseUrlNote:
      "Pour les outils de type OpenAI : Codex, OpenCode, Continue, Aider, Cline. La locale dans le chemin ne change que la langue des messages d'erreur.",
    anthropicBaseUrlLabel: "URL de base Anthropic",
    anthropicBaseUrlNote:
      "Pour Claude Code et les SDK Anthropic. Même URL sans /v1 : ils ajoutent eux-mêmes /v1/messages.",
    p2: "Gardez la clé dans une variable d'environnement, jamais dans un fichier que vous commitez. L'appel curl prouve que la clé fonctionne et liste tous les ids de modèles que votre compte peut appeler, avec taille de contexte, support des outils et prix en crédits.",
  },
  compat: {
    title: "Chaque outil se connecte directement",
    intro:
      "Les agents de code parlent trois formats différents. Nous servons les trois, sur la même clé et les mêmes modèles.",
    codex: "Codex CLI : Responses API d'OpenAI.",
    claudeCode: "Claude Code : Anthropic Messages API.",
    chat: "OpenCode, Continue, Aider, Cline : chat completions OpenAI.",
    other:
      "Tout autre outil doté d'un champ d'URL de base fonctionne pareil : URL de base, clé, id de modèle.",
  },
  wire: {
    responses: "Responses API",
    messages: "Messages API",
    chat: "Chat completions",
  },
  codex: {
    intro:
      "L'agent en terminal d'OpenAI. Il lit votre dépôt, lance des commandes, modifie des fichiers.",
    p1: "Codex parle la Responses API, et nous aussi. La commande unique définit le fournisseur en ligne : rien à éditer, rien à installer. Pour un usage quotidien, ajoutez la config une fois et lancez Codex avec le profil.",
    p2: "Changez de modèle avec -m ou avec la ligne model du profil. Gardez wire_api = \"responses\" : la version actuelle de Codex n'accepte rien d'autre.",
  },
  claudeCode: {
    intro:
      "L'agent en terminal d'Anthropic. Il planifie, modifie, lance les tests, crée des sous-agents.",
    p1: "Claude Code lit sa passerelle dans les variables d'environnement. ANTHROPIC_BASE_URL est l'URL de base sans /v1. ANTHROPIC_MODEL définit le modèle principal. Les valeurs par défaut OPUS et SONNET couvrent le sélecteur de modèle et le mode plan, la valeur par défaut HAIKU envoie les tâches de fond comme les titres de session vers un modèle bon marché, et CLAUDE_CODE_SUBAGENT_MODEL couvre les sous-agents. CLAUDE_CODE_MAX_CONTEXT_TOKENS indique à Claude Code la vraie taille de contexte d'un modèle autre que Claude, pour qu'il compacte au bon moment.",
    p2: "Vous voulez Claude lui-même ? Supprimez les lignes de modèle. Claude Code demande ses ids Claude habituels et nous les routons vers notre modèle Claude correspondant, facturé en crédits.",
    p3: "Claude Code envoie un énorme prompt système, plus de 30k tokens d'entrée même pour une tâche triviale. Un modèle par défaut bon marché garde la facture raisonnable.",
  },
  opencode: {
    intro:
      "Agent en terminal open source, avec une TUI et un mode d'exécution headless.",
    p1: "Enregistrez la config sous opencode.json dans votre projet, ou sous ~/.config/opencode/opencode.json pour tous vos projets. La clé reste dans votre environnement. Ajoutez n'importe quel id de GET /v1/models à la map models, puis choisissez-en un avec /models dans la TUI.",
    gotcha:
      "Mettez d'abord OpenCode à jour. Les anciennes versions 1.0.x récupèrent le dernier paquet @ai-sdk/openai-compatible et plantent après le premier appel d'outil avec DecimalError: Invalid argument. La 1.19.5 fait tourner la même config sans problème.",
  },
  continue: {
    intro: "Assistant de code pour VS Code et JetBrains, plus la CLI cn.",
    p1: "secrets.UNBOTTLED_API_KEY est résolu depuis votre environnement. Ajoutez -p avec un prompt pour une exécution headless. L'extension IDE lit ~/.continue/config.yaml : mettez-y la même entrée de modèle.",
  },
  aider: {
    intro: "Du pair programming dans votre terminal, commits compris.",
    p1: "Une commande, aucun fichier de config. Aider veut openai/ devant l'id du modèle et le retire avant de nous appeler. --edit-format diff garde les modifications petites ; sans lui, Aider renvoie des fichiers entiers pour les ids de modèles qu'il ne connaît pas. Indiquez les fichiers à modifier sur la ligne de commande, comme d'habitude avec Aider.",
  },
  cline: {
    intro: "Agent de code autonome, dans VS Code et en CLI.",
    p1: "Deux commandes avec la CLI Cline : enregistrez le fournisseur une fois, puis lancez cline. URL de base, clé et id de modèle : les trois mêmes valeurs que partout ailleurs.",
  },
  models: {
    title: "Quel modèle pour quelle tâche",
    intro:
      "Tous ces modèles appellent des outils, ce dont les agents ont besoin. Les ids sont ce qui va dans votre config.",
    strong: {
      title: "Problèmes difficiles",
      body: "Gros refactorings, codebases inconnues, débogage en plusieurs étapes. Prix en crédits plus élevés, moins de fausses pistes.",
    },
    cheap: {
      title: "Bon marché et rapides",
      body: "Renommages, tests, code passe-partout, tâches de fond. Une fraction du prix d'un modèle de pointe. Un bon choix par défaut pour les agents qui envoient de gros prompts.",
    },
    uncensored: {
      title: "Non censurés",
      body: "Le même workflow d'agent, sans refus réflexe. Analyse d'exploits, outils de red team, pipelines de fiction pour adultes, scrapers sur lesquels les autres modèles vous font la morale. Vous restez responsable de ce que vous construisez.",
    },
    listNote:
      "Les ids changent à mesure que les modèles sont remplacés. GET /v1/models fait foi : si un id n'est pas listé pour votre clé, l'API renvoie 404 model_not_found. La seule correspondance automatique concerne Claude Code : ses ids Claude intégrés pointent vers notre Claude le plus récent de la même famille.",
  },
  gotchas: {
    title: "Les pièges que nous avons rencontrés",
    intro: "Pour que vous n'ayez pas à le faire.",
    localeUrl:
      "Copiez l'URL de base à l'identique, /api/<locale>/v1 compris. Sans la locale, vous obtenez une redirection que certains clients ignorent. Sans /api, vous obtenez une page HTML au lieu de JSON.",
    anthropicUrl:
      "Claude Code reçoit l'URL de base sans /v1. Avec /v1, il appelle /v1/v1/messages et prend un 404.",
    modelId:
      "Utilisez l'id exact de GET /v1/models, comme {{model}}. Aider veut openai/ devant. Les ids Claude intégrés de Claude Code sont redirigés pour vous vers notre Claude le plus récent de la même famille. Tout autre id inconnu renvoie 404 model_not_found.",
    paid: "Un HTTP 402 avec paid_plan_required signifie que le compte n'a encore ni formule ni achat de crédits. N'importe quelle formule règle le problème.",
    tools:
      "Un modèle sans support des outils renvoie 400 tools_not_supported dès que l'agent envoie des outils. Vérifiez supports_tools dans GET /v1/models.",
    rateLimit:
      "Chaque clé autorise 60 requêtes par minute. Les agents enchaînent beaucoup de petits appels. Si vous prenez un 429, donnez à l'agent sa propre clé.",
  },
  cta: {
    title: "Branché en une commande.",
    subtitle:
      "Créez une clé, copiez le bloc de votre outil, choisissez un modèle. La documentation de l'API couvre chaque endpoint, chaque champ, chaque code d'erreur et chaque détail du streaming.",
    key: "Créer une clé d'API",
    docs: "Lire la doc de l'API",
  },
};
