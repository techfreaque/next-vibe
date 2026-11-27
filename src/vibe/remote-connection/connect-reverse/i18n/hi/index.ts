import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "अकाउंट",
  tags: {
    remoteConnection: "रिमोट कनेक्शन",
  },
  post: {
    title: "लोकल इंस्टेंस रजिस्टर करें",
    titleShort: "इंस्टेंस रजिस्टर करें",
    description:
      "कनेक्ट फ़्लो के दौरान लोकल इंस्टेंस ख़ुद को क्लाउड पर रजिस्टर करने के लिए इसे कॉल करता है",
    instanceId: {
      label: "इंस्टेंस का नाम",
      description: "लोकल इंस्टेंस की यूनिक पहचान",
      placeholder: "hermes",
      validation: {
        invalid: "सिर्फ़ छोटे अक्षर, अंक और हाइफ़न इस्तेमाल करें",
      },
    },
    localUrl: {
      label: "लोकल URL",
      description: "लोकल इंस्टेंस का ऐप URL",
      placeholder: "http://localhost:3000",
      validation: {
        required: "कृपया लोकल URL दर्ज करें",
        invalid: "कृपया सही URL दर्ज करें",
      },
    },
    reverseToken: {
      label: "रिवर्स टोकन",
      description: "रिमोट के इस इंस्टेंस पर वापस ऑथेंटिकेट करने के लिए JWT टोकन",
    },
    reverseLeadId: {
      label: "रिवर्स लीड ID",
      description: "रिवर्स कनेक्शन की लीड ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना ब्योरा जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "लॉग इन नहीं",
        description: "इंस्टेंस रजिस्टर करने के लिए आपका लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको इंस्टेंस रजिस्टर करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "इंस्टेंस रजिस्टर करते समय एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "इंस्टेंस ID पहले से रजिस्टर्ड",
        description:
          "इस ID का इंस्टेंस आपके अकाउंट के लिए पहले से रजिस्टर्ड है। कोई और इंस्टेंस ID चुनें।",
      },
    },
    success: {
      title: "इंस्टेंस रजिस्टर हुआ",
      description: "लोकल इंस्टेंस सफलतापूर्वक रजिस्टर हो गया",
    },
  },
};
