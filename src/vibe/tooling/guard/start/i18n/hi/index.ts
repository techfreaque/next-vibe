import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "गार्ड शुरू करें",
  titleShort: "गार्ड शुरू करें",
  description: "VSCode प्रोजेक्ट के लिए गार्ड एनवायरनमेंट शुरू करें",
  tag: "शुरू करें",
  category: "गार्ड",
  container: {
    title: "स्टार्ट कॉन्फ़िगरेशन",
    description: "गार्ड स्टार्ट पैरामीटर कॉन्फ़िगर करें",
  },
  fields: {
    projectPath: {
      title: "प्रोजेक्ट पाथ",
      description: "VSCode प्रोजेक्ट का पाथ",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "गार्ड ID",
      description: "गार्ड एनवायरनमेंट की यूनिक पहचान",
      placeholder: "guard_my_project_abc123",
    },
    startAll: {
      title: "सभी गार्ड शुरू करें",
      description: "सभी उपलब्ध गार्ड एनवायरनमेंट शुरू करें",
    },
    totalStarted: {
      title: "कुल शुरू हुए",
    },
    output: {
      title: "आउटपुट",
    },
    startedGuards: {
      columns: {
        username: "यूज़रनेम",
        projectPath: "प्रोजेक्ट पाथ",
      },
    },
    summary: {
      title: "सारांश",
    },
    status: {
      title: "स्टेटस",
    },
    hasIssues: {
      title: "समस्याएँ हैं",
    },
  },
  errors: {
    unauthorized: {
      title: "अनधिकृत",
      description: "लॉगिन ज़रूरी है",
    },
    validation: {
      title: "वैलिडेशन एरर",
      description: "रिक्वेस्ट के पैरामीटर गलत हैं",
    },
    internal: {
      title: "इंटरनल एरर",
      description: "इंटरनल सर्वर एरर आया",
    },
    notFound: {
      title: "नहीं मिला",
      description: "गार्ड एनवायरनमेंट नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "गार्ड एनवायरनमेंट पहले से शुरू है",
    },
    jailSetupFailed: "गार्ड जेल सेटअप फ़ेल हुआ: {{detail}}",
    vscodeSetupFailed: "VSCode इंटीग्रेशन सेटअप फ़ेल हुआ: {{detail}}",
    startFailed: "गार्ड शुरू करते समय इंटरनल एरर: {{detail}}",
    guardIdLookupUnsupported:
      "गार्ड ID से खोज अभी लागू नहीं है। इसकी जगह प्रोजेक्ट पाथ इस्तेमाल करें।",
    notAVscodeProject:
      "गार्ड को VSCode प्रोजेक्ट चाहिए: {{projectPath}} में .vscode डायरेक्टरी नहीं है",
  },
  success: {
    title: "सफल",
    description: "गार्ड सफलतापूर्वक शुरू हुआ",
  },
};
