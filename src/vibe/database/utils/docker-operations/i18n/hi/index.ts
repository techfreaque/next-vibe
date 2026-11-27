import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Docker ऑपरेशन",
  titleShort: "Docker DB",
  description: "Docker कमांड चलाएँ और कंटेनर मैनेज करें",
  category: "Docker",
  tags: {
    docker: "Docker",
    utils: "यूटिलिटी",
    dockeroperations: "Docker ऑपरेशन",
  },
  container: {
    title: "Docker ऑपरेशन",
    description: "सही एरर हैंडलिंग के साथ Docker कमांड चलाएँ",
  },
  fields: {
    command: {
      label: "Docker कमांड",
      description: "चलाने के लिए Docker कमांड",
      placeholder: "docker ps",
    },
    options: {
      label: "एक्ज़ीक्यूशन विकल्प",
      description: "कमांड चलाने के कॉन्फ़िग विकल्प",
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
      title: "प्रतिबंधित",
      description: "Docker ऑपरेशन के लिए पर्याप्त अनुमति नहीं है",
    },
    internal: {
      title: "Docker एरर",
      description: "Docker कमांड नहीं चल सकी",
    },
    timeout: {
      title: "कमांड टाइमआउट",
      description: "Docker कमांड टाइमआउट सीमा से आगे निकल गई",
    },
    executionFailed: {
      title: "एक्ज़ीक्यूशन फ़ेल: {{error}}",
      description: "Docker कमांड नहीं चल सकी",
    },
    composeDownFailed: {
      title: "Compose down फ़ेल: {{error}}",
      description: "Docker Compose down ऑपरेशन फ़ेल हुआ",
    },
    composeUpFailed: {
      title: "Compose up फ़ेल: {{error}}",
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
    executionFailed: "Docker कमांड नहीं चल सकी: {command}",
    commandError: "Docker कमांड एरर: {error}",
  },
};
