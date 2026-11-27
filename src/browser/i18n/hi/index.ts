/**
 * Browser API translations (English)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  click: {
    title: "एलिमेंट पर क्लिक करें",
    titleShort: "क्लिक",
    description:
      "स्नैपशॉट से UID के ज़रिए किसी एलिमेंट पर क्लिक करें। पहले take-snapshot से स्नैपशॉट लें।",
    dynamicTitle: "क्लिक: {{uid}}",

    form: {
      label: "एलिमेंट पर क्लिक करें",
      description: "पेज पर किसी ख़ास एलिमेंट पर क्लिक करें",
      fields: {
        uid: {
          label: "एलिमेंट UID",
          description: "पेज कंटेंट स्नैपशॉट से पेज पर एलिमेंट का uid",
          placeholder: "एलिमेंट UID डालें",
        },
        dblClick: {
          label: "डबल क्लिक",
          description: "डबल क्लिक के लिए true रखें। डिफ़ॉल्ट false है",
        },
      },
    },

    response: {
      success: "क्लिक ऑपरेशन सफल",
      result: "क्लिक ऑपरेशन का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "क्लिक ऑपरेशन के दौरान नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको क्लिक ऑपरेशन करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "क्लिक ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया एलिमेंट नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "क्लिक ऑपरेशन के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "क्लिक ऑपरेशन के दौरान कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "क्लिक ऑपरेशन के दौरान टकराव हुआ",
      },
    },

    success: {
      title: "क्लिक ऑपरेशन सफल",
      description: "एलिमेंट पर सफलतापूर्वक क्लिक हुआ",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  "close-page": {
    title: "पेज बंद करें",
    titleShort: "पेज बंद करें",
    description: "मौजूदा सेशन का पेज बंद करें। आख़िरी खुला पेज बंद नहीं हो सकता।",

    form: {
      label: "पेज बंद करें",
      description: "इंडेक्स से कोई ब्राउज़र पेज बंद करें",
      fields: {
        pageIdx: {
          label: "पेज इंडेक्स",
          description: "बंद करने वाले पेज का इंडेक्स। पेज देखने के लिए list_pages कॉल करें",
          placeholder: "पेज इंडेक्स डालें (जैसे 0)",
        },
      },
    },

    response: {
      success: "पेज सफलतापूर्वक बंद हुआ",
      result: "पेज बंद करने का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "पेज बंद करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको पेज बंद करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "पेज बंद करना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया पेज नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "पेज बंद करते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "पेज बंद करते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "पेज बंद करते समय टकराव हुआ",
      },
    },

    success: {
      title: "पेज सफलतापूर्वक बंद हुआ",
      description: "पेज सफलतापूर्वक बंद हो गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      navigationAutomation: "नेविगेशन ऑटोमेशन",
    },
  },
  drag: {
    title: "एलिमेंट ड्रैग करें",
    titleShort: "ड्रैग",
    description: "UID से एक एलिमेंट को दूसरे पर ड्रैग करें। UID take-snapshot से मिलते हैं।",
    dynamicTitle: "ड्रैग: {{from}} → {{to}}",

    form: {
      label: "एलिमेंट ड्रैग करें",
      description: "एक एलिमेंट को दूसरे एलिमेंट पर ड्रैग करें",
      fields: {
        from_uid: {
          label: "स्रोत एलिमेंट UID",
          description: "ड्रैग करने वाले एलिमेंट का uid",
          placeholder: "स्रोत एलिमेंट UID डालें",
        },
        to_uid: {
          label: "टारगेट एलिमेंट UID",
          description: "जिसमें ड्रॉप करना है उस एलिमेंट का uid",
          placeholder: "टारगेट एलिमेंट UID डालें",
        },
      },
    },

    response: {
      success: "ड्रैग ऑपरेशन सफल",
      result: "ड्रैग ऑपरेशन का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "ड्रैग ऑपरेशन के दौरान नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको ड्रैग ऑपरेशन करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "ड्रैग ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया एलिमेंट नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "ड्रैग ऑपरेशन के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "ड्रैग ऑपरेशन के दौरान कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "ड्रैग ऑपरेशन के दौरान टकराव हुआ",
      },
    },

    success: {
      title: "ड्रैग ऑपरेशन सफल",
      description: "एलिमेंट सफलतापूर्वक ड्रैग हुआ",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  fill: {
    title: "भरें",
    titleShort: "भरें",
    description:
      "UID से किसी input/textarea में टेक्स्ट लिखें या ड्रॉपडाउन विकल्प चुनें। UID take-snapshot से मिलते हैं।",
    dynamicTitle: "भरें: {{uid}}",

    form: {
      label: "एलिमेंट भरें",
      description: "फ़ॉर्म एलिमेंट में टेक्स्ट लिखें",
      fields: {
        uid: {
          label: "एलिमेंट UID",
          description: "पेज कंटेंट स्नैपशॉट से पेज पर एलिमेंट का uid",
          placeholder: "एलिमेंट uid डालें",
        },
        value: {
          label: "वैल्यू",
          description: "भरने की वैल्यू",
          placeholder: "भरने की वैल्यू डालें",
        },
      },
    },

    response: {
      success: "भरने का ऑपरेशन सफल",
      result: "भरने के ऑपरेशन का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "भरने के ऑपरेशन के दौरान नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको भरने के ऑपरेशन करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "भरने का ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "भरने के ऑपरेशन के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "भरने के ऑपरेशन के दौरान कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "भरने के ऑपरेशन के दौरान टकराव हुआ",
      },
    },

    success: {
      title: "भरने का ऑपरेशन सफल",
      description: "एलिमेंट सफलतापूर्वक भर गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  "fill-form": {
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
    title: "फ़ॉर्म भरें",
    titleShort: "फ़ॉर्म भरें",
    description:
      "UID ऐरे से एक साथ कई फ़ॉर्म फ़ील्ड भरें। अलग-अलग भरने की कॉल से ज़्यादा कुशल।",

    form: {
      label: "फ़ॉर्म एलिमेंट भरें",
      description: "कई फ़ॉर्म एलिमेंट एक साथ भरें",
      fields: {
        elements: {
          label: "फ़ॉर्म एलिमेंट",
          description: "भरने के लिए स्नैपशॉट से एलिमेंट का ऐरे",
          placeholder: "फ़ॉर्म एलिमेंट डालें (JSON ऐरे)",
          uid: {
            label: "एलिमेंट UID",
            description: "भरने वाले एलिमेंट की यूनिक पहचान",
          },
          value: {
            label: "वैल्यू",
            description: "एलिमेंट में डालने की वैल्यू",
          },
        },
      },
    },

    response: {
      success: "फ़ॉर्म भरने का ऑपरेशन सफल",
      result: {
        title: "नतीजा",
        description: "फ़ॉर्म भरने के ऑपरेशन का नतीजा",
        filled: "सब भर गए",
        filledCount: "भरे गए की गिनती",
        elements: {
          uid: "एलिमेंट UID",
          filled: "सफलतापूर्वक भरे गए",
        },
      },
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "फ़ॉर्म भरते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको फ़ॉर्म भरने के ऑपरेशन करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "फ़ॉर्म भरने का ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "फ़ॉर्म भरते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "फ़ॉर्म भरते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "फ़ॉर्म भरते समय टकराव हुआ",
      },
    },

    success: {
      title: "फ़ॉर्म भरने का ऑपरेशन सफल",
      description: "सभी फ़ॉर्म एलिमेंट सफलतापूर्वक भर गए",
    },
  },
  "handle-dialog": {
    title: "डायलॉग सँभालें",
    titleShort: "डायलॉग",
    description:
      "ब्राउज़र डायलॉग (alert/confirm/prompt) स्वीकार करें या ख़ारिज करें। जो कार्रवाई उसे ट्रिगर करती है, उससे पहले कॉल करें।",
    dynamicTitle: "डायलॉग: {{action}}",

    form: {
      label: "ब्राउज़र डायलॉग सँभालें",
      description: "ब्राउज़र डायलॉग स्वीकार या ख़ारिज करें",
      fields: {
        action: {
          label: "कार्रवाई",
          description: "डायलॉग ख़ारिज करना है या स्वीकार",
          placeholder: "कार्रवाई चुनें",
          options: {
            accept: "स्वीकार करें",
            dismiss: "बंद करें",
          },
        },
        promptText: {
          label: "प्रॉम्प्ट टेक्स्ट",
          description: "डायलॉग में डालने के लिए वैकल्पिक प्रॉम्प्ट टेक्स्ट",
          placeholder: "प्रॉम्प्ट टेक्स्ट डालें (वैकल्पिक)",
        },
      },
    },

    response: {
      success: "डायलॉग सँभालने का ऑपरेशन सफल",
      result: "डायलॉग सँभालने का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "डायलॉग सँभालते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको डायलॉग सँभालने के ऑपरेशन करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "डायलॉग सँभालने का ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "डायलॉग सँभालते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "डायलॉग सँभालते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "डायलॉग सँभालते समय टकराव हुआ",
      },
    },

    success: {
      title: "डायलॉग सफलतापूर्वक सँभाला गया",
      description: "ब्राउज़र डायलॉग सफलतापूर्वक सँभाला गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      dialogAutomation: "डायलॉग ऑटोमेशन",
    },
  },
  hover: {
    title: "होवर",
    titleShort: "होवर",
    description:
      "टूलटिप ट्रिगर करने या छिपे कंट्रोल दिखाने के लिए UID से किसी एलिमेंट पर होवर करें।",
    dynamicTitle: "होवर: {{uid}}",

    form: {
      label: "एलिमेंट पर होवर करें",
      description: "माउस कर्सर को एलिमेंट के ऊपर ले जाएँ",
      fields: {
        uid: {
          label: "एलिमेंट UID",
          description: "पेज कंटेंट स्नैपशॉट से पेज पर एलिमेंट का uid",
          placeholder: "एलिमेंट uid डालें",
        },
      },
    },

    response: {
      success: "होवर ऑपरेशन सफल",
      result: "होवर ऑपरेशन का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "होवर ऑपरेशन के दौरान नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको होवर ऑपरेशन करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "होवर ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "होवर ऑपरेशन के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "होवर ऑपरेशन के दौरान कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "होवर ऑपरेशन के दौरान टकराव हुआ",
      },
    },

    success: {
      title: "होवर ऑपरेशन सफल",
      description: "एलिमेंट पर सफलतापूर्वक होवर हुआ",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  "press-key": {
    title: "की दबाएँ",
    titleShort: "की दबाएँ",
    dynamicTitle: "की: {{key}}",
    description: "कोई की या की कॉम्बिनेशन दबाएँ",
    form: {
      label: "की दबाएँ",
      description: "कोई की या की कॉम्बिनेशन दबाएँ",
      fields: {
        key: {
          label: "की",
          description:
            "कोई की या कॉम्बिनेशन (जैसे Enter, Control+A, Control+Shift+R)",
          placeholder: "की या कॉम्बिनेशन डालें",
        },
      },
    },
    response: {
      success: "की दबाने का ऑपरेशन सफल",
      result: "की दबाने के ऑपरेशन का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "की दबाते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको की दबाने के ऑपरेशन करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "की दबाने का ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "की दबाते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "की दबाते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "की दबाते समय टकराव हुआ",
      },
    },
    success: {
      title: "की दबाने का ऑपरेशन सफल",
      description: "की सफलतापूर्वक दब गई",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  "upload-file": {
    title: "फ़ाइल अपलोड करें",
    titleShort: "अपलोड",
    dynamicTitle: "अपलोड: {{file}}",
    description: "दिए गए एलिमेंट के ज़रिए फ़ाइल अपलोड करें",
    form: {
      label: "फ़ाइल अपलोड करें",
      description: "फ़ाइल इनपुट एलिमेंट पर फ़ाइल अपलोड करें",
      fields: {
        uid: {
          label: "एलिमेंट UID",
          description:
            "फ़ाइल इनपुट एलिमेंट का uid या वो एलिमेंट जो फ़ाइल चुनने वाला खोलेगा",
          placeholder: "एलिमेंट uid डालें",
        },
        filePaths: {
          label: "फ़ाइल पाथ",
          description:
            "अपलोड करने वाली फ़ाइल का पूरा पाथ, या मल्टी-फ़ाइल इनपुट के लिए कई। प्रोजेक्ट डायरेक्टरी या OS temp डायरेक्टरी के अंदर होना चाहिए।",
          placeholder: "/tmp/photo.png",
        },
        includeSnapshot: {
          label: "स्नैपशॉट शामिल करें",
          description: "अपलोड के बाद पेज स्नैपशॉट लौटाएँ",
        },
      },
    },
    response: {
      success: "फ़ाइल अपलोड ऑपरेशन सफल",
      result: "फ़ाइल अपलोड ऑपरेशन का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "फ़ाइल अपलोड के दौरान नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको फ़ाइल अपलोड करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "फ़ाइल अपलोड ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "फ़ाइल अपलोड के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "फ़ाइल अपलोड के दौरान कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "फ़ाइल अपलोड के दौरान टकराव हुआ",
      },
    },
    success: {
      title: "फ़ाइल अपलोड ऑपरेशन सफल",
      description: "फ़ाइल सफलतापूर्वक अपलोड हुई",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  "list-pages": {
    title: "पेज की लिस्ट",
    titleShort: "पेज",
    description:
      "सभी खुले ब्राउज़र पेज उनके URL के साथ दिखाएँ। हर कॉलर सेशन का एक टैब होता है; new-page उसे बदल देता है।",
    form: {
      label: "पेज की लिस्ट",
      description: "सभी खुले ब्राउज़र पेज पाएँ",
      fields: {},
    },
    response: {
      success: "पेज लिस्टिंग ऑपरेशन सफल",
      result: {
        title: "नतीजा",
        description: "पेज लिस्टिंग का नतीजा",
        pages: {
          idx: "इंडेक्स",
          title: "टाइटल",
          url: "URL",
          active: "एक्टिव",
        },
        totalCount: "कुल गिनती",
      },
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "पेज लिस्ट करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको पेज लिस्ट करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "पेज लिस्टिंग ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "पेज लिस्ट करते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "पेज लिस्ट करते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "पेज लिस्ट करते समय टकराव हुआ",
      },
    },
    success: {
      title: "पेज सफलतापूर्वक लिस्ट हुए",
      description: "खुले पेज सफलतापूर्वक लिस्ट हो गए",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      navigationAutomation: "नेविगेशन ऑटोमेशन",
    },
  },
  "navigate-page": {
    title: "पेज नेविगेट करें",
    titleShort: "नेविगेट",
    dynamicTitle: "नेविगेट: {{target}}",
    description:
      "सेशन पेज को URL पर, पीछे, आगे या रीलोड पर ले जाएँ। उसी टैब में नेविगेशन के लिए new-page की जगह इसे चुनें।",
    form: {
      label: "पेज नेविगेट करें",
      description: "मौजूदा चुने पेज को URL पर या हिस्ट्री से ले जाएँ",
      fields: {
        type: {
          label: "नेविगेशन टाइप",
          description: "URL से, हिस्ट्री में पीछे या आगे, या रीलोड से नेविगेट करें",
          placeholder: "नेविगेशन टाइप चुनें",
          options: {
            url: "URL",
            back: "वापस",
            forward: "आगे",
            reload: "रीलोड",
          },
        },
        url: {
          label: "URL",
          description: "टारगेट URL (सिर्फ़ type=url के लिए)",
          placeholder: "URL डालें",
        },
        ignoreCache: {
          label: "कैश अनदेखा करें",
          description: "रीलोड पर कैश अनदेखा करना है या नहीं",
          placeholder: "कैश अनदेखा करें",
        },
        timeout: {
          label: "टाइमआउट",
          description: "मिलीसेकंड में अधिकतम इंतज़ार (0 डिफ़ॉल्ट के लिए)",
          placeholder: "टाइमआउट डालें",
        },
      },
    },
    response: {
      success: "नेविगेशन ऑपरेशन सफल",
      result: "नेविगेशन का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेविगेशन के दौरान नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको पेज नेविगेट करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "पेज नेविगेशन ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "नेविगेशन के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "नेविगेशन के दौरान कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "नेविगेशन के दौरान टकराव हुआ",
      },
    },
    success: {
      title: "नेविगेशन सफल",
      description: "पेज सफलतापूर्वक नेविगेट हुआ",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      navigationAutomation: "नेविगेशन ऑटोमेशन",
    },
  },
  "new-page": {
    title: "नया पेज",
    titleShort: "नया पेज",
    dynamicTitle: "नया पेज: {{url}}",
    description:
      "URL पर नया ब्राउज़र टैब खोलें। सेशन नए टैब को अपना लेता है, आगे की सभी कॉल उसी पर चलती हैं।",
    form: {
      label: "नया पेज",
      description: "नया ब्राउज़र पेज बनाएँ और URL लोड करें",
      fields: {
        url: {
          label: "URL",
          description: "नए पेज में लोड करने वाला URL",
          placeholder: "URL डालें",
        },
        replacePage: {
          label: "पेज बदलें",
          description: "नया पेज खोलने से पहले मौजूदा पेज बंद करें",
        },
        background: {
          label: "बैकग्राउंड",
          description: "पेज को सामने लाए बिना खोलें",
        },
        timeout: {
          label: "टाइमआउट",
          description: "मिलीसेकंड में अधिकतम इंतज़ार (0 डिफ़ॉल्ट के लिए)",
          placeholder: "टाइमआउट डालें",
        },
      },
    },
    response: {
      success: "नया पेज बनाने का ऑपरेशन सफल",
      result: "नया पेज बनाने का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नया पेज बनाते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको नए पेज बनाने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "नया पेज बनाना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "नया पेज बनाते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "नया पेज बनाते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "नया पेज बनाते समय टकराव हुआ",
      },
    },
    success: {
      title: "नया पेज सफलतापूर्वक बना",
      description: "नया पेज सफलतापूर्वक बन गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      navigationAutomation: "नेविगेशन ऑटोमेशन",
    },
  },
  "select-page": {
    title: "पेज चुनें",
    titleShort: "पेज चुनें",
    dynamicTitle: "चुनें: {{page}}",
    description:
      "सेशन को इंडेक्स से किसी ख़ास पेज पर ले जाएँ। इंडेक्स खोजने के लिए list-pages इस्तेमाल करें। सेशन का ट्रैक किया टैब अपडेट नहीं करता।",
    form: {
      label: "पेज चुनें",
      description: "इंडेक्स से कोई पेज चुनें",
      fields: {
        pageIdx: {
          label: "पेज इंडेक्स",
          description: "चुनने वाले पेज का इंडेक्स (पेज देखने के लिए list_pages कॉल करें)",
          placeholder: "पेज इंडेक्स डालें",
        },
      },
    },
    response: {
      success: "पेज चुनने का ऑपरेशन सफल",
      result: "पेज चुनने का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "पेज चुनते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको पेज चुनने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "पेज चुनना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "पेज चुनते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "पेज चुनते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "पेज चुनते समय टकराव हुआ",
      },
    },
    success: {
      title: "पेज सफलतापूर्वक चुना गया",
      description: "पेज सफलतापूर्वक चुन लिया गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      navigationAutomation: "नेविगेशन ऑटोमेशन",
    },
  },
  emulate: {
    title: "एम्युलेट करें",
    titleShort: "एम्युलेट करें",
    description:
      "मौजूदा पेज पर नेटवर्क स्थितियाँ (offline/3G/4G) या CPU थ्रॉटलिंग एम्युलेट करें। हर कॉल निरपेक्ष है: छोड़े गए फ़ील्ड रीसेट हो जाते हैं। यूज़र एजेंट ओवरराइड अगले नेविगेशन से लागू होता है, इसलिए सेट करने के बाद पेज रीलोड करें।",
    dynamicTitle: "एम्युलेट: {{config}}",
    form: {
      label: "डिवाइस एम्युलेट करें",
      description: "नेटवर्क स्थितियाँ और CPU थ्रॉटलिंग एम्युलेट करें",
      fields: {
        networkConditions: {
          label: "नेटवर्क स्थितियाँ",
          description: "नेटवर्क थ्रॉटल करें (बंद करने के लिए कोई एम्युलेशन नहीं चुनें)",
          placeholder: "नेटवर्क स्थिति चुनें",
          options: {
            noEmulation: "कोई एम्युलेशन नहीं",
            offline: "ऑफ़लाइन",
            slow3g: "धीमा 3G",
            fast3g: "तेज़ 3G",
            slow4g: "धीमा 4G",
            fast4g: "तेज़ 4G",
          },
        },
        cpuThrottlingRate: {
          label: "CPU थ्रॉटलिंग दर",
          description: "CPU धीमा करने का गुणक (बंद करने के लिए 1, 1-20)",
          placeholder: "थ्रॉटलिंग दर डालें",
        },
      },
    },
    response: {
      success: "एम्युलेशन ऑपरेशन सफल",
      result: "एम्युलेशन ऑपरेशन का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "एम्युलेशन के दौरान नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको डिवाइस फ़ीचर एम्युलेट करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "डिवाइस एम्युलेशन ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "एम्युलेशन के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "एम्युलेशन के दौरान कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "एम्युलेशन के दौरान टकराव हुआ",
      },
    },
    success: {
      title: "एम्युलेशन सफल",
      description: "डिवाइस फ़ीचर सफलतापूर्वक एम्युलेट हुए",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      performanceAutomation: "परफ़ॉर्मेंस ऑटोमेशन",
    },
  },
  "resize-page": {
    title: "पेज रीसाइज़ करें",
    titleShort: "रीसाइज़",
    dynamicTitle: "रीसाइज़: {{width}}x{{height}}",
    description: "ब्राउज़र व्यूपोर्ट को पिक्सल में तय माप पर रीसाइज़ करें।",
    form: {
      label: "पेज रीसाइज़ करें",
      description: "पेज को बताई माप पर रीसाइज़ करें",
      fields: {
        width: {
          label: "चौड़ाई",
          description: "पिक्सल में पेज की चौड़ाई",
          placeholder: "चौड़ाई डालें",
        },
        height: {
          label: "ऊँचाई",
          description: "पिक्सल में पेज की ऊँचाई",
          placeholder: "ऊँचाई डालें",
        },
      },
    },
    response: {
      success: "पेज रीसाइज़ ऑपरेशन सफल",
      result: "पेज रीसाइज़ ऑपरेशन का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "पेज रीसाइज़ करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको पेज रीसाइज़ करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "पेज रीसाइज़ ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "पेज रीसाइज़ करते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "पेज रीसाइज़ करते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "पेज रीसाइज़ करते समय टकराव हुआ",
      },
    },
    success: {
      title: "पेज सफलतापूर्वक रीसाइज़ हुआ",
      description: "पेज सफलतापूर्वक रीसाइज़ हो गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      viewportAutomation: "व्यूपोर्ट ऑटोमेशन",
    },
  },
  "evaluate-script": {
    title: "स्क्रिप्ट इवैल्यूएट करें",
    titleShort: "स्क्रिप्ट इवैल",
    description:
      "पेज में JavaScript चलाएँ और नतीजा लौटाएँ। उस स्टेट को पढ़ने के लिए जो take-snapshot नहीं दिखाता।",
    dynamicTitle: "स्क्रिप्ट: {{snippet}}",
    form: {
      label: "स्क्रिप्ट इवैल्यूएट करें",
      description: "ब्राउज़र पेज में JavaScript चलाएँ",
      fields: {
        function: {
          label: "फ़ंक्शन",
          description: "चलाने वाला JavaScript फ़ंक्शन डेफ़िनिशन",
          placeholder: "() => { return document.title; }",
        },
        args: {
          label: "आर्गुमेंट",
          description: "फ़ंक्शन को देने के लिए आर्गुमेंट (एलिमेंट UID) की वैकल्पिक लिस्ट",
          placeholder: '[{"uid": "element-uid"}]',
          uid: {
            label: "एलिमेंट UID",
            description: "पेज पर एलिमेंट की यूनिक पहचान",
          },
        },
      },
    },
    response: {
      success: "स्क्रिप्ट इवैल्यूएशन ऑपरेशन सफल",
      result: {
        title: "नतीजा",
        description: "स्क्रिप्ट इवैल्यूएशन का नतीजा",
        executed: "चलाए गए",
        result: "रिटर्न वैल्यू",
      },
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "स्क्रिप्ट इवैल्यूएशन के दौरान नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको स्क्रिप्ट इवैल्यूएट करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "स्क्रिप्ट इवैल्यूएशन ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "स्क्रिप्ट इवैल्यूएशन के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "स्क्रिप्ट इवैल्यूएशन के दौरान कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "स्क्रिप्ट इवैल्यूएशन के दौरान टकराव हुआ",
      },
    },
    success: {
      title: "स्क्रिप्ट सफलतापूर्वक इवैल्यूएट हुई",
      description: "JavaScript सफलतापूर्वक चली",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      scriptExecution: "स्क्रिप्ट एक्ज़ीक्यूशन",
    },
  },
  "get-console-message": {
    title: "कंसोल मैसेज पाएँ",
    titleShort: "कंसोल मैसेज",
    description:
      "list-console-messages से msgid के ज़रिए किसी ख़ास कंसोल मैसेज की पूरी बॉडी पाएँ।",
    dynamicTitle: "कंसोल #{{id}}",
    form: {
      label: "कंसोल मैसेज पाएँ",
      description: "कोई ख़ास कंसोल मैसेज पाएँ",
      fields: {
        msgid: {
          label: "मैसेज ID",
          description: "लिस्ट किए कंसोल मैसेज में से किसी कंसोल मैसेज का msgid",
          placeholder: "मैसेज ID डालें",
        },
      },
    },
    response: {
      success: "कंसोल मैसेज पाने का ऑपरेशन सफल",
      result: "कंसोल मैसेज पाने का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "कंसोल मैसेज पाते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको कंसोल मैसेज पाने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "कंसोल मैसेज पाना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "कंसोल मैसेज पाते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कंसोल मैसेज पाते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "कंसोल मैसेज पाते समय टकराव हुआ",
      },
    },
    success: {
      title: "कंसोल मैसेज सफलतापूर्वक मिला",
      description: "कंसोल मैसेज सफलतापूर्वक मिल गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      debugging: "डीबगिंग",
    },
  },
  "list-console-messages": {
    title: "कंसोल मैसेज की लिस्ट",
    titleShort: "कंसोल लॉग",
    description:
      "पिछले नेविगेशन के बाद के कंसोल मैसेज दिखाएँ। टाइप (error/warn/log) से फ़िल्टर करें। JS एरर पकड़ने के लिए कार्रवाइयों के बाद इस्तेमाल करें।",
    form: {
      label: "कंसोल मैसेज की लिस्ट",
      description: "ब्राउज़र पेज के सभी कंसोल मैसेज पाएँ",
      fields: {
        includePreservedMessages: {
          label: "सहेजे मैसेज शामिल करें",
          description: "पिछले 3 नेविगेशन के सहेजे मैसेज लौटाने के लिए true रखें",
          placeholder: "false",
        },
        pageIdx: {
          label: "पेज इंडेक्स",
          description: "लौटाने वाला पेज नंबर (0 से शुरू, पहले पेज के लिए छोड़ दें)",
          placeholder: "पेज इंडेक्स डालें",
        },
        pageSize: {
          label: "पेज साइज़",
          description:
            "लौटाए जाने वाले मैसेज की अधिकतम संख्या (सभी लौटाने के लिए छोड़ दें)",
          placeholder: "पेज साइज़ डालें",
        },
        types: {
          label: "मैसेज टाइप",
          description:
            "सिर्फ़ बताए टाइप के मैसेज लौटाने के लिए फ़िल्टर करें (सभी के लिए छोड़ दें)",
          placeholder: "मैसेज टाइप चुनें",
          options: {
            log: "लॉग",
            debug: "डीबग",
            info: "जानकारी",
            error: "एरर",
            warn: "चेतावनी",
            dir: "Dir",
            dirxml: "Dirxml",
            table: "टेबल",
            trace: "ट्रेस",
            clear: "क्लियर",
            startGroup: "ग्रुप शुरू",
            startGroupCollapsed: "समेटा ग्रुप शुरू",
            endGroup: "ग्रुप ख़त्म",
            assert: "असर्ट",
            profile: "प्रोफ़ाइल",
            profileEnd: "प्रोफ़ाइल ख़त्म",
            count: "गिनती",
            timeEnd: "टाइम ख़त्म",
            verbose: "वर्बोस",
            issue: "जारी करें",
          },
        },
      },
    },
    response: {
      success: "कंसोल मैसेज सफलतापूर्वक मिले",
      result: {
        title: "नतीजा",
        description: "कंसोल मैसेज लिस्ट का नतीजा",
        messages: {
          msgid: "मैसेज ID",
          type: "टाइप",
          text: "मैसेज",
          timestamp: "टाइमस्टैम्प",
        },
        totalCount: "कुल गिनती",
      },
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "कंसोल मैसेज लिस्ट करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको कंसोल मैसेज लिस्ट करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "कंसोल मैसेज लिस्ट करना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "कंसोल मैसेज लिस्ट करते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कंसोल मैसेज लिस्ट करते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "कंसोल मैसेज लिस्ट करते समय टकराव हुआ",
      },
    },
    success: {
      title: "कंसोल मैसेज सफलतापूर्वक मिले",
      description: "कंसोल मैसेज सफलतापूर्वक मिल गए",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      debugging: "डीबगिंग",
    },
  },
  "get-network-request": {
    title: "नेटवर्क रिक्वेस्ट पाएँ",
    titleShort: "नेटवर्क रिक्वेस्ट",
    description:
      "list-network-requests से reqid के ज़रिए किसी रिक्वेस्ट का पूरा ब्योरा (हेडर, बॉडी) पाएँ।",
    dynamicTitle: "नेटवर्क #{{id}}",
    form: {
      label: "नेटवर्क रिक्वेस्ट पाएँ",
      description: "कोई ख़ास नेटवर्क रिक्वेस्ट या अभी चुनी हुई पाएँ",
      fields: {
        reqid: {
          label: "रिक्वेस्ट ID",
          description:
            "नेटवर्क रिक्वेस्ट का reqid (DevTools में अभी चुनी हुई पाने के लिए छोड़ दें)",
          placeholder: "रिक्वेस्ट ID डालें",
        },
        maxBodyLength: {
          label: "अधिकतम बॉडी लंबाई",
          description:
            "इनलाइन रिक्वेस्ट/रिस्पॉन्स बॉडी से लौटाए जाने वाले अधिकतम कैरेक्टर। इससे लंबी बॉडी सूचना के साथ काट दी जाती हैं। कोई सीमा न रखने के लिए छोड़ दें।",
          placeholder: "जैसे 10000",
        },
      },
    },
    response: {
      success: "नेटवर्क रिक्वेस्ट सफलतापूर्वक मिली",
      result: "नेटवर्क रिक्वेस्ट पाने का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क रिक्वेस्ट पाते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको नेटवर्क रिक्वेस्ट पाने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "नेटवर्क रिक्वेस्ट पाना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "नेटवर्क रिक्वेस्ट पाते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "नेटवर्क रिक्वेस्ट पाते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "नेटवर्क रिक्वेस्ट पाते समय टकराव हुआ",
      },
    },
    success: {
      title: "नेटवर्क रिक्वेस्ट सफलतापूर्वक मिली",
      description: "नेटवर्क रिक्वेस्ट सफलतापूर्वक मिल गई",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      networkAnalysis: "नेटवर्क विश्लेषण",
    },
  },
  "list-network-requests": {
    title: "नेटवर्क रिक्वेस्ट की लिस्ट",
    titleShort: "नेटवर्क लॉग",
    description:
      "पिछले नेविगेशन के बाद की नेटवर्क रिक्वेस्ट दिखाएँ। रिसोर्स टाइप (fetch/xhr/doc) से फ़िल्टर करें। API कॉल जाँचने के लिए इस्तेमाल करें।",
    form: {
      label: "नेटवर्क रिक्वेस्ट की लिस्ट",
      description: "ब्राउज़र पेज की सभी नेटवर्क रिक्वेस्ट पाएँ",
      fields: {
        includePreservedRequests: {
          label: "सहेजी रिक्वेस्ट शामिल करें",
          description: "पिछले 3 नेविगेशन की सहेजी रिक्वेस्ट लौटाने के लिए true रखें",
          placeholder: "false",
        },
        pageIdx: {
          label: "पेज इंडेक्स",
          description: "लौटाने वाला पेज नंबर (0 से शुरू, पहले पेज के लिए छोड़ दें)",
          placeholder: "पेज इंडेक्स डालें",
        },
        pageSize: {
          label: "पेज साइज़",
          description:
            "लौटाई जाने वाली रिक्वेस्ट की अधिकतम संख्या (सभी लौटाने के लिए छोड़ दें)",
          placeholder: "पेज साइज़ डालें",
        },
        resourceTypes: {
          label: "रिसोर्स टाइप",
          description:
            "सिर्फ़ बताए रिसोर्स टाइप की रिक्वेस्ट लौटाने के लिए फ़िल्टर करें (सभी के लिए छोड़ दें)",
          placeholder: "रिसोर्स टाइप चुनें",
          options: {
            document: "दस्तावेज़",
            stylesheet: "स्टाइलशीट",
            image: "इमेज",
            media: "मीडिया",
            font: "फ़ॉन्ट",
            script: "स्क्रिप्ट",
            texttrack: "टेक्स्ट ट्रैक",
            xhr: "XHR",
            fetch: "Fetch",
            prefetch: "Prefetch",
            eventsource: "इवेंट सोर्स",
            websocket: "WebSocket",
            manifest: "मैनिफ़ेस्ट",
            signedexchange: "साइन्ड एक्सचेंज",
            ping: "पिंग",
            cspviolationreport: "CSP उल्लंघन रिपोर्ट",
            preflight: "प्रीफ़्लाइट",
            fedcm: "FedCM",
            other: "अन्य",
          },
        },
      },
    },
    response: {
      success: "नेटवर्क रिक्वेस्ट सफलतापूर्वक मिलीं",
      result: {
        title: "नतीजा",
        description: "नेटवर्क रिक्वेस्ट लिस्ट का नतीजा",
        requests: {
          reqid: "रिक्वेस्ट ID",
          url: "URL",
          method: "मेथड",
          status: "स्टेटस",
          type: "टाइप",
        },
        totalCount: "कुल गिनती",
      },
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क रिक्वेस्ट लिस्ट करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको नेटवर्क रिक्वेस्ट लिस्ट करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "नेटवर्क रिक्वेस्ट लिस्ट करना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "नेटवर्क रिक्वेस्ट लिस्ट करते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "नेटवर्क रिक्वेस्ट लिस्ट करते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "नेटवर्क रिक्वेस्ट लिस्ट करते समय टकराव हुआ",
      },
    },
    success: {
      title: "नेटवर्क रिक्वेस्ट सफलतापूर्वक मिलीं",
      description: "नेटवर्क रिक्वेस्ट सफलतापूर्वक मिल गईं",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      networkAnalysis: "नेटवर्क विश्लेषण",
    },
  },
  "performance-analyze-insight": {
    title: "परफ़ॉर्मेंस इनसाइट विश्लेषण",
    titleShort: "परफ़ॉर्मेंस इनसाइट",
    description:
      "ट्रेस के नतीजे से किसी ख़ास इनसाइट में गहराई से जाएँ (जैसे DocumentLatency, LCPBreakdown)। performance-stop-trace के बाद कॉल करें।",
    form: {
      label: "परफ़ॉर्मेंस इनसाइट विश्लेषण",
      description: "किसी ख़ास परफ़ॉर्मेंस इनसाइट की विस्तृत जानकारी पाएँ",
      fields: {
        insightSetId: {
          label: "इनसाइट सेट ID",
          description:
            "ख़ास इनसाइट सेट की id (सिर्फ़ उपलब्ध इनसाइट सेट की लिस्ट में दी गई ids इस्तेमाल करें)",
          placeholder: "इनसाइट सेट ID डालें",
        },
        insightName: {
          label: "इनसाइट का नाम",
          description:
            "जिस इनसाइट के बारे में और जानना है उसका नाम (जैसे DocumentLatency या LCPBreakdown)",
          placeholder: "इनसाइट का नाम डालें",
        },
      },
    },
    response: {
      success: "परफ़ॉर्मेंस इनसाइट का विश्लेषण सफल",
      result: "परफ़ॉर्मेंस इनसाइट विश्लेषण का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "परफ़ॉर्मेंस इनसाइट का विश्लेषण करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको परफ़ॉर्मेंस इनसाइट का विश्लेषण करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "परफ़ॉर्मेंस इनसाइट का विश्लेषण मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "परफ़ॉर्मेंस इनसाइट का विश्लेषण करते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "परफ़ॉर्मेंस इनसाइट का विश्लेषण करते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "परफ़ॉर्मेंस इनसाइट का विश्लेषण करते समय टकराव हुआ",
      },
    },
    success: {
      title: "परफ़ॉर्मेंस इनसाइट का विश्लेषण सफल",
      description: "परफ़ॉर्मेंस इनसाइट का विश्लेषण सफलतापूर्वक हुआ",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      performanceAutomation: "परफ़ॉर्मेंस ऑटोमेशन",
    },
  },
  "performance-start-trace": {
    title: "परफ़ॉर्मेंस ट्रेस शुरू करें",
    titleShort: "ट्रेस शुरू करें",
    description:
      "कोर वेब वाइटल और लोड मेट्रिक कैप्चर करने के लिए परफ़ॉर्मेंस ट्रेस शुरू करें। उसके बाद performance-stop-trace चलाएँ।",
    form: {
      label: "परफ़ॉर्मेंस ट्रेस शुरू करें",
      description: "ब्राउज़र पेज की परफ़ॉर्मेंस मेट्रिक रिकॉर्ड करना शुरू करें",
      fields: {
        reload: {
          label: "पेज रीलोड करें",
          description:
            "तय करता है कि ट्रेसिंग शुरू होने के बाद पेज अपने आप रीलोड हो या नहीं",
          placeholder: "true",
        },
        autoStop: {
          label: "ऑटो स्टॉप",
          description: "तय करता है कि ट्रेस रिकॉर्डिंग अपने आप रुके या नहीं",
          placeholder: "true",
        },
      },
    },
    response: {
      success: "परफ़ॉर्मेंस ट्रेस सफलतापूर्वक शुरू हुआ",
      result: "परफ़ॉर्मेंस ट्रेस शुरू होने का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "परफ़ॉर्मेंस ट्रेस शुरू करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको परफ़ॉर्मेंस ट्रेस शुरू करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "परफ़ॉर्मेंस ट्रेस शुरू करना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "परफ़ॉर्मेंस ट्रेस शुरू करते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "परफ़ॉर्मेंस ट्रेस शुरू करते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "परफ़ॉर्मेंस ट्रेस शुरू करते समय टकराव हुआ",
      },
    },
    success: {
      title: "परफ़ॉर्मेंस ट्रेस सफलतापूर्वक शुरू हुआ",
      description: "परफ़ॉर्मेंस ट्रेस सफलतापूर्वक शुरू हो गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      performanceAutomation: "परफ़ॉर्मेंस ऑटोमेशन",
    },
  },
  "performance-stop-trace": {
    title: "परफ़ॉर्मेंस ट्रेस रोकें",
    titleShort: "ट्रेस रोकें",
    description:
      "चालू ट्रेस रोकें और परफ़ॉर्मेंस मेट्रिक के साथ performance-analyze-insight के लिए इनसाइट सेट ID लौटाएँ।",
    form: {
      label: "परफ़ॉर्मेंस ट्रेस रोकें",
      description: "चालू परफ़ॉर्मेंस ट्रेस रिकॉर्डिंग रोकें",
      fields: {},
    },
    response: {
      success: "परफ़ॉर्मेंस ट्रेस सफलतापूर्वक रुका",
      result: "मेट्रिक के साथ परफ़ॉर्मेंस ट्रेस रुकने का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "परफ़ॉर्मेंस ट्रेस रोकते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको परफ़ॉर्मेंस ट्रेस रोकने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "परफ़ॉर्मेंस ट्रेस रोकना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "परफ़ॉर्मेंस ट्रेस रोकते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "परफ़ॉर्मेंस ट्रेस रोकते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "परफ़ॉर्मेंस ट्रेस रोकते समय टकराव हुआ",
      },
    },
    success: {
      title: "परफ़ॉर्मेंस ट्रेस सफलतापूर्वक रुका",
      description: "परफ़ॉर्मेंस ट्रेस सफलतापूर्वक रुक गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      performanceAutomation: "परफ़ॉर्मेंस ऑटोमेशन",
    },
  },
  "take-screenshot": {
    title: "स्क्रीनशॉट लें",
    titleShort: "स्क्रीनशॉट",
    dynamicTitle: "स्क्रीनशॉट: {{target}}",
    description:
      "पेज या किसी ख़ास एलिमेंट का विज़ुअल स्क्रीनशॉट लें। इमेज लौटाता है। UI की स्थिति जाँचने के लिए इस्तेमाल करें।",
    form: {
      label: "स्क्रीनशॉट लें",
      description: "ब्राउज़र पेज या एलिमेंट का स्क्रीनशॉट कैप्चर करें",
      fields: {
        uid: {
          label: "एलिमेंट UID",
          description:
            "स्क्रीनशॉट लेने वाले एलिमेंट का uid (पूरे पेज का स्क्रीनशॉट लेने के लिए छोड़ दें)",
          placeholder: "एलिमेंट uid डालें",
        },
        fullPage: {
          label: "पूरा पेज",
          description:
            "true रखने पर मौजूदा दिखते व्यूपोर्ट की जगह पूरे पेज का स्क्रीनशॉट लेता है (uid के साथ नहीं चलता)",
          placeholder: "false",
        },
        format: {
          label: "फ़ॉर्मेट",
          description: "स्क्रीनशॉट सेव करने का फ़ॉर्मेट (डिफ़ॉल्ट: png)",
          placeholder: "png",
          options: {
            png: "PNG",
            jpeg: "JPEG",
            webp: "WebP",
          },
        },
        quality: {
          label: "क्वालिटी",
          description:
            "JPEG और WebP के लिए कम्प्रेशन क्वालिटी (0-100)। ज़्यादा वैल्यू मतलब बेहतर क्वालिटी पर बड़ी फ़ाइल। PNG के लिए अनदेखी।",
          placeholder: "80",
        },
        filePath: {
          label: "फ़ाइल पाथ",
          description:
            "वो पूरा पाथ, या मौजूदा वर्किंग डायरेक्टरी के सापेक्ष पाथ, जहाँ स्क्रीनशॉट को जवाब में जोड़ने की जगह सेव करना है",
          placeholder: "/path/to/screenshot.png",
        },
      },
    },
    response: {
      success: "स्क्रीनशॉट सफलतापूर्वक कैप्चर हुआ",
      result: "स्क्रीनशॉट कैप्चर का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "स्क्रीनशॉट कैप्चर करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको स्क्रीनशॉट कैप्चर करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "स्क्रीनशॉट कैप्चर करना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "स्क्रीनशॉट कैप्चर करते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "स्क्रीनशॉट कैप्चर करते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "स्क्रीनशॉट कैप्चर करते समय टकराव हुआ",
      },
    },
    success: {
      title: "स्क्रीनशॉट सफलतापूर्वक कैप्चर हुआ",
      description: "स्क्रीनशॉट सफलतापूर्वक कैप्चर हो गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      captureAutomation: "कैप्चर ऑटोमेशन",
    },
  },
  "take-snapshot": {
    title: "स्नैपशॉट लें",
    titleShort: "स्नैपशॉट",
    description:
      "पेज का a11y ट्री टेक्स्ट के रूप में पाएँ। click/fill/drag से पहले ज़रूरी है, क्योंकि एलिमेंट UID यहीं से मिलते हैं।",
    form: {
      label: "स्नैपशॉट लें",
      description: "a11y ट्री के आधार पर ब्राउज़र पेज का टेक्स्ट स्नैपशॉट कैप्चर करें",
      fields: {
        verbose: {
          label: "वर्बोस",
          description:
            "पूरे a11y ट्री की सारी उपलब्ध जानकारी शामिल करनी है या नहीं (डिफ़ॉल्ट: false)",
          placeholder: "false",
        },
        filePath: {
          label: "फ़ाइल पाथ",
          description:
            "वो पूरा पाथ, या मौजूदा वर्किंग डायरेक्टरी के सापेक्ष पाथ, जहाँ स्नैपशॉट को जवाब में जोड़ने की जगह सेव करना है",
          placeholder: "/path/to/snapshot.txt",
        },
      },
    },
    response: {
      success: "स्नैपशॉट सफलतापूर्वक कैप्चर हुआ",
      result: "स्नैपशॉट कैप्चर का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "स्नैपशॉट कैप्चर करते समय नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको स्नैपशॉट कैप्चर करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "स्नैपशॉट कैप्चर करना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "स्नैपशॉट कैप्चर करते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "स्नैपशॉट कैप्चर करते समय कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "स्नैपशॉट कैप्चर करते समय टकराव हुआ",
      },
    },
    success: {
      title: "स्नैपशॉट सफलतापूर्वक कैप्चर हुआ",
      description: "स्नैपशॉट सफलतापूर्वक कैप्चर हो गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      captureAutomation: "कैप्चर ऑटोमेशन",
    },
  },
  "wait-for": {
    title: "इंतज़ार करें",
    titleShort: "इंतज़ार",
    dynamicTitle: "इंतज़ार: {{text}}",
    description:
      "पेज पर किसी ख़ास टेक्स्ट के आने का इंतज़ार करें। नेविगेशन या async अपडेट ट्रिगर करने वाली कार्रवाइयों के बाद इस्तेमाल करें।",

    form: {
      label: "टेक्स्ट का इंतज़ार करें",
      description: "पेज पर किसी ख़ास टेक्स्ट के आने का इंतज़ार करें",
      fields: {
        text: {
          label: "टेक्स्ट",
          description: "पेज पर दिखने वाला टेक्स्ट",
          placeholder: "इंतज़ार वाला टेक्स्ट डालें",
        },
        timeout: {
          label: "टाइमआउट",
          description:
            "मिलीसेकंड में अधिकतम इंतज़ार। 0 रखने पर डिफ़ॉल्ट टाइमआउट इस्तेमाल होता है",
          placeholder: "टाइमआउट डालें (ms)",
        },
        captureSnapshot: {
          label: "स्नैपशॉट कैप्चर करें",
          description:
            "चालू होने पर जवाब में पूरा एक्सेसिबिलिटी स्नैपशॉट शामिल होता है। जवाब छोटे रखने के लिए डिफ़ॉल्ट रूप से बंद।",
        },
      },
    },

    response: {
      success: "इंतज़ार ऑपरेशन सफल",
      result: "इंतज़ार ऑपरेशन का नतीजा",
      error: "एरर मैसेज",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },

    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "इंतज़ार के दौरान नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको इंतज़ार ऑपरेशन करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "इंतज़ार ऑपरेशन मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "इंतज़ार के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "इंतज़ार के दौरान कोई अज्ञात एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "इंतज़ार के दौरान टकराव हुआ",
      },
    },

    success: {
      title: "इंतज़ार ऑपरेशन सफल",
      description: "बताया टेक्स्ट पेज पर आ गया",
    },
    category: "ब्राउज़र",
    tags: {
      browserAutomation: "ब्राउज़र ऑटोमेशन",
      waitAutomation: "वेट ऑटोमेशन",
    },
  },
  title: "Chrome DevTools MCP टूल",
  description:
    "Chrome DevTools से ब्राउज़र ऑटोमेशन। फ़्लो: new-page → take-snapshot → इंटरैक्ट (click/fill) → जाँच।",
  category: "ब्राउज़र",
  summary: "वेब ऑटोमेशन के लिए MCP से Chrome DevTools Protocol टूल एक्सेस करें",
  tags: {
    browserAutomation: "ब्राउज़र ऑटोमेशन",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "MCP टूल",
    webDebugging: "वेब डीबगिंग",
    performanceAnalysis: "परफ़ॉर्मेंस एनालिसिस",
    inputAutomation: "इनपुट ऑटोमेशन",
    captureAutomation: "कैप्चर ऑटोमेशन",
    debugging: "डीबगिंग",
    dialogAutomation: "डायलॉग ऑटोमेशन",
    navigationAutomation: "नेविगेशन ऑटोमेशन",
    networkAnalysis: "नेटवर्क विश्लेषण",
    performanceAutomation: "परफ़ॉर्मेंस ऑटोमेशन",
    scriptExecution: "स्क्रिप्ट एक्ज़ीक्यूशन",
    viewportAutomation: "व्यूपोर्ट ऑटोमेशन",
    waitAutomation: "वेट ऑटोमेशन",
  },

  form: {
    label: "ब्राउज़र टूल एक्ज़ीक्यूशन",
    description: "ब्राउज़र कंट्रोल और एनालिसिस के लिए Chrome DevTools MCP टूल चलाएँ",
    fields: {
      tool: {
        label: "टूल",
        description: "चलाने वाला Chrome DevTools MCP टूल चुनें",
        placeholder: "कोई टूल चुनें...",
      },
      arguments: {
        label: "आर्गुमेंट",
        description: "चुने टूल के लिए JSON आर्गुमेंट (वैकल्पिक)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },

  tool: {
    // Input automation tools (8)
    click: "एलिमेंट पर क्लिक करें",
    drag: "एलिमेंट ड्रैग करें",
    fill: "इनपुट फ़ील्ड भरें",
    fillForm: "फ़ॉर्म भरें",
    handleDialog: "डायलॉग सँभालें",
    hover: "एलिमेंट पर होवर करें",
    pressKey: "की दबाएँ",
    uploadFile: "फ़ाइल अपलोड करें",

    // Navigation automation tools (6)
    closePage: "पेज बंद करें",
    listPages: "पेज की लिस्ट",
    navigatePage: "पेज नेविगेट करें",
    newPage: "नया पेज",
    selectPage: "पेज चुनें",
    waitFor: "इंतज़ार करें",

    // Emulation tools (2)
    emulate: "डिवाइस एम्युलेट करें",
    resizePage: "पेज रीसाइज़ करें",

    // Performance tools (3)
    performanceAnalyzeInsight: "परफ़ॉर्मेंस इनसाइट विश्लेषण",
    performanceStartTrace: "परफ़ॉर्मेंस ट्रेस शुरू करें",
    performanceStopTrace: "परफ़ॉर्मेंस ट्रेस रोकें",

    // Network tools (2)
    getNetworkRequest: "नेटवर्क रिक्वेस्ट पाएँ",
    listNetworkRequests: "नेटवर्क रिक्वेस्ट की लिस्ट",

    // Debugging tools (5)
    evaluateScript: "स्क्रिप्ट इवैल्यूएट करें",
    getConsoleMessage: "कंसोल मैसेज पाएँ",
    listConsoleMessages: "कंसोल मैसेज की लिस्ट",
    takeScreenshot: "स्क्रीनशॉट लें",
    takeSnapshot: "स्नैपशॉट लें",
  },

  status: {
    pending: "पेंडिंग",
    running: "चल रहा है",
    completed: "पूरा हुआ",
    failed: "फ़ेल",
  },

  response: {
    success: "टूल सफलतापूर्वक चला",
    result: "एक्ज़ीक्यूशन का नतीजा",
    status: "मौजूदा एक्ज़ीक्यूशन स्टेटस",
    statusItem: "स्टेटस आइटम",
    executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
  },

  examples: {
    requests: {
      navigate: {
        title: "URL पर जाएँ",
        description: "ब्राउज़र को किसी ख़ास URL पर ले जाएँ",
      },
      screenshot: {
        title: "स्क्रीनशॉट लें",
        description: "मौजूदा पेज का स्क्रीनशॉट कैप्चर करें",
      },
      click: {
        title: "एलिमेंट पर क्लिक करें",
        description: "किसी ख़ास एलिमेंट पर क्लिक करें",
      },
      performance: {
        title: "परफ़ॉर्मेंस ट्रेस शुरू करें",
        description: "परफ़ॉर्मेंस मेट्रिक रिकॉर्ड करना शुरू करें",
      },
      script: {
        title: "स्क्रिप्ट इवैल्यूएट करें",
        description: "ब्राउज़र में JavaScript चलाएँ",
      },
    },
    responses: {
      navigate: {
        title: "नेविगेशन का नतीजा",
        description: "पेज नेविगेशन का नतीजा",
      },
      screenshot: {
        title: "स्क्रीनशॉट का नतीजा",
        description: "स्क्रीनशॉट कैप्चर का नतीजा",
      },
      click: {
        title: "क्लिक का नतीजा",
        description: "एलिमेंट क्लिक का नतीजा",
      },
      performance: {
        title: "परफ़ॉर्मेंस ट्रेस शुरू हुआ",
        description: "परफ़ॉर्मेंस ट्रेसिंग शुरू हुई",
      },
      script: {
        title: "स्क्रिप्ट इवैल्यूएशन का नतीजा",
        description: "JavaScript एक्ज़ीक्यूशन का नतीजा",
      },
    },
  },

  errors: {
    toolExecutionFailed: {
      title: "टूल एक्ज़ीक्यूशन फ़ेल हुआ",
      description: "चुना टूल सफलतापूर्वक चल नहीं सका",
    },
    invalidArguments: {
      title: "गलत आर्गुमेंट",
      description: "दिए गए आर्गुमेंट इस टूल के लिए सही नहीं हैं",
    },
    browserNotAvailable: {
      title: "ब्राउज़र उपलब्ध नहीं",
      description: "Chrome ब्राउज़र इंस्टेंस उपलब्ध नहीं है",
    },
    toolNotFound: {
      title: "टूल नहीं मिला",
      description: "माँगा टूल उपलब्ध नहीं है",
    },
    validation: {
      title: "वैलिडेशन एरर",
      description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
      toolRequired: "टूल चुनना ज़रूरी है",
      argumentsInvalid: "आर्गुमेंट वैध JSON होने चाहिए",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "टूल चलाते समय नेटवर्क एरर आया",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "आपको ब्राउज़र टूल चलाने की अनुमति नहीं है",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "ब्राउज़र टूल चलाना मना है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "माँगा ब्राउज़र टूल नहीं मिला",
    },
    serverError: {
      title: "सर्वर एरर",
      description: "टूल चलाते समय इंटरनल सर्वर एरर आया",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "टूल चलाते समय कोई अज्ञात एरर आया",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हैं, खो सकते हैं",
    },
    conflict: {
      title: "टकराव",
      description: "टूल चलाते समय टकराव हुआ",
    },
  },

  success: {
    title: "टूल सफलतापूर्वक चला",
    description: "ब्राउज़र टूल सफलतापूर्वक चला",
  },

  shared: {
    addItem: "आइटम जोड़ें",
    removeItem: "आख़िरी आइटम हटाएँ",
    back: "वापस",
    instanceId: {
      label: "सेशन ID",
      description:
        "ब्राउज़र सेशन ID। हर यूनिक ID को अपना अलग टैब मिलता है। डिफ़ॉल्ट सेशन के लिए खाली छोड़ें।",
      placeholder: "जैसे my-session-1",
    },
  },

  repository: {
    execute: {
      start: "ब्राउज़र टूल एक्ज़ीक्यूशन शुरू हो रहा है",
      success: "ब्राउज़र टूल सफलतापूर्वक चला",
      error: "ब्राउज़र टूल चलाने में एरर",
    },
    mcp: {
      connect: {
        start: "Chrome DevTools MCP सर्वर से कनेक्ट हो रहा है",
        success: "MCP सर्वर से सफलतापूर्वक कनेक्ट हुआ",
        error: "MCP सर्वर से कनेक्ट नहीं हो सका",
        failedToInitialize: "Chrome DevTools MCP सर्वर इनिशियलाइज़ नहीं हो सका",
      },
      closePage: {
        noSession: "कोई एक्टिव सेशन नहीं, बंद करने को कुछ नहीं",
        switchedToPage: "पेज बंद किया, पेज {{pageId}} पर गए",
        closedPage: "पेज {{pageId}} बंद किया",
        pageNotInSession: "पेज {{pageId}} इस सेशन का नहीं है",
      },
      tool: {
        call: {
          start: "MCP टूल कॉल हो रहा है",
          success: "MCP टूल सफलतापूर्वक कॉल हुआ",
          error: "MCP टूल कॉल करने में एरर",
          invalidJsonArguments: "गलत JSON आर्गुमेंट",
          executionFailed: "टूल एक्ज़ीक्यूशन फ़ेल हुआ: {{error}}",
          newPageFailed: "नया पेज नहीं खोला जा सका",
          toolExecutionFailed: "{{toolName}} चल नहीं सका",
        },
      },
    },
  },
};
