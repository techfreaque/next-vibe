import type { subscriptionsTranslations as EnglishSubscriptionsTranslations } from "../../../en/sections/subscriptions";
import { adminTranslations } from "./admin";
import { billingIntervalsTranslations } from "./billingIntervals";
import { cancellationReasonsTranslations } from "./cancellationReasons";
import { createTranslations } from "./create";
import { errorsTranslations } from "./errors";
import { fieldsTranslations } from "./fields";
import { formTranslations } from "./form";
import { listTranslations } from "./list";
import { listApiTranslations } from "./listApi";
import { messagesTranslations } from "./messages";
import { plansTranslations } from "./plans";
import { statusTranslations } from "./status";
import { subscriptionTranslations } from "./subscription";

export const subscriptionsTranslations: typeof EnglishSubscriptionsTranslations =
  {
    admin: adminTranslations,
    billingIntervals: billingIntervalsTranslations,
    cancellationReasons: cancellationReasonsTranslations,
    create: createTranslations,
    errors: errorsTranslations,
    fields: fieldsTranslations,
    form: formTranslations,
    list: listTranslations,
    listApi: listApiTranslations,
    messages: messagesTranslations,
    plans: plansTranslations,
    status: statusTranslations,
    subscription: subscriptionTranslations,
  };
