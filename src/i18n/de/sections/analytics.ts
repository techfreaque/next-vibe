import type { analyticsTranslations as EnglishAnalyticsTranslations } from "../../en/sections/analytics";

export const translations: typeof EnglishAnalyticsTranslations = {
  title: "Analytics",
  description: "Verfolgen Sie die Performance und Insights Ihrer Social Media",
  metrics: {
    followers: "Follower",
    engagement: "Engagement-Rate",
    reach: "Reichweite",
    posts: "Beiträge",
    fromLastPeriod: "vom letzten Zeitraum",
  },
  actions: {
    refresh: "Daten aktualisieren",
    export: "Bericht exportieren",
  },
  success: {
    refreshed: "Daten aktualisiert",
    refreshedDescription:
      "Ihre Analytics-Daten wurden erfolgreich aktualisiert",
    exported: "Bericht exportiert",
    exportedDescription: "Ihr Analytics-Bericht wurde erfolgreich exportiert",
  },
  error: {
    title: "Fehler",
    refreshFailed: "Aktualisierung der Analytics-Daten fehlgeschlagen",
    exportFailed: "Export des Analytics-Berichts fehlgeschlagen",
  },
  filters: {
    title: "Filter",
    allPlatforms: "Alle Plattformen",
    defaultPeriod: "30d",
    defaultPlatform: "all",
  },
  platforms: {
    title: "Plattform-Performance",
    empty: "Keine Plattform-Daten",
    emptyDescription:
      "Verbinden Sie Ihre Social Media Konten, um Plattform-Analytics zu sehen",
    followers: "Follower",
    posts: "Beiträge",
    likes: "Likes",
    comments: "Kommentare",
    shares: "Geteilte Inhalte",
    engagement: "Engagement",
  },
  topPosts: {
    title: "Top-performende Beiträge",
    empty: "Keine Beiträge zum Anzeigen",
  },
  insights: {
    title: "Insights & Empfehlungen",
    recommendation: "Empfehlung",
    value: "Wert",
  },
};
