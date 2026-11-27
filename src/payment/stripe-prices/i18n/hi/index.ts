import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "पेमेंट",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Stripe प्राइस पक्के करें",
    titleShort: "Stripe प्राइस",
    description:
      "जुड़े Stripe अकाउंट में हर प्लान और क्रेडिट पैक का प्राइस (हर करेंसी और भाषा के लिए) बनाएँ, लुकअप key से ढूँढकर। बार-बार चलाना सुरक्षित है, .env में कोई price id नहीं। ड्राई रन दिखाता है क्या मौजूद है और क्या नहीं।",
    fields: {
      dryRun: {
        label: "ड्राई रन",
        description: "बिना कुछ बनाए प्राइस की सूची दिखाएँ",
      },
    },
    response: {
      dryRun: "ड्राई रन",
      stripeMode: "Stripe मोड",
      existing: "पहले से मौजूद",
      created: "अभी बने",
      missing: "ग़ायब",
      prices: "प्राइस",
      lookupKey: "लुकअप key",
      priceId: "प्राइस ID",
      productId: "प्रोडक्ट ID",
      amount: "रकम",
      status: "स्थिति",
    },
    widget: {
      hint: "प्राइस बदलने के बाद हर Stripe अकाउंट पर एक बार चलाएँ। चेकआउट भी पहले इस्तेमाल पर ग़ायब प्राइस बना देता है।",
      submit: "प्राइस पक्के करें",
      summary:
        "Stripe {{mode}}: {{existing}} मौजूद, {{created}} बने, {{missing}} ग़ायब",
    },
  },
  errors: {
    validation: {
      title: "इनपुट गलत है",
      description: "रिक्वेस्ट जाँचें",
    },
    unauthorized: {
      title: "साइन इन नहीं है",
      description: "एडमिन के रूप में साइन इन करें",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन",
      description: "सिर्फ़ एडमिन Stripe प्राइस मैनेज कर सकते हैं",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रिसोर्स नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "इस बीच Stripe में बदलाव हुआ, फिर चलाएँ",
    },
    server: {
      title: "सर्वर एरर",
      description: "Stripe प्राइस पक्के नहीं किए जा सके",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "रिक्वेस्ट सर्वर तक नहीं पहुँची",
    },
    unknown: {
      title: "अनजान एरर",
      description: "कुछ अप्रत्याशित फ़ेल हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले अपने बदलाव सेव करें या छोड़ दें",
    },
    notConfigured: "Stripe कॉन्फ़िगर नहीं है (STRIPE_SECRET_KEY ग़ायब)",
  },
  success: {
    title: "हो गया",
    description: "Stripe प्राइस जाँचे गए",
  },
};
