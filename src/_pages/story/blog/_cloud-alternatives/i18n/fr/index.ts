import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  rules: {
    checked:
      "Lu dans la documentation et les politiques officielles de chaque fournisseur le {{date}}. Faites défiler latéralement sur mobile.",
    columns: {
      name: "Service",
      defaults: "Filtre par défaut",
      off: "Le désactiver",
      models: "Modèles non censurés",
      weights: "Vos propres poids",
      rules: "Règles de contenu qui restent",
    },
    rows: {
      azure: {
        defaults: "Actif pour tous les modèles sauf Whisper.",
        off: "Uniquement sur approbation. Les clients peuvent assouplir jusqu'à High only. Le contrôle total passe par une demande, réservée aux clients gérés par une équipe de compte Microsoft ou relevant d'un programme éligible.",
        models: "Aucun trouvé dans le catalogue.",
        weights: "Non vérifié pour ce guide.",
        rules:
          "Le Code of Conduct interdit les contenus sexuellement explicites et les chatbots érotiques ou romantiques, filtres activés ou non.",
      },
      bedrock: {
        defaults:
          "Aucun filtre Bedrock sans Guardrail attaché. La détection CSAM est toujours active.",
        off: "Omettez l'ID du guardrail. Les refus propres au modèle restent.",
        models: "Aucun dans le catalogue.",
        weights:
          "Custom Model Import : architectures Llama, Mistral, Qwen et gpt-oss, facturé à la minute par Custom Model Unit.",
        rules:
          "La Responsible AI Policy interdit de contourner les filtres de sécurité et les images sexuelles non consenties.",
      },
      vertex: {
        defaults:
          "Désactivé par défaut pour gemini-3.5-flash et les versions suivantes. Les préjudices majeurs restent bloqués.",
        off: "Réglez les seuils sur OFF. Les refus appris de Gemini restent.",
        models: "Aucun dans la liste des modèles ouverts.",
        weights:
          "Auto-déploiement Model Garden sur des conteneurs vLLM ou TGI.",
        rules:
          "La Prohibited Use Policy interdit les contenus sexuellement explicites et le contournement des filtres de sécurité.",
      },
      together: {
        defaults:
          "Aucun interrupteur de filtre documenté dans les pages que nous avons lues.",
        off: "Sans objet.",
        models: "Aucun dans la liste serverless.",
        weights:
          "Endpoints dédiés à partir de $5.49 par heure de H100. Les uploads doivent être des fine-tunes d'une architecture prise en charge.",
        rules:
          "Les conditions interdisent les contenus obscènes et la pornographie.",
      },
      us: {
        defaults:
          "Vous choisissez le modèle : grand public, ouvert ou non censuré. Aucune couche de filtre par-dessus.",
        off: "Choisissez un modèle non censuré et confirmez une fois que vous avez 18 ans ou plus.",
        models: "{{uncensored}} disponibles en ce moment.",
        weights: "Non pris en charge. Nous servons un catalogue sélectionné.",
        rules:
          "Les modèles non censurés se débloquent après un consentement 18+ unique. Les conditions du fournisseur du modèle s'appliquent toujours.",
      },
    },
    sourceLabels: {
      filters: "{{name}} : doc sur les filtres",
      access: "{{name}} : règles d'accès",
      policy: "{{name}} : politique d'utilisation",
      privacy: "{{name}} : traitement des données",
      pricing: "{{name}} : tarifs",
      import: "{{name}} : poids personnels",
    },
    sourcesTitle: "Sources",
  },
  prices: {
    columns: {
      model: "Modèle",
      provider: "Fournisseur",
      input: "Entrée / 1M",
      output: "Sortie / 1M",
    },
    us: "{{appName}}",
    live: "prix en direct",
    source: "source",
    note: "USD par million de tokens. Prix des concurrents lus le {{date}} dans leurs listes de modèles publiques. Le nôtre est lu en direct dans notre registre, marge de {{markup}}% comprise. Quand une route moins chère est configurée, nous l'utilisons et le prix affiché suit.",
  },
  alts: {
    heading: "{{number}}. {{name}}",
    strength: "Le meilleur :",
    catch: "Le revers :",
    sources: "Sources :",
    versusLink: "{{appName}} vs {{name}} : comparaison complète",
    openRouter: {
      what: "Passerelle avec 477 modèles derrière une seule clé. Aucune marge sur l'inférence, 5.5% de frais sur les achats de crédits (5% en crypto).",
      strength:
        "Apportez vos propres clés de fournisseurs, gratuit jusqu'à $25,000 par mois, routage zero data retention par requête, paiements en USDC.",
      catch:
        "17 modèles de jeu de rôle ou ajustés pour le non censuré, aucun identifiant avec abliterated ou uncensored dans le nom. Pas d'endpoint Anthropic Messages dans son aperçu d'API.",
    },
    venice: {
      what: "Application de chat et API compatible OpenAI. Ses propres fine-tunes Venice Uncensored 1.2 ($0.20 / $0.90) et Venice Role Play Uncensored, à côté de modèles GLM, DeepSeek, Gemma et Qwen abliterated.",
      strength:
        "Image, vidéo, voix et musique dans la même API. Options de modèles chiffrés et en TEE. Paiement par requête depuis un portefeuille USDC avec x402, sans compte.",
      catch:
        "Pas d'endpoint Anthropic Messages natif, Claude Code a besoin d'un proxy local. Les conditions interdisent de revendre l'accès. Le palier gratuit : 10 prompts texte par jour.",
    },
    nanoGpt: {
      what: "Passerelle à l'usage avec 610 modèles, dont environ 54 d'identifiants abliterated ou non censurés.",
      strength:
        "Chat completions OpenAI, Responses et Anthropic Messages. Bitcoin et Monero, sans compte, revente à l'usage autorisée.",
      catch:
        "Un catalogue bruyant, avec beaucoup d'identifiants non censurés quasi identiques. Le produit est pensé passerelle d'abord.",
    },
    openUncensored: {
      what: "Routeur d'API pour poids abliterated : 58 modèles texte, 20 image et 3 vidéo avec une clé prépayée. Votre clé est votre compte.",
      strength:
        "Aucune commission sur les prix des fournisseurs. GLM 5.3 Flash Uncensored à partir de $0.12 / $0.50. Formats OpenAI, Responses et Anthropic sur une seule base URL.",
      catch:
        "Pas de palier gratuit, crypto non mentionnée, métadonnées des requêtes conservées jusqu'à deux ans. Pas de chat web, seulement une application de bureau.",
    },
    refuseless: {
      what: "Hébergeur d'API uniquement pour poids ouverts sans refus : quatre modèles abliterated avec 1M de contexte, plus quelques modèles standard.",
      strength:
        "DeepSeek V4.1 Flash abliterated à $0.12 / $0.45 et GLM 5.3 Flash abliterated à $0.12 / $0.50. Chat completions, Responses, Anthropic Messages et embeddings.",
      catch:
        "Pas d'interface de chat. Ses pages de confidentialité et de conditions ont bloqué notre lecteur : lisez-les vous-même avant de livrer.",
    },
    abliterationHosts: {
      what: "Deux autres API abliterated. NEAR AI Cloud fait tourner les modèles dans des enclaves matérielles : Qwen 3.8 27B Abliterated à $0.04 / $1.35. abliteration.ai vend ses propres marques abliterated à partir de $1 / $2.",
      strength:
        "NEAR : pas de demande d'accès, pas de contrôle d'identité, attestation vérifiable. abliteration.ai : prompts traités en mémoire et non stockés par défaut, région UE, formats OpenAI et Anthropic.",
      catch:
        "Petits catalogues. NEAR ne mentionne aucun format Anthropic. abliteration.ai coûte plus cher que Refuseless ou NEAR pour des poids similaires.",
    },
    togetherFireworks: {
      what: "Clouds d'inférence rapides pour modèles ouverts standard. Together sert 24 modèles de chat serverless, aucun non censuré. Fireworks liste des modèles Dolphin, Hermes et Dobby Unhinged, statut serverless non confirmé.",
      strength:
        "Together : OpenAI, Responses et Anthropic Messages, zero data retention en libre-service. Fireworks : aucun log de prompts par défaut pour les modèles ouverts, jusqu'à 6,000 requêtes par minute.",
      catch:
        "Les conditions de Together interdisent les contenus obscènes et la pornographie. Fireworks exige que vous garantissiez que vos entrées ne contiennent ni nudité ni contenu sexuellement suggestif.",
    },
    selfHost: {
      what: "Faites tourner vous-même des poids abliterated. Ollama et LM Studio sur un poste de travail, vLLM ou TGI sur vos propres GPU. Tous parlent le format OpenAI chat completions.",
      strength:
        "Vos prompts ne quittent jamais vos machines. N'importe quel modèle abliterated en GGUF ou safetensors que vous pouvez télécharger. L'usage local ne coûte rien de plus que le matériel.",
      catch:
        "Vous gérez les GPU, les mises à jour et la disponibilité. Les modèles de taille frontier exigent du matériel de datacenter.",
    },
  },
};
