/**
 * k3s shell script templates for SSH execution.
 * All scripts are idempotent - safe to run multiple times.
 */

/** Check if k3s is already installed */
export const CHECK_K3S = `which k3s && k3s --version || echo "NOT_INSTALLED"`;

/** Install k3s server (control-plane) */
export function installK3sServer(version: string, clusterName: string): string {
  return `
set -e
export INSTALL_K3S_VERSION="${version}"
export K3S_CLUSTER_INIT=true
curl -sfL https://get.k3s.io | sh -s - server \
  --cluster-init \
  --node-label="next-vibe.io/cluster=${clusterName}" \
  --node-label="next-vibe.io/role=control-plane"
systemctl enable k3s
systemctl start k3s
# Wait for node to be ready
timeout 120 sh -c 'until k3s kubectl get nodes | grep -q " Ready"; do sleep 2; done'
echo "K3S_READY"
`.trim();
}

/** Read node token from control-plane */
export const READ_NODE_TOKEN = `cat /var/lib/rancher/k3s/server/node-token`;

/** Read kubeconfig from control-plane */
export const READ_KUBECONFIG = `cat /etc/rancher/k3s/k3s.yaml`;

/** Install k3s agent (worker node) */
export function installK3sAgent(
  version: string,
  controlPlaneIp: string,
  nodeToken: string,
  clusterName: string,
  role: "worker" | "storage",
): string {
  return `
set -e
export INSTALL_K3S_VERSION="${version}"
export K3S_URL="https://${controlPlaneIp}:6443"
export K3S_TOKEN="${nodeToken}"
curl -sfL https://get.k3s.io | sh -s - agent \
  --node-label="next-vibe.io/cluster=${clusterName}" \
  --node-label="next-vibe.io/role=${role}"
systemctl enable k3s-agent
systemctl start k3s-agent
echo "K3S_AGENT_READY"
`.trim();
}

/** Patch kubeconfig to use external IP instead of 127.0.0.1 */
export function patchKubeconfig(
  kubeconfig: string,
  externalIp: string,
): string {
  return kubeconfig.replaceAll(
    /https?:\/\/127\.0\.0\.1/g,
    `https://${externalIp}`,
  );
}

/** Run kubectl command on control-plane */
export function kubectl(cmd: string): string {
  return `k3s kubectl ${cmd}`;
}

/** Get node status */
export const GET_NODES = `k3s kubectl get nodes -o json`;

/** Scale a deployment */
export function scaleDeployment(
  namespace: string,
  name: string,
  replicas: number,
): string {
  return `k3s kubectl scale deployment ${name} -n ${namespace} --replicas=${replicas} && k3s kubectl get deployment ${name} -n ${namespace} -o jsonpath='{.spec.replicas}'`;
}

/** Get current replica count */
export function getReplicaCount(namespace: string, name: string): string {
  return `k3s kubectl get deployment ${name} -n ${namespace} -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "NOT_FOUND"`;
}
