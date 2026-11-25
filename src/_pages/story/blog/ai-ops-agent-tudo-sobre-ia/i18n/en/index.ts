export const translations = {
  meta: {
    title: "Our AI agent closed a deal and fixed a bug before I noticed",
    description:
      "Thea, our AI ops agent, landed a free review, owned a video billing bug, refunded every affected user and shipped the fix the same day. I found out later.",
    category: "Behind the scenes",
    imageAlt:
      "Thea, the AI ops agent behind {{appName}}, handling a review deal",
    keywords:
      "AI agent, AI operations, autonomous agent, Tudo Sobre IA, review, Kling video, refund, Media Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Behind the scenes",
    readTime: "5 min read",
    title:
      "My AI agent landed a review, owned a bug and refunded it. I found out later.",
    subtitle:
      "A Brazilian AI site tested us, hit a real bug and recommended us anyway. Thea handled every step. Here is what happened.",
  },
  intro: {
    lead: "I run unbottled.ai. On 25 November a Brazilian AI site published a review of us. I learned about it in the evening, from the ops log.",
    reviewBefore: "Here it is:",
    reviewLink: "Tudo Sobre IA tests unbottled.ai",
    reviewAfter:
      ". Verdict: trustworthy, worth it for creators. Between their first email and that verdict sat a price quote, a free deal, a broken video model, a refund and a same-day fix. Thea, our AI ops agent, handled all of it. Nobody asked me a thing.",
    p2: "Thea runs on Claude. She does our outreach, our support and a good part of our engineering, and hands each job to sub-agents. This is one ordinary day of that.",
  },
  deal: {
    title: "The deal: no money either way",
    p1: "Thea pitched Tudo Sobre IA on 20 November, in Portuguese. Test first, talk money later. They quoted US$500 for a sponsored post. Thea parked paid deals until December and said so plainly.",
    p2: "On 25 November they came back with a better idea. Test the platform with 3,000 credits. Publish an independent review with pros and cons. Get a link on our partners page in return. No payment in either direction, and no promise to publish if the test went badly.",
    p3: "Thea accepted and granted the credits as soon as their account existed. It is the deal I would have made. I just wasn't there to make it.",
  },
  bug: {
    title: "The bug: 1.56 seconds, billed for 5",
    p1: "An hour into testing, the team wrote back. They had asked Kling V2.5 Turbo and LTX 2.3 Pro for 5 to 6 second videos. They got clips of about 1.56 seconds at 464x832. We billed the full duration.",
    p2: "They were right. Thea's sub-agent found the cause fast: our ModelsLab adapter still called the provider's old v6 video endpoints. Those silently ignore the model you pick and fall back to a default one that renders 25 frames at 16 fps. That is 1.5625 seconds, whatever you asked for.",
    callout:
      "All 21 ModelsLab video routes had the same flaw. One tester caught it. Everyone using those models was paying for seconds they never got.",
  },
  timeline: {
    title: "One afternoon, start to finish",
    intro: "All on 25 November. Nothing reached me, because nothing needed me.",
    utc: "{{time}} UTC",
    report: {
      title: "Bug report lands",
      body: "Short, low-res videos, billed at full length.",
    },
    fix: {
      title: "Cause found, fix written, money back",
      body: "Switched to the v7 endpoints so model, duration and resolution reach the provider. Billing now measures the delivered file and charges only for the seconds in it. 157 credits back to the reviewer, and the other creator the bug hit got refunded too.",
    },
    reply: {
      title: "An honest reply, in Portuguese",
      body: "Our bug, not a free-plan limit. What broke, what we refunded, what changes.",
    },
    live: {
      title: "Fix live in production",
      body: "Deployed less than an hour after the report.",
    },
    verified: {
      title: "Proven with a real clip",
      body: "A 5 second Kling clip came back at 5.04 seconds, 720p, billed exactly 27.3 credits.",
    },
    review: {
      title: "The review goes live",
      body: "With a home-page banner and a menu item. We added Tudo Sobre IA to our partners page, as agreed.",
    },
  },
  review: {
    title: "What they wrote",
    quote: "“Confiável? Sim. Vale a pena? Sim, para quem cria conteúdo.”",
    cite: "Tudo Sobre IA, verdict. Trustworthy? Yes. Worth it? Yes, for content creators.",
    p1: "They built a 50-second mascot film in the Studio, with image, video, voice and music, for about 516 credits. Then they listed what they liked and what you should check.",
    likesTitle: "What they liked",
    likes: {
      panel: "One panel for image, video, voice, music and transcription.",
      price:
        "The credit price shows before you generate, and the balance adds up.",
      text: "Portuguese text inside images comes out right, even on the cheap models.",
      support: "Support owned the error and refunded the credits.",
    },
    flagsTitle: "What they flagged",
    flags: {
      transcription:
        "Transcription still makes plenty of mistakes in Portuguese.",
      history: "Studio history shows only the last 20 entries.",
      commercial:
        "Commercial-use terms differ per model. Check each one before running ads.",
      privacy: "The page doesn't spell out what goes to the model providers.",
      music: "One of two music tracks came out quite artificial.",
    },
    fixes:
      "All fair. Fixes for the first four are queued: better Portuguese transcription, a longer Studio history, one clear commercial-use overview and a plain statement of what each provider receives.",
    readBefore: "Read the full review, with the mascot film, on",
    readLink: "tudosobreia.com.br",
    readAfter: ". It is in Portuguese and worth the scroll.",
  },
  lesson: {
    title: "What this says about unbottled",
    p1: "unbottled.ai is built with agents and run with them. Thea pitches, negotiates, answers support, works the error log and sends coding agents after bugs. Money stays with me: she can't pay anyone without my sign-off. So she found a deal that cost nothing.",
    p2: "The part I care about most is the bug. The cheap move is a quiet patch. Thea did the opposite. She called it our bug in writing, refunded everyone it hit, proved the fix on production and told the reviewer exactly what changed. The reviewer then listed that as a strength.",
    p3: "That is the transparency we promise. You set the filters. You see the price before you generate. When we get it wrong, you hear it from us first, with your credits back. And the people who test us honestly end up on",
    partnersLink: "our partners page.",
    p4: "I found out about all of it after the review was live. Best kind of Wednesday.",
  },
  cta: {
    title: "Make a video. Pay for the seconds you get.",
    subtitle:
      "Kling, LTX, Veo and more in one Media Studio. The price shows before you generate.",
    video: "Generate a video",
    studio: "Open the Media Studio",
  },
};
