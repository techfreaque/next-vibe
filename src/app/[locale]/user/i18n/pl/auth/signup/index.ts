import type { translations as enTranslations } from "../../../en/auth/signup";
import { translations as adminNotificationTranslations } from "./admin_notification";
import { translations as benefitsTranslations } from "./benefits";
import { translations as brandsTranslations } from "./brands";
import { translations as emailTranslations } from "./email";
import { translations as errorsTranslations } from "./errors";
import { translations as meetingPreferenceOptionsTranslations } from "./meetingPreferenceOptions";
import { translations as preferredContactOptionsTranslations } from "./preferredContactOptions";
import { translations as successTranslations } from "./success";
import { translations as trustedSectionTranslations } from "./trustedSection";

export const translations: typeof enTranslations = {
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
  privateName: "Imię prywatne",
  publicName: "Imię publiczne",
  privateNamePlaceholder: "Wprowadź swoje imię prywatne",
  publicNamePlaceholder: "Wprowadź swoje imię publiczne",
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
