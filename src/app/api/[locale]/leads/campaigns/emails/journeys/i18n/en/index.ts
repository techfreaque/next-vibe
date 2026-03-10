import { journeysTranslations } from "./journeys";

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
        signupNurture: {
          name: "Signup Nurture",
          description: "Onboarding sequence for newly signed-up users",
          longDescription:
            "Welcome and onboarding emails helping new users get started with the platform",
        },
        retention: {
          name: "Retention",
          description: "Re-engagement for existing subscribers",
          longDescription:
            "Value-driven emails to keep active subscribers engaged and exploring features",
        },
        winback: {
          name: "Winback",
          description: "Win back inactive or churned users",
          longDescription:
            "Re-activation campaign targeting users who have gone quiet or cancelled",
        },
      },
    },
    leads: {
      journeys: journeysTranslations,
    },
  },
};
