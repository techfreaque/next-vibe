import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  summary:
    "{{appName}} est une plateforme de chat IA qui propose {{modelCount}} modèles de chat issus de {{providerCount}} laboratoires : grand public, open source et non censurés. Vous choisissez le niveau de filtrage pour chaque chat. Paiement à l'usage, en crédits. Open source et auto-hébergeable.",
  intro:
    "Modèles de chat, d'image, de vidéo, de musique, de voix et de transcription sur un seul solde de crédits. Utilisez-les dans le navigateur, en ligne de commande, comme serveur MCP ou via une API compatible OpenAI et Anthropic. Construit sur next-vibe, un framework TypeScript open source où une seule définition d'endpoint devient l'interface web, la commande CLI, l'outil IA et l'outil MCP.",
  facts: {
    heading: "L'essentiel",
    models:
      "Modèles : {{modelCount}} modèles de chat ({{mainstream}} grand public, {{open}} open source, {{uncensored}} non censurés) issus de {{providerCount}} laboratoires, plus {{mediaCount}} modèles d'image, de vidéo, de musique, de synthèse vocale et de transcription.",
    free: "Crédits gratuits chaque mois : {{guest}} sans compte, {{signedIn}} avec un compte gratuit, {{max}} avec un compte gratuit et un abonnement confirmé à la newsletter. Aucune carte requise.",
    paid: "Formules payantes : {{plans}}. Chaque formule existe aussi à l'année au prix de 11 mois (Starter : {{subYearPrice}} par an). Les abonnés rechargent avec un pack de crédits unique à {{packPrice}} pour {{packCredits}} crédits. Les crédits des packs n'expirent jamais.",
    planItem: "{{name}} à {{price}} par mois pour {{credits}} crédits",
    credit:
      "1 crédit = {{creditValue}}. Chaque page de modèle indique son prix par message.",
    api: "API : formats OpenAI chat completions, OpenAI Responses et Anthropic Messages sur une seule URL de base ({{apiBaseUrl}}). La même clé appelle {{mediaCount}} modèles média via des endpoints au format OpenAI : /v1/images/generations, /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions, /v1/audio/translations, /v1/videos, /v1/music (vidéo et musique en tâches asynchrones). Elle nécessite un compte payant : n'importe quelle formule, dès {{subPrice}} par mois. Les comptes gratuits reçoivent HTTP 402.",
    uncensored:
      "Niveau non censuré : deux types de modèles. Les modèles abliterés sont des modèles grand public modifiés pour ne plus esquiver les questions. Les modèles véritablement non censurés, comme UncensoredLM, sont entraînés sur des livres et des documents bannis de l'internet grand public, d'où des opinions politiques à contre-courant. Le niveau non censuré demande une confirmation unique de majorité (18+).",
    openSource:
      "Open source : le code de l'application est sous licence MIT, le cœur du framework next-vibe sous GPL-3.0. Code source : {{repoUrl}}",
    referral:
      "Programme de parrainage : {{direct}} % de commission récurrente sur les paiements des filleuls, plus une cagnotte de {{upline}} % partagée sur {{levels}} niveaux de parrains. Versement en crédits ou en BTC/USDC, versement minimum {{minPayout}}.",
    languages:
      "Langues du site : anglais ({{en}}), allemand ({{de}}), polonais ({{pl}}), français ({{fr}}), italien ({{it}}) et espagnol ({{es}}).",
  },
  pages: {
    heading: "Pages principales",
    models: "Modèles",
    modelsDesc:
      "chaque modèle avec son prix par message, sa fenêtre de contexte, son niveau de contenu et des comparaisons face à face",
    pricing: "Tarifs",
    pricingDesc:
      "crédits gratuits, les quatre formules et le pack de crédits en recharge",
    api: "Documentation de l'API",
    apiDesc:
      "URL de base, authentification, endpoints chat et média, exemples de code",
    blog: "Blog",
    blogDesc: "guides, comparatifs de modèles et notes de développement",
    partners: "Partenaires",
    partnersDesc: "programme pour créateurs, newsletters et annuaires",
    earn: "Programme de parrainage",
    earnDesc: "fonctionnement des commissions et des versements",
    selfHost: "Auto-hébergement",
    selfHostDesc:
      "faites tourner votre propre instance sur votre propre matériel",
    framework: "Framework next-vibe",
    frameworkDesc: "la stack open source derrière {{appName}}",
    refusalIndex: "Indice de refus",
    refusalIndexDesc:
      "les mêmes questions à chaque modèle, chaque semaine : qui répond, qui esquive, qui refuse",
    skills: "Skills",
    skillsDesc:
      "spécialistes et personnages prêts à l'emploi, chacun avec son prompt, son modèle et ses outils",
    help: "Aide",
    helpDesc: "FAQ et contact",
  },
  compare: {
    heading: "Comparatifs",
  },
  blog: {
    heading: "Articles du blog",
  },
  optional: {
    heading: "Facultatif",
    full: "Version complète",
    fullDesc: "ce fichier plus la liste complète des modèles",
    sitemap: "Plan du site",
    sitemapDesc: "toutes les pages publiques dans toutes les langues",
    about: "À propos",
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
    imprint: "Mentions légales",
  },
  full: {
    chatHeading: "Modèles de chat",
    chatIntro:
      "Modèles de chat actuels. Le prix par message correspond à un échange de chat normal ({{inputTokens}} tokens d'entrée, {{outputTokens}} tokens de sortie) chez le fournisseur le moins cher.",
    chatLine:
      "{{lab}}, {{tier}}, contexte de {{context}} tokens, environ {{credits}} crédits par message",
    legacyHeading: "Anciens modèles de chat, toujours disponibles",
    legacySuccessor: "remplacé par {{successor}}",
    mediaHeading: "Modèles de médias",
    mediaLine: "{{lab}}, {{type}}",
    mediaTypes: {
      image: "génération d'images",
      video: "génération de vidéos",
      audio: "génération de musique",
      tts: "synthèse vocale",
      stt: "transcription",
    },
  },
};
