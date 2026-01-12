import { translations as cliTranslations } from "../../cli/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  name: "NOWPayments",
  description: "Dostawca płatności kryptowalutowych z obsługą subskrypcji",

  cli: cliTranslations,

  errors: {
    userNotFound: {
      title: "Użytkownik nie znaleziony",
      description: "Nie można znaleźć określonego użytkownika",
    },
    customerCreationFailed: {
      title: "Tworzenie klienta nie powiodło się",
      description: "Nie udało się utworzyć klienta NOWPayments: {error}",
    },
    productNotFound: {
      title: "Produkt nie znaleziony",
      description: "Nie można znaleźć określonego produktu: {productId}",
    },
    userEmailRequired: {
      title: "Wymagany e-mail użytkownika",
      description: "E-mail użytkownika jest wymagany dla subskrypcji: {userId}",
    },
    checkoutCreationFailed: {
      title: "Tworzenie checkout nie powiodło się",
      description: "Nie udało się utworzyć sesji checkout NOWPayments: {error}",
    },
    invoiceCreationFailed: {
      title: "Tworzenie faktury nie powiodło się",
      description: "Nie udało się utworzyć faktury NOWPayments: {error}",
    },
    invalidApiKey: {
      title: "Nieprawidłowy klucz API",
      description:
        "Nieprawidłowy klucz API NOWPayments. Sprawdź swoją konfigurację i upewnij się, że masz prawidłowy klucz API z https://nowpayments.io/app/dashboard",
    },
    planCreationFailed: {
      title: "Tworzenie planu nie powiodło się",
      description:
        "Nie udało się utworzyć planu subskrypcji NOWPayments: {error}",
    },
    subscriptionCreationFailed: {
      title: "Tworzenie subskrypcji nie powiodło się",
      description: "Nie udało się utworzyć subskrypcji NOWPayments: {error}",
    },
    subscriptionRetrievalFailed: {
      title: "Pobieranie subskrypcji nie powiodło się",
      description: "Nie udało się pobrać subskrypcji NOWPayments: {error}",
    },
    subscriptionCancellationFailed: {
      title: "Anulowanie subskrypcji nie powiodło się",
      description: "Nie udało się anulować subskrypcji NOWPayments: {error}",
    },
    subscriptionListFailed: {
      title: "Pobieranie listy subskrypcji nie powiodło się",
      description:
        "Nie udało się pobrać listy subskrypcji NOWPayments: {error}",
    },
    webhookVerificationFailed: {
      title: "Weryfikacja webhooka nie powiodła się",
      description:
        "Nie udało się zweryfikować podpisu webhooka NOWPayments: {error}",
    },
    paymentStatusFailed: {
      title: "Pobieranie statusu płatności nie powiodło się",
      description:
        "Nie udało się pobrać statusu płatności z NOWPayments: {error}",
    },
  },

  success: {
    invoiceCreated: {
      title: "Faktura utworzona",
      description: "Faktura NOWPayments utworzona pomyślnie",
    },
    webhookVerified: {
      title: "Webhook zweryfikowany",
      description: "Webhook NOWPayments zweryfikowany pomyślnie",
    },
    paymentStatusRetrieved: {
      title: "Status płatności pobrany",
      description: "Status płatności NOWPayments pobrany pomyślnie",
    },
  },
};
