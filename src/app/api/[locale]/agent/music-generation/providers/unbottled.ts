/**
 * UNBOTTLED music generation — relays to the UNBOTTLED cloud instance's own
 * music-generation endpoint with Bearer auth. Stateless: the remote charges
 * its own credits on the relay account; the local instance charges its
 * marked-up UNBOTTLED price (computed before dispatch).
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import {
  absolutizeRemoteMediaUrl,
  relayUnbottledMediaPost,
} from "@/app/api/[locale]/agent/shared/unbottled-media-relay";
import type { RemoteTarget } from "@/app/api/[locale]/remote-connection/transport";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";

const RELAY_TIMEOUT_MS = 600_000;

export async function generateMusicWithUnbottled(params: {
  session: RemoteTarget;
  providerModel: string;
  prompt: string;
  /** Duration enum value from the request — the remote re-derives seconds */
  duration: string;
  inputMediaUrl?: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
}): Promise<ResponseType<{ audioUrl: string }>> {
  const {
    session,
    providerModel,
    prompt,
    duration,
    inputMediaUrl,
    logger,
    locale,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  const result = await relayUnbottledMediaPost<{ audioUrl?: string }>({
    session,
    endpointPath: "agent/music-generation",
    body: {
      prompt,
      model: providerModel,
      duration,
      inputMediaUrl,
    },
    timeoutMs: RELAY_TIMEOUT_MS,
    logger,
    locale,
  });

  if (!result.success) {
    return fail({
      message: t("post.errors.requestFailed", {
        message: "UNBOTTLED relay rejected the request",
      }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
  const audioUrl = result.data.audioUrl;
  if (!audioUrl) {
    logger.warn("[UnbottledMusic] Remote returned no audioUrl");
    return fail({
      message: t("post.errors.requestFailed", {
        message: "UNBOTTLED relay returned no audioUrl",
      }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
  return success({ audioUrl: absolutizeRemoteMediaUrl(session, audioUrl) });
}
