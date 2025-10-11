import type { paymentErrorsTranslations as EnglishPaymentErrorsTranslations } from "../../../en/sections/paymentErrors";
import { invoiceTranslations } from "./invoice";
import { paymentTranslations } from "./payment";
import { portalTranslations } from "./portal";
import { refundTranslations } from "./refund";

export const paymentErrorsTranslations: typeof EnglishPaymentErrorsTranslations =
  {
    invoice: invoiceTranslations,
    payment: paymentTranslations,
    portal: portalTranslations,
    refund: refundTranslations,
  };
