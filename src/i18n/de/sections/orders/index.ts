import type { ordersTranslations as EnglishOrdersTranslations } from "../../../en/sections/orders";
import { emailTranslations } from "./email";
import { errorsTranslations } from "./errors";
import { errorTypesTranslations } from "./errorTypes";
import { smsTranslations } from "./sms";
import { successTranslations } from "./success";

export const ordersTranslations: typeof EnglishOrdersTranslations = {
  email: emailTranslations,
  errors: errorsTranslations,
  errorTypes: errorTypesTranslations,
  sms: smsTranslations,
  success: successTranslations,
};
