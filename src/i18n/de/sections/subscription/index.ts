import type { subscriptionTranslations as EnglishSubscriptionTranslations } from "../../../en/sections/subscription";
import { actionsTranslations } from "./actions";
import { billingTranslations } from "./billing";
import { cancellationTranslations } from "./cancellation";
import { checkoutTranslations } from "./checkout";
import { currentTranslations } from "./current";
import { downgradeTranslations } from "./downgrade";
import { emailTranslations } from "./email";
import { errorsTranslations } from "./errors";
import { featuresTranslations } from "./features";
import { invoiceStatusTranslations } from "./invoiceStatus";
import { messagesTranslations } from "./messages";
import { noActiveTranslations } from "./noActive";
import { plansTranslations } from "./plans";
import { reactivationTranslations } from "./reactivation";
import { statusTranslations } from "./status";
import { tabsTranslations } from "./tabs";
import { timeTranslations } from "./time";
import { updateTranslations } from "./update";

export const subscriptionTranslations: typeof EnglishSubscriptionTranslations =
  {
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
    title: "Abonnement",
    description: "Verwalten Sie Ihren Abonnementplan und Abrechnungszyklus",
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
  };
