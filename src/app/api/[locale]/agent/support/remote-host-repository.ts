import "server-only";

/**
 * Remote host delegation for SUPPORT folder streams.
 * Per spec: local admin → POST to ws-provider/stream on remote instance.
 * Status: TODO - see spec.md for implementation plan.
 */

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { AiStreamPostRequestOutput } from "@/app/api/[locale]/agent/ai-stream/stream/definition";
import type { AiStreamPostResponseOutput } from "@/app/api/[locale]/agent/ai-stream/stream/definition";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { NextRequest } from "next-vibe-ui/lib/request";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Returns true if the request should be delegated to the remote host.
 * Currently: rootFolderId === "support" (the SUPPORT folder).
 */
export function isRemoteHostRequest(data: AiStreamPostRequestOutput): boolean {
  return data.rootFolderId === DefaultFolderId.SUPPORT;
}

/**
 * Delegate an AI stream request to the configured remote host.
 * TODO: implement ws-provider/stream forwarding per spec.md
 */
export async function delegateToRemoteHost(_params: {
  data: AiStreamPostRequestOutput;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  request: NextRequest | undefined;
}): Promise<ResponseType<AiStreamPostResponseOutput>> {
  _params.logger.warn(
    "Remote host delegation not yet implemented - SUPPORT folder streams are pending",
  );
  return fail({
    message:
      "Support sessions via remote delegation are not yet available." as string &
        "createScopedTranslation-key",
    errorType: ErrorResponseTypes.INTERNAL_ERROR,
  });
}
