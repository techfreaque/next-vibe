import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "मेंटेनेंस",
  },
  post: {
    title: "स्टेल रन रीपर",
    titleShort: "स्टेल रन",
    description:
      "उन चैट थ्रेड को मुक्त करता है जो 'streaming' में अटक गए क्योंकि जवाब लिखने वाला प्रोसेस मर गया। अधूरा जवाब रखता है, उसे बाधित चिह्नित करता है और कतार के मैसेज शुरू करता है। किसी भी नोड पर चल रहे लाइव रन को कभी नहीं छूता।",
    container: {
      title: "स्टेल रन रीपर",
      description: "अटके थ्रेड का प्रीव्यू करें या उन्हें मुक्त करें",
    },
    fields: {
      localThresholdMinutes: {
        label: "लोकल सीमा (मिनट)",
        description:
          "लोकल रन को तब रीप करें जब उसके मालिक ने इतने समय तक हार्टबीट न भेजी हो",
      },
      remoteThresholdMinutes: {
        label: "रिमोट सीमा (मिनट)",
        description:
          "दूसरे इंस्टेंस पर लूप हो रहे रन को तब रीप करें जब इतने समय तक कुछ न आया हो",
      },
      batchSize: {
        label: "अधिकतम थ्रेड",
        description: "हर रन में मुक्त किए जाने वाले थ्रेड की ऊपरी सीमा",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "अटके थ्रेड की सूची दिखाएँ, कुछ न बदलें",
      },
    },
    response: {
      candidates: "मिले अटके थ्रेड",
      reaped: "मुक्त किए गए थ्रेड",
      lost: "छोड़े गए: फिर चालू हो गए",
      failed: "फ़ेल",
      queuedStarted: "शुरू किए गए कतार के मैसेज",
      threadIds: "थ्रेड ID",
      executionTimeMs: "एक्ज़ीक्यूशन समय (ms)",
    },
    success: {
      title: "स्वीप पूरा हुआ",
      description: "अटके थ्रेड मुक्त हुए",
    },
  },
  interrupted: {
    content:
      "यह जवाब लिखे जाते समय सर्वर रीस्टार्ट हो गया। अधूरा जवाब सेव है। जारी रखने के लिए दोबारा कोशिश करें।",
  },
  errors: {
    failed: "स्टेल रन स्वीप फ़ेल हुआ: {{error}}",
    server: {
      title: "स्वीप एरर",
      description: "स्टेल रन स्वीप फ़ेल हुआ",
    },
  },
  task: {
    name: "स्टेल रन रीपर",
    description:
      "हर 5 मिनट में: उन चैट थ्रेड को मुक्त करता है जिन्हें किसी मर चुके प्रोसेस ने जवाब के बीच में स्ट्रीमिंग में छोड़ दिया",
  },
};
