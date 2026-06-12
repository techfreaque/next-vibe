"use client";

import { useContext } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { LoggerContext } from "./logger-provider";

export function useLogger(): EndpointLogger {
  const logger = useContext(LoggerContext);
  if (!logger) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("useLogger must be used inside LoggerProvider");
  }
  return logger;
}
