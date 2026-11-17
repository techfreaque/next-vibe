import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "Crédits et abonnement",
    description: "Gérez vos crédits et votre abonnement mensuel",
    backToChat: "Retour au chat",
    billingInterval: "Périodicité de facturation",
    currentPeriodStart: "Début de la période en cours",
    nextBillingDate: "Prochaine facturation",
    endsOn: "Fin de l'abonnement le",
    canceledOn: "Résilié le",
    endedOn: "Terminé le",
    cancellation: {
      title: "Résiliation programmée",
      description:
        "Votre abonnement prendra fin le {{date}}. Vous gardez l'accès jusque-là.",
    },
    canceled: {
      title: "Abonnement résilié",
      description:
        "Votre abonnement a été résilié. Vous pouvez vous réabonner à tout moment pour retrouver vos crédits mensuels.",
    },
    manage: {
      stripe: {
        button: "Gérer l'abonnement",
      },
      nowpayments: {
        button: "Voir les détails de l'abonnement",
        info: "Votre abonnement est géré par e-mail. Consultez votre boîte de réception : NOWPayments vous y envoie les liens de paiement et les détails de l'abonnement.",
      },
      portal: {
        error: "Impossible d'ouvrir le portail de facturation. Réessayez.",
      },
    },
    balance: {
      title: "Solde de crédits",
      description:
        "Vos crédits disponibles pour discuter avec {{modelCount}} modèles d'IA",
      credit: "{{count}} crédit",
      credits: "{{count}} crédits",
      nextExpiration: "Prochaine expiration",
      expiring: {
        title: "Crédits d'abonnement",
        description: "Issus de votre formule mensuelle",
      },
      permanent: {
        title: "Crédits permanents",
        description: "Les crédits achetés en pack n'expirent jamais",
      },
      free: {
        title: "Crédits gratuits mensuels",
        description:
          "Sans compte : {{guest}} crédits gratuits/mois. Compte gratuit : {{signedIn}}/mois. Compte + newsletter : {{max}}/mois.",
      },
      earned: {
        title: "Crédits gagnés",
        description: "Gagnez-en en invitant vos amis →",
      },
    },
    overview: {
      howItWorks: {
        title: "Comment fonctionnent les crédits",
        description:
          "Une seule monnaie pour tous les modèles. Choisissez une formule, rechargez ou commencez gratuitement.",
        expiring: {
          title: "Formules mensuelles",
          description:
            "Formules de {{minPrice}} à {{maxPrice}} par mois, jusqu'à {{maxCredits}} crédits. Les {{modelCount}} modèles inclus.",
        },
        permanent: {
          title: "Packs de crédits",
          description:
            "Rechargez n'importe quelle formule : {{packPrice}} les {{packCredits}} crédits. Autant qu'il vous faut. Sans expiration.",
        },
        free: {
          title: "Crédits gratuits",
          description:
            "Sans compte : {{guest}}/mois. Compte gratuit : {{signedIn}}/mois. Compte + newsletter : {{max}}/mois. Sans carte bancaire.",
        },
      },
      costs: {
        title: "Ce que ça coûte",
        description:
          "Crédits par message, image, clip ou appel d'outil. Les prix par message sont des estimations : les modèles OpenRouter facturent le coût réel du fournisseur plus notre marge.",
        models: {
          title: "Modèles d'IA (par message)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "{{count}} crédits",
          showLegacy: "Afficher les anciens modèles",
          hideLegacy: "Masquer les anciens modèles",
          free: "Gratuit",
          approxCost: "~crédits",
          legacyBadge: "Ancien",
          types: {
            text: "Chat",
            tts: "Texte vers voix",
            stt: "Voix vers texte",
            image: "Génération d'images",
            audio: "Génération de musique",
            video: "Génération de vidéos",
          },
        },
        features: {
          title: "Fonctionnalités",
          braveSearchLabel: "Recherche Brave (par recherche)",
          kagiSearchLabel: "Recherche Kagi (par recherche)",
          fetchUrlLabel: "Récupérer un site en texte (par récupération)",
          costFormat: "{{value}} {{unit}}",
          creditsUnit: "crédits",
        },
      },
      cta: {
        title: "Débloquez tous les modèles.",
        description:
          "Des crédits chaque mois sur les {{modelCount}} modèles. Rechargez avec des packs quand vous voulez.",
        button: "S'abonner",
      },
    },
    buy: {
      signInRequired: {
        title: "Connexion requise",
        description:
          "Connectez-vous ou créez un compte pour acheter des crédits ou vous abonner.",
      },
      provider: {
        stripe: {
          description: "Carte bancaire",
        },
        nowpayments: {
          description: "Cryptomonnaie",
        },
        cryptoMinimumPacks:
          "Les paiements en cryptomonnaie exigent au moins {{minPacks}} packs de crédits ({{minValue}}), en raison du montant minimum par transaction.",
      },
      subscription: {
        badge: "Meilleur rapport qualité-prix",
        title: "Abonnement mensuel",
        description:
          "{{subPrice}}/mois : {{subCredits}} crédits par mois avec les {{modelCount}} modèles d'IA",
        perMonth: "/mois",
        perYear: "/an",
        yearlyEquivalent:
          "Seulement {{monthlyPrice}}/mois avec la facturation annuelle",
        features: {
          credits: "{{count}} crédits par mois",
          expiry: "Accès aux {{modelCount}} modèles d'IA",
          bestFor: "Idéal pour un usage régulier de l'IA",
        },
        button: "S'abonner",
        buttonAlreadySubscribed: "Déjà abonné",
      },
      pack: {
        title: "Packs de crédits supplémentaires",
        description: "Rechargez votre formule. Les crédits n'expirent jamais.",
        badge: "Recharge",
        perPack: "/pack",
        quantity: "Quantité",
        total: "{{count}} crédits",
        features: {
          credits: "{{count}} crédits par pack",
          permanent: "N'expire jamais",
          expiry: "N'expire jamais",
          bestFor: "Idéal pour les gros utilisateurs qui en veulent plus",
        },
        button: {
          submit: "Acheter le pack de crédits",
        },
        totalPrice: "Total : {{price}}",
        pack: "Pack",
        packs: "Packs",
      },
    },
    history: {
      title: "Historique des transactions",
      description: "Vos dernières transactions de crédits",
      empty: {
        title: "Aucune transaction pour l'instant",
        description:
          "L'historique de vos transactions de crédits apparaîtra ici",
      },
      balance: "Solde : {{count}}",
      loadMore: "Charger plus",
      types: {
        purchase: "Achat",
        subscription: "Abonnement",
        usage: "Utilisation",
        expiry: "Expiration",
        free_tier: "Formule gratuite",
        monthly_reset: "Réinitialisation mensuelle",
        free_grant: "Crédits offerts",
        free_reset: "Réinitialisation gratuite",
        refund: "Remboursement",
        transfer: "Transfert",
        other_devices: "Dépenses sur d'autres appareils",
        referral_earning: "Gain de parrainage",
        referral_payout: "Versement de parrainage",
      },
    },
    tabs: {
      overview: "Vue d'ensemble",
      buy: "Acheter des crédits",
      adminBuy: "Gérer les crédits",
      billing: "Facturation",
      history: "Historique",
      plans: "Formules",
      remote: "Synchro cloud",
    },
    admin: {
      title: "Crédits et limites",
      description:
        "Gérez les attributions de crédits et les plafonds d'utilisation de cette instance",
      allocate: {
        title: "Attribuer des crédits",
        description:
          "Ajoutez des crédits à n'importe quel compte. Les crédits servent de plafond de dépense : ils fixent la quantité d'IA autorisée. Sur une instance auto-hébergée, réglez-les sur le budget que vous voulez accorder.",
        howItWorks: {
          title: "Comment fonctionnent les limites de crédits",
          freePool: {
            title: "Réserve gratuite (partagée)",
            description:
              "Tous les utilisateurs partagent une réserve de crédits gratuits, réinitialisée chaque mois. Réglez sa taille dans les paramètres d'environnement.",
          },
          bonus: {
            title: "Crédits bonus (par utilisateur)",
            description:
              "Les crédits bonus sont permanents : ils n'expirent jamais et s'ajoutent aux crédits de la réserve gratuite. Utilisez-les pour donner plus de capacité à un utilisateur précis.",
          },
          apiKeys: {
            title: "Supprimer toutes les limites",
            description:
              "Configurez vos propres clés API LLM dans les paramètres pour vous passer complètement des crédits. Chaque utilisateur peut aussi utiliser sa propre clé API.",
          },
        },
      },
    },
    payment: {
      success: {
        title: "Paiement réussi",
        subscription:
          "Votre abonnement est activé ! Vos crédits seront disponibles dans quelques instants.",
        credits:
          "Votre achat de pack de crédits a réussi ! Vos crédits seront disponibles dans quelques instants.",
      },
      canceled: {
        title: "Paiement annulé",
        subscription:
          "Le paiement de votre abonnement a été annulé. Vous pouvez réessayer à tout moment.",
        credits:
          "Votre achat de pack de crédits a été annulé. Vous pouvez réessayer à tout moment.",
      },
    },
  },
  meta: {
    category: "Tarifs",
    imageAlt: "Tarifs {{appName}} : des crédits pour chaque modèle d'IA",
    keywords:
      "tarifs chat IA, tarifs IA non censurée, IA payée au message, crédits IA, {{appName}}",
    overview: {
      title: "Tarifs : payez au message, sans engagement | {{appName}}",
      description:
        "Jusqu'à {{freeCredits}} crédits gratuits par mois. Formules dès {{subPrice}} pour {{subCredits}} crédits par mois, jusqu'à {{maxCredits}}. Un seul solde pour {{modelCount}} modèles, des grands classiques aux non censurés.",
    },
    buyCredits: {
      title: "Formules et packs de crédits | {{appName}}",
      description:
        "Formules dès {{subPrice}} pour {{subCredits}} crédits par mois, jusqu'à {{maxCredits}}. Les packs rechargent n'importe quelle formule et n'expirent jamais. Carte, PayPal ou crypto. {{modelCount}} modèles d'IA.",
    },
    history: {
      title: "Historique des crédits | {{appName}}",
      description:
        "Chaque crédit, entrant et sortant : achats, crédits mensuels, gains de parrainage et coût de chaque discussion.",
    },
  },
  payment: {
    success: {
      title: "Paiement réussi",
      subscription:
        "Votre abonnement mensuel est activé ! Vous recevez désormais {{subCredits}} crédits par mois avec les {{modelCount}} modèles.",
      credits:
        "Votre achat de pack de crédits a réussi ! Les crédits n'expirent jamais.",
    },
    canceled: {
      title: "Paiement annulé",
      subscription:
        "Le paiement de votre abonnement a été annulé. Vous pouvez réessayer à tout moment.",
      credits:
        "Votre achat de pack de crédits a été annulé. Vous pouvez réessayer à tout moment.",
    },
  },
};
