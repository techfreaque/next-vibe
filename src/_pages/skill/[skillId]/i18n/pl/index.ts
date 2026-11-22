import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}}: {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    category: "Skille AI",
    keywords: "skill AI, {{name}}, {{appName}}, czat AI bez cenzury",
  },
  breadcrumb: {
    skills: "Skille",
  },
  hero: {
    tryGeneric: "Wypróbuj ten skill",
  },
  publishedBy: "Publikacja: {{name}}",
  madeBy: "Autor: {{name}}",
  startChat: "Rozpocznij czat",
  chatWith: "Porozmawiaj z {{name}}",
  guest: "Bez rejestracji",
  chatModel: "Model czatu",
  facts: {
    runsOn: "Działa na",
    content: "Treści",
    perMessage: "Za wiadomość",
    versions: "Wersje",
    goodAt: "Mocna strona",
    keepInMind: "Warto wiedzieć",
  },
  prompts: {
    intro:
      "Każda otwiera czat z {{name}}. Tekst jest już wpisany, wystarczy wysłać.",
    start: "Zacznij od jednej z nich",
  },
  story: {
    title: "Opis: {{name}}",
  },
  model: {
    credits: "{{cost}} kr.",
    creditsAbout: "ok. {{cost}} kr.",
    fixedPrice: "Koszt wiadomości: {{cost}} kr.",
    estimatedPrice: "Koszt wiadomości: ok. {{cost}} kr.",
    free: "Wiadomości bez opłat",
    perMessageHint:
      "Typowa wiadomość: {{input}} tokenów na wejściu, {{output}} na wyjściu. Zależy od długości.",
    perMessageWithImageHint:
      "Typowa wiadomość: {{input}} tokenów na wejściu, {{output}} na wyjściu, jeden obraz. Zależy od długości.",
  },
  actions: {
    shareEarn: "Udostępnij i zarabiaj",
    addToSkills: "Dodaj do moich skilli",
    added: "Dodano do twoich skilli",
    addFailed: "Nie udało się. Spróbuj ponownie",
  },
  tier: {
    mainstream:
      "{{name}} działa na {{model}}, modelu dużego dostawcy z własnymi filtrami bezpieczeństwa. Drażliwe prośby może odrzucić.",
    open: "{{name}} działa na {{model}}, otwartym modelu z lżejszymi filtrami. Porusza więcej tematów i rzadziej odmawia niż boty wielkich firm.",
    uncensored:
      "{{name}} działa na {{model}}, stworzonym do rozmów bez filtrów tematycznych. Przed pierwszą wiadomością jednorazowe potwierdzenie 18+.",
    ownWorldview:
      "{{model}} trenowano na książkach i dokumentach zakazanych w mainstreamowym internecie. {{name}} daje polityczne opinie pod prąd mainstreamu. Przed pierwszą wiadomością jednorazowe potwierdzenie 18+.",
    abliterated:
      "{{model}} to mainstreamowy model bez odruchu odmowy. {{name}} odpowiada, zamiast pouczać. Przed pierwszą wiadomością jednorazowe potwierdzenie 18+.",
    fineTuned:
      "{{model}} dotrenowano tak, by zniknęły typowe odmowy. {{name}} odpowiada tam, gdzie mainstreamowe boty się wykręcają. Przed pierwszą wiadomością jednorazowe potwierdzenie 18+.",
  },
  share: {
    text: "Znasz kogoś, komu spodoba się {{name}}? Udostępnij link i zarabiaj na tym, co wyda.",
  },
  related: {
    similar: "Podobne skille",
    moreFrom: "Więcej od {{name}}",
  },
};
