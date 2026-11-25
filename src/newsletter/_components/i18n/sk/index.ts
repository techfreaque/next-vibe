import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  heading: "Prihlás sa na odber newslettera",
  subheadingPublic: "Nové modely bez cenzúry a novinky z platformy. Bez spamu.",
  subheadingLoggedIn:
    "Nové modely bez cenzúry a novinky z platformy. Bez spamu.",
  bonusGuest:
    "Bezplatný účet: {{freeCreditsSignedIn}} kreditov mesačne, s newsletterom {{freeCreditsMax}}.",
  bonusGuestLink: "Registrovať sa zadarmo",
  bonusAccount:
    "Potvrď e-mail a získaš +{{bonusCredits}} bezplatných kreditov. Spolu {{freeCreditsMax}} mesačne.",
  emailPlaceholder: "you@example.com",
  invalidEmail: "Zadaj platnú e-mailovú adresu.",
  subscribe: "Prihlásiť sa na odber",
  alreadyIn: "Žiadosť o odber sme prijali. Skontroluj si e-mailovú schránku.",
  success: "Ešte jeden krok. Potvrď odber v e-mailovej schránke.",
  error: "Nepodarilo sa to. Skús znova.",
  privacy: "Odber môžeš kedykoľvek zrušiť jedným kliknutím.",
  loggedInHint: "Pošleme ho na e-mail k tvojmu účtu.",
  pending: {
    title: "Potvrď odber cez e-mail",
    bodyWithEmail: "Potvrdzovací odkaz sme poslali na {{email}}.",
    body: "Potvrdzovací odkaz je v tvojej schránke.",
    bonus:
      "Jediné kliknutie ti pridá +{{bonusCredits}} bezplatných kreditov mesačne.",
    resend: "Poslať e-mail znova",
    resending: "Odosiela sa…",
    resent: "Odoslané. Ak správa neprišla, skontroluj aj spam.",
  },
  subscribedNotice: {
    title: "Odber je aktívny",
    bonus: "Na účte máš každý mesiac +{{bonusCredits}} bezplatných kreditov.",
    body: "Nové modely a ďalšie novinky ti prídu e-mailom.",
    manage: "Spravovať alebo zrušiť odber",
  },
};
