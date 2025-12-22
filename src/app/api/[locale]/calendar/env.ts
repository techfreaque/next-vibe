/**
 * Calendar Module Environment Configuration
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

export const { env: calendarEnv } = defineEnv({
  GOOGLE_SERVICE_ACCOUNT_EMAIL: {
    schema: z.string().email(),
    example: "your-service-account@project.iam.gserviceaccount.com",
    comment: "Google Calendar",
  },
  GOOGLE_PRIVATE_KEY: {
    schema: z.string(),
    example: "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
  },
  GOOGLE_CALENDAR_ID_DE: {
    schema: z.string().optional(),
    example: "your-de-calendar-id",
  },
  GOOGLE_CALENDAR_ID_PL: {
    schema: z.string().optional(),
    example: "your-pl-calendar-id",
  },
  GOOGLE_CALENDAR_ID_GLOBAL: {
    schema: z.string().optional(),
    example: "your-global-calendar-id",
  },
  GOOGLE_CALENDAR_ID_DEFAULT: {
    schema: z.string(),
    example: "your-default-calendar-id",
  },
});
