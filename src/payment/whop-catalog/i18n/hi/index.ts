import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "पेमेंट",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Whop कैटलॉग सिंक करें",
    titleShort: "Whop कैटलॉग",
    description:
      "जुड़े Whop अकाउंट में हर प्लान और क्रेडिट पैक बनाता है: हर प्लान का एक प्रोडक्ट, हर अवधि, करेंसी और कीमत का एक वेरिएंट, जिसे मेटाडेटा में हमारी key से पहचाना जाता है। दोबारा चलाना सुरक्षित है। ड्राई रन बताता है कि क्या मौजूद है और क्या नहीं।",
    fields: {
      dryRun: {
        label: "ड्राई रन",
        description: "कुछ बनाए बिना सिर्फ़ वेरिएंट की सूची दिखाएँ",
      },
    },
    response: {
      dryRun: "ड्राई रन",
      environment: "Whop एनवायरनमेंट",
      accountId: "Whop अकाउंट",
      existing: "पहले से मौजूद",
      created: "अभी बने",
      missing: "ग़ायब",
      variants: "वेरिएंट",
      key: "Key",
      variantId: "वेरिएंट ID",
      productId: "Whop प्रोडक्ट",
      amount: "रकम",
      status: "स्टेटस",
      purchaseUrl: "ख़रीद लिंक",
    },
    widget: {
      hint: "कीमत बदलने के बाद हर Whop अकाउंट पर एक बार चलाएँ। चेकआउट भी पहली ख़रीद पर ग़ायब वेरिएंट बना देता है।",
      submit: "कैटलॉग सिंक करें",
      summary:
        "Whop {{environment}} ({{accountId}}): {{existing}} मौजूद, {{created}} बने, {{missing}} ग़ायब",
    },
  },
  errors: {
    validation: { title: "गलत इनपुट", description: "रिक्वेस्ट जाँचें" },
    unauthorized: {
      title: "साइन इन नहीं",
      description: "एडमिन के रूप में साइन इन करें",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन",
      description: "सिर्फ़ एडमिन Whop कैटलॉग सिंक कर सकते हैं",
    },
    notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
    conflict: {
      title: "टकराव",
      description: "इस बीच Whop बदल गया। फिर से चलाएँ।",
    },
    server: { title: "सर्वर एरर", description: "Whop कैटलॉग सिंक नहीं हो सका" },
    network: { title: "नेटवर्क एरर", description: "रिक्वेस्ट सर्वर तक नहीं पहुँची" },
    unknown: { title: "अनजान एरर", description: "कुछ अनपेक्षित गड़बड़ हुई" },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले बदलाव सेव करें या हटाएँ",
    },
    notConfigured: "Whop कॉन्फ़िगर नहीं है (चालू WHOP_ENVIRONMENT की API key ग़ायब)",
    syncFailed: "Whop कैटलॉग सिंक फ़ेल हुआ: {{error}}",
  },
  success: {
    title: "हो गया",
    description: "Whop कैटलॉग जाँचा गया",
  },
};
