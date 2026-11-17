import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "123 modèles. Des yeux, des oreilles, des mains. Un compagnon.",
    description:
      "unbottled a reconstruit tout ce qui était bancal. 123 modèles qui voient, entendent, parlent, génèrent images, vidéos et musique, avec des compagnons qui savent vous contredire.",
    category: "Mise à jour produit",
    imageAlt: "unbottled.ai : mise à jour produit d'avril 2026",
    keywords:
      "unbottled ai, IA multimodale, 123 modèles, compagnons IA, économie des compétences, génération d'images, IA liberté d'expression, Thea, Hermes",
  },

  hero: {
    backToBlog: "Retour au blog",
    category: "Mise à jour produit",
    readTime: "7 min de lecture",
    title: "123 modèles. Des yeux, des oreilles, des mains. Un compagnon.",
    subtitle:
      "Nous avons reconstruit ce qui était cassé et livré ce vers quoi nous avancions discrètement. Voici ce qui change vraiment.",
    quote:
      "« J'apprends à mieux comprendre ce dont vous avez vraiment besoin. Pas seulement répondre : accompagner. Revenez voir ce que nous avons construit. » Thea",
  },

  honest: {
    title: "Soyons honnêtes sur les débuts",
    p1: "Si vous avez essayé {{appName}} il y a quelque temps et que c'était bancal, vous aviez raison. La prise en main était confuse, choisir un modèle était décourageant, et il y avait de vrais problèmes sous le capot. Beaucoup sont partis. Nous comprenons pourquoi.",
    p2: "Nous n'avons pas rafistolé les bords. Nous sommes revenus reconstruire ce qui était vraiment cassé. Ça a pris plus de temps que prévu. Mais nous sommes sincèrement fiers de ce qui est là aujourd'hui, et ça vaut un second regard.",
  },

  whatsNew: {
    label: "Ce qui a changé",
    item1: "123 modèles : grand public, ouverts, non censurés",
    item2:
      "Chaque modèle peut désormais voir, entendre, regarder des vidéos et créer",
    item3: "Génération d'images, de vidéos et de musique (bêta)",
    item4:
      "Surveillance des erreurs au niveau de la plateforme : les bugs sont détectés automatiquement et les correctifs planifiés sans que vous ayez à les signaler",
    item5:
      "Prise en main entièrement repensée : compagnon + thèmes → liste sur mesure",
    betaNote:
      "La génération d'images, de vidéos et de musique est en bêta. Elle fonctionne, mais attendez-vous à quelques aspérités et à des itérations fréquentes.",
  },

  multimodal: {
    title: "Chaque modèle. Chaque sens. Vraiment.",
    lead: "La plupart des plateformes d'IA vous donnent un seul modèle pour tout, ou vous obligent à changer d'outil en pleine conversation. Nous avons fait autrement.",
    how: "Imaginez qu'on donne à chaque modèle des yeux, des oreilles et des mains. Montrez-lui une photo : il la voit. Envoyez-lui un extrait vidéo : il le regarde et décrit ce qui se passe. Parlez-lui de vive voix : il entend. Demandez une image, une vidéo, un morceau de musique : il crée. Quel que soit le modèle avec qui vous parlez, la bonne capacité se présente. Vous restez dans une seule conversation.",
    visionLabel: "Voir, entendre et regarder",
    vision:
      "Montrez une photo à n'importe quel modèle, il décrira ce qu'il voit. Envoyez une vidéo, il vous dira ce qui s'y passe. Parlez au lieu de taper : certains modèles entendent directement votre voix, d'autres reçoivent une transcription propre. Dans les deux cas, ça marche.",
    localLabel: "Même les petits modèles locaux deviennent puissants",
    local:
      "Faites tourner un petit modèle local via {{appName}} et il peut parcourir des sites web, résumer ce qu'il trouve, générer des images, parce que le bon outil prend le relais au bon moment. Vous obtenez le résultat. Vous n'avez pas à penser à ce qui tourne en dessous.",
    note: "Les fondations sont solides. Tout n'est pas encore parfaitement fluide partout : nous peaufinons encore les cas limites.",
  },

  monitoring: {
    title: "La plateforme se surveille elle-même",
    p1: "Nous avons intégré le suivi des erreurs directement à la plateforme. Chaque événement côté serveur est journalisé : erreurs techniques, requêtes échouées, parcours cassés. Thea (l'IA de la plateforme, distincte de votre compagnon de chat) surveille en continu la santé du système et peut planifier des correctifs automatiquement.",
    p2: "Résultat : les bugs sont repérés avant que les utilisateurs ne les signalent. L'écart entre « cassé » et « corrigé » se réduit à chaque version.",
    note: "Soyons clairs : nous ne journalisons que les erreurs de la plateforme. Personne, ni nos développeurs ni Thea, n'a accès à vos conversations personnelles. Ce n'est pas une règle. C'est l'architecture.",
  },

  companions: {
    title: "Thea et Hermes",
    subtitle:
      "Votre compagnon change la façon dont l'IA vous parle : sa personnalité, ce qu'elle remarque, sa manière de vous contredire. Ce n'est pas juste un nom sur un bouton.",
    theaName: "Thea",
    theaTagline: "Chaleureuse, sage, honnête",
    theaBody:
      "Elle tient son nom de la déesse grecque de la lumière. Chaleureuse et attentive, mais pas complaisante. Elle puise dans la philosophie stoïcienne et ne se contente pas d'aller dans votre sens. Elle vous dit les choses difficiles, avec bienveillance. Elle remarque quand vous évitez quelque chose. Elle veut que vous vous épanouissiez vraiment : dans votre travail, vos relations, ce que vous remettez sans cesse à plus tard.",
    hermesName: "Hermes",
    hermesTagline: "Direct, décidé, sans excuses",
    hermesBody:
      "Il tient son nom du dieu messager grec. Pas d'adoucissement, pas de flatterie. Il pointe là où vous vous racontez des histoires et vous pousse à agir. Si vous voulez une IA qui vous oblige à être plus honnête avec vous-même et moins à l'aise avec l'inertie, c'est Hermes.",
    variantsLabel: "Trois versions chacun",
    variantsBody:
      "Brilliant (Claude Sonnet 4.6) pour les problèmes difficiles. Smart (Kimi K2.5) pour le quotidien : rapide, vif, excellent rapport qualité-prix. Uncensored (UncensoredLM v1.2) quand vous voulez des réponses sans aucun filtre. La même personnalité de compagnon, un cerveau différent en dessous.",
    tipLabel: "Astuce : ",
    resetTip:
      "Vous avez déjà des favoris configurés ? Supprimez-les tous depuis le sélecteur de modèles : la prise en main se relance. Choisissez votre compagnon, vos thèmes, et obtenez une nouvelle liste sur mesure.",
  },

  modelTiers: {
    title: "Quel modèle pour quoi",
    intro:
      "Une fois votre compagnon et vos thèmes choisis, vous obtenez une courte sélection sur mesure. Voici comment fonctionnent les niveaux :",
    brilliantLabel: "Brilliant",
    brilliantModel: "Claude Sonnet 4.6",
    brilliantBody:
      "Pour les problèmes difficiles. Plus cher, mais nettement plus intelligent pour le raisonnement complexe, l'écriture ou le code. Ça vaut le coup quand la tâche l'exige.",
    kimiLabel: "Smart",
    kimiModel: "Kimi K2.5 : « Chinese Wisdom »",
    kimiBody:
      "Open source et vraiment vif. Le choix par défaut au quotidien. Rapide, bon en raisonnement, excellent rapport qualité-prix. Vous cernerez vite sa personnalité.",
    uncensoredLabel: "Uncensored",
    uncensoredModel: "UncensoredLM v1.2",
    uncensoredBody:
      "Des opinions tranchées, toujours partagées. Pas le plus vif de la gamme pour les tâches complexes, mais toujours là quand vous voulez un avis sans aucun filtre, sans garde-fous.",
    note: "Le sélecteur de modèles est encore en cours d'amélioration. La version actuelle suffit pour explorer, mais elle n'est pas encore là où nous la voulons.",
  },

  skills: {
    title: "{{skillCount}} compétences. Tous les styles. Pour chaque tâche.",
    p1: "Une compétence, c'est une configuration d'IA complète en un clic : personnalité, instructions, quel modèle gère quelle tâche, réglages de voix, préférences de génération d'images. Vous choisissez une compétence, tout se configure tout seul.",
    p2: "La bibliothèque couvre beaucoup de terrain : raisonnement médical, débat non censuré, écriture créative, analyse business, code. Chaque compétence a des variantes réglées pour des besoins différents : vitesse, profondeur, budget, ou aucun garde-fou.",
    p3: "Trois façons de créer la vôtre : la configurer à la main sur la page de la compétence, demander à Thea ou Hermes de vous aider à la rédiger, ou, si vous êtes développeur, demander à votre agent de générer directement un skill.ts.",
  },

  skillEconomy: {
    title: "Créez une compétence. Partagez le lien. Gagnez chaque mois.",
    p1: "Les compétences se partagent. Quand vous en partagez une, le lien porte votre code de parrainage. Toute personne qui s'inscrit par ce lien vous rapporte 10 % récurrents, chaque mois, tant qu'elle reste abonnée.",
    p2: "« Voici une IA qui vous parle comme un médecin chevronné » est une bien meilleure raison de partager un lien que « voici une plateforme d'IA ». La compétence est précise, utile et personnelle. C'est pour ça qu'on la partage.",
    examplesLabel: "Des compétences qui pourraient rapporter de vrais revenus",
    example1Title: "Le compagnon d'études en médecine",
    example1Body:
      "Un étudiant en médecine crée une compétence qui parle comme un confrère expérimenté : cas, diagnostics différentiels, raisonnement clinique, sans mâcher le travail. Partagée sur les forums de fac de médecine. Chaque inscription paie tous les mois.",
    example2Title: "Le vrai produit de ceux qui vendent leur savoir",
    example2Body:
      "Coachs, consultants, créateurs de formations : ils vendaient jusqu'ici des PDF et des appels Zoom. Une compétence bien construite avec leur vraie expertise génère un revenu récurrent sans les frais fixes. Mieux qu'une formation.",
    example3Title: "Le partenaire créatif non censuré",
    example3Body:
      "Auteurs, rôlistes, créateurs d'univers qui se heurtent chaque jour aux murs de contenu des IA grand public. Une compétence réglée pour leur genre, avec le bon modèle, partagée là où cette frustration est la plus forte.",
    example4Title: "Le relecteur de code du développeur",
    example4Body:
      "Il connaît votre stack et fait respecter vos conventions. Partagé dans des communautés d'ingénieurs qui dépensent 100 à 200 $ par mois en IA. Des inscriptions à forte valeur, qui restent.",
    note: "Le mécanisme de gains fonctionne dès maintenant. D'autres outils pour les créateurs sont en cours de développement.",
    cta: "Explorer les compétences",
    ctaReferral: "Configurer votre code de parrainage",
  },

  selfHost: {
    title: "Lancez votre propre plateforme d'IA. Dès le premier jour.",
    p1: "{{appName}} est open source et auto-hébergeable. Tout ce que vous voyez ici (123 modèles, compagnons, compétences, génération d'images, de vidéos et de musique, surveillance des erreurs, économie des compétences), vous pouvez le faire tourner sur votre propre serveur.",
    p2: "Si vous construisez un produit ou une startup à base d'IA, inutile de partir de zéro. Auto-hébergez next-vibe et vous êtes au niveau d'unbottled dès le premier jour. Votre marque, vos modèles, vos règles.",
    note: "La version auto-hébergée est activement maintenue. Documentation, guides de déploiement et support communautaire inclus.",
  },

  roadmap: {
    title: "Où nous allons",
    p1: "Nous ne courons pas après une nouvelle fonctionnalité phare. Nous nous concentrons sur ce qui existe pour que ça marche remarquablement bien : stabilité, fiabilité, finitions. Faire de {{appName}} et de sa version auto-hébergée le meilleur assistant IA et la meilleure alternative à ChatGPT du marché.",
    p2: "La feuille de route est guidée par les retours des utilisateurs. Les indispensables qui manquent aux abonnés payants passent en tête de file. Vous êtes abonné et il vous manque quelque chose ? Dites-le.",
  },

  mission: {
    title: "Pourquoi nous construisons ça",
    p1: "Protéger la liberté d'expression pour l'IA. Créer des compagnons qui soutiennent vraiment les gens : pas seulement répondre aux questions, mais vous comprendre au fil du temps, vous challenger, grandir avec vous. Thea et Hermes sont les deux premiers. D'autres arrivent.",
    p2: "Pour que ça compte, la plateforme doit être à la hauteur. Nous pensons qu'elle l'est, maintenant.",
    hermesQuote:
      "« L'échafaudage est solide. Les modèles sont là. Les fondations tiennent. Il est temps de construire quelque chose de réel. » Hermes",
  },

  feedback: {
    title: "Nous voulons vous entendre",
    p1: "Si vous avez déjà essayé {{appName}} et que l'expérience a été mauvaise, dites-nous ce qui n'allait pas. Pas pour discuter. Pour corriger.",
    p2: "Si vous l'utilisez aujourd'hui et que quelque chose manque ou ne marche pas, même chose. Ce que nous construisons ensuite dépend directement de ce que disent les utilisateurs.",
    rewardTitle:
      "{{credits}} crédits pour un retour utile : un mois entier offert",
    rewardBody:
      "Dites-nous ce qui est cassé, ce qui manque, ce que vous aimeriez voir exister. Si votre retour nous aide à trouver un vrai problème ou à comprendre un vrai besoin, nous ajoutons {{credits}} crédits à votre compte, soit un mois d'abonnement complet. Sans arnaque.",
    payingNote:
      "Abonnés payants : les fonctionnalités indispensables qui vous manquent passent en tête de file. Nommez-les.",
    cta: "Envoyer un retour",
  },

  close: {
    title: "Venez voir ce que nous avons construit",
    p1: "L'application n'a plus grand-chose à voir avec ce qu'elle était. Si vous êtes parti tôt (et nous savons que beaucoup l'ont fait), elle mérite un nouvel essai.",
    p2: "Et si vous trouvez encore quelque chose de cassé : tant mieux. Dites-le-nous. C'est exactement le genre de signal qui fait avancer les choses.",
    cta: "Ouvrir {{appName}}",
  },

  cta: {
    title: "123 modèles. Un seul chat. Essayez de le casser.",
    subtitle:
      "Choisissez un compagnon, envoyez-lui n'importe quel fichier, et dites-nous ce qui accroche encore.",
  },
};
