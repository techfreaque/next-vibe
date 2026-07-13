"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { MotionDiv } from "next-vibe/ui/ui/motion";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import type { JSX } from "react";

import resetRequestDefinitions from "@/user/public/reset-password/request/definition";

interface ResetPasswordFormProps {
  locale: CountryLanguage;
  user: JWTPublicPayloadType;
}

export default function ResetPasswordForm({
  locale,
  user,
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
      />
    </MotionDiv>
  );
}
