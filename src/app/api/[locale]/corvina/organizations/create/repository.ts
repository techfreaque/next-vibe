import "server-only";

import { z } from "zod";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import { corvinaEnv } from "@/app/api/[locale]/corvina/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  CorvinaOrganizationCreateRequestOutput,
  CorvinaOrganizationCreateResponseOutput,
} from "./definition";
import type { CorvinaOrganizationCreateT } from "./i18n";

const orgItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform((v) => String(v)),
    name: z.string().optional(),
    displayName: z.string().nullable().optional(),
    display_name: z.string().nullable().optional(),
    enabled: z.boolean().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    creationDate: z.string().nullable().optional(),
  })
  .passthrough();

const createEnvelopeSchema = z.union([
  orgItemSchema,
  z.object({
    data: orgItemSchema.optional(),
    organization: orgItemSchema.optional(),
    item: orgItemSchema.optional(),
  }),
]);

export class CorvinaOrganizationCreateRepository {
  static async create(
    data: CorvinaOrganizationCreateRequestOutput,
    logger: EndpointLogger,
    t: CorvinaOrganizationCreateT,
  ): Promise<ResponseType<CorvinaOrganizationCreateResponseOutput>> {
    const result = await CorvinaClient.request(
      {
        method: "POST",
        path: corvinaEnv.CORVINA_ORGANIZATIONS_PATH,
        body: {
          name: data.name,
          displayName: data.displayName ?? data.name,
          enabled: data.enabled ?? true,
        },
        parse: createEnvelopeSchema,
      },
      logger,
    );

    if (!result.success) {
      return this.translateFailure(result.errorType, t);
    }

    const item = this.unwrap(result.data);
    logger.info("[CORVINA] Organization created", {
      id: item.id,
      name: item.name ?? data.name,
    });
    return success({
      orgId: item.id,
      nameResult: item.name ?? data.name,
      displayNameResult: item.displayName ?? item.display_name ?? null,
      enabledResult: item.enabled ?? null,
      createdAt:
        item.createdAt ?? item.created_at ?? item.creationDate ?? null,
    });
  }

  private static unwrap(
    payload: z.infer<typeof createEnvelopeSchema>,
  ): z.infer<typeof orgItemSchema> {
    if ("id" in payload) {
      return payload;
    }
    return payload.data ?? payload.organization ?? payload.item ?? { id: "" };
  }

  private static translateFailure(
    errorType: ErrorResponseTypes,
    t: CorvinaOrganizationCreateT,
  ): ResponseType<CorvinaOrganizationCreateResponseOutput> {
    if (errorType === ErrorResponseTypes.UNAUTHORIZED) {
      return fail({
        message: t("post.errors.unauthorized.title"),
        errorType,
      });
    }
    if (errorType === ErrorResponseTypes.FORBIDDEN) {
      return fail({ message: t("post.errors.forbidden.title"), errorType });
    }
    if (errorType === ErrorResponseTypes.NOT_FOUND) {
      return fail({ message: t("post.errors.notFound.title"), errorType });
    }
    if (errorType === ErrorResponseTypes.VALIDATION_FAILED) {
      return fail({ message: t("post.errors.validation.title"), errorType });
    }
    if (errorType === ErrorResponseTypes.CONFLICT) {
      return fail({ message: t("post.errors.conflict.title"), errorType });
    }
    if (errorType === ErrorResponseTypes.EXTERNAL_SERVICE_ERROR) {
      return fail({ message: t("post.errors.network.title"), errorType });
    }
    if (errorType === ErrorResponseTypes.INTERNAL_ERROR) {
      return fail({ message: t("post.errors.server.title"), errorType });
    }
    return fail({ message: t("post.errors.unknown.title"), errorType });
  }
}
