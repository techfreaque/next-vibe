import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  snapshot: "{{date}} तक",
  reviewErrors: "एरर देखें",
  reviewTasks: "फ़ेल होने वाले टास्क देखें",
  reviewConnections: "कनेक्शन देखें",
  title: "ऑपरेशंस ओवरव्यू",
  description: "अनसुलझी एरर, फ़ेल होने वाले शेड्यूल टास्क और जुड़े इंस्टेंस की सेहत देखें।",
  errors: "अनसुलझी एरर क्लास",
  tasks: "फ़ेल होने वाले टास्क",
  connections: "अस्वस्थ कनेक्शन",
  errorAlert: "अनसुलझी एरर क्लास, चेतावनियाँ छोड़कर ({{count}})",
  taskAlert: "फ़ेल होने वाले शेड्यूल टास्क ({{count}})",
  connectionAlert: "ध्यान चाहने वाले कनेक्शन ({{count}})",
  attention: "ध्यान चाहिए",
  clear: "इन जाँचों में कोई खुला मुद्दा नहीं।",
  unavailable: "कुछ हेल्थ जाँचें उपलब्ध नहीं हैं।",
  recent: "हाल की गतिविधि",
  loading: "सिस्टम हेल्थ लोड हो रही है",
  retry: "रीट्राई",
};
