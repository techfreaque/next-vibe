/**
 * Single Persona API Route Handler
 * Handles GET, PATCH (update), and DELETE requests for a single persona
 */

import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

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
        return fail({
          message:
            "app.api.v1.core.agent.chat.personas.id.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ persona });
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ user, urlPathParams, data }) => {
      const userId = user.id;
      const { id } = urlPathParams;

      if (!userId) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.personas.id.patch.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
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
        return fail({
          message:
            "app.api.v1.core.agent.chat.personas.id.patch.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ success: true });
    },
  },
});
