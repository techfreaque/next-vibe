export const translations = {
  category: "Lead Magnet",
  tags: {
    leadMagnet: "lead-magnet",
    config: "config",
    capture: "capture",
  },
  enums: {
    captureStatus: {
      success: "Erfolgreich",
      failed: "Fehlgeschlagen",
    },
    provider: {
      getresponse: "GetResponse",
      klaviyo: "Klaviyo",
      emarsys: "Emarsys",
      acumbamail: "Acumbamail",
      cleverreach: "CleverReach",
      connectif: "Connectif",
      datanext: "DataNext",
      edrone: "Edrone",
      expertsender: "ExpertSender",
      freshmail: "FreshMail",
      mailup: "MailUp",
      mapp: "Mapp",
      sailthru: "Sailthru",
      salesmanago: "SALESmanago",
      shopify: "Shopify",
      spotler: "Spotler",
      youlead: "YouLead",
      adobecampaign: "Adobe Campaign",
      googleSheets: "Google Sheets",
      platformEmail: "E-Mail (über Plattform)",
    },
  },
  config: {
    title: "Lead-Magnet-Konfiguration",
    description: "E-Mail-Integration konfigurieren",
    form: {
      title: "Lead-Magnet-Einstellungen",
      description: "Verbinde deine E-Mail-Plattform mit deiner Skill-Seite",
      provider: {
        label: "E-Mail-Plattform",
        description: "Welche E-Mail-Marketing-Plattform nutzt du?",
      },
      listId: {
        label: "Listen-ID",
        description: "ID der Ziel-Liste oder des Segments (optional)",
      },
      headline: {
        label: "Formular-Überschrift",
        description: "Die Überschrift über dem Lead-Capture-Formular",
        placeholder: "Hol dir mein KI-Prompt-Paket kostenlos",
      },
      buttonText: {
        label: "Button-Text",
        description: "Der Text auf dem Absende-Button",
        placeholder: "Zugang erhalten →",
      },
      isActive: {
        label: "Aktiv",
        description: "Lead-Magnet-Formular auf deiner Skill-Seite aktivieren",
      },
      credentials: {
        label: "API-Zugangsdaten",
        description: "API-Zugangsdaten (verschlüsselt gespeichert)",
      },
    },
    success: {
      saved: "Lead-Magnet-Konfiguration gespeichert",
      deleted: "Lead-Magnet-Konfiguration gelöscht",
    },
  },
  capture: {
    title: "Liste beitreten",
    description: "Abonnieren und Zugang erhalten",
    form: {
      title: "Zugang erhalten",
      description: "Trage deine Daten ein",
      firstName: {
        label: "Vorname",
        description: "Dein Vorname",
      },
      email: {
        label: "E-Mail-Adresse",
        description: "Deine E-Mail-Adresse",
      },
      skillId: {
        label: "Skill-ID",
        description: "Interne Skill-Referenz",
      },
    },
    success: {
      submitted: "Du bist dabei! Schau in dein Postfach.",
    },
  },
  errors: {
    providerError: "E-Mail-Anbieter Fehler",
  },
  providers: {
    shared: {
      listId: {
        label: "Listen-ID",
        description: "ID der Ziel-Liste oder des Segments",
        placeholder: "z.B. abc123",
      },
      headline: {
        label: "Formular-Überschrift",
        description:
          "Die Überschrift über dem Lead-Capture-Formular auf deiner Skill-Seite",
        placeholder: "Hol dir mein KI-Prompt-Paket kostenlos",
      },
      buttonText: {
        label: "Button-Text",
        description: "Der Text auf dem Absende-Button",
        placeholder: "Zugang erhalten →",
      },
      isActive: {
        label: "Aktiv",
        description: "Lead-Capture-Formular auf deiner Skill-Seite aktivieren",
      },
      saveTitle: "Konfiguration speichern",
      saveDescription: "Verbinde deine E-Mail-Plattform zum Erfassen von Leads",
      saveTag: "lead-magnet-provider",
      saveSuccess: {
        title: "Konfiguration gespeichert",
        description:
          "Deine E-Mail-Plattform ist verbunden. Leads werden erfasst.",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Bitte überprüfe deine Eingabe",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Du musst angemeldet sein",
        },
        forbidden: {
          title: "Kein Zugriff",
          description: "Du hast keine Berechtigung",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Du hast ungespeicherte Änderungen",
        },
        internal: {
          title: "Serverfehler",
          description: "Ein interner Fehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
      },
      response: {
        provider: "Anbieter",
        isActive: "Aktiv",
        headline: "Überschrift",
        buttonText: "Button-Text",
        listId: "Listen-ID",
      },
    },
    klaviyo: {
      title: "Klaviyo verbinden",
      description: "Verbinde dein Klaviyo-Konto mit deiner Skill-Seite",
      klaviyoApiKey: {
        label: "Klaviyo API-Schlüssel",
        description: "Dein privater Klaviyo API-Schlüssel",
        placeholder: "pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    getresponse: {
      title: "GetResponse verbinden",
      description: "Verbinde dein GetResponse-Konto mit deiner Skill-Seite",
      getresponseApiKey: {
        label: "GetResponse API-Schlüssel",
        description:
          "Dein GetResponse API-Schlüssel aus den Kontoeinstellungen",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    emarsys: {
      title: "Emarsys verbinden",
      description: "Verbinde dein Emarsys-Konto mit deiner Skill-Seite",
      emarsysUserName: {
        label: "Benutzername",
        description: "Dein Emarsys API-Benutzername",
        placeholder: "account123",
      },
      emarsysApiKey: {
        label: "API-Schlüssel",
        description: "Dein geheimer Emarsys API-Schlüssel",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      emarsysSubDomain: {
        label: "Subdomain",
        description: "Deine Emarsys API-Subdomain",
        placeholder: "suite.emarsys.net",
      },
    },
    acumbamail: {
      title: "Acumbamail verbinden",
      description: "Verbinde dein Acumbamail-Konto mit deiner Skill-Seite",
      acumbamailApiKey: {
        label: "API-Schlüssel",
        description: "Dein Acumbamail API-Schlüssel",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    cleverreach: {
      title: "CleverReach verbinden",
      description: "Verbinde dein CleverReach-Konto mit deiner Skill-Seite",
      cleverreachClientId: {
        label: "Client-ID",
        description: "Deine CleverReach OAuth Client-ID",
        placeholder: "xxxxxxxx",
      },
      cleverreachClientSecret: {
        label: "Client-Secret",
        description: "Dein CleverReach OAuth Client-Secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      cleverreachListId: {
        label: "Gruppen-ID",
        description: "Die ID der CleverReach-Gruppe für neue Kontakte",
        placeholder: "123456",
      },
      cleverreachFormId: {
        label: "DOI-Formular-ID (optional)",
        description:
          "Formular-ID für Double-Opt-in. Leer lassen zum Überspringen.",
        placeholder: "123456",
      },
      cleverreachSource: {
        label: "Quelle (optional)",
        description: "Kontaktquelle zur Nachverfolgung",
        placeholder: "unbottled.ai",
      },
    },
    connectif: {
      title: "Connectif verbinden",
      description: "Verbinde dein Connectif-Konto mit deiner Skill-Seite",
      connectifApiKey: {
        label: "API-Schlüssel",
        description: "Dein Connectif API-Schlüssel",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    datanext: {
      title: "DataNext verbinden",
      description: "Verbinde dein DataNext-Konto mit deiner Skill-Seite",
      datanextApiKey: {
        label: "API-Schlüssel",
        description: "Dein DataNext API-Schlüssel",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextApiSecret: {
        label: "API-Secret",
        description: "Dein DataNext API-Secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextFormId: {
        label: "Formular-ID",
        description: "Die DataNext-Formular-ID für das Opt-in-Formular",
        placeholder: "123456",
      },
      datanextCampaignId: {
        label: "Kampagnen-ID",
        description: "Die Kampagnen-ID für die Lead-Zuordnung",
        placeholder: "123456",
      },
    },
    edrone: {
      title: "Edrone verbinden",
      description: "Verbinde dein Edrone-Konto mit deiner Skill-Seite",
      edroneAppId: {
        label: "App-ID",
        description: "Deine Edrone App-ID",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
    },
    expertsender: {
      title: "ExpertSender verbinden",
      description: "Verbinde dein ExpertSender-Konto mit deiner Skill-Seite",
      expertSenderApiDomain: {
        label: "API-Domain",
        description: "Deine ExpertSender API-Domain",
        placeholder: "api3.esv2.com",
      },
      expertSenderApiKey: {
        label: "API-Schlüssel",
        description: "Dein ExpertSender API-Schlüssel",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    freshmail: {
      title: "FreshMail verbinden",
      description: "Verbinde dein FreshMail-Konto mit deiner Skill-Seite",
      freshmailApiKey: {
        label: "API-Schlüssel",
        description: "Dein FreshMail API-Schlüssel",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      freshmailApiSecret: {
        label: "API-Secret",
        description: "Dein FreshMail API-Secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listHash: {
        label: "Listen-Hash",
        description: "Der Hash der Abonnentenliste",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    mailup: {
      title: "MailUp verbinden",
      description: "Verbinde dein MailUp-Konto mit deiner Skill-Seite",
      mailupClientId: {
        label: "Client-ID",
        description: "Deine MailUp OAuth Client-ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupClientSecret: {
        label: "Client-Secret",
        description: "Dein MailUp OAuth Client-Secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupUsername: {
        label: "Benutzername",
        description: "Dein MailUp Benutzername",
        placeholder: "m12345",
      },
      mailupPassword: {
        label: "Passwort",
        description: "Dein MailUp Passwort",
        placeholder: "••••••••",
      },
      mailupListId: {
        label: "Listen-ID",
        description: "Die numerische ID der Abonnentenliste",
        placeholder: "1",
      },
    },
    mapp: {
      title: "Mapp verbinden",
      description: "Verbinde dein Mapp-Konto mit deiner Skill-Seite",
      mappUsername: {
        label: "Benutzername",
        description: "Dein Mapp API-Benutzername",
        placeholder: "username",
      },
      mappPassword: {
        label: "Passwort",
        description: "Dein Mapp API-Passwort",
        placeholder: "••••••••",
      },
      mappDomain: {
        label: "Domain",
        description: "Deine Mapp API-Domain",
        placeholder: "api.mapp.com",
      },
    },
    sailthru: {
      title: "Sailthru verbinden",
      description: "Verbinde dein Sailthru-Konto mit deiner Skill-Seite",
      sailthruApiKey: {
        label: "API-Schlüssel",
        description: "Dein Sailthru API-Schlüssel",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      sailthruSecret: {
        label: "API-Secret",
        description: "Dein Sailthru API-Secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listName: {
        label: "Listenname",
        description: "Der Name der Sailthru-Liste für Abonnenten",
        placeholder: "Meine Abonnenten",
      },
    },
    salesmanago: {
      title: "SALESmanago verbinden",
      description: "Verbinde dein SALESmanago-Konto mit deiner Skill-Seite",
      salesManagoClientId: {
        label: "Client-ID",
        description: "Deine SALESmanago Client-ID",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      salesManagoApiKey: {
        label: "API-Schlüssel",
        description: "Dein SALESmanago API-Schlüssel",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoSha: {
        label: "SHA-Hash",
        description: "Dein SALESmanago SHA-Hash zur Authentifizierung",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoDomain: {
        label: "Domain",
        description: "Deine SALESmanago API-Domain",
        placeholder: "app3.salesmanago.pl",
      },
      salesManagoOwner: {
        label: "Inhaber-E-Mail",
        description: "Die Inhaber-E-Mail deines SALESmanago-Kontos",
        placeholder: "inhaber@example.com",
      },
    },
    shopify: {
      title: "Shopify verbinden",
      description: "Verbinde deinen Shopify-Shop mit deiner Skill-Seite",
      shopifyDomain: {
        label: "Shop-Domain",
        description: "Deine Shopify-Shop-Domain",
        placeholder: "meinshop.myshopify.com",
      },
      shopifyAccessToken: {
        label: "Zugriffstoken",
        description: "Dein Shopify Admin API-Zugriffstoken",
        placeholder: "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    spotler: {
      title: "Spotler verbinden",
      description: "Verbinde dein Spotler-Konto mit deiner Skill-Seite",
      spotlerConsumerKey: {
        label: "Consumer Key",
        description: "Dein Spotler API Consumer Key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      spotlerConsumerSecret: {
        label: "Consumer Secret",
        description: "Dein Spotler API Consumer Secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    youlead: {
      title: "YouLead verbinden",
      description: "Verbinde dein YouLead-Konto mit deiner Skill-Seite",
      youLeadAppId: {
        label: "App-ID",
        description: "Deine YouLead Anwendungs-ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadClientId: {
        label: "Client-ID",
        description: "Deine YouLead Client-ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadAppSecretKey: {
        label: "App-Secret-Key",
        description: "Dein YouLead Anwendungs-Secret-Key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    adobecampaign: {
      title: "Adobe Campaign verbinden",
      description: "Verbinde dein Adobe Campaign-Konto mit deiner Skill-Seite",
      adobeCampaignOrganizationId: {
        label: "Organisations-ID",
        description: "Deine Adobe IMS Organisations-ID",
        placeholder: "XXXXXXXXXXXXXXXXXXXXXXXX@AdobeOrg",
      },
      adobeCampaignClientId: {
        label: "Client-ID",
        description: "Deine Adobe Campaign API Client-ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignClientSecret: {
        label: "Client-Secret",
        description: "Dein Adobe Campaign API Client-Secret",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignApiKey: {
        label: "API-Schlüssel",
        description: "Dein Adobe Campaign API-Schlüssel",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignListId: {
        label: "Listen-ID",
        description: "Die Adobe Campaign Profillisten-ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    platformEmail: {
      title: "Benachrichtigung per Plattform-E-Mail",
      description:
        "Erhalte eine E-Mail-Benachrichtigung, wenn sich jemand über deinen Lead-Magneten anmeldet",
      notifyEmail: {
        label: "Benachrichtigungs-E-Mail",
        description: "Wohin die Lead-Benachrichtigungen gesendet werden",
        placeholder: "du@beispiel.de",
      },
      notifyEmailName: {
        label: "Dein Name",
        description: "Name in der Benachrichtigungs-E-Mail",
        placeholder: "Jana",
      },
    },
    googleSheets: {
      title: "Google Sheets verbinden",
      description:
        "Fügt bei jeder Anmeldung eine neue Zeile in deine Google-Tabelle ein",
      saveTitle: "Google Sheets speichern",
      connect: {
        label: "Google-Konto verbinden",
      },
      connected: {
        description: "Dein Google-Konto ist verbunden",
      },
      spreadsheetId: {
        label: "Tabellendokument",
        description: "Wähle das Dokument, in das Leads eingetragen werden",
        placeholder: "Tabellendokument auswählen…",
      },
      sheetTab: {
        label: "Tabellenblatt (optional)",
        description: "Name des Tabellenblatts. Standard: erstes Blatt.",
        placeholder: "z.B. Leads",
      },
      widget: {
        connectTitle: "Google Sheets verbinden",
        connectDescription:
          "Mit Google anmelden und jeden neuen Lead automatisch als Tabellenzeile speichern.",
        redirectNote:
          "Du wirst zu Google weitergeleitet, um den Zugriff zu autorisieren.",
        reconnect: "Neu verbinden",
        loading: "Tabellen werden geladen…",
        noSheets: "Keine Tabellen gefunden",
        refresh: "Liste aktualisieren",
        selectRequired: "Bitte wähle ein Tabellendokument",
        saveFailed: "Speichern fehlgeschlagen. Bitte versuche es erneut.",
        saving: "Wird gespeichert…",
      },
    },
  },
};
