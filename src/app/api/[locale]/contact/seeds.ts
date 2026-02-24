/**
 * Contact Seeds
 * Provides seed data for contact form submissions
 */

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { NewContact } from "./db";
import { ContactStatus } from "./enum";
import { scopedTranslation } from "./i18n";
import { ContactRepository } from "./repository";

/**
 * Helper function to create contact seed data
 */
function createContactSeed(overrides?: Partial<NewContact>): NewContact {
  return {
    name: "Demo Contact",
    email: "demo.contact@example.com",
    company: "Demo Company",
    subject: "General Inquiry",
    message:
      "This is a demo contact form submission for testing purposes. The contact system is working correctly.",
    status: ContactStatus.NEW,
    ...overrides,
  };
}

/**
 * Development seed function for contact module
 */
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  logger.debug("Seeding contact submissions for dev environment");

  try {
    // Create sample contact submissions for testing
    const contactSubmissions = [
      createContactSeed({
        name: "John Developer",
        email: "john.dev@example.com",
        company: "Tech Startup Inc",
        subject: "API Integration Question",
        message:
          "Hi, I'm interested in integrating with your API. Could you provide more information about the available endpoints?",
        status: ContactStatus.NEW,
      }),
      createContactSeed({
        name: "Sarah Manager",
        email: "sarah.manager@business.com",
        company: "Business Solutions LLC",
        subject: "Partnership Opportunity",
        message:
          "We'd like to explore a potential partnership. When would be a good time to schedule a call?",
        status: ContactStatus.IN_PROGRESS,
      }),
      createContactSeed({
        name: "Mike Customer",
        email: "mike@customer.com",
        subject: "Feature Request",
        message:
          "I love your service! Would it be possible to add a dark mode option?",
        status: ContactStatus.RESOLVED,
      }),
    ];

    // Create contact submissions
    let createdCount = 0;
    for (const contact of contactSubmissions) {
      try {
        const { t } = scopedTranslation.scopedT(locale);
        const result = await ContactRepository.create(contact, logger, t);
        if (result.success) {
          createdCount++;
        } else {
          logger.error("Failed to create dev contact submission", {
            message: result.message,
          });
        }
      } catch (error) {
        logger.error(
          "Unexpected error creating dev contact submission",
          parseError(error),
          {
            email: contact.email,
          },
        );
      }
    }

    logger.debug("Dev contact seeding complete", {
      created: createdCount,
    });
  } catch (error) {
    logger.error("Dev contact seeding failed", parseError(error));
  }
}

/**
 * Test seed function for contact module
 */
export async function test(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  logger.debug("Seeding contact submissions for test environment");

  try {
    // Create minimal test contact data
    const testContact = createContactSeed({
      name: "Test User",
      email: "test.contact@example.com",
      subject: "Test Submission",
      message: "This is a test contact form submission.",
      status: ContactStatus.NEW,
    });

    const { t } = scopedTranslation.scopedT(locale);
    const result = await ContactRepository.create(testContact, logger, t);
    if (result.success) {
      logger.debug("Test contact submission created successfully");
    } else {
      logger.error("Failed to create test contact submission", {
        message: result.message,
      });
    }
  } catch (error) {
    logger.error("Test contact seeding failed", parseError(error));
  }
}

/**
 * Production seed function for contact module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("Seeding contact submissions for prod environment");

  try {
    // Production doesn't need pre-seeded contact data
    // Contact submissions will be created by actual users
    await Promise.resolve(); // Ensure async behavior for consistency
    logger.debug("Prod contact seeding ready (no data needed)");
  } catch (error) {
    logger.error("Prod contact seeding failed", parseError(error));
  }
}

// Export priority for seed manager
export const priority = 30;
