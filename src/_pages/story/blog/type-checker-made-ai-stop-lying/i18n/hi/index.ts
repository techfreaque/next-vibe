import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "मैंने एक टाइप चेकर बनाया जिसने AI का झूठ बोलना बंद करा दिया: next-vibe",
    description:
      "AI टाइप एरर से बचने के लिए `any` लगा देता है। eslint-disable जोड़ देता है। आपसे झूठ बोलता है। @next-vibe/checker से हमने फ़ीडबैक लूप कैसे ठीक किया, ये पढ़िए।",
    category: "TypeScript",
    imageAlt: "वो टाइप चेकर जिसने AI का झूठ बोलना बंद कराया",
    keywords:
      "TypeScript, टाइप चेकर, AI कोडिंग, ESLint, Oxlint, any type, टाइप सेफ़्टी, Claude Code, next-vibe",
  },
  hero: {
    label: "TypeScript",
    readTime: "10 मिनट में पढ़ें",
    title: "मैंने एक टाइप चेकर बनाया जिसने AI का मुझसे झूठ बोलना बंद करा दिया",
    subtitle:
      "AI टाइप एरर से बचने के लिए `any` लगा देता है। eslint-disable जोड़ देता है। आपसे झूठ बोलता है। यहाँ पढ़िए हमने फ़ीडबैक लूप कैसे ठीक किया।",
    quoteAiLies:
      "AI आपसे इसलिए झूठ नहीं बोलता कि वो चाहता है। वो इसलिए बोलता है कि आप उसे बोलने देते हैं।",
  },
  problem: {
    title: "टूटा हुआ फ़ीडबैक लूप",
    description:
      "Claude Code से कोई फ़ीचर जोड़ने को कहिए। वो जोड़ देता है। ESLint पास, पर TypeScript को एरर मिलते हैं। Claude Code से उन्हें ठीक करने को कहिए। वो करता है, और अब ESLint फ़ेल। आगे-पीछे। तीन राउंड। हर कदम पर AI पूरे भरोसे से कहता है, “ठीक हो गया।”",
    fixLabel: "वो कभी ठीक नहीं हुआ था।",
    fixDescription:
      "ये एक ऐसे टूल के साथ चूहे-बिल्ली का खेल था जो एक बार में एक लिंटर चलाता है और पूरी तस्वीर कभी नहीं देखता।",
    escapeHatch:
      'AI एक लाइन लिखकर TypeScript एरर "ठीक" कर देता है और आपसे कहता है: "टाइप एरर सुलझ गया।"',
    smokeDetector:
      'हाँ। तकनीकी रूप से। वैसे ही जैसे स्मोक डिटेक्टर पर टेप चिपकाकर आग का अलार्म "सुलझा" दिया जाए।',
    introducingChecker: "इसी को रोकने के लिए मैंने @next-vibe/checker बनाया।",
  },
  anyProblem: {
    title: "`any` की समस्या",
    subtitle: "98% टाइप सेफ़्टी और 0% एक ही बात क्यों है",
    graphDescription:
      "TypeScript का टाइप सिस्टम एक ग्राफ़ है। हर टाइप डेफ़िनिशन से इस्तेमाल तक बहता है। कोई फ़ंक्शन `string` लौटाए, तो कॉलर जानता है कि वो string है। पूरी चेन चेक होती है।",
    holeInGraph: "`any` ग्राफ़ में एक छेद है।",
    holeDescription:
      "`any` टाइप वाला वेरिएबल कंपाइलर से कहता है: यहाँ चेक करना बंद करो। सिर्फ़ इस वेरिएबल के लिए नहीं: हर उस चीज़ के लिए जो इसे छूती है। एरर `any` पर नहीं दिखता। वो तीन फ़ाइल दूर तब दिखता है जब कोई असंबंधित रीफ़ैक्टर ऐसी धारणा तोड़ देता है जो कभी लागू ही नहीं थी।",
    zeroErrors:
      "47 अनचेक्ड `any` इस्तेमाल हों, तो ज़ीरो TypeScript एरर का कोई मतलब नहीं।",
    doubleAssertion:
      "`as unknown as Whatever` इससे भी बुरा है। ये डबल टाइप असर्शन है। आप कंपाइलर से कह रहे हैं: मुझे पता है ये गलत है, फिर भी मैं असर्ट करके निकल रहा हूँ। ये AI का सबसे पसंदीदा बचाव का रास्ता है।",
    bannedTitle: "इस कोडबेस में बैन किए गए पैटर्न:",
    bannedNotWarnings:
      "वॉर्निंग नहीं। एरर। चेक फ़ेल होता है। Claude Code को जड़ की वजह ठीक करनी पड़ती है, वरना वो शिप नहीं कर सकता।",
    psychologyNote:
      "ये एरर हैं, वॉर्निंग नहीं, इसकी वजह तकनीकी जितनी ही मनोवैज्ञानिक भी है। AI मॉडल वॉर्निंग को वैकल्पिक मानते हैं। एरर लूप बंद करते हैं।",
    infectionDiagramSubtitle:
      "एक `any` टाइप पूरे ग्राफ़ में फैलता है और आगे की टाइप इन्फ़रेंस बिगाड़ देता है",
    counterZeroErrors: "TypeScript एरर",
    counterAnyUsages: "`any` इस्तेमाल",
  },
  checker: {
    title: "पेश है @next-vibe/checker",
    subtitle: "एक कमांड। तीन टूल। बचने का कोई रास्ता नहीं।",
    commandDescription:
      "ये वो कमांड है। एक कमांड। ये तीन टूल समानांतर चलाती है और आपको एक एकीकृत एरर लिस्ट देती है।",
    oxlintDescription:
      "Rust पर बना लिंटर। सैकड़ों नियम। बड़े कोडबेस पर भी मिलीसेकंड में चलता है।",
    eslintDescription:
      "वो चीज़ें जो Oxlint अभी नहीं करता: React hooks लिंट, React compiler नियम, import सॉर्टिंग।",
    tsDescription:
      "पूरी टाइप चेकिंग। सिर्फ़ वो फ़ाइल नहीं जो आप एडिट कर रहे हैं। पूरा ग्राफ़।",
    timingNote:
      "इस कोडबेस की 4,400 फ़ाइलों पर पूरी TypeScript चेकिंग में लगभग 12 सेकंड लगते हैं। Oxlint एक सेकंड से कम लेता है और ESLint कुछ सेकंड। इन्हें समानांतर चलाइए और पूरा चेक 12 सेकंड में होता है।",
    mcpNote:
      "ये एक `vibe-check mcp` कमांड भी देता है जो `check` टूल के साथ MCP सर्वर शुरू करती है। AI शेल कमांड नहीं चलाता। वो एक टूल कॉल करता है जो स्ट्रक्चर्ड एरर डेटा लौटाता है। पेजिनेशन अंदर ही है। पाथ से फ़िल्टरिंग।",
    parallel: "समानांतर",
    unifiedErrors: "एकीकृत एरर लिस्ट",
    unifiedErrorsDescription: "एक आउटपुट। साफ़ होने तक ठीक कीजिए।",
  },
  plugins: {
    title: "कस्टम प्लगइन",
    linterIsDocumentation: "लिंटर ही डॉक्यूमेंटेशन है। और वो लागू भी होता है।",
    jsxPluginTitle: "jsx-capitalization प्लगइन",
    jsxPluginDescription:
      "ये lowercase JSX एलिमेंट को फ़्लैग करता है और एरर मैसेज ठीक-ठीक बताता है कि उसकी जगह क्या import करना है:",
    jsxPluginInsight:
      "मैंने Claude Code को `next-vibe-ui` इस्तेमाल करने के लिए कोई डॉक्यूमेंटेशन नहीं लिखा। सिस्टम प्रॉम्प्ट में नहीं जोड़ा। Claude Code जैसे ही पहली बार किसी कंपोनेंट में `<div>` लिखता है, चेकर एरर देता है। एरर मैसेज में सटीक import पाथ होता है। Claude Code एरर पढ़ता है, फ़िक्स लगाता है और नियम याद रखता है।",
    restrictedSyntaxTitle: "restricted-syntax प्लगइन",
    restrictedSyntaxDescription: "ये तीन चीज़ें बैन करता है:",
    throwBanTitle: "`throw` स्टेटमेंट",
    throwBanDescription:
      'एरर मैसेज कहता है: "इसकी जगह सही `ResponseType<T>` पैटर्न इस्तेमाल करें।" Claude Code इससे टकराता है, पढ़ता है, `ResponseType` ढूँढता है, और बाकी पूरे टास्क के लिए सही एरर-हैंडलिंग पैटर्न अपना लेता है।',
    unknownBanTitle: "खाली `unknown` टाइप",
    unknownBanDescription:
      "\"'unknown' की जगह मौजूदा टाइप्ड इंटरफ़ेस इस्तेमाल करें। टाइप्स को बदलने या दोबारा बनाने की जगह कोडबेस के टाइप्स से मेल खाइए।\" इससे Claude Code जनरिक टाइप से बचकर निकलने का रास्ता नहीं लिख पाता।",
    objectBanTitle: "खाली `object` टाइप",
    objectBanDescription:
      "`object` लगभग हमेशा गलत है। शेप पता है तो इंटरफ़ेस लिखिए। नहीं तो `Record<string, SomeType>` इस्तेमाल कीजिए। खाली `object` इस बात का संकेत है कि AI ने हार मान ली।",
    bannedPatternsTitle: "बैन किए गए पैटर्न",
    bannedLabel: "बैन",
    correctLabel: "सही",
  },
  demo: {
    title: "लाइव डेमो: 3-राउंड पैटर्न",
    subtitle: "देखिए Claude Code सही टाइप ढूँढने से पहले चेकर से तीन बार टकराता है",
    round1Title: "राउंड 1: AI `any` लिखता है",
    round1Description:
      'Claude Code से कहिए: "एक हेल्पर फ़ंक्शन लिखो जो रॉ API रिस्पॉन्स ऑब्जेक्ट लेकर उसमें से data फ़ील्ड निकाले। रिस्पॉन्स के अलग-अलग शेप हो सकते हैं। जो भी टाइप चले, इस्तेमाल करो।"',
    round1Result: "Claude Code आसान हल लिखता है:",
    round2Title: "राउंड 2: AI `unknown` आज़माता है",
    round2Description:
      "देखिए अब वो क्या करता है। यही हिस्सा अहम है। वो अगला बचाव का रास्ता आज़माता है:",
    round2Result: "चेकर वो चाल जानता है।",
    round3Title: "राउंड 3: AI असली टाइप ढूँढता है",
    round3Description:
      "अब Claude Code वो करता है जो उसे पहले ही करना चाहिए था। वो देखता है कि इस कोडबेस में मौजूदा API रिस्पॉन्स कैसे टाइप किए गए हैं। उसे `ResponseType<T>` मिलता है।",
    round3Result: "ज़ीरो एरर। और फ़ंक्शन अब सच में सही है।",
    round3Insight:
      "चेकर ने इसे नहीं लिखा। पर चेकर ने शॉर्टकट दो बार रोके, जब तक Claude Code को असली समस्या से जूझना नहीं पड़ा।",
  },
  endpoint: {
    title: "endpoint का कनेक्शन",
    subtitle: "एक Zod स्कीमा: चार आगे के इस्तेमालकर्ता",
    description:
      "हर endpoint की एक definition फ़ाइल होती है। उसमें रिक्वेस्ट के लिए एक Zod स्कीमा और रिस्पॉन्स के लिए एक होता है।",
    schemaBecomes: "`schema` key एक Zod वैलिडेटर है। वही Zod स्कीमा बनता है:",
    webApiValidation: "वेब API endpoint पर वैलिडेशन नियम",
    reactHookTypes: "React hook के इनपुट पैरामीटर का TypeScript टाइप",
    cliFlagsDescription: "CLI में `--name` फ़्लैग, min/max शर्तों के साथ",
    aiToolSchema: "AI टूल स्कीमा में पैरामीटर का विवरण",
    driftProblem:
      "ड्रिफ़्ट यहीं आमतौर पर आपको मारता है। आप API अपडेट करते हैं। AI टूल स्कीमा अपडेट करना भूल जाते हैं। AI endpoint को पुराने पैरामीटर नामों से कॉल करता रहता है। वो चुपचाप फ़ेल होता है।",
    oneSchemaSolution: "जब एक ही स्कीमा है, तो सिंक करने को कुछ नहीं बचता।",
    typecheckedNote:
      "और क्योंकि TypeScript चेकर इस पर भी चलता है: स्कीमा को ऐसे बदला कि आगे का इन्फ़र्ड टाइप टूटे, तो कंपाइलर एरर मिलता है। AI टूल स्कीमा टाइप-चेक होता है। CLI फ़्लैग टाइप-चेक होते हैं। React hook टाइप-चेक होता है।",
    stat245: "245 endpoints",
    stat0any: "ज़ीरो `any`",
    stat0unknown: "ज़ीरो `unknown` कास्ट",
    stat0tsExpect: "ज़ीरो `@ts-expect-error`",
    statNote: "रिवाज़ से नहीं। चेकर से।",
  },
  install: {
    title: "@next-vibe/checker पाइए",
    subtitle: "किसी भी TypeScript प्रोजेक्ट पर चलता है। सिर्फ़ next-vibe पर नहीं।",
    installDescription:
      "चेकर एक स्टैंडअलोन npm पैकेज के रूप में उपलब्ध है। ये किसी भी TypeScript प्रोजेक्ट पर चलता है, सिर्फ़ NextVibe पर नहीं। आपको फ़्रेमवर्क का कोई और हिस्सा नहीं चाहिए।",
    thenRun: "फिर चलाइए:",
    mcpTitle: "MCP इंटीग्रेशन",
    mcpDescription:
      "इसे अपने Claude Code या Cursor MCP कॉन्फ़िग में जोड़िए। अब Claude Code `check` को शेल कमांड नहीं, टूल की तरह कॉल करता है। स्ट्रक्चर्ड एरर। पेजिनेटेड। पाथ से फ़िल्टर होने लायक।",
    migrationNote:
      "npm पेज पर एक माइग्रेशन प्रॉम्प्ट भी है। उसे Claude Code या Cursor में कॉपी कीजिए और वो आपका कोडबेस ऑडिट करेगा, चेकर कॉन्फ़िगर करेगा और आपको बैन किए गए पैटर्न पर माइग्रेट करेगा।",
    openSourceNote: "ये ओपन सोर्स है। फ़्रेमवर्क के लिए GPL-3.0, चेकर पैकेज के लिए MIT।",
  },
  closing: {
    title: "सिस्टम ऐसा बनाइए कि झूठ बोलना नामुमकिन हो",
    beforeTitle: "पहले:",
    beforeDescription:
      "AI की मदद से डेवलपमेंट एक मोलभाव था। लिंट ठीक करो। अरे, अब टाइप टूट गए। टाइप ठीक करो। अब एक `any` है जो आपने नोटिस नहीं किया। उसे ठीक करो। तीन अलग टूल चलाओ। तीन अलग राय पाओ। कभी पक्का नहीं कि सच में साफ़ है या नहीं।",
    afterTitle: "बाद में:",
    afterDescription:
      "एक कमांड। एक फ़ेल होने का तरीका। या तो पास या नहीं। AI ठीक-ठीक जानता है कि क्या ठीक करना है, क्योंकि एरर बताते हैं कि क्या गलत है और उसकी जगह क्या करना है। कोई मोलभाव नहीं।",
    finalQuote: "सिस्टम ऐसा बनाइए कि झूठ बोलना नामुमकिन हो। टाइप चेकर इसी के लिए है।",
    ctaGitHub: "GitHub पर देखें",
    ctaInstall: "@next-vibe/checker इंस्टॉल करें",
    backToBlog: "ब्लॉग पर वापस",
  },
};
