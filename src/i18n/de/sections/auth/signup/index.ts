import type { signupTranslations as EnglishSignupTranslations } from "../../../../en/sections/auth/signup";
import { adminNotificationTranslations } from "./admin_notification";
import { benefitsTranslations } from "./benefits";
import { brandsTranslations } from "./brands";
import { emailTranslations } from "./email";
import { errorsTranslations } from "./errors";
import { meetingPreferenceOptionsTranslations } from "./meetingPreferenceOptions";
import { preferredContactOptionsTranslations } from "./preferredContactOptions";
import { successTranslations } from "./success";
import { trustedSectionTranslations } from "./trustedSection";

export const signupTranslations: typeof EnglishSignupTranslations = {
  admin_notification: adminNotificationTranslations,
  benefits: benefitsTranslations,
  brands: brandsTranslations,
  email: emailTranslations,
  errors: errorsTranslations,
  meetingPreferenceOptions: meetingPreferenceOptionsTranslations,
  preferredContactOptions: preferredContactOptionsTranslations,
  success: successTranslations,
  trustedSection: trustedSectionTranslations,
  title: "Erstellen Sie Ihr Konto",
  subtitle:
    "Schließen Sie sich Hunderten von Unternehmen an, die ihre Social Media Präsenz verbessern",
  namePlaceholder: "Vorname eingeben",
  lastNamePlaceholder: "Nachname eingeben",
  emailLabel: "E-Mail-Adresse",
  emailPlaceholder: "E-Mail eingeben",
  passwordLabel: "Passwort",
  passwordPlaceholder: "Passwort erstellen",
  confirmPasswordLabel: "Passwort bestätigen",
  confirmPasswordPlaceholder: "Passwort bestätigen",
  newsletterSubscription: "Newsletter für Updates und Einblicke abonnieren",
  termsAndConditions: "Ich stimme den Nutzungsbedingungen zu",
  createAccountButton: "Konto erstellen",
  alreadyHaveAccount: "Bereits ein Konto?",
  signIn: "Anmelden",
  firstName: "Vorname",
  lastName: "Nachname",
  privateName: "Privater Name",
  publicName: "Öffentlicher Name",
  privateNamePlaceholder: "Privaten Namen eingeben",
  publicNamePlaceholder: "Öffentlichen Namen eingeben",
  company: "Firmenname",
  phone: "Telefonnummer (optional)",
  companyPlaceholder: "Firmenname eingeben",
  phonePlaceholder: "Telefonnummer eingeben",
  preferredContactMethod: "Bevorzugte Kontaktmethode",
  directDescription:
    "Erstellen Sie ein Konto und wählen Sie einen unserer Servicepläne, um sofort zu beginnen.",
  scheduleDescription:
    "Erstellen Sie ein Konto und planen Sie eine kostenlose Beratung mit unseren Experten, um Ihre Bedürfnisse zu besprechen.",
  creatingAccount: "Konto wird erstellt...",
  createAccountAndBook: "Konto erstellen & Beratung buchen",
  avatarAlt: "Social Media Service Benutzer-Avatar",
  userCount: "{{count}}+ Benutzer",
  trustText: "vertrauen uns ihre Social Media an",
  securityMessage:
    "{{emoji}} Ihre Daten sind sicher mit unserer verschlüsselten Plattform",
};
