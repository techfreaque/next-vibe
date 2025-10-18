import type { translations as enTranslations } from "../../en/paymentErrors";
import { translations as invoiceTranslations } from "./invoice";
import { translations as paymentTranslations } from "./payment";
import { translations as portalTranslations } from "./portal";
import { translations as refundTranslations } from "./refund";

export const translations: typeof enTranslations = {
  invoice: invoiceTranslations,
  payment: paymentTranslations,
  portal: portalTranslations,
  refund: refundTranslations,
};
