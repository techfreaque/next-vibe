import { translations as componentsTranslations } from "../../_components/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  meta: {
    title: "Zaloguj się - Next Vibe",
    description: "Zaloguj się do swojego konta Next Vibe",
    category: "Uwierzytelnianie",
    imageAlt: "Logowanie Next Vibe",
    keywords: "logowanie, zaloguj się, uwierzytelnianie, next vibe",
    ogTitle: "Zaloguj się do Next Vibe",
    ogDescription: "Uzyskaj dostęp do swojego konta Next Vibe",
    twitterTitle: "Zaloguj się do Next Vibe",
    twitterDescription: "Zaloguj się do swojego konta",
  },
  auth: {
    login: {
      title: "Witamy ponownie",
      subtitle: "Zaloguj się do swojego konta, aby kontynuować",
      signInButton: "Zaloguj się",
      forgotPassword: "Zapomniałeś hasła?",
      createAccount: "Utwórz konto",
      orContinueWith: "Lub kontynuuj z",
      emailLabel: "Adres e-mail",
      emailPlaceholder: "Wprowadź swój e-mail",
      passwordLabel: "Hasło",
      passwordPlaceholder: "Wprowadź swoje hasło",
      rememberMe: "Zapamiętaj mnie",
    },
  },
  login: {
    dontHaveAccount: "Nie masz konta?",
  },
};
