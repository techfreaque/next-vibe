/**
 * Skill Vote API Definition
 * POST /agent/skills/[id]/vote
 *
 * Toggle-upvote a community skill. Idempotent:
 *  - If not voted → insert vote, increment vote_count
 *  - If already voted → delete vote, decrement vote_count
 * Auto-upgrades trust_level to VERIFIED when vote_count >= threshold.
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  backButton,
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { SKILL_VOTE_ALIAS } from "../../constants";
import {
  SkillTrustLevelDB,
  SkillVoteDirection,
  SkillVoteDirectionDB,
} from "../../enum";
import { scopedTranslation } from "./i18n";

const SkillVoteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SkillVoteContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "skills", "[id]", "vote"],
  aliases: [SKILL_VOTE_ALIAS],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "thumbs-up",
  category: "ai",
  subCategory: "skillsCommunity",
  tags: ["tags.skills"],

  fields: customWidgetObject({
    render: SkillVoteContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../../definition")).default.GET,
        labelField: "name",
        label: "post.title" as const,
        description: "post.description" as const,
        hidden: true,
        schema: z.string(),
      }),

      // Vote direction. Re-sending the user's current direction toggles it off.
      direction: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.direction.label" as const,
        description: "post.direction.description" as const,
        options: [
          {
            value: SkillVoteDirection.UP,
            label: "post.direction.up" as const,
          },
          {
            value: SkillVoteDirection.DOWN,
            label: "post.direction.down" as const,
          },
        ],
        schema: z.enum(SkillVoteDirectionDB).default(SkillVoteDirection.UP),
      }),

      // The user's resulting vote after this action: UP, DOWN, or null (cleared).
      userVote: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.userVote.content" as const,
        schema: z.enum(SkillVoteDirectionDB).nullable(),
      }),

      voteCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.voteCount.content" as const,
        schema: z.number().int(),
      }),

      upCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.upCount.content" as const,
        schema: z.number().int().nonnegative(),
      }),

      downCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.downCount.content" as const,
        schema: z.number().int().nonnegative(),
      }),

      trustLevel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.trustLevel.content" as const,
        schema: z.enum(SkillTrustLevelDB),
      }),

      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "post.button.vote" as const,
        loadingText: "post.button.loading" as const,
        icon: "thumbs-up",
        variant: "outline",
        className: "ml-auto",
        usage: { request: "data&urlPathParams" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  // A skill's vote metrics are visible to anyone who can view the skill — owner
  // on their own channel, PUBLIC on the shared channel. Decided per-skill by the
  // route's resolveChannel.
  channel: { scope: "resolved" } as const,

  // Client-only event — vote metrics (voteCount/trustLevel) are instance-local,
  // never relayed cross-instance. The onEvent patches them into the list card.
  events: {
    "skill-voted": {
      operation: "merge" as const,
      responseFields: ["voteCount", "trustLevel"] as const,
      urlPathParamsFields: ["id"] as const,
      onEvent: async ({ responseData, urlPathParams, logger }) => {
        const skillId = urlPathParams.id;

        const [{ apiClient }, skillsDefinition] = await Promise.all([
          import("next-vibe/platforms/react/hooks/store"),
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
                    sk.skillId === skillId
                      ? {
                          ...sk,
                          voteCount: responseData.voteCount ?? sk.voteCount,
                          trustLevel: responseData.trustLevel ?? sk.trustLevel,
                        }
                      : sk,
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
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { id: "code-reviewer" },
    },
    requests: {
      default: { direction: SkillVoteDirection.UP },
    },
    responses: {
      default: {
        userVote: SkillVoteDirection.UP,
        voteCount: 5,
        upCount: 6,
        downCount: 1,
        trustLevel: "enums.trustLevel.community",
      },
    },
  },
});

export const endpoints = { POST };

export type SkillVotePostRequestOutput = typeof POST.types.RequestOutput;
export type SkillVotePostResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
