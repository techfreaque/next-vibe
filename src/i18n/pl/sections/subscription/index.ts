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
    title: "Subskrypcja",
    description: "Zarządzaj swoim planem subskrypcji i cyklem rozliczeniowym",
    currentPlan: "Aktualny Plan",
    billingCycle: "Cykl Rozliczeniowy",
    nextBilling: "Następna data rozliczenia",
    noBillingDate: "Brak dostępnej daty rozliczenia",
    planFeatures: "Funkcje Planu",
    noSubscription: "Brak aktywnej subskrypcji",
    chooseAPlan: "Wybierz plan subskrypcji, aby dołączyć",
    starterFeatures: "Funkcje Planu Starter",
    cancellationPending: "Oczekujące Anulowanie Subskrypcji",
    accessUntil: "Będziesz mieć dostęp do",
  };
