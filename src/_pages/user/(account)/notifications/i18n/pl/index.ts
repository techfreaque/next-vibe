import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Powiadomienia",
  metaTitle: "Powiadomienia - {{appName}}",
  description:
    "Zakończone zadania, prowizje z poleceń i nowości konta. Najnowsze na górze.",
  unauthenticated: {
    title: "Zaloguj się, żeby zobaczyć powiadomienia",
    subtitle: "Tu trafiają zakończone zadania w tle i prowizje z poleceń.",
    logIn: "Zaloguj się",
    signUp: "Załóż konto",
  },
};
