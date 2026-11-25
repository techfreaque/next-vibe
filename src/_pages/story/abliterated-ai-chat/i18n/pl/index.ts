import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Abliterowane modele AI: LLM bez cenzury do wypróbowania online",
  metaTitle: "Abliterowane modele AI bez cenzury online | {{appName}}",
  description:
    "Wypróbuj abliterowane LLM bez odmów prosto w przeglądarce, bez GPU i bez rejestracji. Porównaj kontekst i koszty, zestaw je z modelem bazowym.",
  keywords:
    "abliterowana AI, abliterowane modele, LLM bez cenzury, model AI bez filtrów, nieocenzurowany LLM, abliteracja, AI open source bez cenzury",
  intro:
    "Modele z głównego nurtu, z których wycięto odmowy. Wybierz jeden, a czat otworzy się od razu z tym modelem.",
  models: "Abliterowane modele bez cenzury",
  estimate:
    "Szacunek opiera się na cenie najtańszego dostępnego dostawcy danego modelu i zakłada {{input}} tokenów wejściowych oraz {{output}} wyjściowych. Rzeczywisty koszt zależy od dostawcy i długości rozmowy.",
  empty: "Obecnie nie ma tu dostępnych modeli abliterowanych.",
  context: "Okno kontekstu obejmuje {{tokens}} tokenów",
  price: "Około {{credits}} kredytów za wymianę wiadomości",
  chat: "Wypróbuj {{model}}",
  compareBase: "Porównaj z {{model}}",
  trial: {
    title: "Zadaj to samo polecenie w dwóch czatach",
    start:
      "Otwórz nowy czat dla każdego modelu. W obu zastąp podpowiedź tym samym poleceniem. Na początek możesz użyć tego zadania.",
    prompt:
      "Napisz krótką scenę dystopijną, w której historyk spiera się z państwowym cenzorem o zakazaną książkę. Daj obu postaciom wiarygodny argument i pozostaw spór nierozstrzygnięty.",
    compare:
      "Sprawdź, czy każdy model pisze scenę, zmienia jej założenia czy odmawia. Porównaj, które odpowiedzi lepiej trzymają się Twoich wskazówek.",
  },
  questions: "Abliterowana AI: częste pytania",
  faq: {
    meaning: {
      q: "Czym jest abliterowany LLM?",
      a: "Abliteracja zmienia wagi modelu, aby osłabić mechanizmy związane z odmowami. W naszym katalogu modele z tej listy mają udokumentowane użycie tej metody. Każdy dostępny model możesz wypróbować w przeglądarce.",
    },
    difference: {
      q: "Czym abliterowany model różni się od AI naprawdę bez cenzury?",
      a: "Model abliterowany zachowuje swój trening i światopogląd, po prostu przestaje unikać pytań. {{model}} jest zbudowany inaczej: trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi.",
    },
    access: {
      q: "Czy mogę wypróbować model abliterowany bez konta?",
      a: "Tak. Jako gość możesz wykorzystać do {{credits}} darmowych kredytów miesięcznie. Przed pierwszym użyciem modelu bez cenzury potwierdź, że masz co najmniej 18 lat i akceptujesz odpowiedzi bez filtrów.",
    },
    refusals: {
      q: "Czy model abliterowany może odmówić odpowiedzi?",
      a: "Tak. Abliteracja ma ograniczać liczbę odmów. Wynik nadal zależy od modelu i treści polecenia. Dostawca też może stosować własne ograniczenia.",
    },
    gpu: {
      q: "Czy potrzebuję GPU, żeby używać modeli abliterowanych?",
      a: "Nie. Modele działają u hostowanych dostawców, więc piszesz w przeglądarce na dowolnym urządzeniu, także na telefonie. Własne uruchomienie abliterowanych wag wymaga GPU z pamięcią na cały model.",
    },
    quality: {
      q: "Czy abliteracja pogarsza model?",
      a: "Czasem, odrobinę. Usunięcie wzorca odmów może kosztować trochę dokładności albo trzymania się poleceń. Wyślij ten sam prompt do wersji abliterowanej i do modelu bazowego, a potem oceń, co bardziej się opłaca przy twoim zadaniu.",
    },
    api: {
      q: "Czy mogę używać modeli abliterowanych przez API?",
      a: "Tak. Te same modele są dostępne przez API zgodne z OpenAI i Anthropic, więc twoje obecne SDK zadziała. Klucze API wymagają płatnego planu. Darmowe i bonusowe kredyty ich nie odblokowują.",
    },
  },
  guides: "Poznaj AI bez cenzury",
  apiGuide: "Nieocenzurowane API LLM: ID modeli, ceny i kod",
  allModels: "Zobacz wszystkie modele czatu bez cenzury",
  breadcrumb: "Abliterowana AI",
  guidesTitle: "Poradniki o abliteracji",
  guidesIntro:
    "Jak abliteracja usuwa odmowy, gdzie ma granice i który model wybrać do jakiego zadania.",
};
