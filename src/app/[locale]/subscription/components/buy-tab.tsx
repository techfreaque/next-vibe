"use client";

import { MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";

import purchaseDefinitions from "@/app/api/[locale]/credits/purchase/definition";
import createSubscriptionDefinition from "@/app/api/[locale]/subscription/create/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface BuyTabProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function BuyTab({ locale, user }: BuyTabProps): JSX.Element {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Subscription Option */}
      <EndpointsPage
        endpoint={createSubscriptionDefinition}
        user={user}
        locale={locale}
      />

      {/* Credit Pack Option */}
      <EndpointsPage
        endpoint={purchaseDefinitions}
        user={user}
        locale={locale}
      />
    </MotionDiv>
  );
}
