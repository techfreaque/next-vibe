import type { emailTranslations as EnglishEmailTranslations } from "../../../../en/sections/orders/email";
import { errorTranslations } from "./error";
import { ordersTranslations } from "./orders";

export const emailTranslations: typeof EnglishEmailTranslations = {
  error: errorTranslations,
  orders: ordersTranslations,
};
