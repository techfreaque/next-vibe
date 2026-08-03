"use client";

import type { EndpointLogger } from "../../../logger/types";
import { useContext } from "react";

import { LoggerContext } from "./logger-provider";

export function useLogger(): EndpointLogger {
  const logger = useContext(LoggerContext);
  if (!logger) {
    // oxlint-disable-next-line restricted/restricted-syntax
    throw new Error("useLogger must be used inside LoggerProvider");
  }
  return logger;
}
