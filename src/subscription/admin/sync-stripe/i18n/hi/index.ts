import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Stripe से सब्सक्रिप्शन सिंक करें",
    titleShort: "Stripe सिंक",
    description:
      "Stripe से स्थिति, बिलिंग अवधि और रद्दीकरण फ़ील्ड हमारी सब्सक्रिप्शन पंक्तियों में खींचें। बिना Stripe id वाली और ख़त्म अवधि की पुरानी पंक्तियों को एक्सपायर करता है। क्रेडिट कभी नहीं देता या वापस लेता। डिफ़ॉल्ट रूप से ड्राई रन।",
    fields: {
      subscriptionId: {
        label: "सब्सक्रिप्शन",
        description:
          "हमारी सब्सक्रिप्शन id (uuid) या Stripe सब्सक्रिप्शन id (sub_...)। 'All' चालू हो तो ख़ाली छोड़ें।",
        placeholder: "sub_... या सब्सक्रिप्शन uuid",
      },
      all: {
        label: "सभी",
        description: "हर वह सब्सक्रिप्शन जाँचें जो पहले से रद्द या एक्सपायर नहीं है।",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "कुछ लिखे बिना बदलावों का प्रीव्यू करें।",
      },
    },
    response: {
      dryRun: "ड्राई रन",
      scanned: "जाँचे गए",
      changed: "बदले गए",
      failed: "फ़ेल",
      items: "सब्सक्रिप्शन",
      item: {
        subscriptionId: "सब्सक्रिप्शन",
        userEmail: "यूज़र",
        providerSubscriptionId: "Stripe id",
        action: "कार्रवाई",
        statusBefore: "पहले की स्थिति",
        statusAfter: "बाद की स्थिति",
        periodEndBefore: "पहले अवधि का अंत",
        periodEndAfter: "बाद में अवधि का अंत",
        note: "नोट",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "टारगेट ग़ायब",
        description: "सब्सक्रिप्शन id, Stripe id या all=true दें।",
      },
      forbidden: {
        title: "मना है",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      server: {
        title: "सिंक फ़ेल हुआ",
        description: "Stripe से सब्सक्रिप्शन सिंक नहीं हो सके",
        detail: "सब्सक्रिप्शन सिंक फ़ेल हुआ: {{error}}",
      },
      unknown: {
        title: "अनजान एरर",
        description: "सिंक के दौरान अप्रत्याशित एरर",
      },
      conflict: {
        title: "टकराव",
        description: "सिंक के दौरान सब्सक्रिप्शन बदल गया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "Stripe तक नहीं पहुँच सके",
      },
      notFound: {
        title: "नहीं मिला",
        description: "उस id से कोई सब्सक्रिप्शन मेल नहीं खाता",
        detail: "{{id}} से कोई सब्सक्रिप्शन मेल नहीं खाता",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले लंबित सिंक चलाएँ या छोड़ दें",
      },
      notConfigured: "इस इंस्टेंस पर Stripe कॉन्फ़िगर नहीं है।",
    },
    success: {
      title: "सिंक पूरा हुआ",
      description: "Stripe से मिलाए गए सब्सक्रिप्शन",
    },
    notes: {
      keptCanceled:
        "Stripe कहता है {{stripeStatus}}; रद्द ही रखा (रद्द को कभी डाउनग्रेड नहीं करते)।",
      missingInStripe:
        "Stripe में नहीं मिला; रद्द चिह्नित किया और Stripe id साफ़ की।",
      expiredLegacy:
        "कोई Stripe id नहीं और अवधि {{date}} को ख़त्म हुई; रद्द चिह्नित किया।",
      noStripeIdActivePeriod:
        "कोई Stripe id नहीं, अवधि अब भी चल रही है; जैसा था वैसा छोड़ा।",
      notStripe: "प्रोवाइडर Stripe नहीं है; छोड़ा।",
      stripeError: "Stripe एरर: {{error}}",
    },
    widget: {
      submit: "सिंक चलाएँ",
      submitting: "सिंक हो रहा है...",
      preview: "प्रीव्यू: कुछ लिखा नहीं गया",
      applied: "लागू हुआ",
      empty: "सिंक करने को कुछ नहीं।",
      none: "none",
    },
  },
  enums: {
    action: {
      updated: "अपडेट हुआ",
      unchanged: "सिंक में",
      expired: "समाप्त",
      missingInStripe: "Stripe में ग़ायब",
      skipped: "छोड़ा गया",
      error: "एरर",
    },
  },
};
