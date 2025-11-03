import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Zaloguj się - {{appName}}",
    description: "Zaloguj się do swojego konta {{appName}}",
    category: "Uwierzytelnianie",
    imageAlt: "Logowanie {{appName}}",
    keywords: "logowanie, zaloguj się, uwierzytelnianie, {{appName}}",
    ogTitle: "Zaloguj się do {{appName}}",
    ogDescription: "Uzyskaj dostęp do swojego konta {{appName}}",
    twitterTitle: "Zaloguj się do {{appName}}",
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
