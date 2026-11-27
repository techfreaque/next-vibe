import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Chat IA gratuit sans inscription ni compte | {{appName}}",
    description:
      "Chat IA gratuit sans inscription sur {{appName}} : crédits offerts chaque mois, modèles grand public à non censurés, historique incognito dans le navigateur.",
    category: "Guide",
    imageAlt: "Un chat IA qui démarre sans formulaire d'inscription",
    keywords:
      "chat IA sans inscription, IA sans compte, chat IA anonyme, chat IA sans connexion, chat IA gratuit sans inscription, IA gratuite sans compte, chat IA privé, chat IA non censuré sans inscription, chat IA incognito, chatbot sans e-mail, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Guide",
    readTime: "6 min de lecture",
    title: "Un chat IA gratuit et sans inscription. Sans e-mail. Sans numéro.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, {{modelCount}} modèles de chat, un historique incognito qui reste dans votre navigateur. Et la liste honnête de ce que l'anonymat ne couvre pas.",
  },
  intro: {
    lead: "Vous voulez poser une seule question. Le chatbot exige d'abord votre e-mail, un mot de passe, un numéro de téléphone et un clic sur la bannière cookies. Le temps d'entrer, la question s'est envolée.",
    p2: "Sur {{appName}}, vous ouvrez un chat et vous tapez. Aucun formulaire. Ce guide montre ce que vous obtenez sans compte, ce qu'anonyme signifie vraiment ici, et quand un compte gratuit vaut le coup.",
  },
  guest: {
    title: "Ce que vous obtenez sans compte",
    intro:
      "Sans inscription ne veut pas dire version démo. C'est le vrai produit, avec un quota.",
    credits:
      "{{guestCredits}} crédits gratuits chaque mois, sans compte, sans carte. Le quota se renouvelle tous les mois.",
    models:
      "Les {{modelCount}} modèles de chat de {{labCount}} laboratoires : grand public, ouverts et non censurés, dans un seul sélecteur de modèles.",
    uncensored:
      "Les {{uncensored}} modèles non censurés aussi, après une confirmation 18+ unique.",
    media:
      "Génération d'images, de vidéos, de musique et de voix avec les mêmes crédits : {{imageModels}} modèles d'image, {{videoModels}} modèles vidéo.",
    mediaLink: "Créer des images, des vidéos et de la musique",
  },
  starters: {
    title: "Les modèles les moins chers pour commencer",
    intro:
      "Les deux modèles de texte les moins chers de chaque catégorie, tirés de notre registre. Pas cher ne veut pas dire faible : ce sont eux qui font durer {{guestCredits}} crédits le plus longtemps.",
    footnote:
      "Par message désigne un échange de référence sur la route la moins chère. Avec {{cheapestModel}}, {{guestCredits}} crédits invité couvrent environ {{guestMessages}} messages courts. Les longues conversations et les longues réponses coûtent plus.",
  },
  table: {
    model: "Modèle",
    context: "Contexte",
    price: "Par message",
    chat: "Essayer",
    chatLink: "Discuter avec {{model}}",
  },
  anonymous: {
    title: "Ce qu'anonyme veut dire ici, et ce que ça ne veut pas dire",
    intro:
      "Privé ne veut pas dire invisible. Voici la version honnête, sans rien promettre que notre politique de confidentialité ne dise pas.",
    yesTitle: "Ce qui reste chez vous",
    noEmail:
      "Ni nom, ni e-mail, ni numéro de téléphone. Nous n'en avons pas besoin pour vous répondre.",
    incognito:
      "Les chats incognito sont stockés dans votre navigateur, pas sur nos serveurs. Effacez les données du navigateur et l'historique disparaît.",
    trackers:
      "Aucun traceur tiers, aucun pixel publicitaire, aucun fingerprinting. Un seul cookie propriétaire indique à notre serveur à quel navigateur il parle.",
    noTitle: "Qui voit quand même votre message",
    provider:
      "Le fournisseur d'IA : chaque message passe par notre serveur jusqu'à l'entreprise qui fait tourner le modèle, et celle-ci voit le prompt pour y répondre. Toute IA hébergée fonctionne ainsi.",
    media:
      "Les médias générés : les images, l'audio et les vidéos créés sans compte sont stockés sur nos serveurs pour que vous puissiez les voir et les télécharger, puis supprimés automatiquement au bout de 4 mois si vous ne vous inscrivez jamais.",
    network:
      "Le réseau : comme n'importe quel site, notre serveur voit la connexion établie par votre navigateur. Un VPN masque aussi votre adresse à nos yeux.",
    callout:
      "Besoin d'un prompt qui ne quitte jamais votre machine ? Aucun chat hébergé ne peut le promettre. Faites tourner un modèle en local ou auto-hébergez.",
    policyLink: "Lire la politique de confidentialité",
  },
  steps: {
    title: "De zéro à une réponse en moins d'une minute",
    intro: "Quatre étapes. Aucune n'est un formulaire.",
    open: {
      title: "Ouvrez un chat incognito",
      body: "Un clic depuis n'importe quelle page. Aucun écran de compte devant.",
    },
    pick: {
      title: "Choisissez un modèle",
      body: "Commencez petit prix, changez quand vous voulez. Le chat garde son historique quand vous changez de modèle.",
    },
    confirm: {
      title: "Confirmez 18+ si vous passez au non censuré",
      body: "Les modèles non censurés demandent une seule fois une confirmation 18+ et l'acceptation des conditions. Les modèles grand public et ouverts ne demandent rien.",
    },
    ask: {
      title: "Posez votre question",
      body: "{{guestCredits}} crédits par mois. Une fois épuisés, attendez le mois suivant ou créez un compte gratuit.",
    },
  },
  account: {
    title: "Quand un compte gratuit vaut le coup",
    intro: "Jamais obligatoire. Parfois utile.",
    credits:
      "Jusqu'à {{freeCredits}} crédits gratuits par mois avec un e-mail vérifié, au lieu de {{guestCredits}}.",
    newsletter:
      "Confirmez la newsletter et votre total mensuel passe à {{maxCredits}} crédits : {{newsletterBonus}} crédits de bonus en plus.",
    sync: "Vos chats enregistrés dans vos dossiers privés, sur chaque appareil où vous vous connectez.",
    control:
      "Exportez toutes vos données en JSON ou supprimez votre compte depuis les Paramètres. La suppression efface vos données personnelles.",
    plans:
      "Abonnements à partir de {{subPrice}} par mois quand les crédits gratuits ne suffisent plus.",
  },
  stricter: {
    title: "Besoin de plus de confidentialité ?",
    intro: "Choisissez la configuration adaptée au risque.",
    selfHost: "Auto-héberger {{appName}} : votre serveur, vos logs, vos règles",
    local: "Faire tourner un modèle non censuré en local, ou en ligne sans GPU",
    venice: "Alternatives à Venice AI, comparées sur la confidentialité",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Existe-t-il un chat IA sans inscription ?",
      a: "Oui. Sur {{appName}}, vous ouvrez un chat et vous tapez, sans compte ni e-mail. Les invités reçoivent {{guestCredits}} crédits gratuits par mois, valables sur les {{modelCount}} modèles de chat.",
    },
    anonymous: {
      q: "Un chat IA sans compte est-il vraiment anonyme ?",
      a: "Anonyme vis-à-vis de nous, au sens où nous ne demandons jamais qui vous êtes et où l'historique incognito reste dans votre navigateur. Pas invisible : le fournisseur d'IA voit chaque prompt pour y répondre, et notre serveur voit votre connexion comme n'importe quel site.",
    },
    free: {
      q: "C'est gratuit ?",
      a: "{{guestCredits}} crédits par mois sont gratuits sans compte, jusqu'à {{freeCredits}} avec un compte gratuit vérifié. Leur durée dépend du modèle : le moins cher, {{cheapestModel}}, coûte {{cheapestPrice}} par message.",
    },
    uncensored: {
      q: "Puis-je utiliser une IA non censurée sans m'inscrire ?",
      a: "Oui. Les {{uncensored}} modèles non censurés fonctionnent sans compte après une confirmation 18+ unique.",
    },
    saved: {
      q: "Mes chats sont-ils enregistrés ?",
      a: "Les chats incognito sont enregistrés uniquement dans votre navigateur, vous les retrouvez donc sur le même appareil. Effacez les données du navigateur et ils disparaissent. Avec un compte, vous pouvez aussi enregistrer vos chats dans des dossiers privés synchronisés entre vos appareils.",
    },
    runOut: {
      q: "Que se passe-t-il quand mes crédits gratuits sont épuisés ?",
      a: "Attendez le quota du mois suivant, ou créez un compte gratuit et vérifiez votre e-mail pour obtenir jusqu'à {{freeCredits}} crédits par mois. Les crédits déjà dépensés comme invité ce mois-ci comptent dans ce total.",
    },
    chatLink: "Chat IA non censuré dans votre navigateur",
    chatgptLink: "Une alternative à ChatGPT avec des modèles non censurés",
  },
  cta: {
    title: "Pas de formulaire. Posez votre question.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, tous les modèles, incognito par défaut.",
    start: "Lancer un chat incognito",
    models: "Comparer tous les modèles",
  },
};
