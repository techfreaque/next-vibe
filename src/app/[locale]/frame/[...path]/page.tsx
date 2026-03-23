/**
 * Vibe Frame Page
 *
 * Renders any next-vibe endpoint in isolation for iframe embedding.
 * This is a standard Next.js page - SSR + hydration handled by Next.js.
 *
 * URL: /[locale]/frame/[endpoint_identifier]
 * Query params: data, urlPathParams, theme, frameId, authToken
 *
 * Example: /en-US/frame/contact_POST?theme=dark&frameId=vf-abc123
 */

export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { VibeFramePageClient } from "./page-client";

interface FramePageProps {
  params: Promise<{ locale: CountryLanguage; path: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface VibeFramePageData {
  locale: CountryLanguage;
  endpointId: string;
  frameId: string;
  theme: "light" | "dark" | "system";
  authToken: string | undefined;
  urlPathParams: Record<string, string>;
  data: Record<string, string>;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
  searchParams,
}: FramePageProps): Promise<VibeFramePageData> {
  const { locale, path } = await params;
  const search = await searchParams;

  // The endpoint identifier is the path joined with underscores
  // e.g. /frame/contact_POST -> "contact_POST"
  // e.g. /frame/agent/chat/threads_GET -> "agent_chat_threads_GET"
  const endpointId = path.join("_");

  const frameId =
    (typeof search.frameId === "string" ? search.frameId : "") || "";
  const theme = (typeof search.theme === "string" ? search.theme : "system") as
    | "light"
    | "dark"
    | "system";
  const authToken =
    typeof search.authToken === "string" ? search.authToken : undefined;

  let urlPathParams: Record<string, string> = {};
  if (typeof search.urlPathParams === "string") {
    try {
      urlPathParams = JSON.parse(search.urlPathParams) as Record<
        string,
        string
      >;
    } catch {
      // Ignore parse errors
    }
  }

  let data: Record<string, string> = {};
  if (typeof search.data === "string") {
    try {
      data = JSON.parse(search.data) as Record<string, string>;
    } catch {
      // Ignore parse errors
    }
  }

  // Resolve user from session cookies (creates lead if needed)
  const logger = createEndpointLogger(false, Date.now(), locale);
  const user: JwtPayloadType = await AuthRepository.getAuthMinimalUser(
    [],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  return {
    locale,
    endpointId,
    frameId,
    theme,
    authToken,
    urlPathParams,
    data,
    user,
  };
}

export function TanstackPage({
  endpointId,
  locale,
  frameId,
  theme,
  authToken,
  urlPathParams,
  data,
  user,
}: VibeFramePageData): JSX.Element {
  return (
    <VibeFramePageClient
      endpointId={endpointId}
      locale={locale}
      frameId={frameId}
      theme={theme}
      authToken={authToken}
      urlPathParams={urlPathParams}
      data={data}
      user={user}
    />
  );
}

export default async function VibeFramePage({
  params,
  searchParams,
}: FramePageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
