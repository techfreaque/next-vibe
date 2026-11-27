import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "NOWPayments CLI",
    titleShort: "NOWPayments",
    description: "NOWPayments वेबहुक फ़ॉरवर्डिंग के लिए ngrok टनल शुरू करें",
    category: "पेमेंट",
    tags: {
      nowpayments: "NOWPayments",
      cli: "CLI",
      webhook: "वेबहुक",
    },
    form: {
      title: "NOWPayments टनल",
      description: "NOWPayments वेबहुक लोकली पाने के लिए ngrok टनल शुरू करें",
      fields: {
        port: {
          label: "पोर्ट",
          description: "टनल करने वाला लोकल पोर्ट (डिफ़ॉल्ट: 3000)",
          placeholder: "3000",
        },
      },
    },
    errors: {
      notInstalled: {
        instructions:
          "ngrok इंस्टॉल करने के लिए:\n\n1. https://ngrok.com/download पर जाएँ\n2. अपने प्लेटफ़ॉर्म के लिए ngrok डाउनलोड करें\n3. उसे एक्स्ट्रैक्ट करके अपने PATH में रखें\n4. चलाएँ: ngrok authtoken YOUR_AUTH_TOKEN (अपना टोकन https://dashboard.ngrok.com/get-started/your-authtoken से लें)\n\nया पैकेज मैनेजर से इंस्टॉल करें:\n- macOS: brew install ngrok/ngrok/ngrok\n- Linux: snap install ngrok\n- Windows: choco install ngrok",
        title: "ngrok इंस्टॉल नहीं है",
        description:
          "टनल शुरू करने के लिए ngrok चाहिए। उसे इंस्टॉल करके दोबारा कोशिश करें।",
      },
      validationFailed: {
        title: "वैलिडेशन एरर",
        description: "पैरामीटर गलत हैं",
      },
      networkError: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन फ़ेल हुआ",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस अस्वीकृत",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      serverError: {
        noTunnelUrl: "ngrok टनल का URL पढ़ा नहीं जा सका",
        title: "सर्वर एरर",
        description: "टनल शुरू नहीं हो सकी",
      },
      unknownError: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "रिसोर्स में टकराव",
      },
    },
    success: {
      title: "टनल शुरू हुई",
      description: "ngrok टनल चल रही है",
    },
  },
};
