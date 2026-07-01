"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { EndpointsPage } from "next-vibe/ui/renderers/react/EndpointsPage";
import { MotionDiv } from "next-vibe/ui/web/ui/motion";
import type { JSX } from "react";

import resetRequestDefinitions from "@/app/api/[locale]/user/public/reset-password/request/definition";

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
