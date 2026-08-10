"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { MotionDiv } from "next-vibe/ui/components/motion";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import resetRequestDefinitions from "@/user/public/reset-password/request/definition";

interface ResetPasswordFormProps {
  locale: CountryLanguage;
  user: JWTPublicPayloadType;
  platform: Platform;
}

export default function ResetPasswordForm({
  locale,
  user,
  platform,
}: ResetPasswordFormProps): JSX.Element {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <EndpointsPage
        endpoint={resetRequestDefinitions}
        locale={locale}
        user={user}
        platform={platform}
      />
    </MotionDiv>
  );
}
