export const translations = {
  title: "List IMAP Folders",
  description: "Retrieve a list of IMAP folders",
  category: "API Endpoint",
  tag: "Folders",
  tags: {
    list: "List",
  },
  container: {
    title: "Folders Container",
    description: "Container for folder list data",
  },
  page: {
    label: "Page",
    description: "Page number for pagination",
    placeholder: "Enter page number",
  },
  limit: {
    label: "Limit",
    description: "Number of items per page",
    placeholder: "Enter limit",
  },
  accountId: {
    label: "Account ID",
    description: "Filter by specific account ID",
    placeholder: "Enter account ID",
  },
  search: {
    label: "Search",
    description: "Search folders by name",
    placeholder: "Search folders...",
  },
  specialUseType: {
    label: "Special Use Type",
    description: "Filter by special use folder type",
    placeholder: "Select folder type",
  },
  syncStatus: {
    label: "Sync Status",
    description: "Filter by synchronization status",
    placeholder: "Select sync status",
  },
  sortBy: {
    label: "Sort By",
    description: "Field to sort by",
    placeholder: "Select sort field",
  },
  sortOrder: {
    label: "Sort Order",
    description: "Sort direction (ascending or descending)",
    placeholder: "Select sort order",
  },
  response: {
    folders: {
      title: "Folders",
    },
    folder: {
      title: "Folder",
      description: "Folder details",
      id: "Folder ID",
      name: "Folder Name",
      displayName: "Display Name",
      path: "Folder Path",
      isSelectable: "Is Selectable",
      hasChildren: "Has Children",
      specialUseType: "Special Use Type",
      messageCount: "Message Count",
      unseenCount: "Unseen Count",
      syncStatus: "Sync Status",
      createdAt: "Created At",
    },
    pagination: {
      title: "Pagination",
      description: "Pagination information",
      page: "Page",
      limit: "Limit",
      total: "Total",
      totalPages: "Total Pages",
    },
  },
  info: {
    start: "Starting folder list retrieval",
  },
  errors: {
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to access this resource",
    },
    server: {
      title: "Server Error",
      description: "An internal server error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
  },
  success: {
    title: "Success",
    description: "Folders retrieved successfully",
  },
};
