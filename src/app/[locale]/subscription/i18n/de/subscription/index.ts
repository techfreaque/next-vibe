import type { translations as enTranslations } from "../../en/subscription";
import { translations as actionsTranslations } from "./actions";
import { translations as billingTranslations } from "./billing";
import { translations as cancellationTranslations } from "./cancellation";
import { translations as checkoutTranslations } from "./checkout";
import { translations as currentTranslations } from "./current";
import { translations as downgradeTranslations } from "./downgrade";
import { translations as emailTranslations } from "./email";
import { translations as errorsTranslations } from "./errors";
import { translations as featuresTranslations } from "./features";
import { translations as invoiceStatusTranslations } from "./invoiceStatus";
import { translations as messagesTranslations } from "./messages";
import { translations as noActiveTranslations } from "./noActive";
import { translations as plansTranslations } from "./plans";
import { translations as reactivationTranslations } from "./reactivation";
import { translations as statusTranslations } from "./status";
import { translations as tabsTranslations } from "./tabs";
import { translations as timeTranslations } from "./time";
import { translations as updateTranslations } from "./update";

export const translations: typeof enTranslations = {
  actions: actionsTranslations,
  billing: billingTranslations,
  cancellation: cancellationTranslations,
  checkout: checkoutTranslations,
  current: currentTranslations,
  downgrade: downgradeTranslations,
  email: emailTranslations,
  errors: errorsTranslations,
  features: featuresTranslations,
  invoiceStatus: invoiceStatusTranslations,
  messages: messagesTranslations,
  noActive: noActiveTranslations,
  plans: plansTranslations,
  reactivation: reactivationTranslations,
  status: statusTranslations,
  tabs: tabsTranslations,
  time: timeTranslations,
  update: updateTranslations,
  // Legacy tier-based
  currentPlan: "Aktueller Plan",
  billingCycle: "Abrechnungszyklus",
  nextBilling: "Nächstes Abrechnungsdatum",
  noBillingDate: "Kein Abrechnungsdatum verfügbar",
  planFeatures: "Plan-Features",
  noSubscription: "Kein aktives Abonnement",
  chooseAPlan: "Wählen Sie einen Abonnementplan, um zu beginnen",
  starterFeatures: "Starter Plan Features",
  cancellationPending: "Abonnement-Kündigung ausstehend",
  accessUntil: "Sie haben Zugang bis",
  // New credit-based system
  title: "Guthaben",
  description: "Verwalten Sie Ihre Guthaben und Abonnements",
  balance: {
    title: "Guthaben-Saldo",
    description: "Ihre verfügbaren Guthaben für KI-Gespräche",
    total: "Guthaben",
    expiring: {
      title: "Ablaufende Guthaben",
      description: "Aus Abonnement",
    },
    permanent: {
      title: "Permanente Guthaben",
      description: "Laufen nie ab",
    },
    free: {
      title: "Gratis Guthaben",
      description: "Kostenlose Stufe",
    },
    nextExpiration: "Nächstes Ablaufdatum",
  },
  overview: {
    howItWorks: {
      title: "Wie Guthaben funktionieren",
      description: "Verstehen Sie Ihr Guthaben-System",
      expiring: {
        title: "Ablaufende Guthaben",
        description:
          "Guthaben aus monatlichen Abonnements laufen am Ende jedes Abrechnungszeitraums ab. Nutzen Sie sie, bevor sie ablaufen!",
      },
      permanent: {
        title: "Permanente Guthaben",
        description:
          "In Paketen gekaufte Guthaben laufen nie ab. Einmal kaufen, jederzeit nutzen. Perfekt für gelegentliche Nutzer.",
      },
      free: {
        title: "Gratis Guthaben",
        description:
          "Jeder erhält 20 kostenlose Guthaben, um unseren Service zu testen. Starten Sie sofort mit KI-Chats!",
      },
    },
    costs: {
      title: "Guthaben-Kosten",
      description: "Sehen Sie, wie viel jede Funktion kostet",
      models: {
        title: "KI-Modelle (pro Nachricht)",
        gpt4: "GPT-4",
        claude: "Claude Sonnet",
        gpt35: "GPT-3.5",
        llama: "Llama 3",
        cost: "{{count}} Guthaben",
      },
      features: {
        title: "Funktionen",
        search: "Brave-Suche",
        tts: "Text-zu-Sprache",
        stt: "Sprache-zu-Text",
        searchCost: "+1 Guthaben",
        audioCost: "1 Guthaben/Min",
      },
    },
  },
  buy: {
    subscription: {
      badge: "Bester Wert",
      title: "Monats-Abo",
      description: "1000 Guthaben pro Monat (laufen monatlich ab)",
      perMonth: "/Monat",
      features: {
        credits: "1000 Guthaben jeden Monat",
        expiry: "Guthaben laufen am Ende des Abrechnungszeitraums ab",
        bestFor: "Am besten für regelmäßige Nutzer",
      },
      button: "Jetzt abonnieren",
    },
    pack: {
      title: "Guthaben-Paket",
      description: "500 Guthaben pro Paket (laufen nie ab)",
      perPack: "/Paket",
      features: {
        credits: "500 permanente Guthaben",
        expiry: "Guthaben laufen nie ab",
        bestFor: "Am besten für gelegentliche Nutzer",
      },
      quantity: "Menge",
      total: "{{count}} Guthaben gesamt",
      totalPrice: "Gesamt: {{price}}",
      button: "{{count}} {{type}} kaufen",
      pack: "Paket",
      packs: "Pakete",
    },
  },
  history: {
    title: "Transaktionsverlauf",
    description: "Ihre letzten Guthaben-Transaktionen",
    empty: {
      title: "Noch keine Transaktionen",
      description: "Ihr Guthaben-Transaktionsverlauf wird hier angezeigt",
    },
    balance: "Saldo: {{count}}",
    loadMore: "Mehr laden",
    types: {
      purchase: "Kauf",
      subscription: "Abonnement",
      usage: "Nutzung",
      expiry: "Ablauf",
      free_tier: "Kostenlose Stufe",
    },
  },
};
