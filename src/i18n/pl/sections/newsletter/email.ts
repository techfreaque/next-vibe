import type { emailTranslations as EnglishEmailTranslations } from "../../../en/sections/newsletter/email";

export const emailTranslations: typeof EnglishEmailTranslations = {
  welcome: {
    subject: "Witamy w naszym Newsletterze",
    title: "Witamy w naszym Newsletterze",
    preview: "Dziękujemy za subskrypcję naszego newslettera",
    greeting: "Witaj,",
    greeting_with_name: "Witaj {{name}},",
    message:
      "Dziękujemy za subskrypcję newslettera {{appName}}! Cieszymy się, że dołączasz do naszej społeczności.",
    what_to_expect: "Oto czego możesz oczekiwać od naszego newslettera:",
    benefit_1: "Ekskluzywne spostrzeżenia i trendy branżowe",
    benefit_2:
      "Wskazówki i najlepsze praktyki zarządzania mediami społecznościowymi",
    benefit_3: "Aktualizacje produktu i ogłoszenia nowych funkcji",
    benefit_4: "Oferty specjalne i promocje tylko dla subskrybentów",
    frequency:
      "Będziemy wysyłać Ci aktualizacje około raz w miesiącu, więc nie zalewamy Twojej skrzynki odbiorczej.",
    cta_button: "Odwiedź Naszą Stronę",
    follow_us: "Śledź nas w mediach społecznościowych",
    unsubscribe_text:
      "Jeśli nie chcesz już otrzymywać naszego newslettera, możesz",
    unsubscribe_link: "wypisać się tutaj",
  },
  admin_notification: {
    subject: "Nowy Subskrybent Newslettera",
    title: "Nowy Subskrybent Newslettera",
    preview: "Nowy użytkownik zasubskrybował newsletter",
    message: "Nowy użytkownik zasubskrybował newsletter. Oto szczegóły:",
    subscriber_details: "Szczegóły Subskrybenta",
    email: "E-mail",
    name: "Imię",
    preferences: "Preferencje",
    view_in_admin: "Zobacz w Panelu Administratora",
  },
};
