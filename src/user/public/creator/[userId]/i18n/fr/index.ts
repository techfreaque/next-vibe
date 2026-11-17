import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profil créateur",
  tags: {
    creator: "créateur",
    profile: "profil",
    public: "public",
  },
  get: {
    title: "Obtenir le profil d'un créateur",
    titleShort: "Profil créateur",
    description:
      "Obtenir le profil public d'un créateur avec sa bio, ses réseaux sociaux et ses skills",
    form: {
      title: "Profil créateur",
      description: "Profil public d'un créateur de skills",
      creatorId: {
        label: "ID du créateur",
        description: "L'ID ou le slug du créateur",
      },
    },
    response: {
      title: "Profil créateur",
      description: "Données du profil public du créateur",
      publicName: "Nom affiché",
      avatarUrl: "Avatar",
      bio: "Bio",
      websiteUrl: "Site web",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      facebookUrl: "Facebook",
      discordUrl: "Discord",
      tribeUrl: "Tribe",
      rumbleUrl: "Rumble",
      odyseeUrl: "Odysee",
      nostrUrl: "Nostr",
      gabUrl: "Gab",
      creatorAccentColor: "Couleur d'accent",
      creatorHeaderImageUrl: "Image d'en-tête",
      referralCode: "Code de parrainage",
      appName: "Nom de l'application",
      leadMagnetActive: "Lead magnet actif",
      leadMagnetHeadline: "Titre du lead magnet",
      leadMagnetButtonText: "Bouton du lead magnet",
      skills: "Skills",
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Requête invalide",
      },
      unauthorized: { title: "Non autorisé", description: "Non autorisé" },
      forbidden: { title: "Accès interdit", description: "Accès refusé" },
      notFound: {
        title: "Introuvable",
        description: "Créateur introuvable",
        detail: "Aucun profil créateur n'existe pour {{userId}}",
      },
      conflict: { title: "Conflit", description: "Conflit de requête" },
      network: { title: "Erreur réseau", description: "Erreur réseau" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Modifications non enregistrées",
      },
      internal: {
        title: "Erreur serveur",
        description: "Erreur interne",
        detail: "Impossible de charger ce profil créateur : {{error}}",
      },
      unknown: { title: "Erreur inconnue", description: "Erreur inconnue" },
    },
    success: {
      title: "Profil créateur",
      description: "Profil créateur récupéré",
    },
  },
  widget: {
    notFound: {
      title: "Créateur introuvable",
      description: "Ce profil n'existe pas ou a été supprimé.",
      back: "Retour à l'accueil",
    },
    skills: {
      title: "Skills",
    },
    referral: {
      label: "Code de parrainage",
    },
    nav: {
      backArrow: "←",
      copyright: "©",
    },
  },
  meta: {
    title: "{{publicName}} - Profil créateur",
    description:
      "{{publicName}} crée des skills IA sur {{appName}}. Découvrez son travail et lancez une conversation.",
    notFound: "Créateur introuvable - {{appName}}",
  },
};
