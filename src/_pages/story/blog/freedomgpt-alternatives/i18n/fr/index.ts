import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternatives à FreedomGPT : les apps d'IA sans censure comparées (2026)",
    description:
      "Alternatives à FreedomGPT vérifiées à la source : Venice, NanoGPT, uncensored.ai, Gab AI, LM Studio, Ollama et {{appName}}. Prix, vie privée, hors ligne.",
    category: "Comparatif",
    imageAlt: "Alternatives à FreedomGPT comparées côte à côte",
    keywords:
      "alternative à FreedomGPT, alternatives FreedomGPT, sites comme FreedomGPT, applis comme FreedomGPT, FreedomGPT vs Venice, FreedomGPT Liberty, alternative FreedomGPT desktop, IA sans censure, IA non censurée, chat IA sans filtre, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif",
    readTime: "9 min de lecture",
    title: "Alternatives à FreedomGPT. Même idée, moins de pièges.",
    subtitle:
      "{{count}} alternatives et {{appName}}, comparées sur ce que disent leurs propres pages de tarifs, de confidentialité et de filtrage.",
  },
  intro: {
    lead: "FreedomGPT promet un abonnement pour des centaines de modèles, sans censure compris. Bonne idée. Les pièges se trouvent dans sa propre FAQ, sa politique de confidentialité et une appli de bureau que personne ne met à jour depuis des années.",
    p2: "Ci-dessous : ce que FreedomGPT promet vraiment, ce que ses crédits achètent, et {{count}} alternatives vérifiées sur leurs propres pages. FreedomGPT au {{fgDate}}, les autres au {{date}}. Nous disons aussi où elles font mieux que nous.",
    relation:
      "En toute transparence : nous sommes clients de FreedomGPT. {{freedomGptExamples}} tourne sur {{appName}} via l'API de FreedomGPT elle-même.",
  },
  fg: {
    title: "Ce que propose FreedomGPT",
    intro:
      "D'après sa page d'accueil, ses tarifs, sa politique de confidentialité, sa doc API et GitHub, lus le {{fgDate}}.",
    models:
      "Modèles : la page d'accueil revendique plus de 400 modèles dans un seul abonnement et cite ChatGPT, Claude, Gemini, Grok, Kimi, GLM, DeepSeek, Qwen, Llama, Mistral et d'autres, à côté d'options sans censure pour l'écriture, le jeu de rôle et la recherche.",
    filter:
      "Filtre : sa propre FAQ précise qu'une étiquette sans censure ne garantit pas une réponse à chaque demande, et que les règles du modèle et du service s'appliquent toujours.",
    price:
      "Prix : essai gratuit sans carte ni compte. Pro coûte {{proPrice}} par mois pour {{proCredits}} crédits. Ses propres estimations : environ {{replyCost}} crédits par réponse premium, {{imageCost}} par image, {{videoCost}} par vidéo de cinq secondes.",
    bonus:
      "Bonus d'inscription : 100 crédits, mais seulement pour les nouveaux comptes Google, Apple ou X éligibles. Une inscription par e-mail et mot de passe n'en reçoit aucun.",
    privacy:
      "Confidentialité : la page d'accueil conseille de ne supposer ni anonymat ni conservation nulle. La politique de confidentialité indique que messages, enregistrements vocaux et images partent chez des fournisseurs d'IA tiers, sans durée de conservation.",
    apps: "Applis et API : web, iPhone, iPad et Android. La clé API se récupère dans le tableau de bord, la doc n'affiche aucun prix. Le dernier commit de l'appli de bureau open source date du {{desktopDate}}.",
    why: "Pourquoi on cherche ailleurs : savoir ce qu'un mois achète vraiment, trouver une appli hors ligne encore maintenue, ou une politique qui garde les chats hors d'un serveur.",
    sourceHome: "Page d'accueil de FreedomGPT",
    sourcePricing: "Tarifs de FreedomGPT",
    sourcePrivacy: "Politique de confidentialité de FreedomGPT",
    sourceApi: "Doc API de FreedomGPT",
    sourceRepo: "Dépôt de l'appli de bureau FreedomGPT",
  },
  credits: {
    title: "Ce que {{proPrice}} par mois achètent chez FreedomGPT",
    intro:
      "{{proCredits}} crédits divisés par les estimations de FreedomGPT. L'un ou l'autre, ou un mélange.",
    replies:
      "Environ {{replies}} réponses premium, à {{replyCost}} crédits l'une.",
    images: "Ou environ {{images}} images, à {{imageCost}} crédits l'une.",
    videos:
      "Ou {{videos}} vidéos de cinq secondes, à {{videoCost}} crédits l'une.",
    us: "Sur {{appName}}, chaque page de modèle affiche son prix actuel par message avant l'envoi, et les forfaits démarrent à {{subPrice}} par mois pour {{subCredits}} crédits. Les modèles bon marché font durer un forfait, les modèles de pointe moins. Vous voyez lequel est lequel.",
  },
  criteria: {
    title: "Ce qu'il faut comparer avant de changer",
    intro: "Cinq questions tranchent.",
    models:
      "Modèles : combien sans censure, de quel type (abliterated ou vraiment non censuré), et Claude, GPT et Gemini sont-ils au même endroit ?",
    filter:
      "Filtre : ce que les conditions interdisent vraiment, et si l'étiquette sans censure signifie que le modèle répond.",
    privacy:
      "Confidentialité : où vivent vos chats, qui d'autre les reçoit, et combien de temps on les garde.",
    price:
      "Prix : ce qu'un mois achète en réponses, images et vidéos. Pas seulement le prix affiché.",
    offline:
      "Hors ligne : existe-t-il une option locale maintenue, ou seulement une appli cloud ?",
  },
  table: {
    title: "Tous côte à côte",
    intro:
      "Faites défiler sur mobile. Données des concurrents vérifiées le {{date}} sur leurs propres pages. Données de {{appName}} lues en direct dans notre configuration.",
  },
  us: {
    title: "{{appName}} : les modèles sans censure, nommés et chiffrés",
    intro:
      "{{modelCount}} modèles dans un seul chat avec un seul solde. Vous choisissez le modèle à chaque message, et chaque modèle a sa propre page.",
    models:
      "Modèles : {{uncensored}} sans censure à côté de {{mainstream}} modèles grand public et {{open}} modèles ouverts. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, ce qui donne un modèle aux opinions politiques à contre-courant.",
    liberty:
      "Liberty, le modèle maison de FreedomGPT, est là aussi ({{freedomGptExamples}}), à côté de versions abliterated de GLM, DeepSeek et Kimi. Comparez sa réponse avec un autre modèle dans le même fil.",
    libertyOff:
      "Des versions abliterated de GLM, DeepSeek et Kimi à côté de Claude, GPT et Gemini. Comparez les réponses dans le même fil.",
    privacy:
      "Confidentialité : les chats incognito restent dans le stockage local de votre navigateur, sans compte. Les chats privés sont enregistrés dans votre compte uniquement.",
    price:
      "Prix : {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec. Forfaits dès {{subPrice}} par mois. Les modèles sans censure se débloquent après une confirmation unique de vos 18 ans.",
    open: "Open source : toute la plateforme est sur GitHub et activement développée. Hébergez votre propre instance si vous le souhaitez.",
    weak: "Là où nous sommes moins forts : pas de forfait tout compris, et la vidéo coûte aussi de vrais crédits ici. Le démarrage gratuit sans compte de FreedomGPT est aussi simple que le nôtre.",
    hubLink: "Chat IA sans censure : tous les modèles, avec contexte et prix",
    abliteratedLink: "Les modèles abliterated à utiliser dans le navigateur",
    libertyLink: "Voir FreedomGPT Liberty sur {{appName}}",
    ownLink: "Voir {{ownModel}}",
  },
  list: {
    title: "Les {{count}} alternatives, une par une",
    intro:
      "D'après leurs propres pages, vérifiées le {{date}}. Ce qu'est chacune, ses modèles, ce que permet son filtre, ce que deviennent vos chats.",
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
    intro: "Ce que chacun écrit noir sur blanc.",
    fg: "FreedomGPT : messages, enregistrements vocaux et images sont partagés avec des fournisseurs d'IA tiers. Aucune durée de conservation indiquée. Sa propre page d'accueil déconseille de compter sur l'anonymat.",
    us: "{{appName}} en incognito : les chats vivent dans le stockage local de votre navigateur, pas sur nos serveurs. Effacez les données du navigateur et ils disparaissent.",
    local:
      "LM Studio et Ollama : le modèle tourne sur votre machine et le prompt ne la quitte jamais. Le prix, c'est votre propre matériel.",
    callout:
      "Tout modèle hébergé voit le prompt auquel il répond. Un historique sur l'appareil tient vos chats loin d'un serveur d'entreprise, pas loin du modèle.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure alternative à FreedomGPT ?",
      a: "Tout dépend de ce qui vous manque. Historique sur l'appareil et grand catalogue : Venice. Paiement à l'usage sans abonnement : NanoGPT. Un modèle franc avec sa propre vision du monde : uncensored.ai. Entièrement hors ligne : LM Studio ou Ollama. Modèles sans censure, ouverts et grand public avec un prix public par message, dans un seul chat : {{appName}}.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à FreedomGPT ?",
      a: "Oui. Ollama est gratuit et open source sur votre propre matériel, LM Studio est gratuit en local. {{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte, modèles sans censure compris après une confirmation unique de vos 18 ans.",
    },
    liberty: {
      q: "Peut-on encore utiliser FreedomGPT Liberty ailleurs ?",
      a: "Oui. {{appName}} propose {{freedomGptExamples}} via l'API de FreedomGPT : vous utilisez Liberty à côté de {{uncensored}} autres modèles sans censure et comparez ses réponses.",
      aOff: "Liberty est le modèle maison de FreedomGPT. Sur {{appName}}, vous avez {{uncensored}} autres modèles sans censure, abliterated et vraiment non censurés, dans un seul chat.",
    },
    desktop: {
      q: "L'appli de bureau FreedomGPT est-elle encore maintenue ?",
      a: "Son dépôt GitHub open source affiche un dernier commit le {{desktopDate}}. Pour travailler hors ligne aujourd'hui, Ollama et LM Studio sont les options maintenues.",
    },
    private: {
      q: "Quelle alternative protège le mieux la vie privée ?",
      a: "Un outil local : Ollama ou LM Studio gardent chaque prompt sur votre appareil. Côté hébergé, Venice et le mode incognito de {{appName}} gardent l'historique dans le navigateur. La politique de FreedomGPT partage les messages avec des fournisseurs d'IA tiers.",
    },
    api: {
      q: "Quelle alternative propose une API sans censure ?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI et {{appName}} proposent tous une API compatible OpenAI. FreedomGPT en a une aussi, sans prix dans sa doc. Sur {{appName}}, tout forfait dès {{apiSubPrice}} par mois débloque l'API.",
    },
    gabLink: "Alternatives à Gab AI, comparées",
    nofilterLink: "Alternatives à NoFilterGPT, comparées",
    noGpuLink: "Des modèles sans censure sans carte graphique",
  },
  cta: {
    title: "Sachez ce que vous payez. Puis demandez tout.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Lancez un chat incognito et essayez n'importe quel modèle.",
    start: "Lancer un chat incognito",
    models: "Voir les modèles sans censure",
  },
};
