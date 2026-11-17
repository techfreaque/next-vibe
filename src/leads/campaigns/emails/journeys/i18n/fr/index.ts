import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailJourneys: {
    components: {
      defaults: {
        signatureName: "Un utilisateur d'unbottled.ai comme vous",
        previewLeadId: "preview-lead-id",
        previewEmail: "preview@example.com",
        previewBusinessName: "Acme Corp",
        previewContactName: "Utilisateur test",
        previewPhone: "+1234567890",
        previewCampaignId: "preview-campaign-id",
      },
      footer: {
        unsubscribeText:
          "Vous recevez cet e-mail parce que vous avez donné votre accord.",
        unsubscribeLink: "Se désinscrire",
      },
      journeyInfo: {
        uncensoredConvert: {
          name: "Conversion non censurée",
          description: "Un passionné qui partage sa découverte d'unbottled.ai",
          longDescription:
            "Persona passionné qui partage une vraie découverte, en toute transparence sur l'affiliation",
          characteristics: {
            tone: "Ton décontracté, complice",
            story: "Histoire personnelle authentique",
            transparency: "Transparence sur l'affiliation",
            angle: "Angle anti-censure",
            energy: "Énergie de passionné",
          },
        },
        sideHustle: {
          name: "Revenu complémentaire",
          description:
            "Un affilié transparent qui partage des cas d'usage réels",
          longDescription:
            "Affilié transparent qui partage chaque semaine des cas d'usage réels",
          characteristics: {
            disclosure: "Affiliation annoncée d'entrée",
            updates: "Cas d'usage chaque semaine",
            income: "Histoire de revenu passif",
            proof: "Des preuves concrètes, pas du battage",
            energy: "Énergie de bosseur honnête",
          },
        },
        quietRecommendation: {
          name: "Recommandation discrète",
          description: "Un professionnel discret qui recommande un outil testé",
          longDescription:
            "Professionnel discret qui recommande un outil testé pendant des semaines",
          characteristics: {
            signal: "Court, beaucoup de signal, peu de bruit",
            specifics: "Pas de battage, que du concret",
            testing: "Trois semaines de test en toile de fond",
            comparison: "Comparaison honnête avec ChatGPT",
            affiliate: "Mention minimale de l'affiliation",
          },
        },
        signupNurture: {
          name: "Accompagnement inscription",
          description: "Séquence d'accueil pour les nouveaux inscrits",
          longDescription:
            "E-mails de bienvenue et de prise en main pour aider les nouveaux utilisateurs à démarrer sur la plateforme",
        },
        retention: {
          name: "Fidélisation",
          description: "Réengagement des abonnés existants",
          longDescription:
            "E-mails utiles pour garder les abonnés actifs engagés et leur faire découvrir les fonctionnalités",
        },
        winback: {
          name: "Reconquête",
          description: "Faire revenir les utilisateurs inactifs ou partis",
          longDescription:
            "Campagne de réactivation pour les utilisateurs devenus silencieux ou qui ont résilié",
        },
        newsletterMay2026: {
          name: "Newsletter mai 2026",
          description:
            "Newsletter ponctuelle sur Cortex, Dreamer, Autopilot et la génération de médias",
          longDescription:
            "Newsletter produit de mai 2026 envoyée à tous les inscrits, avec un aveu honnête sur les bugs et les nouveautés phares",
        },
        newsletterNov2026: {
          name: "Newsletter novembre 2026",
          description:
            "Newsletter ponctuelle de réactivation : un compagnon de votre côté, votre filtre et un modèle par défaut moins cher",
          longDescription:
            "Newsletter de conversion de novembre 2026 envoyée aux inscrits newsletter consentants, axée sur l'esprit compagnon et le modèle par défaut moins cher",
        },
      },
    },
  },
};
