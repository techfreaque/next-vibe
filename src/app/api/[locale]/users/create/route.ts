/**
 * Users Create API Route Handler
 * Handles POST requests for creating new users
 */

import "server-only";

import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  renderAdminNotificationByEmail,
  renderWelcomeEmailByEmail,
} from "@/app/api/[locale]/user/public/signup/email";

import type {
  UserCreateRequestOutput,
  UserCreateResponseOutput,
} from "./definition";
import definitions from "./definition";
import { userCreateRepository } from "./repository";

const renderWelcomeMail: EmailFunctionType<
  UserCreateRequestOutput,
  UserCreateResponseOutput,
  never
> = ({ requestData, locale, t, logger }) =>
  renderWelcomeEmailByEmail(requestData.basicInfo.email, locale, t, logger);

const renderAdminNotification: EmailFunctionType<
  UserCreateRequestOutput,
  UserCreateResponseOutput,
  never
> = ({ requestData, locale, t, logger }) =>
  renderAdminNotificationByEmail(
    requestData.basicInfo.email,
    null,
    locale,
    t,
    logger,
  );

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: [
      {
        render: renderWelcomeMail,
        ignoreErrors: false,
      },
      {
        render: renderAdminNotification,
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
