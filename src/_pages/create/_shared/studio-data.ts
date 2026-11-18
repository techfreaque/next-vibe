import "server-only";

import {
  recentStudioHistory,
  type StudioEntry,
} from "next-vibe/agent/media-studio/history";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";

import type { CreateKind } from "./create-kinds";
import { studioModels } from "./studio-models";
import type { StudioModel } from "./studio-types";

export interface StudioPageData {
  user: JwtPayloadType;
  locale: CountryLanguage;
  platform: Platform;
  history: StudioEntry[] | null;
  models: StudioModel[];
}

export async function studioData(
  locale: CountryLanguage,
  kind?: CreateKind,
): Promise<StudioPageData> {
  const logger = createEndpointLogger(false, locale);
  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.CUSTOMER, UserRole.PUBLIC, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  const [history, models] = await Promise.all([
    recentStudioHistory(user, kind).catch((error: Error) => {
      logger.error("Could not load Studio history", parseError(error));
      return null;
    }),
    kind ? studioModels(user, kind) : [],
  ]);
  return { user, locale, history, models, platform: Platform.NEXT_PAGE };
}
