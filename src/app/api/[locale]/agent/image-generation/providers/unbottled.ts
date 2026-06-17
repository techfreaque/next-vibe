/**
 * UNBOTTLED image generation — relays to the UNBOTTLED cloud instance's own
 * image-generation endpoint with Bearer auth. Stateless: the remote charges
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

export async function generateImageWithUnbottled(params: {
  session: RemoteTarget;
  providerModel: string;
  prompt: string;
  size: string;
  quality: string;
  aspectRatio?: string;
  inputMediaUrl?: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
}): Promise<ResponseType<{ imageUrl: string }>> {
  const {
    session,
    providerModel,
    prompt,
    size,
    quality,
    aspectRatio,
    inputMediaUrl,
    logger,
    locale,
  } = params;
  const { t } = scopedTranslation.scopedT(locale);

  const result = await relayUnbottledMediaPost<{ imageUrl?: string }>({
    session,
    endpointPath: "agent/image-generation",
    body: {
      prompt,
      model: providerModel,
      size,
      quality,
      aspectRatio,
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
  const imageUrl = result.data.imageUrl;
  if (!imageUrl) {
    logger.warn("[UnbottledImage] Remote returned no imageUrl");
    return fail({
      message: t("post.errors.requestFailed", {
        message: "UNBOTTLED relay returned no imageUrl",
      }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
  return success({ imageUrl: absolutizeRemoteMediaUrl(session, imageUrl) });
}
