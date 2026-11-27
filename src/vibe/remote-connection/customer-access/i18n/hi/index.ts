import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  denied: {
    notPaid:
      "अपना इंस्टेंस कनेक्ट करने के लिए पेड अकाउंट चाहिए। कोई भी क्रेडिट पैक या सब्सक्रिप्शन इसे अनलॉक करता है।",
    noConnection:
      "इस अकाउंट के लिए कोई सक्रिय कनेक्शन नहीं। पहले अपना इंस्टेंस कनेक्ट करें, फिर दोबारा कोशिश करें।",
    connectionLimit:
      "कनेक्शन की सीमा पूरी: हर अकाउंट पर {{max}} इंस्टेंस। नया जोड़ने के लिए कोई एक डिस्कनेक्ट करें।",
    rateLimited:
      "आपके इंस्टेंस से बहुत ज़्यादा रिक्वेस्ट आईं। {{seconds}} s बाद फिर कोशिश करें।",
    invalidUrl:
      "इंस्टेंस URL सादा ऑरिजिन होना चाहिए जैसे https://my-box.example.com, कोई पाथ या क्वेरी नहीं।",
  },
};
