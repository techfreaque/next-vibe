/**
 * Users Create API Route Handler
 * Handles POST requests for creating new users
 */

import "server-only";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";

import definitions from "./definition";
import { renderAdminNotificationEmail, renderWelcomeEmail } from "./email";
import { userCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: [
      {
        render: renderWelcomeEmail,
        ignoreErrors: false,
      },
      {
        render: renderAdminNotificationEmail,
        ignoreErrors: true, // Don't fail user creation if admin notification fails
      },
    ],
    handler: async ({ data, user, locale, logger, t }) => {
      return await userCreateRepository.createUser(
        data,
        user,
        locale,
        logger,
        t,
      );
    },
  },
});
