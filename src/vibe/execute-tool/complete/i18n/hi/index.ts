import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सिस्टम",
  tags: {
    remoteSync: "रिमोट सिंक",
  },
  taskReport: {
    post: {
      title: "टास्क रिपोर्ट",
      titleShort: "रिपोर्ट",
      description: "रिमोट इंस्टेंस से टास्क एक्ज़ीक्यूशन के नतीजे स्वीकार करें।",
      taskId: {
        label: "टास्क ID",
        description: "रिपोर्ट किए जा रहे टास्क की ID",
      },
      executionId: {
        label: "एक्ज़ीक्यूशन ID",
        description: "उस रन की ID जो ख़ास एक्ज़ीक्यूशन थी",
      },
      status: {
        label: "स्टेटस",
        description: "टास्क एक्ज़ीक्यूशन का अंतिम स्टेटस",
      },
      durationMs: {
        label: "अवधि (ms)",
        description: "एक्ज़ीक्यूशन की अवधि मिलीसेकंड में",
      },
      summary: {
        label: "सारांश",
        description: "एक्ज़ीक्यूशन के नतीजे का इंसान को समझ आने वाला सारांश",
      },
      error: {
        label: "एरर",
        description: "एक्ज़ीक्यूशन फ़ेल हुआ तो एरर मैसेज",
      },
      serverTimezone: {
        label: "सर्वर टाइमज़ोन",
        description: "एक्ज़ीक्यूट करने वाले सर्वर का टाइमज़ोन",
      },
      executedByInstance: {
        label: "किसने चलाया",
        description: "टास्क चलाने वाले इंस्टेंस की ID",
      },
      output: {
        label: "आउटपुट",
        description: "टास्क से मिला स्ट्रक्चर्ड आउटपुट डेटा",
      },
      startedAt: {
        label: "शुरू होने का समय",
        description: "एक्ज़ीक्यूशन शुरू होने का ISO टाइमस्टैम्प",
      },
      wakeUpContext: {
        label: "रिवाइवल कॉन्टेक्स्ट",
        description:
          "डिस्पैच रिक्वेस्ट से लौटाया गया थ्रेड रिवाइवल कॉन्टेक्स्ट, ताकि कॉलर बिना लोकल टास्क रिकॉर्ड के भी थ्रेड को फिर चालू कर सके",
      },
      processed: {
        label: "प्रोसेस हुआ",
        description: "रिपोर्ट स्वीकार हुई या नहीं",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत रिपोर्ट पेलोड",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        internal: {
          title: "प्रोसेसिंग एरर",
          description: "रिपोर्ट प्रोसेस करते समय एरर आया",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपके पास रिपोर्ट सबमिट करने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "टास्क नहीं मिला",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "रिपोर्ट endpoint तक नहीं पहुँच सके",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsaved: {
          title: "बिना सेव किए बदलाव",
          description: "कुछ बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "रिपोर्ट में टकराव मिला",
        },
      },
      success: {
        title: "रिपोर्ट स्वीकार हुई",
        description: "टास्क रिपोर्ट सफलतापूर्वक प्रोसेस हुई",
      },
    },
  },
};
