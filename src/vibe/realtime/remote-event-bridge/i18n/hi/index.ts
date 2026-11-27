import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सिस्टम",
  tags: {
    remoteSync: "रिमोट सिंक",
  },
  remoteEventBridge: {
    post: {
      title: "रिमोट इवेंट ब्रिज",
      titleShort: "इवेंट ब्रिज",
      description:
        "रिमोट पीयर के इवेंट पाकर टारगेट रूट के onRemoteEvent हैंडलर तक पहुँचाता है। direct-http पीयर HTTP से, या reverse-WS onRemoteEvent से कॉल करते हैं।",
      eventName: {
        label: "इवेंट नाम",
        description: "प्रोसेस करने के लिए वायर इवेंट टाइप",
      },
      leadId: {
        label: "लीड ID",
        description: "भेजने वाले पीयर की क्रॉस-इंस्टेंस पहचान",
      },
      originInstanceId: {
        label: "मूल इंस्टेंस",
        description: "जिस इंस्टेंस ने यह इवेंट भेजा (इको रोकने के लिए)",
      },
      payload: {
        label: "पेलोड",
        description: "रिमोट इंस्टेंस से आगे भेजा गया कच्चा इवेंट पेलोड",
      },
      received: {
        label: "प्राप्त",
        description: "इवेंट स्वीकार और प्रोसेस हुआ या नहीं",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "इवेंट पेलोड गलत है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        internal: {
          title: "प्रोसेसिंग एरर",
          description: "इवेंट प्रोसेस करते समय एरर हुआ",
        },
        forbidden: {
          title: "प्रतिबंधित",
          description: "आपके पास इवेंट सबमिट करने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "टारगेट नहीं मिला",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "इवेंट ब्रिज एंडपॉइंट तक पहुँच नहीं हो सकी",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कुछ अनपेक्षित हुआ",
        },
        unsaved: {
          title: "बिना सेव बदलाव",
          description: "कुछ बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "इवेंट टकराव मिला",
        },
      },
      success: {
        title: "इवेंट मिल गया",
        description: "रिमोट इवेंट सफलतापूर्वक प्रोसेस हुआ",
      },
    },
  },
};
