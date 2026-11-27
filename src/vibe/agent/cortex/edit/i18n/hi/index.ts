import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "फ़ाइल एडिट करें",
    titleShort: "फ़ाइल एडिट करें",
    description: "फ़ाइल का एक हिस्सा बदलें। टेक्स्ट ढूँढकर बदलें, या खास लाइनें एडिट करें।",
    dynamicTitle: "{{path}} एडिट किया गया",
    status: {
      loading: "एडिट हो रहा है...",
      done: "एडिट हो गया",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "पाथ",
        description: "कौन-सी फ़ाइल एडिट करनी है",
      },
      find: {
        label: "ढूँढें",
        description:
          "ढूँढने वाला टेक्स्ट। हर मैच बदल दिया जाता है (replace_all फ़्लैग की ज़रूरत नहीं)",
      },
      replace: {
        label: "बदलें",
        description: "इससे बदलें",
      },
      startLine: {
        label: "इस लाइन से",
        description: "इस लाइन नंबर से शुरू करें",
      },
      endLine: {
        label: "इस लाइन तक",
        description: "इस लाइन नंबर पर खत्म करें",
      },
      newContent: {
        label: "नया कंटेंट",
        description: "उन लाइनों की जगह यह डालें",
      },
    },
    submitButton: {
      label: "लागू करें",
      loadingText: "लागू हो रहा है...",
    },
    response: {
      path: { content: "पाथ" },
      size: { text: "साइज़" },
      replacements: { text: "बदलाव" },
      updatedAt: { content: "अपडेट हुआ" },
    },
    errors: {
      validation: {
        title: "गलत इनपुट",
        description: "पाथ और ढूँढने/बदलने वाला टेक्स्ट जाँचें",
      },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "इसे एडिट नहीं किया जा सकता",
      },
      notFound: { title: "नहीं मिला", description: "फ़ाइल मौजूद नहीं है" },
      findNotFound:
        '{{path}} में टेक्स्ट नहीं मिला: "{{snippet}}"। cortex-read से फ़ाइल पढ़ें, फिर सही टेक्स्ट के साथ दोबारा कोशिश करें।',
      lineRangeOutOfBounds:
        "लाइन रेंज {{startLine}}-{{endLine}} फ़ाइल से बाहर है। फ़ाइल में {{lineCount}} लाइनें हैं।",
      missingEditStrategy:
        "या तो find + replace दें, या startLine + endLine + newContent दें। मिला: {{provided}}।",
      noParamsProvided: "कुछ नहीं",
      server: { title: "सर्वर एरर", description: "कुछ टूट गया" },
      unknown: { title: "एरर", description: "कुछ गड़बड़ हो गई" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले सेव करें या छोड़ दें",
      },
      conflict: {
        title: "टकराव",
        description: "एडिट के दौरान फ़ाइल बदल गई",
      },
    },
    success: {
      title: "एडिट हो गया",
      description: "बदलाव सेव हो गए",
    },
  },
};
