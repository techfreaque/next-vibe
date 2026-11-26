/**
 * Category definition for the Credits module.
 * Covers credit balance, history, purchases, grants, and admin operations.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { CREDIT_USAGE_REPORT_ALIAS } from "./analytics/usage/constants";
import { CREDITS_ALIAS } from "./constants";

export const category: CategoryDefinition = {
  key: "credits",
  label: {
    "en-US": "Credits",
    "en-GLOBAL": "Credits",
    "de-DE": "Guthaben",
    "pl-PL": "Środki",
    "fr-FR": "Crédits",
    "it-IT": "Crediti",
    "es-ES": "Créditos",
    "sk-SK": "Kredity",
  },
  description: {
    "en-US": "Review credit purchases, balances and usage.",
    "en-GLOBAL": "Review credit purchases, balances and usage.",
    "de-DE": "Prüfen Sie Guthabenkäufe, Salden und Verbrauch.",
    "pl-PL": "Sprawdź zakupione środki, salda i zużycie.",
    "fr-FR": "Consultez les achats de crédits, les soldes et la consommation.",
    "it-IT": "Consulti gli acquisti di crediti, i saldi e i consumi.",
    "es-ES": "Consulte las compras de créditos, los saldos y el consumo.",
    "sk-SK": "Skontrolujte nákupy kreditov, zostatky a čerpanie.",
  },
  group: "billing",
  icon: "coins",
  order: 15,
  landing: {
    summary: {
      alias: "platform-summary",
      scope: "platform",
      args: { section: "credits" },
      progressive: true,
    },
    destinations: [
      "credit-usage-report",
      "verify-credit-grant",
      "finance-credit-liabilities",
      "anti-farming-report",
      "credits-public-cap",
    ],
    destinationDescriptions: {
      "credit-usage-report": {
        "en-US": "Credit spend by model, feature and provider, with margin.",
        "en-GLOBAL":
          "Credit spend by model, feature and provider, with margin.",
        "de-DE":
          "Credit-Verbrauch nach Modell, Funktion und Anbieter, mit Marge.",
        "pl-PL": "Wydatki kredytów według modelu, funkcji i dostawcy, z marżą.",
        "fr-FR":
          "Dépense de crédits par modèle, fonction et fournisseur, avec la marge.",
        "it-IT":
          "Spesa di crediti per modello, funzione e fornitore, con margine.",
        "es-ES":
          "Gasto de créditos por modelo, función y proveedor, con margen.",
        "sk-SK":
          "Spotreba kreditov podľa modelu, funkcie a poskytovateľa vrátane marže.",
      },
      "verify-credit-grant": {
        "en-US": "Find an account and give it bonus credits.",
        "en-GLOBAL": "Find an account and give it bonus credits.",
        "de-DE": "Konto suchen und Bonus-Credits gutschreiben.",
        "pl-PL": "Znajdź konto i przyznaj mu kredyty bonusowe.",
        "fr-FR": "Trouvez un compte et attribuez-lui des crédits bonus.",
        "it-IT": "Trovi un account e gli assegni crediti bonus.",
        "es-ES": "Busque una cuenta y concédale créditos de bonificación.",
        "sk-SK": "Nájdite účet a prideľte mu bonusové kredity.",
      },
      "finance-credit-liabilities": {
        "en-US": "Paid credits customers have not used yet.",
        "en-GLOBAL": "Paid credits customers have not used yet.",
        "de-DE": "Bezahlte Credits, die Kunden noch nicht genutzt haben.",
        "pl-PL": "Opłacone kredyty, których klienci jeszcze nie wykorzystali.",
        "fr-FR": "Crédits payés que les clients n’ont pas encore utilisés.",
        "it-IT": "Crediti pagati che i clienti non hanno ancora usato.",
        "es-ES": "Créditos pagados que los clientes aún no han usado.",
        "sk-SK": "Zaplatené kredity, ktoré zákazníci ešte nevyužili.",
      },
      "anti-farming-report": {
        "en-US": "Networks and email domains farming free credits.",
        "en-GLOBAL": "Networks and email domains farming free credits.",
        "de-DE": "Netze und E-Mail-Domains, die Gratis-Credits abgreifen.",
        "pl-PL": "Sieci i domeny e-mail, które wyłudzają darmowe kredyty.",
        "fr-FR":
          "Réseaux et domaines e-mail qui exploitent les crédits gratuits.",
        "it-IT": "Reti e domini email che sfruttano i crediti gratuiti.",
        "es-ES":
          "Redes y dominios de correo que explotan los créditos gratuitos.",
        "sk-SK":
          "Siete a e-mailové domény, ktoré zneužívajú bezplatné kredity.",
      },
      "credits-public-cap": {
        "en-US": "Today’s free-tier spend against the global cap.",
        "en-GLOBAL": "Today’s free-tier spend against the global cap.",
        "de-DE": "Heutiger Gratis-Verbrauch im Vergleich zum globalen Limit.",
        "pl-PL": "Dzisiejsze zużycie darmowego planu na tle globalnego limitu.",
        "fr-FR": "Dépense gratuite du jour face au plafond global.",
        "it-IT": "Spesa gratuita di oggi rispetto al limite globale.",
        "es-ES": "Gasto gratuito de hoy frente al límite global.",
        "sk-SK": "Dnešná spotreba bezplatnej úrovne oproti globálnemu limitu.",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: CREDIT_USAGE_REPORT_ALIAS,
    [UserPermissionRole.CUSTOMER]: CREDITS_ALIAS,
    [UserPermissionRole.PUBLIC]: CREDITS_ALIAS,
  },
  subcategories: {
    Credits: {
      icon: "coins",
      order: 0,
      label: {
        "en-US": "Credits",
        "en-GLOBAL": "Credits",
        "de-DE": "Guthaben",
        "pl-PL": "Środki",
        "fr-FR": "Crédits",
        "it-IT": "Crediti",
        "es-ES": "Créditos",
        "sk-SK": "Kredity",
      },
      // inherits parent defaultEntry (credits-balance)
    },
    Management: {
      icon: "shield",
      order: 1,
      label: {
        "en-US": "Management",
        "en-GLOBAL": "Management",
        "de-DE": "Verwaltung",
        "pl-PL": "Zarządzanie",
        "fr-FR": "Gestion",
        "it-IT": "Gestione",
        "es-ES": "Gestión",
        "sk-SK": "Správa",
      },
    },
  },
};
