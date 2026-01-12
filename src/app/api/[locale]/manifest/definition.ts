/**
 * Manifest API Definition
 * Defines endpoint for retrieving web app manifest data
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { IconPurpose, WebAppCategory, WebAppDisplayMode, WebAppOrientation } from "./enum";

/**
 * Manifest Endpoint (GET)
 * Retrieves localized web app manifest
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["manifest"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  title: "app.api.manifest.title",
  description: "app.api.manifest.description",
  icon: "file-text",
  category: "app.api.manifest.category",
  tags: ["app.api.manifest.tags.manifest", "app.api.manifest.tags.configuration"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.manifest.form.title",
      description: "app.api.manifest.form.description",
      layoutType: LayoutType.FULL_WIDTH,
    },
    { response: true },
    {
      name: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.manifest.response.title",
        },
        z.string(),
      ),
      short_name: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.manifest.response.title",
        },
        z.string(),
      ),
      description: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.manifest.response.description",
        },
        z.string(),
      ),
      start_url: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.manifest.response.title",
        },
        z.string(),
      ),
      display: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.manifest.response.display",
        },
        z.string(),
      ),
      background_color: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.manifest.response.title",
        },
        z.string(),
      ),
      theme_color: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.manifest.response.title",
        },
        z.string(),
      ),
      orientation: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.manifest.response.orientation",
        },
        z.string(),
      ),
      scope: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.manifest.response.title",
        },
        z.string(),
      ),
      lang: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.manifest.response.title",
        },
        z.string(),
      ),
      categories: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.manifest.response.categories",
        },
        z.array(z.string()),
      ),
      icons: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
          cardConfig: {
            title: "app.api.manifest.response.title",
          },
          layout: {
            type: LayoutType.GRID,
            columns: 2,
          },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.manifest.response.title",
            description: "app.api.manifest.response.description",
            layoutType: LayoutType.STACKED,
          },
          { response: true },
          {
            src: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.manifest.response.title",
              },
              z.string(),
            ),
            sizes: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.manifest.response.title",
              },
              z.string(),
            ),
            type: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.manifest.response.title",
              },
              z.string(),
            ),
            purpose: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.manifest.response.iconPurpose",
              },
              z.string(),
            ),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.manifest.errors.validation.title",
      description: "app.api.manifest.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.manifest.errors.unauthorized.title",
      description: "app.api.manifest.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.manifest.errors.forbidden.title",
      description: "app.api.manifest.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.manifest.errors.server.title",
      description: "app.api.manifest.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.manifest.errors.network.title",
      description: "app.api.manifest.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.manifest.errors.unknown.title",
      description: "app.api.manifest.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.manifest.errors.conflict.title",
      description: "app.api.manifest.errors.conflict.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.manifest.errors.not_found.title",
      description: "app.api.manifest.errors.not_found.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.manifest.errors.unsaved_changes.title",
      description: "app.api.manifest.errors.unsaved_changes.description",
    },
  },

  successTypes: {
    title: "app.api.manifest.success.title",
    description: "app.api.manifest.success.description",
  },

  examples: {
    responses: {
      empty: {
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
        categories: [WebAppCategory.SOCIAL, WebAppCategory.PRODUCTIVITY, WebAppCategory.BUSINESS],
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
      basic: {
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
        categories: [WebAppCategory.SOCIAL, WebAppCategory.PRODUCTIVITY, WebAppCategory.BUSINESS],
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
      advanced: {
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
        categories: [WebAppCategory.SOCIAL, WebAppCategory.PRODUCTIVITY, WebAppCategory.BUSINESS],
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
} as const;
export default manifestEndpoints;
