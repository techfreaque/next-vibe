import "server-only";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { ResponseType } from "../../../core/route/response.schema";
import { success } from "../../../core/route/response.schema";
import { ensureProvidersRegistered, getSyncProviders } from "../provider";
import type { SyncProvidersGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class SyncProvidersRepository {
  static async listProviders(
    locale: CountryLanguage,
  ): Promise<ResponseType<SyncProvidersGetResponseOutput>> {
    await ensureProvidersRegistered();

    const { t } = scopedTranslation.scopedT(locale);

    const labels: Record<string, string> = {
      memories: String(t("providers.memories")),
      documents: String(t("providers.documents")),
      skills: String(t("providers.skills")),
      favorites: String(t("providers.favorites")),
      threads: String(t("providers.threads")),
    };

    const descriptions: Record<string, string> = {
      memories: String(t("providerDescriptions.memories")),
      documents: String(t("providerDescriptions.documents")),
      skills: String(t("providerDescriptions.skills")),
      favorites: String(t("providerDescriptions.favorites")),
      threads: String(t("providerDescriptions.threads")),
    };

    const providers = [...getSyncProviders().values()].map((p) => ({
      key: p.key,
      label: labels[p.labelKey] ?? p.labelKey,
      description: descriptions[p.labelKey] ?? "",
    }));

    return success({ providers });
  }
}
