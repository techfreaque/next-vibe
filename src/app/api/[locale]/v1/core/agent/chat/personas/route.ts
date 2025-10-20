/**
 * Personas API Route Handler
 * Handles GET (list) and POST (create) requests for personas
 */

import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import * as repository from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user }) => {
      const userId = user.id;

      // For authenticated users, return default + custom personas
      if (userId) {
        const personas = await repository.getAllPersonas(userId);
        return createSuccessResponse({ personas });
      }

      // For public/lead users, return only default personas
      const defaultPersonas = repository.getDefaultPersonas();
      return createSuccessResponse({ personas: defaultPersonas });
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, data }) => {
      const userId = user.id;

      if (!userId) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.personas.post.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Create the custom persona
      const persona = await repository.createCustomPersona({
        userId,
        name: data.name,
        description: data.description,
        icon: data.icon,
        systemPrompt: data.systemPrompt,
        category: data.category,
        preferredModel: data.preferredModel ?? null,
        suggestedPrompts: data.suggestedPrompts || [],
        isPublic: false,
        metadata: {},
      });

      return createSuccessResponse({ id: persona.id });
    },
  },
});
