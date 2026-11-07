import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  title: "Ustawienia",
  description: "Profil, plan, bezpieczeństwo. Wszystko w jednym miejscu.",
  nav: {
    back: "Wróć",
    referral: "Program poleceń",
  },
  unauthenticated: {
    title: "Zaloguj się",
    subtitle: "Profil, plan i bezpieczeństwo czekają po zalogowaniu.",
    logIn: "Zaloguj się",
    signUp: "Utwórz konto",
  },
  profile: {
    heading: "Twój profil",
    subline: "Tak wyglądasz dla innych.",
    editButton: "Edytuj profil",
    viewCreatorPage: "Zobacz swoją publiczną stronę twórcy →",
    noSkills: "Opublikuj skill, aby otrzymać stronę twórcy.",
  },
  presence: {
    heading: "Twoja obecność",
    subline: "Gdzie Twoi odbiorcy mogą Cię znaleźć.",
    editButton: "Edytuj linki",
    noLinks: "Brak linków społecznościowych - dodaj je w Edytuj profil.",
  },
  emailList: {
    heading: "Twoja lista e-mail",
    subline:
      "Zbieraj leady ze stron skilli i profilu twórcy. Trafiają prosto do Ciebie.",
  },
  editSheet: {
    title: "Edytuj profil",
    description: "Zmiany są zapisywane natychmiast.",
  },
};
