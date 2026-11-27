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
    "sk-SK": "Správy",
    "hi-IN": "मैसेंजर",
  },
  description: {
    "en-US": "Manage connected mailboxes and read incoming messages.",
    "en-GLOBAL": "Manage connected mailboxes and read incoming messages.",
    "de-DE":
      "Verwalten Sie verbundene Postfächer und lesen Sie eingehende Nachrichten.",
    "pl-PL": "Zarządzaj połączonymi skrzynkami i czytaj odebrane wiadomości.",
    "fr-FR":
      "Gérez les boîtes mail connectées et consultez les messages reçus.",
    "it-IT":
      "Gestisca le caselle di posta collegate e legga i messaggi ricevuti.",
    "es-ES":
      "Gestione los buzones conectados y consulte los mensajes recibidos.",
    "sk-SK": "Spravujte pripojené schránky a čítajte prijaté správy.",
    "hi-IN": "कनेक्टेड मेलबॉक्स मैनेज करें और आने वाले मैसेज पढ़ें।",
  },
  group: "comms",
  icon: "mail",
  order: 10,
  landing: {
    summary: {
      alias: "platform-summary",
      scope: "platform",
      args: { section: "messenger" },
      progressive: true,
    },
    destinations: [
      "system-mail-inbox",
      "messenger-inbox",
      "messenger-messages",
      "email-stats",
      "messenger-accounts",
    ],
    actions: ["messenger_accounts_create_POST"],
    destinationDescriptions: {
      "system-mail-inbox": {
        "en-US": "Mail sent to the platform address, newest first.",
        "en-GLOBAL": "Mail sent to the platform address, newest first.",
        "de-DE": "Post an die Plattform-Adresse, neueste zuerst.",
        "pl-PL": "Poczta na adres platformy, od najnowszej.",
        "fr-FR":
          "Courrier reçu à l’adresse de la plateforme, le plus récent d’abord.",
        "it-IT":
          "Posta ricevuta all’indirizzo della piattaforma, la più recente per prima.",
        "es-ES":
          "Correo recibido en la dirección de la plataforma, lo más reciente primero.",
        "sk-SK": "Pošta na adresu platformy, najnovšia navrchu.",
        "hi-IN": "प्लेटफ़ॉर्म के पते पर भेजे गए मेल, नए पहले।",
      },
      "messenger-inbox": {
        "en-US": "Read mail in your connected mailboxes.",
        "en-GLOBAL": "Read mail in your connected mailboxes.",
        "de-DE": "Post in verbundenen Postfächern lesen.",
        "pl-PL": "Czytaj pocztę w podłączonych skrzynkach.",
        "fr-FR": "Lisez le courrier de vos boîtes connectées.",
        "it-IT": "Legga la posta delle caselle collegate.",
        "es-ES": "Lea el correo de sus buzones conectados.",
        "sk-SK": "Čítajte poštu v pripojených schránkach.",
        "hi-IN": "अपने कनेक्टेड मेलबॉक्स में मेल पढ़ें।",
      },
      "messenger-messages": {
        "en-US": "Every email the platform sent, searchable and filtered.",
        "en-GLOBAL": "Every email the platform sent, searchable and filtered.",
        "de-DE": "Jede versendete E-Mail, durchsuchbar und filterbar.",
        "pl-PL": "Każdy wysłany e-mail z wyszukiwaniem i filtrami.",
        "fr-FR": "Chaque e-mail envoyé, avec recherche et filtres.",
        "it-IT": "Ogni email inviata, con ricerca e filtri.",
        "es-ES": "Cada correo enviado, con búsqueda y filtros.",
        "sk-SK": "Každý odoslaný e-mail s vyhľadávaním a filtrami.",
        "hi-IN": "प्लेटफ़ॉर्म का भेजा हर ईमेल, सर्च और फ़िल्टर के साथ।",
      },
      "email-stats": {
        "en-US": "Sends, opens, clicks and bounces over time.",
        "en-GLOBAL": "Sends, opens, clicks and bounces over time.",
        "de-DE": "Versand, Öffnungen, Klicks und Bounces im Verlauf.",
        "pl-PL": "Wysyłki, otwarcia, kliknięcia i odbicia w czasie.",
        "fr-FR": "Envois, ouvertures, clics et rebonds dans le temps.",
        "it-IT": "Invii, aperture, clic e rimbalzi nel tempo.",
        "es-ES": "Envíos, aperturas, clics y rebotes a lo largo del tiempo.",
        "sk-SK": "Odoslané, otvorené, kliknutia a nedoručené v čase.",
        "hi-IN": "समय के साथ भेजे, खोले, क्लिक और बाउंस हुए ईमेल।",
      },
      "messenger-accounts": {
        "en-US": "The accounts the platform sends from, on every channel.",
        "en-GLOBAL": "The accounts the platform sends from, on every channel.",
        "de-DE":
          "Die Konten, über die die Plattform sendet, auf allen Kanälen.",
        "pl-PL": "Konta, z których wysyła platforma, na wszystkich kanałach.",
        "fr-FR": "Les comptes d’envoi de la plateforme, sur tous les canaux.",
        "it-IT": "Gli account da cui invia la piattaforma, su ogni canale.",
        "es-ES":
          "Las cuentas desde las que envía la plataforma, en todos los canales.",
        "sk-SK": "Účty, z ktorých platforma posiela, na všetkých kanáloch.",
        "hi-IN": "हर चैनल पर वे अकाउंट जिनसे प्लेटफ़ॉर्म भेजता है।",
      },
    },
  },
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
        "sk-SK": "Účty",
        "hi-IN": "अकाउंट",
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
        "sk-SK": "Doručená pošta",
        "hi-IN": "इनबॉक्स",
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
        "sk-SK": "Správy",
        "hi-IN": "मैसेज",
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
        "sk-SK": "Poskytovatelia",
        "hi-IN": "प्रोवाइडर",
      },
    },
  },
};
