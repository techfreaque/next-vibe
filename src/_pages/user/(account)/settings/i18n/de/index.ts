import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  title: "Einstellungen",
  description: "Profil, Abo, Sicherheit. Alles an einem Ort.",
  nav: {
    back: "Zurück",
    referral: "Empfehlungsprogramm",
  },
  unauthenticated: {
    title: "Melde dich an",
    subtitle: "Profil, Abo und Sicherheit gibt es nach dem Login.",
    logIn: "Anmelden",
    signUp: "Konto erstellen",
  },
  profile: {
    heading: "Dein Profil",
    subline: "So siehst du für andere aus.",
    editButton: "Profil bearbeiten",
    viewCreatorPage: "Deine öffentliche Creator-Seite ansehen →",
    noSkills: "Veröffentliche ein Skill, um deine Creator-Seite zu erhalten.",
  },
  presence: {
    heading: "Deine Präsenz",
    subline: "Wo dein Publikum dich findet.",
    editButton: "Links bearbeiten",
    noLinks: "Noch keine Social-Links - füge sie über Profil bearbeiten hinzu.",
  },
  emailList: {
    heading: "Deine E-Mail-Liste",
    subline:
      "Erfasse Leads auf deinen Skill-Seiten und deinem Creator-Profil. Sie kommen direkt zu dir.",
  },
  editSheet: {
    title: "Profil bearbeiten",
    description: "Änderungen werden sofort gespeichert.",
  },
};
