import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "टेस्ट चलाएँ",
  titleShort: "टेस्ट चलाएँ",
  description: "वैकल्पिक कॉन्फ़िगरेशन के साथ टेस्ट सूट चलाएँ",
  category: "टेस्टिंग",
  tag: "टेस्ट",

  container: {
    title: "टेस्ट कॉन्फ़िगरेशन",
    description: "टेस्ट एक्ज़ीक्यूशन के पैरामीटर कॉन्फ़िगर करें",
  },

  fields: {
    path: {
      label: "टेस्ट पाथ",
      description: "टेस्ट फ़ाइलों या डायरेक्टरी का पाथ",
      placeholder: "src/",
    },
    verbose: {
      label: "विस्तृत आउटपुट",
      description: "विस्तृत टेस्ट आउटपुट चालू करें",
    },
    watch: {
      label: "वॉच मोड",
      description: "फ़ाइल बदलावों पर टेस्ट वॉच मोड में चलाएँ",
    },
    coverage: {
      label: "कवरेज रिपोर्ट",
      description: "टेस्ट कवरेज रिपोर्ट बनाएँ",
    },
  },

  response: {
    success: "टेस्ट एक्ज़ीक्यूशन स्टेटस",
    output: "टेस्ट आउटपुट और नतीजे",
    duration: "टेस्ट एक्ज़ीक्यूशन अवधि (ms)",
  },

  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "टेस्ट कॉन्फ़िगरेशन पैरामीटर गलत हैं",
    },
    internal: {
      title: "इंटरनल एरर",
      description: "टेस्ट एक्ज़ीक्यूशन इंटरनल एरर से फ़ेल हुआ",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "टेस्ट एक्ज़ीक्यूशन की अनुमति नहीं",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "टेस्ट एक्ज़ीक्यूशन मना है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "टेस्ट फ़ाइलें या डायरेक्टरी नहीं मिलीं",
    },
    server: {
      title: "सर्वर एरर",
      description: "टेस्ट एक्ज़ीक्यूशन के दौरान सर्वर एरर",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर आया",
    },
    unsaved: {
      title: "बिना सेव किए बदलाव",
      description: "कुछ बदलाव सेव नहीं हुए हैं जो टेस्ट पर असर डाल सकते हैं",
    },
    conflict: {
      title: "टकराव",
      description: "टेस्ट एक्ज़ीक्यूशन में टकराव मिला",
    },
    executionFailed:
      "टेस्ट एक्ज़ीक्यूशन {{duration}}ms बाद फ़ेल हुआ: {{detail}}\n{{output}}",
    // The EN wording of `streamingUnsupported` is load-bearing: test-endpoint.ts
    // probes response messages for "Streaming responses are not supported" to tell
    // test-infrastructure failures from real endpoint errors. Keep that substring.
    streamingUnsupported: "टेस्ट में स्ट्रीमिंग रिस्पॉन्स सपोर्टेड नहीं हैं",
    responseSchemaFailed:
      "{{path}} के लिए रिस्पॉन्स स्कीमा वैलिडेशन फ़ेल हुआ: {{issues}}",
    requestFailed: "टेस्ट रिक्वेस्ट फ़ेल हुई: {{detail}}",
    browser: {
      serverNotRunning: "Atlas dev सर्वर चल नहीं रहा: vibe dev से शुरू करें",
      openFailed: "ब्राउज़र पेज नहीं खुल सका: {{detail}}",
      fillFailed: "फ़ॉर्म फ़ील्ड भरे नहीं जा सके: {{detail}}",
      submitFailed: "सबमिट बटन क्लिक नहीं हो सका: {{detail}}",
      evaluateFailed: "पेज पर स्क्रिप्ट का मूल्यांकन फ़ेल हुआ: {{detail}}",
      resultTimeout: "{{timeoutMs}}ms के भीतर कोई म्यूटेशन नतीजा नहीं आया",
      parseFailed: "कैश किया रिस्पॉन्स JSON के रूप में पार्स नहीं हो सका: {{raw}}",
      cacheEmpty: "म्यूटेशन कैश खाली है: रिस्पॉन्स कभी लोड नहीं हुआ",
      requestFailed: "ब्राउज़र टेस्ट फ़ेल हुआ: {{detail}}",
    },
  },

  success: {
    title: "टेस्ट पूरे हुए",
    description: "टेस्ट एक्ज़ीक्यूशन सफलतापूर्वक पूरा हुआ",
  },
};
