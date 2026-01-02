import { translations as cliTranslations } from "../../cli/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  name: "NOWPayments",
  description: "Kryptowährungs-Zahlungsanbieter mit Abo-Unterstützung",

  cli: cliTranslations,

  errors: {
    userNotFound: {
      title: "Benutzer nicht gefunden",
      description: "Der angegebene Benutzer konnte nicht gefunden werden",
    },
    customerCreationFailed: {
      title: "Kundenerstellung fehlgeschlagen",
      description: "NOWPayments-Kunde konnte nicht erstellt werden: {error}",
    },
    productNotFound: {
      title: "Produkt nicht gefunden",
      description: "Das angegebene Produkt konnte nicht gefunden werden: {productId}",
    },
    userEmailRequired: {
      title: "Benutzer-E-Mail erforderlich",
      description: "Benutzer-E-Mail ist für Abonnements erforderlich: {userId}",
    },
    checkoutCreationFailed: {
      title: "Checkout-Erstellung fehlgeschlagen",
      description: "NOWPayments-Checkout-Sitzung konnte nicht erstellt werden: {error}",
    },
    invoiceCreationFailed: {
      title: "Rechnungserstellung fehlgeschlagen",
      description: "NOWPayments-Rechnung konnte nicht erstellt werden: {error}",
    },
    invalidApiKey: {
      title: "Ungültiger API-Schlüssel",
      description:
        "Ungültiger NOWPayments API-Schlüssel. Bitte überprüfen Sie Ihre Konfiguration und stellen Sie sicher, dass Sie einen gültigen API-Schlüssel von https://nowpayments.io/app/dashboard haben",
    },
    planCreationFailed: {
      title: "Plan-Erstellung fehlgeschlagen",
      description: "NOWPayments-Abo-Plan konnte nicht erstellt werden: {error}",
    },
    subscriptionCreationFailed: {
      title: "Abo-Erstellung fehlgeschlagen",
      description: "NOWPayments-Abonnement konnte nicht erstellt werden: {error}",
    },
    subscriptionRetrievalFailed: {
      title: "Abo-Abruf fehlgeschlagen",
      description: "NOWPayments-Abonnement konnte nicht abgerufen werden: {error}",
    },
    subscriptionCancellationFailed: {
      title: "Abo-Kündigung fehlgeschlagen",
      description: "NOWPayments-Abonnement konnte nicht gekündigt werden: {error}",
    },
    subscriptionListFailed: {
      title: "Abo-Listenabruf fehlgeschlagen",
      description: "NOWPayments-Abonnements konnten nicht aufgelistet werden: {error}",
    },
    webhookVerificationFailed: {
      title: "Webhook-Verifizierung fehlgeschlagen",
      description: "NOWPayments-Webhook-Signatur konnte nicht verifiziert werden: {error}",
    },
    paymentStatusFailed: {
      title: "Abruf des Zahlungsstatus fehlgeschlagen",
      description: "Zahlungsstatus konnte nicht von NOWPayments abgerufen werden: {error}",
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
};
