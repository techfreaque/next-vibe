import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  heading: "Abonnez-vous à la newsletter",
  subheadingPublic:
    "Nouveaux modèles non censurés, nouveautés produit, zéro spam.",
  subheadingLoggedIn:
    "Nouveaux modèles non censurés, nouveautés produit, zéro spam.",
  bonusGuest:
    "Compte gratuit : {{freeCreditsSignedIn}} crédits par mois, {{freeCreditsMax}} avec la newsletter.",
  bonusGuestLink: "Inscription gratuite",
  bonusAccount:
    "Confirmez votre e-mail : +{{bonusCredits}} crédits gratuits, {{freeCreditsMax}} par mois au total.",
  emailPlaceholder: "vous@exemple.fr",
  subscribe: "S'abonner",
  alreadyIn: "Vous êtes sur la liste. Surveillez votre boîte de réception.",
  success: "Presque fini. Consultez votre boîte de réception pour confirmer.",
  error: "Cela n'a pas fonctionné. Réessayez.",
  privacy: "Désabonnement en un clic, à tout moment.",
  loggedInHint: "Nous l'enverrons à l'e-mail de votre compte.",
  pending: {
    title: "Confirmez depuis votre boîte de réception",
    bodyWithEmail: "Le lien de confirmation a été envoyé à {{email}}.",
    body: "Le lien de confirmation vous attend dans votre boîte de réception.",
    bonus: "Un clic débloque +{{bonusCredits}} crédits gratuits par mois.",
    resend: "Renvoyer l'e-mail",
    resending: "Envoi...",
    resent: "Envoyé. Vérifiez aussi vos spams s'il n'apparaît pas.",
  },
  subscribedNotice: {
    title: "Vous êtes abonné",
    bonus:
      "+{{bonusCredits}} crédits gratuits par mois sont actifs sur votre compte.",
    body: "Les nouveaux modèles et les nouveautés produit arrivent dans votre boîte de réception.",
    manage: "Gérer ou se désabonner",
  },
};
