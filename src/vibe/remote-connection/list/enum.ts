/**
 * Fleet health filter for the remote connections report.
 */

import { createEnumOptions } from "../../unified-ui/_shared/enum";
import { scopedTranslation } from "./i18n";

export const {
  enum: FleetStatusFilter,
  options: FleetStatusFilterOptions,
  Value: FleetStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.fleetStatus.all",
  UNHEALTHY: "enums.fleetStatus.unhealthy",
  CRITICAL: "enums.fleetStatus.critical",
  WARNING: "enums.fleetStatus.warning",
  DISCONNECTED: "enums.fleetStatus.disconnected",
  HEALTHY: "enums.fleetStatus.healthy",
});

export const FleetStatusFilterDB = [
  FleetStatusFilter.ALL,
  FleetStatusFilter.UNHEALTHY,
  FleetStatusFilter.CRITICAL,
  FleetStatusFilter.WARNING,
  FleetStatusFilter.DISCONNECTED,
  FleetStatusFilter.HEALTHY,
] as const;
