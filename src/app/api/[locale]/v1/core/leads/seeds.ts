/**
 * Lead Management Seeds
 * Sample data for testing the lead management system
 */

import { sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import { registerSeed } from "@/app/api/[locale]/v1/core/system/db/seed/seed-manager";
import { Countries, Languages } from "@/i18n/core/config";

import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import {
  emailCampaigns,
  leadEngagements,
  leads,
  type NewEmailCampaign,
  type NewLead,
  type NewLeadEngagement,
} from "./db";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
  EmailStatus,
  EngagementTypes,
  LeadSource,
  LeadStatus,
} from "./enum";

/**
 * Number of random leads to generate
 */
const RANDOM_LEADS_COUNT = 1000;

/**
 * Expanded sample data arrays for more realistic generation
 */
const SAMPLE_NAMES = [
  "Alex Johnson",
  "Maria Garcia",
  "David Chen",
  "Sophie Mueller",
  "Pierre Dubois",
  "Emma Wilson",
  "Carlos Rodriguez",
  "Yuki Tanaka",
  "Giuseppe Rossi",
  "Sarah Thompson",
  "Michael Brown",
  "Lisa Wang",
  "James Smith",
  "Anna Kowalski",
  "Ahmed Hassan",
  "Isabella Silva",
  "Jean Martin",
  "Raj Patel",
  "Elena Petrov",
  "Lars Andersen",
  "Marta Kowalczyk",
  "Fatima Al-Rashid",
  "Viktor Petrov",
  "Ingrid Larsson",
  "Roberto Fernandez",
  "Priya Sharma",
  "Klaus Weber",
  "Natasha Ivanova",
  "Antonio Bianchi",
  "Lila Johansson",
  "Dimitri Papadopoulos",
  "Camila Santos",
  "Hiroshi Nakamura",
  "Astrid Nielsen",
  "Omar Benali",
  "Katarina Novak",
  "Arjun Krishnan",
  "Zara Okafor",
  "Matthias Richter",
  "Noor Al-Zahra",
];

const SAMPLE_BUSINESSES = [
  "Tech Solutions Inc",
  "Digital Marketing Pro",
  "E-commerce Plus",
  "Business Consulting",
  "Restaurant Moderne",
  "Fitness Studio Pro",
  "Architecture Studio",
  "Tokyo Innovations",
  "Bella Vista Pizzeria",
  "Thompson Law Group",
  "Creative Design Co",
  "Global Trading Ltd",
  "Green Energy Solutions",
  "Healthcare Partners",
  "Education First",
  "Construction Plus",
  "Fashion Forward",
  "Food & Beverage Co",
  "Travel Adventures",
  "Real Estate Pro",
  "StartupHub Berlin",
  "Wellness Center Munich",
  "Automotive Solutions",
  "Media Production House",
  "Financial Advisory Group",
  "Software Development Lab",
  "Marketing Agency Plus",
  "Logistics & Supply Chain",
  "Interior Design Studio",
  "Photography & Events",
  "Consulting Excellence",
  "Data Analytics Firm",
  "Cloud Solutions Provider",
  "Manufacturing Solutions",
  "Import Export Business",
  "Digital Transformation",
  "Cybersecurity Services",
  "AI & Machine Learning",
  "Blockchain Development",
  "Mobile App Development",
];

const SAMPLE_INDUSTRIES = [
  "technology",
  "marketing",
  "ecommerce",
  "consulting",
  "hospitality",
  "fitness",
  "architecture",
  "food",
  "legal",
  "creative",
  "trading",
  "energy",
  "healthcare",
  "education",
  "construction",
  "fashion",
  "travel",
  "real-estate",
  "automotive",
  "media",
  "finance",
  "logistics",
  "manufacturing",
  "agriculture",
  "telecommunications",
  "biotechnology",
  "aerospace",
  "retail",
  "entertainment",
];

const SAMPLE_SOURCES = [
  LeadSource.WEBSITE,
  LeadSource.REFERRAL,
  LeadSource.SOCIAL_MEDIA,
  LeadSource.EMAIL_CAMPAIGN,
  LeadSource.CSV_IMPORT,
  LeadSource.API,
] as const;

const SAMPLE_COUNTRIES = [
  Countries.DE,
  Countries.PL,
  Countries.GLOBAL,
] as const;
const SAMPLE_LANGUAGES = [Languages.DE, Languages.PL, Languages.EN] as const;
const COMPANY_SIZES = ["small", "medium", "large", "enterprise"] as const;
const BUDGET_RANGES = [
  "under_1000",
  "1000_5000",
  "5000_10000",
  "10000_25000",
  "25000_50000",
  "50000_plus",
] as const;

const SAMPLE_STATUSES = [
  LeadStatus.NEW,
  LeadStatus.PENDING,
  LeadStatus.CAMPAIGN_RUNNING,
  LeadStatus.WEBSITE_USER,
  LeadStatus.NEWSLETTER_SUBSCRIBER,
  LeadStatus.SIGNED_UP,
  LeadStatus.CONSULTATION_BOOKED,
  LeadStatus.SUBSCRIPTION_CONFIRMED,
  LeadStatus.UNSUBSCRIBED,
  LeadStatus.BOUNCED,
  LeadStatus.INVALID,
] as const;

const SAMPLE_CAMPAIGN_STAGES = [
  EmailCampaignStage.NOT_STARTED,
  EmailCampaignStage.INITIAL,
  EmailCampaignStage.FOLLOWUP_1,
  EmailCampaignStage.FOLLOWUP_2,
  EmailCampaignStage.FOLLOWUP_3,
  EmailCampaignStage.NURTURE,
  EmailCampaignStage.REACTIVATION,
] as const;

const SAMPLE_JOURNEY_VARIANTS = [
  EmailJourneyVariant.PERSONAL_APPROACH,
  EmailJourneyVariant.RESULTS_FOCUSED,
  EmailJourneyVariant.PERSONAL_RESULTS,
] as const;

const SAMPLE_WEBSITE_DOMAINS = ["nopepepepepepepepe.com"];

/**
 * Generate random date within the last 6 months
 */
function getRandomPastDate(daysBack = 180): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  const date = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
  return date;
}

/**
 * Generate random phone number for different countries
 */
function generatePhoneNumber(country: string): string {
  switch (country) {
    case Countries.DE:
      return `+49-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000000 + 1000000)}`;
    case Countries.PL:
      return `+48-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}`;
    default:
      return `+1-555-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;
  }
}

/**
 * Generate realistic engagement metrics based on lead status
 */
function generateEngagementMetrics(
  status: (typeof LeadStatus)[keyof typeof LeadStatus],
  campaignStage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage],
): { emailsSent: number; emailsOpened: number; emailsClicked: number } {
  let emailsSent = 0;
  let emailsOpened = 0;
  let emailsClicked = 0;

  // Generate emails sent based on campaign stage
  switch (campaignStage) {
    case EmailCampaignStage.NOT_STARTED:
      emailsSent = 0;
      break;
    case EmailCampaignStage.INITIAL:
      emailsSent = Math.floor(Math.random() * 2) + 1;
      break;
    case EmailCampaignStage.FOLLOWUP_1:
      emailsSent = Math.floor(Math.random() * 3) + 2;
      break;
    case EmailCampaignStage.FOLLOWUP_2:
      emailsSent = Math.floor(Math.random() * 4) + 3;
      break;
    case EmailCampaignStage.FOLLOWUP_3:
      emailsSent = Math.floor(Math.random() * 5) + 4;
      break;
    case EmailCampaignStage.NURTURE:
      emailsSent = Math.floor(Math.random() * 10) + 5;
      break;
    case EmailCampaignStage.REACTIVATION:
      emailsSent = Math.floor(Math.random() * 8) + 3;
      break;
  }

  // Generate opens based on status and emails sent
  if (emailsSent > 0) {
    const openRate = getOpenRateByStatus(status);
    emailsOpened = Math.floor(
      emailsSent * openRate * (0.8 + Math.random() * 0.4),
    );
  }

  // Generate clicks based on opens
  if (emailsOpened > 0) {
    const clickRate = getClickRateByStatus(status);
    emailsClicked = Math.floor(
      emailsOpened * clickRate * (0.5 + Math.random() * 1.0),
    );
  }

  return { emailsSent, emailsOpened, emailsClicked };
}

/**
 * Get realistic open rates based on lead status
 */
function getOpenRateByStatus(
  status: (typeof LeadStatus)[keyof typeof LeadStatus],
): number {
  switch (status) {
    case LeadStatus.NEW:
      return 0.15;
    case LeadStatus.PENDING:
      return 0.25;
    case LeadStatus.CAMPAIGN_RUNNING:
      return 0.45;
    case LeadStatus.WEBSITE_USER:
      return 0.35;
    case LeadStatus.NEWSLETTER_SUBSCRIBER:
      return 0.55;
    case LeadStatus.SIGNED_UP:
      return 0.85;
    case LeadStatus.CONSULTATION_BOOKED:
      return 0.9;
    case LeadStatus.SUBSCRIPTION_CONFIRMED:
      return 0.95;
    case LeadStatus.UNSUBSCRIBED:
      return 0.2;
    case LeadStatus.BOUNCED:
      return 0.0;
    case LeadStatus.INVALID:
      return 0.0;
    default:
      return 0.25;
  }
}

/**
 * Get realistic click rates based on lead status
 */
function getClickRateByStatus(
  status: (typeof LeadStatus)[keyof typeof LeadStatus],
): number {
  switch (status) {
    case LeadStatus.NEW:
      return 0.05;
    case LeadStatus.PENDING:
      return 0.1;
    case LeadStatus.CAMPAIGN_RUNNING:
      return 0.2;
    case LeadStatus.WEBSITE_USER:
      return 0.15;
    case LeadStatus.NEWSLETTER_SUBSCRIBER:
      return 0.25;
    case LeadStatus.SIGNED_UP:
      return 0.45;
    case LeadStatus.CONSULTATION_BOOKED:
      return 0.5;
    case LeadStatus.SUBSCRIPTION_CONFIRMED:
      return 0.6;
    case LeadStatus.UNSUBSCRIBED:
      return 0.05;
    case LeadStatus.BOUNCED:
      return 0.0;
    case LeadStatus.INVALID:
      return 0.0;
    default:
      return 0.1;
  }
}

/**
 * Generate a random lead with realistic and diverse properties
 */
function generateRandomLead(index: number): NewLead {
  const nameIndex = Math.floor(Math.random() * SAMPLE_NAMES.length);
  const businessIndex = Math.floor(Math.random() * SAMPLE_BUSINESSES.length);
  const industryIndex = Math.floor(Math.random() * SAMPLE_INDUSTRIES.length);
  const sourceIndex = Math.floor(Math.random() * SAMPLE_SOURCES.length);
  const countryIndex = Math.floor(Math.random() * SAMPLE_COUNTRIES.length);
  const languageIndex = Math.floor(Math.random() * SAMPLE_LANGUAGES.length);
  const companySizeIndex = Math.floor(Math.random() * COMPANY_SIZES.length);
  const budgetIndex = Math.floor(Math.random() * BUDGET_RANGES.length);
  const statusIndex = Math.floor(Math.random() * SAMPLE_STATUSES.length);
  const campaignStageIndex = Math.floor(
    Math.random() * SAMPLE_CAMPAIGN_STAGES.length,
  );
  const journeyVariantIndex = Math.floor(
    Math.random() * SAMPLE_JOURNEY_VARIANTS.length,
  );
  const websiteIndex = Math.floor(
    Math.random() * SAMPLE_WEBSITE_DOMAINS.length,
  );

  const contactName = SAMPLE_NAMES[nameIndex];
  const businessName = SAMPLE_BUSINESSES[businessIndex];
  const industry = SAMPLE_INDUSTRIES[industryIndex];
  const source = SAMPLE_SOURCES[sourceIndex];
  const country = SAMPLE_COUNTRIES[countryIndex];
  const language = SAMPLE_LANGUAGES[languageIndex];
  const companySize = COMPANY_SIZES[companySizeIndex];
  const budgetRange = BUDGET_RANGES[budgetIndex];
  const status = SAMPLE_STATUSES[statusIndex];
  const campaignStage = SAMPLE_CAMPAIGN_STAGES[campaignStageIndex];
  const journeyVariant = SAMPLE_JOURNEY_VARIANTS[journeyVariantIndex];
  const websiteDomain = SAMPLE_WEBSITE_DOMAINS[websiteIndex];

  // Generate unique email
  const baseEmail = contactName.toLowerCase().replace(/\s+/g, ".");
  const uniqueSuffix = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  const email = `${baseEmail}.${index}.${uniqueSuffix}@${websiteDomain}`;

  // Generate phone number based on country
  const phoneNumber = generatePhoneNumber(country);
  const website = `https://${websiteDomain}`;

  // Generate engagement metrics
  const { emailsSent, emailsOpened, emailsClicked } = generateEngagementMetrics(
    status,
    campaignStage,
  );

  // Generate timestamps based on status
  const createdAt = getRandomPastDate(180);
  const campaignStartedAt =
    campaignStage !== EmailCampaignStage.NOT_STARTED
      ? getRandomPastDate(90)
      : null;
  const lastEmailSentAt = emailsSent > 0 ? getRandomPastDate(30) : null;
  const lastEngagementAt = emailsOpened > 0 ? getRandomPastDate(20) : null;

  // Status-specific timestamps
  const signedUpAt =
    status === LeadStatus.SIGNED_UP ||
    status === LeadStatus.CONSULTATION_BOOKED ||
    status === LeadStatus.SUBSCRIPTION_CONFIRMED
      ? getRandomPastDate(60)
      : null;

  const consultationBookedAt =
    status === LeadStatus.CONSULTATION_BOOKED ||
    status === LeadStatus.SUBSCRIPTION_CONFIRMED
      ? getRandomPastDate(30)
      : null;

  const subscriptionConfirmedAt =
    status === LeadStatus.SUBSCRIPTION_CONFIRMED ? getRandomPastDate(15) : null;

  const unsubscribedAt =
    status === LeadStatus.UNSUBSCRIBED ? getRandomPastDate(45) : null;

  const bouncedAt =
    status === LeadStatus.BOUNCED ? getRandomPastDate(60) : null;

  const invalidAt =
    status === LeadStatus.INVALID ? getRandomPastDate(90) : null;

  return {
    email,
    businessName,
    contactName,
    phone: phoneNumber,
    website,
    country,
    language,
    status,
    source,
    notes: `Generated ${status} lead for ${industry} business - ${businessName}. Company size: ${companySize}, Budget: ${budgetRange}`,
    currentCampaignStage: campaignStage,
    emailJourneyVariant: journeyVariant,
    campaignStartedAt,
    emailsSent,
    lastEmailSentAt,
    unsubscribedAt,
    signedUpAt,
    consultationBookedAt,
    subscriptionConfirmedAt,
    bouncedAt,
    invalidAt,
    emailsOpened,
    emailsClicked,
    lastEngagementAt,
    metadata: {
      industry,
      companySize,
      budgetRange,
      generated: true,
      priority: Math.floor(Math.random() * 5) + 1,
      leadScore: Math.floor(Math.random() * 100) + 1,
      timezone:
        country === Countries.DE
          ? "Europe/Berlin"
          : country === Countries.PL
            ? "Europe/Warsaw"
            : "UTC",
    },
    createdAt,
    updatedAt: getRandomPastDate(30),
  };
}

/**
 * Generate sample lead engagements
 */
async function generateLeadEngagements(
  leadIds: string[],
  logger: EndpointLogger,
): Promise<void> {
  const engagements: NewLeadEngagement[] = [];

  for (const leadId of leadIds) {
    // Generate random number of engagements per lead (0-10)
    const engagementCount = Math.floor(Math.random() * 11);

    for (let i = 0; i < engagementCount; i++) {
      const engagementTypeIndex = Math.floor(
        Math.random() * Object.values(EngagementTypes).length,
      );
      const engagementType =
        Object.values(EngagementTypes)[engagementTypeIndex];

      const engagement: NewLeadEngagement = {
        leadId,
        engagementType,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: [
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        ][Math.floor(Math.random() * 3)],
        metadata: {
          source: "seed_data",
          device: ["desktop", "mobile", "tablet"][
            Math.floor(Math.random() * 3)
          ],
          browser: ["chrome", "firefox", "safari", "edge"][
            Math.floor(Math.random() * 4)
          ],
        },
        timestamp: getRandomPastDate(60),
        createdAt: getRandomPastDate(60),
      };

      engagements.push(engagement);
    }
  }

  if (engagements.length > 0) {
    await db.insert(leadEngagements).values(engagements);
    logger.debug(`✅ Generated ${engagements.length} lead engagements`);
  }
}

/**
 * Generate sample email campaigns
 */
async function generateEmailCampaigns(
  leadIds: string[],
  logger: EndpointLogger,
): Promise<void> {
  const campaigns: NewEmailCampaign[] = [];

  for (const leadId of leadIds) {
    // Generate random number of campaigns per lead (0-5)
    const campaignCount = Math.floor(Math.random() * 6);

    for (let i = 0; i < campaignCount; i++) {
      const stageIndex = Math.floor(
        Math.random() * SAMPLE_CAMPAIGN_STAGES.length,
      );
      const stage = SAMPLE_CAMPAIGN_STAGES[stageIndex];
      const journeyVariantIndex = Math.floor(
        Math.random() * SAMPLE_JOURNEY_VARIANTS.length,
      );
      const journeyVariant = SAMPLE_JOURNEY_VARIANTS[journeyVariantIndex];

      const subjects = [
        "Welcome to our platform!",
        "Your business success starts here",
        "Following up on your interest",
        "Special offer just for you",
        "Time-sensitive opportunity",
        "Let's discuss your goals",
        "Your personalized recommendations",
        "Don't miss out on this chance",
      ];

      const templateNames = [
        "welcome-email",
        "followup-general",
        "offer-special",
        "nurture-sequence",
        "reactivation-campaign",
      ];

      const campaign: NewEmailCampaign = {
        leadId,
        stage,
        journeyVariant,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        templateName:
          templateNames[Math.floor(Math.random() * templateNames.length)],
        scheduledAt: getRandomPastDate(90),
        sentAt: Math.random() > 0.2 ? getRandomPastDate(60) : null,
        status: Math.random() > 0.2 ? EmailStatus.SENT : EmailStatus.PENDING,
        openedAt: Math.random() > 0.6 ? getRandomPastDate(30) : null,
        clickedAt: Math.random() > 0.8 ? getRandomPastDate(25) : null,
        metadata: {
          campaign_id: `campaign_${i + 1}`,
          ab_test: Math.random() > 0.5,
          priority: Math.floor(Math.random() * 3) + 1,
        },
        createdAt: getRandomPastDate(90),
        updatedAt: getRandomPastDate(30),
      };

      campaigns.push(campaign);
    }
  }

  if (campaigns.length > 0) {
    await db.insert(emailCampaigns).values(campaigns);
    logger.debug(`✅ Generated ${campaigns.length} email campaigns`);
  }
}

/**
 * Development seed data
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding development leads...");

  // Clear existing development leads to avoid duplicates
  await db.delete(leads).where(sql`${leads.metadata}->>'generated' = 'true'`);

  // Generate random leads using the defined constant
  const sampleLeads: NewLead[] = Array.from(
    { length: RANDOM_LEADS_COUNT },
    (_, index) => generateRandomLead(index),
  );

  // Insert sample leads
  const insertedLeads = await db
    .insert(leads)
    .values(sampleLeads)
    .returning({ id: leads.id });
  const leadIds = insertedLeads.map((lead) => lead.id);

  logger.debug(`✅ Seeded ${sampleLeads.length} development leads`);

  // Generate related data
  await generateLeadEngagements(leadIds, logger);
  await generateEmailCampaigns(leadIds, logger);
}

/**
 * Production seed data (minimal or none)
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  await Promise.resolve();
  logger.debug("🌱 Skipping production leads seeding");
}

/**
 * Test seed data
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding test leads data");

  const testLeads: NewLead[] = [
    {
      email: "test@example.com",
      businessName: "Test Company",
      contactName: "Test User",
      phone: "+1-555-0123",
      website: "https://test-company.com",
      country: Countries.DE,
      language: Languages.DE,
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
      notes: "Test lead for automated testing",
      currentCampaignStage: EmailCampaignStage.INITIAL,
      emailJourneyVariant: EmailJourneyVariant.PERSONAL_APPROACH,
      emailsSent: 1,
      emailsOpened: 0,
      emailsClicked: 0,
      metadata: {
        test: true,
        industry: "technology",
        companySize: "small",
        budgetRange: "1000_5000",
        priority: 3,
        leadScore: 50,
        timezone: "Europe/Berlin",
      },
    },
    {
      email: "engaged-test@example.com",
      businessName: "Engaged Test Company",
      contactName: "Engaged User",
      phone: "+49-123-456789",
      website: "https://engaged-test.de",
      country: Countries.DE,
      language: Languages.DE,
      status: LeadStatus.CAMPAIGN_RUNNING,
      source: LeadSource.REFERRAL,
      notes: "Test lead with high engagement",
      currentCampaignStage: EmailCampaignStage.FOLLOWUP_2,
      emailJourneyVariant: EmailJourneyVariant.RESULTS_FOCUSED,
      emailsSent: 3,
      emailsOpened: 2,
      emailsClicked: 1,
      lastEngagementAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      metadata: {
        test: true,
        industry: "consulting",
        companySize: "medium",
        budgetRange: "10000_25000",
        priority: 5,
        leadScore: 85,
        timezone: "Europe/Berlin",
      },
    },
    {
      email: "converted-test@example.com",
      businessName: "Converted Test Company",
      contactName: "Converted User",
      phone: "+48-987-654321",
      website: "https://converted-test.pl",
      country: Countries.PL,
      language: Languages.PL,
      status: LeadStatus.SUBSCRIPTION_CONFIRMED,
      source: LeadSource.SOCIAL_MEDIA,
      notes: "Test lead that completed the conversion funnel",
      currentCampaignStage: EmailCampaignStage.NURTURE,
      emailJourneyVariant: EmailJourneyVariant.PERSONAL_RESULTS,
      emailsSent: 8,
      emailsOpened: 7,
      emailsClicked: 5,
      signedUpAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      consultationBookedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      subscriptionConfirmedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      lastEngagementAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      metadata: {
        test: true,
        industry: "ecommerce",
        companySize: "large",
        budgetRange: "50000_plus",
        priority: 5,
        leadScore: 95,
        timezone: "Europe/Warsaw",
      },
    },
  ];

  const insertedTestLeads = await db
    .insert(leads)
    .values(testLeads)
    .returning({ id: leads.id });
  const testLeadIds = insertedTestLeads.map((lead) => lead.id);

  logger.debug(`✅ Seeded ${testLeads.length} test leads`);

  // Generate some test engagements
  const testEngagements: NewLeadEngagement[] = [
    {
      leadId: testLeadIds[1], // For the engaged test lead
      engagementType: EngagementTypes.EMAIL_OPEN,
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Test Browser)",
      metadata: {
        test: true,
        emailSubject: "Test Email Open",
      },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      leadId: testLeadIds[1],
      engagementType: EngagementTypes.EMAIL_CLICK,
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Test Browser)",
      metadata: {
        test: true,
        clickedUrl: "https://test-company.com/landing",
      },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      leadId: testLeadIds[2], // For the converted test lead
      engagementType: EngagementTypes.FORM_SUBMIT,
      ipAddress: "10.0.0.50",
      userAgent: "Mozilla/5.0 (Converted Test Browser)",
      metadata: {
        test: true,
        formType: "consultation_booking",
      },
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  await db.insert(leadEngagements).values(testEngagements);
  logger.debug(`✅ Generated ${testEngagements.length} test lead engagements`);

  // Generate some test email campaigns
  const testCampaigns: NewEmailCampaign[] = [
    {
      leadId: testLeadIds[0],
      stage: EmailCampaignStage.INITIAL,
      journeyVariant: EmailJourneyVariant.PERSONAL_APPROACH,
      subject: "Welcome to our platform!",
      templateName: "welcome-email",
      scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: EmailStatus.SENT,
      metadata: {
        test: true,
        campaign_type: "welcome",
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      leadId: testLeadIds[1],
      stage: EmailCampaignStage.FOLLOWUP_2,
      journeyVariant: EmailJourneyVariant.RESULTS_FOCUSED,
      subject: "Your business success starts here",
      templateName: "followup-general",
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: EmailStatus.OPENED,
      openedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      metadata: {
        test: true,
        campaign_type: "followup",
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  await db.insert(emailCampaigns).values(testCampaigns);
  logger.debug(`✅ Generated ${testCampaigns.length} test email campaigns`);
}

// Register seeds with the seed manager
// Leads have medium priority (50) - after users (100) but before business data (10)
registerSeed(
  "leads",
  {
    dev,
    test,
    prod,
  },
  50,
);
