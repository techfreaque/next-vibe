"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import invoicePublicViewEndpoints from "@/payment/invoice/[invoiceId]/public-view/definition";

export interface InvoicePageData {
  locale: CountryLanguage;
  invoiceId: string;
  token: string;
  viewer: JwtPayloadType;
  platform: Platform;
}

export function InvoicePublicPage({
  locale,
  invoiceId,
  token,
  viewer,
  platform,
}: InvoicePageData): JSX.Element {
  return (
    <Div className="max-w-2xl mx-auto px-4 py-10">
      <EndpointsPage
        endpoint={invoicePublicViewEndpoints}
        locale={locale}
        user={viewer}
        platform={platform}
        endpointOptions={{
          read: {
            urlPathParams: { invoiceId },
            initialState: { token },
          },
        }}
      />
    </Div>
  );
}
