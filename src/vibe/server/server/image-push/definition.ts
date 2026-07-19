/**
 * Build & Push Image Endpoint Definition
 * Builds the production Docker image and pushes it to a registry, so the
 * deploy server (install-docker.sh) only pulls it instead of building it.
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/server/server/image-push/i18n";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { IMAGE_PUSH_ALIAS } from "./constants";

const ImagePushResultWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ImagePushResultWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "server", "server", "image-push"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "devTools",
  subCategory: "serverManagement",
  tags: ["tags.imagePush"],
  icon: "box",
  timeoutMs: 0,
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: [IMAGE_PUSH_ALIAS],

  fields: customWidgetObject({
    render: ImagePushResultWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      image: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.image.title",
        description: "post.fields.image.description",
        schema: z.string().min(1).optional(),
      }),

      tag: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.tag.title",
        description: "post.fields.tag.description",
        schema: z.string().min(1).optional(),
      }),

      push: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.push.title",
        description: "post.fields.push.description",
        schema: z.boolean().default(true),
      }),

      platform: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.platform.title",
        description: "post.fields.platform.description",
        schema: z.string().min(1).default("linux/amd64"),
      }),

      sshTarget: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.sshTarget.title",
        description: "post.fields.sshTarget.description",
        schema: z.string().min(1).optional(),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.output.title",
        schema: z.string(),
      }),

      resolvedImage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.resolvedImage.title",
        schema: z.string(),
      }),

      tags: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.tags.title",
        schema: z.array(z.string()),
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {},
      buildOnly: {
        push: false,
      },
      customImage: {
        image: "ghcr.io/techfreaque/next-vibe-app",
        tag: "v3.3.3",
      },
      viaSsh: {
        sshTarget: "root@203.0.113.5",
      },
    },
    responses: {
      default: {
        success: true,
        output:
          "🚀 Pushed ghcr.io/techfreaque/next-vibe-app:a1b2c3d, ghcr.io/techfreaque/next-vibe-app:latest",
        resolvedImage: "ghcr.io/techfreaque/next-vibe-app",
        tags: ["a1b2c3d", "latest"],
        duration: 120000,
      },
      buildOnly: {
        success: true,
        output:
          "✅ Built ghcr.io/techfreaque/next-vibe-app:a1b2c3d, ghcr.io/techfreaque/next-vibe-app:latest (not pushed)",
        resolvedImage: "ghcr.io/techfreaque/next-vibe-app",
        tags: ["a1b2c3d", "latest"],
        duration: 90000,
      },
      viaSsh: {
        success: true,
        output:
          "🚀 Transferred ghcr.io/techfreaque/next-vibe-app:a1b2c3d, ghcr.io/techfreaque/next-vibe-app:latest to root@203.0.113.5 via ssh",
        resolvedImage: "ghcr.io/techfreaque/next-vibe-app",
        tags: ["a1b2c3d", "latest"],
        duration: 150000,
      },
    },
  },
});

const imagePushDefinition = { POST };
export type ImagePushRequestInput = typeof POST.types.RequestInput;
export type ImagePushRequestOutput = typeof POST.types.RequestOutput;
export type ImagePushResponseInput = typeof POST.types.ResponseInput;
export type ImagePushResponseOutput = typeof POST.types.ResponseOutput;

export default imagePushDefinition;
