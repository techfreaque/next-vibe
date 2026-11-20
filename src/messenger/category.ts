/**
 * Category definition for the Messenger module.
 * Covers email accounts, inbox, message sending, and provider configuration.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { MESSENGER_ACCOUNTS_ALIAS } from "@/messenger/accounts/list/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "messenger",
  label: {
    "en-US": "Messenger",
    "en-GLOBAL": "Messenger",
    "de-DE": "Messenger",
    "pl-PL": "Komunikator",
    "fr-FR": "Messagerie",
    "it-IT": "Messaggistica",
    "es-ES": "Mensajería",
  },
  group: "comms",
  icon: "mail",
  order: 10,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: MESSENGER_ACCOUNTS_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Accounts: {
      icon: "at-sign",
      order: 0,
      label: {
        "en-US": "Accounts",
        "en-GLOBAL": "Accounts",
        "de-DE": "Konten",
        "pl-PL": "Konta",
        "fr-FR": "Comptes",
        "it-IT": "Account",
        "es-ES": "Cuentas",
      },
      // inherits parent defaultEntry (messenger-accounts)
    },
    Inbox: {
      icon: "inbox",
      order: 1,
      label: {
        "en-US": "Inbox",
        "en-GLOBAL": "Inbox",
        "de-DE": "Posteingang",
        "pl-PL": "Skrzynka odbiorcza",
        "fr-FR": "Boîte de réception",
        "it-IT": "Posta in arrivo",
        "es-ES": "Bandeja de entrada",
      },
    },
    Messages: {
      icon: "mail-open",
      order: 2,
      label: {
        "en-US": "Messages",
        "en-GLOBAL": "Messages",
        "de-DE": "Nachrichten",
        "pl-PL": "Wiadomości",
        "fr-FR": "Messages",
        "it-IT": "Messaggi",
        "es-ES": "Mensajes",
      },
    },
    Providers: {
      icon: "plug",
      order: 3,
      label: {
        "en-US": "Providers",
        "en-GLOBAL": "Providers",
        "de-DE": "Anbieter",
        "pl-PL": "Dostawcy",
        "fr-FR": "Fournisseurs",
        "it-IT": "Fornitori",
        "es-ES": "Proveedores",
      },
    },
  },
};
