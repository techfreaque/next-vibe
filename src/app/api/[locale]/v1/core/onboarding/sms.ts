/**
 * Onboarding SMS Templates
 * SMS templates for onboarding operations
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { authRepository } from "../user/auth/repository";
import { UserDetailLevel } from "../user/enum";
import { userRepository } from "../user/repository";
import type { OnboardingPostRequestTypeInput } from "./definition";

// SMS Configuration Constants
const SMS_CONFIG = {
  SYSTEM_PHONE: "+1234567890",
  MAX_SMS_LENGTH: 160,
} as const;

/**
 * Generate SMS message for onboarding operations
 */
function generateOnboardingSmsMessage({
  data,
  isWelcome,
  isComplete,
  isShort = false,
}: {
  data: OnboardingPostRequestTypeInput;
  isWelcome: boolean;
  isComplete: boolean;
  isShort?: boolean;
}): string {
  if (isComplete) {
    return isShort
      ? "Welcome! Setup complete."
      : "Welcome! Your account setup is now complete. You can access all features.";
  }

  if (isWelcome) {
    return isShort
      ? "Welcome to our platform!"
      : "Welcome to our platform! Let's get you started with the setup process.";
  }

  const currentStep = data.currentStep || "unknown";
  return isShort
    ? `Setup update: ${currentStep}`
    : `Onboarding progress update. Current step: ${currentStep}. Continue your setup to unlock all features.`;
}

/**
 * Render onboarding SMS notification
 */
export async function renderOnboardingSms(
  data: OnboardingPostRequestTypeInput,
  user: JwtPayloadType | null,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<{ to: string; message: string; from: string } | undefined> {
  if (!user) {
    logger.error("User authentication required for onboarding SMS");
    return;
  }

  const userId = authRepository.requireUserId(user);
  const userResponse = await userRepository.getUserById(
    userId,
    UserDetailLevel.STANDARD,
    logger,
  );

  if (!userResponse.success || !userResponse.data) {
    logger.error("User not found for onboarding SMS");
    return;
  }

  // const userData = userResponse.data;
  const isWelcome = data.currentStep === "profile";
  const isComplete = data.isCompleted ?? false;

  // Generate the message
  const fullMessage = generateOnboardingSmsMessage({
    data,
    isWelcome,
    isComplete,
    isShort: false,
  });

  const shortMessage = generateOnboardingSmsMessage({
    data,
    isWelcome,
    isComplete,
    isShort: true,
  });

  // Use short message if full message exceeds SMS length limit
  const finalMessage =
    fullMessage.length <= SMS_CONFIG.MAX_SMS_LENGTH
      ? fullMessage
      : shortMessage;

  return {
    to: "+1234567890", // Would need userData.phone when available
    message: finalMessage,
    from: SMS_CONFIG.SYSTEM_PHONE,
  };
}
