import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सिस्टम",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "एम्बेड",
    widget: "विजेट",
    config: "कॉन्फ़िग",
  },
  post: {
    title: "Vibe Frame कॉन्फ़िग",
    titleShort: "Vibe Frame",
    description:
      "माँगे गए इंटीग्रेशन के iframe URL लौटाता है। सर्वर असली ऑथ कुकी पढ़ता है (credentials: include) और छोटी अवधि के एक्सचेंज टोकन बनाता है ताकि URL में कोई सीक्रेट न दिखे।",
    container: {
      title: "Vibe Frame कॉन्फ़िग",
      description: "एक या अधिक इंटीग्रेशन के लिए iframe URL माँगें",
    },
    fields: {
      leadId: {
        label: "लीड ID",
        description:
          "होस्ट पेज से विज़िटर की लीड ID (क्रॉस-ऑरिजिन: कुकी से पढ़ी नहीं जा सकती)",
      },
      authToken: {
        label: "ऑथ टोकन",
        description: "होस्ट पेज सेशन से JWT ऑथ टोकन (ऑथेंटिकेटेड विजेट के लिए)",
      },
      integrations: {
        label: "इंटीग्रेशन",
        description: "कॉन्फ़िगर किए जाने वाले इंटीग्रेशन की सूची",
      },
      integration: {
        label: "इंटीग्रेशन",
        description: "एक इंटीग्रेशन का कॉन्फ़िग",
      },
      id: {
        label: "इंटीग्रेशन ID",
        description: "इस इंटीग्रेशन स्लॉट की यूनिक पहचान",
        placeholder: "contact_POST",
      },
      endpoint: {
        label: "एंडपॉइंट",
        description: "एंडपॉइंट पहचान का ओवरराइड (सेट न हो तो id)",
        placeholder: "contact_POST",
      },
      hasRendered: {
        label: "रेंडर हो चुका",
        description:
          "अगर यह इंटीग्रेशन पहले से माउंट है तो true करें: सर्वर इसे छोड़ सकता है",
      },
      theme: {
        label: "थीम",
        description: "फ़्रेम की कलर थीम",
      },
      urlPathParams: {
        label: "URL पाथ पैरामीटर",
        description: "JSON-एन्कोडेड URL पाथ पैरामीटर",
        placeholder: '{"id":"123"}',
      },
      data: {
        label: "डेटा",
        description: "JSON-एन्कोडेड प्री-फ़िल डेटा",
        placeholder: "{}",
      },
      widgets: {
        label: "विजेट",
        description: "इंटीग्रेशन ID से विजेट कॉन्फ़िग का मैप",
      },
      widget: {
        label: "विजेट",
        description: "एक इंटीग्रेशन का विजेट कॉन्फ़िग",
      },
      frameId: {
        label: "फ़्रेम ID",
        description: "ब्रिज संवाद के लिए यूनिक फ़्रेम ID",
      },
      widgetUrl: {
        label: "विजेट URL",
        description: "एक्सचेंज टोकन के साथ iframe src URL",
      },
    },
    errors: {
      validation: {
        title: "पैरामीटर गलत हैं",
        description: "दिए गए पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस मना है",
        description: "आपके पास अनुमति नहीं है",
      },
      notFound: {
        title: "एंडपॉइंट नहीं मिला",
        description: "एक या अधिक एंडपॉइंट मौजूद नहीं हैं",
      },
      internal: {
        title: "कॉन्फ़िग फ़ेल",
        description: "कॉन्फ़िग रिस्पॉन्स बनाते समय एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
      },
    },
    repository: {
      invalidUrlPathParams: "URL पाथ पैरामीटर का फ़ॉर्मेट गलत है",
      invalidData: "डेटा का फ़ॉर्मेट गलत है",
      endpointNotFound: "एंडपॉइंट नहीं मिला",
      configFailed: "फ़्रेम कॉन्फ़िग बनाना फ़ेल हुआ",
      tokenMintFailed: "एक्सचेंज टोकन बनाना फ़ेल हुआ",
    },
    success: {
      configured: {
        title: "कॉन्फ़िग तैयार",
        description: "iframe URL सफलतापूर्वक बन गए",
      },
    },
  },
};
