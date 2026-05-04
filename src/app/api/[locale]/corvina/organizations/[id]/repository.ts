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
  CorvinaOrganizationDeleteResponseOutput,
  CorvinaOrganizationDeleteUrlVariablesOutput,
  CorvinaOrganizationGetResponseOutput,
  CorvinaOrganizationGetUrlVariablesOutput,
  CorvinaOrganizationPatchRequestOutput,
  CorvinaOrganizationPatchResponseOutput,
  CorvinaOrganizationPatchUrlVariablesOutput,
} from "./definition";
import type { CorvinaOrganizationByIdT } from "./i18n";

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

const orgSingleEnvelopeSchema = z.union([
  orgItemSchema,
  z.object({
    data: orgItemSchema.optional(),
    organization: orgItemSchema.optional(),
    item: orgItemSchema.optional(),
  }),
]);

const deletePayloadSchema = z.unknown();

type Method = "get" | "patch" | "delete";

export class CorvinaOrganizationByIdRepository {
  static async getById(
    urlPathParams: CorvinaOrganizationGetUrlVariablesOutput,
    logger: EndpointLogger,
    t: CorvinaOrganizationByIdT,
  ): Promise<ResponseType<CorvinaOrganizationGetResponseOutput>> {
    const result = await CorvinaClient.request(
      {
        method: "GET",
        path: this.buildOrgPath(urlPathParams.id),
        parse: orgSingleEnvelopeSchema,
      },
      logger,
    );

    if (!result.success) {
      return this.translateFailure(result.errorType, "get", t);
    }

    const item = this.unwrap(result.data);
    return success({
      orgId: item.id,
      name: item.name ?? item.id,
      displayName: item.displayName ?? item.display_name ?? null,
      enabled: item.enabled ?? null,
      createdAt:
        item.createdAt ?? item.created_at ?? item.creationDate ?? null,
    });
  }

  static async update(
    urlPathParams: CorvinaOrganizationPatchUrlVariablesOutput,
    data: CorvinaOrganizationPatchRequestOutput,
    logger: EndpointLogger,
    t: CorvinaOrganizationByIdT,
  ): Promise<ResponseType<CorvinaOrganizationPatchResponseOutput>> {
    const result = await CorvinaClient.request(
      {
        method: "PATCH",
        path: this.buildOrgPath(urlPathParams.id),
        body: { displayName: data.displayName },
        parse: orgSingleEnvelopeSchema,
      },
      logger,
    );

    if (!result.success) {
      return this.translateFailure(result.errorType, "patch", t);
    }

    const item = this.unwrap(result.data);
    return success({
      orgId: item.id,
      name: item.name ?? item.id,
      displayNameResult: item.displayName ?? item.display_name ?? null,
      enabled: item.enabled ?? null,
      createdAt:
        item.createdAt ?? item.created_at ?? item.creationDate ?? null,
    });
  }

  static async deleteById(
    urlPathParams: CorvinaOrganizationDeleteUrlVariablesOutput,
    logger: EndpointLogger,
    t: CorvinaOrganizationByIdT,
  ): Promise<ResponseType<CorvinaOrganizationDeleteResponseOutput>> {
    const result = await CorvinaClient.request(
      {
        method: "DELETE",
        path: this.buildOrgPath(urlPathParams.id),
        parse: deletePayloadSchema,
      },
      logger,
    );

    if (!result.success) {
      return this.translateFailure(result.errorType, "delete", t);
    }

    logger.info("[CORVINA] Organization deleted", { id: urlPathParams.id });
    return success({ deleted: true, deletedId: urlPathParams.id });
  }

  private static buildOrgPath(id: string): string {
    const base = corvinaEnv.CORVINA_ORGANIZATIONS_PATH.replace(/\/$/, "");
    return `${base}/${encodeURIComponent(id)}`;
  }

  private static unwrap(
    payload: z.infer<typeof orgSingleEnvelopeSchema>,
  ): z.infer<typeof orgItemSchema> {
    if ("id" in payload) {
      return payload;
    }
    return payload.data ?? payload.organization ?? payload.item ?? { id: "" };
  }

  private static translateFailure<T>(
    errorType: ErrorResponseTypes,
    method: Method,
    t: CorvinaOrganizationByIdT,
  ): ResponseType<T> {
    if (errorType === ErrorResponseTypes.UNAUTHORIZED) {
      return fail({
        message: this.errorMessage(method, "unauthorized", t),
        errorType,
      });
    }
    if (errorType === ErrorResponseTypes.FORBIDDEN) {
      return fail({
        message: this.errorMessage(method, "forbidden", t),
        errorType,
      });
    }
    if (errorType === ErrorResponseTypes.NOT_FOUND) {
      return fail({
        message: this.errorMessage(method, "notFound", t),
        errorType,
      });
    }
    if (errorType === ErrorResponseTypes.VALIDATION_FAILED) {
      return fail({
        message: this.errorMessage(method, "validation", t),
        errorType,
      });
    }
    if (errorType === ErrorResponseTypes.CONFLICT) {
      return fail({
        message: this.errorMessage(method, "conflict", t),
        errorType,
      });
    }
    if (errorType === ErrorResponseTypes.EXTERNAL_SERVICE_ERROR) {
      return fail({
        message: this.errorMessage(method, "network", t),
        errorType,
      });
    }
    if (errorType === ErrorResponseTypes.INTERNAL_ERROR) {
      return fail({
        message: this.errorMessage(method, "server", t),
        errorType,
      });
    }
    return fail({
      message: this.errorMessage(method, "unknown", t),
      errorType,
    });
  }

  private static errorMessage(
    method: Method,
    key:
      | "unauthorized"
      | "forbidden"
      | "notFound"
      | "validation"
      | "conflict"
      | "network"
      | "server"
      | "unknown",
    t: CorvinaOrganizationByIdT,
  ): string {
    if (method === "get") {
      if (key === "unauthorized") return t("get.errors.unauthorized.title");
      if (key === "forbidden") return t("get.errors.forbidden.title");
      if (key === "notFound") return t("get.errors.notFound.title");
      if (key === "validation") return t("get.errors.validation.title");
      if (key === "conflict") return t("get.errors.conflict.title");
      if (key === "network") return t("get.errors.network.title");
      if (key === "server") return t("get.errors.server.title");
      return t("get.errors.unknown.title");
    }
    if (method === "patch") {
      if (key === "unauthorized") return t("patch.errors.unauthorized.title");
      if (key === "forbidden") return t("patch.errors.forbidden.title");
      if (key === "notFound") return t("patch.errors.notFound.title");
      if (key === "validation") return t("patch.errors.validation.title");
      if (key === "conflict") return t("patch.errors.conflict.title");
      if (key === "network") return t("patch.errors.network.title");
      if (key === "server") return t("patch.errors.server.title");
      return t("patch.errors.unknown.title");
    }
    if (key === "unauthorized") return t("delete.errors.unauthorized.title");
    if (key === "forbidden") return t("delete.errors.forbidden.title");
    if (key === "notFound") return t("delete.errors.notFound.title");
    if (key === "validation") return t("delete.errors.validation.title");
    if (key === "conflict") return t("delete.errors.conflict.title");
    if (key === "network") return t("delete.errors.network.title");
    if (key === "server") return t("delete.errors.server.title");
    return t("delete.errors.unknown.title");
  }
}
