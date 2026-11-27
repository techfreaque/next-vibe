import "server-only";

import { MEDIA_HISTORY_PAGE_SIZE } from "next-vibe/agent/media-studio/history/constants";
import type { MediaHistoryResponseOutput } from "next-vibe/agent/media-studio/history/definition";
import { scopedTranslation as historyTranslation } from "next-vibe/agent/media-studio/history/i18n";
import { MediaHistoryRepository } from "next-vibe/agent/media-studio/history/repository";
import { isUncensoredContent } from "next-vibe/agent/models/uncensored-consent/constants";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";

import { toModelSlug } from "../../models/_shared/model-facts";
import type { CommercialUseRow } from "./commercial-use-overview";
import { CREATE_KINDS, type CreateKind } from "./create-kinds";
import { HUB_HISTORY_PAGE_SIZE } from "./studio-constants";
import { studioModelLists, studioModels } from "./studio-models";
import type { StudioModel } from "./studio-types";

export interface StudioPageData {
  user: JwtPayloadType;
  locale: CountryLanguage;
  platform: Platform;
  /** First history page, rendered on the server; undefined if it failed. */
  history: MediaHistoryResponseOutput | undefined;
  models: StudioModel[];
  /** License status of this tool's models, for the commercial-use overview. */
  commercialUse: CommercialUseRow[];
}

/** Cheapest model and model count per tool, for the hub cards. */
export interface StudioKindSummary {
  kind: CreateKind;
  count: number;
  cheapest: StudioModel | undefined;
}

async function loadUser(locale: CountryLanguage): Promise<{
  user: JwtPayloadType;
  logger: ReturnType<typeof createEndpointLogger>;
}> {
  const logger = createEndpointLogger(false, locale);
  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.CUSTOMER, UserRole.PUBLIC, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  return { user, logger };
}

export async function studioData(
  locale: CountryLanguage,
  kind?: CreateKind,
): Promise<StudioPageData> {
  const { user, logger } = await loadUser(locale);
  const { t } = historyTranslation.scopedT(locale);
  const [history, models] = await Promise.all([
    MediaHistoryRepository.list(
      {
        kind,
        paginationInfo: {
          page: 1,
          limit: kind ? MEDIA_HISTORY_PAGE_SIZE : HUB_HISTORY_PAGE_SIZE,
        },
      },
      user,
      logger,
      t,
    ),
    kind ? studioModels(user, kind) : [],
  ]);
  return {
    user,
    locale,
    history: history.success ? history.data : undefined,
    models,
    commercialUse: kind
      ? models.flatMap((model) =>
          model.commercialUse
            ? [
                {
                  id: model.id,
                  name: model.name,
                  kind,
                  info: model.commercialUse,
                  href: `/${locale}/models/${toModelSlug(model.id)}`,
                },
              ]
            : [],
        )
      : [],
    platform: Platform.NEXT_PAGE,
  };
}

export async function studioSummaries(
  user: JwtPayloadType,
): Promise<StudioKindSummary[]> {
  const lists = await studioModelLists(user, CREATE_KINDS);
  return CREATE_KINDS.map((kind) => {
    const models = lists.get(kind) ?? [];
    return {
      kind,
      count: models.length,
      // Sorted by rate. Same pick as the tool page's default model, so the
      // "from" price is what the page opens with.
      cheapest:
        models.find(
          (m) => !m.requiresImage && !isUncensoredContent(m.content),
        ) ?? models[0],
    };
  });
}
