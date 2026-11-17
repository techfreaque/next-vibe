import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profil utilisateur",

  tag: "avatar",
  errors: {
    user_not_found: "Utilisateur {{userId}} introuvable",
    failed_to_upload_avatar:
      "Échec de l'envoi de l'avatar pour {{userId}} : {{error}}",
    failed_to_delete_avatar:
      "Échec de la suppression de l'avatar pour {{userId}} : {{error}}",
    invalid_file_type:
      "Type de fichier invalide {{providedType}}. Types autorisés : {{allowedTypes}}",
    file_too_large:
      "Fichier trop volumineux : {{providedSize}}. Maximum {{maxSize}}",
  },
  debug: {
    uploadingUserAvatar: "Envoi de l'avatar de l'utilisateur",
    errorUploadingUserAvatar: "Erreur lors de l'envoi de l'avatar",
    deletingUserAvatar: "Suppression de l'avatar de l'utilisateur",
    errorDeletingUserAvatar: "Erreur lors de la suppression de l'avatar",
  },
  success: {
    uploaded: "Avatar envoyé",
    deleted: "Avatar supprimé",
    nextSteps: {
      visible: "Votre avatar est désormais visible sur votre profil",
      update:
        "Vous pouvez le modifier à tout moment dans les paramètres de votre profil",
      default: "Votre profil affiche désormais l'avatar par défaut",
      uploadNew:
        "Vous pouvez envoyer un nouvel avatar à tout moment depuis les paramètres de votre profil",
    },
  },
  upload: {
    title: "Envoyer un avatar",
    titleShort: "Envoyer un avatar",
    description: "Envoyer une image d'avatar pour votre profil",
    groups: {
      fileUpload: {
        title: "Envoi du fichier",
        description: "Sélectionnez et envoyez votre image d'avatar",
      },
    },
    fields: {
      file: {
        label: "Image d'avatar",
        description: "Sélectionnez une image pour l'avatar de votre profil",
        placeholder: "Choisir une image...",
        help: "Envoyez une image (JPG, PNG, GIF) de 5 Mo maximum",
        validation: {
          maxSize: "Le fichier doit faire moins de 5 Mo",
          imageOnly: "Seules les images sont autorisées",
          unsupportedFormat:
            "Format d'image non pris en charge. Utilisez JPEG, PNG, WebP ou GIF.",
        },
      },
    },
    response: {
      title: "Réponse de l'envoi",
      label: "Résultat de l'envoi",
      description: "Réponse à l'envoi de l'avatar",
      success: "Envoi réussi",
      message: "Votre avatar a bien été envoyé",
      avatarUrl: "URL de l'avatar",
      uploadTime: "Date de l'envoi",
      nextSteps: {
        item: "Étape suivante",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "Le fichier envoyé est invalide ou corrompu",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour envoyer un avatar",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de traiter l'envoi de l'avatar",
      },
      internal: {
        title: "Erreur interne",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description: "Une erreur inattendue s'est produite pendant l'envoi",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite pendant l'envoi",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Vous n'êtes pas autorisé à envoyer un avatar",
      },
      notFound: {
        title: "Introuvable",
        description: "La ressource demandée est introuvable",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant l'envoi",
      },
    },
    success: {
      title: "Avatar envoyé",
      description: "L'avatar de votre profil a bien été envoyé",
    },
  },
  delete: {
    title: "Supprimer l'avatar",
    titleShort: "Supprimer l'avatar",
    description: "Retirer l'avatar actuel de votre profil",
    response: {
      title: "Réponse de suppression",
      label: "Résultat de la suppression",
      description: "Réponse à la suppression de l'avatar",
      success: "Suppression réussie",
      message: "Votre avatar a bien été supprimé",
      nextSteps: {
        item: "Étape suivante",
      },
    },
    errors: {
      validation: {
        title: "Erreur de validation",
        description: "La demande de suppression de l'avatar est invalide",
      },
      unauthorized: {
        title: "Non autorisé",
        description: "Vous devez être connecté pour supprimer votre avatar",
      },
      server: {
        title: "Erreur serveur",
        description: "Impossible de supprimer l'avatar",
      },
      internal: {
        title: "Erreur interne",
        description: "Une erreur interne du serveur s'est produite",
      },
      unknown: {
        title: "Erreur inconnue",
        description:
          "Une erreur inattendue s'est produite pendant la suppression",
      },
      network: {
        title: "Erreur réseau",
        description: "Une erreur réseau s'est produite pendant la suppression",
      },
      forbidden: {
        title: "Accès interdit",
        description: "Vous n'êtes pas autorisé à supprimer cet avatar",
      },
      notFound: {
        title: "Introuvable",
        description: "L'avatar à supprimer est introuvable",
      },
      unsaved: {
        title: "Modifications non enregistrées",
        description: "Certaines modifications n'ont pas été enregistrées",
      },
      conflict: {
        title: "Conflit",
        description: "Un conflit s'est produit pendant la suppression",
      },
    },
    success: {
      title: "Avatar supprimé",
      description: "L'avatar de votre profil a bien été retiré",
    },
  },
};
