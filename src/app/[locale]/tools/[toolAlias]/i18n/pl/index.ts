import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  backToTools: "Wszystkie narzędzia",
  parameters: "Parametry",
  aliases: "Aliasy",
  tags: "Tagi",
  category: "Kategoria",
  openTool: "Otwórz narzędzie",
  notFound: "Nie znaleziono narzędzia",
  notFoundDescription:
    "Szukane narzędzie nie istnieje lub nie masz do niego dostępu.",
  platforms: "Dostępne na",
  credits: "Kredyty",
  method: "Metoda",
  meta: {
    title: "{{toolName}} - Narzędzie AI",
    category: "Narzędzia AI",
    description: "Szczegóły i parametry narzędzia {{toolName}} na {{appName}}.",
    imageAlt: "{{toolName}} - Narzędzie AI na {{appName}}",
    keywords: "{{toolName}}, narzędzia AI, {{appName}}",
  },
};
