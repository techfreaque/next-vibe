/**
 * Skill Vote API Definition
 * POST /agent/chat/skills/[id]/vote
 *
 * Toggle-upvote a community skill. Idempotent:
 *  - If not voted → insert vote, increment vote_count
 *  - If already voted → delete vote, decrement vote_count
 * Auto-upgrades trust_level to VERIFIED when vote_count >= threshold.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SKILL_VOTE_ALIAS } from "../../constants";
import { scopedTranslation } from "./i18n";
import { SkillVoteContainer } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "skills", "[id]", "vote"],
  aliases: [SKILL_VOTE_ALIAS],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "thumbs-up",
  category: "app.endpointCategories.ai",
  tags: ["tags.skills"],

  fields: customWidgetObject({
    render: SkillVoteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.title" as const,
        description: "post.description" as const,
        hidden: true,
        schema: z.string().uuid(),
      }),

      voted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.voted" as const,
        schema: z.boolean(),
      }),

      voteCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.voteCount" as const,
        schema: z.number().int().nonnegative(),
      }),

      trustLevel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.trustLevel" as const,
        schema: z.string(),
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

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
        voted: true,
        voteCount: 5,
        trustLevel: "enums.trustLevel.community",
      },
    },
  },
});

export const endpoints = { POST };

export type SkillVotePostResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
