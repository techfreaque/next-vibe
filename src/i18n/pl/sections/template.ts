import type { templateTranslations as EnglishTemplateTranslations } from "../../en/sections/template";

export const templateTranslations: typeof EnglishTemplateTranslations = {
  actions: {
    update: {
      description: "Aktualizuj szablon według ID",
    },
    delete: {
      description: "Usuń szablon według ID",
    },
  },
  status: {
    draft: "Szkic",
    published: "Opublikowany",
    archived: "Zarchiwizowany",
  },
  errors: {
    not_found: "Szablon nie został znaleziony",
    fetch_all_failed: "Nie udało się pobrać wszystkich szablonów",
    fetch_by_id_failed: "Nie udało się pobrać szablonu po ID",
    create_failed: "Nie udało się utworzyć szablonu",
    update_failed: "Nie udało się zaktualizować szablonu",
    delete_failed: "Nie udało się usunąć szablonu",
    find_by_value_failed: "Nie udało się znaleźć szablonu po wartości",
    create_template_failed: "Nie udało się utworzyć szablonu w transakcji",
    get_templates_failed: "Nie udało się pobrać szablonów z logiką biznesową",
    update_template_failed:
      "Nie udało się zaktualizować szablonu z logiką biznesową",
  },
  success: {
    created: "Szablon utworzony pomyślnie",
    updated: "Szablon zaktualizowany pomyślnie",
    retrieved: "Szablony pobrane pomyślnie",
  },
  admin: {
    stats: {
      totalTemplates: "Wszystkie Szablony",
      draftTemplates: "Szablony Robocze",
      publishedTemplates: "Opublikowane Szablony",
      archivedTemplates: "Zarchiwizowane Szablony",
      newTemplates: "Nowe Szablony",
      updatedTemplates: "Zaktualizowane Szablony",
      averageContentLength: "Średnia Długość Treści",
      templatesWithDescription: "Szablony z Opisem",
      creationRate: "Wskaźnik Tworzenia",
      updateRate: "Wskaźnik Aktualizacji",
      descriptionCompletionRate: "Wskaźnik Kompletności Opisu",
      tagUsageRate: "Wskaźnik Użycia Tagów",
      byStatus: "Szablony według Statusu",
      byUser: "Szablony według Użytkownika",
      byContentLength: "Szablony według Długości Treści",
      byTag: "Szablony według Tagu",
      byCreationPeriod: "Szablony według Okresu Tworzenia",
    },
  },
  email: {
    subject: "Powiadomienie o szablonie z {{appName}}",
    title: "Witamy w {{appName}}, {{firstName}}!",
    preview: "Powiadomienie o szablonie z ważnymi informacjami",
    welcome_message:
      "Cieszymy się, że dołączyłeś do nas. Możesz teraz zacząć korzystać ze swojego konta, aby uzyskać dostęp do wszystkich funkcji {{appName}}.",
    features_intro: "Z Twoim nowym kontem możesz:",
    feature_1: "Zarządzać swoimi zamówieniami i dostawami",
    feature_2: "Śledzić wskaźniki wydajności",
    feature_3: "Uzyskać dostęp do niestandardowych raportów",
    cta_button: "Rozpocznij Teraz",
  },
  list: {
    title: "Szablony",
    paginated_title: "Szablony Paginowane",
  },
  detail: {
    title: "Szczegóły Szablonu",
    id: "ID",
    value: "Wartość",
  },
  search: {
    title: "Wyszukaj Szablony",
    placeholder: "Wyszukaj szablony...",
    searching: "Wyszukiwanie...",
  },
  form: {
    validation: {},
    fields: {
      value: "Wartość",
      search: "Wyszukaj",
    },
    placeholders: {
      example_value: "Przykładowa wartość",
    },
    descriptions: {
      value: "Wprowadź wartość dla tego pola.",
      search: "Wyszukaj szablony według słowa kluczowego.",
    },
    actions: {
      submit: "Wyślij",
      create: "Utwórz",
      create_optimistic: "Utwórz (Optymistycznie)",
      update: "Zaktualizuj",
      delete: "Usuń",
      clear: "Wyczyść Formularz",
    },
  },
};
