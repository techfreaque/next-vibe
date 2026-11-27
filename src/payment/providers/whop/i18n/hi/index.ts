import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    notConfigured: "Whop से कार्ड भुगतान अभी सेट नहीं है।",
    productNotFound: "यह प्रोडक्ट अभी कार्ड से नहीं खरीदा जा सकता।",
    userNotFound: "अकाउंट नहीं मिला।",
    checkoutFailed: "कार्ड चेकआउट नहीं खुल सका: {{error}}",
    webhookInvalidSignature: "Whop वेबहुक का सिग्नेचर गलत है।",
    webhookInvalidPayload: "Whop वेबहुक पढ़ा नहीं जा सका: {{error}}",
    membershipFailed: "Whop मेंबरशिप लोड नहीं हो सकी: {{error}}",
    cancelFailed: "Whop मेंबरशिप रद्द नहीं हो सकी: {{error}}",
    catalogFailed: "Whop कैटलॉग सिंक नहीं हो सका: {{error}}",
  },
};
