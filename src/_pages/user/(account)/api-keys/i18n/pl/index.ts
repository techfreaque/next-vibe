import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Klucze API",
  metaTitle: "Klucze API - {{appName}}",
  description:
    "Jeden klucz, {{modelCount}} modeli. Format OpenAI i Anthropic, płacisz kredytami.",
  unauthenticated: {
    title: "Zaloguj się, żeby zarządzać kluczami API",
    subtitle:
      "Klucze należą do Twojego konta. Zaloguj się, wybierz dowolny plan od {{subPrice}} miesięcznie i pierwszy klucz masz w kilka sekund.",
    point1: "{{modelCount}} modeli za jednym endpointem zgodnym z OpenAI",
    point2: "Działa w Claude Code, Codex, OpenCode, Cline i każdym SDK OpenAI",
    point3: "Ta sama cena co w czacie. Bez osobnego rachunku za API.",
    logIn: "Zaloguj się",
    signUp: "Załóż konto",
    docs: "Najpierw przeczytaj dokumentację API",
  },
};
