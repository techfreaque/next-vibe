/**
 * Skill Publish API Definition
 * PATCH /agent/skills/[id]/publish
 *
 * One-click publish/unpublish flow:
 *  - PUBLISHED → immediately visible in the community skills browser
 *  - DRAFT → private (default for new skills)
 *  - UNLISTED → accessible via direct link, not listed
 * Sets publishedAt timestamp when transitioning to PUBLISHED.
 * Only the skill owner can publish.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { SKILL_PUBLISH_ALIAS } from "../../constants";
import {
  SkillOwnershipType,
  SkillStatus,
  SkillStatusOptions,
} from "../../enum";
import { scopedTranslation } from "./i18n";

const SkillPublishContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SkillPublishContainer })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["vibe", "agent", "skills", "[id]", "publish"],
  aliases: [SKILL_PUBLISH_ALIAS],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  titleShort: "patch.titleShort" as const,
  description: "patch.description" as const,
  icon: "send",
  category: "ai",
  subCategory: "skillsCommunity",
  tags: ["tags.skills"],

  fields: customWidgetObject({
    render: SkillPublishContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../../definition")).default.GET,
        labelField: "name",
        label: "patch.title" as const,
        description: "patch.description" as const,
        hidden: true,
        schema: z.string(),
      }),

      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.status.label" as const,
        description: "patch.status.description" as const,
        options: SkillStatusOptions,
        columns: 6,
        schema: z.enum([
          SkillStatus.DRAFT,
          SkillStatus.PUBLISHED,
          SkillStatus.UNLISTED,
        ]),
      }),

      changeNote: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.changeNote.label" as const,
        description: "patch.changeNote.description" as const,
        placeholder: "patch.changeNote.placeholder" as const,
        columns: 12,
        schema: z.string().max(500).optional(),
      }),

      status_response: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.status.content" as const,
        schema: z.enum([
          SkillStatus.DRAFT,
          SkillStatus.PUBLISHED,
          SkillStatus.UNLISTED,
        ]),
      }),

      publishedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.publishedAt.content" as const,
        schema: z.string().datetime().nullable(),
      }),

      backButton: backButton(scopedTranslation, {
        label: "patch.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "patch.button.submit" as const,
        loadingText: "patch.button.loading" as const,
        icon: "send",
        variant: "primary",
        className: "ml-auto",
        usage: { request: "data&urlPathParams" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  // Owner sees publish-state changes on their own channel; once PUBLIC the update
  // rides the shared channel. Decided per-skill (current ownership) by the route.
  channel: { scope: "resolved" } as const,

  events: {
    "skill-updated": {
      remoteEvent: true as const,
      syncDomain: "skills" as const,
      operation: "merge" as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      requestFields: ["status"] as const,
      responseFields: ["status_response"] as const,
      urlPathParamsFields: ["id"] as const,
      onEvent: async ({ responseData, urlPathParams, logger }) => {
        const skillId = urlPathParams.id;
        const ownershipType =
          responseData.status_response === SkillStatus.PUBLISHED
            ? SkillOwnershipType.PUBLIC
            : SkillOwnershipType.USER;
        const [{ apiClient }, skillsDefinition] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("../../definition"),
        ]);
        apiClient.updateEndpointData(
          skillsDefinition.default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            return {
              ...old,
              data: {
                ...old.data,
                sections: old.data.sections.map((section) => ({
                  ...section,
                  skills: section.skills.map((sk) =>
                    sk.skillId === skillId ? { ...sk, ownershipType } : sk,
                  ),
                })),
              },
            };
          },
        );
      },
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { id: "code-reviewer" },
    },
    requests: {
      default: {
        status: SkillStatus.PUBLISHED,
        changeNote: "Improved system prompt clarity",
      },
    },
    responses: {
      default: {
        status_response: SkillStatus.PUBLISHED,
        publishedAt: "2026-03-15T12:00:00.000Z",
      },
    },
  },
});

export const endpoints = { PATCH };

export type SkillPublishPatchResponseOutput = typeof PATCH.types.ResponseOutput;

export default endpoints;
