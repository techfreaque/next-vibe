/**
 * Auth Check Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import { Methods, WidgetType, LayoutType } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import { objectField, responseField } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";

const GET = createEndpoint({
  method: Methods.GET,
  title: "app.api.v1.core.user.auth.check.get.title",
  description: "app.api.v1.core.user.auth.check.get.description",
  path: ["api", "[locale]", "v1", "core", "user", "auth", "check"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layout: { type: LayoutType.VERTICAL },
    },
    { response: true },
    {
      authenticated: responseField(
        { type: WidgetType.TEXT },
        z.boolean(),
      ),
      tokenValid: responseField(
        { type: WidgetType.TEXT },
        z.boolean(),
      ),
    },
  ),
});

const endpoints = { GET };

export default endpoints;
