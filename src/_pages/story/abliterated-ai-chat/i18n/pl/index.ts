import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Abliterowane modele AI do wypróbowania online",
  metaTitle: "Abliterowane modele AI online | {{appName}}",
  description:
    "Porównaj okna kontekstu i szacunkowe koszty abliterowanych LLM. Wypróbuj je w przeglądarce i porównaj z modelem bazowym, jeśli jest dostępny.",
  intro:
    "Wypróbuj modele zmodyfikowane tak, by rzadziej odmawiały odpowiedzi. Wybierz jeden i otwórz czat w przeglądarce. Model będzie już ustawiony.",
  models: "Dostępne modele abliterowane",
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
  questions: "Częste pytania",
  faq: {
    meaning: {
      q: "Czym jest abliterowany LLM?",
      a: "Abliteracja zmienia wagi modelu, aby osłabić mechanizmy związane z odmowami. W naszym katalogu modele z tej listy mają udokumentowane użycie tej metody. Każdy dostępny model możesz wypróbować w przeglądarce.",
    },
    access: {
      q: "Czy mogę wypróbować model abliterowany bez konta?",
      a: "Tak. Jako gość możesz wykorzystać do {{credits}} darmowych kredytów miesięcznie. Przed pierwszym użyciem modelu bez cenzury potwierdź, że masz co najmniej 18 lat i akceptujesz odpowiedzi bez filtrów.",
    },
    refusals: {
      q: "Czy model abliterowany może odmówić odpowiedzi?",
      a: "Tak. Abliteracja ma ograniczać liczbę odmów. Wynik nadal zależy od modelu i treści polecenia. Dostawca też może stosować własne ograniczenia.",
    },
  },
  guides: "Poznaj AI bez cenzury",
  methodGuide: "Sprawdź, czym abliteracja różni się od innych metod",
  allModels: "Zobacz wszystkie modele czatu bez cenzury",
};
