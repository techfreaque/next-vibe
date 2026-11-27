import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "डेटाबेस ऑपरेशन",

  dockerOperations: {
    title: "Docker ऑपरेशन",
    description: "Docker कमांड चलाएँ और कंटेनर मैनेज करें",
    category: "Docker",
    tags: {
      docker: "Docker",
      utils: "यूटिलिटी",
      dockeroperations: "Docker ऑपरेशन",
    },
    container: {
      title: "Docker ऑपरेशन",
      description: "उचित एरर हैंडलिंग के साथ Docker कमांड चलाएँ",
    },
    fields: {
      command: {
        label: "Docker कमांड",
        description: "चलाई जाने वाली Docker कमांड",
        placeholder: "docker ps",
      },
      options: {
        label: "एक्ज़ीक्यूशन विकल्प",
        description: "कमांड एक्ज़ीक्यूशन के कॉन्फ़िगरेशन विकल्प",
        placeholder: "टाइमआउट और लॉगिंग विकल्प सेट करें",
      },
    },
    response: {
      success: {
        label: "कमांड सफल",
      },
      output: {
        label: "कमांड आउटपुट",
      },
      error: {
        label: "एरर का ब्योरा",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "Docker कमांड के पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "Docker ऑपरेशन के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "Docker ऑपरेशन के लिए अनुमतियाँ काफ़ी नहीं हैं",
      },
      internal: {
        title: "Docker एरर",
        description: "Docker कमांड चलाना फ़ेल हुआ",
      },
      timeout: {
        title: "कमांड टाइमआउट",
        description: "Docker कमांड टाइमआउट सीमा से ज़्यादा चली",
      },
      executionFailed: {
        title: "एक्ज़ीक्यूशन फ़ेल",
        description: "Docker कमांड चलाना फ़ेल हुआ",
      },
      composeDownFailed: {
        title: "Compose Down फ़ेल हुआ",
        description: "Docker Compose down ऑपरेशन फ़ेल हुआ",
      },
      composeUpFailed: {
        title: "Compose Up फ़ेल हुआ",
        description: "Docker Compose up ऑपरेशन फ़ेल हुआ",
      },
    },
    success: {
      title: "Docker कमांड सफल",
      description: "Docker कमांड सफलतापूर्वक चली",
    },
    messages: {
      executingCommand: "Docker कमांड चल रही है: {command}",
      timeoutError: "Docker कमांड {timeout}ms बाद टाइमआउट हुई: {command}",
      commandFailed: "Docker कमांड कोड {code} के साथ फ़ेल हुई: {command}",
      executionFailed: "Docker कमांड चलाना फ़ेल हुआ: {command}",
      commandError: "Docker कमांड एरर: {error}",
    },
  },
  title: "डेटाबेस यूटिल्स",
  titleShort: "DB यूटिल्स",
  description: "डेटाबेस ऑपरेशन के लिए यूटिलिटी फ़ंक्शन",
  tag: "utils",
  includeDetails: {
    title: "ब्योरा शामिल करें",
    description: "रिस्पॉन्स में विस्तृत जानकारी शामिल करें",
  },
  checkConnections: {
    title: "कनेक्शन जाँचें",
    description: "डेटाबेस कनेक्शन की स्थिति जाँचें",
  },
  status: {
    title: "हेल्थ स्थिति",
  },
  timestamp: {
    title: "टाइमस्टैंप",
  },
  connections: {
    title: "कनेक्शन स्थिति",
    primary: "प्राइमरी कनेक्शन",
    replica: "रेप्लिका कनेक्शन",
  },
  details: {
    title: "डेटाबेस का ब्योरा",
    version: "वर्ज़न",
    uptime: "अपटाइम (सेकंड)",
    activeConnections: "सक्रिय कनेक्शन",
    maxConnections: "अधिकतम कनेक्शन",
  },
  errors: {
    health_check_failed: "डेटाबेस हेल्थ जाँच फ़ेल हुई: {{error}}",
    connection_failed: "डेटाबेस कनेक्शन फ़ेल हुआ: {{error}}",
    stats_failed: "डेटाबेस आँकड़े नहीं मिल सके: {{error}}",
    docker_check_failed: "Docker उपलब्धता की जाँच फ़ेल हुई: {{error}}",
    reset_failed: "डेटाबेस रीसेट ऑपरेशन फ़ेल हुआ",
    manage_failed: "डेटाबेस मैनेजमेंट ऑपरेशन फ़ेल हुआ",
    reset_operation_failed: "रीसेट ऑपरेशन फ़ेल हुआ",
    validation: {
      title: "वैलिडेशन एरर",
      description: "डेटाबेस यूटिलिटी के पैरामीटर गलत हैं",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "डेटाबेस यूटिलिटी के लिए ऑथेंटिकेशन ज़रूरी है",
    },
    internal: {
      title: "आंतरिक एरर",
      description: "डेटाबेस यूटिलिटी ऑपरेशन फ़ेल हुआ",
    },
  },
  success: {
    title: "डेटाबेस यूटिलिटी सफल",
    description: "डेटाबेस यूटिलिटी ऑपरेशन सफलतापूर्वक पूरे हुए",
  },
  docker: {
    executing_command: "Docker कमांड चल रही है: {{command}}",
    command_timeout: "Docker कमांड {{timeout}}ms बाद टाइमआउट हुई: {{command}}",
    command_failed: "Docker कमांड कोड {{code}} के साथ फ़ेल हुई: {{command}}",
    execution_failed: "Docker कमांड चलाना फ़ेल हुआ: {{command}}",
    command_error: "Docker कमांड एरर: {{error}}",
    stopping_containers: "Docker कंटेनर रोके जा रहे हैं...",
    starting_containers: "Docker कंटेनर शुरू किए जा रहे हैं...",
  },
};
