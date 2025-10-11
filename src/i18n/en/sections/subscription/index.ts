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

export const subscriptionTranslations = {
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
  title: "Subscription",
  description: "Manage your subscription plan and billing cycle",
  currentPlan: "Current Plan",
  billingCycle: "Billing Cycle",
  nextBilling: "Next billing date",
  noBillingDate: "No billing date available",
  planFeatures: "Plan Features",
  noSubscription: "No active subscription",
  chooseAPlan: "Choose a subscription plan to get started",
  starterFeatures: "Starter Plan Features",
  cancellationPending: "Subscription Cancellation Pending",
  accessUntil: "You'll have access until",
};
