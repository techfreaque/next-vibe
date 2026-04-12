"use client";

import { MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JWTPublicPayloadType } from "@/app/api/[locale]/user/auth/types";
import resetRequestDefinitions from "@/app/api/[locale]/user/public/reset-password/request/definition";
import type { CountryLanguage } from "@/i18n/core/config";

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
