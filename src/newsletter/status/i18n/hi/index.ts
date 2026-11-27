import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "न्यूज़लेटर स्टेटस",
  titleShort: "न्यूज़लेटर स्टेटस",
  description: "किसी ईमेल पते का न्यूज़लेटर सब्सक्रिप्शन स्टेटस देखें",
  category: "न्यूज़लेटर",
  tags: {
    status: "स्टेटस",
  },
  form: {
    title: "न्यूज़लेटर स्टेटस देखें",
    description: "न्यूज़लेटर सब्सक्रिप्शन स्टेटस देखने के लिए ईमेल पता डालें",
  },
  email: {
    label: "ईमेल पता",
    description: "वह ईमेल पता जिसका सब्सक्रिप्शन स्टेटस देखना है",
    placeholder: "user@example.com",
    helpText: "अपना सब्सक्रिप्शन देखने के लिए खाली छोड़ दें",
  },
  response: {
    subscribed: "सब्सक्रिप्शन स्टेटस",
    status: "मौजूदा स्टेटस",
    confirmed: "कन्फ़र्म हुआ",
    email: "ईमेल पता",
  },
  errors: {
    validation: {
      title: "गलत ईमेल",
      description: "सही ईमेल पता डालें",
    },
    internal: {
      title: "अंदरूनी एरर",
      description: "सब्सक्रिप्शन स्टेटस जाँचते समय एरर आया",
      detail: "सब्सक्रिप्शन स्टेटस नहीं जाँचा जा सका: {{error}}",
    },
    unauthorized: {
      title: "अनुमति नहीं",
      description: "आपको यह सब्सक्रिप्शन स्टेटस देखने की अनुमति नहीं है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "इस ईमेल पते के लिए कोई सब्सक्रिप्शन जानकारी नहीं मिली",
    },
  },
  success: {
    title: "स्टेटस मिल गया",
    description: "न्यूज़लेटर सब्सक्रिप्शन स्टेटस मिल गया",
  },
};
