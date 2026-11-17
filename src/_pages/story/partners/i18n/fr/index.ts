import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Programme partenaires {{appName}} : {{directPct}} récurrents, sans plafond",
    category: "Partenaires",
    description:
      "Créateurs, newsletters et annuaires : touchez {{directPct}} de chaque achat des personnes que vous envoyez sur {{appName}}. Récurrent, sans plafond, suivi par lien. Payé en crédits ou en BTC/USDC.",
    imageAlt: "Programme partenaires {{appName}}",
    keywords:
      "{{appName}}, programme d'affiliation, programme partenaires, affiliation IA non censurée, commission récurrente, programme créateurs, sponsoring de newsletter",
  },
  hero: {
    eyebrow: "Programme partenaires",
    title:
      "Votre audience veut une IA qui ne fait pas la morale. Soyez payé pour la lui présenter.",
    subtitle:
      "{{directPct}} de chacun de leurs achats, tant qu'ils paient. Sans plafond. Un lien suivi par vidéo, numéro ou fiche : vous voyez exactement ce qui convertit.",
    ctaPrimary: "Obtenir mon lien partenaire",
    ctaSecondary: "Lire les conditions",
  },
  facts: {
    commission: "de chaque achat, chaque mois",
    capValue: "Sans plafond",
    cap: "ni sur les filleuls, ni sur les gains",
    holdValue: "{{holdDays}} jours",
    hold: "de délai de remboursement, ensuite c'est à vous",
    minPayout: "retrait minimum",
  },
  audience: {
    label: "Pour qui",
    title: "Conçu pour ceux qui parlent déjà d'IA",
    intro:
      "Si votre audience se heurte à des refus, des filtres ou des prix prohibitifs, vous avez déjà l'argumentaire. Nous vous donnons le lien et les chiffres.",
    creators: {
      title: "Créateurs",
      body: "YouTube, TikTok, streams. Un lien par vidéo dans la description. Voyez quelle vidéo amène des utilisateurs payants, pas seulement des clics.",
    },
    newsletters: {
      title: "Newsletters et blogs",
      body: "Un lien par numéro ou par article. Les lecteurs qui s'inscrivent restent rattachés à vous : une seule mention continue de rapporter.",
    },
    directories: {
      title: "Annuaires et sites de tests",
      body: "Référencez-nous avec votre lien. Chaque utilisateur inscrit depuis votre fiche vous est rattaché définitivement.",
    },
  },
  steps: {
    label: "Comment ça marche",
    title: "Opérationnel en cinq minutes",
    intro:
      "Pas de candidature, pas de file de validation, pas d'audience minimale.",
    step1: {
      title: "Créez un compte gratuit",
      body: "Inscrivez-vous. La page de parrainage s'ouvre juste après.",
    },
    step2: {
      title: "Créez un code, puis un lien par emplacement",
      body: "Choisissez une fois votre code de parrainage. Créez ensuite un lien suivi pour chaque vidéo, numéro ou fiche. Chacun compte ses propres visites, inscriptions et gains.",
    },
    step3: {
      title: "Partagez-le",
      body: "Description, commentaire épinglé, pied de newsletter, fiche d'annuaire. Toute personne qui s'inscrit par ce lien est à vous.",
    },
    step4: {
      title: "Touchez une part de chaque achat",
      body: "{{directPct}} de chaque paiement d'abonnement et de chaque pack de crédits acheté. Après le délai de remboursement de {{holdDays}} jours, ils deviennent des crédits que vous pouvez dépenser ou retirer.",
    },
  },
  terms: {
    label: "Les conditions",
    title: "Tout ce qui détermine vos gains",
    intro:
      "Aucun palier à débloquer, aucune petite ligne en dehors de ce tableau.",
    rows: {
      commission: {
        term: "Commission",
        value:
          "{{directPct}} de chaque achat des utilisateurs que vous parrainez : abonnements et packs de crédits.",
      },
      duration: {
        term: "Durée",
        value:
          "Récurrente, tant qu'ils continuent de payer. Une fois inscrit via votre lien, un utilisateur reste le vôtre.",
      },
      cap: {
        term: "Plafond",
        value: "Aucun. Ni sur les utilisateurs, ni sur les gains.",
      },
      hold: {
        term: "Délai de remboursement",
        value:
          "Les nouveaux gains restent en attente pendant {{holdDays}} jours. Un remboursement ou une rétrofacturation pendant ce délai les annule. Ensuite, ils sont confirmés.",
      },
      payout: {
        term: "Versement",
        value:
          "Dépensez vos gains confirmés en crédits à 1:1, ou retirez-les en BTC ou USDC.",
      },
      minimum: {
        term: "Retrait minimum",
        value:
          "{{minPayout}}. Les versements crypto sont traités sous {{cryptoPayoutHours}} heures après validation.",
      },
      second: {
        term: "Deuxième niveau",
        value:
          "Quand une personne que vous avez parrainée amène ses propres utilisateurs, vous touchez aussi {{level2Pct}} de ce qu'ils paient.",
      },
      tracking: {
        term: "Suivi",
        value:
          "Code de parrainage plus balises UTM sur chaque lien. Visites, inscriptions, utilisateurs payants et gains par lien, en direct sur votre page de parrainage.",
      },
    },
  },
  product: {
    label: "Vers quoi vous les envoyez",
    title: "Une plateforme d'IA que votre audience peut vraiment recommander",
    intro:
      "Facile à présenter, parce qu'elle règle ce dont les gens se plaignent.",
    choice: {
      title: "Modèles grand public, open source et non censurés",
      body: "Les grands modèles connus à côté des modèles open source et non censurés, dans un seul chat. Le non censuré existe en deux versions : des modèles grand public débarrassés de leurs refus, et UncensoredLM, entraîné sur des livres et des documents bannis de l'internet grand public. Les utilisateurs changent quand ils veulent.",
    },
    control: {
      title: "Ils règlent le niveau de filtrage",
      body: "Pas de refus silencieux décidés à leur place. Chaque utilisateur choisit le niveau de filtrage qu'il veut.",
    },
    free: {
      title: "Gratuit pour commencer",
      body: "Les nouveaux utilisateurs essaient le chat sans carte bancaire. Un oui facile pour votre audience, une conversion facile pour vous. Développeurs : l'API nécessite n'importe quelle formule, dès {{subPrice}} par mois.",
    },
  },
  faq: {
    label: "FAQ",
    title: "Les questions des partenaires",
    items: {
      audience: {
        q: "Faut-il une audience minimale ?",
        a: "Non. Pas de candidature, pas de nombre d'abonnés requis. Un seul lecteur qui s'abonne vous rapporte chaque mois où il reste.",
      },
      counts: {
        q: "Qu'est-ce qui compte comme achat ?",
        a: "Chaque paiement d'abonnement et chaque pack de crédits acheté par un utilisateur parrainé. Les renouvellements comptent aussi, à chaque fois.",
      },
      attribution: {
        q: "Combien de temps dure l'attribution ?",
        a: "Pour toujours. Quand quelqu'un s'inscrit via votre lien, il est rattaché à votre compte définitivement. Aucun cookie qui expire après l'inscription.",
      },
      placements: {
        q: "Puis-je suivre chaque emplacement séparément ?",
        a: "Oui. Créez un lien suivi par vidéo, numéro ou fiche sur votre page de parrainage. Chacun affiche ses propres visites, inscriptions, utilisateurs payants et gains.",
      },
      refunds: {
        q: "Que se passe-t-il en cas de remboursement ?",
        a: "Les gains restent en attente pendant {{holdDays}} jours. Si l'achat est remboursé ou rétrofacturé pendant ce délai, le gain est annulé. Ensuite, il est à vous.",
      },
      payout: {
        q: "Comment suis-je payé ?",
        a: "Les gains confirmés arrivent sous forme de crédits utilisables sur la plateforme. Vous pouvez aussi demander un retrait en BTC ou USDC dès {{minPayout}}, traité sous {{cryptoPayoutHours}} heures après validation.",
      },
    },
  },
  cta: {
    title: "Votre lien est à cinq minutes.",
    subtitle:
      "Compte gratuit. Sans validation. {{directPct}} de chaque achat, chaque mois, sans plafond.",
    primary: "Obtenir mon lien partenaire",
    secondary: "Comment fonctionne le parrainage",
  },
};
