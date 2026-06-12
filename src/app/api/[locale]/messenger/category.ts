/**
 * Category definition for the Messenger module.
 * Covers email accounts, inbox, message sending, and provider configuration.
 */

import { MESSENGER_ACCOUNTS_ALIAS } from "@/app/api/[locale]/messenger/accounts/list/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";

export const category: CategoryDefinition = {
  key: "messenger",
  label: {
    "en-US": "Messenger",
    "en-GLOBAL": "Messenger",
    "de-DE": "Messenger",
    "pl-PL": "Komunikator",
  },
  group: "comms",
  icon: "mail",
  order: 10,
  defaultEntry: MESSENGER_ACCOUNTS_ALIAS,
  subcategories: {
    Accounts: {
      icon: "at-sign",
      order: 0,
      label: {
        "en-US": "Accounts",
        "en-GLOBAL": "Accounts",
        "de-DE": "Konten",
        "pl-PL": "Konta",
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
      },
    },
  },
};
