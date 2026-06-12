import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  status: {
    title: "Newsletter-Status",
    description: "Newsletter-Abonnementstatus für eine E-Mail-Adresse prüfen",
    category: "Newsletter",
    tags: {
      status: "Status",
    },
    form: {
      title: "Newsletter-Status prüfen",
      description:
        "Geben Sie eine E-Mail-Adresse ein, um den Newsletter-Abonnementstatus zu prüfen",
    },
    email: {
      label: "E-Mail-Adresse",
      description:
        "Die E-Mail-Adresse, für die der Abonnementstatus geprüft werden soll",
      placeholder: "benutzer@beispiel.de",
      helpText: "Geben Sie die E-Mail-Adresse ein, die Sie prüfen möchten",
    },
    response: {
      subscribed: "Abonnementstatus",
      status: "Aktueller Status",
    },
    errors: {
      validation: {
        title: "Ungültige E-Mail",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse an",
      },
      internal: {
        title: "Interner Fehler",
        description:
          "Beim Prüfen des Abonnementstatus ist ein Fehler aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, diesen Abonnementstatus zu prüfen",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Keine Abonnementinformationen für diese E-Mail-Adresse gefunden",
      },
    },
    success: {
      title: "Status abgerufen",
      description: "Newsletter-Abonnementstatus erfolgreich abgerufen",
    },
  },
  subscribe: {
    category: "Newsletter",
    tags: {
      newsletter: "Newsletter",
      subscription: "Abonnement",
    },
    email: {
      label: "E-Mail-Adresse",
      description: "Ihre E-Mail-Adresse für das Newsletter-Abonnement",
      placeholder: "benutzer@beispiel.de",
      helpText:
        "Wir verwenden diese Adresse, um Ihnen Newsletter-Updates zu senden",
    },
    name: {
      label: "Name",
      description: "Ihr Name (optional)",
      placeholder: "Max Mustermann",
      helpText: "Hilft uns, Ihr Newsletter-Erlebnis zu personalisieren",
    },
    preferences: {
      label: "Newsletter-Präferenzen",
      description:
        "Wählen Sie die Art von Newslettern, die Sie erhalten möchten",
      placeholder: "Wählen Sie Ihre Präferenzen",
      helpText: "Sie können diese Präferenzen jederzeit ändern",
    },
    leadId: {
      label: "Lead-ID",
      description: "Optionale Lead-Kennung",
      placeholder: "123e4567-e89b-12d3-a456-426614174000",
      helpText: "Nur für interne Verwendung",
    },
    response: {
      success: "Newsletter erfolgreich abonniert",
      message: "Erfolgsmeldung",
      leadId: "Lead-Kennung",
      subscriptionId: "Abonnement-ID",
      userId: "Benutzer-ID",
      alreadySubscribed:
        "Diese E-Mail-Adresse ist bereits für unseren Newsletter angemeldet",
    },
    errors: {
      email_generation_failed: "E-Mail konnte nicht generiert werden",
      badRequest: {
        title: "Ungültige Anfrage",
        description: "Ungültige Anfrageparameter bereitgestellt",
      },
      internal: {
        title: "Interner Fehler",
        description:
          "Beim Verarbeiten Ihres Abonnements ist ein Fehler aufgetreten",
      },
    },
    post: {
      title: "Newsletter abonnieren",
      description: "Newsletter-Abonnement einrichten",
      form: {
        title: "Newsletter-Abonnement",
        description: "Newsletter-Abonnement konfigurieren",
      },
      response: {
        title: "Abonnement-Antwort",
        description: "Newsletter-Abonnement Antwortdaten",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        internal: {
          title: "Interner Fehler",
          description:
            "Beim Verarbeiten Ihrer Anmeldung ist ein Fehler aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
        conflict: {
          title: "Bereits abonniert",
          description:
            "Diese E-Mail-Adresse ist bereits für unseren Newsletter angemeldet",
        },
        badRequest: {
          title: "Ungültige Anfrage",
          description: "Ungültige Anfrageparameter bereitgestellt",
        },
      },
      success: {
        title: "Erfolgreich abonniert",
        description: "Sie wurden erfolgreich für unseren Newsletter angemeldet",
      },
    },
    repository: {
      starting: "Newsletter-Abonnement wird gestartet",
      linking_to_lead: "Newsletter-Abonnement wird mit Lead verknüpft",
      lead_found: "Lead für Newsletter-Abonnement gefunden",
      lead_updated: "Lead mit Newsletter-Abonnementdaten aktualisiert",
      lead_update_failed:
        "Fehler beim Aktualisieren des Leads mit Newsletter-Daten",
      lead_not_found: "Lead nicht gefunden oder nicht berechtigt für Update",
      lead_linking_error: "Fehler beim Verknüpfen des Leads mit Newsletter",
      missing_lead_id: "Newsletter-Abonnement ohne leadId versucht",
      already_subscribed: "Benutzer hat Newsletter bereits abonniert",
      reactivating: "Newsletter-Abonnement wird reaktiviert",
      creating_new: "Neues Newsletter-Abonnement wird erstellt",
      created_successfully: "Newsletter-Abonnement erfolgreich erstellt",
      subscription_failed: "Newsletter-Abonnement fehlgeschlagen",
    },
    sms: {
      no_phone_number:
        "Keine Telefonnummer für Newsletter-Willkommens-SMS verfügbar",
      sending_welcome: "Willkommens-SMS an Newsletter-Abonnenten wird gesendet",
      welcome_error: "Fehler beim Senden der Newsletter-Willkommens-SMS",
      no_admin_phone:
        "Keine Admin-Telefonnummer konfiguriert, SMS-Benachrichtigung wird übersprungen",
      sending_admin_notification:
        "Admin-Benachrichtigungs-SMS für Newsletter-Abonnement wird gesendet",
      admin_notification_error:
        "Fehler beim Senden der Admin-Benachrichtigungs-SMS",
      welcome: {
        message:
          "Hallo {{name}}! Willkommen bei unserem Newsletter. Bleiben Sie dran für Updates!",
      },
      admin_notification: {
        message:
          "Neue Newsletter-Anmeldung: {{displayName}} ({{email}}) hat sich angemeldet",
      },
    },
    route: {
      sms_failed_continuing:
        "SMS-Benachrichtigungen fehlgeschlagen, wird fortgesetzt",
    },
    emailTemplates: {
      welcome: {
        name: "Newsletter Welcome Email",
        description: "Welcome email sent to new newsletter subscribers",
        category: "newsletter",
        preview: {
          email: {
            label: "E-Mail-Adresse",
            description: "E-Mail-Adresse des Abonnenten",
          },
          name: {
            label: "Name des Abonnenten",
            description: "Name des Abonnenten (optional)",
          },
          leadId: {
            label: "Lead-ID",
            description: "Lead-Tracking-ID für Analytics",
          },
          userId: {
            label: "Benutzer-ID",
            description: "Benutzerkontoidentifikator (optional)",
          },
        },
      },
    },
    emailTemplate: {
      welcome: {
        title: "Willkommen zum {{appName}} Newsletter!",
        subject:
          "Willkommen bei {{appName}} - Bleib auf dem Laufenden über unzensierte KI",
        preview:
          "Du bist angemeldet! Erhalte die neuesten Updates über unzensierte KI, neue Modelle und exklusive Tipps.",
        greeting_with_name: "Hallo {{name}}!",
        greeting: "Hallo!",
        message:
          "Willkommen zum {{appName}} Newsletter! Du bist jetzt Teil unserer Community von KI-Enthusiasten, die ehrliche, unzensierte Gespräche mit KI schätzen.",
        what_to_expect: "Das erwartet dich:",
        benefit_1: "Ankündigungen und Updates zu neuen KI-Modellen",
        benefit_2:
          "Tipps und Tricks, um das Beste aus unzensierten KI-Modellen herauszuholen",
        benefit_3: "Exklusive Angebote und früher Zugang zu neuen Features",
        benefit_4: "Community-Highlights und Erfolgsgeschichten",
        frequency:
          "Wir senden dir alle paar Wochen Updates - nie Spam, immer wertvoller Inhalt.",
        unsubscribe_text: "Möchtest du diese E-Mails nicht mehr erhalten?",
        unsubscribe_link: "Abmelden",
      },
      admin_notification: {
        title: "Neues Newsletter-Abonnement",
        subject: "Neues Newsletter-Abonnement",
        preview: "Ein neuer Benutzer hat den Newsletter abonniert",
        message: "Ein neuer Benutzer hat den Newsletter abonniert.",
        subscriber_details: "Abonnenten-Details",
        email: "E-Mail",
        name: "Name",
        preferences: "Präferenzen",
        view_in_admin: "Im Admin-Panel anzeigen",
      },
    },
  },
  unsubscribe: {
    category: "Newsletter",
    tags: {
      newsletter: "Newsletter",
    },
    email: {
      label: "E-Mail-Adresse",
      description:
        "Die E-Mail-Adresse, die vom Newsletter abgemeldet werden soll",
      placeholder: "benutzer@beispiel.de",
      unsubscribe: {
        title: "Vom Newsletter abmelden",
        preview: "Sie haben sich erfolgreich von unserem Newsletter abgemeldet",
        greeting: "Hallo",
        confirmation:
          "Wir haben {{email}} erfolgreich von unserem Newsletter abgemeldet",
        resubscribe_info:
          "Falls Sie Ihre Meinung ändern, können Sie sich jederzeit auf unserer Website wieder anmelden",
        resubscribe_button: "Wieder anmelden",
        support_message:
          "Bei Fragen wenden Sie sich bitte an unser Support-Team",
        subject: "Newsletter Abmeldebestätigung",
        admin_unsubscribe_notification: {
          title: "Newsletter Abmelde-Benachrichtigung",
          preview: "Ein Nutzer hat sich vom Newsletter abgemeldet",
          message: "Ein Nutzer hat sich vom Newsletter abgemeldet",
          email: "E-Mail",
          date: "Datum",
          view_dashboard: "Dashboard anzeigen",
          subject: "Newsletter Abmeldung - Admin Benachrichtigung",
        },
      },
    },
    response: {
      success: "Newsletter erfolgreich abgemeldet",
      message: "Erfolgsmeldung",
    },
    errors: {
      email_generation_failed: "E-Mail konnte nicht generiert werden",
      internal: {
        title: "Interner Fehler",
        description:
          "Beim Verarbeiten Ihrer Abmeldeanfrage ist ein Fehler aufgetreten",
      },
    },
    post: {
      title: "Newsletter abmelden",
      description: "Vom Newsletter abmelden",
      form: {
        title: "Vom Newsletter abmelden",
        description:
          "Geben Sie Ihre E-Mail-Adresse ein, um sich vom Newsletter abzumelden",
      },
      response: {
        title: "Abmeldeantwort",
        description: "Newsletter-Abmeldebestätigung",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        internal: {
          title: "Interner Fehler",
          description:
            "Beim Verarbeiten Ihrer Abmeldeanfrage ist ein Fehler aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
      },
      success: {
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden vom Newsletter abgemeldet",
      },
    },
    sync: {
      failed: "Newsletter-Abmeldung Synchronisation fehlgeschlagen",
      error: "Newsletter-Abmeldung Synchronisation Fehler",
      tag: "Newsletter-Synchronisation",
      post: {
        title: "Newsletter-Abmeldung synchronisieren",
        titleShort: "Abmeld.-Sync",
        description: "Lead-Status für Newsletter-Abmeldungen synchronisieren",
        container: {
          title: "Synchronisierungskonfiguration",
          description: "Synchronisierungsparameter konfigurieren",
        },
        fields: {
          batchSize: {
            label: "Batch-Größe",
            description: "Anzahl der Datensätze pro Batch",
          },
          dryRun: {
            label: "Testlauf",
            description: "Ausführen ohne Änderungen vorzunehmen",
          },
        },
        response: {
          leadsProcessed: "Verarbeitete Leads",
          leadsUpdated: "Aktualisierte Leads",
          executionTimeMs: "Ausführungszeit (ms)",
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description: "Beim Synchronisieren ist ein Fehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
        },
        success: {
          title: "Synchronisierung abgeschlossen",
          description: "Newsletter-Abmeldungen erfolgreich synchronisiert",
        },
      },
    },
    emailTemplates: {
      unsubscribe: {
        name: "Newsletter Abmelde-E-Mail",
        description: "Bestätigungs-E-Mail für Newsletter-Abmeldungen",
        category: "newsletter",
        preview: {
          email: {
            label: "E-Mail-Adresse",
            description: "Die abzumeldende E-Mail-Adresse",
          },
        },
      },
    },
    sms: {
      confirmation: {
        message:
          "Sie haben sich erfolgreich vom {{appName}} Newsletter abgemeldet. Falls dies ein Fehler war, besuchen Sie bitte unsere Website, um sich erneut anzumelden.",
      },
      admin_notification: {
        message:
          "Newsletter-Abmeldung: {{email}} hat sich vom Newsletter abgemeldet.",
      },
      errors: {
        confirmation_failed: {
          title: "SMS-Bestätigung fehlgeschlagen",
          description: "Fehler beim Senden der Abmelde-Bestätigungs-SMS",
        },
        admin_notification_failed: {
          title: "Admin-SMS-Benachrichtigung fehlgeschlagen",
          description: "Fehler beim Senden der Admin-Benachrichtigungs-SMS",
        },
      },
    },
  },
  email: {
    welcome: {
      title: "Willkommen zu unserem Newsletter",
      preview: "Willkommen zu unserem Newsletter! Danke für Ihr Abonnement",
      greeting: "Hallo",
      greeting_with_name: "Hallo {{name}}",
      message:
        "Willkommen zum {{appName}} Newsletter! Vielen Dank für Ihr Abonnement.",
      what_to_expect: "Das können Sie von unserem Newsletter erwarten:",
      benefit_1: "Neueste Produktupdates und Features",
      benefit_2: "Brancheneinblicke und Trends",
      benefit_3: "Exklusive Inhalte und Tipps",
      benefit_4: "Spezielle Angebote und Aktionen",
      frequency:
        "Wir senden Ihnen wöchentlich Newsletter mit den neuesten Updates.",
      unsubscribe_text: "Sie können sich jederzeit abmelden, indem Sie",
      unsubscribe_link: "hier",
      subject: "Willkommen zu unserem Newsletter!",
    },
    admin_notification: {
      title: "Neues Newsletter-Abonnement",
      preview: "Ein neuer Nutzer hat den Newsletter abonniert",
      message: "Ein neuer Nutzer hat Ihren Newsletter abonniert.",
      subscriber_details: "Abonnenten-Details",
      email: "E-Mail",
      name: "Name",
      preferences: "Präferenzen",
      view_in_admin: "Im Admin-Panel anzeigen",
      subject: "Neues Newsletter-Abonnement - Admin Benachrichtigung",
    },
    unsubscribe: {
      title: "Vom Newsletter abmelden",
      preview: "Sie haben sich erfolgreich von unserem Newsletter abgemeldet",
      greeting: "Hallo",
      confirmation:
        "Wir haben {{email}} erfolgreich von unserem Newsletter abgemeldet",
      resubscribe_info:
        "Falls Sie Ihre Meinung ändern, können Sie sich jederzeit auf unserer Website wieder anmelden",
      resubscribe_button: "Wieder anmelden",
      support_message: "Bei Fragen wenden Sie sich bitte an unser Support-Team",
      subject: "Newsletter Abmeldebestätigung",
      admin_unsubscribe_notification: {
        title: "Newsletter Abmelde-Benachrichtigung",
        preview: "Ein Nutzer hat sich vom Newsletter abgemeldet",
        message: "Ein Nutzer hat sich vom Newsletter abgemeldet",
        email: "E-Mail",
        date: "Datum",
        view_dashboard: "Dashboard anzeigen",
        subject: "Newsletter Abmeldung - Admin Benachrichtigung",
      },
    },
  },
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Produktneuigkeiten",
      companyUpdates: "Unternehmens-Updates",
      industryInsights: "Branchen-Einblicke",
      events: "Veranstaltungen",
    },
    status: {
      subscribed: "Abonniert",
      unsubscribed: "Abgemeldet",
      pending: "Ausstehend",
      bounced: "Zurückgewiesen",
      complained: "Beschwerde",
    },
  },
  hooks: {
    errors: {
      missing_lead_id: "Newsletter-Abonnement: Fehlende leadId",
    },
  },
  errors: {
    email_generation_failed: "E-Mail-Generierung fehlgeschlagen",
  },
  error: {
    general: {
      internal_server_error: "Interner Serverfehler",
    },
    default: "Ein Fehler ist aufgetreten",
  },
  subscription: {
    error: {
      description: "Newsletter-Abonnement fehlgeschlagen",
    },
    unsubscribe: {
      error: "Newsletter-Abmeldung fehlgeschlagen",
      confirmQuestion: "Sind Sie sicher, dass Sie sich abmelden möchten?",
    },
  },
};
