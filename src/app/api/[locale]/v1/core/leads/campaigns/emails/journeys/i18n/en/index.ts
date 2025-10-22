import { translations as componentsTranslations } from "../../components/i18n/en";
import { translations as resultsTranslations } from "../../results/i18n/en";

export const translations = {
  components: componentsTranslations,
  results: resultsTranslations,
  emailJourneys: {
    components: {
      defaults: {
        signatureName: "Your Partner in Growth",
      },
    },
    leads: {
      journeys: {
        personalPractical: {
          initial: {
            subject: "Let's build something amazing together",
            previewText: "A personal note about working together",
            greeting: "Hi {{businessName}},",
            personalIntro:
              "I wanted to reach out personally because I believe we could create something really valuable together.",
            connectionValue:
              "What caught my attention about your business is the potential I see for growth and impact.",
            practicalTransition:
              "But let me be practical - you're probably wondering what this actually means for you.",
            plansBridge:
              "Here's what I'm thinking in terms of concrete next steps:",
            ctaText: "Let's Talk About Your Goals",
            signature: "Looking forward to connecting,",
            signatureClosing: "Best regards",
            postScript:
              "P.S. No pressure - if the timing isn't right, I completely understand.",
          },
          followup1: {
            subject: "Your roadmap for the next 90 days",
            previewText: "Breaking down the journey into practical steps",
            defaultBusinessName: "there",
            greeting: "Hi {{businessName}},",
            personalReflection:
              "I've been thinking about our potential collaboration, and I wanted to share something more concrete with you.",
            thoughtProcess:
              "Rather than generic promises, let me walk you through exactly what the first 90 days could look like:",
            timelineTitle: "Your 90-Day Roadmap:",
            week1Title: "Week 1: Foundation",
            week1Content:
              "We'll sit down and really understand your business goals and challenges.",
            month2Title: "Month 2: Implementation",
            month2Content: "This is where we start seeing real momentum build.",
            week3Title: "Week 3-4: Quick Wins",
            week3Content:
              "You'll see the first tangible results - usually faster than expected.",
            roadmapIntro:
              "What I like about this approach is that you're not waiting 6 months to see if things are working.",
            personalCommitment:
              "Here's something I want you to know: I'm personally invested in your success. This isn't just another client relationship for me.",
            nextSteps:
              "If this resonates with you, let's have a real conversation about it.",
            ctaText: "Schedule Your Strategy Call",
            signature: "Excited about the possibilities,",
            signatureClosing: "Warm regards",
            postScript:
              "P.S. I've helped similar businesses achieve [specific result] - happy to share those stories when we talk.",
          },
          followup2: {
            subject: "How we'd actually work together",
            previewText: "Real examples and flexible approaches",
            defaultBusinessName: "there",
            greeting: "Hi {{businessName}},",
            personalContext:
              "I know you're busy, so I wanted to share something that might help you see if we're a good fit:",
            caseStudyIntro:
              "Recently, I worked with a business similar to yours. Here's what actually happened:",
            methodExplanation:
              "The reason this worked wasn't magic - it was a systematic approach to [specific area].",
            applicationTo:
              "For your business, I see similar opportunities, particularly around [specific opportunity].",
            realResults:
              "But here's what really matters - this isn't about what I've done for others, it's about what makes sense for you.",
            flexibleOptions:
              "Some clients need intensive support right away. Others prefer to start small and build from there. Both approaches work - it's about what fits your situation.",
            practicalNext:
              "If you're curious about which approach might work best for you, let's have a conversation about it.",
            ctaText: "Let's Discuss Your Situation",
            signature: "Here to help,",
            postScript:
              "P.S. If you want to see more specific examples or talk to a past client, just let me know.",
          },
          followup3: {
            subject: "One last thought before I go",
            previewText: "Final thoughts and an open door",
            defaultBusinessName: "there",
            greeting: "Hi {{businessName}},",
            finalReflection:
              "I've reached out a few times because I genuinely see potential in working together. But I also know that timing is everything.",
            marketTiming:
              "Sometimes the best business relationships start when you're not quite ready - because that's when you're most thoughtful about making the right choice.",
            personalCommitment:
              "If we do end up working together, I want it to be because it makes real sense for your business, not because you felt pressured.",
            practicalOffer:
              "So here's my practical offer: If you ever want to have a no-pressure conversation about your business goals, I'm here.",
            noHighPressure:
              "No sales pitch. No hard sell. Just a genuine conversation about where you want to take your business and whether we might be able to help.",
            finalCTA:
              "The door's open whenever you're ready to walk through it.",
            ctaText: "Let's Have That Conversation",
            signature: "Wishing you all the best,",
            postScript:
              "P.S. Even if we never work together, I'd love to hear how your business evolves. Feel free to stay in touch.",
          },
          reactivation: {
            subject: "Something new I wanted to share with you",
            previewText: "Updates and new opportunities",
            defaultBusinessName: "there",
            greeting: "Hi {{businessName}},",
            reconnection:
              "It's been a while since we last connected, and I wanted to reach out because some things have evolved that I think you'll find interesting.",
            newDevelopments:
              "Since we last spoke, we've developed some new approaches that are particularly relevant to businesses like yours.",
            specificOffer:
              "What's different now is that we've refined our process based on what we've learned from working with companies in your space.",
            practicalEvolution:
              "The practical result is that we can now offer more targeted solutions with faster implementation timelines.",
            updatedResults:
              "Recent clients have been seeing [specific new results] - which is notably better than what we were achieving before.",
            investmentUpdate:
              "I should also mention that our pricing structure has evolved to be more flexible and accessible.",
            personalInvitation:
              "If you're curious about these developments, I'd genuinely enjoy catching up and sharing what's new.",
            ctaText: "Let's Reconnect",
            signature: "Hope to hear from you,",
            postScript:
              "P.S. Even if you're not interested right now, I'd love to stay in touch and hear how things are going with your business.",
          },
          nurture: {
            subject: "Quick thought for your business",
            previewText: "A helpful insight I wanted to share",
            defaultBusinessName: "there",
            greeting: "Hi {{businessName}},",
            friendlyCheckIn:
              "I know you're busy, so I'll keep this brief. I came across something recently that made me think of your business.",
            practicalInsight:
              "I've noticed that businesses in your space often struggle with [specific challenge]. The ones that succeed usually approach it by [specific strategy].",
            specificSuggestion:
              "For your situation specifically, you might want to consider [practical suggestion]. It's a relatively simple change that can make a real difference.",
            genuineCare:
              "I'm sharing this not as a sales pitch, but because I genuinely want to see your business succeed - whether we work together or not.",
            helpfulResource:
              "If you want to explore this further, I put together a quick resource that might help. No strings attached.",
            ctaText: "Get the Resource",
            signature: "Rooting for your success,",
            postScript:
              "P.S. If this isn't relevant to you right now, feel free to ignore it. I'll check in again sometime with something else that might be useful.",
          },
        },
        personal: {
          initial: {
            subject: "Welcome to our service",
            previewText: "Getting started with your journey",
            greeting: "Hi {{businessName}},",
            intro: "Welcome! We're excited to have you on board.",
            serviceDescription:
              "Our service is designed to help you achieve your goals efficiently.",
            convenience: "Everything you need, right at your fingertips.",
            ctaText: "Get Started",
            signature: "Welcome aboard,",
            postScript: "P.S. If you have any questions, we're here to help.",
          },
          followup1: {
            subject: "How are things going?",
            previewText: "Checking in on your experience",
            greeting: "Hi {{businessName}},",
            intro: "I wanted to check in and see how things are going.",
            empathy:
              "I know getting started with something new can be challenging.",
            question: "How has your experience been so far?",
            socialProof: {
              quote:
                "This service has transformed how we work - couldn't be happier!",
              author: "Happy Customer",
            },
            ctaText: "Share Your Feedback",
            signature: "Looking forward to hearing from you,",
          },
          followup2: {
            subject: "Our story and mission",
            previewText: "Why we do what we do",
            greeting: "Hi {{businessName}},",
            intro: "I wanted to share a bit about why we do what we do.",
            mission:
              "Our mission is to make professional services accessible to everyone.",
            story1:
              "We started because we saw businesses struggling with outdated solutions.",
            story2:
              "Today, we're proud to help hundreds of businesses succeed.",
            ctaText: "Learn More About Us",
            signature: "With purpose,",
            closing: "Thank you for being part of our journey.",
          },
          followup3: {
            subject: "Final check-in",
            previewText: "One last message from us",
            greeting: "Hi {{businessName}},",
            intro:
              "This is my last message unless you'd like to continue hearing from us.",
            reflection:
              "I've reached out because I genuinely believe we could help your business.",
            noPressure:
              "But I respect your time and don't want to be a bother.",
            ctaText: "Stay Connected",
            signature: "Best wishes,",
            closing: "The door is always open if you change your mind later.",
          },
          nurture: {
            subject: "Quick tip for you",
            previewText: "A helpful insight",
            greeting: "Hi {{businessName}},",
            intro: "I came across something I thought you'd find valuable.",
            tip: "Here's a quick tip that can make a real difference:",
            value:
              "Small changes can lead to significant improvements over time.",
            ctaText: "Learn More",
            signature: "To your success,",
          },
          reactivation: {
            subject: "Let's reconnect",
            previewText: "We'd love to reconnect",
            greeting: "Hi {{businessName}},",
            intro: "It's been a while - I wanted to reach out.",
            checkIn: "How have things been going with your business?",
            offer: "We have some new offerings that might interest you.",
            ctaText: "Explore What's New",
            signature: "Hope to connect soon,",
            closing: "Looking forward to hearing from you.",
          },
        },
      },
    },
  },
};
