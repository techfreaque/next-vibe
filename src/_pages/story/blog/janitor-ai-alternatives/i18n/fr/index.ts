import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title:
    "Alternatives à Janitor AI pour le jeu de rôle : personnages, mémoire et tarifs",
  description:
    "Onze solutions pour poursuivre un récit quand Janitor AI est en panne, perd le fil ou parle à votre place. Comparez les offres gratuites, les fiches de personnages et les outils de mémoire.",
  keywords:
    "alternatives à Janitor AI, jeu de rôle IA gratuit, fiches de personnages, compagnon IA",
  category: "Comparatif",
  readTime: "5 min de lecture",
  back: "Retour au blog",
  subtitle:
    "Onze façons de poursuivre la scène, du chat gratuit au modèle installé sur votre ordinateur. Tarifs vérifiés le {{date}}.",
  lead: "Vous tenez à votre personnage sur Janitor, mais ses répliques sonnent faux ? Essayez d’abord un autre modèle. Si vous voulez écrire hors ligne, tenir une bible d’univers ou retrouver le même compagnon pendant des mois, le choix de l’application compte aussi.",
  janitor: {
    title: "Ce que propose Janitor AI",
    fit: "Découvrir les personnages de la communauté",
    intro:
      "Janitor AI est un site de fiction interactive pour adultes. On y choisit un personnage de la communauté ou on crée le sien, puis on écrit la scène à deux. Les conditions exigent d’avoir 18 ans et interdisent les avatars publics sexuellement explicites. L’aide explique comment connecter un modèle externe, par exemple via OpenRouter, avec sa propre clé API.",
    plans:
      "L’offre gratuite comprend des échanges illimités sur les modèles standard, avec environ 9 000 jetons de contexte. Janitor+ annonce cinq fois plus de contexte, des réponses prioritaires et un quota mensuel pour réécrire des réponses avec des modèles premium. Janitor a annoncé 12,99 USD par mois. L’App Store américain affiche aussi 99 USD par an. Un fournisseur externe peut facturer ses appels séparément.",
  },
  why: {
    title: "Pourquoi chercher une autre plateforme ?",
    outage:
      "Pendant une panne, une personne a demandé sur Reddit où continuer à chercher des idées pour son livre. Le 19 novembre, Janitor a renvoyé ses utilisateurs vers jani.com le temps de récupérer son domaine habituel. Si vous cherchez simplement à retrouver vos conversations, essayez cette adresse en premier.",
    update: "L’annonce de Janitor sur son nom de domaine",
    voice:
      "Dans un autre fil, des utilisateurs racontent que leurs personnages se répètent, oublient des détails ou écrivent les répliques du joueur. Il s’agit de témoignages individuels. Pour un récit à plusieurs voix, cherchez une mémoire modifiable ou un carnet d’univers. Si le personnage parle à votre place, essayez la même entrée en scène avec un autre modèle.",
  },
  table: {
    scroll: "Faites défiler le tableau vers la gauche pour voir les tarifs.",
    title: "Janitor AI et onze alternatives en un coup d’œil",
    intro:
      "Le tableau présente une sélection de forfaits. Les tarifs des autres services sont en dollars américains. Ceux de Kindroid et de Nomi proviennent de l’App Store américain. Le détail des offres gratuites figure plus bas.",
    fit: "Pour quel usage ?",
    price: "Tarif ou coût d’utilisation",
  },
  us: {
    fit: "Choisir le modèle selon la scène",
    price: "À partir de {{subPrice}} par mois",
    title: "{{appName}} pour garder la main sur votre récit",
    models:
      "Nous éditons {{appName}}. Le catalogue compte {{modelCount}} modèles de chat, dont {{uncensored}} sans censure. Avant d’utiliser un modèle sans censure, chacun, même sans compte, doit confirmer personnellement avoir au moins 18 ans et accepter les réponses non filtrées. Ce consentement est révocable dans les paramètres.",
    example: "Parmi les modèles sans censure disponibles figure {{ownModel}}.",
    skills:
      "Le mode jeu de rôle demande au modèle de rester dans son personnage et de vous laisser décider des actions du vôtre. Thea et Hermes sont deux compagnons intégrés pour des échanges suivis. Si vous aimez surtout parcourir des personnages prêts à jouer, le répertoire de Janitor est plus pratique.",
    limit:
      "Sans compte, vous disposez de {{guestCredits}} crédits gratuits par mois, contre {{freeCredits}} avec un compte gratuit. Une longue scène avec un modèle premium peut épuiser ce solde. Si vous préférez écrire sans compter les répliques, le chat standard gratuit de Janitor convient mieux.",
    link: "Découvrir le mode jeu de rôle",
  },
  list: "Quelle plateforme pour votre prochaine histoire ?",
  heading: "{{name}} : {{fit}}",
  free: {
    janitor: "Chat standard illimité",
    us: "{{guestCredits}} crédits par mois sans compte",
    characterAi: "Styles de base illimités",
    sillyTavern: "Interface gratuite",
    chub: "Selon le moteur choisi",
    crushOn: "Modèles gratuits illimités",
    spicy: "Offre gratuite",
    venice: "10 requêtes texte par jour",
    nanoGpt: "Un modèle web gratuit",
    horde: "Machines de bénévoles",
    kindroid: "Bref aperçu",
    nomi: "50 messages par jour",
  },
  offers: {
    characterAi: {
      fit: "Dialogues courts avec filtre de contenu",
      body: "ShortSqueak convient aux échanges vifs, PipSqueak 3 laisse plus de place à la scène. Les deux styles permettent d’écrire gratuitement sans limite de messages. Lite réduit les publicités et permet d’épingler davantage de souvenirs. Character.AI interdit la pornographie, y compris avec un abonnement.",
    },
    sillyTavern: {
      fit: "Fiches de personnages à emporter",
      price: "Logiciel gratuit, matériel ou API à votre charge",
      body: "Gardez vos fiches et vos notes d’univers sur votre ordinateur. Avec un modèle local, vous pouvez jouer hors ligne. Une clé API permet aussi de connecter un modèle hébergé. À vous d’installer l’interface et de fournir le modèle.",
    },
    chub: {
      fit: "Univers partagés et carnets de référence",
      body: "Dans Chub, un carnet d’univers peut ajouter l’histoire d’une ville au contexte uniquement quand son nom apparaît. La scène en cours conserve ainsi plus de place. Il faut rédiger les entrées et choisir leurs déclencheurs. Chub annonce des messages illimités avec Mars. Si vous utilisez une clé API commerciale, son fournisseur fixe la facture.",
    },
    crushOn: {
      fit: "Personnages prêts à jouer, classés par genre",
      body: "Choisissez un personnage et lancez la scène sans configurer d’API. Les modèles gratuits permettent des échanges illimités, avec 100 crédits mensuels en plus pour essayer les modèles Pro. Standard en fournit 2 000 par mois. Le nombre de répliques obtenu dépend du modèle.",
    },
    spicy: {
      fit: "Souvenirs que l’on peut corriger",
      body: "Vous pouvez commencer gratuitement. Le Memory Manager payant permet d’épingler une promesse ou de corriger un détail que le personnage déforme. La mémoire sémantique automatique arrive avec True Supporter. Le premier abonnement ne suffit donc pas à retrouver tous les fils d’un long récit.",
    },
    venice: {
      fit: "Chats privés et personnages sur mesure",
      body: "Pro permet de créer et de partager des personnages, avec des requêtes texte standard illimitées. L’offre gratuite couvre dix requêtes texte par jour. Certains modèles de pointe consomment des crédits même avec Pro. Vérifiez le modèle avant de vous lancer dans un long chapitre.",
    },
    nanoGpt: {
      fit: "Un modèle à connecter à une autre appli",
      body: "Le même solde sert sur le web et via l’API. Pro inclut certains modèles ouverts avec un quota hebdomadaire de jetons en entrée. Le modèle gratuit est réservé au web. Les appels depuis votre application de jeu de rôle restent donc facturés.",
    },
    horde: {
      fit: "Écrire grâce aux ordinateurs de bénévoles",
      price: "Gratuit sur AI Horde",
      body: "Dans le navigateur, KoboldAI Lite permet d’explorer plusieurs branches du récit, de noter les règles du monde et d’inscrire les faits à rappeler à chaque réponse. Les bénévoles d’AI Horde fournissent la puissance de calcul. Vous n’avez besoin ni de carte graphique ni d’abonnement. Le choix du modèle et l’attente dépendent des machines disponibles.",
    },
    kindroid: {
      fit: "Un compagnon à appeler en audio ou en vidéo",
      body: "Imaginez son passé, choisissez sa voix et appelez-le en vidéo. Kindroid se prête aux relations suivies. L’essai premium habituel de trois jours exige un moyen de paiement et se transforme en abonnement sauf résiliation. Il existe aussi un bref aperçu gratuit distinct de cet essai.",
    },
    nomi: {
      fit: "Des compagnons que l’on retrouve au fil du temps",
      body: "Un compagnon Nomi garde des souvenirs d’une conversation à l’autre. Les discussions de groupe permettent à vos personnages de se parler. L’accès de base est gratuit, avec des abonnements pour un usage plus soutenu. Le système de Nomi se prête mal aux essais d’un même personnage sur différents modèles externes.",
    },
  },
  faq: {
    title: "Questions fréquentes",
    free: {
      q: "Où peut-on écrire gratuitement ?",
      a: "Character.AI offre des conversations filtrées illimitées. CrushOn propose des échanges illimités sur ses modèles gratuits. Avec KoboldAI Lite et AI Horde, chaque réponse est gratuite si vous pouvez attendre qu’une machine se libère.",
    },
    memory: {
      q: "Comment rappeler à un personnage ce qui s’est passé plusieurs chapitres auparavant ?",
      a: "Consignez les faits qui doivent rester stables dans un carnet d’univers Chub ou dans le champ mémoire de KoboldAI Lite. Pour retrouver le même compagnon au fil du temps, essayez Nomi. Même une grande fenêtre de contexte finit par laisser de côté des détails plus anciens.",
    },
    move: {
      q: "Dois-je quitter mon personnage Janitor pour changer de modèle ?",
      a: "Non. Le guide du proxy de Janitor explique comment relier un autre fournisseur au chat en cours. Si vous changez de service, vérifiez les formats de fiches acceptés et gardez une copie de la description de votre personnage ainsi que de vos notes de scène.",
    },
  },
  related: {
    character: "Comparer les alternatives à Character.AI",
    hub: "Explorer les modèles d’IA sans censure",
  },
  cta: {
    title: "Écrivez une scène avec le mode jeu de rôle",
    start: "Choisir un modèle de jeu de rôle",
  },
};
