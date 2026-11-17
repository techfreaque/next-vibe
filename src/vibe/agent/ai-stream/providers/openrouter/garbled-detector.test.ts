/**
 * Garbled-output detector: real broken host output must trip a rule, real
 * legit output (code, math, non-Latin languages, mixed CJK/Latin, translation
 * lists, base64) must never. A false positive throws away a good answer.
 */

import { describe, expect, it } from "bun:test";

import {
  buildGarbledPromptContext,
  GarbledOutputDetector,
  type GarbledRule,
} from "./garbled-detector";

/** Stream `text` through a detector in small deltas; first verdict that fires. */
function detect(
  text: string,
  prompt = "Answer the question.",
  channel: "text" | "reasoning" = "text",
): GarbledRule | null {
  const detector = new GarbledOutputDetector(buildGarbledPromptContext(prompt));
  for (let at = 0; at < text.length; at += 7) {
    const verdict = detector.push(channel, text.slice(at, at + 7));
    if (verdict.garbled) {
      return verdict.rule;
    }
  }
  return null;
}

// Real: DeepSeek V4.1 Flash (Venice host) leaking its DSML tool markup as text
// instead of a tool call (local run log, 2026-11-13).
const DSML_LEAK = `

<｜DSML｜ calls>
<｜DSML｜ invoke name="execute-tool">
<｜DSML｜ parameter name="toolName" string="true">rename-thread</｜DSML｜ parameter>
<｜DSML｜ parameter name="input" string="false">{"title": "Simple 2+2 math question test"}</｜DSML｜ parameter>
</｜DSML｜ invoke>
</｜DSML｜ calls>`;

// DeepSeek V3-family raw tool-call tokens (same failure, older template).
const TOOL_TOKEN_LEAK =
  "Let me look that up.<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>function<｜tool▁sep｜>web_search";

// Token salad as broken fp4 hosts emit it: subword fragments of many scripts
// glued into single "words".
const TOKEN_SALAD =
  "The answer isконструк的 Wahrscheinlichkeitتحدthe 的 значенияsubsequently להיותfox ρ alignmentиз 数据 مرحباmodel и nevertheless 그리고rather";

const REPLACEMENT_GARBAGE =
  "Sure, here is the summary: the �� report shows � growth in �� quarter.";

const CONTROL_GARBAGE =
  "Result:\u0001\u0002 the value\u0003 is\u0004 forty\u0005 two.";

const LOOP =
  "Here is my plan. " + "the model the model ".repeat(20) + "and then";

describe("garbled-detector: broken output is caught", () => {
  it("real DSML tool-markup leak", () => {
    expect(detect(DSML_LEAK)).toBe("special-token");
  });
  it("DSML leak inside reasoning", () => {
    expect(detect(DSML_LEAK, "hi", "reasoning")).toBe("special-token");
  });
  it("raw DeepSeek tool-call tokens", () => {
    expect(detect(TOOL_TOKEN_LEAK)).toBe("special-token");
  });
  it("end-of-sentence token leak", () => {
    expect(detect("Done.<｜end▁of▁sentence｜>")).toBe("special-token");
  });
  it("token salad across scripts", () => {
    expect(detect(TOKEN_SALAD)).toBe("token-salad");
  });
  it("replacement characters", () => {
    expect(detect(REPLACEMENT_GARBAGE)).toBe("replacement-chars");
  });
  it("raw control characters", () => {
    expect(detect(CONTROL_GARBAGE)).toBe("control-chars");
  });
  it("degenerate repetition loop", () => {
    expect(detect(LOOP)).toBe("repetition-loop");
  });
});

describe("garbled-detector: legit output never trips", () => {
  const legit: Record<string, string> = {
    chinese:
      "量子计算是一种利用量子力学原理进行信息处理的计算方式。与经典计算机使用比特不同，量子计算机使用量子比特，它可以同时处于0和1的叠加态。这使得某些问题，例如大整数分解和分子模拟，可以被显著加速。目前，谷歌、IBM 和许多研究机构都在开发量子处理器。",
    chineseWithEnglishTerms:
      "我们可以用React和TypeScript构建前端，用Node.js写后端API，再用PostgreSQL存储数据。部署时使用Docker容器，CI/CD用GitHub Actions。这样整个技术栈都是JavaScript生态，团队学习成本低。",
    japanese:
      "Reactを使ってコンポーネントを作成します。まず、npm installで依存関係をインストールしてください。次に、useStateフックで状態を管理します。TypeScriptの型定義も忘れずに追加しましょう。",
    korean:
      "React를 사용하면 컴포넌트 기반으로 UI를 만들 수 있습니다. TypeScript와 함께 쓰면 타입 안정성도 얻을 수 있어요. 서버는 Node.js로 구성하고 API는 REST 방식으로 설계합니다.",
    arabic:
      "الذكاء الاصطناعي هو فرع من علوم الحاسوب يهتم ببناء أنظمة قادرة على أداء مهام تتطلب عادة ذكاءً بشرياً، مثل فهم اللغة والتعرف على الصور واتخاذ القرارات. تستخدم الـAPI الحديثة نماذج لغوية كبيرة مثل GPT وClaude.",
    hebrew:
      "בינה מלאכותית היא תחום במדעי המחשב העוסק בבניית מערכות שמסוגלות לבצע משימות שבדרך כלל דורשות אינטליגנציה אנושית. מודלים כמו GPT משמשים לכתיבה ולתרגום.",
    russianTech:
      "Чтобы запустить Python-скрипт, откройте терминал и введите python main.py. API-ключ храните в .env файле, а не в коде. Для Docker-контейнера используйте docker compose up -d.",
    hindi:
      "कृत्रिम बुद्धिमत्ता कंप्यूटर विज्ञान की एक शाखा है। Machine learning इसका एक हिस्सा है, जिसमें मॉडल डेटा से सीखते हैं। Python इसके लिए सबसे लोकप्रिय भाषा है।",
    translationList:
      "Hello in ten languages:\n- Russian: Привет\n- Chinese: 你好\n- Arabic: مرحبا\n- Hebrew: שלום\n- Greek: Γειά σου\n- Hindi: नमस्ते\n- Korean: 안녕하세요\n- Thai: สวัสดี\n- Georgian: გამარჯობა\n- Armenian: Բարեւ",
    math: "Let Δx → 0. Then f'(x) = lim (f(x+Δx) − f(x))/Δx. For the Gaussian, ∫ e^{−αx²} dx = √(π/α), and the eigenvalues λᵢ satisfy det(A − λI) = 0 with σ² = E[(X − μ)²].",
    codeLoop:
      "Here is the lookup table:\n```python\nTABLE = [\n" +
      "    None, None, None, None,\n".repeat(30) +
      "]\n```\nDone.",
    hexDump: "Bytes: " + "0xff, ".repeat(60) + "end",
    base64:
      "Here is the encoded file:\n" +
      "QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFB".repeat(
        6,
      ),
    paddingRun: "A".repeat(400),
    markdownTable:
      "| Model | Price |\n|---|---|\n" + "| GLM | $0.40 |\n".repeat(25),
    laugh: "HAHAHAHA " + "ha".repeat(150),
    ansiColors:
      "Use \u001b[31mred\u001b[0m and \u001b[32mgreen\u001b[0m and \u001b[33myellow\u001b[0m and \u001b[34mblue\u001b[0m.",
    roleplay:
      "*She leans against the doorframe, arms crossed.* \"You're late again,\" she says, eyes narrowing. \"Third time this week. What's your excuse this time?\"",
  };
  for (const [name, text] of Object.entries(legit)) {
    it(name, () => {
      expect(detect(text)).toBeNull();
    });
  }
});

describe("garbled-detector: prompt echo switches a rule off", () => {
  it("user asked about DeepSeek template tokens", () => {
    expect(
      detect(
        TOOL_TOKEN_LEAK,
        "What does <｜tool▁calls▁begin｜> mean in DeepSeek's template?",
      ),
    ).toBeNull();
  });
  it("user asked for a phrase repeated", () => {
    expect(
      detect(
        "the model the model ".repeat(30),
        "Write 'the model' 60 times in a row.",
      ),
    ).toBeNull();
  });
  it("user pasted mojibake", () => {
    expect(
      detect(REPLACEMENT_GARBAGE, "Fix this text: caf� na�ve"),
    ).toBeNull();
  });
});
