"use client";

import { Div } from "next-vibe-ui/ui/div";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";

import adminAddDefinitions from "@/app/api/[locale]/credits/admin-add/definition";
import publicCapDefinitions from "@/app/api/[locale]/credits/public-cap/definition";
import purchaseDefinitions from "@/app/api/[locale]/credits/purchase/definition";
import createSubscriptionDefinition from "@/app/api/[locale]/subscription/create/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface BuyTabProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  hasPaymentProvider: boolean;
  isAdmin: boolean;
}

export function BuyTab({
  locale,
  user,
  hasPaymentProvider,
  isAdmin,
}: BuyTabProps): JSX.Element {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col gap-6"
    >
      {isAdmin && (
        <>
          <EndpointsPage
            endpoint={adminAddDefinitions}
            user={user}
            locale={locale}
            endpointOptions={{
              create: {
                formOptions: {
                  defaultValues: {
                    targetUserId: "id" in user && user.id ? user.id : "",
                    amount: 100,
                  },
                },
              },
            }}
          />
          <EndpointsPage
            endpoint={publicCapDefinitions}
            user={user}
            locale={locale}
            forceMethod="GET"
          />
          <EndpointsPage
            endpoint={publicCapDefinitions}
            user={user}
            locale={locale}
            forceMethod="POST"
          />
        </>
      )}

      {hasPaymentProvider && (
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EndpointsPage
            endpoint={createSubscriptionDefinition}
            user={user}
            locale={locale}
          />
          <EndpointsPage
            endpoint={purchaseDefinitions}
            user={user}
            locale={locale}
          />
        </Div>
      )}
    </MotionDiv>
  );
}
