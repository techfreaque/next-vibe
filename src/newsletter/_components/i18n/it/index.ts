import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  heading: "Iscriviti alla newsletter",
  subheadingPublic:
    "Nuovi modelli non censurati, gocce di prodotto, senza spam.",
  subheadingLoggedIn:
    "Nuovi modelli non censurati, gocce di prodotto, senza spam.",
  bonusGuest:
    "Account gratuito: Crediti {{freeCreditsSignedIn}} al mese, {{freeCreditsMax}} con la newsletter.",
  bonusGuestLink: "Iscriviti gratis",
  bonusAccount:
    "Conferma la tua email: + {{bonusCredits}} crediti gratuiti, {{freeCreditsMax}} al mese in totale.",
  emailPlaceholder: "you@example.com",
  subscribe: "Iscriviti",
  alreadyIn: "Sei sulla lista. Guarda la tua casella di posta.",
  success: "Ci siamo quasi. Controlla la tua casella di posta per confermare.",
  error: "Non e' andata cosi'. Riprova.",
  privacy: "Un clic per annullare l'iscrizione, in qualsiasi momento.",
  loggedInHint: "Lo invieremo al tuo account e-mail.",
  pending: {
    title: "Controlla la tua casella di posta per confermare",
    bodyWithEmail: "Il link di conferma è andato a {{email}}.",
    body: "Il link di conferma è nella tua casella di posta.",
    bonus: "Un clic sblocca + {{bonusCredits}} crediti gratuiti al mese.",
    resend: "Rispondere all'e-mail",
    resending: "Invio in corso…",
    resent: "Venga. Controllare lo spam anche se non si presenta.",
  },
  subscribedNotice: {
    title: "Sei sottoscritta",
    bonus:
      "+ {{bonusCredits}} crediti gratuiti al mese sono in diretta sul tuo account.",
    body: "Nuovi modelli e gocce di prodotto terra nella tua casella di posta.",
    manage: "Gestire o annullare l'iscrizione",
  },
};
