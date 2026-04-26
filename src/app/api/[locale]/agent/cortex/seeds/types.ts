/**
 * Cortex Seed Types
 *
 * Types for all cortex seed items - memory scaffolds and document templates.
 * Each item gets its own .ts file + sibling .embedding.ts.
 *
 * `userRole` - optional role filter. If set, only seeded for users with that role.
 * Undefined = seeded for all authenticated users.
 *
 * Seed policies:
 *   seedOnlyNew        - written once, never overwritten if body > 100 chars.
 *   updateIfUnchanged  - updated when system content changes, only if user hasn't customized.
 *                        Detected via `template-hash` frontmatter field.
 */

import type { UserPermissionRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

export interface CortexSeedItem {
  /** Stable unique ID - used for update tracking and deduplication */
  id: string;

  /** Cortex path for this file, e.g. "/memories/identity/name.md" */
  path: string;

  /** Full markdown content (frontmatter + body) */
  content: string;

  /**
   * Which user role this item is seeded for.
   * undefined = all authenticated users. Use UserPermissionRole.ADMIN etc.
   */
  userRole?: typeof UserPermissionRoleValue;

  /**
   * Seed policy: only create, never update.
   * Use for /memories/ files - user content is sacred once written.
   */
  seedOnlyNew?: boolean;

  /**
   * Seed policy: update if user hasn't customized.
   * Detected via `template-hash` frontmatter field written at seed time.
   * Use for /documents/templates/ - system templates can improve over time.
   */
  updateIfUnchanged?: boolean;
}

/** Embedding data - lives in sibling .embedding.ts, written by `vibe gen` */
export interface CortexSeedEmbedding {
  /** Must match the path in the sibling .ts file */
  path: string;
  /** SHA-256 of (path + content). Written by `vibe gen`. */
  embeddingHash: string;
  /** Pre-computed 3072-dim embedding. Written by `vibe gen`. */
  // prettier-ignore
  embedding: number[];
}

export interface CortexSeedEntry {
  item: CortexSeedItem;
  embedding: CortexSeedEmbedding | undefined;
}
