import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "accountSettings",
  adminPathPrefixes: ["user", "api-keys"],
  group: "platform",
  icon: "user",
  order: 99,
  label: {
    "en-US": "My account",
    "de-DE": "Mein Konto",
    "pl-PL": "Moje konto",
    "fr-FR": "Mon compte",
    "it-IT": "Il mio account",
    "es-ES": "Mi cuenta",
    "sk-SK": "Môj účet",
    "en-GLOBAL": "My account",
  },
  description: {
    "en-US": "Manage your profile, sign-in, billing and API keys.",
    "de-DE":
      "Verwalten Sie Ihr Profil, Ihre Anmeldung, Ihre Abrechnung und Ihre API-Schlüssel.",
    "pl-PL": "Zarządzaj profilem, logowaniem, rozliczeniami i kluczami API.",
    "fr-FR":
      "Gérez votre profil, vos accès, votre facturation et vos clés API.",
    "it-IT": "Gestisca il profilo, l’accesso, la fatturazione e le chiavi API.",
    "es-ES": "Gestione su perfil, el acceso, la facturación y sus claves API.",
    "sk-SK": "Spravujte svoj profil, prihlasovanie, fakturáciu a kľúče API.",
    "en-GLOBAL": "Manage your profile, sign-in, billing and API keys.",
  },
  landing: {
    destinations: [
      "user-me",
      "user-sessions",
      "subscription_GET",
      "payment_GET",
      "user_private_me_addresses_GET",
      "api-keys",
    ],
    destinationDescriptions: {
      "user-me": {
        "en-US": "Edit your name, email and profile details.",
        "en-GLOBAL": "Edit your name, email and profile details.",
        "de-DE": "Name, E-Mail und Profildaten bearbeiten.",
        "pl-PL": "Edytuj imię, e-mail i dane profilu.",
        "fr-FR": "Modifiez votre nom, votre e-mail et votre profil.",
        "it-IT": "Modifichi nome, email e dati del profilo.",
        "es-ES": "Edite su nombre, correo y datos de perfil.",
        "sk-SK": "Upravte meno, e-mail a údaje profilu.",
      },
      "user-sessions": {
        "en-US":
          "See signed-in devices and sign out the ones you do not trust.",
        "en-GLOBAL":
          "See signed-in devices and sign out the ones you do not trust.",
        "de-DE": "Angemeldete Geräte sehen und unbekannte abmelden.",
        "pl-PL": "Zobacz zalogowane urządzenia i wyloguj te, którym nie ufasz.",
        "fr-FR":
          "Voyez les appareils connectés et déconnectez ceux que vous ne reconnaissez pas.",
        "it-IT":
          "Veda i dispositivi connessi e disconnetta quelli che non riconosce.",
        "es-ES":
          "Vea los dispositivos conectados y cierre la sesión en los que no reconozca.",
        "sk-SK":
          "Pozrite si prihlásené zariadenia a odhláste tie, ktorým nedôverujete.",
      },
      subscription_GET: {
        "en-US": "Check your plan, renewal date and credits.",
        "en-GLOBAL": "Check your plan, renewal date and credits.",
        "de-DE": "Tarif, Verlängerungsdatum und Credits prüfen.",
        "pl-PL": "Sprawdź plan, datę odnowienia i kredyty.",
        "fr-FR":
          "Vérifiez votre offre, la date de renouvellement et vos crédits.",
        "it-IT": "Controlli piano, data di rinnovo e crediti.",
        "es-ES": "Consulte su plan, la fecha de renovación y sus créditos.",
        "sk-SK": "Skontrolujte plán, dátum obnovenia a kredity.",
      },
      payment_GET: {
        "en-US": "Your most recent payments and their status.",
        "en-GLOBAL": "Your most recent payments and their status.",
        "de-DE": "Ihre letzten Zahlungen und deren Status.",
        "pl-PL": "Twoje ostatnie płatności i ich status.",
        "fr-FR": "Vos derniers paiements et leur statut.",
        "it-IT": "I suoi ultimi pagamenti e il loro stato.",
        "es-ES": "Sus pagos más recientes y su estado.",
        "sk-SK": "Vaše posledné platby a ich stav.",
      },
      user_private_me_addresses_GET: {
        "en-US": "Set the billing address printed on your invoices.",
        "en-GLOBAL": "Set the billing address printed on your invoices.",
        "de-DE": "Rechnungsadresse für Ihre Rechnungen festlegen.",
        "pl-PL": "Ustaw adres rozliczeniowy widoczny na fakturach.",
        "fr-FR": "Définissez l’adresse imprimée sur vos factures.",
        "it-IT": "Imposti l’indirizzo di fatturazione delle sue fatture.",
        "es-ES": "Defina la dirección de facturación de sus facturas.",
        "sk-SK": "Nastavte fakturačnú adresu na vašich faktúrach.",
      },
      "api-keys": {
        "en-US": "Create and revoke keys for the API.",
        "en-GLOBAL": "Create and revoke keys for the API.",
        "de-DE": "Schlüssel für die API erstellen und widerrufen.",
        "pl-PL": "Twórz i unieważniaj klucze do API.",
        "fr-FR": "Créez et révoquez vos clés d’API.",
        "it-IT": "Crei e revochi le chiavi per l’API.",
        "es-ES": "Cree y revoque claves para la API.",
        "sk-SK": "Vytvárajte a rušte kľúče k API.",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: USER_ME_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    billing: {
      icon: "credit-card",
      order: 1,
      adminPaths: [
        "payment",
        "payment/checkout",
        "payment/portal",
        "subscription",
        "subscription/create",
        "subscription/update",
        "subscription/cancel",
      ],
      label: {
        "en-US": "Billing",
        "de-DE": "Abrechnung",
        "pl-PL": "Rozliczenia",
        "fr-FR": "Facturation",
        "it-IT": "Fatturazione",
        "es-ES": "Facturación",
        "sk-SK": "Fakturácia",
        "en-GLOBAL": "Billing",
      },
    },
  },
};
