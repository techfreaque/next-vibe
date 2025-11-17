/**
 * @deprecated This file has been removed as part of the wallet-based credit system migration.
 *
 * The old cluster resolver used leadLinks and userLeads tables to resolve
 * "canonical" leads through complex many-to-many relationships. This approach
 * has been replaced by a simpler wallet-based system where:
 * - Each user OR lead has ONE wallet (not both)
 * - No complex lead clustering or merging is needed
 * - Lead-user relationships are tracked via userLeadLinks table
 *
 * Migration: Use wallet-based credit system via creditRepository
 */

// This file is intentionally empty - functionality no longer needed
// eslint-disable-next-line eslint-plugin-unicorn/require-module-specifiers
export {};
