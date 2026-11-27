import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सब्सक्रिप्शन",
  tags: {
    subscription: "subscription",
    admin: "admin",
  },
  post: {
    title: "सालाना प्लान: मासिक क्रेडिट",
    titleShort: "सालाना क्रेडिट",
    description:
      "हर सालाना प्लान को इस महीने के क्रेडिट दें। रोज़ चलता है; हर महीना सिर्फ़ एक बार मिलता है और महीना ख़त्म होते ही एक्सपायर हो जाता है।",
    response: {
      scanned: "जाँचे गए सालाना प्लान",
      granted: "अभी दिए गए महीने",
      credits: "दिए गए क्रेडिट",
    },
    widget: {
      hint: "रोज़ अपने आप चलता है। हाथ से चलाना सुरक्षित है: कोई महीना दो बार नहीं दिया जाता।",
      submit: "इस महीने के दें",
      summary:
        "{{scanned}} सालाना प्लान जाँचे गए, {{granted}} महीने दिए गए, {{credits}} क्रेडिट",
    },
  },
  task: {
    description: "सालाना प्लान को उनके मासिक क्रेडिट देता है",
  },
  backfill: {
    title: "सालाना प्लान: छूटे महीनों की भरपाई",
    titleShort: "सालाना बैकफ़िल",
    description:
      "मौजूदा सालाना अवधि के वे महीने जो बिना मासिक क्रेडिट के निकल गए। ड्राई रन उन्हें सूची में दिखाता है; इसे बंद करने पर वे एक बार दिए जाते हैं, एक पैक के रूप में जो अवधि के अंत तक चलता है।",
    fields: {
      dryRun: {
        label: "ड्राई रन",
        description: "बिना दिए सिर्फ़ सूची दिखाएँ कि क्या दिया जाएगा",
      },
    },
    response: {
      dryRun: "ड्राई रन",
      subscriptions: "सब्सक्रिप्शन",
      months: "छूटे महीने",
      credits: "क्रेडिट",
      rows: "सब्सक्रिप्शन",
      subscriptionId: "सब्सक्रिप्शन",
      userEmail: "यूज़र",
      plan: "प्लान",
      periodStart: "अवधि की शुरुआत",
      periodEnd: "अवधि का अंत",
      currentMonth: "मौजूदा महीना",
      missedMonths: "छूटे महीने",
      status: "स्टेटस",
    },
    widget: {
      hint: "पहले ड्राई रन देखें। यह ग्रांट हर सब्सक्रिप्शन और अवधि के लिए एक बार चलता है; दोहराने से कुछ नहीं जुड़ता।",
      submit: "बैकफ़िल चलाएँ",
      preview:
        "ड्राई रन: {{subscriptions}} सब्सक्रिप्शन, {{months}} छूटे महीने, {{credits}} क्रेडिट दिए जाएँगे।",
      done: "दिया गया: {{subscriptions}} सब्सक्रिप्शन, {{months}} महीने, {{credits}} क्रेडिट।",
    },
  },
  errors: {
    validation: {
      title: "अमान्य इनपुट",
      description: "रिक्वेस्ट जाँचें",
    },
    unauthorized: {
      title: "साइन इन नहीं हैं",
      description: "एडमिन के तौर पर साइन इन करें",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन के लिए",
      description: "सिर्फ़ एडमिन प्लान क्रेडिट दे सकते हैं",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रिसोर्स नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "इस बीच डेटा बदल गया, दोबारा चलाएँ",
    },
    server: {
      title: "सर्वर एरर",
      description: "सालाना क्रेडिट नहीं दिए जा सके",
      detail: "सालाना क्रेडिट विफल रहे: {{error}}",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "रिक्वेस्ट सर्वर तक नहीं पहुँची",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कुछ अनपेक्षित विफल हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले अपने बदलाव सेव करें या छोड़ दें",
    },
  },
  success: {
    title: "हो गया",
    description: "सालाना क्रेडिट प्रोसेस हो गए",
  },
};
