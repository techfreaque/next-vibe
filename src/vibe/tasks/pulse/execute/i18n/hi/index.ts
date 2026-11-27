import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "पल्स एक्ज़ीक्यूशन",
  tags: {
    execute: "चलाएँ",
  },
  errors: {
    executePulse: "पल्स चल नहीं सका",
  },
  post: {
    title: "पल्स चलाएँ",
    titleShort: "पल्स चलाएँ",
    description: "पल्स हेल्थ मॉनिटरिंग और टास्क एक्ज़ीक्यूशन चलाएँ",
    container: {
      title: "पल्स एक्ज़ीक्यूशन",
      description: "पल्स मॉनिटरिंग चलाएँ और शेड्यूल्ड टास्क चलाएँ",
    },
    fields: {
      dryRun: {
        label: "ड्राई रन",
        description: "असल बदलाव किए बिना ड्राई रन करें",
      },
      taskNames: {
        label: "टास्क alias",
        description:
          "कोई endpoint alias डालकर Enter दबाएँ। सभी योग्य टास्क शामिल करने के लिए खाली छोड़ें।",
      },
      force: {
        label: "ज़बरदस्ती चलाएँ",
        description: "टास्क का समय न आया हो तब भी चलाएँ",
      },
      success: {
        title: "सफल",
      },
      message: {
        title: "मैसेज",
      },
    },
    response: {
      pulseId: "पल्स ID",
      executedAt: "चलाने का समय",
      totalTasksDiscovered: "खोजे गए कुल टास्क",
      tasksDue: "देय टास्क",
      tasksExecuted: "चलाए गए टास्क",
      tasksSucceeded: "सफल टास्क",
      tasksFailed: "फ़ेल टास्क",
      tasksSkipped: "छोड़े गए टास्क",
      totalExecutionTimeMs: "कुल एक्ज़ीक्यूशन समय (ms)",
      errors: "एरर",
      summary: "एक्ज़ीक्यूशन सारांश",
      results: "नतीजे",
      resultsDescription: "टास्क एक्ज़ीक्यूशन के नतीजे",
      taskName: "टास्क का नाम",
      success: "सफल",
      duration: "अवधि",
      message: "मैसेज",
      executionFailed: "एक्ज़ीक्यूशन फ़ेल हुआ",
      dryRunSuccess: "ड्राई रन सफलतापूर्वक पूरा हुआ",
      executionSuccess: "एक्ज़ीक्यूशन सफलतापूर्वक पूरा हुआ",
    },
    examples: {
      basic: {
        title: "बेसिक पल्स एक्ज़ीक्यूशन",
      },
      dryRun: {
        title: "ड्राई रन एक्ज़ीक्यूशन",
      },
      success: {
        title: "सफल एक्ज़ीक्यूशन",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      internal: {
        title: "इंटरनल एरर",
        description: "इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
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
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
    },
    success: {
      title: "सफल",
      description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
    },
  },
};
