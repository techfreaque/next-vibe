import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "outreachCRM",
  label: {
    "en-US": "Outreach and deals",
    "de-DE": "Ansprache und Kooperationen",
    "pl-PL": "Kontakty i współprace",
    "fr-FR": "Prospection et partenariats",
    "it-IT": "Contatti e collaborazioni",
    "es-ES": "Prospección y colaboraciones",
    "sk-SK": "Oslovovanie a spolupráce",
    "hi-IN": "आउटरीच और डील",
    "en-GLOBAL": "Outreach and deals",
  },
  description: {
    "en-US": "Track creator deals, campaign links and marketing costs.",
    "de-DE": "Verfolgen Sie Kooperationen, Kampagnenlinks und Marketingkosten.",
    "pl-PL":
      "Śledź współprace z twórcami, linki kampanii i koszty marketingowe.",
    "fr-FR":
      "Suivez les partenariats, les liens de campagne et les dépenses marketing.",
    "it-IT":
      "Segua gli accordi con i creator, i link delle campagne e i costi di marketing.",
    "es-ES":
      "Siga los acuerdos con creadores, los enlaces de campañas y los costes de marketing.",
    "sk-SK":
      "Sledujte spolupráce s tvorcami, odkazy kampaní a marketingové náklady.",
    "hi-IN": "क्रिएटर डील, कैंपेन लिंक और मार्केटिंग खर्च ट्रैक करें।",
    "en-GLOBAL": "Track creator deals, campaign links and marketing costs.",
  },
  group: "analytics",
  icon: "target",
  order: 2,
  adminPathPrefixes: ["leads/outreach", "leads/growth"],
  landing: {
    destinations: [
      "outreach-crm",
      "growth-campaign-links",
      "growth-channel-spend-list",
    ],
    destinationDescriptions: {
      "outreach-crm": {
        "en-US":
          "Every contact pitched, where each stands and what deals paid back.",
        "en-GLOBAL":
          "Every contact pitched, where each stands and what deals paid back.",
        "de-DE":
          "Jeder angefragte Kontakt, sein Stand und was die Deals eingebracht haben.",
        "pl-PL":
          "Każdy kontakt, do którego pisaliśmy, jego etap i zwrot z umów.",
        "fr-FR":
          "Chaque contact sollicité, son statut et ce que les accords ont rapporté.",
        "it-IT":
          "Ogni contatto proposto, a che punto è e cosa hanno reso gli accordi.",
        "es-ES":
          "Cada contacto propuesto, en qué punto está y qué devolvieron los acuerdos.",
        "sk-SK": "Každý oslovený kontakt, jeho stav a čo dohody priniesli.",
        "hi-IN":
          "हर संपर्क जिसे पिच किया गया, उसकी स्थिति और किन डील से पैसा वापस आया।",
      },
      "growth-campaign-links": {
        "en-US": "Tagged links per channel with visits, signups and payers.",
        "en-GLOBAL":
          "Tagged links per channel with visits, signups and payers.",
        "de-DE":
          "Getaggte Links je Kanal mit Besuchen, Anmeldungen und Zahlern.",
        "pl-PL":
          "Oznaczone linki według kanału z wizytami, rejestracjami i płacącymi.",
        "fr-FR":
          "Liens tagués par canal, avec visites, inscriptions et payeurs.",
        "it-IT": "Link tracciati per canale, con visite, iscrizioni e paganti.",
        "es-ES":
          "Enlaces etiquetados por canal, con visitas, registros y pagadores.",
        "sk-SK":
          "Označené odkazy podľa kanála s návštevami, registráciami a platiacimi.",
        "hi-IN": "हर चैनल के टैग किए लिंक, विज़िट, साइनअप और पेमेंट करने वालों के साथ।",
      },
      "growth-channel-spend-list": {
        "en-US": "Spend per channel and the cost of each paying user.",
        "en-GLOBAL": "Spend per channel and the cost of each paying user.",
        "de-DE": "Ausgaben je Kanal und Kosten pro zahlendem Nutzer.",
        "pl-PL": "Wydatki na kanał i koszt pozyskania płacącego użytkownika.",
        "fr-FR": "Dépenses par canal et coût de chaque utilisateur payant.",
        "it-IT": "Spesa per canale e costo di ogni utente pagante.",
        "es-ES": "Gasto por canal y coste de cada usuario de pago.",
        "sk-SK": "Výdavky podľa kanála a cena každého platiaceho používateľa.",
        "hi-IN": "हर चैनल का खर्च और हर पेमेंट करने वाले यूज़र की लागत।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "outreach-crm",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};
