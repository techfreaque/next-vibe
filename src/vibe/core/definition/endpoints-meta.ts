/**
 * Canonical shape of a generated endpoint-meta entry.
 *
 * This is the single declaration of `EndpointMeta`. It is imported by:
 *  - the generator (generator/generator-endpoints-meta.ts) that builds the entries
 *  - the generated locale files themselves (src/generated/endpoints/meta/*.ts)
 *  - every consumer that reads them (help-tool, agent/chat, ...)
 *
 * Previously this interface was declared three times (generator, generator emit
 * template, help-tool/repository.ts) and had already drifted: the generator said
 * `icon: string` / `allowedRoles: string[]` while help-tool said `icon: IconKey`,
 * forcing an `as EndpointMeta[]` cast at the read site to bridge the two.
 *
 * `allowedRoles` is typed `UserRoleValue[]`, which is what the generator actually
 * emits: the values are the role enum's runtime values (e.g. "enums.userRole.admin").
 * Typing it as `string[]` made permissionsRegistry's typed API uncallable from meta
 * and forced callers into casts or hand-rolled re-implementations.
 *
 * Imports here are type-only and erased at build time, so the generated locale
 * files stay pure data at runtime - safe to import on any platform, client included.
 */

import type { WidgetData } from "../utils/json";
import type { UserRoleValue } from "../../identity/roles/enum";
import type { IconKey } from "../../unified-ui/widgets/form-fields/icon-field/icons";

export interface EndpointMeta {
  /** Full tool name: path segments joined by "_" + "_" + METHOD */
  toolName: string;
  method: string;
  /** Original path segments array from the definition */
  path: string[];
  /**
   * Roles and platform markers from the definition, verbatim.
   * Pass straight to permissionsRegistry.checkPlatformAccess / checkRolePermission.
   */
  allowedRoles: UserRoleValue[];
  aliases: string[];
  /** Pre-translated at generation time */
  title: string;
  /** Pre-translated short title at generation time */
  titleShort: string;
  /** Pre-translated at generation time */
  description: string;
  icon: IconKey;
  /** Pre-translated category label at generation time */
  category: string;
  /** Pre-translated sub-category label at generation time (optional) */
  subCategory: string;
  /** Pre-translated tags at generation time */
  tags: string[];
  /** Credit cost (only present when > 0) */
  credits?: number;
  /** Whether the tool requires user confirmation before execution */
  requiresConfirmation?: boolean;
  /** Roles for which this tool is AI-pinned by default (overridable per-favorite) */
  defaultAiPinned?: string[];
  /** Roles for which this tool is web-sidebar-pinned by default (overridable per-user) */
  defaultWebPinned?: string[];
  /** Example inputs/responses from the definition */
  examples?: {
    inputs?: Record<string, Record<string, WidgetData>>;
    responses?: Record<string, Record<string, WidgetData>>;
  };
}
