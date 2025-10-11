export const translations = {
  title: "Docker Operations",
  description: "Execute Docker commands and manage containers",
  category: "Docker",
  tags: {
    docker: "Docker",
    utils: "Utilities",
    dockeroperations: "Docker Operations",
  },
  container: {
    title: "Docker Operations",
    description: "Execute Docker commands with proper error handling",
  },
  fields: {
    command: {
      label: "Docker Command",
      description: "The Docker command to execute",
      placeholder: "docker ps",
    },
    options: {
      label: "Execution Options",
      description: "Configuration options for command execution",
      placeholder: "Configure timeout and logging options",
    },
  },
  response: {
    success: {
      label: "Command Success",
    },
    output: {
      label: "Command Output",
    },
    error: {
      label: "Error Details",
    },
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid Docker command parameters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required for Docker operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Insufficient permissions for Docker operations",
    },
    internal: {
      title: "Docker Error",
      description: "Docker command execution failed",
    },
    timeout: {
      title: "Command Timeout",
      description: "Docker command exceeded timeout limit",
    },
    executionFailed: {
      title: "Execution Failed",
      description: "Docker command execution failed",
    },
    composeDownFailed: {
      title: "Compose Down Failed",
      description: "Docker Compose down operation failed",
    },
    composeUpFailed: {
      title: "Compose Up Failed",
      description: "Docker Compose up operation failed",
    },
  },
  success: {
    title: "Docker Command Successful",
    description: "Docker command executed successfully",
  },
  messages: {
    executingCommand: "Executing Docker command: {command}",
    timeoutError: "Docker command timed out after {timeout}ms: {command}",
    commandFailed: "Docker command failed with code {code}: {command}",
    executionFailed: "Failed to execute Docker command: {command}",
    commandError: "Docker command error: {error}",
  },
};
