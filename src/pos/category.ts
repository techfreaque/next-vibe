/**
 * Category definition for the Point of Sale module.
 * Covers orders, sessions, and terminal management.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { POS_DASHBOARD_ALIAS } from "@/pos/dashboard/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "pos",
  label: {
    "en-US": "Point of Sale",
    "en-GLOBAL": "Point of Sale",
    "de-DE": "Kasse",
    "pl-PL": "Punkt sprzedaży",
    "fr-FR": "Point de vente",
    "it-IT": "Punto vendita",
    "es-ES": "Punto de venta",
    "sk-SK": "Predajné miesto",
    "hi-IN": "POS",
  },
  description: {
    "en-US": "Open a till, record sales and close the shift.",
    "en-GLOBAL": "Open a till, record sales and close the shift.",
    "de-DE":
      "Öffnen Sie die Kasse, erfassen Sie Verkäufe und schließen Sie die Schicht ab.",
    "pl-PL": "Otwórz kasę, zarejestruj sprzedaż i zamknij zmianę.",
    "fr-FR":
      "Ouvrez une caisse, enregistrez les ventes et clôturez le service.",
    "it-IT": "Apra la cassa, registri le vendite e chiuda il turno.",
    "es-ES": "Abra la caja, registre ventas y cierre el turno.",
    "sk-SK": "Otvorte pokladnicu, zaevidujte predaj a uzavrite zmenu.",
    "hi-IN": "काउंटर खोलें, बिक्री दर्ज करें और शिफ़्ट बंद करें।",
  },
  group: "business",
  icon: "shopping-cart",
  order: 45,
  createActions: ["pos_terminal_create_POST"],
  landing: {
    overview: { alias: "pos-dashboard", scope: "company" },
    destinations: ["pos-order-list", "pos-terminals", "products-catalog-list"],
    actions: ["pos_order_create_POST", "pos_terminal_create_POST"],
    destinationDescriptions: {
      "pos-order-list": {
        "en-US": "Till sales by terminal, session and status.",
        "en-GLOBAL": "Till sales by terminal, session and status.",
        "de-DE": "Kassenverkäufe nach Kasse, Schicht und Status.",
        "pl-PL": "Sprzedaż kasowa według kasy, zmiany i statusu.",
        "fr-FR": "Ventes en caisse par terminal, session et statut.",
        "it-IT": "Vendite in cassa per terminale, sessione e stato.",
        "es-ES": "Ventas en caja por terminal, sesión y estado.",
        "sk-SK": "Predaje v pokladni podľa terminálu, zmeny a stavu.",
        "hi-IN": "टर्मिनल, सेशन और स्टेटस के हिसाब से काउंटर बिक्री।",
      },
      "pos-terminals": {
        "en-US": "Tills and devices that take payments.",
        "en-GLOBAL": "Tills and devices that take payments.",
        "de-DE": "Kassen und Geräte, die Zahlungen annehmen.",
        "pl-PL": "Kasy i urządzenia przyjmujące płatności.",
        "fr-FR": "Caisses et appareils qui encaissent les paiements.",
        "it-IT": "Casse e dispositivi che incassano i pagamenti.",
        "es-ES": "Cajas y dispositivos que cobran los pagos.",
        "sk-SK": "Pokladne a zariadenia, ktoré prijímajú platby.",
        "hi-IN": "पेमेंट लेने वाले काउंटर और डिवाइस।",
      },
      "products-catalog-list": {
        "en-US": "The products your tills can sell.",
        "en-GLOBAL": "The products your tills can sell.",
        "de-DE": "Die Produkte, die Ihre Kassen verkaufen können.",
        "pl-PL": "Produkty, które mogą sprzedawać twoje kasy.",
        "fr-FR": "Les produits que vos caisses peuvent vendre.",
        "it-IT": "I prodotti che le sue casse possono vendere.",
        "es-ES": "Los productos que pueden vender sus cajas.",
        "sk-SK": "Produkty, ktoré môžu vaše pokladne predávať.",
        "hi-IN": "वे प्रोडक्ट जो आपके काउंटर बेच सकते हैं।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: POS_DASHBOARD_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "POS: Orders": {
      icon: "shopping-bag",
      order: 0,
      label: {
        "en-US": "Orders",
        "en-GLOBAL": "Orders",
        "de-DE": "Bestellungen",
        "pl-PL": "Zamówienia",
        "fr-FR": "Commandes",
        "it-IT": "Ordini",
        "es-ES": "Pedidos",
        "sk-SK": "Objednávky",
        "hi-IN": "ऑर्डर",
      },
    },
    "POS: Sessions": {
      icon: "clock",
      order: 1,
      label: {
        "en-US": "Sessions",
        "en-GLOBAL": "Sessions",
        "de-DE": "Sitzungen",
        "pl-PL": "Sesje",
        "fr-FR": "Sessions",
        "it-IT": "Sessioni",
        "es-ES": "Sesiones",
        "sk-SK": "Pokladničné zmeny",
        "hi-IN": "सेशन",
      },
    },
    "POS: Terminals": {
      icon: "monitor",
      order: 2,
      label: {
        "en-US": "Terminals",
        "en-GLOBAL": "Terminals",
        "de-DE": "Terminals",
        "pl-PL": "Terminale",
        "fr-FR": "Terminaux",
        "it-IT": "Terminali",
        "es-ES": "Terminales",
        "sk-SK": "Terminály",
        "hi-IN": "टर्मिनल",
      },
    },
    "POS: Products": {
      icon: "package",
      order: 3,
      label: {
        "en-US": "Products",
        "en-GLOBAL": "Products",
        "de-DE": "Produkte",
        "pl-PL": "Produkty",
        "fr-FR": "Produits",
        "it-IT": "Prodotti",
        "es-ES": "Productos",
        "sk-SK": "Produkty",
        "hi-IN": "प्रोडक्ट",
      },
    },
  },
};
