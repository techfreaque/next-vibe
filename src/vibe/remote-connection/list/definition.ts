/**
 * Remote Connection List API Definition
 * GET - list all remote connections for the current user
 * Admin users see all connections across all users
 */

import { z } from "zod";

import { createEndpoint } from "../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../core/definition/enums";
import { UserRole } from "../../identity/roles/enum";
import { lazyWidget } from "../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "../../unified-ui/_shared/utils-i18n";
import { analyticsWindowFields } from "../../unified-ui/analytics/fields";
import {
  analyticsWindowSchema,
  breakdownSchema,
  kpiSchema,
  timeSeriesSchema,
} from "../../unified-ui/analytics/schema";
import {
  ConnectionHealthSchema,
  RemoteConnectionAuditActionSchema,
  SyncScopeSchema,
  TransportModeSchema,
} from "../db";
import { CONNECTION_ISSUES, LOOP_LOCATIONS } from "../health-types";
import { REMOTE_CONNECTIONS_ALIAS } from "./constants";
import { FleetStatusFilter, FleetStatusFilterOptions } from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * Admin fleet health report: every peer connection on this instance (all
 * owners), stored state only. Null for non-admins.
 */
const fleetSchema = z
  .object({
    window: analyticsWindowSchema,
    localCapabilitiesVersion: z.string(),
    /** This instance's own label (names "us" in mismatch messages). */
    selfInstanceId: z.string(),
    counts: z.object({
      total: z.number(),
      active: z.number(),
      healthy: z.number(),
      warning: z.number(),
      critical: z.number(),
      disconnected: z.number(),
      unhealthy: z.number(),
    }),
    rows: z.array(
      z.object({
        id: z.string(),
        instanceId: z.string(),
        ownerUserId: z.string(),
        ownerEmail: z.string(),
        ownerName: z.string(),
        ownerIsAdmin: z.boolean(),
        isMine: z.boolean(),
        remoteUrl: z.string(),
        status: ConnectionHealthSchema,
        issues: z.array(z.enum(CONNECTION_ISSUES)),
        isActive: z.boolean(),
        isReverseEntry: z.boolean(),
        hasToken: z.boolean(),
        transportMode: TransportModeSchema,
        remoteTransportMode: TransportModeSchema,
        lastTransportUsed: TransportModeSchema.nullable(),
        lastTransportUsedAt: z.string().nullable(),
        wsConnectedAt: z.string().nullable(),
        lastSyncedAt: z.string().nullable(),
        lastContactAt: z.string().nullable(),
        /** Latest "disconnected" audit event (serving side) for this row. */
        lastDisconnectAt: z.string().nullable(),
        capabilitiesCount: z.number(),
        capabilitiesVersion: z.string().nullable(),
        sentCapabilitiesVersion: z.string().nullable(),
        isInferenceProvider: z.boolean(),
        forceSystemProvider: z.boolean(),
        syncScope: SyncScopeSchema,
        loopLocation: z.enum(LOOP_LOCATIONS),
        createdAt: z.string(),
        /** The other side's row when both live in this DB (else null). */
        pairedPeer: z
          .object({
            instanceId: z.string(),
            transportMode: TransportModeSchema,
            remoteTransportMode: TransportModeSchema,
          })
          .nullable(),
        /** Latest denied / rate-limited audit event for this owner + instance. */
        lastDenial: z
          .object({
            action: RemoteConnectionAuditActionSchema,
            reason: z.string().nullable(),
            createdAt: z.string(),
          })
          .nullable(),
      }),
    ),
    audit: z.object({
      events: kpiSchema,
      failures: kpiSchema,
      trend: timeSeriesSchema,
      byReason: breakdownSchema,
      recent: z.array(
        z.object({
          id: z.string(),
          createdAt: z.string(),
          action: RemoteConnectionAuditActionSchema,
          reason: z.string().nullable(),
          instanceId: z.string().nullable(),
          ownerEmail: z.string(),
        }),
      ),
    }),
  })
  .nullable();

const RemoteConnectionsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.RemoteConnectionsListContainer,
  })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "remote-connection", "list"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "link",
  category: "devTools",
  subCategory: "remoteInstances",
  // Customers list their own connections (user-scoped) and learn whether
  // their account may connect one (canConnect).
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,
  tags: ["tags.remoteConnection" as const],
  aliases: [REMOTE_CONNECTIONS_ALIAS] as const,

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  fields: customWidgetObject({
    render: RemoteConnectionsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      activeOnly: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.activeOnly.label",
        description: "get.fields.activeOnly.description",
        hidden: true,
        schema: z.boolean().optional(),
      }),
      ...analyticsWindowFields,
      // Existing callers may omit the analytics fields and use their defaults.
      range: {
        ...analyticsWindowFields.range,
        schema: analyticsWindowFields.range.schema.optional(),
      },
      granularity: {
        ...analyticsWindowFields.granularity,
        schema: analyticsWindowFields.granularity.schema.optional(),
      },
      fleetStatus: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.fleetStatus.label",
        description: "get.fields.fleetStatus.description",
        options: FleetStatusFilterOptions,
        hidden: true,
        schema: z.enum(FleetStatusFilter).optional(),
      }),
      fleet: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: fleetSchema,
      }),
      connections: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            instanceId: z.string(),
            remoteUrl: z.string(),
            /** Local instance URL - set on cloud-side records for direct embedding via vibe-frame */
            localUrl: z.string().nullable(),
            isActive: z.boolean(),
            isInferenceProvider: z.boolean(),
            lastSyncedAt: z.string().nullable(),
            wsConnectedAt: z.string().nullable().optional(),
            hasToken: z.boolean(),
            requiresReauth: z.boolean(),
            healthStatus: ConnectionHealthSchema,
            /** True for incoming connections (cloud-side reverse entries) */
            isReverseEntry: z.boolean(),
            /** How WE reach the peer (our send leg). */
            transportMode: TransportModeSchema.nullable(),
            /** How the PEER reaches us (mirror of the peer's transportMode). */
            remoteTransportMode: TransportModeSchema.nullable(),
          }),
        ),
      }),
      selfInstanceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      syncEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean().nullable(),
      }),
      hasInferenceProvider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
      // Whether THIS account may connect its own instance here (admins:
      // always; customers: paid account) and how many it may connect.
      access: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.object({
          canConnect: z.boolean(),
          maxConnections: z.number().nullable(),
        }),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
  },

  examples: {
    requests: { default: {} },
    responses: {
      default: {
        fleet: {
          window: {
            from: "2026-10-22",
            to: "2026-11-21",
            previousFrom: "2026-09-22",
            previousTo: "2026-10-22",
            bucket: "day",
          },
          localCapabilitiesVersion: "7f6bd2bbbcdb",
          selfInstanceId: "thea",
          counts: {
            total: 2,
            active: 1,
            healthy: 1,
            warning: 0,
            critical: 0,
            disconnected: 1,
            unhealthy: 0,
          },
          rows: [
            {
              id: "5f0c7c1e-0000-4000-8000-000000000001",
              instanceId: "hermes",
              ownerUserId: "5f0c7c1e-0000-4000-8000-0000000000aa",
              ownerEmail: "owner@example.com",
              ownerName: "owner",
              ownerIsAdmin: false,
              isMine: false,
              remoteUrl: "https://hermes.example.invalid",
              status: "healthy",
              issues: [],
              isActive: true,
              isReverseEntry: true,
              hasToken: true,
              transportMode: "reverse-ws",
              remoteTransportMode: "direct-http",
              lastTransportUsed: "reverse-ws",
              lastTransportUsedAt: "2026-11-21T11:58:00.000Z",
              wsConnectedAt: null,
              lastSyncedAt: "2026-11-21T11:50:00.000Z",
              lastContactAt: "2026-11-21T11:58:00.000Z",
              lastDisconnectAt: null,
              capabilitiesCount: 140,
              capabilitiesVersion: "3.3.3",
              sentCapabilitiesVersion: null,
              isInferenceProvider: false,
              forceSystemProvider: false,
              syncScope: {
                memories: true,
                documents: true,
                skills: true,
                favorites: true,
                threads: false,
              },
              loopLocation: "target",
              createdAt: "2026-11-01T09:00:00.000Z",
              pairedPeer: null,
              lastDenial: null,
            },
          ],
          audit: {
            events: { value: 4, previous: 2 },
            failures: { value: 1, previous: 0 },
            trend: {
              buckets: ["2026-11-20", "2026-11-21"],
              series: [
                { key: "registered", values: [1, 2] },
                { key: "denied", values: [0, 1] },
              ],
            },
            byReason: [
              { key: "registered", metrics: { events: 3 } },
              { key: "denied:sync:notPaid", metrics: { events: 1 } },
            ],
            recent: [
              {
                id: "5f0c7c1e-0000-4000-8000-0000000000b1",
                createdAt: "2026-11-21T10:00:00.000Z",
                action: "denied",
                reason: "sync:notPaid",
                instanceId: "laptop",
                ownerEmail: "owner@example.com",
              },
            ],
          },
        },
        connections: [
          {
            instanceId: "hermes",
            remoteUrl: "https://unbottled.ai",
            localUrl: null,
            isActive: true,
            isInferenceProvider: true,
            lastSyncedAt: "2026-03-01T12:00:00.000Z",
            wsConnectedAt: "2026-03-01T11:00:00.000Z",
            hasToken: true,
            requiresReauth: false,
            healthStatus: "healthy",
            isReverseEntry: true,
            transportMode: "reverse-ws",
            remoteTransportMode: "direct-http",
          },
        ],
        selfInstanceId: "atlas",
        syncEnabled: false,
        hasInferenceProvider: false,
        access: { canConnect: true, maxConnections: 3 },
      },
      disconnected: {
        fleet: null,
        connections: [
          {
            instanceId: "audit-preview-peer",
            remoteUrl: "https://preview.example.invalid",
            localUrl: null,
            isActive: false,
            isInferenceProvider: false,
            lastSyncedAt: "2026-11-19T08:25:00.000Z",
            wsConnectedAt: null,
            hasToken: true,
            requiresReauth: false,
            healthStatus: "disconnected",
            isReverseEntry: true,
            transportMode: "reverse-ws",
            remoteTransportMode: "direct-http",
          },
          {
            instanceId: "audit-preview-http",
            remoteUrl: "https://http.example.invalid",
            localUrl: null,
            isActive: true,
            isInferenceProvider: false,
            lastSyncedAt: "2026-11-19T08:30:00.000Z",
            wsConnectedAt: null,
            hasToken: true,
            requiresReauth: false,
            healthStatus: "healthy",
            isReverseEntry: false,
            transportMode: "direct-http",
            remoteTransportMode: "direct-http",
          },
        ],
        selfInstanceId: "atlas",
        syncEnabled: false,
        hasInferenceProvider: false,
        access: { canConnect: true, maxConnections: null },
      },
    },
  },
});

export type RemoteConnectionsListRequestOutput = typeof GET.types.RequestOutput;
export type RemoteConnectionsListResponseOutput =
  typeof GET.types.ResponseOutput;
export type RemoteConnection =
  RemoteConnectionsListResponseOutput["connections"][number];

const endpoints = { GET } as const;
export default endpoints;
