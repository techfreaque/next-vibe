import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";

import type { SignupPostRequestOutput } from "@/user/public/signup/definition";
import { scopedTranslation } from "@/user/public/signup/i18n";
import { SignupRepository } from "@/user/public/signup/repository";

/** In-process test mailbox. The public endpoint always uses real DNS and SMTP. */
export async function confirmedTestSignup(
  data: SignupPostRequestOutput,
  user: JWTPublicPayloadType,
): ReturnType<typeof SignupRepository.confirmation> {
  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);
  let code = "";
  const issued = await SignupRepository.registerUser(
    data,
    user,
    defaultLocale,
    logger,
    Platform.NEXT_API,
    t,
    undefined,
    async (recipient, challenge) => {
      code = challenge.code;
      return `test-mailbox-${recipient.leadId}`;
    },
    async () => "ok",
  );
  if (!issued.success) {
    return issued;
  }
  return SignupRepository.confirmation(
    { pendingId: issued.data.pendingId, code },
    user,
    defaultLocale,
    logger,
    Platform.NEXT_API,
    t,
    undefined,
  );
}
