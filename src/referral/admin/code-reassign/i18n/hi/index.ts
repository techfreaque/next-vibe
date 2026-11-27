import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "रेफ़रल",
  tags: {
    referral: "referral",
    admin: "admin",
  },
  post: {
    title: "रेफ़रल कोड दोबारा असाइन करें",
    titleShort: "कोड दोबारा असाइन करें",
    description:
      "रेफ़रल कोड दूसरे अकाउंट पर ले जाएँ। जिन यूज़र्स को यह पहले रेफ़र कर चुका है वे कोड से जुड़े रहते हैं, इसलिए उनका आगे का कमीशन नए मालिक को जाता है। पिछली कमाई उसी के पास रहती है जिसने कमाई। डिफ़ॉल्ट रूप से ड्राई रन।",
    fields: {
      code: {
        label: "रेफ़रल कोड",
        description: "जिस कोड को ले जाना है उसका सटीक रूप",
        placeholder: "quelllm",
      },
      targetUser: {
        label: "नया मालिक",
        description: "जिस अकाउंट को कोड मिलेगा उसकी यूज़र ID या ईमेल",
        placeholder: "creator@example.com",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "बिना कुछ बदले ले जाने का प्रीव्यू करें",
      },
    },
    response: {
      dryRun: "ड्राई रन",
      code: "कोड",
      fromUserId: "पिछले मालिक की ID",
      fromEmail: "पिछला मालिक",
      toUserId: "नए मालिक की ID",
      toEmail: "नया मालिक",
      referralsMoved: "ले जाए गए रेफ़र किए यूज़र",
      selfReferralsKept: "पिछले मालिक के पास रखे गए सेल्फ़-रेफ़रल",
      linksMoved: "ले जाए गए ट्रैक किए लिंक",
      linksTotal: "कोड इस्तेमाल करने वाले कैंपेन लिंक",
    },
    widget: {
      back: "वापस",
      hint: "कमीशन कोड के मालिक के साथ चलता है। पहले ड्राई रन चलाएँ, फिर कोड ले जाने के लिए उसे बंद करें।",
      submit: "कोड दोबारा असाइन करें",
      preview: "ड्राई रन। कुछ नहीं बदला।",
      done: "कोड ले जाया गया।",
      summary: "{{code}}: {{from}} → {{to}}",
    },
    note: "रेफ़रल कोड {{code}} को {{admin}} ने {{at}} पर {{from}} से {{to}} को ले जाया। ले जाए गए रेफ़र किए यूज़र: {{referrals}}। ले जाए गए ट्रैक किए लिंक: {{links}}। पिछली कमाई अपरिवर्तित।",
  },
  errors: {
    validation: {
      title: "इनपुट गलत है",
      description: "कोड और नया मालिक जाँचें",
    },
    unauthorized: {
      title: "साइन इन नहीं है",
      description: "कोड दोबारा असाइन करने के लिए एडमिन के रूप में साइन इन करें",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन",
      description: "सिर्फ़ एडमिन रेफ़रल कोड दोबारा असाइन कर सकते हैं",
    },
    notFound: {
      title: "नहीं मिला",
      description: "कोड या यूज़र मौजूद नहीं है",
    },
    conflict: {
      title: "टकराव",
      description: "नया मालिक यह कोड पहले से रखता है",
    },
    server: {
      title: "सर्वर एरर",
      description: "कोड दोबारा असाइन नहीं हो सका",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "रिक्वेस्ट सर्वर तक नहीं पहुँची",
    },
    unknown: {
      title: "अनजान एरर",
      description: "कुछ अप्रत्याशित फ़ेल हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले अपने बदलाव सेव करें या छोड़ दें",
    },
    codeNotFound: "रेफ़रल कोड {{code}} मौजूद नहीं है",
    userNotFound: "{{target}} से कोई यूज़र मेल नहीं खाता",
    alreadyOwner: "{{target}} के पास रेफ़रल कोड {{code}} पहले से है",
  },
  success: {
    title: "हो गया",
    description: "रेफ़रल कोड दोबारा असाइन हुआ",
  },
};
