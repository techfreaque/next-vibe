import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import sub-domain translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Abonnement-Checkout erstellen",
    description: "Eine Stripe-Checkout-Sitzung für Abonnements erstellen",
    category: "Abonnement",

    // Tags
    tags: {
      subscription: "abonnement",
      checkout: "checkout",
      stripe: "stripe",
    },

    // Form configuration
    form: {
      title: "Checkout-Konfiguration",
      description: "Checkout-Sitzungsparameter konfigurieren",
      fields: {
        planId: {
          label: "Abonnement-Plan",
          description: "Abonnement-Plan auswählen",
          placeholder: "Plan auswählen",
        },
        billingInterval: {
          label: "Abrechnungsintervall",
          description: "Abrechnungshäufigkeit auswählen",
          placeholder: "Abrechnungsintervall auswählen",
        },
        provider: {
          label: "Zahlungsanbieter",
          description: "Wählen Sie, wie Sie bezahlen möchten",
          placeholder: "Zahlungsanbieter auswählen",
        },
        metadata: {
          label: "Metadaten",
          description: "Zusätzliche Metadaten für die Checkout-Sitzung",
          placeholder: "Metadaten als JSON eingeben",
        },
      },
    },

    // Response fields
    response: {
      success: "Checkout-Sitzung erfolgreich erstellt",
      sessionId: "Stripe-Sitzungs-ID",
      checkoutUrl: "Checkout-URL",
      message: "Statusmeldung",
    },

    // Error types
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindungsfehler",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },

    // Success types
    success: {
      title: "Erfolg",
      description: "Checkout-Sitzung erfolgreich erstellt",
    },

    // POST endpoint specific translations
    post: {
      title: "Checkout-Sitzung erstellen",
      description: "Eine neue Abonnement-Checkout-Sitzung erstellen",
      form: {
        title: "Checkout-Sitzungs-Konfiguration",
        description: "Checkout-Sitzungsparameter konfigurieren",
      },
      response: {
        title: "Checkout-Antwort",
        description: "Checkout-Sitzungsantwortdaten",
      },
      errors: {
        alreadySubscribed: {
          title: "Bereits abonniert",
          description: "Sie haben bereits ein aktives Abonnement",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Checkout-Parameter",
          reason: {
            enterpriseCustomPricing:
              "ENTERPRISE-Plan erfordert individuelle Preisgestaltung",
          },
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkverbindungsfehler",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Checkout-Sitzung nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
      },
      success: {
        title: "Erfolg",
        description: "Checkout-Sitzung erfolgreich erstellt",
      },
    },

    // General error message
    error: "Ein Fehler ist beim Checkout aufgetreten",

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Monatlich",
      yearly: "Jährlich",
    },
  },
  invoice: {
    category: "Abrechnung",
    tags: {
      payment: "zahlung",
      invoice: "rechnung",
      transactions: "transaktionen",
    },
    defaultItem: "Rechnungsposition",
    success: {
      created: "Rechnung erfolgreich erstellt",
    },
    post: {
      title: "Titel",
      description: "Endpunkt-Beschreibung",
      form: {
        title: "Konfiguration",
        description: "Parameter konfigurieren",
      },
      response: {
        success: "Rechnung erfolgreich erstellt",
        message: "Statusmeldung",
        invoice: {
          title: "Rechnungsdetails",
          description: "Generierte Rechnungsinformationen",
          id: "Rechnungs-ID",
          userId: "Benutzer-ID",
          stripeInvoiceId: "Stripe-Rechnungs-ID",
          invoiceNumber: "Rechnungsnummer",
          amount: "Betrag",
          currency: "Währung",
          status: "Status",
          invoiceUrl: "Rechnungs-URL",
          invoicePdf: "Rechnungs-PDF",
          dueDate: "Fälligkeitsdatum",
          paidAt: "Bezahlt am",
          createdAt: "Erstellt am",
          updatedAt: "Aktualisiert am",
        },
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
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
      widget: {
        back: "Zurück",
      },
    },
    customerId: {
      label: "Kunden-ID",
      description: "Stripe-Kundenkennung",
      placeholder: "Kunden-ID eingeben",
    },
    amount: {
      label: "Betrag",
      description: "Rechnungsbetrag",
      placeholder: "Betrag eingeben",
    },
    currency: {
      label: "Währung",
      description: "Währungscode",
      placeholder: "Währung auswählen",
      usd: "US-Dollar (USD)",
      eur: "Euro (EUR)",
      pln: "Polnischer Zloty (PLN)",
    },
    description: {
      label: "Beschreibung",
      description: "Rechnungsbeschreibung",
      placeholder: "Beschreibung eingeben",
    },
    dueDate: {
      label: "Fälligkeitsdatum",
      description: "Zahlungsfrist",
      placeholder: "Fälligkeitsdatum auswählen",
    },
    metadata: {
      label: "Metadaten",
      description: "Zusätzliche Metadaten",
      placeholder: "Metadaten als JSON eingeben",
    },
  },
  portal: {
    success: {
      created: "Kundenportal-Sitzung erfolgreich erstellt",
    },
    post: {
      title: "Titel",
      description: "Endpunkt-Beschreibung",
      form: {
        title: "Portal-Konfiguration",
        description: "Parameter für das Kundenportal konfigurieren",
      },
      returnUrl: {
        label: "Rücksprung-URL",
        description: "URL für die Weiterleitung nach der Portal-Sitzung",
        placeholder: "https://example.com/dashboard",
      },
      response: {
        success: "Portal-Sitzung erfolgreich erstellt",
        message: "Statusmeldung",
        customerPortalUrl: "Kundenportal-URL",
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
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
    },
  },
  refund: {
    title: "Rückerstattung verarbeiten",
    description: "Eine Rückerstattung für eine Zahlungstransaktion verarbeiten",
    category: "Zahlungsrückerstattungen",

    tags: {
      refund: "rückerstattung",
      transaction: "transaktion",
    },

    success: {
      created: "Rückerstattung erfolgreich verarbeitet",
    },

    reason: {
      requestedByCustomer: "Vom Kunden angefordert",
    },

    form: {
      title: "Rückerstattungsformular",
      description: "Rückerstattungsdetails eingeben",
      fields: {
        transactionId: {
          label: "Transaktions-ID",
          description: "ID der zu erstattenden Transaktion",
          placeholder: "Transaktions-ID eingeben",
        },
        amount: {
          label: "Rückerstattungsbetrag",
          description:
            "Zu erstattender Betrag (optional, Standard ist voller Betrag)",
          placeholder: "Betrag eingeben",
        },
        reason: {
          label: "Rückerstattungsgrund",
          description: "Grund für die Rückerstattung",
          placeholder: "Grund eingeben",
        },
        metadata: {
          label: "Metadaten",
          description: "Zusätzliche Rückerstattungsmetadaten",
          placeholder: "Metadaten als JSON eingeben",
        },
      },
    },

    post: {
      title: "Rückerstattung verarbeiten",
      description: "Eine Zahlungsrückerstattung verarbeiten",
      response: {
        success: "Rückerstattung erfolgreich verarbeitet",
        message: "Statusmeldung",
        refund: {
          title: "Rückerstattungsdetails",
          description: "Verarbeitete Rückerstattungsinformationen",
          id: "Rückerstattungs-ID",
          userId: "Benutzer-ID",
          transactionId: "Transaktions-ID",
          stripeRefundId: "Stripe-Rückerstattungs-ID",
          amount: "Rückerstattungsbetrag",
          currency: "Währung",
          status: "Rückerstattungsstatus",
          reason: "Rückerstattungsgrund",
          createdAt: "Erstellt am",
          updatedAt: "Aktualisiert am",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Rückerstattungsparameter",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Transaktion nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkverbindungsfehler",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        conflict: {
          title: "Konflikt",
          description: "Rückerstattungskonflikt erkannt",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Rückerstattung erfolgreich verarbeitet",
      },
    },
  },
  providers: {
    stripe: {
      title: "Stripe CLI Integration",
      description: "Stripe CLI-Operationen und Webhook-Listening verwalten",
      category: "Payment Integration",
      tags: {
        stripe: "Stripe",
        cli: "Kommandozeile",
        webhook: "Webhook",
      },

      operations: {
        check: "Installation prüfen",
        install: "Stripe CLI installieren",
        listen: "Webhook-Listener starten",
        login: "Bei Stripe anmelden",
        status: "Status prüfen",
      },

      form: {
        title: "Stripe CLI-Konfiguration",
        description:
          "Stripe CLI-Operationen und Webhook-Einstellungen konfigurieren",
        fields: {
          operation: {
            label: "Operationstyp",
            description: "Wählen Sie die auszuführende Stripe CLI-Operation",
            placeholder: "Wählen Sie eine Operation...",
          },
          port: {
            label: "Portnummer",
            description: "Portnummer für Webhook-Weiterleitung (1000-65535)",
            placeholder: "4242",
          },
          events: {
            label: "Webhook-Events",
            description: "Wählen Sie Stripe-Events zum Abhören",
            placeholder: "Wählen Sie zu überwachende Events...",
            paymentIntentSucceeded: "Zahlungsabsicht erfolgreich",
            paymentIntentFailed: "Zahlungsabsicht fehlgeschlagen",
            subscriptionCreated: "Abonnement erstellt",
            subscriptionUpdated: "Abonnement aktualisiert",
            invoicePaymentSucceeded: "Rechnungszahlung erfolgreich",
            invoicePaymentFailed: "Rechnungszahlung fehlgeschlagen",
          },
          forwardTo: {
            label: "Weiterleiten an URL",
            description:
              "Lokaler Endpunkt zur Weiterleitung von Webhook-Events",
            placeholder: "localhost:3000/api/webhooks/stripe",
          },
          skipSslVerify: {
            label: "SSL-Verifizierung überspringen",
            description:
              "SSL-Zertifikatverifizierung für Entwicklung überspringen",
          },
        },
      },

      response: {
        success: "Operation erfolgreich abgeschlossen",
        installed: "Stripe CLI-Installationsstatus",
        version: "Installierte Stripe CLI-Version",
        status: "Aktueller Operationsstatus",
        output: "Befehlsausgabe und Logs",
        instructions: "Nächste Schritte und Anweisungen",
        webhookEndpoint: "Webhook-Endpunkt-URL",
      },

      login: {
        instructions:
          "Um sich bei Stripe zu authentifizieren, führen Sie 'stripe login' in Ihrem Terminal aus und folgen Sie den Anweisungen, um Ihr Stripe-Konto zu verbinden.",
      },

      status: {
        authenticated: "Authentifiziert und bereit",
        not_authenticated:
          "Nicht authentifiziert - führen Sie 'stripe login' aus",
        not_installed: "Stripe CLI ist nicht installiert",
      },

      errors: {
        validation: {
          title: "Ungültige Konfiguration",
          description:
            "Bitte überprüfen Sie Ihre Stripe CLI-Konfiguration und versuchen Sie es erneut",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zu Stripe-Diensten nicht möglich",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie haben keine Berechtigung, diese Operation auszuführen",
        },
        forbidden: {
          title: "Zugriff verboten",
          description: "Diese Operation ist für Ihr Konto nicht erlaubt",
        },
        notFound: {
          title: "Ressource nicht gefunden",
          description: "Die angeforderte Stripe-Ressource wurde nicht gefunden",
        },
        serverError: {
          title: "Serverfehler",
          description:
            "Ein Fehler ist bei der Verarbeitung der Stripe-Operation aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist mit Stripe CLI aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Konfigurationsänderungen",
        },
        conflict: {
          title: "Operationskonflikt",
          description: "Eine andere Stripe-Operation läuft derzeit",
        },
        execution_failed:
          "Stripe CLI-Operation konnte nicht ordnungsgemäß ausgeführt werden",
        userNotFound: {
          title: "Benutzer nicht gefunden",
          description: "Der angegebene Benutzer wurde nicht gefunden",
        },
        customerCreationFailed: {
          title: "Kundenerstellung fehlgeschlagen",
          description: "Stripe-Kunde konnte nicht erstellt werden",
        },
        customerRetrievalFailed: {
          title: "Kundenabruf fehlgeschlagen",
          description:
            "Stripe-Kundeninformationen konnten nicht abgerufen werden",
        },
        checkoutCreationFailed: {
          title: "Checkout-Erstellung fehlgeschlagen",
          description: "Stripe-Checkout-Sitzung konnte nicht erstellt werden",
        },
        webhookVerificationFailed: {
          title: "Webhook-Verifizierung fehlgeschlagen",
          description: "Webhook-Signatur konnte nicht verifiziert werden",
        },
        subscriptionRetrievalFailed: {
          title: "Abonnement-Abruf fehlgeschlagen",
          description: "Abonnement konnte nicht von Stripe abgerufen werden",
        },
        subscriptionCancellationFailed: {
          title: "Abonnement-Kündigung fehlgeschlagen",
          description: "Abonnement konnte in Stripe nicht gekündigt werden",
        },
        priceCreationFailed: {
          title: "Preis-Erstellung fehlgeschlagen",
          description: "Preis konnte in Stripe nicht erstellt werden",
        },
        notConfigured: {
          title: "Stripe nicht konfiguriert",
          description:
            "Stripe ist nicht konfiguriert - setze STRIPE_SECRET_KEY in deiner .env",
        },
        stripeCliNotInstalled: "Stripe CLI ist nicht installiert",
        listenerFailed: "Stripe Webhook-Listener konnte nicht gestartet werden",
      },

      success: {
        title: "Operation erfolgreich",
        description: "Stripe CLI-Operation erfolgreich abgeschlossen",
      },

      installInstructions: {
        documentation:
          "Bitte installieren Sie Stripe CLI gemäß der offiziellen Dokumentation unter: https://docs.stripe.com/stripe-cli",
        quickInstallation: "Schnelle Installationsoptionen:",
        macOS: {
          title: "macOS (mit Homebrew):",
          command: "brew install stripe/stripe-cli/stripe",
        },
        linux: {
          title: "Linux (mit Paketmanager):",
          debian: {
            title: "Debian/Ubuntu",
          },
          fedora: {
            title: "CentOS/RHEL/Fedora",
          },
        },
        windows: {
          title: "Windows:",
          scoop: {
            title: "Mit Scoop",
          },
          github: {
            title: "Oder direkt von GitHub-Releases herunterladen:",
            url: "https://github.com/stripe/stripe-cli/releases",
          },
        },
        authentication: {
          title: "Nach der Installation authentifizieren mit:",
          command: "stripe login",
        },
      },
    },
    nowpayments: {
      name: "NOWPayments",
      description: "Kryptowährungs-Zahlungsanbieter mit Abo-Unterstützung",

      cli: {
        post: {
          title: "NOWPayments CLI",
          description: "NOWPayments Webhook-Tunneling mit ngrok verwalten",
          category: "Zahlung",
          tags: {
            nowpayments: "NOWPayments",
            cli: "CLI",
            webhook: "Webhook",
          },
          operations: {
            check: "Prüfen",
            install: "Installieren",
            tunnel: "Tunnel",
            status: "Status",
          },
          form: {
            title: "NOWPayments CLI Operationen",
            description:
              "ngrok-Tunnel für NOWPayments Webhooks konfigurieren und verwalten",
            fields: {
              operation: {
                label: "Operation",
                description: "Wählen Sie die auszuführende Operation",
                placeholder: "Wählen Sie eine Operation",
              },
              port: {
                label: "Port",
                description: "Lokaler Port für Tunnel (Standard: 3000)",
                placeholder: "3000",
              },
            },
          },
          errors: {
            validationFailed: {
              title: "Validierungsfehler",
              description: "Ungültige Operation oder Parameter",
            },
            networkError: {
              title: "Netzwerkfehler",
              description: "Netzwerkverbindung fehlgeschlagen",
            },
            unauthorized: {
              title: "Nicht autorisiert",
              description: "Authentifizierung erforderlich",
            },
            forbidden: {
              title: "Verboten",
              description: "Zugriff verweigert",
            },
            notFound: {
              title: "Nicht gefunden",
              description: "Ressource nicht gefunden",
            },
            serverError: {
              title: "Serverfehler",
              description: "Fehler beim Ausführen der Operation",
            },
            unknownError: {
              title: "Unbekannter Fehler",
              description: "Ein unbekannter Fehler ist aufgetreten",
            },
            unsavedChanges: {
              title: "Nicht gespeicherte Änderungen",
              description: "Es gibt nicht gespeicherte Änderungen",
            },
            conflict: {
              title: "Konflikt",
              description: "Ressourcenkonflikt",
            },
          },
          response: {
            title: "Antwort",
            description: "Operationsergebnis",
            fields: {
              success: "Erfolg",
              installed: "Installiert",
              version: "Version",
              status: "Status",
              output: "Ausgabe",
              instructions: "Anweisungen",
              tunnelUrl: "Tunnel-URL",
              webhookUrl: "Webhook-URL",
            },
          },
          success: {
            title: "Erfolg",
            description: "Operation erfolgreich abgeschlossen",
          },
        },
      },

      errors: {
        userNotFound: {
          title: "Benutzer nicht gefunden",
          description: "Der angegebene Benutzer konnte nicht gefunden werden",
        },
        customerCreationFailed: {
          title: "Kundenerstellung fehlgeschlagen",
          description:
            "NOWPayments-Kunde konnte nicht erstellt werden: {error}",
        },
        productNotFound: {
          title: "Produkt nicht gefunden",
          description:
            "Das angegebene Produkt konnte nicht gefunden werden: {productId}",
        },
        userEmailRequired: {
          title: "Benutzer-E-Mail erforderlich",
          description:
            "Benutzer-E-Mail ist für Abonnements erforderlich: {userId}",
        },
        checkoutCreationFailed: {
          title: "Checkout-Erstellung fehlgeschlagen",
          description:
            "NOWPayments-Checkout-Sitzung konnte nicht erstellt werden: {error}",
        },
        invoiceCreationFailed: {
          title: "Rechnungserstellung fehlgeschlagen",
          description:
            "NOWPayments-Rechnung konnte nicht erstellt werden: {error}",
        },
        invalidApiKey: {
          title: "Ungültiger API-Schlüssel",
          description:
            "Ungültiger NOWPayments API-Schlüssel. Bitte überprüfen Sie Ihre Konfiguration und stellen Sie sicher, dass Sie einen gültigen API-Schlüssel von https://nowpayments.io/app/dashboard haben",
        },
        planCreationFailed: {
          title: "Plan-Erstellung fehlgeschlagen",
          description:
            "NOWPayments-Abo-Plan konnte nicht erstellt werden: {error}",
        },
        subscriptionCreationFailed: {
          title: "Abo-Erstellung fehlgeschlagen",
          description:
            "NOWPayments-Abonnement konnte nicht erstellt werden: {error}",
        },
        subscriptionRetrievalFailed: {
          title: "Abo-Abruf fehlgeschlagen",
          description:
            "NOWPayments-Abonnement konnte nicht abgerufen werden: {error}",
        },
        subscriptionCancellationFailed: {
          title: "Abo-Kündigung fehlgeschlagen",
          description:
            "NOWPayments-Abonnement konnte nicht gekündigt werden: {error}",
        },
        subscriptionListFailed: {
          title: "Abo-Listenabruf fehlgeschlagen",
          description:
            "NOWPayments-Abonnements konnten nicht aufgelistet werden: {error}",
        },
        notConfigured: {
          title: "NOWPayments nicht konfiguriert",
          description:
            "NOWPayments ist nicht konfiguriert - setze NOWPAYMENTS_API_KEY und NOWPAYMENTS_IPN_SECRET in deiner .env",
        },
        webhookVerificationFailed: {
          title: "Webhook-Verifizierung fehlgeschlagen",
          description:
            "NOWPayments-Webhook-Signatur konnte nicht verifiziert werden: {error}",
        },
        paymentStatusFailed: {
          title: "Abruf des Zahlungsstatus fehlgeschlagen",
          description:
            "Zahlungsstatus konnte nicht von NOWPayments abgerufen werden: {error}",
        },
      },

      success: {
        invoiceCreated: {
          title: "Rechnung erstellt",
          description: "NOWPayments-Rechnung erfolgreich erstellt",
        },
        webhookVerified: {
          title: "Webhook verifiziert",
          description: "NOWPayments-Webhook erfolgreich verifiziert",
        },
        paymentStatusRetrieved: {
          title: "Zahlungsstatus abgerufen",
          description: "NOWPayments-Zahlungsstatus erfolgreich abgerufen",
        },
      },
    },
  },

  // Main payment domain
  category: "Abrechnung",

  // Main form configuration
  form: {
    title: "Zahlungskonfiguration",
    description: "Zahlungsparameter konfigurieren",
  },

  // Tags
  tags: {
    payment: "zahlung",
    stripe: "stripe",
    checkout: "checkout",
    list: "liste",
    transactions: "transaktionen",
    info: "info",
  },

  // Create payment endpoint
  create: {
    title: "Zahlungssitzung erstellen",
    titleShort: "Sitzung erstellen",
    description: "Eine neue Zahlungssitzung mit Stripe erstellen",
    form: {
      title: "Zahlungskonfiguration",
      description: "Zahlungssitzungsparameter konfigurieren",
    },
    paymentMethodTypes: {
      label: "Zahlungsmethoden",
      description: "Akzeptierte Zahlungsmethoden auswählen",
    },
    successUrl: {
      label: "Erfolgs-URL",
      description: "URL für Weiterleitung nach erfolgreicher Zahlung",
      placeholder: "https://example.com/success",
    },
    cancelUrl: {
      label: "Abbruch-URL",
      description: "URL für Weiterleitung bei Zahlungsabbruch",
      placeholder: "https://example.com/cancel",
    },
    customerEmail: {
      label: "Kunden-E-Mail",
      description: "Kunden-E-Mail-Adresse für die Zahlung",
      placeholder: "kunde@example.com",
    },
    response: {
      success: "Zahlungssitzung erfolgreich erstellt",
      sessionId: "Stripe-Sitzungs-ID",
      sessionUrl: "Stripe-Sitzungs-URL",
      checkoutUrl: "Checkout-URL",
      message: "Statusmeldung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Zahlungsparameter",
      },
      internal: {
        title: "Interner Fehler",
        description: "Ein interner Fehler ist aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Zahlungssitzung nicht gefunden",
      },
      forbidden: {
        title: "Verboten",
        description: "Berechtigung verweigert",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindungsfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Zahlungskonflikt erkannt",
      },
    },
    success: {
      title: "Erfolg",
      description: "Zahlungssitzung erfolgreich erstellt",
      message: "Zahlungssitzung erfolgreich erstellt",
    },
  },

  // Get payment endpoint
  get: {
    title: "Zahlungsinformationen abrufen",
    titleShort: "Zahlungen",
    description: "Zahlungstransaktionen und -methoden abrufen",
    form: {
      title: "Zahlungsabfrage",
      description: "Zahlungsinformationen abfragen",
    },
    response: {
      success: "Zahlungsdaten erfolgreich abgerufen",
      sessionUrl: "Zahlungssitzungs-URL",
      sessionId: "Zahlungssitzungs-ID",
      message: "Statusmeldung",
      transactions: "Zahlungstransaktionen",
      paymentMethods: "Zahlungsmethoden",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Abfrageparameter",
      },
      internal: {
        title: "Interner Fehler",
        description: "Ein interner Fehler ist aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Zahlungsinformationen nicht gefunden",
      },
      forbidden: {
        title: "Verboten",
        description: "Berechtigung verweigert",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindungsfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Zahlungskonflikt erkannt",
      },
    },
    success: {
      title: "Erfolg",
      description: "Zahlungsinformationen erfolgreich abgerufen",
    },
  },

  // Top-level error handling
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Zahlungsparameter",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Zahlung nicht gefunden",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Berechtigung verweigert",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindungsfehler",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Zahlungskonflikt erkannt",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Diese Zahlungsanbieter-Funktion ist noch nicht implementiert",
    },
    customerCreationFailed: "Fehler beim Erstellen des Stripe-Kunden",
    customerNotFound: "Stripe-Kunde nicht gefunden",
    localMode: "Zahlung ist im lokalen Entwicklungsmodus deaktiviert",
    webhookVerificationFailed: "Webhook-Signaturverifizierung fehlgeschlagen",
  },

  // Top-level success
  success: {
    title: "Erfolg",
    description: "Vorgang erfolgreich abgeschlossen",
    sessionCreated: "Zahlungssitzung erfolgreich erstellt",
    infoRetrieved: "Zahlungsinformationen erfolgreich abgerufen",
  },

  // Field labels and descriptions
  amount: {
    label: "Betrag",
    description: "Zahlungsbetrag in der angegebenen Währung",
    placeholder: "Betrag eingeben",
  },
  currency: {
    label: "Währung",
    description: "Zahlungswährung",
    placeholder: "Währung auswählen",
    usd: "US-Dollar (USD)",
    eur: "Euro (EUR)",
    pln: "Polnischer Zloty (PLN)",
  },
  mode: {
    label: "Zahlungsmodus",
    description: "Art der Zahlungssitzung",
    placeholder: "Zahlungsmodus auswählen",
  },
  successUrl: {
    label: "Erfolgs-URL",
    description: "URL für Weiterleitung nach erfolgreicher Zahlung",
    placeholder: "https://example.com/success",
  },
  cancelUrl: {
    label: "Abbruch-URL",
    description: "URL für Weiterleitung bei Zahlungsabbruch",
    placeholder: "https://example.com/cancel",
  },
  metadata: {
    label: "Metadaten",
    description: "Zusätzliche Metadaten für die Zahlungssitzung",
    placeholder: "Metadaten als JSON eingeben",
  },
  paymentId: {
    label: "Zahlungs-ID",
    description: "Spezifische Zahlungs-ID zum Abrufen",
    placeholder: "Zahlungs-ID eingeben",
  },
  sessionId: {
    label: "Sitzungs-ID",
    description: "Stripe-Sitzungs-ID zur Abfrage",
    placeholder: "Sitzungs-ID eingeben",
  },
  limit: {
    label: "Limit",
    description: "Maximale Anzahl der zurückzugebenden Ergebnisse",
    placeholder: "20",
  },
  offset: {
    label: "Offset",
    description: "Anzahl der zu überspringenden Ergebnisse",
    placeholder: "0",
  },
  priceId: {
    label: "Preis-ID",
    description: "Stripe-Preiskennzeichnung für das Produkt",
    placeholder: "price_1234567890",
  },
  provider: {
    label: "Zahlungsanbieter",
    description: "Wählen Sie Ihre Zahlungsmethode",
    placeholder: "Zahlungsanbieter auswählen",
  },

  // Enum translations
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
    paymentStatus: {
      pending: "Ausstehend",
      processing: "In Bearbeitung",
      succeeded: "Erfolgreich",
      failed: "Fehlgeschlagen",
      canceled: "Storniert",
      refunded: "Erstattet",
    },
    paymentMethodType: {
      card: "Kredit-/Debitkarte",
      bankTransfer: "Banküberweisung",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "SEPA-Lastschrift",
    },
    paymentIntentStatus: {
      requiresPaymentMethod: "Benötigt Zahlungsmethode",
      requiresConfirmation: "Benötigt Bestätigung",
      requiresAction: "Benötigt Aktion",
      processing: "In Bearbeitung",
      requiresCapture: "Benötigt Erfassung",
      canceled: "Storniert",
      succeeded: "Erfolgreich",
    },
    checkoutMode: {
      payment: "Zahlung",
      subscription: "Abonnement",
      setup: "Einrichtung",
    },
    refundStatus: {
      pending: "Ausstehend",
      succeeded: "Erfolgreich",
      failed: "Fehlgeschlagen",
      canceled: "Storniert",
    },
    disputeStatus: {
      warningNeedsResponse: "Warnung - Antwort erforderlich",
      warningUnderReview: "Warnung - In Prüfung",
      warningClosed: "Warnung - Geschlossen",
      needsResponse: "Antwort erforderlich",
      underReview: "In Prüfung",
      chargeRefunded: "Betrag erstattet",
      won: "Gewonnen",
      lost: "Verloren",
    },
    invoiceStatus: {
      draft: "Entwurf",
      open: "Offen",
      paid: "Bezahlt",
      void: "Ungültig",
      uncollectible: "Uneinbringlich",
    },
    taxStatus: {
      complete: "Vollständig",
      failed: "Fehlgeschlagen",
      requiresLocation: "Standort erforderlich",
    },
    paymentInterval: {
      month: "Monatlich",
      year: "Jährlich",
      one_time: "Einmalig",
    },
    manualPaymentMethod: {
      cash: "Barzahlung",
      bankTransfer: "Banküberweisung",
      other: "Sonstige",
    },
    billStatus: {
      DRAFT: "Entwurf",
      RECEIVED: "Eingegangen",
      APPROVED: "Genehmigt",
      PAID: "Bezahlt",
      DISPUTED: "Strittig",
    },
    estimateStatus: {
      DRAFT: "Entwurf",
      SENT: "Versendet",
      ACCEPTED: "Angenommen",
      DECLINED: "Abgelehnt",
      EXPIRED: "Abgelaufen",
      CONVERTED: "Umgewandelt",
    },
  },
};
