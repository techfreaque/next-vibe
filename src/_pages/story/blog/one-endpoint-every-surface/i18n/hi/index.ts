import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "एक endpoint। हर सरफ़ेस। (next-vibe)",
    description:
      "हर फ़ीचर के लिए एक definition.ts लिखिए। वो एक साथ वेब फ़ॉर्म, CLI कमांड, MCP टूल, नेटिव स्क्रीन और cron जॉब बन जाता है। कोई दोहराव नहीं। टाइप्स लागू।",
    category: "आर्किटेक्चर",
    imageAlt: "next-vibe का unified surface आर्किटेक्चर: एक endpoint, हर प्लेटफ़ॉर्म",
    keywords:
      "next-vibe, TypeScript, unified surface, MCP, CLI, definition.ts, ओपन सोर्स, SaaS फ़्रेमवर्क",
  },
  hero: {
    backToBlog: "ब्लॉग पर वापस",
    category: "आर्किटेक्चर",
    readTime: "5 मिनट में पढ़ें",
    title: "एक endpoint। हर सरफ़ेस।",
    subtitle:
      "हर फ़ीचर के लिए एक definition लिखिए। वेब फ़ॉर्म, CLI कमांड, MCP टूल, नेटिव स्क्रीन, cron जॉब: सब एक साथ। कोई दोहराव नहीं।",
  },
  intro: {
    paragraph1:
      "हर फ़ीचर को एक वेब फ़ॉर्म चाहिए था, एक CLI कमांड, AI एजेंट्स के लिए एक MCP टूल, कभी-कभी एक मोबाइल स्क्रीन। वही Zod वैलिडेशन, वही i18n, वही एरर हैंडलिंग: बस अलग कपड़ों में। इसलिए मैंने next-vibe बनाया: एक फ़्रेमवर्क जहाँ आप हर फ़ीचर के लिए एक definition.ts लिखते हैं और वो एक साथ इन सबके रूप में रेंडर होता है।",
    paragraph2:
      "यही {{appName}} को भी चलाता है: {{modelCount}} AI मॉडल, यूज़र के हाथ में सेंसरशिप का कंट्रोल। वही कोडबेस Next.js वेब ऐप, TanStack/Vite डेव सर्वर, React Native मोबाइल ऐप, CLI, MCP सर्वर, cron सिस्टम और WebSocket इवेंट बस के रूप में चलता है। एक endpoint definition। कोई दोहराव नहीं।",
  },
  typeRules: {
    title: "टाइप्स मेल खाने चाहिए। कोई अपवाद नहीं।",
    subtitle: "ये स्टाइल की पसंद नहीं हैं। ये फ़्रेमवर्क में बुने हुए आर्किटेक्चर नियम हैं।",
    intro:
      "नियम सख़्त है: टाइप्स पूरी तरह मेल खाने चाहिए। टाइप्स गलत हैं तो आर्किटेक्चर गलत है। इसे लागू करने के लिए हमने vibe check बनाया: Oxlint + ESLint + TypeScript समानांतर, प्रोजेक्ट-विशेष नियमों के लिए कस्टम प्लगइन के साथ।",
    any: {
      name: "no any",
      description:
        "इसकी जगह असली टाइप्ड इंटरफ़ेस लिखिए। any तक हाथ जाए तो आपके आर्किटेक्चर में छेद है।",
    },
    unknown: {
      name: "no unknown",
      description:
        "वही नियम। unknown बस थोड़े और कदमों वाला any है। टाइप तय कीजिए।",
    },
    object: {
      name: "no bare object",
      description:
        "खाली object का कोई मतलब नहीं। वो शेप लिखिए जो आप सच में उम्मीद करते हैं।",
    },
    asX: {
      name: "no as X",
      description:
        "टाइप असर्शन कंपाइलर से झूठ बोलना है। इसकी जगह आर्किटेक्चर ठीक कीजिए।",
    },
    throwStatements: {
      name: "no throw",
      description:
        "success(data) या fail({message, errorType}) के साथ ResponseType<T> इस्तेमाल कीजिए। एरर डेटा हैं, exception नहीं।",
    },
    hardcodedStrings: {
      name: "JSX में कोई हार्डकोडेड स्ट्रिंग नहीं",
      description:
        "चेकर बिना ट्रांसलेट किए लिटरल स्ट्रिंग पकड़ लेता है। हर स्ट्रिंग को ट्रांसलेशन key चाहिए।",
    },
  },
  vibeSense: {
    title: "अनजाने में बना ग्राफ़ इंजन",
    subtitle: "एक ट्रेडिंग बॉट जो ट्रेड नहीं कर सकता",
    description:
      "Vibe Sense एक ट्रेडिंग बॉट के रूप में शुरू हुआ। उसने कभी ऑर्डर एक्ज़ीक्यूट नहीं किए। वो बस कीमतें देखता और सिग्नल फ़ायर करता था। जब मैंने उसे छोड़ा, तो पाइपलाइन आर्किटेक्चर बच गया: डेटा सोर्स इंडिकेटर्स से जुड़ते हैं, इंडिकेटर्स इवैल्यूएटर्स को फ़ीड करते हैं, इवैल्यूएटर्स सिग्नल निकालते हैं, सिग्नल एक्शन ट्रिगर करते हैं। हर नोड एक HTTP endpoint है।",
    quote:
      "ग्राफ़ का हर नोड बस एक HTTP endpoint है। आप पाइपलाइन के किसी भी स्टेप को curl कर सकते हैं, उसे अलग से टेस्ट कर सकते हैं, या किसी AI एजेंट से कॉल कर सकते हैं। ग्राफ़ इंजन एक शेड्यूलर है, DSL नहीं।",
    whyItMatters:
      "क्योंकि हर नोड एक स्टैंडर्ड endpoint है, वो CLI से अलग-अलग टेस्ट होते हैं, MCP से AI एजेंट्स के लिए सुलभ हैं, और बाकी सब की तरह उसी इंफ़्रा से कैश हो सकते हैं। ग्राफ़ इंजन अपनी कोई भाषा नहीं गढ़ता। वो endpoints को शेड्यूल करता है।",
  },
  cta: {
    title: "कोड पढ़िए। ख़ुद चलाइए।",
    subtitle:
      "next-vibe ओपन सोर्स है। इसे क्लोन कीजिए, vibe dev चलाइए, और एक दोपहर में अपना पहला endpoint हर सरफ़ेस पर शिप कीजिए।",
    github: "GitHub पर देखें",
    clone: "git clone https://github.com/techfreaque/next-vibe",
    framework: "next-vibe देखें",
  },
};
