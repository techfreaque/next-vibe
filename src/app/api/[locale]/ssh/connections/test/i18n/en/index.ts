export const translations = {
  category: "SSH",

  errors: {
    connectionNotFound: "Connection not found",
    encryptionFailed: "Encryption failed - SSH_SECRET_KEY may be invalid",
    connectTimeout: "Connection timed out",
    sshAuthFailed: "SSH authentication failed",
    sshConnectionFailed: "SSH connection failed",
    fingerprintMismatch:
      "Host fingerprint has changed. Potential MITM attack. Use acknowledgeNewFingerprint=true to proceed.",
    notImplemented: {
      test: "SSH backend not yet implemented. Cannot test remote connections yet.",
    },
  },

  post: {
    title: "Test SSH Connection",
    description: "Test connectivity to an SSH server",
    fields: {
      connectionId: {
        label: "Connection ID",
        description: "SSH connection to test",
        placeholder: "",
      },
      acknowledgeNewFingerprint: {
        label: "Acknowledge New Fingerprint",
        description: "Accept fingerprint change",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: { title: "Forbidden", description: "No permission" },
      server: { title: "Server Error", description: "Test failed" },
      notFound: { title: "Not Found", description: "Connection not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: { title: "Unsaved Changes" },
      conflict: {
        title: "Fingerprint Changed",
        description: "Server fingerprint has changed since last connection",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the SSH server",
      },
      timeout: { title: "Timeout", description: "Connection timed out" },
    },
    success: {
      title: "Connection Successful",
      description: "SSH connection test passed",
    },
  },
  widget: {
    title: "Test Connection",
    testButton: "Test Now",
    testing: "Testing...",
    successLabel: "Connected",
    failedLabel: "Failed",
    latencyLabel: "Latency",
    fingerprintLabel: "Fingerprint",
  },
};
