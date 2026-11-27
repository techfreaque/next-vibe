import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र प्रोफ़ाइल",

  tag: "अवतार",
  errors: {
    user_not_found: "यूज़र {{userId}} नहीं मिला",
    failed_to_upload_avatar:
      "{{userId}} के लिए अवतार अपलोड नहीं हो सका: {{error}}",
    failed_to_delete_avatar:
      "{{userId}} के लिए अवतार हटाया नहीं जा सका: {{error}}",
    invalid_file_type:
      "फ़ाइल का प्रकार {{providedType}} अमान्य है। अनुमत: {{allowedTypes}}",
    file_too_large: "फ़ाइल बहुत बड़ी है: {{providedSize}}। अधिकतम {{maxSize}}",
  },
  debug: {
    uploadingUserAvatar: "यूज़र अवतार अपलोड हो रहा है",
    errorUploadingUserAvatar: "यूज़र अवतार अपलोड करने में एरर",
    deletingUserAvatar: "यूज़र अवतार हटाया जा रहा है",
    errorDeletingUserAvatar: "यूज़र अवतार हटाने में एरर",
  },
  success: {
    uploaded: "अवतार सफलतापूर्वक अपलोड हो गया",
    deleted: "अवतार सफलतापूर्वक हट गया",
    nextSteps: {
      visible: "आपका अवतार अब आपकी प्रोफ़ाइल पर दिख रहा है",
      update: "आप इसे कभी भी अपनी प्रोफ़ाइल सेटिंग्स से अपडेट कर सकते हैं",
      default: "आपकी प्रोफ़ाइल अब डिफ़ॉल्ट अवतार दिखा रही है",
      uploadNew: "आप नया अवतार कभी भी अपनी प्रोफ़ाइल सेटिंग्स से अपलोड कर सकते हैं",
    },
  },
  upload: {
    title: "अवतार अपलोड करें",
    titleShort: "अवतार अपलोड करें",
    description: "प्रोफ़ाइल अवतार इमेज अपलोड करें",
    groups: {
      fileUpload: {
        title: "फ़ाइल अपलोड",
        description: "अपनी अवतार इमेज चुनें और अपलोड करें",
      },
    },
    fields: {
      file: {
        label: "अवतार इमेज",
        description: "अपनी प्रोफ़ाइल अवतार के लिए इमेज फ़ाइल चुनें",
        placeholder: "इमेज फ़ाइल चुनें...",
        help: "इमेज फ़ाइल अपलोड करें (JPG, PNG, GIF), 5MB तक",
        validation: {
          maxSize: "फ़ाइल का साइज़ 5MB से कम होना चाहिए",
          imageOnly: "सिर्फ़ इमेज फ़ाइलें चलती हैं",
          unsupportedFormat:
            "इमेज फ़ॉर्मेट सपोर्टेड नहीं है। JPEG, PNG, WebP या GIF इस्तेमाल करें।",
        },
      },
    },
    response: {
      title: "अपलोड रिस्पॉन्स",
      label: "अपलोड का नतीजा",
      description: "अवतार अपलोड रिस्पॉन्स",
      success: "अपलोड सफल",
      message: "आपका अवतार सफलतापूर्वक अपलोड हो गया है",
      avatarUrl: "अवतार URL",
      uploadTime: "अपलोड का समय",
      nextSteps: {
        item: "अगला कदम",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "अपलोड की गई फ़ाइल अमान्य या ख़राब है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "अवतार अपलोड करने के लिए आपका लॉग इन होना ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "अवतार अपलोड प्रोसेस नहीं हो सका",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "आंतरिक सर्वर एरर हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "अपलोड के दौरान अनपेक्षित एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "अपलोड के दौरान नेटवर्क एरर हुआ",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपको अवतार अपलोड करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
      conflict: {
        title: "टकराव",
        description: "अपलोड के दौरान टकराव हुआ",
      },
    },
    success: {
      title: "अवतार अपलोड हो गया",
      description: "आपका प्रोफ़ाइल अवतार सफलतापूर्वक अपलोड हो गया है",
    },
  },
  delete: {
    title: "अवतार हटाएँ",
    titleShort: "अवतार हटाएँ",
    description: "मौजूदा प्रोफ़ाइल अवतार हटाएँ",
    response: {
      title: "हटाने का रिस्पॉन्स",
      label: "हटाने का नतीजा",
      description: "अवतार हटाने का रिस्पॉन्स",
      success: "हटाना सफल",
      message: "आपका अवतार सफलतापूर्वक हट गया है",
      nextSteps: {
        item: "अगला कदम",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "अवतार हटाने की रिक्वेस्ट अमान्य है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "अवतार हटाने के लिए आपका लॉग इन होना ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "अवतार हटाया नहीं जा सका",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "आंतरिक सर्वर एरर हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "हटाने के दौरान अनपेक्षित एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "हटाने के दौरान नेटवर्क एरर हुआ",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपको यह अवतार हटाने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "हटाया जाने वाला अवतार नहीं मिला",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
      conflict: {
        title: "टकराव",
        description: "हटाने के दौरान टकराव हुआ",
      },
    },
    success: {
      title: "अवतार हट गया",
      description: "आपका प्रोफ़ाइल अवतार सफलतापूर्वक हटा दिया गया है",
    },
  },
};
