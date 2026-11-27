import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सिस्टम गार्ड",

  title: "गार्ड रोकें",
  titleShort: "गार्ड रोकें",
  description: "VSCode प्रोजेक्ट के लिए गार्ड एनवायरनमेंट रोकें",
  tag: "guard",

  container: {
    title: "गार्ड रोकने का कॉन्फ़िगरेशन",
    description: "गार्ड एनवायरनमेंट रोकने के पैरामीटर कॉन्फ़िगर करें",
  },

  fields: {
    projectPath: {
      title: "प्रोजेक्ट पाथ",
      description: "प्रोजेक्ट डायरेक्टरी का पाथ",
      placeholder: "/path/to/your/project",
    },
    guardId: {
      title: "गार्ड ID",
      description: "रोकने वाला ख़ास गार्ड ID",
      placeholder: "guard_project_abc123",
    },
    username: {
      title: "यूज़रनेम",
    },
    wasRunning: {
      title: "चल रहा था",
    },
    nowRunning: {
      title: "अब चल रहा है",
    },
    pid: {
      title: "प्रोसेस ID",
    },
    forceStopped: {
      title: "ज़बरदस्ती रोका गया",
    },
    stopAll: {
      title: "सभी गार्ड रोकें",
      description: "सभी चल रहे गार्ड एनवायरनमेंट रोकें",
    },
    force: {
      title: "ज़बरदस्ती रोकें",
      description: "गार्ड जवाब न दे रहा हो तब भी ज़बरदस्ती रोकें",
    },
    success: {
      title: "ऑपरेशन सफल",
    },
    output: {
      title: "कमांड आउटपुट",
    },
    stoppedGuards: {
      title: "रोके गए गार्ड",
    },
    totalStopped: {
      title: "कुल रोके गए",
    },
  },

  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "रिक्वेस्ट के पैरामीटर गलत हैं",
    },
    internal: {
      title: "इंटरनल एरर",
      description: "इंटरनल सर्वर एरर आया",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "लॉगिन ज़रूरी है",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "एक्सेस मना है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रिसोर्स नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "डेटा टकराव हुआ",
    },
    missingTarget: "वैलिडेशन एरर: projectPath, guardId या stopAll बताएँ।",
    stopFailed: "गार्ड रोकते समय इंटरनल एरर: {{detail}}",
  },

  success: {
    title: "सफल",
    description: "गार्ड रोकने का ऑपरेशन सफलतापूर्वक पूरा हुआ",
  },
};
