export const errorsTranslations = {
  transform_failed: "Failed to transform data",
  stats_transform_failed: "Failed to transform statistics data",
  status_transform_failed: "Failed to transform status data",
  execution: {
    invalid_module_structure: "Invalid module structure",
    validation_failed: "Validation failed",
    execution_failed: "Execution failed",
    threw_error: "Task threw error",
    processing_error: "Processing error",
    unknown_error: "Unknown error",
  },
  email_campaigns: {
    failed_to_render_email: "Failed to render email template",
    failed_to_initialize_campaign: "Failed to initialize email campaign",
    unknown_error_fallback: "Unknown error",
  },
  system: {
    task_validation_failed: "Task validation failed",
    database_connection_failed: "Database connection failed",
    required_tables_not_found: "Required database tables not found",
    invalid_task_configuration: "Invalid task configuration",
  },
  tasks: {
    list: {
      database_error: "Failed to retrieve tasks from database",
      fetch_failed: "Failed to fetch tasks list",
    },
  },
  task_create: {
    database_error: "Failed to create task in database",
    invalid_schedule: "Invalid cron schedule format",
    creation_failed: "Task creation failed",
  },
  history: {
    fetch_failed: "Failed to fetch execution history",
  },
  status: {
    health_fetch_failed: "Failed to fetch health status",
    stats_fetch_failed: "Failed to fetch task statistics",
    system_status_failed: "Failed to fetch system status",
  },
  stats: {
    detailed_stats_failed: "Failed to fetch detailed statistics",
  },
  task: {
    find_by_id_failed: "Failed to find task by ID",
    find_by_name_failed: "Failed to find task by name",
    not_found: "Task not found",
    update_failed: "Failed to update task",
    delete_failed: "Failed to delete task",
    toggle_failed: "Failed to toggle task status",
    executions_fetch_failed: "Failed to fetch task executions",
    execution_create_failed: "Failed to create task execution",
    execution_update_failed: "Failed to update task execution",
  },
};
