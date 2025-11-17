/**
 * @deprecated This file has been replaced by the repository pattern.
 * Please use leadAuthRepository from "./auth/repository" instead.
 *
 * The old lead auth service used isPrimary flags and leadLinks tables
 * which have been removed in favor of the wallet-based credit system.
 *
 * Migration: Import { leadAuthRepository } from "./auth/repository"
 */

// This file is intentionally empty - functionality moved to ./auth/repository.ts
// eslint-disable-next-line eslint-plugin-unicorn/require-module-specifiers
export {};
