import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिलिंग",
  tags: {
    payment: "payment",
    invoice: "invoice",
  },
  post: {
    title: "इनवॉइस जारी करें",
    titleShort: "इनवॉइस जारी करें",
    description: "ड्राफ़्ट जारी करें और उसकी जर्नल एंट्री बनाएँ।",
    form: {
      title: "इनवॉइस जारी करें",
      description: "जारी करने के बाद कस्टमर व्यू लिंक बनाएँ।",
    },
    response: {
      success: "इनवॉइस जारी हो गया",
      message: "स्टेटस मैसेज",
      viewUrl: "कस्टमर व्यू URL",
    },
    errors: {
      invoiceLines: "जारी करने से पहले सकारात्मक योग वाली इनवॉइस लाइनें जोड़ें।",
      posting: "इनवॉइस का योग, कंपनी की करेंसी, अकाउंटिंग अवधि और पोस्टिंग अकाउंट जाँचें।",
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
        description: "इनवॉइस नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "इनवॉइस ड्राफ़्ट स्टेटस में नहीं है",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "इनवॉइस जारी हो गया",
      description: "कस्टमर व्यू लिंक शेयर करने के लिए तैयार है।",
    },
  },
  invoiceId: {
    label: "इनवॉइस ID",
    description: "भेजने वाले इनवॉइस की ID",
    placeholder: "इनवॉइस ID डालें",
  },
  delivery: {
    share: "इनवॉइस शेयर करें",
    description: "कस्टमर व्यू लिंक कॉपी करें, या इनवॉइस पर सेव ईमेल पर भेजें।",
    send: "ईमेल से भेजें",
    confirmDescription: "इनवॉइस लिंक पुष्ट प्राप्तकर्ता को भेजें।",
    recipient: "इनवॉइस प्राप्तकर्ता",
    noRecipient:
      "इस इनवॉइस पर कोई योग्य प्राप्तकर्ता सेव नहीं है। आप फिर भी लिंक कॉपी कर सकते हैं।",
    status: "ईमेल स्टेटस",
    notIssued: "सिर्फ़ जारी हो चुके इनवॉइस शेयर किए जा सकते हैं।",
    recipientChanged:
      "इनवॉइस प्राप्तकर्ता बदल गया है या उपलब्ध नहीं है। इनवॉइस शेयर करें दोबारा खोलें।",
    emailSubject: "इनवॉइस {{number}}",
    emailText:
      "{{company}} ने इनवॉइस {{number}} जारी किया है। इनवॉइस यहाँ खोलें:\n{{url}}",
    states: {
      ready: "भेजने के लिए तैयार",
      pending: "ईमेल भेजने की कोशिश जारी है या पुष्ट नहीं हुई। भेजना रुका हुआ है।",
      accepted: "मेल सर्वर ने स्वीकार कर लिया।",
      retryable: "मेल सर्वर से संपर्क नहीं हो सका। आप दोबारा कोशिश कर सकते हैं।",
      uncertain:
        "मेल का नतीजा पुष्ट नहीं हो सका। लिंक अलग से भेजने से पहले प्राप्तकर्ता से पूछ लें।",
    },
  },
  widget: {
    back: "वापस",
    submit: "इनवॉइस जारी करें",
    sent: "ये इनवॉइस पहुँचाने के लिए कस्टमर लिंक शेयर करें।",
    copy: "कस्टमर लिंक कॉपी करें",
    copied: "लिंक कॉपी हो गया",
    copyError: "लिंक कॉपी नहीं हो सका। ऊपर का URL चुनकर कॉपी करें।",
    viewUrl: "कस्टमर व्यू लिंक",
  },
};
