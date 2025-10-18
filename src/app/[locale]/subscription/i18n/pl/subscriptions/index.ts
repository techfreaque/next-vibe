import type { translations as enTranslations } from "../../en/subscriptions";
import { translations as adminTranslations } from "./admin";
import { translations as billingIntervalsTranslations } from "./billingIntervals";
import { translations as cancellationReasonsTranslations } from "./cancellationReasons";
import { translations as createTranslations } from "./create";
import { translations as errorsTranslations } from "./errors";
import { translations as fieldsTranslations } from "./fields";
import { translations as formTranslations } from "./form";
import { translations as listTranslations } from "./list";
import { translations as listApiTranslations } from "./listApi";
import { translations as messagesTranslations } from "./messages";
import { translations as plansTranslations } from "./plans";
import { translations as statusTranslations } from "./status";
import { translations as subscriptionTranslations } from "./subscription";

export const translations: typeof enTranslations = {
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
