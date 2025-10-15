/**
 * Manifest API Definition
 * Defines endpoint for retrieving web app manifest data
 */

import { z } from "zod";

import {
  ComponentVariant,
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import {
  IconPurpose,
  WebAppCategory,
  WebAppDisplayMode,
  WebAppOrientation,
} from "./enum";

/**
 * Manifest Endpoint (GET)
 * Retrieves localized web app manifest
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "manifest"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],

  title: "app.api.v1.core.manifest.title",
  description: "app.api.v1.core.manifest.description",
  category: "app.api.v1.core.manifest.category",
  tags: [
    "app.api.v1.core.manifest.tags.manifest",
    "app.api.v1.core.manifest.tags.configuration",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.manifest.form.title",
      description: "app.api.v1.core.manifest.form.description",
      layout: { type: LayoutType.FULL_WIDTH },
    },
    { response: true },
    {
      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.manifest.response.title",
          description: "app.api.v1.core.manifest.response.description",
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          name: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.manifest.response.title",
            },
            z.string(),
          ),
          short_name: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.manifest.response.title",
            },
            z.string(),
          ),
          description: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.manifest.response.description",
            },
            z.string(),
          ),
          start_url: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.manifest.response.title",
            },
            z.string(),
          ),
          display: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.manifest.response.display",
              variant: ComponentVariant.DEFAULT,
            },
            z.nativeEnum(WebAppDisplayMode),
          ),
          background_color: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.manifest.response.title",
            },
            z.string(),
          ),
          theme_color: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.manifest.response.title",
            },
            z.string(),
          ),
          orientation: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.manifest.response.orientation",
              variant: ComponentVariant.DEFAULT,
            },
            z.nativeEnum(WebAppOrientation),
          ),
          scope: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.manifest.response.title",
            },
            z.string(),
          ),
          lang: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.manifest.response.title",
            },
            z.string(),
          ),
          categories: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.manifest.response.categories",
              variant: ComponentVariant.DEFAULT,
            },
            z.array(z.nativeEnum(WebAppCategory)),
          ),
          icons: responseArrayField(
            {
              type: WidgetType.DATA_CARDS,
              cardConfig: {
                title: "app.api.v1.core.manifest.response.title",
              },
              layout: "grid",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.v1.core.manifest.response.title",
                description: "app.api.v1.core.manifest.response.description",
                layout: { type: LayoutType.STACKED },
              },
              { response: true },
              {
                src: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.v1.core.manifest.response.title",
                  },
                  z.string(),
                ),
                sizes: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.v1.core.manifest.response.title",
                  },
                  z.string(),
                ),
                type: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.v1.core.manifest.response.title",
                  },
                  z.string(),
                ),
                purpose: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.manifest.response.iconPurpose",
                    variant: ComponentVariant.DEFAULT,
                  },
                  z.nativeEnum(IconPurpose),
                ),
              },
            ),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.manifest.errors.validation.title",
      description: "app.api.v1.core.manifest.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.manifest.errors.unauthorized.title",
      description: "app.api.v1.core.manifest.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.manifest.errors.forbidden.title",
      description: "app.api.v1.core.manifest.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.manifest.errors.server.title",
      description: "app.api.v1.core.manifest.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.manifest.errors.network.title",
      description: "app.api.v1.core.manifest.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.manifest.errors.unknown.title",
      description: "app.api.v1.core.manifest.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.manifest.errors.conflict.title",
      description: "app.api.v1.core.manifest.errors.conflict.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.manifest.errors.not_found.title",
      description: "app.api.v1.core.manifest.errors.not_found.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.manifest.errors.unsaved_changes.title",
      description:
        "app.api.v1.core.manifest.errors.unsaved_changes.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.manifest.success.title",
    description: "app.api.v1.core.manifest.success.description",
  },

  examples: {
    responses: {
      empty: {
        response: {
          name: "Social Media Service",
          short_name: "SMS",
          description: "A comprehensive social media management platform",
          start_url: "/en-GLOBAL",
          display: WebAppDisplayMode.STANDALONE,
          background_color: "#ffffff",
          theme_color: "#0EA5E9",
          orientation: WebAppOrientation.PORTRAIT_PRIMARY,
          scope: "/en-GLOBAL/",
          lang: "en",
          categories: [
            WebAppCategory.SOCIAL,
            WebAppCategory.PRODUCTIVITY,
            WebAppCategory.BUSINESS,
          ],
          icons: [
            {
              src: "/images/placeholder-logo.png",
              sizes: "192x192",
              type: "image/png",
              purpose: IconPurpose.MASKABLE_ANY,
            },
            {
              src: "/images/placeholder-logo.png",
              sizes: "512x512",
              type: "image/png",
              purpose: IconPurpose.MASKABLE_ANY,
            },
          ],
        },
      },
      basic: {
        response: {
          name: "Social Media Service",
          short_name: "SMS",
          description: "A comprehensive social media management platform",
          start_url: "/de-DE",
          display: WebAppDisplayMode.STANDALONE,
          background_color: "#ffffff",
          theme_color: "#0EA5E9",
          orientation: WebAppOrientation.PORTRAIT_PRIMARY,
          scope: "/de-DE/",
          lang: "de",
          categories: [
            WebAppCategory.SOCIAL,
            WebAppCategory.PRODUCTIVITY,
            WebAppCategory.BUSINESS,
          ],
          icons: [
            {
              src: "/images/placeholder-logo.png",
              sizes: "192x192",
              type: "image/png",
              purpose: IconPurpose.MASKABLE_ANY,
            },
            {
              src: "/images/placeholder-logo.png",
              sizes: "512x512",
              type: "image/png",
              purpose: IconPurpose.MASKABLE_ANY,
            },
          ],
        },
      },
      advanced: {
        response: {
          name: "Social Media Service",
          short_name: "SMS",
          description: "A comprehensive social media management platform",
          start_url: "/pl-PL",
          display: WebAppDisplayMode.STANDALONE,
          background_color: "#ffffff",
          theme_color: "#0EA5E9",
          orientation: WebAppOrientation.PORTRAIT_PRIMARY,
          scope: "/pl-PL/",
          lang: "pl",
          categories: [
            WebAppCategory.SOCIAL,
            WebAppCategory.PRODUCTIVITY,
            WebAppCategory.BUSINESS,
          ],
          icons: [
            {
              src: "/images/placeholder-logo.png",
              sizes: "192x192",
              type: "image/png",
              purpose: IconPurpose.MASKABLE_ANY,
            },
            {
              src: "/images/placeholder-logo.png",
              sizes: "512x512",
              type: "image/png",
              purpose: IconPurpose.MASKABLE_ANY,
            },
          ],
        },
      },
    },
  },
});

export type ManifestRequestInput = typeof GET.types.RequestInput;
export type ManifestRequestOutput = typeof GET.types.RequestOutput;
export type ManifestResponseInput = typeof GET.types.ResponseInput;
export type ManifestResponseOutput = typeof GET.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const manifestEndpoints = {
  GET,
};

export { GET };
export default manifestEndpoints;
