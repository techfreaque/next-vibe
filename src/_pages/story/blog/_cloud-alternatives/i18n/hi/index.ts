import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  rules: {
    checked:
      "{{date}} को हर प्रोवाइडर के ऑफ़िशियल डॉक्स और पॉलिसी से पढ़ा गया। मोबाइल पर साइड में स्क्रॉल करें।",
    columns: {
      name: "सर्विस",
      defaults: "डिफ़ॉल्ट फ़िल्टर",
      off: "बंद करने का तरीका",
      models: "अनसेंसर्ड मॉडल",
      weights: "आपके अपने weights",
      rules: "कंटेंट नियम जो फिर भी रहते हैं",
    },
    rows: {
      azure: {
        defaults: "Whisper को छोड़कर हर मॉडल पर चालू।",
        off: "सिर्फ़ मंज़ूरी मिलने पर। कस्टमर इसे ज़्यादा से ज़्यादा High तक ढीला कर सकते हैं। पूरा कंट्रोल चाहिए तो आवेदन करना पड़ता है, जो सिर्फ़ Microsoft अकाउंट टीम वाले या योग्य प्रोग्राम के कस्टमर्स के लिए खुला है।",
        models: "कैटलॉग में कोई नहीं मिला।",
        weights: "इस गाइड के लिए जाँचा नहीं गया।",
        rules:
          "Code of Conduct सेक्शुअली एक्सप्लिसिट कंटेंट और इरोटिक या रोमांटिक चैटबॉट्स पर रोक लगाता है, फ़िल्टर चालू हो या बंद।",
      },
      bedrock: {
        defaults:
          "Guardrail जोड़े बिना कोई Bedrock फ़िल्टर नहीं। CSAM डिटेक्शन हमेशा चालू रहता है।",
        off: "Guardrail ID मत दीजिए। मॉडल के अपने refusals फिर भी रहेंगे।",
        models: "कैटलॉग में कोई नहीं।",
        weights:
          "Custom Model Import: Llama, Mistral, Qwen और gpt-oss आर्किटेक्चर, बिलिंग Custom Model Unit प्रति मिनट के हिसाब से।",
        rules:
          "Responsible AI Policy सेफ़्टी फ़िल्टर को बायपास करने और बिना सहमति वाली सेक्शुअल इमेजरी पर रोक लगाती है।",
      },
      vertex: {
        defaults:
          "gemini-3.5-flash और उसके बाद के मॉडल में डिफ़ॉल्ट रूप से बंद। मुख्य harms फिर भी ब्लॉक रहते हैं।",
        off: "थ्रेशोल्ड OFF कर दीजिए। Gemini के ट्रेन किए हुए refusals फिर भी रहते हैं।",
        models: "ओपन मॉडल लिस्ट में कोई नहीं।",
        weights: "Model Garden में vLLM या TGI कंटेनर पर सेल्फ़-डिप्लॉय।",
        rules:
          "Prohibited Use Policy सेक्शुअली एक्सप्लिसिट कंटेंट और सेफ़्टी फ़िल्टर बायपास करने पर रोक लगाती है।",
      },
      together: {
        defaults: "हमारे पढ़े पेजों पर फ़िल्टर स्विच का ज़िक्र नहीं है।",
        off: "लागू नहीं।",
        models: "सर्वरलेस लिस्ट में कोई नहीं।",
        weights:
          "Dedicated endpoints $5.49 प्रति H100 घंटे से। अपलोड सपोर्टेड आर्किटेक्चर के fine-tune ही होने चाहिए।",
        rules: "टर्म्स अश्लील कंटेंट और पोर्नोग्राफ़ी पर रोक लगाते हैं।",
      },
      us: {
        defaults:
          "मॉडल आप चुनते हैं: मेनस्ट्रीम, ओपन या अनसेंसर्ड। ऊपर से कोई फ़िल्टर लेयर नहीं।",
        off: "अनसेंसर्ड मॉडल चुनिए और एक बार पुष्टि कीजिए कि आप 18+ हैं।",
        models: "अभी {{uncensored}} लाइव हैं।",
        weights: "सपोर्टेड नहीं। हम चुना हुआ कैटलॉग चलाते हैं।",
        rules:
          "अनसेंसर्ड मॉडल एक बार की 18+ सहमति के बाद खुलते हैं। मॉडल प्रोवाइडर के टर्म्स फिर भी लागू रहते हैं।",
      },
    },
    sourceLabels: {
      filters: "{{name}}: फ़िल्टर डॉक्स",
      access: "{{name}}: एक्सेस नियम",
      policy: "{{name}}: यूसेज पॉलिसी",
      privacy: "{{name}}: डेटा हैंडलिंग",
      pricing: "{{name}}: प्राइसिंग",
      import: "{{name}}: अपने weights",
    },
    sourcesTitle: "सोर्स",
  },
  prices: {
    columns: {
      model: "मॉडल",
      provider: "प्रोवाइडर",
      input: "Input / 1M",
      output: "Output / 1M",
    },
    us: "{{appName}}",
    live: "लाइव प्राइस",
    source: "सोर्स",
    note: "USD प्रति 1M टोकन। प्रतिस्पर्धियों की कीमतें {{date}} को उनकी पब्लिक मॉडल लिस्ट से पढ़ी गईं। हमारी कीमत हमारी रजिस्ट्री से लाइव पढ़ी जाती है, हमारा {{markup}}% मार्कअप शामिल है। जहाँ सस्ता रूट कॉन्फ़िगर है, हम वही इस्तेमाल करते हैं और दिखाई गई कीमत उसी के हिसाब से होती है।",
  },
  alts: {
    heading: "{{number}}. {{name}}",
    strength: "सबसे अच्छी बात:",
    catch: "कमी:",
    sources: "सोर्स:",
    versusLink: "{{appName}} बनाम {{name}}: पूरी तुलना",
    openRouter: {
      what: "एक key के पीछे 477 मॉडल वाला गेटवे। इनफ़रेंस पर कोई मार्कअप नहीं, क्रेडिट खरीद पर 5.5% फ़ीस (क्रिप्टो के लिए 5%)।",
      strength:
        "अपनी प्रोवाइडर keys महीने के $25,000 तक फ़्री इस्तेमाल करें, हर रिक्वेस्ट पर zero data retention रूटिंग, USDC पेमेंट।",
      catch:
        "17 रोलप्ले या अनसेंसर्ड-ट्यून मॉडल, पर नाम में abliterated या uncensored वाला एक भी id नहीं। API ओवरव्यू में Anthropic Messages endpoint नहीं।",
    },
    venice: {
      what: "चैट ऐप और OpenAI-कम्पैटिबल API। अपने fine-tune Venice Uncensored 1.2 ($0.20 / $0.90) और Venice Role Play Uncensored, साथ में abliterated GLM, DeepSeek, Gemma और Qwen मॉडल।",
      strength:
        "इमेज, वीडियो, वॉइस और म्यूज़िक उसी API में। एन्क्रिप्टेड और TEE मॉडल के विकल्प। x402 के साथ USDC वॉलेट से प्रति रिक्वेस्ट पेमेंट, अकाउंट नहीं चाहिए।",
      catch:
        "नेटिव Anthropic Messages endpoint नहीं, Claude Code के लिए लोकल प्रॉक्सी चाहिए। टर्म्स एक्सेस को दोबारा बेचने से रोकते हैं। फ़्री टियर में रोज़ 10 टेक्स्ट प्रॉम्प्ट।",
    },
    nanoGpt: {
      what: "पे-पर-यूज़ गेटवे जिसमें 610 मॉडल हैं, इनमें लगभग 54 abliterated या uncensored id हैं।",
      strength:
        "OpenAI chat completions, Responses और Anthropic Messages। Bitcoin और Monero, अकाउंट नहीं चाहिए, पे-ऐज़-यू-गो रीसेल की इजाज़त।",
      catch:
        "शोर भरा कैटलॉग, जिसमें कई मिलते-जुलते uncensored id हैं। प्रोडक्ट गेटवे-पहले सोच पर बना है।",
    },
    openUncensored: {
      what: "abliterated weights के लिए API राउटर: प्रीपेड key पर 58 टेक्स्ट, 20 इमेज और 3 वीडियो मॉडल। आपकी key ही आपका अकाउंट है।",
      strength:
        "प्रोवाइडर की कीमतों पर कोई कमीशन नहीं। GLM 5.3 Flash Uncensored $0.12 / $0.50 से। OpenAI, Responses और Anthropic फ़ॉर्मेट एक ही base URL पर।",
      catch:
        "फ़्री टियर नहीं, क्रिप्टो का ज़िक्र नहीं, रिक्वेस्ट मेटाडेटा दो साल तक रखा जाता है। वेब चैट नहीं, सिर्फ़ डेस्कटॉप ऐप।",
    },
    refuseless: {
      what: "refusal हटाए गए ओपन weights का सिर्फ़-API होस्ट: 1M कॉन्टेक्स्ट वाले चार abliterated मॉडल, और कुछ स्टॉक मॉडल।",
      strength:
        "DeepSeek V4.1 Flash abliterated $0.12 / $0.45 पर और GLM 5.3 Flash abliterated $0.12 / $0.50 पर। Chat completions, Responses, Anthropic Messages और embeddings।",
      catch:
        "चैट इंटरफ़ेस नहीं। इसके प्राइवेसी और टर्म्स पेजों ने हमारे रीडर को ब्लॉक कर दिया, इसलिए शिप करने से पहले ख़ुद पढ़ लीजिए।",
    },
    abliterationHosts: {
      what: "दो और abliterated API। NEAR AI Cloud मॉडल हार्डवेयर enclaves में चलाता है: Qwen 3.8 27B Abliterated $0.04 / $1.35 पर। abliteration.ai अपने abliterated ब्रांड $1 / $2 से बेचता है।",
      strength:
        "NEAR: कोई आवेदन नहीं, कोई पहचान जाँच नहीं, verifiable attestation। abliteration.ai: प्रॉम्प्ट मेमोरी में प्रोसेस होते हैं और डिफ़ॉल्ट रूप से सेव नहीं होते, EU रीजन, OpenAI और Anthropic फ़ॉर्मेट।",
      catch:
        "छोटे कैटलॉग। NEAR में Anthropic फ़ॉर्मेट का ज़िक्र नहीं। मिलते-जुलते weights के लिए abliteration.ai, Refuseless या NEAR से महँगा है।",
    },
    togetherFireworks: {
      what: "स्टॉक ओपन मॉडल के लिए तेज़ इनफ़रेंस क्लाउड। Together के 24 सर्वरलेस चैट मॉडल में एक भी uncensored नहीं। Fireworks में Dolphin, Hermes और Dobby Unhinged मॉडल लिस्टेड हैं, सर्वरलेस स्टेटस कन्फ़र्म नहीं।",
      strength:
        "Together: OpenAI, Responses और Anthropic Messages, सेल्फ़-सर्व zero data retention। Fireworks: ओपन मॉडल के लिए डिफ़ॉल्ट रूप से कोई प्रॉम्प्ट लॉग नहीं, प्रति मिनट 6,000 रिक्वेस्ट तक।",
      catch:
        "Together के टर्म्स अश्लील कंटेंट और पोर्नोग्राफ़ी पर रोक लगाते हैं। Fireworks आपसे वारंटी लेता है कि आपके इनपुट में न्यूडिटी या सेक्शुअली सजेस्टिव कंटेंट नहीं है।",
    },
    selfHost: {
      what: "abliterated weights ख़ुद चलाइए। वर्कस्टेशन पर Ollama और LM Studio, अपने GPU पर vLLM या TGI। सब OpenAI chat completions फ़ॉर्मेट बोलते हैं।",
      strength:
        "आपके प्रॉम्प्ट कभी आपकी मशीनों से बाहर नहीं जाते। कोई भी abliterated GGUF या safetensors मॉडल, जो आप डाउनलोड कर सकें। लोकल इस्तेमाल पर हार्डवेयर के अलावा कोई ख़र्च नहीं।",
      catch:
        "GPU, अपडेट और अपटाइम आपको सँभालने पड़ते हैं। फ़्रंटियर-साइज़ मॉडल के लिए डेटासेंटर हार्डवेयर चाहिए।",
    },
  },
};
