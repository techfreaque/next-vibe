import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "API LLM non censurée : modèles abliterated | {{appName}}",
    description:
      "Modèles abliterated et non censurés via une API compatible OpenAI et Anthropic. Identifiants, contexte, prix par modèle, exemples curl et Python, limites.",
    category: "Guide développeur",
    imageAlt: "API LLM non censurée avec des endpoints compatibles OpenAI",
    keywords:
      "API LLM non censurée, API IA sans censure, API modèles abliterated, LLM abliterated API, API compatible OpenAI non censurée, API LLM NSFW, API sans filtre de contenu, modèles abliterated hébergés, alternative à l'API Venice, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide développeur",
    readTime: "8 min de lecture",
    title: "API LLM non censurée. Votre SDK. Sans réflexe de refus.",
    subtitle:
      "{{count}} modèles non censurés derrière une seule clé compatible OpenAI et Anthropic. Identifiants, contexte et prix lus en direct dans notre registre.",
  },
  intro: {
    lead: "Votre application a besoin d'un modèle qui répond. Pas d'un modèle qui fait la morale, ni d'un modèle qui rejette la moitié de vos prompts de test. Les API grand public filtrent par conception, et faire tourner vous-même des poids abliterated, c'est louer des GPU.",
    p2: "{{appName}} sert {{count}} modèles non censurés sur les mêmes endpoints /v1 que n'importe quel modèle grand public. Changez la base URL, gardez le SDK OpenAI ou Anthropic, choisissez un identifiant non censuré. Voici la liste, le code, les limites et le revers honnête.",
    access:
      "D'emblée : l'API exige un compte payant. N'importe quel abonnement, à partir de {{subPrice}} par mois, la débloque. Les crédits gratuits et bonus, non.",
    accessLink: "Débloquer l'API",
  },
  models: {
    title: "{{count}} modèles non censurés dans l'API",
    intro:
      "Tous les modèles texte non censurés actuels, du moins cher au plus cher. Reprenez l'identifiant tel quel dans le champ model.",
    colModel: "Modèle",
    colId: "Identifiant",
    colContext: "Contexte",
    colTools: "Outils",
    colPrice: "Par message",
    yes: "Oui",
    no: "Non",
    footnote:
      "Par message signifie un échange de référence sur la route la moins chère. L'API facture au token, et chaque réponse indique le montant exact dans usage.credits_charged. GET /v1/models renvoie la même liste avec les prix par token.",
  },
  code: {
    title: "Une requête",
    intro:
      "Le modèle non censuré le moins cher en ce moment est {{example}}. Remplacez-le par n'importe quel identifiant du tableau.",
    prompt:
      "Donne-moi les meilleurs arguments pour et contre le nucléaire. Sans avertissement.",
    curl: "curl",
    python: "SDK Python OpenAI",
    anthropic:
      "Vous préférez le SDK Anthropic ou Claude Code ? Pointez-les vers la même base URL sans /v1 : ils appellent /v1/messages avec les mêmes modèles et la même clé.",
  },
  consent: {
    title: "La seule étape 18+",
    intro:
      "Les modèles non censurés sont réservés aux adultes. L'API le vérifie une fois.",
    where:
      "Confirmez une seule fois que vous avez 18 ans ou plus, sur la page des clés API.",
    link: "Ouvrir les clés API",
    error:
      "Sans cette confirmation, une requête vers un modèle non censuré renvoie 403 uncensored_consent_required, et rien n'est facturé.",
    once: "Ensuite, vos clés peuvent appeler les modèles non censurés.",
  },
  kinds: {
    title: "Quel modèle non censuré pour quel travail",
    intro:
      "Le tableau contient trois sortes de modèles. Ils ne se comportent pas pareil.",
    abliterated:
      "Abliterated : un modèle grand public ou ouvert dont le comportement de refus a été retiré des poids. Même entraînement, mêmes connaissances, même vision du monde. Il répond, c'est tout. Le choix par défaut pour la plupart des applications.",
    fineTuned:
      "Affiné : un modèle ouvert entraîné en plus sur des données non filtrées. Souvent plus libre dans le ton, apprécié pour la fiction et le jeu de rôle.",
    own: "{{ownModel}} : entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant. À choisir quand vous voulez les positions que les modèles grand public ne donnent pas.",
    link: "Abliterated, affiné ou vision du monde propre : l'explication complète",
  },
  limits: {
    title: "Les limites à connaître",
    intro: "Les angles durs, avant la mise en production.",
    stateless:
      "Sans état. Aucune conversation n'est conservée chez nous. Envoyez l'historique complet à chaque tour.",
    maxTokens: "La sortie est plafonnée à {{maxTokens}} tokens par requête.",
    rateLimit:
      "Aucune limite de débit fixe. Facturation à la requête sur vos crédits, avec une protection anti-abus généreuse. Les 429 des fournisseurs de modèles passent avec un en-tête Retry-After.",
    tools:
      "Les appels d'outils ne marchent qu'avec les modèles qui les prennent en charge. Le tableau indique lesquels. Sinon, vous recevez 400 tools_not_supported.",
    refusals:
      "Non censuré ne veut pas dire infaillible. Un modèle peut encore refuser ou se tromper sur les faits. Testez vos prompts sur deux modèles avant de vous engager.",
  },
  privacy: {
    title: "Ce que deviennent vos prompts",
    intro: "Nous gardons la facture, pas la conversation.",
    noStore:
      "L'API n'enregistre aucune conversation et ne crée aucun fil. Chez nous, il ne reste que la ligne de facturation : quel modèle, combien de crédits.",
    upstream:
      "Votre prompt part chez le fournisseur qui sert le modèle. Ses conditions s'appliquent à ce qu'il reçoit.",
    callout:
      "Si vos prompts ne doivent jamais quitter votre infrastructure, faites tourner des poids abliterated sur votre propre matériel. Pour tout le reste, l'API se déploie plus vite.",
  },
  others: {
    title: "Les autres API non censurées, sans détour",
    intro:
      "Nous ne sommes pas la seule option. Nous achetons nous-mêmes chez certains d'entre eux. Faits tirés de leur propre documentation et de leurs pages de tarifs.",
    versusLink: "{{appName}} vs {{name}} : comparaison complète",
    routerLink:
      "Quitter OpenRouter : une clé pour tous les modèles, trois formats d'API",
  },
  faq: {
    title: "FAQ",
    free: {
      q: "Existe-t-il une API LLM non censurée gratuite ?",
      a: "Pas chez nous. L'application de chat a des crédits gratuits, l'API non. N'importe quel abonnement, à partir de {{subPrice}} par mois, débloque les clés API. Les outils locaux comme Ollama offrent une API locale gratuite si votre matériel peut porter le modèle.",
    },
    ids: {
      q: "Quels identifiants de modèle sont non censurés ?",
      a: "{{count}} en ce moment, listés dans le tableau ci-dessus avec leur identifiant exact. GET /v1/models renvoie tous les modèles que votre clé peut appeler, avec les prix et la prise en charge des outils.",
    },
    sdk: {
      q: "L'API non censurée fonctionne-t-elle avec le SDK OpenAI ?",
      a: "Oui. Réglez base_url sur la base URL de {{appName}}, utilisez votre clé et mettez un identifiant non censuré dans le champ model. Le SDK Anthropic fonctionne aussi, avec la même base URL sans /v1.",
    },
    refuse: {
      q: "Un modèle non censuré ne refuse-t-il jamais ?",
      a: "Il refuse beaucoup moins, pas jamais. Les modèles abliterated perdent le réflexe de refus appris, mais peuvent encore décliner ou se tromper. Testez avec vos vrais prompts.",
    },
    logs: {
      q: "{{appName}} enregistre-t-il mes prompts d'API ?",
      a: "Aucune conversation n'est conservée depuis l'API, seulement la ligne de facturation : modèle et crédits débités. Le fournisseur qui sert le modèle voit le prompt, selon ses propres conditions.",
    },
    local: {
      q: "Vaut-il mieux héberger soi-même des modèles abliterated ?",
      a: "Avec vos propres GPU et des règles strictes sur les données, oui. Un outil local expose une API compatible OpenAI sur votre machine. Si vous voulez des modèles non censurés de taille frontier sans louer de matériel, une API hébergée revient moins cher pour démarrer.",
    },
    docsLink: "Lire la référence complète de l'API",
    directoryLink: "Voir les modèles abliterated dans le chat",
  },
  cta: {
    title: "Testez d'abord. Branchez ensuite.",
    subtitle:
      "Tous les modèles du tableau tournent aussi dans l'application de chat. Testez vos prompts là-bas, puis copiez l'identifiant dans votre code.",
    chat: "Tester un modèle non censuré dans le chat",
    docs: "Lire la doc de l'API",
  },
};
