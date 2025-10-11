/**
 * Onboarding API Email Templates
 * React Email templates for onboarding operations
 */

import React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../user/auth/definition";

import { authRepository } from "../user/auth/repository";
import { UserDetailLevel } from "../user/enum";
import { userRepository } from "../user/repository";
import type { OnboardingPostRequestTypeInput } from "./definition";

/**
 * Onboarding Email Template Component
 */
function OnboardingEmailTemplate({
  data,
  isWelcome,
  isComplete,
}: {
  data: OnboardingPostRequestTypeInput;
  isWelcome: boolean;
  isComplete: boolean;
}): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>
        {isComplete
          ? "Your account setup is now complete"
          : isWelcome
            ? "Let's get you started"
            : "Continue your setup process"}
      </Preview>
      <Body style={{ fontFamily: "Arial, sans-serif" }}>
        <Container style={{ margin: "0 auto", padding: "20px" }}>
          <Section
            style={{
              textAlign: "center",
              padding: "20px",
            }}
          >
            {isComplete ? (
              <>
                <Text
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#059669",
                    marginBottom: "16px",
                  }}
                >
                  Congratulations! Your setup is complete.
                </Text>
                <Text
                  style={{
                    fontSize: "16px",
                    color: "#6b7280",
                    marginBottom: "24px",
                  }}
                >
                  You can now access all features of our platform.
                </Text>
              </>
            ) : isWelcome ? (
              <>
                <Text
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#2563eb",
                    marginBottom: "16px",
                  }}
                >
                  Welcome to our platform!
                </Text>
                <Text
                  style={{
                    fontSize: "16px",
                    color: "#6b7280",
                    marginBottom: "24px",
                  }}
                >
                  Let&apos;s get you started with the setup process.
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#111827",
                    marginBottom: "16px",
                  }}
                >
                  Your onboarding progress update
                </Text>
                <Text
                  style={{
                    fontSize: "16px",
                    color: "#6b7280",
                    marginBottom: "24px",
                  }}
                >
                  Current step: {data.currentStep || "unknown"}
                </Text>
              </>
            )}

            <Button
              href="https://app.example.com/app/onboarding"
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                display: "inline-block",
                fontWeight: "600",
              }}
            >
              {isComplete ? "Explore Dashboard" : "Continue Setup"}
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Render onboarding email
 */
export async function renderOnboardingMail(
  data: OnboardingPostRequestTypeInput,
  user: JwtPayloadType | null,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<{ to: string; subject: string; html: string } | undefined> {
  if (!user) {
    logger.error("User authentication required for onboarding email");
    return;
  }

  const userId = authRepository.requireUserId(user);
  const userResponse = await userRepository.getUserById(
    userId,
    UserDetailLevel.STANDARD,
    logger,
  );

  if (!userResponse.success || !userResponse.data) {
    logger.error("User not found for onboarding email");
    return;
  }

  const userData = userResponse.data;
  const isWelcome = data.currentStep === "profile";
  const isComplete = data.isCompleted ?? false;

  const subject = isComplete
    ? "Onboarding Complete!"
    : isWelcome
      ? "Welcome to Our Platform!"
      : "Onboarding Progress Update";

  const emailHtml = render(
    <OnboardingEmailTemplate
      data={data}
      isWelcome={isWelcome}
      isComplete={isComplete}
    />,
  );

  return {
    to: userData.email,
    subject,
    html: emailHtml,
  };
}
