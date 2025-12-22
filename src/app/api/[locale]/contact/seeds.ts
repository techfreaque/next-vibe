/**
 * Contact Seeds
 * Provides seed data for contact form submissions
 */

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { defaultLocale } from "@/i18n/core/config";

import type { NewContact } from "./db";
import { ContactStatus } from "./enum";
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
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("app.api.contact.seeds.dev.start");

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
    for (const contact of contactSubmissions) {
      try {
        const result = await ContactRepository.create(
          contact,
          defaultLocale,
          logger,
        );
        if (result.success) {
          logger.debug("app.api.contact.seeds.dev.submission.created", {
            email: contact.email,
          });
        } else {
          logger.error("app.api.contact.seeds.dev.submission.failed", {
            message: result.message,
          });
        }
      } catch (error) {
        logger.error(
          "app.api.contact.seeds.dev.submission.error",
          parseError(error),
          {
            email: contact.email,
          },
        );
      }
    }

    logger.debug("app.api.contact.seeds.dev.complete");
  } catch (error) {
    logger.error("app.api.contact.seeds.dev.error", parseError(error));
  }
}

/**
 * Test seed function for contact module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("app.api.contact.seeds.test.start");

  try {
    // Create minimal test contact data
    const testContact = createContactSeed({
      name: "Test User",
      email: "test.contact@example.com",
      subject: "Test Submission",
      message: "This is a test contact form submission.",
      status: ContactStatus.NEW,
    });

    const result = await ContactRepository.create(
      testContact,
      defaultLocale,
      logger,
    );
    if (result.success) {
      logger.debug("app.api.contact.seeds.test.submission.created");
    } else {
      logger.error("app.api.contact.seeds.test.submission.failed", {
        message: result.message,
      });
    }
  } catch (error) {
    logger.error("app.api.contact.seeds.test.error", parseError(error));
  }
}

/**
 * Production seed function for contact module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("app.api.contact.seeds.prod.start");

  try {
    // Production doesn't need pre-seeded contact data
    // Contact submissions will be created by actual users
    await Promise.resolve(); // Ensure async behavior for consistency
    logger.debug("app.api.contact.seeds.prod.ready");
  } catch (error) {
    logger.error("app.api.contact.seeds.prod.error", parseError(error));
  }
}

// Export priority for seed manager
export const priority = 30;
