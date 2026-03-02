/**
 * Bun Preload: Environment Setup
 *
 * Runs BEFORE any ES module evaluation via `bun --preload`.
 * Loads .env and applies --preview port swap to process.env so that
 * @/config/env (defineEnv) captures the correct DATABASE_URL.
 *
 * Without this, Bun's automatic .env loading sets DATABASE_URL to the
 * dev port (5432), and the env singleton freezes that value before
 * loadEnvironment() in environment.ts gets a chance to swap it.
 *
 * Used by:
 * - .mcp.json (MCP server — always targets preview DB)
 */
import { loadEnvironment } from "./environment";

loadEnvironment();
