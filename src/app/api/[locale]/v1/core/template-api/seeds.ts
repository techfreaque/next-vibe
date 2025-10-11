/**
 * Template API Seeds
 * Provides seed data for template management system
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { NewTemplate } from "./db";
import { templateRepository } from "./repository";
// Note: Using literal strings for status instead of enum to avoid translation key issues

/**
 * Helper function to create template seed data
 */
function createTemplateSeed(overrides?: Partial<NewTemplate>): NewTemplate {
  return {
    name: "Sample Template",
    content: "This is a sample template content for testing purposes.",
    status: "draft",
    tags: ["sample", "test"],
    description: "A sample template for development and testing",
    userId: "",
    someValue: "default-value", // Backward compatibility field
    ...overrides,
  };
}

/**
 * Development seed function for template-api module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding template-api data for development environment");

  try {
    // Get existing users for template ownership
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

    // Create sample templates for development
    const templates = [
      createTemplateSeed({
        name: "Welcome Email Template",
        content: `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Our Service</title>
</head>
<body>
    <h1>Welcome {{firstName}}!</h1>
    <p>Thank you for joining our service. We're excited to have you on board.</p>
    <p>Get started by exploring our features and don't hesitate to reach out if you need help.</p>
    <p>Best regards,<br>The Team</p>
</body>
</html>`,
        status: "published",
        tags: ["email", "welcome", "onboarding"],
        description: "Standard welcome email template for new users",
        userId: adminUserResponse.success
          ? adminUserResponse.data?.id || ""
          : "",
        someValue: "welcome-email",
      }),
      createTemplateSeed({
        name: "Social Media Post Template",
        content: `🚀 Exciting news from {{companyName}}!

{{announcement}}

{{hashtags}}

Learn more: {{websiteUrl}}`,
        status: "published",
        tags: ["social-media", "announcement", "marketing"],
        description: "Template for social media announcements and updates",
        userId: adminUserResponse.success
          ? adminUserResponse.data?.id || ""
          : "",
        someValue: "social-media-post",
      }),
      createTemplateSeed({
        name: "Newsletter Template",
        content: `
# {{newsletterTitle}}

## This Week's Highlights

{{highlights}}

## Featured Article

{{featuredArticle}}

## Quick Tips

{{quickTips}}

---

You're receiving this because you subscribed to our newsletter.
[Unsubscribe]({{unsubscribeUrl}})`,
        status: "draft",
        tags: ["newsletter", "email", "marketing"],
        description: "Weekly newsletter template with highlights and tips",
        userId: demoUserResponse.success ? demoUserResponse.data?.id || "" : "",
        someValue: "newsletter",
      }),
      createTemplateSeed({
        name: "Customer Support Response",
        content: `Hi {{customerName}},

Thank you for contacting us about {{issueType}}.

{{responseMessage}}

If you have any further questions, please don't hesitate to reach out.

Best regards,
{{supportAgentName}}
Customer Support Team`,
        status: "published",
        tags: ["support", "email", "customer-service"],
        description: "Standard template for customer support responses",
        userId: adminUserResponse.success
          ? adminUserResponse.data?.id || ""
          : "",
        someValue: "support-response",
      }),
    ];

    // Create templates
    for (const template of templates) {
      if (template.userId) {
        try {
          const result = await templateRepository.create(template, logger);
          if (result.success) {
            logger.debug(`✅ Created template: ${template.name}`);
          } else {
            logger.error(
              `Failed to create template ${template.name}: ${result.message}`,
            );
          }
        } catch (error) {
          logger.error(`Error creating template ${template.name}:`, error);
        }
      }
    }

    logger.debug("✅ Inserted development template data");
  } catch (error) {
    logger.error("Error seeding template-api data:", error);
  }
}

/**
 * Test seed function for template-api module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding template-api data for test environment");

  try {
    // Get test user
    const testUserResponse = await userRepository.getUserByEmail(
      "test1@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (testUserResponse.success && testUserResponse.data) {
      // Create simple test template
      const testTemplate = createTemplateSeed({
        name: "Test Template",
        content: "This is a test template: {{testVariable}}",
        status: "draft",
        tags: ["test"],
        description: "Simple template for testing purposes",
        userId: testUserResponse.data.id,
        someValue: "test-template",
      });

      const result = await templateRepository.create(testTemplate, logger);
      if (result.success) {
        logger.debug("✅ Created test template");
      } else {
        logger.error(`Failed to create test template: ${result.message}`);
      }
    }
  } catch (error) {
    logger.error("Error seeding test template-api data:", error);
  }
}

/**
 * Production seed function for template-api module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding template-api data for production environment");

  try {
    // Get admin user for essential templates
    const adminUserResponse = await userRepository.getUserByEmail(
      "hi@socialmediaservice.center",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (adminUserResponse.success && adminUserResponse.data) {
      // Create essential system templates for production
      const essentialTemplates = [
        createTemplateSeed({
          name: "System Welcome Email",
          content: `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Social Media Service</title>
</head>
<body>
    <h1>Welcome {{firstName}}!</h1>
    <p>Thank you for joining Social Media Service. We're here to help you grow your online presence.</p>
    <p>To get started:</p>
    <ul>
        <li>Complete your profile setup</li>
        <li>Connect your social media accounts</li>
        <li>Explore our content creation tools</li>
    </ul>
    <p>If you need assistance, our support team is here to help.</p>
    <p>Best regards,<br>The Social Media Service Team</p>
</body>
</html>`,
          status: "published",
          tags: ["system", "welcome", "email"],
          description: "Production welcome email template for new users",
          userId: adminUserResponse.data.id,
          someValue: "system-welcome",
        }),
      ];

      // Create essential templates
      for (const template of essentialTemplates) {
        try {
          const result = await templateRepository.create(template, logger);
          if (result.success) {
            logger.debug(`✅ Created essential template: ${template.name}`);
          } else {
            logger.error(
              `Failed to create template ${template.name}: ${result.message}`,
            );
          }
        } catch (error) {
          logger.error(`Error creating template ${template.name}:`, error);
        }
      }
    }

    logger.debug("✅ Inserted essential production templates");
  } catch (error) {
    logger.error("Error seeding production template-api data:", error);
  }
}

// Register seeds with medium priority since templates depend on users
registerSeed(
  "template-api",
  {
    dev,
    test,
    prod,
  },
  25,
);
