import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
    creditNote: "credit-note",
  },
  post: {
    title: "क्रेडिट नोट बनाएँ",
    titleShort: "क्रेडिट नोट",
    description:
      "पोस्ट हो चुके इनवॉइस पर पूरा या आंशिक क्रेडिट जारी करें। यह नोट संबंधित प्राप्य, राजस्व और VAT को उलट देता है।",
    form: {
      title: "क्रेडिट नोट बनाएँ",
      description: "मौजूदा इनवॉइस के विरुद्ध क्रेडिट जारी करें",
    },
    response: {
      success: "क्रेडिट नोट बन गया",
      message: "स्टेटस मैसेज",
      creditNote: {
        title: "क्रेडिट नोट",
        subtitle: "बने क्रेडिट नोट का ब्योरा",
        id: "क्रेडिट नोट ID",
        invoiceId: "मूल इनवॉइस ID",
        companyId: "कंपनी ID",
        currency: "मुद्रा",
        status: "स्टेटस",
        amount: "राशि",
        reason: "कारण",
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
      },
    },
    errors: {
      creditLines: "मूल इनवॉइस से धनात्मक मात्रा और VAT दरों के साथ क्रेडिट लाइनें डालें।",
      creditLimit:
        "यह क्रेडिट मूल इनवॉइस की बची हुई नेट राशि, VAT या कुल से ज़्यादा होगा।",
      originalPosting: "क्रेडिट जारी करने से पहले मूल इनवॉइस की पोस्टिंग का मिलान करें।",
      posting: "कंपनी की मुद्रा, खुली अकाउंटिंग अवधि और मूल पोस्टिंग अकाउंट जाँचें।",
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित",
      },
      notFound: {
        title: "नहीं मिला",
        description: "इनवॉइस नहीं मिला",
      },
      conflict: {
        title: "क्रेडिट नहीं दिया जा सकता",
        description: "सिर्फ़ OPEN या PAID इनवॉइस पर क्रेडिट नोट बन सकते हैं",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सफल",
      description: "क्रेडिट नोट बना और जर्नल एंट्री पोस्ट हुई",
    },
    widget: {
      readFailed: "चुना हुआ इनवॉइस लोड नहीं हो सका",
      retryRead: "इनवॉइस दोबारा लोड करें",
      number: "क्रेडिट नोट नंबर",
      amountLabel: "{{label}} · {{amount}}",
      available: "उपलब्ध क्रेडिट",
      dismiss: "बंद करें",
      namedSource: "स्रोत इनवॉइस {{reference}}",
      sourceInvoice: "स्रोत इनवॉइस",
      changeInvoice: "इनवॉइस बदलें",
      openNamedNote: "क्रेडिट नोट {{reference}} खोलें",
      openNote: "क्रेडिट नोट खोलें",
      reviewCredit: "क्रेडिट देखें",
      backToItems: "आइटम पर वापस",
      reviewStep: "क्रेडिट होने वाले आइटम",
      openNamedSource: "इनवॉइस {{reference}} खोलें",
      openSource: "स्रोत इनवॉइस खोलें",
      chooseInvoice: "जारी किया हुआ इनवॉइस चुनें",
      full: "पूरा इनवॉइस",
      partial: "चुने हुए आइटम",
      creditTotal: "जारी होने वाला क्रेडिट",
      unavailable: "इस इनवॉइस में क्रेडिट देने लायक कोई राशि नहीं बची।",
      issue: "क्रेडिट नोट जारी करें",
      issued: "क्रेडिट नोट जारी हुआ",
      back: "वापस",
      submit: "क्रेडिट नोट बनाएँ",
    },
  },
  invoiceId: {
    label: "इनवॉइस ID",
    description: "जिस इनवॉइस पर क्रेडिट दिया जा रहा है",
    placeholder: "इनवॉइस ID डालें",
  },
  companyId: {
    label: "कंपनी ID",
    description: "क्रेडिट नोट जारी करने वाली कंपनी",
    placeholder: "कंपनी ID डालें",
  },
  reason: {
    label: "कारण",
    description: "यह क्रेडिट क्यों जारी हो रहा है",
    placeholder: "क्रेडिट का कारण बताएँ",
  },
  lineItems: {
    label: "लाइन आइटम",
    description: "वैकल्पिक आंशिक क्रेडिट लाइनें। न दें तो पूरा क्रेडिट लगेगा।",
    placeholder: "",
  },
};
