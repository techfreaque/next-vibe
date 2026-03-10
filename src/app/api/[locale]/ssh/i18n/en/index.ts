export const translations = {
  category: "SSH",
  type: "SSH",

  enums: {
    authType: {
      password: "Password",
      privateKey: "Private Key (PEM)",
      keyAgent: "SSH Agent",
      local: "Local Machine",
    },
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "/usr/sbin/nologin",
    },
  },

  errors: {
    localModeOnly: {
      title: "Local Mode Only",
      description: "This feature is only available in LOCAL_MODE",
    },
    adminOnly: {
      title: "Admin Only",
      description: "Only admins can access machine features",
    },
    connectionNotFound: "Connection not found",
    sessionNotFound: "Session not found",
    fileNotFound: "File not found",
    directoryNotFound: "Directory not found",
    permissionDenied: "Permission denied",
    sshSecretKeyNotSet:
      "SSH_SECRET_KEY env var not set. Add a 32-byte hex value to enable SSH mode.",
    encryptionFailed: "Encryption failed — SSH_SECRET_KEY may be invalid",
    noRowReturned: "No row returned from insert",
    notImplemented: {
      test: "SSH backend not yet implemented. Cannot test remote connections yet.",
      local:
        "SSH backend not yet implemented. Leave connectionId empty to run locally.",
      fileList: "SSH backend not yet implemented for file listing",
      fileRead: "SSH backend not yet implemented for file reading",
      fileWrite: "SSH backend not yet implemented for file writing",
      session:
        "SSH PTY sessions not yet implemented. Use ssh_exec_POST for remote commands.",
    },
    fingerprintMismatch:
      "Host fingerprint has changed. Potential MITM attack. Use acknowledgeNewFingerprint=true to proceed.",
    noDefaultConnection:
      "No default SSH connection configured. Create a connection and set it as default.",
    sshConnectionFailed: "SSH connection failed",
    sshAuthFailed: "SSH authentication failed",
    connectTimeout: "Connection timed out",
    invalidWorkingDir:
      "Invalid working directory: must be absolute path without '..' segments",
    invalidPath: "Invalid path: must be absolute without '..' segments",
    parentDirNotFound:
      "Parent directory not found. Set createDirs=true to create it.",
    commandTimedOut: "Command timed out",
    cannotDeleteCurrentUser: "Cannot delete the current process user",
    cannotDeleteSystemUser: "Cannot delete system users (uid < 1000)",
    userNotFound: "User not found",
    userAlreadyExists: "User already exists",
    invalidUsername:
      "Invalid username: must be lowercase alphanumeric + hyphen, starting with a letter",
  },

  session: {
    read: {
      get: {
        title: "Read SSH Session Output",
        description: "Read buffered output from an active SSH session",
        fields: {
          sessionId: {
            label: "Session ID",
            description: "ID of the SSH session to read from",
          },
          waitMs: {
            label: "Wait (ms)",
            description: "Milliseconds to wait for output",
          },
          maxBytes: {
            label: "Max Bytes",
            description: "Maximum bytes to read",
          },
        },
        response: {
          output: { title: "Output" },
          eof: { title: "EOF" },
          status: { title: "Status" },
        },
        success: {
          title: "Session output read",
          description: "Successfully read session output",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid session read parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Failed to read session output",
          },
          notFound: {
            title: "Session Not Found",
            description: "SSH session not found",
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
            description: "Network error occurred",
          },
        },
      },
    },
    close: {
      post: {
        title: "Close SSH Session",
        description: "Close an active SSH session",
        fields: {
          sessionId: {
            label: "Session ID",
            description: "ID of the SSH session to close",
          },
        },
        response: {
          ok: { title: "Success" },
        },
        success: {
          title: "Session closed",
          description: "SSH session closed successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid session close parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Failed to close session",
          },
          notFound: {
            title: "Session Not Found",
            description: "SSH session not found",
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
            description: "Network error occurred",
          },
        },
      },
    },
    write: {
      post: {
        title: "Write to SSH Session",
        description: "Write input to an active SSH session",
        fields: {
          sessionId: {
            label: "Session ID",
            description: "ID of the SSH session to write to",
          },
          input: {
            label: "Input",
            description: "Input text to send to the session",
          },
          raw: {
            label: "Raw",
            description: "Send input as raw bytes without newline",
          },
        },
        response: {
          ok: { title: "Success" },
        },
        success: {
          title: "Input sent",
          description: "Input written to session successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid write parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Failed to write to session",
          },
          notFound: {
            title: "Session Not Found",
            description: "SSH session not found",
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
            description: "Network error occurred",
          },
        },
      },
    },
    open: {
      post: {
        title: "Open SSH Session",
        description: "Open an interactive SSH terminal session",
        fields: {
          connectionId: {
            label: "Connection ID",
            description: "ID of the SSH connection to use",
          },
          name: {
            label: "Session Name",
            description: "Optional name for the session",
          },
          cols: {
            label: "Columns",
            description: "Terminal width in columns",
          },
          rows: {
            label: "Rows",
            description: "Terminal height in rows",
          },
        },
        disconnected: "Disconnected",
        response: {
          sessionId: { title: "Session ID" },
          status: { title: "Status" },
          shell: { title: "Shell" },
        },
        success: {
          title: "Session opened",
          description: "SSH session opened successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid session parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Failed to open session",
          },
          notFound: {
            title: "Connection Not Found",
            description: "SSH connection not found",
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
            description: "Network error occurred",
          },
        },
      },
    },
  },

  terminal: {
    get: {
      title: "SSH Terminal",
      description: "Interactive SSH terminal widget",
      response: {
        ok: { title: "Terminal Ready" },
      },
      success: {
        title: "Terminal ready",
        description: "SSH terminal is ready",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        server: { title: "Server Error", description: "Terminal error" },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "Unsaved changes detected",
        },
        notFound: { title: "Not Found", description: "Resource not found" },
        conflict: { title: "Conflict", description: "A conflict occurred" },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        validation: {
          title: "Validation Error",
          description: "Validation failed",
        },
        forbidden: { title: "Forbidden", description: "Access denied" },
      },
    },
  },

  files: {
    read: {
      get: {
        title: "Read Remote File",
        description: "Read contents of a file via SSH",
        fields: {
          connectionId: {
            label: "Connection ID",
            description: "SSH connection to use",
            placeholder: "uuid",
          },
          path: {
            label: "File Path",
            description: "Absolute path to the file",
            placeholder: "/etc/hosts",
          },
          maxBytes: {
            label: "Max Bytes",
            description: "Maximum bytes to read",
            placeholder: "102400",
          },
          offset: {
            label: "Offset",
            description: "Byte offset to start reading from",
            placeholder: "0",
          },
        },
        response: {
          content: { title: "Content" },
          size: { title: "Size" },
          truncated: { title: "Truncated" },
          encoding: { title: "Encoding" },
        },
        success: {
          title: "File read",
          description: "File contents retrieved successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid file read parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Failed to read file",
          },
          notFound: {
            title: "File Not Found",
            description: "File or connection not found",
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
            description: "Network error occurred",
          },
        },
      },
    },
    list: {
      get: {
        title: "List Remote Files",
        description: "List files in a remote directory via SSH",
        fields: {
          connectionId: {
            label: "Connection ID",
            description: "SSH connection to use",
            placeholder: "uuid",
          },
          path: {
            label: "Directory Path",
            description: "Absolute path to directory",
            placeholder: "/",
          },
        },
        response: {
          entries: { title: "Entries" },
          currentPath: { title: "Current Path" },
        },
        success: {
          title: "Directory listed",
          description: "Directory contents retrieved successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid list parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Failed to list directory",
          },
          notFound: {
            title: "Not Found",
            description: "Directory or connection not found",
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
            description: "Network error occurred",
          },
        },
      },
    },
    write: {
      post: {
        title: "Write Remote File",
        description: "Write contents to a file via SSH",
        fields: {
          connectionId: {
            label: "Connection ID",
            description: "SSH connection to use",
            placeholder: "uuid",
          },
          path: {
            label: "File Path",
            description: "Absolute path to write to",
            placeholder: "/tmp/file.txt",
          },
          content: {
            label: "Content",
            description: "Content to write to the file",
            placeholder: "file contents",
          },
          createDirs: {
            label: "Create Dirs",
            description: "Create parent directories if they don't exist",
          },
        },
        response: {
          ok: { title: "Success" },
          bytesWritten: { title: "Bytes Written" },
        },
        success: {
          title: "File written",
          description: "File written successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid file write parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Failed to write file",
          },
          notFound: {
            title: "Not Found",
            description: "Path or connection not found",
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
            description: "Network error occurred",
          },
        },
      },
    },
  },

  linux: {
    users: {
      list: {
        get: {
          title: "List Linux Users",
          description: "List Linux users on a remote server via SSH",
          response: {
            users: { title: "Users" },
          },
          success: {
            title: "Users listed",
            description: "Linux users retrieved successfully",
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "Validation failed",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required",
            },
            forbidden: { title: "Forbidden", description: "Access denied" },
            server: {
              title: "Server Error",
              description: "Failed to list users",
            },
            notFound: {
              title: "Not Found",
              description: "Resource not found",
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
              description: "A conflict occurred",
            },
            network: {
              title: "Network Error",
              description: "Network error occurred",
            },
          },
        },
      },
      username: {
        delete: {
          title: "Delete Linux User",
          description: "Delete a Linux user from a remote server via SSH",
          fields: {
            removeHome: {
              label: "Remove Home",
              description: "Also remove the user's home directory",
            },
          },
          response: {
            ok: { title: "Success" },
          },
          success: {
            title: "User deleted",
            description: "Linux user deleted successfully",
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "Validation failed",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required",
            },
            forbidden: { title: "Forbidden", description: "Access denied" },
            server: {
              title: "Server Error",
              description: "Failed to delete user",
            },
            notFound: {
              title: "User Not Found",
              description: "Linux user not found",
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
              description: "A conflict occurred",
            },
            network: {
              title: "Network Error",
              description: "Network error occurred",
            },
          },
        },
      },
      create: {
        post: {
          title: "Create Linux User",
          description: "Create a Linux user on a remote server via SSH",
          fields: {
            username: {
              label: "Username",
              description: "Username for the new account",
              placeholder: "deploy",
            },
            groups: {
              label: "Groups",
              description: "Additional groups to add the user to",
              placeholder: "sudo,docker",
            },
            shell: {
              label: "Shell",
              description: "Login shell for the user",
              placeholder: "/bin/bash",
            },
            homeDir: {
              label: "Home Directory",
              description: "Home directory path",
              placeholder: "/home/deploy",
            },
            sudoAccess: {
              label: "Sudo Access",
              description: "Grant sudo access to the user",
            },
          },
          response: {
            ok: { title: "Success" },
            uid: { title: "UID" },
            gid: { title: "GID" },
            homeDirectory: { title: "Home Directory" },
            shell: { title: "Shell" },
          },
          success: {
            title: "User created",
            description: "Linux user created successfully",
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "Validation failed",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required",
            },
            forbidden: { title: "Forbidden", description: "Access denied" },
            server: {
              title: "Server Error",
              description: "Failed to create user",
            },
            notFound: {
              title: "Not Found",
              description: "Connection not found",
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
              description: "A conflict occurred",
            },
            network: {
              title: "Network Error",
              description: "Network error occurred",
            },
          },
        },
      },
    },
  },

  exec: {
    post: {
      title: "Execute SSH Command",
      description: "Execute a command on a remote server via SSH",
      fields: {
        connectionId: {
          label: "Connection ID",
          description: "SSH connection to use",
          placeholder: "uuid",
        },
        command: {
          label: "Command",
          description: "Command to execute",
          placeholder: "ls -la",
        },
        workingDir: {
          label: "Working Directory",
          description: "Working directory for the command",
          placeholder: "/home/user",
        },
        timeoutMs: {
          label: "Timeout (ms)",
          description: "Command timeout in milliseconds",
          placeholder: "30000",
        },
      },
      response: {
        stdout: { title: "Stdout" },
        stderr: { title: "Stderr" },
        exitCode: { title: "Exit Code" },
        status: { title: "Status" },
        durationMs: { title: "Duration (ms)" },
        backend: { title: "Backend" },
        truncated: { title: "Truncated" },
      },
      success: {
        title: "Command executed",
        description: "Command executed successfully",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid command parameters",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access denied" },
        server: {
          title: "Server Error",
          description: "Command execution failed",
        },
        notFound: {
          title: "Connection Not Found",
          description: "SSH connection not found",
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
          description: "Network error occurred",
        },
      },
    },
  },

  connections: {
    id: {
      get: {
        title: "Get SSH Connection",
        description: "Get details of an SSH connection",
        response: {
          id: { title: "ID" },
          label: { title: "Label" },
          host: { title: "Host" },
          port: { title: "Port" },
          username: { title: "Username" },
          authType: { title: "Auth Type" },
          isDefault: { title: "Is Default" },
          fingerprint: { title: "Fingerprint" },
          notes: { title: "Notes" },
          createdAt: { title: "Created At" },
        },
        success: {
          title: "Connection found",
          description: "SSH connection retrieved successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Validation failed",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Failed to get connection",
          },
          notFound: {
            title: "Connection Not Found",
            description: "SSH connection not found",
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
            description: "Network error occurred",
          },
        },
      },
    },
    list: {
      get: {
        title: "List SSH Connections",
        description: "List all SSH connections",
        response: {
          connections: { title: "Connections" },
        },
        success: {
          title: "Connections listed",
          description: "SSH connections retrieved successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Validation failed",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Failed to list connections",
          },
          notFound: {
            title: "Not Found",
            description: "No connections found",
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
            description: "Network error occurred",
          },
        },
      },
    },
    create: {
      post: {
        title: "Create SSH Connection",
        description: "Create a new SSH connection",
        fields: {
          label: {
            label: "Label",
            description: "Friendly name for the connection",
            placeholder: "prod-web-01",
          },
          host: {
            label: "Host",
            description: "SSH server hostname or IP",
            placeholder: "192.168.1.1",
          },
          port: {
            label: "Port",
            description: "SSH server port",
            placeholder: "22",
          },
          username: {
            label: "Username",
            description: "SSH username",
            placeholder: "deploy",
          },
          authType: {
            label: "Auth Type",
            description: "Authentication method",
          },
          secret: {
            label: "Secret",
            description: "Password or private key",
          },
          passphrase: {
            label: "Passphrase",
            description: "Private key passphrase (if applicable)",
          },
          isDefault: {
            label: "Default",
            description: "Set as default connection",
          },
          notes: {
            label: "Notes",
            description: "Optional notes about this connection",
          },
        },
        response: {
          id: { title: "ID" },
        },
        success: {
          title: "Connection created",
          description: "SSH connection created successfully",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid connection parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Failed to create connection",
          },
          notFound: {
            title: "Not Found",
            description: "Resource not found",
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
            description: "Network error occurred",
          },
        },
      },
    },
    test: {
      post: {
        title: "Test SSH Connection",
        description: "Test an SSH connection",
        fields: {
          connectionId: {
            label: "Connection ID",
            description: "ID of the SSH connection to test",
            placeholder: "uuid",
          },
          acknowledgeNewFingerprint: {
            label: "Acknowledge Fingerprint",
            description: "Acknowledge new host fingerprint",
            placeholder: "false",
          },
        },
        response: {
          ok: { title: "Success" },
          latencyMs: { title: "Latency (ms)" },
          fingerprint: { title: "Fingerprint" },
          fingerprintChanged: { title: "Fingerprint Changed" },
        },
        success: {
          title: "Connection successful",
          description: "SSH connection test passed",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid test parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: { title: "Forbidden", description: "Access denied" },
          server: {
            title: "Server Error",
            description: "Connection test failed",
          },
          notFound: {
            title: "Connection Not Found",
            description: "SSH connection not found",
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
            description: "Network error occurred",
          },
        },
      },
    },
  },
};
