import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "अकाउंट",
  tags: {
    remoteConnection: "रिमोट कनेक्शन",
  },
  widget: {
    signInDescription: "रिमोट अकाउंट से कनेक्ट करने के लिए साइन इन करें।",
    adminOnlyDescription:
      "आउटबाउंड कनेक्शन बनाने के लिए एडमिन एक्सेस चाहिए। अगर किसी रिमोट इंस्टेंस ने आपको कनेक्ट किया है, तो आपके कनेक्शन ऊपर दिखते हैं।",
    benefit1: "मेमोरी अपने आप सिंक होती हैं: आप यहाँ AI को जो सिखाते हैं वह साथ चलता है",
    benefit2: "अपने लोकल इंस्टेंस से क्लाउड AI मॉडल और टूल इस्तेमाल करें",
    benefit3: "संदर्भ डिवाइसों के बीच आपके साथ चलता है",
    adminBenefit1: "मेमोरी दोनों तरफ़ अपने आप सिंक होती हैं",
    adminBenefit2:
      "क्लाउड AI आपके लोकल टूल (SSH, फ़ाइलें, कोड एक्ज़ीक्यूशन) ढूँढता और चलाता है",
    adminBenefit3: "क्लाउड से इस मशीन पर काम सौंपें: Claude Code लोकली चलाता है",
    adminBenefit4:
      "हर सिंक में क्षमताओं का स्नैपशॉट जाता है: Thea को हमेशा पता रहता है कि यह इंस्टेंस क्या कर सकता है",
  },
  post: {
    title: "रिमोट अकाउंट से कनेक्ट करें",
    titleShort: "रिमोट कनेक्ट",
    description:
      "कहीं से भी मेमोरी सिंक करने और AI टूल इस्तेमाल करने के लिए अपना अकाउंट रिमोट इंस्टेंस से जोड़ें",
    remoteUrl: {
      label: "रिमोट URL",
      description: "आपके रिमोट अकाउंट का वेब पता (जैसे https://unbottled.ai)",
      placeholder: "https://unbottled.ai",
      validation: {
        required: "कृपया रिमोट URL दर्ज करें",
        invalid: "कृपया सही URL दर्ज करें (जैसे https://unbottled.ai)",
      },
    },
    email: {
      label: "ईमेल",
      description: "रिमोट इंस्टेंस पर आपका ईमेल पता",
      placeholder: "you@example.com",
      validation: {
        required: "कृपया अपना ईमेल दर्ज करें",
        invalid: "कृपया सही ईमेल पता दर्ज करें",
      },
    },
    password: {
      label: "पासवर्ड",
      description: "रिमोट इंस्टेंस पर आपका पासवर्ड",
      placeholder: "••••••••",
      validation: {
        required: "कृपया अपना पासवर्ड दर्ज करें",
      },
    },
    token: {
      label: "टोकन",
      description: "रिमोट इंस्टेंस से JWT टोकन (अपने आप सेट होता है)",
      validation: {
        required: "पहले रिमोट इंस्टेंस पर लॉग इन करें",
      },
    },
    leadId: {
      label: "लीड ID",
      description: "रिमोट इंस्टेंस से लीड ID (अपने आप सेट होती है)",
    },
    isInferenceProvider: {
      label: "इन्फ़रेंस प्रोवाइडर की तरह इस्तेमाल करें",
      description:
        "इस कनेक्शन को AI स्ट्रीम चलाने दें। रिमोट इंस्टेंस रिवर्स WS चैनल पर AI लूप संभालता है।",
    },
    syncScope: {
      label: "सिंक स्कोप",
      description: "इस कनेक्शन पर कौन सा डेटा सिंक होता है।",
    },
    credentialWarning:
      "आपके क्रेडेंशियल सीधे आपके ब्राउज़र से रिमोट सर्वर पर जाते हैं। फिर भी यहाँ स्टोर टोकन इस सर्वर के ऑपरेटर को आपके रिमोट अकाउंट का पूरा एक्सेस देता है: आप वहाँ जो कर सकते हैं वह सब वे कर सकते हैं। सिर्फ़ उन सर्वर पर कनेक्ट करें जिन पर आप पूरा भरोसा करते हैं।",
    actions: {
      submit: "कनेक्ट करें",
      submitting: "कनेक्ट हो रहा है...",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना ब्योरा जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "कनेक्शन फ़ेल",
        description: "रिमोट सर्वर तक नहीं पहुँच सके। URL जाँचें और फिर कोशिश करें",
      },
      unauthorized: {
        title: "लॉगिन फ़ेल",
        description: "रिमोट अकाउंट का ईमेल या पासवर्ड गलत है",
      },
      forbidden: {
        title: "रिमोट कनेक्शन स्वीकार नहीं कर रहा",
        description:
          "रिमोट सर्वर आने वाले कनेक्शन स्वीकार करने के लिए कॉन्फ़िगर नहीं है। पक्का करें कि आप किसी क्लाउड इंस्टेंस (जैसे unbottled.ai) से कनेक्ट कर रहे हैं, किसी और लोकल इंस्टॉल से नहीं।",
      },
      notFound: {
        title: "नहीं मिला",
        description: "उस URL पर रिमोट सर्वर नहीं मिला",
      },
      server: {
        title: "रिमोट सर्वर एरर",
        description: "रिमोट सर्वर पर एरर आई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "पहले से कनेक्टेड",
        description: "आप इस इंस्टेंस ID के साथ पहले से किसी रिमोट इंस्टेंस से कनेक्टेड हैं",
      },
      instanceIdConflict: {
        title: "इंस्टेंस ID पहले से रजिस्टर्ड",
        description:
          "इस ID का इंस्टेंस रिमोट पर पहले से रजिस्टर्ड है। कोई और इंस्टेंस ID चुनें।",
      },
      noLeadId: {
        title: "कनेक्शन एरर",
        description: "रिमोट सर्वर के साथ सेशन नहीं बन सका",
      },
      invalidUrl: {
        title: "रिमोट URL गलत है",
        description:
          "रिमोट URL सार्वजनिक सर्वर का होना चाहिए, लोकल या निजी पते का नहीं",
      },
    },
    success: {
      title: "कनेक्ट हो गया!",
      description: "आपका अकाउंट अब रिमोट इंस्टेंस से जुड़ गया है",
    },
  },
};
