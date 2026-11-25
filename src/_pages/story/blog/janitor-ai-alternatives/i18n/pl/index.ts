import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Alternatywy dla Janitor AI do roleplayu: pamięć i ceny",
  description:
    "Jedenaście miejsc do pisania, gdy Janitor AI nie działa, gubi wątek albo dopisuje kwestie twojej postaci. Porównaj darmowe czaty, pamięć świata i ceny.",
  keywords:
    "alternatywy dla Janitor AI, darmowy roleplay AI, karty postaci, towarzysz AI",
  category: "Porównanie",
  readTime: "5 min czytania",
  back: "Wróć do bloga",
  subtitle:
    "Jedenaście możliwości, od darmowego czatu z postacią po model na własnym komputerze. Ceny sprawdziliśmy {{date}}.",
  lead: "Lubisz swoją postać na Janitorze, ale przestał ci odpowiadać jej styl? Najpierw zmień model. Jeśli chcesz pisać bez internetu, prowadzić kronikę świata albo wracać do jednego rozmówcy przez wiele miesięcy, znaczenie ma też wybór aplikacji.",
  janitor: {
    title: "Co oferuje Janitor AI?",
    fit: "Przeglądanie postaci społeczności",
    intro:
      "Janitor AI to serwis z interaktywnymi opowieściami dla dorosłych. Wybierasz postać społeczności lub tworzysz własną i wspólnie rozgrywacie scenę. Regulamin wymaga ukończonych 18 lat i zabrania publikowania obscenicznych awatarów. W pomocy znajdziesz instrukcję podłączenia zewnętrznego modelu, na przykład z OpenRouter, własnym kluczem API.",
    plans:
      "Darmowe konto pozwala pisać bez limitu na standardowych modelach z kontekstem około 9 tys. tokenów. Janitor+ oferuje pięć razy dłuższy kontekst, priorytet odpowiedzi i miesięczną pulę ponownych odpowiedzi modeli premium. Janitor podał cenę 12,99 USD miesięcznie. Amerykański App Store podaje też 99 USD rocznie. Zewnętrzny dostawca może osobno naliczać opłaty.",
  },
  why: {
    title: "Dlaczego ludzie szukają innego miejsca do pisania?",
    outage:
      "Podczas awarii jedna osoba na Reddicie szukała miejsca, gdzie mogłaby dalej zbierać pomysły do książki. Sam Janitor 19 listopada wskazał adres jani.com na czas odzyskiwania poprzedniej domeny. Jeśli po prostu nie możesz otworzyć swoich rozmów, zacznij od tego adresu.",
    update: "Komunikat Janitora o domenie",
    voice:
      "W innym wątku użytkownicy opisali powtarzalne odpowiedzi, zapomniane szczegóły i boty dopisujące kwestie za gracza. To relacje konkretnych osób. Przy licznej obsadzie przyda się edytowalna pamięć albo księga świata. Jeśli bot przejmuje twoją rolę, daj ten sam początek sceny innemu modelowi.",
  },
  table: {
    scroll: "Przesuń tabelę w lewo, żeby zobaczyć ceny.",
    title: "Janitor AI i jedenaście alternatyw w jednej tabeli",
    intro:
      "Tabela zawiera wybrane plany. Ceny konkurencji podajemy w dolarach amerykańskich, a dla Kindroid i Nomi według amerykańskiego App Store. Zakres darmowego dostępu opisujemy poniżej.",
    fit: "Do czego się przyda",
    price: "Cena lub koszt korzystania",
  },
  us: {
    fit: "Dobór modelu do sceny",
    price: "Od {{subPrice}} miesięcznie",
    title: "{{appName}} dla osób, które chcą same prowadzić scenę",
    models:
      "Tworzymy {{appName}}. W katalogu mamy {{modelCount}} modeli czatowych, w tym {{uncensored}} bez cenzury. Przed włączeniem takiego modelu każdy, również gość, musi osobiście potwierdzić pełnoletność i zgodę na niefiltrowane odpowiedzi. Zgodę można wycofać w ustawieniach.",
    example: "Wśród dostępnych modeli bez cenzury jest {{ownModel}}.",
    skills:
      "Tryb odgrywania ról poleca modelowi trzymać się postaci i zostawiać jej rozmówcy decyzje o własnych działaniach. Do dłuższych rozmów służą wbudowani towarzysze Thea i Hermes. Jeśli chcesz po prostu wybrać gotową postać i zacząć pisać, łatwiej będzie zajrzeć do katalogu Janitora.",
    limit:
      "Gość dostaje co miesiąc {{guestCredits}} darmowych kredytów, a osoba z bezpłatnym kontem {{freeCredits}}. Długa scena na modelu premium może zużyć całą pulę. Jeśli wolisz pisać bez liczenia odpowiedzi, standardowy czat Janitora sprawdzi się lepiej.",
    link: "Zobacz, jak działa tryb odgrywania ról",
  },
  list: "Gdzie rozegrać następną scenę?",
  heading: "{{name}}: {{fit}}",
  free: {
    janitor: "Standardowy czat bez limitu",
    us: "{{guestCredits}} kredytów miesięcznie dla gościa",
    characterAi: "Style podstawowe bez limitu",
    sillyTavern: "Darmowy interfejs",
    chub: "Zależy od dostawcy modelu",
    crushOn: "Darmowe modele bez limitu",
    spicy: "Plan darmowy",
    venice: "10 zapytań tekstowych dziennie",
    nanoGpt: "Jeden darmowy model w przeglądarce",
    horde: "Komputery wolontariuszy",
    kindroid: "Krótka prezentacja",
    nomi: "50 wiadomości dziennie",
  },
  offers: {
    characterAi: {
      fit: "Krótkie rozmowy z filtrem treści",
      body: "ShortSqueak nadaje się do szybkiej wymiany zdań, PipSqueak 3 do dłuższych scen. Oba style pozwalają pisać za darmo bez limitu. Lite ogranicza reklamy i daje więcej miejsca na przypięte wspomnienia. Character.AI zabrania pornografii także w płatnych planach.",
    },
    sillyTavern: {
      fit: "Karty postaci, które zabierzesz ze sobą",
      price: "Program bezpłatny, osobno sprzęt lub API",
      body: "Karty postaci i notatki o świecie trzymasz na swoim komputerze. Lokalny model pozwala grać offline, a zewnętrzny podłączysz kluczem API. Program trzeba zainstalować i samodzielnie wybrać dla niego model.",
    },
    chub: {
      fit: "Wspólny świat i jego kronika",
      body: "W Chub możesz zapisać dzieje miasta i dołączać je do kontekstu dopiero wtedy, gdy w rozmowie padnie jego nazwa. Zostaje więcej miejsca na bieżącą scenę. Wpisy i słowa wyzwalające ustawiasz samodzielnie. Plan Mars pozwala pisać bez limitu. Za własny komercyjny klucz API płacisz dostawcy.",
    },
    crushOn: {
      fit: "Gotowe postacie według gatunku",
      body: "Wybierasz postać i piszesz bez ustawiania API. Bezpłatne modele pozwalają na nieograniczone rozmowy. Co miesiąc dostajesz też 100 kredytów na modele Pro. Standard daje ich 2 tys. miesięcznie. Liczba odpowiedzi za tę samą pulę zależy od modelu.",
    },
    spicy: {
      fit: "Wspomnienia postaci do edycji",
      body: "Zaczynasz za darmo. W płatnym Memory Manager przypniesz obietnicę albo poprawisz fakt, który postać wciąż przekręca. Automatyczna pamięć semantyczna jest dostępna od planu True Supporter. Podstawowy abonament nie przywróci wszystkich szczegółów długiej opowieści.",
    },
    venice: {
      fit: "Prywatny czat z własnymi postaciami",
      body: "Pro pozwala tworzyć i udostępniać postacie oraz wysyłać bez limitu standardowe zapytania tekstowe. Bez opłat masz dziesięć zapytań dziennie. Najmocniejsze modele zużywają kredyty również w Pro, więc przed długą sceną sprawdź, który model wybierasz.",
    },
    nanoGpt: {
      fit: "Model do innej aplikacji",
      body: "Jednym saldem płacisz za czat w przeglądarce i za API. Pro obejmuje wybrane otwarte modele z tygodniowym limitem tokenów wejściowych. Darmowy model działa tylko w przeglądarce, więc aplikacja do roleplayu podłączona przez API nalicza koszty.",
    },
    horde: {
      fit: "Pisanie na sprzęcie wolontariuszy",
      price: "Bezpłatnie w AI Horde",
      body: "KoboldAI Lite to edytor w przeglądarce z rozgałęzieniami fabuły, notatkami o świecie i polem na fakty potrzebne przy każdej odpowiedzi. Tekst generują komputery wolontariuszy AI Horde. Nie potrzebujesz własnej karty graficznej ani abonamentu. Wybór modeli i kolejka zależą od tego, kto jest online.",
    },
    kindroid: {
      fit: "Jeden towarzysz do rozmów głosowych i wideo",
      body: "Ustalasz historię postaci, nadajesz jej głos i dzwonisz do niej przez wideo. To propozycja na dłuższą znajomość. Zwykły trzydniowy okres próbny premium wymaga metody płatności i przechodzi w abonament, jeśli go nie anulujesz. Krótka darmowa prezentacja to odrębna oferta.",
    },
    nomi: {
      fit: "Stali bohaterowie i wspólne rozmowy",
      body: "Towarzysz w Nomi przenosi wspomnienia między rozmowami. Czat grupowy pozwala twoim postaciom rozmawiać ze sobą. Zaczniesz za darmo, a do intensywniejszego korzystania służą płatne plany. Własny system Nomi słabo pasuje do testowania jednej postaci na kilku zewnętrznych modelach.",
    },
  },
  faq: {
    title: "Najczęstsze pytania",
    free: {
      q: "Gdzie mogę pisać za darmo?",
      a: "Character.AI oferuje nielimitowane rozmowy z filtrem, a CrushOn pozwala pisać bez limitu na darmowych modelach. W KoboldAI Lite z AI Horde odpowiedzi są bezpłatne, choć czasem trzeba poczekać na wolny komputer.",
    },
    memory: {
      q: "Jak pomóc postaci zapamiętać wcześniejsze rozdziały?",
      a: "Stały element fabuły wpisz do księgi świata w Chub albo do pola pamięci w KoboldAI Lite. Do budowania długiej relacji nadaje się Nomi. Nawet przy dużym oknie kontekstu starszy szczegół może w końcu wypaść poza jego zakres.",
    },
    move: {
      q: "Czy zmiana modelu oznacza pożegnanie z postacią na Janitorze?",
      a: "Nie. Instrukcja konfiguracji proxy pokazuje, jak podłączyć innego dostawcę w dotychczasowej rozmowie. Jeśli przenosisz się do innej aplikacji, sprawdź obsługiwane formaty. Zachowaj własny opis postaci i notatki ze scen.",
    },
  },
  related: {
    character: "Porównaj alternatywy dla Character.AI",
    hub: "Poznaj modele AI bez cenzury",
  },
  cta: {
    title: "Rozegraj scenę w trybie odgrywania ról",
    start: "Wybierz model do roleplayu",
  },
};
