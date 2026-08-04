/**
 * Scoped-i18n Endpoint Definitions
 *
 * The translated counterpart to `./create`. Use this when an endpoint's copy has
 * to ship in more than one language: every title, description, tag, error/success
 * type and field label is a key validated against the module's i18n scope.
 *
 * The split exists so downstream code that carries its copy inline never pulls
 * the i18n machinery in - `./create` has no runtime dependency on the i18n folder.
 * Everything except the translation layer is shared with `./create`.
 */

import type { z } from "zod";

import type { UserRoleValue } from "../../identity/roles/enum";
import type {
  ChannelDeclaration,
  EndpointEventsMap,
  EndpointEventsMapBase,
} from "../../realtime/core/structured-events";
import type { UnifiedField } from "../../unified-ui/_shared/configs";
import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "../../unified-ui/_shared/types";
import type {
  ApiEndpoint,
  ChannelConfigField,
  CreateEndpointReturnInMethod,
  InferRequestOutput,
  InferResponseOutput,
  InferUrlVariablesOutput,
} from "./create";
import { buildEndpoint } from "./create";
import type { Methods } from "./enums";

/**
 * Create an endpoint whose copy lives in scoped i18n files.
 *
 * `scopedTranslation` is required, and `TScopedTranslationKey` is inferred from
 * `scopedTranslation.ScopedTranslationKey` - so every title, description, tag
 * and field label is compile-time validated against that scope.
 *
 * Pair with the field helpers from `next-vibe/unified-ui/_shared/utils-i18n`
 * (they take `scopedTranslation` as their first argument) and with `fail` in the
 * repository, so translation can never be forgotten.
 *
 * For single-language endpoints, use `createEndpoint` from `./create` instead -
 * it takes literal strings and needs no i18n folder at all.
 */
export function createEndpoint<
  const TMethod extends Methods,
  const TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  const TFields extends UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  >,
  const TEvents extends EndpointEventsMap<
    InferResponseOutput<TFields>,
    InferRequestOutput<TFields>,
    InferUrlVariablesOutput<TFields>,
    TEvents
  > = EndpointEventsMapBase,
  const TChannel extends ChannelDeclaration | undefined = undefined,
>(
  config: ApiEndpoint<TMethod, TUserRoleValue, TScopedTranslationKey, TFields> &
    Required<
      Pick<
        ApiEndpoint<TMethod, TUserRoleValue, TScopedTranslationKey, TFields>,
        "scopedTranslation"
      >
    > &
    ChannelConfigField<
      InferResponseOutput<TFields>,
      InferRequestOutput<TFields>,
      InferUrlVariablesOutput<TFields>,
      TEvents,
      TChannel
    >,
): CreateEndpointReturnInMethod<
  TMethod,
  TUserRoleValue,
  TScopedTranslationKey,
  TFields,
  TEvents,
  TChannel
> {
  return buildEndpoint<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields,
    TEvents,
    TChannel
  >(config, config.scopedTranslation);
}
