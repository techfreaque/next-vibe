import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "डेटाबेस ऑपरेशन",

  tag: "migration",
  post: {
    title: "डेटाबेस माइग्रेशन",
    titleShort: "DB माइग्रेट करें",
    description: "डेटाबेस माइग्रेशन चलाएँ",
    form: {
      title: "माइग्रेशन कॉन्फ़िगरेशन",
      description: "डेटाबेस माइग्रेशन के विकल्प सेट करें",
    },
    response: {
      title: "माइग्रेशन रिस्पॉन्स",
      description: "माइग्रेशन ऑपरेशन के नतीजे",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "माइग्रेशन पैरामीटर गलत हैं",
      },
      internal: {
        title: "इंटरनल एरर",
        description: "माइग्रेशन ऑपरेशन फ़ेल हुआ",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "माइग्रेशन ऑपरेशन के लिए लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "माइग्रेशन ऑपरेशन के लिए अनुमतियाँ काफ़ी नहीं हैं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माइग्रेशन रिसोर्स नहीं मिले",
      },
      server: {
        title: "सर्वर एरर",
        description: "माइग्रेशन के दौरान इंटरनल सर्वर एरर",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "माइग्रेशन के दौरान अज्ञात एरर आया",
      },
      conflict: {
        title: "टकराव",
        description: "माइग्रेशन कॉन्फ़्लिक्ट मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "माइग्रेशन ऑपरेशन के दौरान नेटवर्क एरर",
        detail: "माइग्रेशन फ़ेल हुआ: {{error}}",
        exitCode: "drizzle-kit migrate कोड {{code}} के साथ बंद हुआ",
      },
    },
    success: {
      title: "माइग्रेशन सफल",
      description: "डेटाबेस माइग्रेशन पूरा हुआ",
    },
  },
  fields: {
    generate: {
      title: "माइग्रेशन जनरेट करें",
      description: "स्कीमा बदलावों से नई माइग्रेशन फ़ाइलें बनाएँ",
    },
    redo: {
      title: "आख़िरी माइग्रेशन दोबारा चलाएँ",
      description: "आख़िरी माइग्रेशन रोलबैक करके फिर लागू करें",
    },
    schema: {
      title: "डेटाबेस स्कीमा",
      description: "टारगेट डेटाबेस स्कीमा (डिफ़ॉल्ट: public)",
    },
    success: {
      title: "सफलता स्टेटस",
    },
    migrationsRun: {
      title: "चलाए गए माइग्रेशन",
    },
    migrationsGenerated: {
      title: "बने माइग्रेशन",
    },
    output: {
      title: "आउटपुट",
    },
    duration: {
      title: "अवधि (ms)",
    },
  },
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "माइग्रेशन पैरामीटर गलत हैं",
    },
    internal: {
      title: "इंटरनल एरर",
      description: "माइग्रेशन ऑपरेशन फ़ेल हुआ",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "माइग्रेशन ऑपरेशन के लिए लॉगिन ज़रूरी है",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "माइग्रेशन ऑपरेशन के लिए अनुमतियाँ काफ़ी नहीं हैं",
    },
    notFound: {
      title: "नहीं मिला",
      description: "माइग्रेशन रिसोर्स नहीं मिले",
    },
    server: {
      title: "सर्वर एरर",
      description: "माइग्रेशन के दौरान इंटरनल सर्वर एरर",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "माइग्रेशन के दौरान अज्ञात एरर आया",
    },
    conflict: {
      title: "टकराव",
      description: "माइग्रेशन कॉन्फ़्लिक्ट मिला",
    },
    generationFailed: "माइग्रेशन नहीं बन पाए: {{message}}",
    generationFailedWithCode:
      "माइग्रेशन बनाना कोड {{code}} के साथ फ़ेल हुआ: {{output}}",
    migrationFailed: "माइग्रेशन नहीं चल पाए: {{message}}",
  },
  success: {
    title: "माइग्रेशन सफल",
    description: "डेटाबेस माइग्रेशन पूरा हुआ",
  },
  status: {
    pending: "पेंडिंग",
    running: "चल रहा है",
    success: "सफल",
    failed: "फ़ेल",
    rolledBack: "रोलबैक हुआ",
  },
  direction: {
    up: "ऊपर",
    down: "डाउन",
  },
  environment: {
    development: "डेवलपमेंट",
    staging: "स्टेजिंग",
    production: "प्रोडक्शन",
  },
  messages: {
    dryRun: "ड्राई रन: माइग्रेशन चलाए जाते",
    generatingMigrations: "माइग्रेशन जनरेशन:\n{{output}}\n",
    noMigrationsFolder: "माइग्रेशन फ़ोल्डर नहीं मिला",
    noMigrationFiles: "कोई माइग्रेशन फ़ाइल नहीं मिली",
    executedMigrations: "{{count}} माइग्रेशन सफलतापूर्वक चले",
    redoNotImplemented: "रीडू की सुविधा यहाँ लागू होगी",
    repairCompleted: "माइग्रेशन रिपेयर पूरा हुआ",
    repairDryRun: "ड्राई रन: माइग्रेशन रिपेयर किया जाता",
    trackingReset: "माइग्रेशन ट्रैकिंग रीसेट हो गई",
    productionCompleted: "प्रोडक्शन माइग्रेशन सफलतापूर्वक पूरे हुए",
    productionWithBackup: " (बैकअप के साथ)",
    syncCompleted: "माइग्रेशन सिंक पूरा हुआ ({{direction}})",
    failedToGenerate: "माइग्रेशन नहीं बन पाए: {{error}}",
    failedToExecute: "माइग्रेशन नहीं चल पाए: {{error}}",
    failedToRedo: "माइग्रेशन रीडू नहीं हो पाया: {{error}}",
  },
};
