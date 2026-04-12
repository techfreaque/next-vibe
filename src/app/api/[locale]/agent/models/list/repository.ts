/**
 * Models List Repository
 * Reads model definitions (static, no DB) and applies search + filter.
 */

import type { CountryLanguage } from "@/i18n/core/config";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { success } from "@/app/api/[locale]/shared/types/response.schema";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { allModelDefinitions, getModelPrice } from "../all-models";
import { chatModelOptions } from "../../ai-stream/models";
import { imageGenModelOptions } from "../../image-generation/models";
import { musicGenModelOptions } from "../../music-generation/models";
import { videoGenModelOptions } from "../../video-generation/models";
import { ttsModelOptions } from "../../text-to-speech/models";
import { sttModelOptions } from "../../speech-to-text/models";
import type { AnyModelOption, ModelDefinition } from "../models";
import { modelProviders } from "../models";
import { IntelligenceLevelDB } from "../../chat/skills/enum";
import { ModelUtility } from "../enum";

import type { ModelListGetResponseOutput, ModelListItem } from "./definition";

// Flat list of all model options across all roles
const allModelOptions: AnyModelOption[] = [
  ...chatModelOptions,
  ...imageGenModelOptions,
  ...musicGenModelOptions,
  ...videoGenModelOptions,
  ...ttsModelOptions,
  ...sttModelOptions,
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getModelType(def: ModelDefinition): string {
  if (def.outputs.includes("image")) {
    return "image";
  }
  if (def.outputs.includes("video")) {
    return "video";
  }
  if (def.outputs.includes("audio") || def.inputs.includes("audio")) {
    return "audio";
  }
  return "text";
}

function getProviderDisplayName(def: ModelDefinition): string {
  const providerConfig = modelProviders[def.by];
  return providerConfig?.name ?? def.by;
}

/** Extract human-readable label from a translation key, e.g. "enums.intelligence.quick" → "quick" */
function keyToLabel(key: string): string {
  const parts = key.split(".");
  return parts[parts.length - 1] ?? key;
}

function mapDefinitionToItem(
  def: ModelDefinition,
  isAdmin: boolean,
): ModelListItem {
  const visibleOptions = allModelOptions.filter((opt: AnyModelOption) => {
    if (opt.name !== def.name) {
      return false;
    }
    if (!isAdmin && opt.adminOnly) {
      return false;
    }
    return true;
  });

  const priceOption = visibleOptions[0] ?? null;
  const price = priceOption ? getModelPrice(priceOption) : 0;

  return {
    id: visibleOptions[0]?.id ?? def.name,
    name: def.name,
    provider: getProviderDisplayName(def),
    type: getModelType(def),
    description: keyToLabel(def.description),
    contextWindow: def.contextWindow ?? null,
    parameterCount: def.parameterCount ?? null,
    intelligence: keyToLabel(def.intelligence),
    content: keyToLabel(def.content),
    price,
    supportsTools: def.supportsTools,
    utilities: def.utilities.map(keyToLabel),
    inputs: def.inputs,
    outputs: def.outputs,
  };
}

// ── Filtering ─────────────────────────────────────────────────────────────────

function applyFilters(
  defs: ModelDefinition[],
  params: {
    query?: string;
    modelType?: string;
    contentLevel?: string;
    intelligence?: string;
  },
  isAdmin: boolean,
): ModelDefinition[] {
  return defs.filter((def) => {
    // Never show legacy models
    if (def.utilities.includes(ModelUtility.LEGACY)) {
      return false;
    }

    if (!isAdmin) {
      const hasPublicProvider = def.providers.some((p) => !p.adminOnly);
      if (!hasPublicProvider) {
        return false;
      }
    }

    if (params.modelType) {
      if (getModelType(def) !== params.modelType) {
        return false;
      }
    }

    if (params.contentLevel) {
      if (def.content !== params.contentLevel) {
        return false;
      }
    }

    if (params.intelligence) {
      const order = IntelligenceLevelDB;
      const minIdx = order.indexOf(
        params.intelligence as (typeof order)[number],
      );
      const defIdx = order.indexOf(def.intelligence as (typeof order)[number]);
      if (minIdx !== -1 && defIdx !== -1 && defIdx < minIdx) {
        return false;
      }
    }

    if (params.query) {
      const q = params.query.toLowerCase();
      const providerName = getProviderDisplayName(def).toLowerCase();
      const matchName = def.name.toLowerCase().includes(q);
      const matchProvider = providerName.includes(q);
      const matchType = getModelType(def).includes(q);
      const matchUtilities = def.utilities.some((u) =>
        u.toLowerCase().includes(q),
      );
      const matchContent = def.content.toLowerCase().includes(q);
      const matchIntelligence = def.intelligence.toLowerCase().includes(q);
      if (
        !matchName &&
        !matchProvider &&
        !matchType &&
        !matchUtilities &&
        !matchContent &&
        !matchIntelligence
      ) {
        return false;
      }
    }

    return true;
  });
}

// ── Public interface ──────────────────────────────────────────────────────────

export const ModelsListRepository = {
  async getModels(
    data: {
      query?: string;
      modelType: string;
      contentLevel?: string;
      intelligence?: string;
    },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ModelListGetResponseOutput>> {
    logger.debug("ModelsListRepository.getModels", { ...data, locale });

    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

    const filtered = applyFilters(
      allModelDefinitions,
      {
        query: data.query,
        modelType: data.modelType,
        contentLevel: data.contentLevel,
        intelligence: data.intelligence,
      },
      isAdmin,
    );

    const totalCount = allModelDefinitions.filter((def) => {
      if (def.utilities.includes(ModelUtility.LEGACY)) {
        return false;
      }
      if (!isAdmin) {
        return def.providers.some((p) => !p.adminOnly);
      }
      return true;
    }).length;

    const models = filtered.map((def) => mapDefinitionToItem(def, isAdmin));

    return success({
      models,
      totalCount,
    });
  },
};
