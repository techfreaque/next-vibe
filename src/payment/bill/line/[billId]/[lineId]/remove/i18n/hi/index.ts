import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "payment",
    bill: "bill",
    lines: "lines",
  },
  post: {
    title: "बिल की लाइन हटाएँ",
    titleShort: "लाइन हटाएँ",
    description: "सप्लायर बिल के ड्राफ़्ट से एक लाइन हटाएँ",
    form: {
      title: "लाइन हटाएँ",
      description: "ड्राफ़्ट से ये लाइन हट जाएगी।",
    },
    response: {
      success: "लाइन हट गई",
      message: "स्टेटस मैसेज",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत पैरामीटर",
      },
      server: {
        title: "सर्वर एरर",
        description: "इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "लाइन आइटम नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description:
          "ये लाइन सिर्फ़ एडिट हो सकने वाले सप्लायर बिल ड्राफ़्ट से हटाई जा सकती है।",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सफल",
      description: "बिल की लाइन हटा दी गई।",
    },
  },
  billId: {
    label: "सप्लायर बिल",
    description: "वो बिल जिसकी लाइन हटाई जाएगी",
  },
  lineId: {
    label: "लाइन ID",
    description: "हटाने वाले लाइन आइटम की ID",
    placeholder: "लाइन ID डालें",
  },
  widget: {
    verifying: "चुनी हुई लाइन जाँची जा रही है…",
    unavailable:
      "ये लाइन अब हटाने के लिए उपलब्ध नहीं है। ड्राफ़्ट दोबारा खोलकर उसकी मौजूदा लाइनें देखिए।",
    lineGross: "लाइन ग्रॉस: {{amount}}",

    back: "वापस",
    submit: "लाइन हटाएँ",
    warning: "ये लाइन हमेशा के लिए हट जाएगी और ड्राफ़्ट का योग दोबारा निकलेगा।",
    confirm: "लाइन हटाएँ",
    removed: "लाइन आइटम हट गया",
  },
};
