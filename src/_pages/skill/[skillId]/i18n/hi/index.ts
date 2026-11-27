import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}}: {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    category: "AI स्किल",
    keywords: "AI स्किल, {{name}}, {{appName}}, अनसेंसर्ड AI चैट",
  },
  breadcrumb: {
    skills: "स्किल",
  },
  hero: {
    tryGeneric: "यह स्किल आज़माएँ",
  },
  publishedBy: "{{name}} ने पब्लिश किया",
  madeBy: "{{name}} का",
  startChat: "चैट शुरू करें",
  chatWith: "{{name}} से चैट करें",
  guest: "साइन अप की ज़रूरत नहीं",
  chatModel: "चैट मॉडल",
  facts: {
    runsOn: "किस पर चलता है",
    content: "कंटेंट",
    perMessage: "हर मैसेज",
    versions: "वर्ज़न",
    goodAt: "किसमें अच्छा है",
    keepInMind: "ध्यान रखें",
  },
  prompts: {
    intro: "हर एक {{name}} के साथ चैट खोलता है, टाइप किया हुआ और भेजने को तैयार।",
    start: "इनमें से किसी से शुरू करें",
  },
  story: {
    title: "{{name}} के बारे में",
  },
  model: {
    credits: "{{cost}} क्रेडिट",
    creditsAbout: "~{{cost}} क्रेडिट",
    fixedPrice: "हर मैसेज {{cost}} क्रेडिट",
    estimatedPrice: "हर मैसेज लगभग {{cost}} क्रेडिट",
    free: "हर मैसेज फ़्री",
    perMessageHint:
      "आम मैसेज: {{input}} टोकन इनपुट, {{output}} आउटपुट। लंबाई के साथ बदलता है।",
    perMessageWithImageHint:
      "आम मैसेज: {{input}} टोकन इनपुट, {{output}} आउटपुट, एक इमेज। लंबाई के साथ बदलता है।",
  },
  actions: {
    shareEarn: "शेयर करें और कमाएँ",
    addToSkills: "मेरे स्किल में जोड़ें",
    added: "आपके स्किल में जुड़ गया",
    addFailed: "जोड़ नहीं पाए। फिर कोशिश करें",
  },
  tier: {
    mainstream:
      "{{name}} {{model}} पर चलता है, एक बड़ी लैब का मॉडल जिसके अपने सेफ़्टी फ़िल्टर हैं। यह बोल्ड रिक्वेस्ट को मना कर सकता है।",
    open: "{{name}} {{model}} पर चलता है, एक ओपन वेट मॉडल जिसके फ़िल्टर हल्के हैं। यह बड़ी लैब के बॉट्स से ज़्यादा बात करता है और कम मना करता है।",
    uncensored:
      "{{name}} {{model}} पर चलता है, जो बिना टॉपिक फ़िल्टर के बातचीत के लिए बना है। पहले मैसेज से पहले एक बार 18+ चेक।",
    ownWorldview:
      "{{model}} उन किताबों और दस्तावेज़ों पर ट्रेन किया गया है जिन्हें मुख्यधारा इंटरनेट से हटा दिया गया। {{name}} आपको मुख्यधारा से उलटी राजनीतिक राय देता है। पहले मैसेज से पहले एक बार 18+ चेक।",
    abliterated:
      "{{model}} एक मेनस्ट्रीम मॉडल है जिससे मना करने की आदत हटा दी गई है। {{name}} भाषण देने के बजाय जवाब देता है। पहले मैसेज से पहले एक बार 18+ चेक।",
    fineTuned:
      "{{model}} को आम इनकार छोड़ने के लिए फ़ाइन ट्यून किया गया है। जहाँ मेनस्ट्रीम बॉट टालते हैं, वहाँ {{name}} जवाब देता है। पहले मैसेज से पहले एक बार 18+ चेक।",
  },
  share: {
    text: "कोई ऐसा जानते हैं जिसे {{name}} पसंद आएगा? लिंक शेयर करें और उनके खर्च से कमाएँ।",
  },
  related: {
    similar: "मिलते जुलते स्किल",
    moreFrom: "{{name}} के और स्किल",
  },
};
