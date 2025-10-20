import { translations as componentsTranslations } from "../../_components/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  meta: {
    title: "Zarejestruj się - Next Vibe",
    description:
      "Utwórz swoje konto Next Vibe i zacznij budować niesamowite aplikacje",
    category: "Uwierzytelnianie",
    imageAlt: "Rejestracja Next Vibe",
    keywords: "rejestracja, zarejestruj się, utwórz konto, next vibe",
    ogTitle: "Zarejestruj się w Next Vibe",
    ogDescription:
      "Dołącz do Next Vibe i zacznij budować niesamowite aplikacje już dziś",
    twitterTitle: "Zarejestruj się w Next Vibe",
    twitterDescription: "Utwórz swoje konto i zacznij budować z Next Vibe",
  },
  auth: {
    signup: {
      title: "Rozpocznij swoją podróż z Next Vibe",
      subtitle:
        "Dołącz do tysięcy programistów budujących niesamowite aplikacje",
      createAccountButton: "Utwórz konto",
      creatingAccount: "Tworzenie konta...",
      alreadyHaveAccount: "Masz już konto?",
      signIn: "Zaloguj się",
      termsAndConditions: "Zgadzam się z",
      avatarAlt: "Avatar użytkownika",
      userCount: "10 000+ programistów",
      trustText: "Zaufali nam programiści na całym świecie",
      createAccountAndBook: "Utwórz konto i zarezerwuj spotkanie",
      directDescription: "Zacznij natychmiast z swoim kontem",
      scheduleDescription: "Zaplanuj spersonalizowaną sesję wdrożeniową",
      meetingPreferenceOptions: {
        direct: "Bezpośredni dostęp",
        schedule: "Zaplanuj spotkanie",
      },
      benefits: {
        contentCreation: {
          title: "Potężne tworzenie treści",
          description:
            "Twórz i zarządzaj treścią za pomocą naszych intuicyjnych narzędzi",
        },
        dataStrategy: {
          title: "Inteligentna strategia danych",
          description:
            "Wykorzystaj spostrzeżenia oparte na danych do lepszych decyzji",
        },
        saveTime: {
          title: "Oszczędzaj czas i wysiłek",
          description: "Automatyzuj przepływy pracy i zwiększ produktywność",
        },
      },
      privateName: "Nazwa prywatna",
      privateNamePlaceholder: "Wprowadź swoją nazwę prywatną",
      publicName: "Nazwa publiczna",
      publicNamePlaceholder: "Wprowadź swoją nazwę publiczną",
      emailLabel: "Adres e-mail",
      emailPlaceholder: "Wprowadź swój e-mail",
      passwordLabel: "Hasło",
      passwordPlaceholder: "Utwórz hasło",
      confirmPasswordLabel: "Potwierdź hasło",
      confirmPasswordPlaceholder: "Potwierdź swoje hasło",
      newsletterSubscription: "Zapisz się do newslettera",
    },
  },
  post: {
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
