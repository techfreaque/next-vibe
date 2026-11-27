import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    video: "वीडियो",
    vision: "विज़न",
    ai: "AI",
  },
  post: {
    title: "वीडियो का वर्णन करें",
    titleShort: "वीडियो का वर्णन करें",
    dynamicTitle: "वर्णन: {{filename}}",
    description: "विज़न AI मॉडल से वीडियो की सामग्री का वर्णन करवाएँ",
    fileUrl: {
      label: "वीडियो URL",
      description: "जिस वीडियो का वर्णन करना है उसका URL",
    },
    context: {
      label: "संदर्भ",
      description: "वर्णन को दिशा देने के लिए वैकल्पिक संदर्भ",
      placeholder: "इस वीडियो का वर्णन करें, खासकर...",
    },
    submitButton: {
      label: "वीडियो का वर्णन करें",
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
        description: "सही वीडियो URL दें",
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
        description: "वीडियो नहीं मिला",
      },
      server_error: {
        title: "सर्वर एरर",
        description: "वीडियो का वर्णन करते समय अनपेक्षित एरर आया",
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
      noVisionModel: "वीडियो के लिए कोई विज़न मॉडल कॉन्फ़िगर नहीं है",
      descriptionFailed: "वीडियो का वर्णन नहीं हो पाया: {{error}}",
      insufficientCredits: "क्रेडिट कम हैं। बैलेंस: {{balance}}, ज़रूरी: {{minimum}}",
      balanceCheckFailed: "आपका क्रेडिट बैलेंस जाँचा नहीं जा सका",
      creditsFailed: "क्रेडिट नहीं कट पाए",
    },
    success: {
      title: "वीडियो का वर्णन हो गया",
      description: "वीडियो का वर्णन सफलतापूर्वक हो गया",
    },
  },
};
