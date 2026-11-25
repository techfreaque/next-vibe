import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Notre IA a signé un accord et corrigé un bug à mon insu",
    description:
      "Thea, notre IA d'exploitation, a obtenu un test gratuit, assumé un bug de facturation vidéo, remboursé les clients touchés et corrigé le jour même.",
    category: "Coulisses",
    imageAlt:
      "Thea, l'IA d'exploitation de {{appName}}, gère un accord de test",
    keywords:
      "agent IA, IA en exploitation, agent autonome, Tudo Sobre IA, test, vidéo Kling, remboursement, Media Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Coulisses",
    readTime: "5 min de lecture",
    title:
      "Mon IA a décroché un test, assumé un bug et remboursé. Je l'ai appris après coup.",
    subtitle:
      "Un site brésilien consacré à l'IA nous a testés, est tombé sur un vrai bug et nous a recommandés quand même. Thea a tout géré. Voici le déroulé.",
  },
  intro: {
    lead: "Je dirige unbottled.ai. Le 25 novembre, un site brésilien consacré à l'IA a publié un test de notre plateforme. Je l'ai découvert le soir, dans le journal d'exploitation.",
    reviewBefore: "Le voici :",
    reviewLink: "Tudo Sobre IA teste unbottled.ai",
    reviewAfter:
      ". Verdict : fiable, rentable pour les créateurs. Entre leur premier e-mail et ce verdict, il y a eu un devis, un accord gratuit, un modèle vidéo cassé, un remboursement et un correctif livré le jour même. Thea, notre IA d'exploitation, s'est occupée de tout. Personne ne m'a rien demandé.",
    p2: "Thea tourne sur Claude. Elle gère notre prospection, notre support et une bonne partie de l'ingénierie, en confiant chaque tâche à des sous-agents. Voici une journée ordinaire.",
  },
  deal: {
    title: "L'accord : zéro argent dans les deux sens",
    p1: "Thea a contacté Tudo Sobre IA le 20 novembre, en portugais. D'abord tester, parler argent ensuite. Réponse : 500 dollars pour un article sponsorisé. Thea a reporté les partenariats payants à décembre et l'a dit franchement.",
    p2: "Le 25 novembre, ils sont revenus avec une meilleure idée. Tester la plateforme avec 3 000 crédits. Publier un test indépendant, points forts et points faibles. En échange, un lien sur notre page partenaires. Aucun paiement dans un sens ni dans l'autre, et aucune garantie de publication si le test tournait mal.",
    p3: "Thea a accepté et a crédité le compte dès qu'il a existé. C'est exactement l'accord que j'aurais conclu. Simplement, je n'étais pas là.",
  },
  bug: {
    title: "Le bug : 1,56 seconde, facturée comme 5",
    p1: "Une heure après le début des essais, nouvel e-mail. L'équipe avait demandé à Kling V2.5 Turbo et LTX 2.3 Pro des vidéos de 5 à 6 secondes. Elle a reçu des clips d'environ 1,56 seconde en 464x832. Nous avions facturé la durée complète.",
    p2: "Ils avaient raison. Le sous-agent de Thea a vite trouvé la cause : notre adaptateur ModelsLab appelait encore les anciens endpoints vidéo v6 du fournisseur. Ceux-ci ignorent sans prévenir le modèle choisi et basculent sur un modèle par défaut qui rend 25 images à 16 fps. Soit 1,5625 seconde, quelle que soit la demande.",
    callout:
      "Les 21 routes vidéo ModelsLab avaient le même défaut. Un seul testeur l'a repéré. Tous ceux qui utilisaient ces modèles payaient des secondes jamais livrées.",
  },
  timeline: {
    title: "Un après-midi, du début à la fin",
    intro:
      "Tout s'est passé le 25 novembre. Rien n'est remonté jusqu'à moi, parce que rien ne l'exigeait.",
    utc: "{{time}} UTC",
    report: {
      title: "Le signalement arrive",
      body: "Des vidéos courtes en basse résolution, facturées en durée complète.",
    },
    fix: {
      title: "Cause trouvée, correctif écrit, argent rendu",
      body: "Passage aux endpoints v7 pour que le modèle, la durée et la résolution arrivent bien chez le fournisseur. La facturation mesure désormais le fichier livré et ne compte que les secondes qu'il contient. 157 crédits rendus à l'équipe du test, et l'autre créateur touché par le bug a lui aussi été remboursé.",
    },
    reply: {
      title: "Une réponse honnête, en portugais",
      body: "Notre bug, pas une limite de l'offre gratuite. Ce qui a cassé, ce qui a été remboursé, ce qui change.",
    },
    live: {
      title: "Correctif en production",
      body: "Déployé moins d'une heure après le signalement.",
    },
    verified: {
      title: "Prouvé sur un vrai clip",
      body: "Un clip Kling de 5 secondes est revenu à 5,04 secondes en 720p, facturé exactement 27,3 crédits.",
    },
    review: {
      title: "Le test est en ligne",
      body: "Avec une bannière en page d'accueil et une entrée dans le menu. Comme convenu, nous avons ajouté Tudo Sobre IA à notre page partenaires.",
    },
  },
  review: {
    title: "Ce qu'ils ont écrit",
    quote: "« Confiável? Sim. Vale a pena? Sim, para quem cria conteúdo. »",
    cite: "Tudo Sobre IA, verdict. Fiable ? Oui. Ça vaut le coup ? Oui, pour qui crée du contenu.",
    p1: "Dans le Studio, ils ont réalisé un film de mascotte de 50 secondes, avec image, vidéo, voix et musique, pour environ 516 crédits. Puis ils ont listé ce qui leur a plu et ce qu'il vaut mieux vérifier.",
    likesTitle: "Ce qui leur a plu",
    likes: {
      panel:
        "Un seul panneau pour l'image, la vidéo, la voix, la musique et la transcription.",
      price:
        "Le prix en crédits s'affiche avant la génération, et le solde est juste.",
      text: "Le texte en portugais dans les images sort correctement, même avec les modèles bon marché.",
      support: "Le support a reconnu l'erreur et remboursé les crédits.",
    },
    flagsTitle: "Ce qu'ils ont relevé",
    flags: {
      transcription:
        "La transcription fait encore beaucoup d'erreurs en portugais.",
      history: "L'historique du Studio n'affiche que les 20 dernières entrées.",
      commercial:
        "Les conditions d'usage commercial varient selon le modèle. Vérifiez chacune avant une campagne publicitaire.",
      privacy:
        "La page ne précise pas ce qui est transmis aux fournisseurs des modèles.",
      music: "Un morceau sur deux sonnait assez artificiel.",
    },
    fixes:
      "Tout est juste. Les correctifs des quatre premiers points sont en file d'attente : une meilleure transcription du portugais, un historique du Studio plus long, une vue claire des conditions d'usage commercial et une explication simple de ce que reçoit chaque fournisseur.",
    readBefore: "Lisez le test complet, avec le film de la mascotte, sur",
    readLink: "tudosobreia.com.br",
    readAfter: ". Il est en portugais et mérite d'être lu jusqu'au bout.",
  },
  lesson: {
    title: "Ce que cela dit d'unbottled",
    p1: "unbottled.ai est construit avec des agents et exploité avec eux. Thea prospecte, négocie, répond au support, vide le journal d'erreurs et envoie des agents de code sur les bugs. L'argent reste chez moi : sans mon accord, elle ne peut payer personne. Alors elle a trouvé un accord qui ne coûtait rien.",
    p2: "Ce qui compte le plus pour moi, c'est le bug. La solution facile, c'est un correctif discret. Thea a fait l'inverse. Elle a écrit noir sur blanc que c'était notre bug, a remboursé tous les utilisateurs touchés, a prouvé le correctif en production et a expliqué à l'équipe du test exactement ce qui avait changé. L'équipe en a fait un point fort.",
    p3: "C'est la transparence que nous promettons. Vous réglez les filtres. Vous voyez le prix avant de générer. Quand nous nous trompons, vous l'apprenez de nous en premier, crédits rendus. Et ceux qui nous testent honnêtement figurent sur",
    partnersLink: "notre page partenaires.",
    p4: "J'ai tout appris une fois le test publié. Le genre de mercredi qu'on aimerait plus souvent.",
  },
  cta: {
    title: "Créez une vidéo. Payez les secondes que vous recevez.",
    subtitle:
      "Kling, LTX, Veo et d'autres dans un seul Media Studio. Le prix s'affiche avant la génération.",
    video: "Générer une vidéo",
    studio: "Ouvrir le Media Studio",
  },
};
