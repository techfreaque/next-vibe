import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Statut de la newsletter",
  titleShort: "Statut newsletter",
  description:
    "Vérifier le statut d'abonnement à la newsletter d'une adresse e-mail",
  category: "Newsletter",
  tags: {
    status: "Statut",
  },
  form: {
    title: "Vérifier le statut newsletter",
    description:
      "Saisissez une adresse e-mail pour vérifier son statut d'abonnement à la newsletter",
  },
  email: {
    label: "Adresse e-mail",
    description: "L'adresse e-mail dont vérifier le statut d'abonnement",
    placeholder: "utilisateur@exemple.fr",
    helpText: "Laissez vide pour vérifier votre propre abonnement",
  },
  response: {
    subscribed: "Statut de l'abonnement",
    status: "Statut actuel",
    confirmed: "Confirmé",
    email: "Adresse e-mail",
  },
  errors: {
    validation: {
      title: "E-mail invalide",
      description: "Indiquez une adresse e-mail valide",
    },
    internal: {
      title: "Erreur interne",
      description:
        "Une erreur est survenue lors de la vérification du statut d'abonnement",
      detail: "Échec de la vérification du statut d'abonnement : {{error}}",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous n'êtes pas autorisé à vérifier ce statut d'abonnement",
    },
    notFound: {
      title: "Introuvable",
      description: "Aucune information d'abonnement pour cette adresse e-mail",
    },
  },
  success: {
    title: "Statut récupéré",
    description: "Statut d'abonnement à la newsletter récupéré",
  },
};
