import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternative non censurée à AWS Bedrock : API comparées | {{appName}}",
    description:
      "Les Guardrails de Bedrock sont facultatifs, pas les refus ni la politique AWS. Custom Model Import pour poids abliterated face à {{appName}} et Venice.",
    category: "Guide développeur",
    imageAlt: "Alternatives non censurées à AWS Bedrock, comparées",
    keywords:
      "alternative non censurée à AWS Bedrock, alternative à Bedrock, Bedrock sans guardrails, Bedrock Custom Model Import abliterated, modèle non censuré Bedrock, alternative à Claude sur Bedrock, alternative à l'API Bedrock Converse, API Anthropic Messages, API LLM non censurée, API modèles abliterated, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide développeur",
    readTime: "8 min de lecture",
    title: "Alternatives non censurées à AWS Bedrock",
    subtitle:
      "Guardrails, refus, politique d'AWS et Custom Model Import, lus à la source. Puis {{count}} alternatives. Vérifié le {{date}}.",
  },
  intro: {
    lead: "Bedrock ne vous impose pas de filtre. Sans Guardrail, Bedrock n'en ajoute aucun. Le modèle refuse quand même, la politique d'AWS s'applique toujours, et le catalogue ne contient aucun poids non censuré.",
    p2: "La vraie question, c'est donc où tournent les modèles abliterated, et ce que coûte le passage. Voici les faits tirés de la doc d'AWS, la route Custom Model Import, et le changement de code pour les utilisateurs de Claude sur Bedrock qui passent à {{appName}}.",
  },
  bedrock: {
    title: "Ce que Bedrock filtre, et ce qu'il ne filtre pas",
    intro: "Directement tiré de la doc et de la politique d'AWS.",
    guardrails:
      "Les Guardrails sont optionnels : ils ne tournent que si vous passez un ID et une version de guardrail dans l'appel.",
    refusals:
      "Sans Guardrail ne veut pas dire non censuré : les modèles sont servis tels que leurs éditeurs les livrent, donc Claude, Llama et les autres gardent leurs refus appris.",
    csam: "Toujours actif : la détection automatique de CSAM sur les images en entrée et en sortie peut bloquer une requête avec un HTTP 400.",
    policy:
      "Politique : l'AWS Responsible AI Policy interdit d'utiliser le service pour contourner intentionnellement les filtres de sécurité, ainsi que la désinformation, les images sexuelles non consenties et le tort fait aux mineurs.",
    retention:
      "Détection d'abus : AWS peut stocker ou examiner les entrées et sorties dans des cas limités. Claude Fable 5, 5.1 et 5.2 conservent tout le trafic jusqu'à 30 jours, les modèles OpenAI hors gpt-oss conservent le trafic signalé jusqu'à 30 jours. Les éditeurs de modèles n'en reçoivent rien.",
    models:
      "Aucun poids non censuré : le catalogue contient DeepSeek, Llama, Qwen, Mistral, gpt-oss, Kimi, GLM, MiniMax, Gemma et Nemotron. Aucun n'est abliterated.",
  },
  import: {
    title: "Apportez vos poids abliterated : Custom Model Import",
    intro:
      "Bedrock peut héberger les poids que vous téléversez. C'est la seule façon d'y faire tourner un modèle abliterated.",
    architectures:
      "Architectures prises en charge : Mistral, Mixtral, Flan, Llama 2 à 3.3, GPTBigCode, Qwen2 à Qwen3 et gpt-oss 20B et 120B. Un Llama, Qwen ou gpt-oss abliterated convient.",
    excluded:
      "Non pris en charge : les architectures DeepSeek V3, Kimi et GLM. Les imports Qwen3 ne prennent pas en charge l'API Converse.",
    format:
      "Limites : safetensors Hugging Face, moins de 200 GB pour les modèles texte, contexte sous 128K, pas d'inférence par lots. Régions : eu-central-1, us-east-1, us-east-2, us-west-2.",
    cost: "Coût : $0.05718 par Custom Model Unit et par minute à US East et Oregon, facturé par fenêtres de 5 minutes, plus $1.95 par mois de stockage par unité. Francfort : $0.07144 la minute.",
    callout:
      "Vous payez la capacité du modèle à la minute, pas au token. Et la politique d'AWS contre le contournement des filtres de sécurité couvre toujours votre compte.",
  },
  prices: {
    title: "Les prix des modèles ouverts de Bedrock",
    intro:
      "Palier standard, US East, par 1M de tokens, entrée / sortie. Poids standard uniquement.",
    list: "DeepSeek v3.2 $0.62 / $1.85. Qwen3 Next 80B A3B $0.15 / $1.20. Mistral Large 3 $0.50 / $1.50. Kimi K2.5 $0.60 / $3.00. GLM 5 $1.00 / $3.20. GLM 4.7 Flash $0.07 / $0.40.",
    oursTitle: "Poids non censurés ailleurs, au token",
    oursIntro:
      "Les modèles abliterated que Bedrock n'a pas, les nôtres contre les hébergeurs les moins chers.",
  },
  apis: {
    title: "Converse contre les formats OpenAI et Anthropic",
    intro:
      "Bedrock parle InvokeModel et Converse sur bedrock-runtime, et ajoute Messages, Chat Completions et Responses sur son endpoint bedrock-mantle. Nous parlons OpenAI chat completions, l'API Responses et Anthropic Messages sur une seule base URL avec une seule clé.",
    claude:
      "Pour les utilisateurs de Claude sur Bedrock, cela veut dire que le SDK Anthropic continue de fonctionner. Remplacez le client Bedrock par le client standard, réglez la base URL et la clé. Claude Code prend la même base URL dans ANTHROPIC_BASE_URL.",
    before: "Avant : Claude via le client Bedrock",
    after: "Après : le même appel Messages sur {{appName}}",
    swap: "Même code, n'importe quel modèle : mettez {{uncensoredExample}} dans le champ model et l'appel part vers un modèle non censuré.",
    converse:
      "Sur Converse aujourd'hui ? Passez une fois au SDK OpenAI ou Anthropic, et chaque passerelle de cette page, nous compris, n'est plus qu'un changement de base URL.",
  },
  rules: {
    title: "Bedrock, Azure, Vertex et Together côte à côte",
    intro:
      "Tous les hyperscalers vous laissent abaisser un filtre quelque part. Aucun ne change la politique d'utilisation, et aucun ne livre de poids non censurés.",
  },
  us: {
    title: "{{appName}} : des modèles non censurés sans importer de poids",
    intro:
      "{{modelCount}} modèles de chat derrière une seule clé, dont {{uncensored}} non censurés. Paiement au token, pas de minutes de capacité.",
    models:
      "Modèles : Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM et Qwen à côté de {{uncensored}} modèles non censurés, dont des GLM, DeepSeek et Kimi abliterated que Custom Model Import ne peut pas accepter. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, résultat : un modèle aux opinions politiques à contre-courant.",
    formats:
      "Formats : OpenAI chat completions, l'API Responses et Anthropic Messages, plus image, vidéo, musique, voix et transcription.",
    consent:
      "Règles : les modèles non censurés se débloquent après un consentement 18+ unique sur votre compte.",
    billing:
      "Facturation : un seul solde de crédits, notre marge de {{markup}}% sur ce que nous payons en amont. N'importe quel abonnement à partir de {{apiSubPrice}} par mois débloque les clés API.",
    weak: "Là où Bedrock nous bat : IAM, VPC, régions, une facture AWS, ISO, SOC, CSA STAR, l'éligibilité HIPAA et FedRAMP High dans GovCloud. Nous n'avons ni rapport SOC 2, ni BAA, ni SLA, ni choix de région, et chaque prompt passe par nous jusqu'au fournisseur qui sert le modèle.",
    docsLink: "Docs API : endpoints, authentification et limites",
    toolsLink: "Une seule clé dans Claude Code, Codex CLI, Aider et plus",
  },
  models: {
    title: "{{apiUncensored}} modèles non censurés dans l'API aujourd'hui",
    intro:
      "Chaque modèle non censuré que vous pouvez appeler, avec l'identifiant à passer dans model. Du moins cher au plus cher.",
    colModel: "Modèle",
    colId: "Identifiant API",
    colContext: "Contexte",
    colPrice: "Par message",
  },
  list: {
    title: "Les alternatives, une par une",
    intro:
      "Tiré de leurs propres pages et listes de modèles, lues le {{date}}. Ce que c'est, où chacune gagne, et le revers.",
  },
  stay: {
    title: "Quand rester sur Bedrock",
    intro:
      "Si votre charge vit dans AWS, la question du filtre est peut-être la moindre.",
    compliance:
      "Vous avez besoin du périmètre de conformité, des contrôles IAM et VPC, et d'une seule facture AWS.",
    retention:
      "Vous avez besoin de zéro rétention par Région : le mode de rétention none de Bedrock, réglé par API.",
    weights:
      "Votre modèle abliterated est un Llama, Qwen ou gpt-oss et un trafic régulier justifie de payer des minutes de capacité.",
    callout:
      "Beaucoup d'équipes se partagent : Bedrock pour la production dans AWS, une deuxième clé pour la fiction, le jeu de rôle, la recherche et le red-teaming.",
  },
  faq: {
    title: "FAQ",
    guardrails: {
      q: "Bedrock filtre-t-il le contenu sans Guardrails ?",
      a: "Bedrock n'ajoute aucune couche de filtre sauf si vous attachez un Guardrail, hormis la détection automatique de CSAM sur les images. Les modèles gardent leurs propres refus appris, et l'AWS Responsible AI Policy s'applique toujours.",
    },
    uncensored: {
      q: "Bedrock propose-t-il des modèles non censurés ou abliterated ?",
      a: "Pas dans son catalogue. La seule route est Custom Model Import de vos propres poids, pour les architectures prises en charge comme Llama, Qwen et gpt-oss.",
    },
    cost: {
      q: "Combien coûte Custom Model Import ?",
      a: "$0.05718 par Custom Model Unit et par minute à US East et Oregon, facturé par fenêtres de 5 minutes, plus $1.95 par mois de stockage par unité. Vous payez la capacité, pas le token.",
    },
    claude: {
      q: "Puis-je migrer du code Claude sur Bedrock sans réécriture ?",
      a: "Oui. Remplacez AnthropicBedrock par le client Anthropic standard, réglez base_url sur la base URL de {{appName}} sans /v1, utilisez votre clé et notre identifiant de modèle. La requête et la réponse Messages gardent leur forme.",
    },
    converse: {
      q: "{{appName}} prend-il en charge l'API Bedrock Converse ?",
      a: "Non. Nous parlons OpenAI chat completions, l'API Responses et Anthropic Messages. Quitter Converse une fois fait de chaque fournisseur compatible OpenAI ou Anthropic un simple changement de base URL.",
    },
    enterprise: {
      q: "{{appName}} propose-t-il SOC 2, un BAA ou un SLA ?",
      a: "Non. Si vous en avez besoin, gardez la charge réglementée sur Bedrock et utilisez {{appName}} là où les refus gênent.",
    },
    apiLink: "API LLM non censurée : identifiants, code et limites",
    azureLink: "Alternatives non censurées à Azure OpenAI",
    openRouterLink: "Alternatives à OpenRouter, comparées",
    keysLink: "Gérer vos clés API",
  },
  cta: {
    title: "Pas de minutes de capacité. Pas de réflexe de refus.",
    subtitle:
      "Testez d'abord les modèles dans le chat, {{guestCredits}} crédits gratuits par mois, sans compte. Pointez ensuite votre SDK vers l'API.",
    start: "Essayer un modèle non censuré",
    docs: "Lire la doc de l'API",
  },
};
