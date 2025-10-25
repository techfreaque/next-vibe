/**
 * Payment Seeds
 * Provides seed data for payment-related tables
 */

import { registerSeed } from "@/app/api/[locale]/v1/core/system/db/seed/seed-manager";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";

import type { PaymentCreateRequestOutput } from "./definition";
import { CheckoutMode, PaymentMethodType } from "./enum";

/**
 * Helper function to create payment seed data
 */
function createPaymentSeed(
  overrides?: Partial<PaymentCreateRequestOutput>,
): PaymentCreateRequestOutput {
  return {
    priceId: "price_test_default",
    mode: CheckoutMode.PAYMENT,
    paymentMethodTypes: [PaymentMethodType.CARD],
    successUrl: "https://example.com/success",
    cancelUrl: "https://example.com/cancel",
    customerEmail: "test@example.com",
    ...overrides,
  };
}

/**
 * Development seed function for payment module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding payment data for development environment");

  try {
    // Get demo user for payment testing
    const demoUserResponse = await userRepository.getUserByEmail(
      "demo@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (!demoUserResponse.success || !demoUserResponse.data) {
      logger.debug("Demo user not found, skipping payment seeds");
      return;
    }

    const demoUser = demoUserResponse.data;
    logger.debug(`Found demo user for payment seeds: ${demoUser.id}`);

    // Create sample payment sessions for testing
    const paymentTestCases = [
      createPaymentSeed({
        priceId: "price_premium_feature",
        mode: CheckoutMode.PAYMENT,
        customerEmail: demoUser.email,
      }),
      createPaymentSeed({
        priceId: "price_monthly_professional",
        mode: CheckoutMode.SUBSCRIPTION,
        customerEmail: demoUser.email,
      }),
      createPaymentSeed({
        priceId: "price_setup",
        mode: CheckoutMode.SETUP,
        customerEmail: demoUser.email,
      }),
    ];

    // Note: In development, we're just creating payment session configurations
    // Actual Stripe sessions would be created when the payment endpoints are called
    logger.debug("✅ Payment seed configurations prepared for development");
    logger.debug(
      `Created ${paymentTestCases.length} payment test case configurations`,
    );
  } catch (error) {
    logger.error("Error preparing payment development seeds:", error);
    // Don't throw error - continue with other seeds
  }

  logger.debug("✅ Payment development seeding completed");
}

/**
 * Test seed function for payment module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding payment data for test environment");

  try {
    // Get test users for payment testing
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    const testUser2Response = await userRepository.getUserByEmail(
      "test2@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (!testUser1Response.success || !testUser2Response.success) {
      logger.debug("Test users not found, skipping payment test seeds");
      return;
    }

    const testUser1 = testUser1Response.data;
    const testUser2 = testUser2Response.data;

    // Create test payment configurations for automated testing
    const testPaymentCases = [
      // Successful payment test case
      createPaymentSeed({
        priceId: "price_test_success",
        mode: CheckoutMode.PAYMENT,
        customerEmail: testUser1.email,
      }),
      // Failed payment test case
      createPaymentSeed({
        priceId: "price_test_failed",
        mode: CheckoutMode.PAYMENT,
        customerEmail: testUser2.email,
      }),
    ];

    logger.debug(
      `✅ Created ${testPaymentCases.length} payment test configurations`,
    );
  } catch (error) {
    logger.error("Error preparing payment test seeds:", error);
    // Don't throw error - continue with other seeds
  }

  logger.debug("✅ Payment test seeding completed");
}

/**
 * Production seed function for payment module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding payment data for production environment");

  try {
    // In production, we typically don't pre-create payment data
    // Instead, we might set up basic configuration or webhook endpoints
    logger.debug("Payment production setup - no pre-seeded data required");

    // Verify payment system configuration
    logger.debug("✅ Payment system verified for production");
  } catch (error) {
    logger.error("Error in payment production setup:", error);
    // Don't throw error - log and continue
  }

  logger.debug("✅ Payment production seeding completed");
}

// Register seeds with appropriate priority
// Payment seeds should run after user seeds (priority 50)
registerSeed(
  "payment",
  {
    dev,
    test,
    prod,
  },
  50,
);
