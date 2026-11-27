/**
 * English translations for unified Messenger Send endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "मैसेज भेजें",
  titleShort: "मैसेज भेजें",
  description: "किसी भी चैनल (ईमेल, SMS, WhatsApp, Telegram) से मैसेज भेजें",
  category: "मैसेजिंग",
  tag: "भेजें",

  container: {
    title: "मैसेज भेजें",
    description: "कॉन्फ़िगर किए मैसेंजर अकाउंट से भेजें",
  },

  accountId: {
    label: "मैसेंजर अकाउंट",
    description: "जिस अकाउंट से भेजना है",
    placeholder: "अकाउंट UUID चुनें",
  },
  to: {
    label: "प्राप्तकर्ता",
    description: "ईमेल पता, फ़ोन नंबर या चैट ID",
    placeholder: "user@example.com या +12025551234",
  },
  toName: {
    label: "पाने वाले का नाम",
    description: "प्राप्तकर्ता का डिस्प्ले नाम (वैकल्पिक)",
    placeholder: "राहुल शर्मा",
  },
  subject: {
    label: "विषय",
    description: "विषय लाइन (सिर्फ़ ईमेल, दूसरे चैनलों के लिए वैकल्पिक)",
    placeholder: "आपका विषय यहाँ...",
  },
  text: {
    label: "मैसेज",
    description:
      "सादा टेक्स्ट बॉडी: SMS/WhatsApp/Telegram में इस्तेमाल होती है; ईमेल का फ़ॉलबैक",
    placeholder: "अपना मैसेज लिखें...",
  },
  html: {
    label: "HTML कंटेंट",
    description: "HTML बॉडी (सिर्फ़ ईमेल, वैकल्पिक: न दें तो टेक्स्ट इस्तेमाल होता है)",
    placeholder: "<p>HTML ईमेल कंटेंट डालें...</p>",
  },
  senderName: {
    label: "भेजने वाले का नाम",
    description: "भेजने वाले का डिस्प्ले नाम (सिर्फ़ ईमेल, वैकल्पिक)",
    placeholder: "आपकी कंपनी",
  },
  replyTo: {
    label: "Reply-To",
    description: "जवाब का पता (सिर्फ़ ईमेल, वैकल्पिक)",
    placeholder: "support@example.com",
  },
  leadId: {
    label: "लीड ID",
    description: "ट्रैकिंग के लिए जुड़ी लीड (वैकल्पिक)",
    placeholder: "UUID",
  },
  campaignId: {
    label: "कैंपेन ID",
    description: "ट्रैकिंग के लिए जुड़ा कैंपेन (वैकल्पिक)",
    placeholder: "UUID",
  },

  response: {
    title: "भेजने का नतीजा",
    description: "भेजने के ऑपरेशन का नतीजा",
    messageId: { label: "मैसेज ID" },
    accountName: { label: "अकाउंट" },
    channel: { label: "चैनल" },
    provider: { label: "प्रोवाइडर" },
    sentAt: { label: "भेजने का समय" },
  },

  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "आपके पास मैसेज भेजने की अनुमति नहीं है",
    },
    server: {
      title: "सर्वर एरर",
      description: "भेजते समय इंटरनल सर्वर एरर आया",
      detail: "भेजना फ़ेल हुआ: {{error}}",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर आया",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "इस रिसोर्स का एक्सेस मना है",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "भेजते समय नेटवर्क एरर आया",
    },
    notFound: {
      title: "अकाउंट नहीं मिला",
      description: "बताया गया मैसेंजर अकाउंट नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "रिक्वेस्ट मौजूदा डेटा से टकराती है",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
  },

  success: {
    title: "मैसेज भेज दिया गया",
    description: "आपका मैसेज सफलतापूर्वक भेज दिया गया",
  },
};
