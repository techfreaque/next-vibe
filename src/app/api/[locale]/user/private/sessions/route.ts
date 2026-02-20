import { cookies } from "next/headers";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { AUTH_TOKEN_COOKIE_NAME } from "@/config/constants";

import sessionsEndpoints from "./definition";
import { SessionManagementRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: sessionsEndpoints,

  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, logger, request }) => {
      // Resolve the current session token from cookie or Authorization header
      let currentToken: string | undefined;
      if (request) {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          currentToken = authHeader.slice(7);
        }
      }
      if (!currentToken) {
        const cookieStore = await cookies();
        currentToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
      }
      return SessionManagementRepository.list(user, currentToken, logger);
    },
  },

  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger }) =>
      SessionManagementRepository.create(user, data.name, logger),
  },
});
