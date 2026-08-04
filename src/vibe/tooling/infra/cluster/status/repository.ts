import "server-only";

import { eq } from "drizzle-orm";

import {
  getConnectionCredentials,
  openSshClient,
  sshExecCommand,
} from "@/ssh/client";
import { sshConnections } from "@/ssh/db";
import { ClusterRole } from "@/ssh/enum";

import type { ResponseType } from "../../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../../core/route/response.schema";
import { parseError } from "../../../../core/utils/parse-error";
import { db } from "../../../../database";
import type { EndpointLogger } from "../../../../logger/types";
import type { InfraT } from "../../i18n";
import type { ClusterStatusResponseOutput } from "./definition";

const GET_NODES_JSON = `k3s kubectl get nodes -o json 2>/dev/null`;
const GET_PODS_BY_NS = `k3s kubectl get pods --all-namespaces --no-headers 2>/dev/null | awk '{print $1}' | sort | uniq -c`;
const CHECK_COMPONENT = (ns: string, label: string): string =>
  `k3s kubectl get pods -n ${ns} -l ${label} --no-headers 2>/dev/null | awk '{print $4}' | head -1`;

export class ClusterStatusRepository {
  static async get(
    logger: EndpointLogger,
    t: InfraT,
  ): Promise<ResponseType<ClusterStatusResponseOutput>> {
    try {
      // Find a control-plane node
      const [controlPlane] = await db
        .select()
        .from(sshConnections)
        .where(eq(sshConnections.clusterRole, ClusterRole.CONTROL_PLANE))
        .limit(1);

      if (!controlPlane) {
        return fail({
          message: t("errors.noControlPlane"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const creds = await getConnectionCredentials(
        controlPlane.id,
        controlPlane.userId,
        t,
      );
      if (!creds.success) {
        return fail({
          message: creds.message,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const clientResult = await openSshClient(creds.data, t);
      if (!clientResult.success) {
        return fail({
          message: clientResult.message,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const { client } = clientResult.data;

      // Get nodes
      const nodesResult = await sshExecCommand(client, GET_NODES_JSON, 15000);

      const nodes: ClusterStatusResponseOutput["nodes"] = [];
      let overallStatus = "Unknown";

      if (nodesResult.stdout.trim()) {
        try {
          const parsed = JSON.parse(nodesResult.stdout) as {
            items: Array<{
              metadata: { name: string; labels: Record<string, string> };
              status: {
                conditions: Array<{ type: string; status: string }>;
                addresses: Array<{ type: string; address: string }>;
              };
            }>;
          };
          for (const node of parsed.items) {
            const readyCondition = node.status.conditions.find(
              (c) => c.type === "Ready",
            );
            const isReady = readyCondition?.status === "True";
            const isControlPlane =
              "node-role.kubernetes.io/control-plane" in node.metadata.labels ||
              "node-role.kubernetes.io/master" in node.metadata.labels;
            const ip =
              node.status.addresses?.find((a) => a.type === "InternalIP")
                ?.address ?? "";

            nodes.push({
              name: node.metadata.name,
              status: isReady ? "Ready" : "NotReady",
              role: isControlPlane ? "control-plane" : "worker",
              ip,
            });
          }

          const allReady = nodes.every((n) => n.status === "Ready");
          overallStatus =
            nodes.length === 0 ? "No nodes" : allReady ? "Ready" : "Degraded";
        } catch {
          overallStatus = "Parse error";
        }
      }

      // Get pod counts by namespace
      const podResult = await sshExecCommand(client, GET_PODS_BY_NS, 15000);

      const podCounts: Record<string, number> = {};
      if (podResult.stdout.trim()) {
        for (const line of podResult.stdout.trim().split("\n")) {
          const parts = line.trim().split(/\s+/);
          if (parts.length === 2) {
            const count = Number(parts[0]);
            const ns = parts[1];
            if (!isNaN(count) && ns) {
              podCounts[ns] = count;
            }
          }
        }
      }

      // Check key components
      const componentChecks = [
        {
          name: "postgres",
          namespace: "next-vibe",
          label: "cnpg.io/cluster=postgres",
        },
        {
          name: "redis",
          namespace: "next-vibe",
          label: "app.kubernetes.io/name=redis",
        },
        { name: "minio", namespace: "next-vibe", label: "app=minio" },
        {
          name: "ingress-nginx",
          namespace: "ingress-nginx",
          label: "app.kubernetes.io/name=ingress-nginx",
        },
        {
          name: "cert-manager",
          namespace: "cert-manager",
          label: "app=cert-manager",
        },
      ];

      const components: ClusterStatusResponseOutput["components"] = [];
      for (const check of componentChecks) {
        const result = await sshExecCommand(
          client,
          CHECK_COMPONENT(check.namespace, check.label),
          10000,
        );
        const phase = result.stdout.trim();
        components.push({
          name: check.name,
          status: phase === "Running" ? "Healthy" : phase || "Unknown",
          namespace: check.namespace,
        });
      }

      client.end();

      logger.info("cluster-status: retrieved", {
        nodes: nodes.length,
        overallStatus,
      });

      return success({
        overallStatus,
        nodes,
        components,
        podCounts,
      });
    } catch (error) {
      logger.error("cluster-status: failed", parseError(error));
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
