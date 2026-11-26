/**
 * Shape of one node in a seeded chart of accounts template.
 * Structurally identical to the interface in ../seeds.ts.
 */

import type { AccountSubtype, AccountType } from "../enum";

export interface TemplateNodeDef {
  code: string;
  name: string;
  nameDe?: string;
  namePl?: string;
  type: (typeof AccountType)[keyof typeof AccountType];
  subtype: (typeof AccountSubtype)[keyof typeof AccountSubtype];
  parentCode?: string;
  isPostable: boolean;
  sortOrder: number;
}
