import type { translations as enTranslations } from "../en";

/**
 * Desktop API translations (English)
 */

export const translations: typeof enTranslations = {
  "take-screenshot": {
    title: "डेस्कटॉप स्क्रीनशॉट लें",
    titleShort: "स्क्रीनशॉट",
    dynamicTitle: "स्क्रीनशॉट: {{target}}",
    description: "डेस्कटॉप या स्क्रीन के किसी हिस्से का स्क्रीनशॉट लें",
    form: {
      label: "स्क्रीनशॉट लें",
      capturing: "कैप्चर हो रहा है…",
      refresh: "दोबारा लें",
      description: "पूरे डेस्कटॉप या किसी ख़ास हिस्से का स्क्रीनशॉट लें",
      fields: {
        outputPath: {
          label: "आउटपुट पाथ",
          description:
            "स्क्रीनशॉट सेव करने का पूरा पाथ। छोड़ दें तो इनलाइन base64 लौटेगा।",
          placeholder: "/tmp/screenshot.png",
        },
        screen: {
          label: "स्क्रीन इंडेक्स",
          description:
            "स्क्रीन/मॉनिटर इंडेक्स (0 = प्राइमरी)। इसके बजाय monitorName को प्राथमिकता दें।",
          placeholder: "0",
        },
        monitorName: {
          label: "मॉनिटर का नाम",
          description:
            "मॉनिटर आउटपुट का नाम (जैसे DP-1, HDMI-1)। उपलब्ध नाम देखने के लिए पहले list-monitors चलाएँ।",
          placeholder: "DP-1",
        },
        maxWidth: {
          label: "अधिकतम चौड़ाई",
          description:
            "कैप्चर इससे चौड़ा हो तो इस चौड़ाई तक घटाएँ। AI के लिए काम की: 4-मॉनिटर कैप्चर बहुत बड़े होते हैं।",
          placeholder: "1920",
        },
      },
    },
    response: {
      success: "स्क्रीनशॉट सफलतापूर्वक लिया गया",
      imagePath: "वह पाथ जहाँ स्क्रीनशॉट सेव हुआ",
      imageData: "Base64-एन्कोडेड PNG स्क्रीनशॉट डेटा",
      imageUrl: "स्क्रीनशॉट तक पहुँचने का URL",
      width: "स्क्रीनशॉट की चौड़ाई पिक्सल में",
      height: "स्क्रीनशॉट की ऊँचाई पिक्सल में",
      monitorName: "जो मॉनिटर कैप्चर हुआ",
      originalWidth: "घटाने से पहले की मूल चौड़ाई",
      originalHeight: "घटाने से पहले की मूल ऊँचाई",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "स्क्रीनशॉट लेते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको डेस्कटॉप स्क्रीनशॉट लेने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "डेस्कटॉप स्क्रीनशॉट लेना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "स्क्रीनशॉट लेते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "स्क्रीनशॉट लेते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "स्क्रीनशॉट लेते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "यह फ़ीचर आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "स्क्रीनशॉट लिया गया",
      description: "डेस्कटॉप स्क्रीनशॉट सफलतापूर्वक लिया गया",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      captureAutomation: "कैप्चर ऑटोमेशन",
    },
  },
  "get-accessibility-tree": {
    title: "एक्सेसिबिलिटी ट्री लाएँ",
    titleShort: "A11y ट्री",
    dynamicTitle: "A11y: {{app}}",
    description: "फ़ोकस वाली विंडो या किसी ख़ास एप्लिकेशन का एक्सेसिबिलिटी ट्री लाएँ",
    form: {
      label: "एक्सेसिबिलिटी ट्री लाएँ",
      description: "डेस्कटॉप UI जाँचने के लिए AT-SPI एक्सेसिबिलिटी ट्री लाएँ",
      fields: {
        appName: {
          label: "एप्लिकेशन का नाम",
          description:
            "टारगेट करने के लिए प्रोसेस का नाम या विंडो टाइटल (फ़ोकस वाली विंडो के लिए छोड़ दें)",
          placeholder: "firefox",
        },
        maxDepth: {
          label: "अधिकतम गहराई",
          description: "ट्रैवर्स करने की अधिकतम ट्री गहराई (डिफ़ॉल्ट: 5)",
          placeholder: "5",
        },
        includeActions: {
          label: "कार्रवाइयाँ शामिल करें",
          description:
            "हर नोड की उपलब्ध कार्रवाइयाँ दिखाएँ (click, press, activate...)। ज़्यादा ब्योरा पर आउटपुट बड़ा।",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "एक्सेसिबिलिटी ट्री सफलतापूर्वक मिला",
      tree: "संरचित टेक्स्ट के रूप में एक्सेसिबिलिटी ट्री",
      nodeCount: "ट्रैवर्स किए गए कुल नोड",
      truncated: "क्वेरी टाइमआउट हुई या नहीं और आउटपुट अधूरा हो सकता है",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "एक्सेसिबिलिटी ट्री लाते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको एक्सेसिबिलिटी ट्री का एक्सेस नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेसिबिलिटी ट्री का एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "टारगेट एप्लिकेशन या विंडो नहीं मिली",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "एक्सेसिबिलिटी ट्री लाते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "एक्सेसिबिलिटी ट्री लाते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "एक्सेसिबिलिटी ट्री लाते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "यह फ़ीचर आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "एक्सेसिबिलिटी ट्री मिल गया",
      description: "एक्सेसिबिलिटी ट्री सफलतापूर्वक मिल गया",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      accessibilityAutomation: "एक्सेसिबिलिटी ऑटोमेशन",
    },
  },
  "list-monitors": {
    title: "मॉनिटर की सूची",
    titleShort: "मॉनिटर",
    description: "रेज़ोल्यूशन, पोज़िशन और इंडेक्स के साथ सभी जुड़े मॉनिटर की सूची",
    form: {
      label: "मॉनिटर की सूची",
      description:
        "सभी जुड़े डिस्प्ले गिनें। स्क्रीनशॉट के लिए ख़ास स्क्रीन चुनने को मॉनिटर के नाम इस्तेमाल करें।",
      fields: {},
    },
    response: {
      success: "मॉनिटर की सूची मिल गई",
      monitors: "जुड़े मॉनिटर की ऐरे",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "मॉनिटर की सूची बनाते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको मॉनिटर की सूची देखने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "मॉनिटर की सूची देखना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "मॉनिटर की सूची बनाते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "मॉनिटर की सूची बनाते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "मॉनिटर की सूची बनाते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "मॉनिटर की सूची आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "मॉनिटर की सूची मिली",
      description: "सभी जुड़े मॉनिटर की सूची सफलतापूर्वक मिल गई",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      captureAutomation: "कैप्चर ऑटोमेशन",
    },
  },
  click: {
    title: "क्लिक",
    titleShort: "क्लिक",
    dynamicTitle: "क्लिक: {{x}},{{y}}",
    description: "माउस को सटीक निर्देशांक पर ले जाएँ और क्लिक करें",
    form: {
      label: "क्लिक",
      description: "माउस को दिए निर्देशांक पर ले जाकर क्लिक करें",
      fields: {
        x: {
          label: "X निर्देशांक",
          description: "पिक्सल में क्षैतिज स्क्रीन निर्देशांक (बाएँ किनारे से)",
          placeholder: "100",
        },
        y: {
          label: "Y निर्देशांक",
          description: "पिक्सल में ऊर्ध्वाधर स्क्रीन निर्देशांक (ऊपरी किनारे से)",
          placeholder: "200",
        },
        button: {
          label: "माउस बटन",
          description: "क्लिक करने वाला माउस बटन (left, middle, right)",
          placeholder: "left",
          options: {
            left: "बायाँ",
            middle: "बीच वाला",
            right: "दायाँ",
          },
        },
        doubleClick: {
          label: "डबल क्लिक",
          description: "एक क्लिक की जगह डबल क्लिक करें",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "क्लिक सफलतापूर्वक हुआ",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "क्लिक करते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको डेस्कटॉप क्लिक करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "डेस्कटॉप क्लिक करना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "क्लिक करते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "क्लिक करते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "क्लिक करते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "यह फ़ीचर आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "क्लिक हो गया",
      description: "माउस क्लिक सफलतापूर्वक हुआ",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  "type-text": {
    title: "टेक्स्ट टाइप करें",
    titleShort: "टेक्स्ट टाइप करें",
    dynamicTitle: "टाइप करें: {{text}}",
    description: "कीबोर्ड सिमुलेशन से फ़ोकस वाली विंडो में टेक्स्ट टाइप करें",
    form: {
      label: "टेक्स्ट टाइप करें",
      description: "टेक्स्ट टाइप करने के लिए फ़ोकस वाली विंडो को कीस्ट्रोक भेजें",
      fields: {
        text: {
          label: "टेक्स्ट",
          description: "फ़ोकस वाली विंडो में टाइप किया जाने वाला टेक्स्ट",
          placeholder: "Hello, World!",
        },
        delay: {
          label: "देरी (ms)",
          description: "कीस्ट्रोक के बीच मिलीसेकंड में देरी (डिफ़ॉल्ट: 12)",
          placeholder: "12",
        },
        windowId: {
          label: "विंडो ID",
          description:
            "टाइप करने से पहले इस विंडो UUID पर फ़ोकस करें (list-windows से)",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "विंडो टाइटल",
          description: "टाइप करने से पहले इस टाइटल वाली विंडो पर फ़ोकस करें",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "टेक्स्ट सफलतापूर्वक टाइप हुआ",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "टेक्स्ट टाइप करते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको डेस्कटॉप पर टेक्स्ट टाइप करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "डेस्कटॉप पर टेक्स्ट टाइप करना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "टेक्स्ट टाइप करते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "टेक्स्ट टाइप करते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टेक्स्ट टाइप करते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "यह फ़ीचर आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "टेक्स्ट टाइप हो गया",
      description: "टेक्स्ट सफलतापूर्वक टाइप हो गया",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  "press-key": {
    title: "कुंजी दबाएँ",
    titleShort: "कुंजी दबाएँ",
    dynamicTitle: "कुंजी: {{key}}",
    description: "xdotool से कोई कुंजी या कुंजी संयोजन दबाएँ",
    form: {
      label: "कुंजी दबाएँ",
      description: "xdotool key सिंटैक्स में डेस्कटॉप को कुंजी दबाने का इवेंट भेजें",
      fields: {
        key: {
          label: "कुंजी",
          description:
            "xdotool सिंटैक्स में कुंजी का नाम या संयोजन (जैसे Return, ctrl+c, alt+F4)",
          placeholder: "Return",
        },
        repeat: {
          label: "दोहराव की संख्या",
          description: "कुंजी कितनी बार दबानी है (डिफ़ॉल्ट: 1)",
          placeholder: "1",
        },
        delay: {
          label: "देरी (ms)",
          description: "बार-बार दबाने के बीच मिलीसेकंड में देरी (डिफ़ॉल्ट: 0)",
          placeholder: "0",
        },
        windowId: {
          label: "विंडो ID",
          description: "कुंजी दबाने से पहले इस विंडो UUID पर फ़ोकस करें",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "विंडो टाइटल",
          description: "कुंजी दबाने से पहले इस टाइटल वाली विंडो पर फ़ोकस करें",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "कुंजी सफलतापूर्वक दबी",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "कुंजी दबाते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको डेस्कटॉप पर कुंजी दबाने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "डेस्कटॉप पर कुंजी दबाना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "कुंजी दबाते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कुंजी दबाते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "कुंजी दबाते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "यह फ़ीचर आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "कुंजी दब गई",
      description: "कुंजी सफलतापूर्वक दब गई",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  "move-mouse": {
    title: "माउस हिलाएँ",
    titleShort: "माउस हिलाएँ",
    dynamicTitle: "हिलाएँ: {{x}},{{y}}",
    description: "माउस कर्सर को सटीक स्क्रीन निर्देशांक पर ले जाएँ",
    form: {
      label: "माउस हिलाएँ",
      description: "माउस कर्सर को बताई गई स्क्रीन पोज़िशन पर ले जाएँ",
      fields: {
        x: {
          label: "X निर्देशांक",
          description: "पिक्सल में क्षैतिज स्क्रीन निर्देशांक (बाएँ किनारे से)",
          placeholder: "100",
        },
        y: {
          label: "Y निर्देशांक",
          description: "पिक्सल में ऊर्ध्वाधर स्क्रीन निर्देशांक (ऊपरी किनारे से)",
          placeholder: "200",
        },
      },
    },
    response: {
      success: "माउस सफलतापूर्वक हिला",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "माउस हिलाते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको डेस्कटॉप पर माउस हिलाने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "डेस्कटॉप पर माउस हिलाना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "माउस हिलाते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "माउस हिलाते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "माउस हिलाते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "यह फ़ीचर आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "माउस हिला",
      description: "माउस कर्सर सफलतापूर्वक हिला",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  scroll: {
    title: "स्क्रॉल",
    titleShort: "स्क्रॉल",
    dynamicTitle: "स्क्रॉल: {{direction}}",
    description: "माउस की मौजूदा पोज़िशन या बताए निर्देशांक पर स्क्रॉल करें",
    form: {
      label: "स्क्रॉल",
      description: "दी गई पोज़िशन पर ऊपर, नीचे, बाएँ या दाएँ स्क्रॉल करें",
      fields: {
        x: {
          label: "X निर्देशांक",
          description:
            "जिस क्षैतिज पोज़िशन पर स्क्रॉल करना है (छोड़ दें तो मौजूदा पोज़िशन)",
          placeholder: "100",
        },
        y: {
          label: "Y निर्देशांक",
          description:
            "जिस ऊर्ध्वाधर पोज़िशन पर स्क्रॉल करना है (छोड़ दें तो मौजूदा पोज़िशन)",
          placeholder: "200",
        },
        direction: {
          label: "दिशा",
          description: "स्क्रॉल की दिशा",
          placeholder: "down",
          options: {
            up: "ऊपर",
            down: "नीचे",
            left: "बायाँ",
            right: "दायाँ",
          },
        },
        amount: {
          label: "रकम",
          description: "स्क्रॉल स्टेप की संख्या (डिफ़ॉल्ट: 3)",
          placeholder: "3",
        },
      },
    },
    response: {
      success: "स्क्रॉल सफलतापूर्वक हुआ",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "स्क्रॉल करते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको डेस्कटॉप पर स्क्रॉल करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "डेस्कटॉप पर स्क्रॉल करना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "स्क्रॉल करते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "स्क्रॉल करते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "स्क्रॉल करते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "यह फ़ीचर आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "स्क्रॉल हो गया",
      description: "स्क्रॉल सफलतापूर्वक हो गया",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      inputAutomation: "इनपुट ऑटोमेशन",
    },
  },
  "get-focused-window": {
    title: "फ़ोकस वाली विंडो लाएँ",
    titleShort: "फ़ोकस वाली विंडो",
    description: "इस समय फ़ोकस वाली विंडो की जानकारी लाएँ",
    form: {
      label: "फ़ोकस वाली विंडो लाएँ",
      description: "सक्रिय विंडो की ID, टाइटल और PID लाएँ",
      fields: {},
    },
    response: {
      success: "फ़ोकस वाली विंडो की जानकारी सफलतापूर्वक मिली",
      windowId: "फ़ोकस वाली विंडो की X11 विंडो ID",
      windowTitle: "फ़ोकस वाली विंडो का टाइटल टेक्स्ट",
      pid: "फ़ोकस वाली विंडो की प्रोसेस ID",
      width: "पिक्सल में विंडो की चौड़ाई",
      height: "पिक्सल में विंडो की ऊँचाई",
      monitor: "जिस मॉनिटर पर विंडो है उसका इंडेक्स",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "फ़ोकस वाली विंडो लाते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको विंडो की जानकारी लेने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "विंडो की जानकारी लेना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई फ़ोकस वाली विंडो नहीं मिली",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "फ़ोकस वाली विंडो लाते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "फ़ोकस वाली विंडो लाते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "फ़ोकस वाली विंडो लाते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "यह फ़ीचर आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "फ़ोकस वाली विंडो मिल गई",
      description: "फ़ोकस वाली विंडो की जानकारी सफलतापूर्वक मिल गई",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      windowManagement: "विंडो मैनेजमेंट",
    },
  },
  "list-windows": {
    title: "विंडो की सूची",
    titleShort: "विंडो की सूची",
    description: "डेस्कटॉप की सभी खुली विंडो की सूची",
    form: {
      label: "विंडो की सूची",
      description: "सभी खुली विंडो की सूची उनकी ID, टाइटल और पोज़िशन के साथ लाएँ",
      fields: {},
    },
    response: {
      success: "विंडो की सूची सफलतापूर्वक मिली",
      windows: "खुली विंडो की सूची",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "विंडो की सूची बनाते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको विंडो की सूची देखने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "विंडो की सूची देखना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई विंडो नहीं मिली",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "विंडो की सूची बनाते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "विंडो की सूची बनाते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "विंडो की सूची बनाते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "यह फ़ीचर आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "विंडो की सूची मिली",
      description: "विंडो की सूची सफलतापूर्वक मिल गई",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      windowManagement: "विंडो मैनेजमेंट",
    },
  },
  "focus-window": {
    title: "विंडो पर फ़ोकस करें",
    titleShort: "विंडो पर फ़ोकस करें",
    dynamicTitle: "फ़ोकस: {{target}}",
    description: "किसी विंडो को सबसे आगे लाएँ और उस पर फ़ोकस दें",
    form: {
      label: "विंडो पर फ़ोकस करें",
      description: "किसी विंडो पर उसकी ID, PID या टाइटल से फ़ोकस करें",
      fields: {
        windowId: {
          label: "विंडो ID",
          description:
            "X11 विंडो ID (हेक्साडेसिमल, जैसे 0x1234)। बाक़ी विकल्पों पर इसे प्राथमिकता मिलती है।",
          placeholder: "0x1234",
        },
        pid: {
          label: "प्रोसेस ID",
          description: "इस प्रोसेस ID की विंडो पर फ़ोकस करें",
          placeholder: "12345",
        },
        title: {
          label: "विंडो टाइटल",
          description:
            "जिस विंडो के टाइटल में यह स्ट्रिंग हो उस पर फ़ोकस करें (केस-सेंसिटिव)",
          placeholder: "Firefox",
        },
      },
    },
    response: {
      success: "विंडो पर सफलतापूर्वक फ़ोकस हुआ",
      error: "एरर संदेश",
      executionId: "ट्रैकिंग के लिए एक्ज़ीक्यूशन ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया इनमें से कम से कम एक दें: windowId, pid या title",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "विंडो पर फ़ोकस करते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको विंडो पर फ़ोकस करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "विंडो पर फ़ोकस करना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "बताई गई विंडो नहीं मिली",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "विंडो पर फ़ोकस करते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "विंडो पर फ़ोकस करते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "विंडो पर फ़ोकस करते समय टकराव हुआ",
      },
      notImplemented: {
        title: "लागू नहीं",
        description: "यह फ़ीचर आपके ऑपरेटिंग सिस्टम पर उपलब्ध नहीं है",
      },
    },
    success: {
      title: "विंडो पर फ़ोकस हुआ",
      description: "विंडो सफलतापूर्वक सबसे आगे आ गई",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      windowManagement: "विंडो मैनेजमेंट",
    },
  },
  "move-window-to-monitor": {
    title: "विंडो को मॉनिटर पर ले जाएँ",
    titleShort: "विंडो ले जाएँ",
    dynamicTitle: "ले जाएँ: {{target}}",
    description: "किसी विंडो को ख़ास मॉनिटर पर ले जाएँ",
    form: {
      label: "विंडो को मॉनिटर पर ले जाएँ",
      description: "किसी विंडो को उसकी ID, PID या टाइटल से टारगेट मॉनिटर पर ले जाएँ",
      fields: {
        windowId: {
          label: "विंडो ID",
          description:
            "KWin की आंतरिक विंडो UUID (list-windows से)। pid और title पर इसे प्राथमिकता मिलती है।",
          placeholder: "{uuid}",
        },
        pid: {
          label: "प्रोसेस ID",
          description: "इस प्रोसेस ID की विंडो को ले जाएँ",
          placeholder: "12345",
        },
        title: {
          label: "विंडो टाइटल",
          description: "जिस विंडो के टाइटल में यह स्ट्रिंग हो उसे ले जाएँ (केस-इनसेंसिटिव)",
          placeholder: "Firefox",
        },
        monitorName: {
          label: "मॉनिटर का नाम",
          description:
            "टारगेट मॉनिटर का नाम (जैसे DP-1, HDMI-A-1)। उपलब्ध नाम देखने के लिए list-monitors इस्तेमाल करें।",
          placeholder: "DP-1",
        },
        monitorIndex: {
          label: "मॉनिटर इंडेक्स",
          description:
            "टारगेट मॉनिटर इंडेक्स (0 से शुरू)। हो सके तो monitorName इस्तेमाल करें।",
          placeholder: "0",
        },
      },
    },
    response: {
      success: "ले जाना सफल रहा या नहीं",
      movedTo: "जिस मॉनिटर पर विंडो ले जाई गई",
      windowTitle: "जो विंडो ले जाई गई उसका टाइटल",
      error: "कार्रवाई फ़ेल होने पर एरर संदेश",
      executionId: "इस एक्ज़ीक्यूशन की यूनिक पहचान",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया कम से कम एक विंडो पहचान और एक मॉनिटर टारगेट दें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "विंडो ले जाते समय नेटवर्क एरर हुई",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको विंडो ले जाने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "विंडो ले जाना मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "बताई गई विंडो या मॉनिटर नहीं मिला",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "विंडो ले जाते समय आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "विंडो ले जाते समय अनजान एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो सकते हैं",
      },
      conflict: {
        title: "टकराव",
        description: "विंडो ले जाते समय टकराव हुआ",
      },
    },
    success: {
      title: "विंडो ले जाई गई",
      description: "विंडो सफलतापूर्वक टारगेट मॉनिटर पर पहुँच गई",
    },
    category: "डेस्कटॉप",
    tags: {
      desktopAutomation: "डेस्कटॉप ऑटोमेशन",
      windowManagement: "विंडो मैनेजमेंट",
    },
  },

  title: "डेस्कटॉप ऑटोमेशन टूल्स",
  description: "डेस्कटॉप चलाएँ: स्क्रीनशॉट, माउस, कीबोर्ड, विंडो",
  category: "डेस्कटॉप",
  summary:
    "क्रॉस-प्लेटफ़ॉर्म डेस्कटॉप ऑटोमेशन: Linux (ydotool/KWin/pyatspi) और Windows (PowerShell/UIAutomation)",
  tags: {
    desktopAutomation: "डेस्कटॉप ऑटोमेशन",
    inputAutomation: "इनपुट ऑटोमेशन",
    windowManagement: "विंडो मैनेजमेंट",
    captureAutomation: "कैप्चर ऑटोमेशन",
    accessibilityAutomation: "एक्सेसिबिलिटी ऑटोमेशन",
  },

  tool: {
    takeScreenshot: "स्क्रीनशॉट लें",
    getAccessibilityTree: "एक्सेसिबिलिटी ट्री लाएँ",
    listMonitors: "मॉनिटर की सूची",
    click: "क्लिक",
    typeText: "टेक्स्ट टाइप करें",
    pressKey: "कुंजी दबाएँ",
    moveMouse: "माउस हिलाएँ",
    scroll: "स्क्रॉल",
    getFocusedWindow: "फ़ोकस वाली विंडो लाएँ",
    listWindows: "विंडो की सूची",
    focusWindow: "विंडो पर फ़ोकस करें",
    moveWindowToMonitor: "विंडो को मॉनिटर पर ले जाएँ",
  },

  widget: {
    refresh: "रिफ़्रेश",
    noWindows: "कोई खुली विंडो नहीं मिली",
    windowCount_one: "{{count}} विंडो",
    windowCount_other: "{{count}} विंडो",
    actionFocus: "फ़ोकस",
    actionType: "प्रकार",
    actionKey: "कुंजी",
    actionMove: "ले जाएँ",
    actionA11y: "A11y",
    actionTypeText: "टेक्स्ट टाइप करें",
    actionPressKey: "कुंजी दबाएँ",
    actionScreenshot: "स्क्रीनशॉट",
    actionScreenshotOnMonitor: "स्क्रीनशॉट: {{monitor}}",
    actionA11yTree: "A11y ट्री",
    actionAllWindows: "← सभी विंडो",
    actionAllMonitors: "सभी मॉनिटर →",
    actionScreenshotLink: "स्क्रीनशॉट →",
    actionMoveWindowHere: "विंडो यहाँ ले जाएँ",
    labelPrimary: "प्राइमरी",
    statusFocused: "विंडो पर फ़ोकस हुआ",
    statusTyped: "टाइप हुआ",
    statusPressed: "दबाया गया",
    statusMoved: "ले जाई गई",
    statusScrolled: "स्क्रॉल हुआ",
    statusMouseMoved: "माउस हिला",
    statusClickExecuted: "क्लिक हुआ",
    labelSaved: "सेव हुआ:",
    labelTruncated: "⚠ छोटा किया गया",
    filterPlaceholder: "नोड फ़िल्टर करें…",
    titleTypeText: "टेक्स्ट टाइप करें",
    titlePressKey: "कुंजी दबाएँ",
    titleClick: "क्लिक",
    titleScroll: "स्क्रॉल",
    titleMoveMouse: "माउस हिलाएँ",
    titleMoveWindow: "विंडो ले जाएँ",
    titleA11yTree: "एक्सेसिबिलिटी ट्री",
    titleListWindows: "विंडो",
    titleListMonitors: "मॉनिटर",
    titleGetFocusedWindow: "फ़ोकस वाली विंडो",
    titleFocusWindow: "विंडो पर फ़ोकस करें",
  },

  repository: {
    platformNotSupported:
      "प्लेटफ़ॉर्म सपोर्टेड नहीं: {{platform}}। Linux और Windows सपोर्टेड हैं।",
    windowsNotSupported: "Windows सपोर्ट जल्द आ रहा है",
    macosNotSupported: "macOS सपोर्ट जल्द आ रहा है",
    commandFailed: "कमांड फ़ेल हुई: {{error}}",
    toolNotFound:
      "ज़रूरी टूल नहीं मिला: {{tool}}। इसे इस तरह इंस्टॉल करें: {{installCmd}}",
    screenshotFailed: "स्क्रीनशॉट लेना फ़ेल हुआ",
    accessibilityFailed: "एक्सेसिबिलिटी ट्री पाना फ़ेल हुआ",
    accessibilityFailedWithError: "एक्सेसिबिलिटी ट्री पाना फ़ेल हुआ: {{error}}",
    focusWindowRequiresIdentifier:
      "windowId, pid या title में से कम से कम एक ज़रूरी है",
    missingDep:
      "ज़रूरी सिस्टम पैकेज ग़ायब है: {{dep}}। सिस्टम ऑथ डायलॉग आया होगा, ऑटोमैटिक इंस्टॉल के लिए उसे मंज़ूर करें।",
    scriptWriteFailed: "स्क्रिप्ट लिखना फ़ेल हुआ: {{error}}",
    monitorNotFoundByName: 'Monitor "{{monitorName}}" not found',
    noMonitorsDetected: "कोई मॉनिटर नहीं मिला",
    invalidWindowHandle:
      'Invalid windowId: "{{handle}}" is not a valid numeric window handle',
    screenIndexOutOfRange: "स्क्रीन इंडेक्स {{screen}} रेंज से बाहर है",
    unknownKeyName: "अनजान कुंजी नाम: {{key}}",
    focusedWindowParseFailed: "फ़ोकस वाली विंडो का आउटपुट पार्स नहीं हुआ",
    couldNotListWindows: "विंडो की सूची नहीं बन सकी",
    noWindowWithPid: "PID {{pid}} की कोई विंडो नहीं",
    noWindowWithTitle: 'No window with title containing "{{title}}"',
    provideMonitorNameOrIndex: "monitorName या monitorIndex दें",
    monitorNotFound: "मॉनिटर नहीं मिला: {{monitor}}",
    noActiveWindow: "कोई सक्रिय विंडो नहीं",
    kwinNoOutput: "KWin स्क्रिप्ट ने कोई आउटपुट नहीं दिया",
    kwinNoWindowData: "KWin स्क्रिप्ट के आउटपुट में विंडो डेटा नहीं है",
    windowMoveNoEffect:
      "विंडो का मूव असर में नहीं आया: विंडो मॉनिटर {{monitor}} तक पहुँची ही नहीं",
  },
};
