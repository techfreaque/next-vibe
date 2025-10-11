import type { templateTranslations as EnglishTemplateTranslations } from "../../en/sections/template";

export const templateTranslations: typeof EnglishTemplateTranslations = {
  actions: {
    update: {
      description: "Vorlage über ID aktualisieren",
    },
    delete: {
      description: "Vorlage über ID löschen",
    },
  },
  status: {
    draft: "Entwurf",
    published: "Veröffentlicht",
    archived: "Archiviert",
  },
  errors: {
    not_found: "Vorlage nicht gefunden",
    fetch_all_failed: "Alle Vorlagen konnten nicht abgerufen werden",
    fetch_by_id_failed: "Vorlage konnte nicht anhand der ID abgerufen werden",
    create_failed: "Vorlage konnte nicht erstellt werden",
    update_failed: "Vorlage konnte nicht aktualisiert werden",
    delete_failed: "Vorlage konnte nicht gelöscht werden",
    find_by_value_failed:
      "Vorlage konnte nicht anhand des Werts gefunden werden",
    create_template_failed:
      "Vorlage konnte nicht in der Transaktion erstellt werden",
    get_templates_failed:
      "Vorlagen konnten nicht mit Geschäftslogik abgerufen werden",
    update_template_failed:
      "Vorlage konnte nicht mit Geschäftslogik aktualisiert werden",
  },
  success: {
    created: "Vorlage erfolgreich erstellt",
    updated: "Vorlage erfolgreich aktualisiert",
    retrieved: "Vorlagen erfolgreich abgerufen",
  },
  admin: {
    stats: {
      totalTemplates: "Gesamtvorlagen",
      draftTemplates: "Entwurfsvorlagen",
      publishedTemplates: "Veröffentlichte Vorlagen",
      archivedTemplates: "Archivierte Vorlagen",
      newTemplates: "Neue Vorlagen",
      updatedTemplates: "Aktualisierte Vorlagen",
      averageContentLength: "Durchschnittliche Inhaltslänge",
      templatesWithDescription: "Vorlagen mit Beschreibung",
      creationRate: "Erstellungsrate",
      updateRate: "Aktualisierungsrate",
      descriptionCompletionRate: "Beschreibungs-Vollständigkeitsrate",
      tagUsageRate: "Tag-Nutzungsrate",
      byStatus: "Vorlagen nach Status",
      byUser: "Vorlagen nach Benutzer",
      byContentLength: "Vorlagen nach Inhaltslänge",
      byTag: "Vorlagen nach Tag",
      byCreationPeriod: "Vorlagen nach Erstellungszeitraum",
    },
  },
  email: {
    subject: "Vorlagen-Benachrichtigung von {{appName}}",
    title: "Willkommen bei {{appName}}, {{firstName}}!",
    preview: "Vorlagen-Benachrichtigung mit wichtigen Informationen",
    welcome_message:
      "Wir freuen uns, Sie an Bord zu haben. Sie können jetzt Ihr Konto nutzen, um auf alle Funktionen von {{appName}} zuzugreifen.",
    features_intro: "Mit Ihrem neuen Konto können Sie:",
    feature_1: "Ihre Bestellungen und Lieferungen verwalten",
    feature_2: "Leistungskennzahlen verfolgen",
    feature_3: "Auf benutzerdefinierte Berichte zugreifen",
    cta_button: "Jetzt loslegen",
  },
  list: {
    title: "Vorlagen",
    paginated_title: "Paginierte Vorlagen",
  },
  detail: {
    title: "Vorlagen-Details",
    id: "ID",
    value: "Wert",
  },
  search: {
    title: "Vorlagen durchsuchen",
    placeholder: "Vorlagen suchen...",
    searching: "Suche läuft...",
  },
  form: {
    validation: {},
    fields: {
      value: "Wert",
      search: "Suchen",
    },
    placeholders: {
      example_value: "Beispielwert",
    },
    descriptions: {
      value: "Geben Sie einen Wert für dieses Feld ein.",
      search: "Suchen Sie nach Vorlagen anhand von Stichwörtern.",
    },
    actions: {
      submit: "Senden",
      create: "Erstellen",
      create_optimistic: "Erstellen (Optimistisch)",
      update: "Aktualisieren",
      delete: "Löschen",
      clear: "Formular leeren",
    },
  },
};
