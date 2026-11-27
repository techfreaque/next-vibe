import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    image: "इमेज",
    vision: "विज़न",
    ai: "AI",
  },
  post: {
    title: "इमेज का वर्णन करें",
    titleShort: "इमेज का वर्णन करें",
    dynamicTitle: "वर्णन: {{filename}}",
    description: "विज़न AI मॉडल से इमेज की सामग्री का वर्णन करवाएँ",
    fileUrl: {
      label: "इमेज URL",
      description: "जिस इमेज का वर्णन करना है उसका URL",
    },
    context: {
      label: "संदर्भ",
      description: "वर्णन को दिशा देने के लिए वैकल्पिक संदर्भ",
      placeholder: "इस इमेज का वर्णन करें, खासकर...",
    },
    submitButton: {
      label: "इमेज का वर्णन करें",
      loadingText: "वर्णन हो रहा है...",
    },
    response: {
      text: "वर्णन",
      model: "इस्तेमाल हुआ मॉडल",
      creditCost: "खर्च हुए क्रेडिट",
    },
    errors: {
      validation_failed: {
        title: "वैलिडेशन एरर",
        description: "सही इमेज URL दें",
      },
      network_error: {
        title: "नेटवर्क एरर",
        description: "विज़न सर्विस से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "यह फ़ीचर इस्तेमाल करने के लिए साइन इन करें",
      },
      forbidden: {
        title: "मना है",
        description: "आपको यह फ़ीचर इस्तेमाल करने की अनुमति नहीं है",
      },
      not_found: {
        title: "नहीं मिला",
        description: "इमेज नहीं मिला",
      },
      server_error: {
        title: "सर्वर एरर",
        description: "इमेज का वर्णन करते समय अनपेक्षित एरर आया",
      },
      unknown_error: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      unsaved_changes: {
        title: "बिना सेव किए बदलाव",
        description: "वर्णन करने से पहले अपने बदलाव सेव करें",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
      },
      noVisionModel: "इमेज के लिए कोई विज़न मॉडल कॉन्फ़िगर नहीं है",
      descriptionFailed: "इमेज का वर्णन नहीं हो पाया: {{error}}",
      insufficientCredits: "क्रेडिट कम हैं। बैलेंस: {{balance}}, ज़रूरी: {{minimum}}",
      balanceCheckFailed: "आपका क्रेडिट बैलेंस जाँचा नहीं जा सका",
      creditsFailed: "क्रेडिट नहीं कट पाए",
    },
    success: {
      title: "इमेज का वर्णन हो गया",
      description: "इमेज का वर्णन सफलतापूर्वक हो गया",
    },
  },
};
