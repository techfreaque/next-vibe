import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Page metadata
  title: "Statystyki Leadów",
  description:
    "Przeglądaj i analizuj statystyki leadów oraz metryki wydajności",
  filter: "Filtruj",
  refresh: "Odśwież",

  // UI Component translations
  totalLeads: "Wszystkie Leady",
  newThisMonth: "Nowe w tym miesiącu",
  activeLeads: "Aktywne Leady",
  ofTotal: "z całości",
  conversionRate: "Wskaźnik konwersji",
  convertedLeads: "Przekonwertowane Leady",
  emailEngagement: "Zaangażowanie e-mail",
  emailsSent: "Wysłane e-maile",
  consultationBookings: "Rezerwacje konsultacji",
  bookingRate: "Wskaźnik rezerwacji",
  dataCompleteness: "Kompletność danych",
  profileCompleteness: "Kompletność profilu",
  leadVelocity: "Prędkość leadów",
  leadsPerDay: "Leady dziennie",
  signedUpLeads: "Zarejestrowani Leady",
  signupRate: "Wskaźnik rejestracji",
  consultationBookedLeads: "Leady z zarezerwowaną konsultacją",
  subscriptionConfirmedLeads: "Leady z potwierdzonym abonamentem",
  confirmationRate: "Wskaźnik potwierdzenia",
  unsubscribedLeads: "Wypisani Leady",
  bouncedLeads: "Odrzucone Leady",
  invalidLeads: "Nieprawidłowe Leady",
  leadsWithEmailEngagement: "Leady z zaangażowaniem e-mail",
  leadsWithoutEmailEngagement: "Leady bez zaangażowania e-mail",
  averageEmailEngagementScore: "Średni wynik zaangażowania e-mail",
  engagementScore: "Wynik zaangażowania",
  totalEmailEngagements: "Całkowite zaangażowanie e-mail",
  totalEngagements: "Całkowite zaangażowanie",
  todayActivity: "Dzisiejsza aktywność",
  leadsCreatedToday: "Leady utworzone dzisiaj",
  leadsUpdatedToday: "Leady zaktualizowane dzisiaj",
  weekActivity: "Aktywność tego tygodnia",
  leadsCreatedThisWeek: "Leady utworzone w tym tygodniu",
  leadsUpdatedThisWeek: "Leady zaktualizowane w tym tygodniu",
  monthActivity: "Aktywność tego miesiąca",
  leadsCreatedThisMonth: "Leady utworzone w tym miesiącu",
  leadsUpdatedThisMonth: "Leady zaktualizowane w tym miesiącu",
  metrics: {
    campaign_running_leads: "Leady z aktywną kampanią",
    website_user_leads: "Leady użytkowników strony",
    newsletter_subscriber_leads: "Leady subskrybentów newslettera",
  },

  // API endpoint translations
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
