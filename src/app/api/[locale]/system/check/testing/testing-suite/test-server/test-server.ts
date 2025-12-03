/* global NodeJS */

import type { Server } from "node:http";
import { createServer } from "node:http";
import { cwd } from "node:process";
import { parse } from "node:url";

import next from "next";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";

// Server state (singleton)
let app: ReturnType<typeof next> | undefined;
let server: Server | undefined;

/**
 * Starts the Next.js test server on a random available port if preferred port is in use
 */
export async function startServer(logger: EndpointLogger): Promise<void> {
  // If server is already running, just return the URL
  if (server) {
    return;
  }

  try {
    logger.debug(
      `Starting test server on ${env.NEXT_PUBLIC_TEST_SERVER_URL}:4000`,
    );

    app = next({
      dev: true,
      dir: cwd(),
      quiet: false, // Enable to see more details
    });

    await app.prepare();

    const handle = app.getRequestHandler();

    return await new Promise((resolve, reject) => {
      // Try with preferred port first, but fall back to a random port if needed
      server = createServer((req, res) => {
        const parsedUrl = parse(req.url ?? "", true);
        void handle(req, res, parsedUrl);
      });

      server.once("error", (err: NodeJS.ErrnoException) => {
        logger.error("Server startup error:", err);

        // If the port is in use, try again with a random port
        if (err.code === "EADDRINUSE") {
          logger.debug(
            `Port ${env.NEXT_PUBLIC_TEST_SERVER_URL} is in use, not starting again...`,
          );
          return;
        }

        // eslint-disable-next-line i18next/no-literal-string
        reject(new Error(`Failed to start server: ${err.message}`));
      });
      const port = env.NEXT_PUBLIC_TEST_SERVER_URL.split(":")[1];
      server.listen(port, () => {
        logger.debug(
          `> E2E test server started on ${env.NEXT_PUBLIC_TEST_SERVER_URL}`,
        );
        resolve();
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", parseError(error));
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Test infrastructure can throw errors
    throw error;
  }
}

/**
 * Stops the test server
 * This is designed to be called once from global-teardown
 */
export async function stopServer(logger: EndpointLogger): Promise<void> {
  return await new Promise((resolve) => {
    if (!server) {
      logger.debug("Server is not running, nothing to stop");
      resolve();
      return;
    }

    logger.debug("Attempting to close test server...");
    server.close((err) => {
      if (err) {
        logger.error("Error closing server:", err);
        // Resolve anyway since we're shutting down
      }

      logger.debug("> E2E test server closed");
      server = undefined;
      app = undefined;

      // Add a small delay to ensure all connections are properly closed
      setTimeout(() => {
        resolve();
      }, 100);
    });
  });
}
