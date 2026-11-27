import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एस्टिमेट",
  tags: { payment: "payment", estimate: "estimate" },
  post: {
    title: "एस्टिमेट को भेजा हुआ चिह्नित करें",
    titleShort: "एस्टिमेट को भेजा हुआ चिह्नित करें",
    description: "एस्टिमेट को ग्राहक को भेजा हुआ चिह्नित करें",
    form: {
      title: "एस्टिमेट को भेजा हुआ चिह्नित करें",
      description: "एस्टिमेट को ग्राहक को भेजा हुआ चिह्नित करें",
    },
    response: { success: "सफल", message: "स्थिति का संदेश" },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "पैरामीटर गलत हैं",
      },
      server: { title: "सर्वर एरर", description: "आंतरिक सर्वर एरर" },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: { title: "मना है", description: "एक्सेस नहीं मिला" },
      notFound: { title: "नहीं मिला", description: "एस्टिमेट नहीं मिला" },
      conflict: {
        title: "टकराव",
        description: "मौजूदा स्थिति में यह कार्रवाई नहीं हो सकती",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
    },
    success: {
      title: "सफल",
      description: "एस्टिमेट को ग्राहक को भेजा हुआ चिह्नित करें",
    },
  },
  estimateId: {
    label: "एस्टिमेट ID",
    description: "जिस एस्टिमेट पर कार्रवाई करनी है",
  },
  widget: {
    back: "वापस",
    submit: "भेजा हुआ चिह्नित करें",
    sent: "एस्टिमेट ग्राहक को भेजा हुआ चिह्नित हुआ।",
    sendNote: "पुष्टि करें कि आपने यह एस्टिमेट ग्राहक को भेज दिया है।",
  },
};
