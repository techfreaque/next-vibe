export const translations = {
  category: "Infrastructure",
  type: "Infrastructure",

  enums: {
    infraStatus: {
      pending: "Pending",
      provisioning: "Provisioning",
      ready: "Ready",
      degraded: "Degraded",
      error: "Error",
    },
    componentStatus: {
      unknown: "Unknown",
      healthy: "Healthy",
      degraded: "Degraded",
      down: "Down",
    },
    scaleComponent: {
      web: "Web (Next.js)",
      tasks: "Task Runner",
      storage: "Storage (MinIO)",
    },
  },

  errors: {
    noControlPlane:
      "No SSH connection tagged as control-plane. Tag a server in SSH settings first.",
    noClusterNodes:
      "No SSH connections tagged as cluster nodes. Tag at least one server as control-plane.",
    kubeconfigMissing: "Kubeconfig not found. Run cluster-init first.",
    pulumiNotInstalled:
      "Pulumi CLI not installed. Install it with: curl -fsSL https://get.pulumi.com | sh",
    sshExecFailed: "SSH command failed on node",
    k3sInstallFailed: "k3s installation failed",
    scaleTargetNotFound: "Deployment not found in cluster",
    connectionNotFound: "SSH connection not found",
    encryptionFailed: "Credential decryption failed",
    connectTimeout: "SSH connection timed out",
    sshAuthFailed: "SSH authentication failed",
    sshConnectionFailed: "SSH connection failed",
    fingerprintMismatch: "SSH host key fingerprint mismatch",
  },

  cluster: {
    init: {
      post: {
        title: "Initialize Cluster",
        titleShort: "Init Cluster",
        description:
          "Provision k3s on tagged SSH servers. Installs k3s, databases, Redis, MinIO, and ingress.",
        container: { title: "Cluster Init" },
        fields: {
          clusterName: {
            label: "Cluster Name",
            description:
              "Name for this cluster (used in kubeconfig and labels)",
            placeholder: "next-vibe-prod",
          },
          domain: {
            label: "Domain",
            description:
              "Base domain for ingress (e.g. example.com → app.example.com)",
            placeholder: "example.com",
          },
          email: {
            label: "Email",
            description: "Contact email for Let's Encrypt TLS certificates",
            placeholder: "admin@example.com",
          },
          k3sVersion: {
            label: "k3s Version",
            description: "k3s release to install",
            placeholder: "v1.31.0+k3s1",
          },
          dryRun: {
            label: "Dry Run",
            description:
              "Preview what would be installed without making changes",
          },
          skipDatabase: {
            label: "Skip Database",
            description: "Skip CloudNativePG PostgreSQL installation",
          },
          skipRedis: {
            label: "Skip Redis",
            description: "Skip Redis Sentinel installation",
          },
          skipStorage: {
            label: "Skip Storage",
            description: "Skip MinIO distributed storage installation",
          },
          skipIngress: {
            label: "Skip Ingress",
            description: "Skip nginx-ingress and cert-manager installation",
          },
        },
        response: {
          success: { title: "Success" },
          message: { title: "Message" },
          nodesProvisioned: { title: "Nodes Provisioned" },
          componentsInstalled: { title: "Components Installed" },
          kubeconfig: { title: "Kubeconfig" },
          duration: { title: "Duration (ms)" },
        },
        success: {
          title: "Cluster ready",
          description: "k3s cluster provisioned successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid cluster configuration",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Admin access required",
          },
          server: {
            title: "Provisioning Failed",
            description: "Cluster initialization failed",
          },
          notFound: {
            title: "No Nodes Found",
            description: "No SSH connections tagged as cluster nodes",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: {
            title: "Conflict",
            description: "Cluster already exists or is being provisioned",
          },
          network: {
            title: "Network Error",
            description: "Could not reach cluster nodes",
          },
        },
      },
    },
    status: {
      get: {
        title: "Cluster Status",
        titleShort: "Cluster Status",
        description: "Show k8s node health, pod counts, and component status",
        container: { title: "Cluster Status" },
        response: {
          nodes: { title: "Nodes" },
          components: { title: "Components" },
          overallStatus: { title: "Overall Status" },
          podCounts: { title: "Pod Counts" },
        },
        success: {
          title: "Status retrieved",
          description: "Cluster status retrieved successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Admin access required",
          },
          server: {
            title: "Server Error",
            description: "Failed to get cluster status",
          },
          notFound: {
            title: "No Cluster",
            description: "No cluster configured. Run cluster-init first.",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: { title: "Conflict", description: "A conflict occurred" },
          network: {
            title: "Network Error",
            description: "Could not reach cluster",
          },
        },
      },
    },
  },

  deploy: {
    push: {
      post: {
        title: "Deploy",
        titleShort: "Deploy",
        description: "Apply infrastructure changes via Pulumi (pulumi up)",
        container: { title: "Deploy" },
        fields: {
          stack: {
            label: "Stack",
            description: "Pulumi stack name",
            placeholder: "prod",
          },
          skipPreview: {
            label: "Skip Preview",
            description: "Apply changes without showing a preview first",
          },
        },
        response: {
          success: { title: "Success" },
          message: { title: "Message" },
          changes: { title: "Changes" },
          duration: { title: "Duration (ms)" },
        },
        success: {
          title: "Deployed",
          description: "Infrastructure deployed successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid deploy configuration",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Admin access required",
          },
          server: {
            title: "Deploy Failed",
            description: "Pulumi up failed",
          },
          notFound: {
            title: "No Cluster",
            description: "No cluster configured",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: {
            title: "Conflict",
            description: "A deploy is already in progress",
          },
          network: {
            title: "Network Error",
            description: "Could not reach cluster",
          },
        },
      },
    },
    preview: {
      post: {
        title: "Deploy Preview",
        titleShort: "Preview",
        description:
          "Preview infrastructure changes without applying them (pulumi preview)",
        container: { title: "Deploy Preview" },
        fields: {
          stack: {
            label: "Stack",
            description: "Pulumi stack name",
            placeholder: "prod",
          },
        },
        response: {
          success: { title: "Success" },
          message: { title: "Message" },
          preview: { title: "Preview" },
          duration: { title: "Duration (ms)" },
        },
        success: {
          title: "Preview ready",
          description: "Preview generated successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid configuration",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Admin access required",
          },
          server: {
            title: "Preview Failed",
            description: "Pulumi preview failed",
          },
          notFound: {
            title: "No Cluster",
            description: "No cluster configured",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: { title: "Conflict", description: "A conflict occurred" },
          network: {
            title: "Network Error",
            description: "Could not reach cluster",
          },
        },
      },
    },
  },

  scale: {
    replicas: {
      post: {
        title: "Scale",
        titleShort: "Scale",
        description: "Scale a deployment in the cluster",
        container: { title: "Scale Deployment" },
        fields: {
          component: {
            label: "Component",
            description: "Which deployment to scale",
          },
          replicas: {
            label: "Replicas",
            description: "Target replica count (0 = pause)",
            placeholder: "2",
          },
        },
        response: {
          success: { title: "Success" },
          message: { title: "Message" },
          previousReplicas: { title: "Previous Replicas" },
          newReplicas: { title: "New Replicas" },
        },
        success: {
          title: "Scaled",
          description: "Deployment scaled successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid scale parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Admin access required",
          },
          server: {
            title: "Scale Failed",
            description: "Failed to scale deployment",
          },
          notFound: {
            title: "Deployment Not Found",
            description: "Deployment not found in cluster",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: { title: "Conflict", description: "A conflict occurred" },
          network: {
            title: "Network Error",
            description: "Could not reach cluster",
          },
        },
      },
    },
  },
};
