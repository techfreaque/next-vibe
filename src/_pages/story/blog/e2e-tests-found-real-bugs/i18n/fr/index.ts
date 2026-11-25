import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Un robot a cliqué sur chaque bouton. Huit failles trouvées.",
    description:
      "Notre framework de tests de bout en bout pilote les vraies pages dans un vrai navigateur et couvre chaque endpoint côté client. Voici ce qu'il a trouvé.",
    category: "Ingénierie",
    imageAlt:
      "Tests de bout en bout pilotant {{appName}} dans un vrai navigateur",
    keywords:
      "tests E2E, tests de bout en bout, Playwright, sécurité, SSRF, open redirect, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Ingénierie",
    readTime: "7 min de lecture",
    title:
      "Un robot a cliqué sur chaque bouton. Il a trouvé huit failles de sécurité.",
    subtitle:
      "Nous avons arrêté de tester des morceaux pour tester des pages. Vrai navigateur, vrai serveur, vrais clics, sur chaque endpoint qu'un client peut toucher.",
  },
  intro: {
    lead: "Notre code passait le typage, le lint et les tests unitaires. Il livrait quand même des bugs. Rien d'exotique : un formulaire de réinitialisation qui ignorait la confirmation du mot de passe, des liens de facture qui ne menaient nulle part, un fil d'actualité qui affichait des discussions supprimées.",
    p1: "Tous ces bugs vivaient dans l'interstice entre les briques. La fonction était correcte. La page autour, non. Nous avons donc construit un framework de test qui ne s'intéresse qu'à une chose : ce qu'un client voit et envoie réellement.",
  },
  why: {
    title: "Pourquoi tester la vraie page ?",
    intro:
      "Chaque niveau de test attrape une catégorie de bugs différente. Seul le dernier voit ce que voient vos utilisateurs.",
    unit: {
      label: "Test unitaire",
      title: "Vérifie une fonction",
      body: "Rapide et pas cher. Aveugle au câblage : mauvaise URL, mauvais nom de champ, un bouton qui n'envoie jamais rien.",
    },
    api: {
      label: "Test d'API",
      title: "Vérifie une requête",
      body: "Prouve que le serveur répond. Ne prouve jamais que la page envoie cette requête, ni qu'elle affiche la réponse.",
    },
    e2e: {
      label: "Bout en bout",
      title: "Vérifie tout le trajet",
      body: "Ouvre la page dans Chromium, tape comme une personne, clique sur envoyer, lit la réponse sur le réseau. Si ça marche ici, ça marche pour les clients.",
    },
  },
  how: {
    title: "Comment fonctionne le harnais",
    intro:
      "Playwright piloté depuis bun test, construit sur les définitions d'endpoints de next-vibe. La définition connaît déjà chaque champ, donc le test n'a pas besoin de les connaître.",
    step1: {
      title: "Ouvrir la vraie page",
      body: "Le test ouvre la page client (/user/login, /story/framework), pas un bouchon de test. Il attend que React ait pris la main sur le formulaire avant de taper.",
    },
    step2: {
      title: "Remplir avec des valeurs typées",
      body: "Vous passez des valeurs, pas des sélecteurs. Les pilotes de champs lisent la définition et manipulent l'interface visible : saisir du texte, choisir une option par son libellé, joindre un fichier.",
    },
    step3: {
      title: "Capturer l'appel sur le réseau",
      body: "L'envoi renvoie la vérité : le corps de la requête, le statut et la réponse. Le harnais vérifie que la requête contenait exactement ce qui a été tapé.",
    },
    step4: {
      title: "Enregistrer une fois, rejouer à l'infini",
      body: "Les fournisseurs payants (modèles d'IA, image, musique, vidéo) sont enregistrés par test au premier passage, puis rejoués ensuite. Pas de facture surprise, des exécutions déterministes.",
    },
    step5: {
      title: "Mesurer la couverture",
      body: "Un rapport de couverture compte chaque endpoint public : un succès et un rejet pour chacun. Les trous sont visibles, pas devinés.",
    },
    codeCaption: "Une spec complète. Pas de sélecteurs, pas de mocks.",
  },
  numbers: {
    title: "Le tableau des scores",
    suites: "suites de tests",
    covered: "endpoints publics entièrement couverts",
    security: "failles de sécurité corrigées",
    note: "Les endpoints restants ont besoin de clés de fournisseurs payants pour la recherche, le scraping et la voix avant de pouvoir être enregistrés.",
  },
  security: {
    title: "Les failles de sécurité trouvées",
    intro:
      "Aucune n'est apparue au typage ni dans les tests unitaires. Toutes sont apparues dès qu'un vrai navigateur a parcouru le vrai parcours.",
    openRedirect: {
      title: "Redirection ouverte sur /track",
      body: "N'importe qui pouvait fabriquer un lien qui rebondissait par notre domaine vers n'importe quel site. Les cibles externes exigent désormais une signature HMAC.",
    },
    ssrf: {
      title: "SSRF via des URL fournies par l'utilisateur",
      body: "Les URL transmises à l'IA pouvaient pointer vers des adresses internes. Une protection résout désormais le DNS et vérifie chaque étape de redirection.",
    },
    ssrCache: {
      title: "Cache serveur partagé entre requêtes",
      body: "Le cache de requêtes du rendu serveur pouvait faire passer les données d'un utilisateur dans le rendu d'une autre page. Il est désormais isolé par requête.",
    },
    systemPrompt: {
      title: "Le débogage du prompt système lisait n'importe quel fil",
      body: "Un endpoint de débogage ne vérifiait pas à qui appartenait le fil. Maintenant, si.",
    },
    publicFeed: {
      title: "Le fil public listait des discussions masquées",
      body: "Des discussions masquées et supprimées apparaissaient dans le fil public. Elles sont maintenant filtrées.",
    },
    loginOptions: {
      title: "Les options de connexion trahissaient les comptes",
      body: "La réponse des options de connexion révélait si un e-mail avait un compte. Ce n'est plus le cas.",
    },
    resetPassword: {
      title: "La réinitialisation ignorait la confirmation",
      body: "L'étape de confirmation de réinitialisation du mot de passe ignorait le champ de confirmation. Les non-correspondances sont désormais rejetées.",
    },
    privateFiles: {
      title: "Fichiers privés mis en cache publiquement",
      body: "Les fichiers privés étaient servis avec Cache-Control: public, donc les caches partagés pouvaient les conserver. Ils sont désormais privés.",
    },
  },
  broken: {
    title: "Et ce qui était simplement cassé",
    intro:
      "Rien de dangereux, juste des échecs silencieux pour de vraies personnes :",
    items: {
      attachments:
        "Les URL des pièces jointes du chat et les rapports d'erreurs client renvoyaient 404.",
      permissions:
        "Les permissions racine n'étaient jamais chargées : les clients ne pouvaient pas publier dans Shared.",
      embed: "Le montage du widget intégrable était mort.",
      invoices: "Les liens des e-mails de facture renvoyaient 404.",
      models: "La page des modèles était inutilisable.",
      music: "La génération de musique sur OpenRouter échouait.",
      fixtures:
        "La portée des fixtures de test laissait passer des appels payants en direct.",
      pglite:
        "Les bases PGlite locales renvoyaient les mauvaises lignes sur INSERT…RETURNING.",
      pagination: "La pagination pour les visiteurs sur /tools était cassée.",
    },
    footer:
      "Plus une longue liste de textes non traduits et de corrections de widgets.",
  },
  closing: {
    title: "Ce que ça change pour vous",
    p1: "Chaque page que vous utilisez pour vous inscrire, vous connecter, payer, discuter, générer ou vous abonner a maintenant un test qui l'ouvre dans un vrai navigateur et fait ce que vous faites. Quand nous changeons quelque chose, le robot la reparcourt avant vous.",
    p2: "Le framework est livré avec next-vibe. Si vous construisez dessus, vos endpoints profitent gratuitement du même harnais.",
  },
  cta: {
    title: "Lisez le harnais. Utilisez-le sur votre propre code.",
    subtitle:
      "Le framework E2E est open source et fait partie de next-vibe. Un fichier de spec par fonctionnalité, placé à côté de la définition.",
    github: "Voir sur GitHub",
    framework: "Découvrir next-vibe",
  },
};
