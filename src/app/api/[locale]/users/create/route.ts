/**
 * Users Create API Route Handler
 * Handles POST requests for creating new users
 */

import "server-only";

import type {
  ErrorResponseType,
  SuccessResponseType,
} from "next-vibe/shared/types/response.schema";

import type { EmailTemplateReturnType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  renderAdminNotificationByEmail,
  renderWelcomeEmailByEmail,
} from "@/app/api/[locale]/user/public/signup/email";

import definitions from "./definition";
import { userCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: [
      {
        render: ({
          requestData,
          locale,
          t,
          logger,
        }): Promise<
          SuccessResponseType<EmailTemplateReturnType> | ErrorResponseType
        > =>
          renderWelcomeEmailByEmail(
            requestData.basicInfo.email,
            locale,
            t,
            logger,
          ),
        ignoreErrors: false,
      },
      {
        render: ({
          requestData,
          locale,
          t,
          logger,
        }): Promise<
          SuccessResponseType<EmailTemplateReturnType> | ErrorResponseType
        > =>
          renderAdminNotificationByEmail(
            requestData.basicInfo.email,
            null,
            locale,
            t,
            logger,
          ),
        ignoreErrors: true,
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
