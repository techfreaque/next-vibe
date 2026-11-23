import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatives à NoFilterGPT : chats IA sans censure comparés (2026)",
    description:
      "Alternatives à NoFilterGPT vérifiées sur leurs propres pages : Venice, uncensored.ai, FreedomGPT, NanoGPT, Gab AI, LM Studio et {{appName}}. Modèles, filtre, vie privée, prix, API.",
    category: "Comparatif",
    imageAlt: "Alternatives à NoFilterGPT, comparées côte à côte",
    keywords:
      "alternative NoFilterGPT, alternatives à NoFilterGPT, sites comme NoFilterGPT, NoFilterGPT vs Venice, chat IA sans censure, chat IA sans filtre, ChatGPT sans filtre, IA non censurée, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif",
    readTime: "8 min de lecture",
    title: "Alternatives à NoFilterGPT. Plus de modèles, la même liberté.",
    subtitle:
      "{{count}} alternatives et {{appName}}, comparées sur ce que disent leurs propres pages de tarifs, de confidentialité et de filtre.",
  },
  intro: {
    lead: "NoFilterGPT vend une seule chose : un chatbot qui ne vous fait pas la morale. Soit. Mais vous avez un seul modèle, un plafond quotidien en gratuit et une promesse de confidentialité à croire sur parole.",
    p2: "Voici donc les alternatives, vérifiées sur leurs propres pages. Concurrents au {{date}}, NoFilterGPT au {{nfDate}}. En toute transparence : nous achetons des modèles chez certains d'entre eux et les proposons dans notre chat, {{veniceModels}} via Venice à lui seul. Nous disons aussi où ils font mieux.",
  },
  nfg: {
    title: "Ce que propose NoFilterGPT",
    intro:
      "D'après sa page d'accueil et sa politique de confidentialité, lues le {{nfDate}}.",
    model:
      "Modèle : un modèle maison, présenté comme basé sur l'architecture GPT sans les restrictions habituelles. Aucun modèle de base nommé, aucun choix de modèle.",
    price:
      "Prix : une offre Basic gratuite avec un nombre limité de messages par jour. Professional coûte {{proPrice}} par mois pour des chats quasi illimités, l'analyse d'images, la génération d'images et l'accès API.",
    media:
      "Médias : génération et retouche d'images, vidéo à partir d'une image, voix en entrée et en sortie.",
    privacy:
      "Confidentialité : la page d'accueil affirme que les conversations ne sont pas conservées et que les chats sont chiffrés. La politique de confidentialité précise que les adresses IP peuvent être journalisées pour la sécurité, que les données d'usage sont journalisées et que Cloudflare Analytics tourne sur le site.",
    payments: "Paiement : cartes via Stripe, ainsi que ETH, BTC et USDC.",
    why: "Pourquoi chercher une alternative : choisir son modèle, comparer les réponses, ou vérifier une promesse de confidentialité dans une politique qui la détaille.",
    sourceHome: "Page d'accueil de NoFilterGPT",
    sourcePrivacy: "Politique de confidentialité de NoFilterGPT",
  },
  criteria: {
    title: "Ce qu'il faut comparer avant de changer",
    intro: "Cinq questions suffisent.",
    models:
      "Modèles : un modèle maison ou un vrai choix ? Abliterated, vraiment non censuré, et Claude, GPT et Gemini restent-ils accessibles au même endroit ?",
    filter:
      "Filtre : qu'est-ce qui est permis en gratuit, qu'est-ce qui demande une offre payante, et y a-t-il une vérification d'âge ?",
    privacy:
      "Confidentialité : où sont stockés vos chats, ce qui est journalisé, et si quelqu'un s'en sert pour entraîner des modèles.",
    price:
      "Prix : quota gratuit, abonnement ou paiement à l'usage. Et ce qui se passe quand la limite est atteinte.",
    api: "API : pouvez-vous appeler les mêmes modèles depuis votre code, et dans quel format ?",
  },
  table: {
    title: "Tous côte à côte",
    intro:
      "Faites défiler horizontalement sur mobile. Données des concurrents vérifiées le {{date}} sur leurs propres pages. Données {{appName}} lues en direct dans notre configuration.",
  },
  us: {
    title: "{{appName}} : tous les types de modèles dans un seul chat",
    intro:
      "{{modelCount}} modèles dans un seul chat, avec un seul solde. Vous choisissez le niveau de filtre à chaque message.",
    models:
      "Modèles : {{uncensored}} non censurés, à côté de {{mainstream}} grand public et {{open}} ouverts. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, ce qui donne un modèle aux opinions politiques à contre-courant.",
    switch:
      "Changez de modèle en pleine conversation. Interrogez un modèle non censuré, puis confrontez la réponse à un modèle grand public.",
    privacy:
      "Confidentialité : les chats en navigation privée restent dans le stockage local de votre navigateur, sans compte. Les chats privés sont enregistrés uniquement dans votre compte.",
    price:
      "Prix : {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte. Offres à partir de {{subPrice}} par mois. Les packs de crédits complètent une offre active et n'expirent jamais.",
    api: "API : les mêmes modèles via des endpoints compatibles OpenAI et Anthropic. Toute offre à partir de {{apiSubPrice}} par mois la débloque.",
    weak: "Là où nous sommes moins forts : pas de forfait illimité. Chaque message coûte des crédits, selon le modèle choisi.",
    hubLink: "Chat IA sans censure : tous les modèles, contexte et prix",
    ownLink: "Voir {{ownModel}}",
  },
  list: {
    title: "Les {{count}} alternatives, une par une",
    intro:
      "D'après leurs propres pages, vérifiées le {{date}}. Ce que chacune est, quels modèles elle propose, ce que son filtre autorise, ce que deviennent vos chats.",
    heading: "{{number}}. {{name}} : {{kind}}",
    models: "Modèles :",
    filter: "Filtre :",
    privacy: "Confidentialité :",
    price: "Prix :",
    priceValue: "Gratuit : {{free}}. Payant : {{plans}}.",
    pro: "Point fort :",
    con: "Bémol :",
    forWho: "Choisissez-la si :",
    versusLink: "{{appName}} vs {{name}} : le comparatif complet",
    visit: "Visiter {{name}}",
  },
  privacy: {
    title: "Confidentialité : lisez la politique, pas le slogan",
    intro:
      "« Aucun log », c'est une promesse forte. Voici ce que chacun écrit noir sur blanc.",
    nfg: "NoFilterGPT : la page d'accueil dit que les chats ne sont pas conservés. Sa politique de confidentialité indique que les adresses IP et les données d'usage peuvent être journalisées et que Cloudflare traite les données des requêtes.",
    us: "Sur {{appName}}, les chats en navigation privée restent dans le stockage local de votre navigateur, pas sur nos serveurs. Effacez les données du navigateur et ils disparaissent.",
    transit:
      "Tout modèle hébergé voit votre prompt. NoFilterGPT, Venice, nous : le message doit atteindre le serveur qui fait tourner le modèle. Seul un logiciel local le garde sur votre machine.",
    callout:
      "Un historique stocké sur l'appareil garde vos chats loin des serveurs d'une entreprise. Il ne les cache pas au modèle qui rédige les réponses.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure alternative à NoFilterGPT ?",
      a: "Tout dépend de ce qui vous manque. Un grand catalogue et l'historique sur l'appareil : Venice. Un modèle franc avec sa propre vision du monde : uncensored.ai. Le paiement à l'usage : NanoGPT. La confidentialité totale : LM Studio sur votre propre machine. Modèles non censurés, ouverts et grand public, plus les médias, dans un seul chat avec un seul solde : {{appName}}.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à NoFilterGPT ?",
      a: "Oui. FreedomGPT démarre gratuitement sans compte. LM Studio est gratuit sur votre propre matériel. {{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte, modèles non censurés compris après une confirmation unique de majorité.",
    },
    models: {
      q: "Quel modèle utilise NoFilterGPT ?",
      a: "Sa page d'accueil décrit un modèle maison basé sur l'architecture GPT, sans nommer de modèle de base. Sur {{appName}}, chaque modèle a sa propre page avec le labo, la fenêtre de contexte et le prix. Vous savez qui vous répond.",
    },
    private: {
      q: "Quelle alternative protège le mieux la vie privée ?",
      a: "Un logiciel local comme LM Studio : le modèle tourne sur votre appareil et les prompts ne le quittent jamais. Parmi les services hébergés, Venice et la navigation privée de {{appName}} gardent l'historique dans le navigateur. Tout modèle hébergé voit malgré tout le prompt auquel il répond.",
    },
    api: {
      q: "Quelle alternative a une API sans censure ?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI et {{appName}} proposent tous des API compatibles OpenAI. NoFilterGPT réserve son API à l'offre Professional. Sur {{appName}}, toute offre à partir de {{apiSubPrice}} par mois débloque l'API.",
    },
    account: {
      q: "Faut-il un compte pour essayer ?",
      a: "Pas sur {{appName}} : le chat en navigation privée fonctionne sans. Un compte gratuit garde vos chats sur tous vos appareils et porte le quota gratuit à {{freeCredits}} crédits par mois.",
    },
    chatgptLink: "Une alternative à ChatGPT sans filtre",
    kindsLink: "Abliterated, affiné ou sa propre vision : les trois types",
  },
  cta: {
    title: "Choisissez le modèle. Pas seulement le filtre.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Lancez-vous en navigation privée et essayez n'importe quel modèle.",
    start: "Lancer un chat privé",
    models: "Voir les modèles non censurés",
  },
};
