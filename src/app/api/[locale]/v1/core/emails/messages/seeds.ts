/**
 * Email Messages Seeds
 * Provides seed data for email message storage and tracking
 */

import { registerSeed } from "@/app/api/[locale]/v1/core/system/db/seed/seed-manager";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { UserDetailLevel } from "../../user/enum";
import { userRepository } from "../../user/repository";
import type { NewEmail } from "./db";
import { EmailProvider, EmailStatus, EmailType } from "./enum";
import { emailRepository } from "./repository";

/**
 * Helper function to create email message seed data
 */
function createEmailSeed(overrides?: Partial<NewEmail>): NewEmail {
  return {
    subject: "Sample Email",
    recipientEmail: "recipient@example.com",
    recipientName: "Sample Recipient",
    senderEmail: "sender@example.com",
    senderName: "Sample Sender",
    type: EmailType.TRANSACTIONAL,
    status: EmailStatus.SENT,
    emailProvider: EmailProvider.SMTP,
    bodyText: "This is a sample email message for testing purposes.",
    bodyHtml: "<p>This is a sample email message for testing purposes.</p>",
    userId: "",
    metadata: {
      source: "seed-data",
      environment: "development",
    },
    ...overrides,
  };
}

/**
 * Development seed function for email messages module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding email messages data for development environment");

  try {
    // Get existing users for email associations
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    const demoUserResponse = await userRepository.getUserByEmail(
      "demo@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    // Create sample email messages for development
    const emails = [
      createEmailSeed({
        imapMessageId: "welcome-001@socialmediaservice.center",
        subject: "Welcome to Social Media Service!",
        senderEmail: "hello@socialmediaservice.center",
        senderName: "Social Media Service",
        recipientEmail: "demo@example.com",
        recipientName: "Demo User",
        bodyText:
          "Welcome to our platform! We're excited to help you grow your social media presence.",
        bodyHtml: `
          <h1>Welcome to Social Media Service!</h1>
          <p>We're excited to help you grow your social media presence.</p>
          <p>Get started by:</p>
          <ul>
            <li>Setting up your profile</li>
            <li>Connecting your social accounts</li>
            <li>Creating your first post</li>
          </ul>
        `,
        status: EmailStatus.DELIVERED,
        emailProvider: EmailProvider.SMTP,
        type: EmailType.MARKETING,
        userId: demoUserResponse.success ? demoUserResponse.data?.id || "" : "",
        metadata: {
          campaign: "welcome-series",
          template: "welcome-email",
          source: "onboarding",
        },
      }),
      createEmailSeed({
        imapMessageId: "notification-002@socialmediaservice.center",
        subject: "Your social media analytics report is ready",
        senderEmail: "reports@socialmediaservice.center",
        senderName: "Social Media Reports",
        recipientEmail: "admin@example.com",
        recipientName: "Admin User",
        bodyText:
          "Your weekly social media analytics report is now available for download.",
        bodyHtml: `
          <h2>Weekly Analytics Report</h2>
          <p>Your social media analytics report for this week is ready!</p>
          <p>Key highlights:</p>
          <ul>
            <li>Engagement increased by 15%</li>
            <li>Follower growth: +25 new followers</li>
            <li>Top performing post had 120 interactions</li>
          </ul>
          <a href="#" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Full Report</a>
        `,
        status: EmailStatus.DELIVERED,
        emailProvider: EmailProvider.SMTP,
        type: EmailType.TRANSACTIONAL,
        userId: adminUserResponse.success
          ? adminUserResponse.data?.id || ""
          : "",
        metadata: {
          report_type: "analytics",
          period: "weekly",
          source: "automated-reports",
        },
      }),
      createEmailSeed({
        imapMessageId: "support-003@socialmediaservice.center",
        subject: "Re: Question about posting schedules",
        senderEmail: "support@socialmediaservice.center",
        senderName: "Support Team",
        recipientEmail: "demo@example.com",
        recipientName: "Demo User",
        bodyText:
          "Thank you for your question about posting schedules. Here's how you can set up automated posting...",
        bodyHtml: `
          <h3>Re: Question about posting schedules</h3>
          <p>Thank you for your question about posting schedules!</p>
          <p>Here's how you can set up automated posting:</p>
          <ol>
            <li>Navigate to the Content Calendar</li>
            <li>Click "Schedule Post"</li>
            <li>Select your preferred time and date</li>
            <li>Your post will be automatically published</li>
          </ol>
          <p>If you need further assistance, please don't hesitate to reach out.</p>
        `,
        status: EmailStatus.DELIVERED,
        emailProvider: EmailProvider.SMTP,
        type: EmailType.USER_COMMUNICATION,
        userId: demoUserResponse.success ? demoUserResponse.data?.id || "" : "",
        metadata: {
          ticket_id: "SUP-12345",
          category: "scheduling",
          source: "support-system",
        },
      }),
      createEmailSeed({
        imapMessageId: "newsletter-004@socialmediaservice.center",
        subject: "Social Media Tips & Trends - Weekly Newsletter",
        senderEmail: "newsletter@socialmediaservice.center",
        senderName: "Newsletter Team",
        recipientEmail: "demo@example.com",
        recipientName: "Demo User",
        bodyText:
          "This week's top social media tips and trends to help grow your online presence.",
        bodyHtml: `
          <h1>Social Media Tips & Trends</h1>
          <h2>This Week's Highlights</h2>
          <ul>
            <li>Instagram Reels are driving 22% more engagement</li>
            <li>Best times to post on LinkedIn: Tuesday-Thursday, 8-10 AM</li>
            <li>Video content performs 5x better than static images</li>
          </ul>
          <h2>Quick Tip</h2>
          <p>Use trending hashtags, but don't overdo it - 3-5 hashtags per post is optimal for most platforms.</p>
        `,
        status: EmailStatus.DELIVERED,
        emailProvider: EmailProvider.SMTP,
        type: EmailType.MARKETING,
        userId: adminUserResponse.success
          ? adminUserResponse.data?.id || ""
          : "",
        metadata: {
          newsletter: "weekly-tips",
          edition: "2024-W03",
          source: "newsletter-system",
        },
      }),
    ];

    // Create email records
    for (const email of emails) {
      if (email.userId) {
        try {
          const result = await emailRepository.create(email, logger);
          if (result.success) {
            logger.debug(`✅ Created email message: ${email.subject}`);
          } else {
            logger.error(
              `Failed to create email ${email.subject}: ${result.message}`,
            );
          }
        } catch (error) {
          logger.error(`Error creating email ${email.subject}:`, error);
        }
      }
    }

    logger.debug("✅ Inserted development email messages data");
  } catch (error) {
    logger.error("Error seeding email messages data:", error);
  }
}

/**
 * Test seed function for email messages module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding email messages data for test environment");

  try {
    // Get test user
    const testUserResponse = await userRepository.getUserByEmail(
      "test1@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (testUserResponse.success && testUserResponse.data) {
      // Create simple test email
      const testEmail = createEmailSeed({
        imapMessageId: "test-email-001@test.com",
        subject: "Test Email Message",
        senderEmail: "test@test.com",
        senderName: "Test Sender",
        recipientEmail: "test1@example.com",
        recipientName: "Test User",
        bodyText: "This is a test email message.",
        bodyHtml: "<p>This is a test email message.</p>",
        status: EmailStatus.SENT,
        emailProvider: EmailProvider.SMTP,
        type: EmailType.TRANSACTIONAL,
        userId: testUserResponse.data.id,
        metadata: {
          test: true,
          source: "test-suite",
        },
      });

      const result = await emailRepository.create(testEmail, logger);
      if (result.success) {
        logger.debug("✅ Created test email message");
      } else {
        logger.error(`Failed to create test email: ${result.message}`);
      }
    }
  } catch (error) {
    logger.error("Error seeding test email messages data:", error);
  }
}

/**
 * Production seed function for email messages module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding email messages data for production environment");

  try {
    // Production doesn't need pre-seeded email messages
    // Email messages will be created when actual emails are sent/received
    logger.debug(
      "✅ Email messages system ready for production email handling",
    );
  } catch (error) {
    logger.error("Error seeding production email messages data:", error);
  }
}

// Register seeds with low priority since email messages are typically created dynamically
registerSeed(
  "email-messages",
  {
    dev,
    test,
    prod,
  },
  15,
);
