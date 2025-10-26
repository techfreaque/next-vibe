/**
 * Single Persona API Route Handler
 * Handles GET, PATCH (update), and DELETE requests for a single persona
 */

import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import * as repository from "../repository";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, urlPathParams }) => {
      const userId = user.id;
      const { id } = urlPathParams;

      const persona = await repository.getPersonaById(id, userId);

      if (!persona) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.personas.id.get.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse({ persona });
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ user, urlPathParams, data }) => {
      const userId = user.id;
      const { id } = urlPathParams;

      if (!userId) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.personas.id.patch.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Only custom personas (UUIDs) can be updated
      // Map personaDescription to description for database
      const { personaDescription, ...rest } = data;
      const dbData = {
        ...rest,
        ...(personaDescription !== undefined && {
          description: personaDescription,
        }),
      };
      const updated = await repository.updateCustomPersona(id, userId, dbData);

      if (!updated) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.personas.id.patch.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse({ success: true });
    },
  },
});
