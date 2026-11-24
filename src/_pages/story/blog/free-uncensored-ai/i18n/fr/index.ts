import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "IA sans censure gratuite : ce que les offres donnent vraiment",
    description:
      "IA sans censure gratuite, vérifiée : Venice, uncensored.ai, FreedomGPT, Gab AI, NanoGPT, OpenRouter, LM Studio, Ollama et {{appName}}. Limites, filtres, vie privée et pièges.",
    category: "Guide",
    imageAlt: "Les IA sans censure gratuites comparées",
    keywords:
      "IA sans censure gratuite, IA non censurée gratuite, IA sans censure gratuit, chat IA sans filtre gratuit, IA sans filtre gratuite, IA sans censure sans inscription, IA sans limite gratuite, IA sans censure en français, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide",
    readTime: "8 min de lecture",
    title: "IA sans censure gratuite. Ce que gratuit veut vraiment dire.",
    subtitle:
      "{{count}} offres gratuites et {{appName}}, vérifiées sur leurs propres pages de tarifs, de filtres et de confidentialité. Avec toutes les limites que la page d'accueil oublie.",
  },
  intro: {
    lead: "Gratuit et sans censure : beaucoup le promettent. Puis arrivent le quota du jour après trois réponses, le modèle de base au lieu du bon, la vérification de l'e-mail avant le moindre crédit, ou un téléchargement de 40 Go.",
    p2: "Voici ce que chaque offre donne vraiment gratuitement, d'après ses propres pages (dernière vérification le {{date}}). Transparence totale : nous achetons des modèles chez certains de ces fournisseurs et les proposons dans notre chat. Quand ils offrent plus en gratuit, nous le disons.",
  },
  short: {
    title: "La réponse courte",
    intro: "Trois lignes avant d'aller plus loin.",
    local:
      "Seule l'IA locale est vraiment gratuite et illimitée : Ollama ou LM Studio sur votre propre ordinateur. Vous payez en matériel plutôt qu'en argent.",
    hosted:
      "Une IA sans censure hébergée est toujours gratuite avec une limite : des réponses par jour, des crédits par mois ou un seul modèle de base.",
    us: "Sur {{appName}}, vous recevez {{guestCredits}} crédits gratuits par mois sans compte, pour les {{modelCount}} modèles, y compris les {{uncensored}} non censurés.",
  },
  catch: {
    title: "Où se cache le piège de l'IA gratuite",
    intro: "Cinq endroits où le gratuit coûte quelque chose.",
    limit:
      "Le quota : les allocations quotidiennes s'épuisent souvent en quelques messages. Dans une longue conversation, chaque réponse compte.",
    models:
      "Les modèles : beaucoup d'offres gratuites ne donnent qu'un modèle de base ou maison. Les bons modèles sont réservés à l'abonnement.",
    account:
      "Le compte : certains services exigent un e-mail confirmé avant tout crédit gratuit. D'autres démarrent tout de suite.",
    data: "Les données : gratuit ne veut pas dire privé. Lisez ce qui est enregistré et si vos conversations servent à entraîner un modèle.",
    hardware:
      "Le matériel : en local, un message ne coûte rien, mais un bon modèle demande beaucoup de mémoire et une carte graphique solide.",
    callout:
      "Tout modèle hébergé voit votre prompt, gratuit ou payant. Seule une application locale le garde sur votre appareil.",
  },
  table: {
    title: "Toutes les offres gratuites côte à côte",
    intro:
      "Faites défiler sur mobile. Faits des fournisseurs vérifiés sur leurs propres pages, la date figure à chaque entrée. Les données de {{appName}} viennent en direct de notre configuration.",
  },
  us: {
    title: "Ce que vous obtenez gratuitement sur {{appName}}",
    intro:
      "Un chat, {{modelCount}} modèles, un seul solde. Ici, gratuit veut dire une allocation fixe valable pour chaque modèle, pas seulement pour le plus faible.",
    guest:
      "Sans compte : {{guestCredits}} crédits gratuits par mois. Ouvrez le chat et écrivez. Ni e-mail, ni numéro de téléphone.",
    account:
      "Avec un compte gratuit : {{freeCredits}} crédits par mois, {{maxCredits}} avec la newsletter. Les conversations sont synchronisées entre vos appareils.",
    models:
      "Tous les modèles sont inclus : {{uncensored}} non censurés à côté de Claude, GPT, Gemini et des modèles ouverts. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public. Résultat : un modèle aux opinions politiques à contre-courant.",
    consent:
      "Pour les modèles non censurés, vous confirmez une seule fois avoir 18 ans ou plus. Personne ne vous le redemande.",
    after:
      "Quand les crédits sont épuisés : attendez le mois suivant ou prenez une formule dès {{subPrice}} par mois.",
    weak: "Là où nous sommes moins forts en gratuit : des crédits, pas un forfait illimité. Le nombre de messages dépend du modèle. Chaque page de modèle fait le calcul pour vous.",
    hubLink: "Tous les modèles non censurés, avec contexte et prix",
    ownLink: "Voir {{ownModel}}",
  },
  list: {
    title: "Les {{count}} offres gratuites, une par une",
    intro:
      "Ce que chacune est, ce qu'elle donne gratuitement, ce que son filtre autorise et ce que deviennent vos conversations.",
    heading: "{{number}}. {{name}} : {{kind}}",
    free: "Gratuit :",
    filter: "Filtre :",
    privacy: "Confidentialité :",
    con: "Le piège :",
    forWho: "Choisissez-la si :",
    checked: "Vérifié le {{date}}.",
    versusLink: "{{appName}} vs {{name}} : la comparaison complète",
    visit: "Visiter {{name}}",
  },
  local: {
    title: "En local : la seule IA sans limite",
    intro: "Ollama et LM Studio tournent sur votre propre ordinateur.",
    cost: "Coût : rien par message, aucun quota. Vous payez une fois le matériel, puis l'électricité.",
    quality:
      "Qualité : votre machine fixe le plafond. Les petits modèles tournent sur presque tous les portables, les gros demandent beaucoup de mémoire graphique.",
    privacy:
      "Confidentialité : vos prompts ne quittent jamais votre appareil. On ne fait pas mieux.",
    link: "Pas d'ordinateur puissant ? Les modèles non censurés en ligne, sans GPU",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure IA sans censure gratuite ?",
      a: "Tout dépend de votre appareil. Avec un ordinateur puissant : Ollama ou LM Studio, gratuits et sans limite. Dans le navigateur : {{appName}} donne {{guestCredits}} crédits par mois pour tous les modèles, Venice 10 prompts texte par jour sur ses modèles de base, uncensored.ai 3 réponses par jour.",
    },
    noAccount: {
      q: "Existe-t-il une IA sans censure gratuite et sans inscription ?",
      a: "Oui. Sur {{appName}}, vous ouvrez le chat incognito et vous écrivez, sans compte ni e-mail. FreedomGPT indique aussi qu'on peut commencer sans carte ni compte. Gab AI n'accorde ses crédits gratuits qu'après confirmation de l'e-mail.",
    },
    unlimited: {
      q: "Existe-t-il une IA sans censure gratuite et illimitée ?",
      a: "Seulement en local. Ollama et LM Studio ne coûtent rien par message sur votre propre matériel. Toute offre gratuite hébergée a une limite, car quelqu'un paie les cartes graphiques sur lesquelles tourne le modèle.",
    },
    language: {
      q: "L'IA sans censure répond-elle en français ?",
      a: "Les grands modèles répondent dans la langue dans laquelle vous écrivez. Écrivez en français, la réponse arrive en français. Avec les petits modèles locaux, un test rapide s'impose : certains repassent à l'anglais sur les longues réponses.",
    },
    api: {
      q: "Existe-t-il une API sans censure gratuite ?",
      a: "En local, oui : Ollama et LM Studio fournissent un serveur compatible OpenAI sur votre machine. OpenRouter offre 50 requêtes gratuites par jour sur ses modèles gratuits, mais les modèles non censurés y sont rares. Sur {{appName}}, tout achat débloque l'API, formules dès {{apiSubPrice}} par mois. Les crédits gratuits servent uniquement au chat.",
    },
    legal: {
      q: "L'IA sans censure est-elle légale ?",
      a: "Un modèle qui refuse moins ne change pas la loi. Ce qui est interdit hors ligne le reste dans un chat, et nos conditions d'utilisation s'appliquent en plus. Ceci n'est pas un conseil juridique. Si vous traitez des données sensibles, lisez la politique de confidentialité du fournisseur ou travaillez en local.",
    },
    noSignUpLink: "Chat IA gratuit sans inscription : comment ça marche",
    kindsLink:
      "Abliterated, affiné ou vision du monde propre : les trois types",
  },
  cta: {
    title: "Essayez gratuitement. Sans compte.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois pour chaque modèle. Ouvrez un chat incognito et posez votre première question.",
    start: "Discuter gratuitement",
    models: "Voir les modèles non censurés",
  },
};
