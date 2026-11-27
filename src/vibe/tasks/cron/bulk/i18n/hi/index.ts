import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "API एंडपॉइंट",
  tags: {
    tasks: "टास्क",
    cron: "Cron",
    bulk: "बल्क",
  },
  post: {
    title: "बल्क टास्क कार्रवाई",
    titleShort: "बल्क टास्क",
    description: "कई cron टास्क पर बल्क कार्रवाई करें (हटाएँ, चालू करें, बंद करें, चलाएँ)",
    fields: {
      ids: {
        label: "टास्क ID",
        description: "जिन टास्क पर कार्रवाई करनी है उनकी ID की सूची",
      },
      action: {
        label: "कार्रवाई",
        description: "चुने हुए टास्क पर की जाने वाली कार्रवाई",
        options: {
          delete: "हटाएँ",
          enable: "चालू करें",
          disable: "बंद करें",
          run: "अभी चलाएँ",
        },
      },
      succeeded: {
        label: "सफल",
        description: "सफलतापूर्वक प्रोसेस हुए टास्क की संख्या",
      },
      failed: {
        label: "फ़ेल",
        description: "प्रोसेस में फ़ेल हुए टास्क की संख्या",
      },
      errors: {
        label: "एरर",
        description: "प्रति-टास्क एरर की सूची",
      },
    },
    errors: {
      fetchFailed: "बल्क कार्रवाई के लिए टास्क ID नहीं मिल सकीं",
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "दिया गया बल्क कार्रवाई का डेटा गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको बल्क कार्रवाई करने की अनुमति नहीं है",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "बल्क कार्रवाई करते समय एरर हुई",
      },
      forbidden: {
        title: "मना है",
        description: "इस रिसोर्स का एक्सेस मना है",
      },
      conflict: {
        title: "टकराव",
        description: "बल्क कार्रवाई प्रोसेस करते समय टकराव हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      notFound: {
        title: "नहीं मिला",
        description: "एक या अधिक टास्क नहीं मिले",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
    },
    success: {
      completed: {
        title: "बल्क कार्रवाई पूरी हुई",
        description: "बल्क कार्रवाई चुने हुए टास्क पर लागू हो गई",
      },
    },
  },
};
