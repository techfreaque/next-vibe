import type { analyticsTranslations as EnglishAnalyticsTranslations } from "../../en/sections/analytics";

export const analyticsTranslations: typeof EnglishAnalyticsTranslations = {
  title: "Analiza",
  description: "Śledź skuteczność i statystyki swoich mediów społecznościowych",
  metrics: {
    followers: "Obserwujący",
    engagement: "Wskaźnik zaangażowania",
    reach: "Zasięg",
    posts: "Posty",
    fromLastPeriod: "z poprzedniego okresu",
  },
  actions: {
    refresh: "Odśwież dane",
    export: "Eksportuj raport",
  },
  success: {
    refreshed: "Dane odświeżone",
    refreshedDescription:
      "Twoje dane analityczne zostały pomyślnie zaktualizowane",
    exported: "Raport wyeksportowany",
    exportedDescription:
      "Twój raport analityczny został pomyślnie wyeksportowany",
  },
  error: {
    title: "Błąd",
    refreshFailed: "Nie udało się odświeżyć danych analitycznych",
    exportFailed: "Nie udało się wyeksportować raportu analitycznego",
  },
  filters: {
    title: "Filtry",
    allPlatforms: "Wszystkie Platformy",
    defaultPeriod: "30d",
    defaultPlatform: "all",
  },
  platforms: {
    title: "Skuteczność platform",
    empty: "Brak danych platform",
    emptyDescription:
      "Połącz swoje konta mediów społecznościowych, aby zobaczyć analizę platform",
    followers: "Obserwujący",
    posts: "Posty",
    likes: "Polubienia",
    comments: "Komentarze",
    shares: "Udostępnienia",
    engagement: "Zaangażowanie",
  },
  topPosts: {
    title: "Najlepiej działające posty",
    empty: "Brak postów do wyświetlenia",
  },
  insights: {
    title: "Spostrzeżenia i rekomendacje",
    recommendation: "Rekomendacja",
    value: "Wartość",
  },
};
