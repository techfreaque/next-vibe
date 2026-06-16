import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { GraphConfig } from "@/app/api/[locale]/system/unified-interface/vibe-sense/graph/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { VibeSenseRepository } from "../../../repository";
import type { GraphEditPutResponseOutput } from "./definition";

export class GraphEditRepository {
  static async upsert(
    data: {
      name?: string | null;
      slug?: string | null;
      description?: string | null;
      config?: GraphConfig | null;
    },
    id: string | undefined,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<GraphEditPutResponseOutput>> {
    if (!id || id === "new") {
      const result = await VibeSenseRepository.createGraph(
        {
          name: data.name ?? "New Graph",
          slug: data.slug ?? `graph-${Date.now()}`,
          description: data.description ?? undefined,
          config: data.config ?? {
            nodes: {},
            edges: [],
            trigger: { type: "manual" },
          },
        },
        user,
        logger,
        locale,
      );
      if (!result.success) {
        return result;
      }
      return {
        ...result,
        data: { newId: result.data.id } as GraphEditPutResponseOutput,
      };
    }
    return VibeSenseRepository.editGraph(
      id,
      {
        name: data.name ?? undefined,
        slug: data.slug ?? undefined,
        description: data.description ?? undefined,
        config: data.config ?? undefined,
      },
      user,
      logger,
      locale,
    );
  }
}
