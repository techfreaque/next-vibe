export const templateTranslations = {
  actions: {
    update: {
      description: "Update template by ID",
    },
    delete: {
      description: "Delete template by ID",
    },
  },
  status: {
    draft: "Draft",
    published: "Published",
    archived: "Archived",
  },
  errors: {
    not_found: "Template not found",
    fetch_all_failed: "Failed to fetch all templates",
    fetch_by_id_failed: "Failed to fetch template by ID",
    create_failed: "Failed to create template",
    update_failed: "Failed to update template",
    delete_failed: "Failed to delete template",
    find_by_value_failed: "Failed to find template by value",
    create_template_failed: "Failed to create template in transaction",
    get_templates_failed: "Failed to get templates with business logic",
    update_template_failed: "Failed to update template with business logic",
  },
  success: {
    created: "Template created successfully",
    updated: "Template updated successfully",
    retrieved: "Templates retrieved successfully",
  },
  admin: {
    stats: {
      totalTemplates: "Total Templates",
      draftTemplates: "Draft Templates",
      publishedTemplates: "Published Templates",
      archivedTemplates: "Archived Templates",
      newTemplates: "New Templates",
      updatedTemplates: "Updated Templates",
      averageContentLength: "Average Content Length",
      templatesWithDescription: "Templates with Description",
      creationRate: "Creation Rate",
      updateRate: "Update Rate",
      descriptionCompletionRate: "Description Completion Rate",
      tagUsageRate: "Tag Usage Rate",
      byStatus: "Templates by Status",
      byUser: "Templates by User",
      byContentLength: "Templates by Content Length",
      byTag: "Templates by Tag",
      byCreationPeriod: "Templates by Creation Period",
    },
  },
  email: {
    subject: "Template Notification from {{appName}}",
    title: "Welcome to {{appName}}, {{firstName}}!",
    preview: "Template notification with important information",
    welcome_message:
      "We're excited to have you on board. You can now start using your account to access all the features of {{appName}}.",
    features_intro: "With your new account, you can:",
    feature_1: "Manage your orders and deliveries",
    feature_2: "Track performance metrics",
    feature_3: "Access custom reports",
    cta_button: "Get Started Now",
  },
  list: {
    title: "Templates",
    paginated_title: "Paginated Templates",
  },
  detail: {
    title: "Template Details",
    id: "ID",
    value: "Value",
  },
  search: {
    title: "Search Templates",
    placeholder: "Search templates...",
    searching: "Searching...",
  },
  form: {
    validation: {},
    fields: {
      value: "Value",
      search: "Search",
    },
    placeholders: {
      example_value: "Example value",
    },
    descriptions: {
      value: "Enter a value for this field.",
      search: "Search for templates by keyword.",
    },
    actions: {
      submit: "Submit",
      create: "Create",
      create_optimistic: "Create (Optimistic)",
      update: "Update",
      delete: "Delete",
      clear: "Clear Form",
    },
  },
};
