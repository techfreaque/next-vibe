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
  title: "Utwórz swoje konto",
  subtitle:
    "Dołącz do setek firm poprawiających swoją obecność w mediach społecznościowych",
  namePlaceholder: "Wprowadź swoje imię",
  lastNamePlaceholder: "Wprowadź swoje nazwisko",
  emailLabel: "Adres email",
  emailPlaceholder: "Wprowadź swój email",
  passwordLabel: "Hasło",
  passwordPlaceholder: "Utwórz hasło",
  confirmPasswordLabel: "Potwierdź hasło",
  confirmPasswordPlaceholder: "Potwierdź swoje hasło",
  newsletterSubscription:
    "Zapisz się do naszego newslettera, aby otrzymywać aktualizacje i spostrzeżenia",
  termsAndConditions: "Zgadzam się z Warunkami i Regulaminem",
  createAccountButton: "Utwórz konto",
  alreadyHaveAccount: "Masz już konto?",
  signIn: "Zaloguj się",
  firstName: "Imię",
  lastName: "Nazwisko",
  company: "Nazwa firmy",
  phone: "Numer telefonu (opcjonalnie)",
  companyPlaceholder: "Wprowadź nazwę swojej firmy",
  phonePlaceholder: "Wprowadź swój numer telefonu",
  preferredContactMethod: "Preferowana metoda kontaktu",
  directDescription:
    "Utwórz konto i wybierz jeden z naszych planów usług, aby rozpocząć natychmiast.",
  scheduleDescription:
    "Utwórz konto i zaplanuj bezpłatną konsultację z naszymi ekspertami, aby omówić swoje potrzeby.",
  creatingAccount: "Tworzenie konta...",
  createAccountAndBook: "Utwórz konto i zarezerwuj konsultację",
  avatarAlt: "Awatar użytkownika Social Media Service",
  userCount: "{{count}}+ użytkowników",
  trustText: "ufa nam ze swoimi mediami społecznościowymi",
  securityMessage:
    "{{emoji}} Twoje dane są bezpieczne dzięki naszej zaszyfrowanej platformie",
};
