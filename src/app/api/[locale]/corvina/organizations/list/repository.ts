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

import type { CorvinaOrganizationsListResponseOutput } from "./definition";
import type { CorvinaOrganizationsListT } from "./i18n";

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

const orgListEnvelopeSchema = z.union([
  z.array(orgItemSchema),
  z
    .object({
      items: z.array(orgItemSchema).optional(),
      content: z.array(orgItemSchema).optional(),
      organizations: z.array(orgItemSchema).optional(),
      data: z.array(orgItemSchema).optional(),
      total: z.coerce.number().optional(),
      totalElements: z.coerce.number().optional(),
      totalCount: z.coerce.number().optional(),
    })
    .passthrough(),
]);

export class CorvinaOrganizationsListRepository {
  static async list(
    logger: EndpointLogger,
    t: CorvinaOrganizationsListT,
  ): Promise<ResponseType<CorvinaOrganizationsListResponseOutput>> {
    const result = await CorvinaClient.request(
      {
        method: "GET",
        path: corvinaEnv.CORVINA_ORGANIZATIONS_PATH,
        parse: orgListEnvelopeSchema,
      },
      logger,
    );

    if (!result.success) {
      return this.translateFailure(result.errorType, t);
    }

    const { items, total } = this.normalize(result.data);
    return success({
      organizations: items.map((item) => ({
        id: item.id,
        name: item.name ?? item.id,
        displayName: item.displayName ?? item.display_name ?? null,
        enabled: item.enabled ?? null,
        createdAt:
          item.createdAt ?? item.created_at ?? item.creationDate ?? null,
      })),
      total,
    });
  }

  private static normalize(payload: z.infer<typeof orgListEnvelopeSchema>): {
    items: Array<z.infer<typeof orgItemSchema>>;
    total: number;
  } {
    if (Array.isArray(payload)) {
      return { items: payload, total: payload.length };
    }
    const items =
      payload.items ??
      payload.content ??
      payload.organizations ??
      payload.data ??
      [];
    const total =
      payload.total ??
      payload.totalElements ??
      payload.totalCount ??
      items.length;
    return { items, total };
  }

  private static translateFailure(
    errorType: ErrorResponseTypes,
    t: CorvinaOrganizationsListT,
  ): ResponseType<CorvinaOrganizationsListResponseOutput> {
    if (errorType === ErrorResponseTypes.UNAUTHORIZED) {
      return fail({
        message: t("get.errors.unauthorized.title"),
        errorType,
      });
    }
    if (errorType === ErrorResponseTypes.FORBIDDEN) {
      return fail({ message: t("get.errors.forbidden.title"), errorType });
    }
    if (errorType === ErrorResponseTypes.NOT_FOUND) {
      return fail({ message: t("get.errors.notFound.title"), errorType });
    }
    if (errorType === ErrorResponseTypes.VALIDATION_FAILED) {
      return fail({ message: t("get.errors.validation.title"), errorType });
    }
    if (errorType === ErrorResponseTypes.CONFLICT) {
      return fail({ message: t("get.errors.conflict.title"), errorType });
    }
    if (errorType === ErrorResponseTypes.EXTERNAL_SERVICE_ERROR) {
      return fail({ message: t("get.errors.network.title"), errorType });
    }
    if (errorType === ErrorResponseTypes.INTERNAL_ERROR) {
      return fail({ message: t("get.errors.server.title"), errorType });
    }
    return fail({ message: t("get.errors.unknown.title"), errorType });
  }
}
