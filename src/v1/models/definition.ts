/**
 * GET /v1/models - OpenAI-compatible model list for the API key's user.
 * Served at /api/<locale>/v1/models. The handler answers with the raw OpenAI
 * body ({object:"list",data:[...]}); the declared response is nominal.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { V1_MODELS_ALIAS } from "../shared/constants";
import { V1_ERROR_TYPES } from "../shared/error-types";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["v1", "models"],
  aliases: [V1_MODELS_ALIAS] as const,
  title: "models.get.title",
  titleShort: "models.get.titleShort",
  description: "models.get.description",
  icon: "list",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.api"],
  // PUBLIC is allowed so the handler can answer unauthenticated calls with the
  // OpenAI 401 body; it authenticates by API key only (see api-keys/auth.ts).
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.CLI_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.SKILL_OFF,
  ] as const,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "models.get.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true } as const,
    children: {
      object: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "models.get.response.object",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "models.get.success.title",
    description: "models.get.success.description",
  },
  examples: {
    responses: { default: { object: "list" } },
  },
});

const v1ModelsEndpoints = { GET } as const;
export default v1ModelsEndpoints;

export type V1ModelsGetResponseOutput = typeof GET.types.ResponseOutput;
