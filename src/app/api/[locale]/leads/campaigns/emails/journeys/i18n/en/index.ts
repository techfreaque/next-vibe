export const translations = {
  emailJourneys: {
    components: {
      defaults: {
        signatureName: "A fellow unbottled.ai user",
        previewLeadId: "preview-lead-id",
        previewEmail: "preview@example.com",
        previewBusinessName: "Acme Corp",
        previewContactName: "Preview User",
        previewPhone: "+1234567890",
        previewCampaignId: "preview-campaign-id",
      },
      footer: {
        unsubscribeText: "You're receiving this because you opted in.",
        unsubscribeLink: "Unsubscribe",
      },
      journeyInfo: {
        uncensoredConvert: {
          name: "Uncensored Convert",
          description: "An enthusiast sharing their discovery of unbottled.ai",
          longDescription:
            "Enthusiast persona sharing a genuine discovery with affiliate transparency",
          characteristics: {
            tone: "Casual, conspiratorial tone",
            story: "Genuine personal story",
            transparency: "Affiliate transparency",
            angle: "Anti-censorship angle",
            energy: "Enthusiast energy",
          },
        },
        sideHustle: {
          name: "Side Hustle",
          description: "A transparent affiliate sharing real use cases",
          longDescription:
            "Transparent affiliate marketer sharing real weekly use cases",
          characteristics: {
            disclosure: "Full affiliate disclosure upfront",
            updates: "Weekly use-case updates",
            income: "Passive income story",
            proof: "Practical proof, not hype",
            energy: "Honest hustle energy",
          },
        },
        quietRecommendation: {
          name: "Quiet Recommendation",
          description: "A low-key professional passing along a tested tool",
          longDescription:
            "Low-key professional passing along a tool tested for weeks",
          characteristics: {
            signal: "Short, high signal-to-noise",
            specifics: "No hype, just specifics",
            testing: "3-week testing backstory",
            comparison: "Honest comparison to ChatGPT",
            affiliate: "Minimal affiliate mention",
          },
        },
      },
    },
    leads: {
      journeys: {
        uncensoredConvert: {
          initial: {
            subject: "found something I had to share with you",
            previewText:
              "not sure why I'm even telling you this but here we go",
            greeting: "Hey,",
            opening:
              "Ok so I don't usually send cold emails. I actually find them kind of annoying. But I found something a few weeks ago that I keep telling people about and I figured I'd just put it in writing.",
            discovery:
              'I was down a rabbit hole at like 11pm, frustrated with ChatGPT refusing to help me write some marketing copy because it thought the phrasing was "potentially misleading" (it wasn\'t). Someone in a forum mentioned unbottled.ai and I just tried it on a whim.',
            whatItDoes:
              "It's an AI that actually does what you ask. No hedging, no moral lectures, no random refusals. I've used it for copywriting, research, competitor analysis, drafting stuff I didn't want to explain to a cautious AI. It just works.",
            affiliateDisclosure:
              "Full transparency: if you sign up through my link I get a small cut. That's part of why I'm writing this. But I'd be telling people about it either way - I've already sent the link to three people just in normal conversation.",
            ctaText: "Try unbottled.ai (my affiliate link)",
            signature: " -  Chris",
            postScript:
              "P.S. There's a free trial so you can poke around before committing to anything.",
          },
          followup1: {
            subject: "what I've actually been using it for",
            previewText: "concrete stuff, not vague promises",
            greeting: "Hey again,",
            recap:
              "I sent you something a few weeks back about unbottled.ai. In case you're still curious, here are some actual things I've done with it since:",
            useCases:
              'Wrote a full landing page for a client in about 20 minutes. Drafted a legal-ish disclaimer (obviously got it reviewed). Ran a fake "interview" with a competitor\'s product to find weaknesses. Generated 40 subject line variations for an email test. None of these required me to explain myself or rephrase things five times to get past a filter.',
            differentFromOthers:
              "The difference from other AI tools isn't speed or some special feature. It's that it treats you like an adult who knows what they're doing. Sounds small. It's not.",
            ctaText: "Check it out",
            signature: " -  Chris",
            postScript:
              "P.S. Still using my affiliate link because I might as well be honest about it.",
          },
          followup2: {
            subject: "the specific thing that annoyed me about ChatGPT",
            previewText: "and why unbottled.ai fixed it for me",
            greeting: "Last one from me on this, I promise.",
            specificExample:
              "I wanted to write copy for a supplement brand that makes bold claims. Every mainstream AI would either water them down or flat out refuse. I spent maybe 45 minutes going in circles. Switched to unbottled.ai, had copy in 8 minutes. The client approved it same day.",
            comparison:
              "I'm not saying ChatGPT is bad. It's great for a lot of things. But if you work in anything adjacent to marketing, sales copy, legal edge cases, adult content, or just anything that requires a bit of bluntness - you'll hit the wall eventually.",
            nudge:
              "If any of that sounds like your world, it's worth 5 minutes to try the free version.",
            ctaText: "Try it free",
            signature: " -  Chris",
          },
          followup3: {
            subject: "okay I'll stop after this one",
            previewText: "just leaving this here",
            greeting: "Hey,",
            lastPitch:
              "I've sent a couple of emails about unbottled.ai and I'll leave it alone after this. If it's not relevant to what you do, totally fair.",
            honesty:
              "If you ever find yourself fighting with an AI that won't cooperate - remember this is an option. Link's below. Affiliate, yes. Still genuine.",
            ctaText: "unbottled.ai",
            signature: " -  Chris",
          },
          nurture: {
            subject: "they added something worth mentioning",
            previewText: "small update on unbottled.ai",
            greeting: "Hey,",
            newFeature:
              "Just a short one. unbottled.ai rolled out some new model options recently including some that are specifically good at long-form content. If you write a lot of articles, reports, or scripts it's notably better than it was.",
            stillRelevant:
              "Free trial still up. Affiliate link still mine. Just thought it was worth flagging.",
            ctaText: "See what's new",
            signature: " -  Chris",
          },
          reactivation: {
            subject: "circling back one more time",
            previewText: "a lot has changed since I first mentioned this",
            greeting: "Hey,",
            checkIn:
              "I know it's been a while since I last brought up unbottled.ai. I kept using it and it's genuinely gotten better - faster responses, more model choices, and they fixed some of the rough edges.",
            update:
              "If you looked at it before and weren't impressed, it might be worth another look. If you never tried it, the free trial is still there. Same affiliate link, same honest recommendation.",
            ctaText: "Take another look",
            signature: " -  Chris",
          },
        },
        sideHustle: {
          initial: {
            subject:
              "I'm an affiliate for this. Here's why I think it matters.",
            previewText:
              "transparent from the start - I get a cut if you sign up",
            greeting: "Hey,",
            opening:
              "I want to be upfront about something before I say anything else: I'm an affiliate for unbottled.ai, which means I earn a commission if you sign up through my link. I tell you this because I only affiliate with things I actually use, and I think that distinction matters.",
            myStory:
              "I started using unbottled.ai about 4 months ago to write copy for my freelance clients. Before that I was using a combination of ChatGPT and manual editing to work around content filters. unbottled.ai cut that process roughly in half because it doesn't fight me. I then started recommending it to clients as part of my process. Then I realized I could earn a bit passively by just being open about it.",
            affiliateHonesty:
              "So yes - there's money in this for me. But I also genuinely use it every week for actual paid work. If it stopped being good, I'd stop recommending it. It hasn't stopped being good.",
            proof:
              "I used it this week to: write 3 product descriptions for an e-commerce client, draft a pitch email for my own outreach (meta, I know), summarize a 40-page PDF into a 1-page brief. All without fighting filters or rewording prompts.",
            ctaText: "Try unbottled.ai (affiliate link)",
            signature: " -  Jordan",
            postScript:
              "P.S. Free trial available. No credit card needed to start.",
          },
          followup1: {
            subject: "what I did with it this week (actual work stuff)",
            previewText: "concrete use cases, not hype",
            greeting: "Hey,",
            thisWeek:
              "Quick update. This week I used unbottled.ai to write onboarding emails for a SaaS client's new user flow. Six emails, two variations each, complete with subject line options. That would have taken me most of a day with my old process. It took about 90 minutes.",
            clientWork:
              "The client didn't know I used AI. They approved the copy with minor edits. That's kind of the point - not that AI is doing the creative work, but that it speeds up the scaffolding so I can focus on making it actually good.",
            howYouCanToo:
              "If you do any kind of writing work - copy, content, comms, anything - this is worth trying. The affiliate link means I earn something if you sign up, but I'm sharing this because it's genuinely part of how I work now.",
            ctaText: "Check it out",
            signature: " -  Jordan",
          },
          followup2: {
            subject: "the affiliate part is also kind of interesting actually",
            previewText:
              "how passive income from a tool you use actually works",
            greeting: "Hey,",
            anotherUseCase:
              "Another week, another real use case: I used unbottled.ai to write the cold outreach emails I'm sending right now - including this one, which is a bit circular but also kind of proves the point.",
            passiveIncome:
              "On the affiliate side: I've been earning small but consistent monthly income just from recommending this to people in normal conversation and through my newsletter. It's not life-changing money but it's real, and it compounds. The model is simple - people sign up, I earn a percentage of their subscription for as long as they're a customer.",
            callToAction:
              "If you run any kind of content, freelancing, or marketing operation, this could make sense for you to affiliate too. Or just use it as a tool. Both are valid. Link below either way.",
            ctaText: "Try unbottled.ai",
            signature: " -  Jordan",
            postScript:
              "P.S. Yes, affiliate link. Yes, I earn money. Yes, I actually use it. All three are true.",
          },
          followup3: {
            subject: "last email from me on this, I promise",
            previewText: "one number that made me think",
            greeting: "Hey,",
            monthlyEarnings:
              "I'll keep this short. Last month I earned €147 in affiliate commissions from unbottled.ai just from people I'd mentioned it to in passing. That's not a business but it's a nice bonus for recommending something I use anyway.",
            noHardSell:
              "I'm not going to keep emailing you about it. If it hasn't clicked by now it probably won't. But if you ever want to try a capable, uncensored AI for content work - or just try the affiliate program - the link is below. No pressure, genuinely.",
            ctaText: "unbottled.ai",
            signature: " -  Jordan",
          },
          nurture: {
            subject: "a small prompt trick that's been saving me time",
            previewText: "works especially well with unbottled.ai",
            greeting: "Hey,",
            tip: "Quick tip I've been using: when I need to write something in a specific brand voice, I paste 3 examples of existing content and say \"write in this style\" before the actual request. unbottled.ai is particularly good at picking this up because it doesn't add its own hedging or softening on top.",
            freeValue:
              "No affiliate push this time - just a thing that works. If you haven't tried unbottled.ai yet and want to, the link is still there.",
            ctaText: "unbottled.ai",
            signature: " -  Jordan",
          },
          reactivation: {
            subject: "they made some changes worth knowing about",
            previewText: "unbottled.ai update + still my affiliate link",
            greeting: "Hey,",
            update:
              "It's been a few months. unbottled.ai has gotten noticeably faster and they've added new model tiers. The one I use most now is better at maintaining long documents without drifting off-topic.",
            newOpportunity:
              "Still affiliate, still earning on it, still actually using it weekly. If you tried it before and moved on, might be worth another look. If you never tried it, free trial is still available.",
            ctaText: "Check out what's new",
            signature: " -  Jordan",
          },
        },
        quietRecommendation: {
          initial: {
            subject: "tool worth knowing about",
            previewText: "found it on a forum, tested it for 3 weeks",
            greeting: "Hi,",
            howIFoundIt:
              "Someone in a dev forum mentioned unbottled.ai as an alternative to ChatGPT for tasks that keep hitting content filters. I tested it for about 3 weeks before deciding it was worth passing along.",
            whatItDoesDifferently:
              "The short version: it's an AI assistant that doesn't refuse tasks on vague policy grounds. Useful if you do anything in marketing, legal, creative writing, research, or really anything where mainstream AI tools tend to get in the way of actual work.",
            affiliateNote:
              "There's an affiliate link below - I earn a small commission if you sign up. Mentioning it because I'd rather be upfront than pretend it's not there.",
            ctaText: "Take a look",
            signature: " -  Sam",
          },
          followup1: {
            subject: "what I actually built with it",
            previewText: "three weeks of real use, not a sales pitch",
            greeting: "Hi,",
            specificThing:
              "In my three weeks testing unbottled.ai: wrote a content brief for a client that needed some assertive positioning (worked great). Drafted a legal-adjacent policy document that two other AI tools had refused entirely. Ran some competitive research by asking it to play devil's advocate on my business model.",
            builtWith:
              "None of these are extraordinary tasks. They're just things that kept getting interrupted by guardrails elsewhere. If that friction sounds familiar, it's probably worth 10 minutes to try the free version.",
            ctaText: "Try the free version",
            signature: " -  Sam",
          },
          followup2: {
            subject: "honest comparison with ChatGPT",
            previewText: "where each is better",
            greeting: "Hi,",
            comparison:
              'Where ChatGPT is better: general knowledge, coding, multi-step reasoning, anything "safe". Where unbottled.ai is better: tasks that require directness, work in sensitive categories, anything where you\'ve repeatedly had to rephrase to avoid a refusal.',
            honestTake:
              "I use both. They're not in direct competition for me. But if you've ever been blocked by an AI on something legitimate, unbottled.ai is the practical solution. Free trial, affiliate link, no high-pressure anything.",
            ctaText: "unbottled.ai",
            signature: " -  Sam",
          },
          followup3: {
            subject: "last one",
            previewText: "won't keep emailing about this",
            greeting: "Hi,",
            lastOne:
              "Last email about unbottled.ai from me. It's a solid tool for the specific cases where mainstream AI tools won't cooperate. Affiliate link below if you're curious.",
            stayInTouch:
              "If this isn't relevant to your work, no worries at all.",
            ctaText: "unbottled.ai",
            signature: " -  Sam",
          },
          nurture: {
            subject: "small update from unbottled.ai",
            previewText: "worth knowing if you're in the market",
            greeting: "Hi,",
            update:
              "unbottled.ai added some new model options recently. If you looked at it before and the output quality wasn't there, it's worth another try - the newer models are a step up. Affiliate link still active if you want to sign up.",
            ctaText: "See what's new",
            signature: " -  Sam",
          },
          reactivation: {
            subject: "checking in",
            previewText: "brief note",
            greeting: "Hi,",
            checkIn:
              "It's been a while. Just checking in - if you ever did try unbottled.ai I'd be curious what you thought. And if you didn't, it's still around, still improved, free trial still available.",
            whatChanged:
              "They've added better long-form support and faster response times since I first mentioned it. Affiliate link below.",
            ctaText: "Take a look",
            signature: " -  Sam",
          },
        },
      },
    },
  },
};
