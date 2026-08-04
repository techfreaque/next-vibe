import "server-only";

import type { CountryLanguage } from "../../../../core/i18n/core/config";
import type { ResponseType } from "../../../../core/route/response.schema";
import type { JwtPayloadType } from "../../../../identity/auth/types";
import type { EndpointLogger } from "../../../../logger/types";
import type { GraphConfig } from "../../../graph/types";
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
