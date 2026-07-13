import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";

import type { ClientT } from "@/ssh/client";
import {
  getConnectionCredentials,
  openSshClient,
  sshExecCommand,
} from "@/ssh/client";
import type { SshConnection } from "@/ssh/db";

/**
 * Install nginx-ingress-controller + cert-manager + Let's Encrypt ClusterIssuer.
 */

function buildIngressInstall(email: string): string {
  return `
set -e
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
which helm || (curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash)

# nginx-ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx --force-update
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=NodePort \
  --set controller.service.nodePorts.http=80 \
  --set controller.service.nodePorts.https=443 \
  --wait \
  --timeout 5m

# cert-manager
helm repo add jetstack https://charts.jetstack.io --force-update
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true \
  --wait \
  --timeout 5m

# Let's Encrypt ClusterIssuer
cat <<EOF | k3s kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ${email}
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
EOF

echo "INGRESS_READY"
`.trim();
}

export async function installIngress(
  controlPlaneNode: SshConnection,
  email: string,
  t: ClientT,
): Promise<ResponseType<{ installed: boolean; message: string }>> {
  try {
    const creds = await getConnectionCredentials(
      controlPlaneNode.id,
      controlPlaneNode.userId,
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

    const script = buildIngressInstall(email);
    const result = await sshExecCommand(client, script, 600000); // 10 min

    client.end();

    if (result.exitCode !== 0 || !result.stdout.includes("INGRESS_READY")) {
      return fail({
        message: t("errors.sshConnectionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success({
      installed: true,
      message: `nginx-ingress + cert-manager installed. Let's Encrypt issuer configured for ${email}`,
    });
  } catch (error) {
    void parseError(error);
    return fail({
      message: t("errors.sshConnectionFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
