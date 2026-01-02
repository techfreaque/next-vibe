import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
        description: "Zu erstattender Betrag (optional, Standard ist voller Betrag)",
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
};
