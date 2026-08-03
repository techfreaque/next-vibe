/**
 * Browser API translations (English)
 */

export const translations = {
  click: {
    title: "Click Element",
    titleShort: "Click",
    description:
      "Click an element by its UID from a snapshot. Get a snapshot first with take-snapshot.",
    dynamicTitle: "Click: {{uid}}",

    form: {
      label: "Click Element",
      description: "Click on a specific element on the page",
      fields: {
        uid: {
          label: "Element UID",
          description:
            "The uid of an element on the page from the page content snapshot",
          placeholder: "Enter element UID",
        },
        dblClick: {
          label: "Double Click",
          description: "Set to true for double clicks. Default is false",
        },
      },
    },

    response: {
      success: "Click operation successful",
      result: "Click operation result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during the click operation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform click operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Click operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested element was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred during the click operation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during the click operation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during the click operation",
      },
    },

    success: {
      title: "Click Operation Successful",
      description: "The element was clicked successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      inputAutomation: "Input Automation",
    },
  },
  "close-page": {
    title: "Close Page",
    titleShort: "Close Page",
    description:
      "Close the current session page. The last open page cannot be closed.",

    form: {
      label: "Close Page",
      description: "Close a browser page by its index",
      fields: {
        pageIdx: {
          label: "Page Index",
          description:
            "The index of the page to close. Call list_pages to list pages",
          placeholder: "Enter page index (e.g., 0)",
        },
      },
    },

    response: {
      success: "Page closed successfully",
      result: "Close page operation result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while closing the page",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to close pages",
      },
      forbidden: {
        title: "Forbidden",
        description: "Page close operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested page was not found",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred while closing the page",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while closing the page",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while closing the page",
      },
    },

    success: {
      title: "Page Closed Successfully",
      description: "The page was closed successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      navigationAutomation: "Navigation Automation",
    },
  },
  drag: {
    title: "Drag Element",
    titleShort: "Drag",
    description:
      "Drag one element onto another by UID. Get UIDs from take-snapshot.",
    dynamicTitle: "Drag: {{from}} \u2192 {{to}}",

    form: {
      label: "Drag Element",
      description: "Drag one element onto another element",
      fields: {
        from_uid: {
          label: "From Element UID",
          description: "The uid of the element to drag",
          placeholder: "Enter source element UID",
        },
        to_uid: {
          label: "To Element UID",
          description: "The uid of the element to drop into",
          placeholder: "Enter target element UID",
        },
      },
    },

    response: {
      success: "Drag operation successful",
      result: "Drag operation result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during the drag operation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform drag operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Drag operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested element was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred during the drag operation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during the drag operation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during the drag operation",
      },
    },

    success: {
      title: "Drag Operation Successful",
      description: "The element was dragged successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      inputAutomation: "Input Automation",
    },
  },
  fill: {
    title: "Fill",
    titleShort: "Fill",
    description:
      "Type text into an input/textarea or select a dropdown option by UID. Get UIDs from take-snapshot.",
    dynamicTitle: "Fill: {{uid}}",

    form: {
      label: "Fill Element",
      description: "Type text into a form element",
      fields: {
        uid: {
          label: "Element UID",
          description:
            "The uid of an element on the page from the page content snapshot",
          placeholder: "Enter element uid",
        },
        value: {
          label: "Value",
          description: "The value to fill in",
          placeholder: "Enter value to fill",
        },
      },
    },

    response: {
      success: "Fill operation successful",
      result: "Fill operation result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during the fill operation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform fill operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Fill operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred during the fill operation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during the fill operation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during the fill operation",
      },
    },

    success: {
      title: "Fill Operation Successful",
      description: "The element was filled successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      inputAutomation: "Input Automation",
    },
  },
  "fill-form": {
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      inputAutomation: "Input Automation",
    },
    title: "Fill Form",
    titleShort: "Fill Form",
    description:
      "Fill multiple form fields at once by UID array. More efficient than individual fill calls.",

    form: {
      label: "Fill Form Elements",
      description: "Fill multiple form elements simultaneously",
      fields: {
        elements: {
          label: "Form Elements",
          description: "Array of elements from snapshot to fill out",
          placeholder: "Enter form elements (JSON array)",
          uid: {
            label: "Element UID",
            description: "The unique identifier of the element to fill",
          },
          value: {
            label: "Value",
            description: "The value to enter into the element",
          },
        },
      },
    },

    response: {
      success: "Form fill operation successful",
      result: {
        title: "Result",
        description: "Form fill operation result",
        filled: "All Filled",
        filledCount: "Filled Count",
        elements: {
          uid: "Element UID",
          filled: "Filled Successfully",
        },
      },
      error: "Error message",
      executionId: "Execution ID for tracking",
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during the form fill operation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform form fill operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Form fill operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred during the form fill operation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during the form fill operation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during the form fill operation",
      },
    },

    success: {
      title: "Form Fill Operation Successful",
      description: "All form elements were filled successfully",
    },
  },
  "handle-dialog": {
    title: "Handle Dialog",
    titleShort: "Dialog",
    description:
      "Accept or dismiss a browser dialog (alert/confirm/prompt). Call before the action that triggers it.",
    dynamicTitle: "Dialog: {{action}}",

    form: {
      label: "Handle Browser Dialog",
      description: "Accept or dismiss a browser dialog",
      fields: {
        action: {
          label: "Action",
          description: "Whether to dismiss or accept the dialog",
          placeholder: "Select action",
          options: {
            accept: "Accept",
            dismiss: "Dismiss",
          },
        },
        promptText: {
          label: "Prompt Text",
          description: "Optional prompt text to enter into the dialog",
          placeholder: "Enter prompt text (optional)",
        },
      },
    },

    response: {
      success: "Dialog handling operation successful",
      result: "Dialog handling result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description:
          "A network error occurred during the dialog handling operation",
      },
      unauthorized: {
        title: "Unauthorized",
        description:
          "You are not authorized to perform dialog handling operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Dialog handling operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred during the dialog handling operation",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unknown error occurred during the dialog handling operation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during the dialog handling operation",
      },
    },

    success: {
      title: "Dialog Handling Successful",
      description: "The browser dialog was handled successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      dialogAutomation: "Dialog Automation",
    },
  },
  hover: {
    title: "Hover",
    titleShort: "Hover",
    description:
      "Hover over an element by UID to trigger tooltips or reveal hidden controls.",
    dynamicTitle: "Hover: {{uid}}",

    form: {
      label: "Hover Element",
      description: "Move mouse cursor over an element",
      fields: {
        uid: {
          label: "Element UID",
          description:
            "The uid of an element on the page from the page content snapshot",
          placeholder: "Enter element uid",
        },
      },
    },

    response: {
      success: "Hover operation successful",
      result: "Hover operation result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during the hover operation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform hover operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Hover operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred during the hover operation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during the hover operation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during the hover operation",
      },
    },

    success: {
      title: "Hover Operation Successful",
      description: "The element was hovered successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      inputAutomation: "Input Automation",
    },
  },
  "press-key": {
    title: "Press Key",
    titleShort: "Press Key",
    dynamicTitle: "Key: {{key}}",
    description: "Press a key or key combination",
    form: {
      label: "Press Key",
      description: "Press a key or key combination",
      fields: {
        key: {
          label: "Key",
          description:
            "A key or a combination (e.g., Enter, Control+A, Control+Shift+R)",
          placeholder: "Enter key or combination",
        },
      },
    },
    response: {
      success: "Key press operation successful",
      result: "Key press operation result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during the key press operation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform key press operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Key press operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred during the key press operation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during the key press operation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during the key press operation",
      },
    },
    success: {
      title: "Key Press Operation Successful",
      description: "The key was pressed successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      inputAutomation: "Input Automation",
    },
  },
  "upload-file": {
    title: "Upload File",
    titleShort: "Upload",
    dynamicTitle: "Upload: {{file}}",
    description: "Upload a file through a provided element",
    form: {
      label: "Upload File",
      description: "Upload a file to a file input element",
      fields: {
        uid: {
          label: "Element UID",
          description:
            "The uid of the file input element or an element that will open file chooser",
          placeholder: "Enter element uid",
        },
        filePath: {
          label: "File Path",
          description: "The local path of the file to upload",
          placeholder: "Enter file path",
        },
      },
    },
    response: {
      success: "File upload operation successful",
      result: "File upload operation result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description:
          "A network error occurred during the file upload operation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform file upload operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "File upload operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred during the file upload operation",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unknown error occurred during the file upload operation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during the file upload operation",
      },
    },
    success: {
      title: "File Upload Operation Successful",
      description: "The file was uploaded successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      inputAutomation: "Input Automation",
    },
  },
  "list-pages": {
    title: "List Pages",
    titleShort: "Pages",
    description:
      "List all open browser pages with their URLs. Each caller session owns one tab; new-page replaces it.",
    form: {
      label: "List Pages",
      description: "Get all open browser pages",
      fields: {},
    },
    response: {
      success: "Pages listing operation successful",
      result: {
        title: "Result",
        description: "Result of pages listing",
        pages: {
          idx: "Index",
          title: "Title",
          url: "URL",
          active: "Active",
        },
        totalCount: "Total Count",
      },
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while listing pages",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to list pages",
      },
      forbidden: {
        title: "Forbidden",
        description: "Page listing operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred while listing pages",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while listing pages",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while listing pages",
      },
    },
    success: {
      title: "Pages Listed Successfully",
      description: "The open pages were listed successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      navigationAutomation: "Navigation Automation",
    },
  },
  "navigate-page": {
    title: "Navigate Page",
    titleShort: "Navigate",
    dynamicTitle: "Navigate: {{target}}",
    description:
      "Navigate the session page to a URL, back, forward, or reload. Prefer this over new-page for same-tab navigation.",
    form: {
      label: "Navigate Page",
      description:
        "Navigate the currently selected page to a URL or through history",
      fields: {
        type: {
          label: "Navigation Type",
          description: "Navigate by URL, back or forward in history, or reload",
          placeholder: "Select navigation type",
          options: {
            url: "URL",
            back: "Back",
            forward: "Forward",
            reload: "Reload",
          },
        },
        url: {
          label: "URL",
          description: "Target URL (only for type=url)",
          placeholder: "Enter URL",
        },
        ignoreCache: {
          label: "Ignore Cache",
          description: "Whether to ignore cache on reload",
          placeholder: "Ignore cache",
        },
        timeout: {
          label: "Timeout",
          description: "Maximum wait time in milliseconds (0 for default)",
          placeholder: "Enter timeout",
        },
      },
    },
    response: {
      success: "Navigation operation successful",
      result: "Result of the navigation",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during navigation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to navigate pages",
      },
      forbidden: {
        title: "Forbidden",
        description: "Page navigation operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred during navigation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during navigation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during navigation",
      },
    },
    success: {
      title: "Navigation Successful",
      description: "The page was navigated successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      navigationAutomation: "Navigation Automation",
    },
  },
  "new-page": {
    title: "New Page",
    titleShort: "New Page",
    dynamicTitle: "New page: {{url}}",
    description:
      "Open a new browser tab at a URL. The session adopts the new tab — all subsequent calls operate on it.",
    form: {
      label: "New Page",
      description: "Create a new browser page and load a URL",
      fields: {
        url: {
          label: "URL",
          description: "URL to load in the new page",
          placeholder: "Enter URL",
        },
        replacePage: {
          label: "Replace Page",
          description: "Close existing pages before opening the new one",
        },
        background: {
          label: "Background",
          description: "Open page without bringing it to the front",
        },
        timeout: {
          label: "Timeout",
          description: "Maximum wait time in milliseconds (0 for default)",
          placeholder: "Enter timeout",
        },
      },
    },
    response: {
      success: "New page creation operation successful",
      result: "Result of new page creation",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while creating the new page",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to create new pages",
      },
      forbidden: {
        title: "Forbidden",
        description: "New page creation operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while creating the new page",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while creating the new page",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while creating the new page",
      },
    },
    success: {
      title: "New Page Created Successfully",
      description: "The new page was created successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      navigationAutomation: "Navigation Automation",
    },
  },
  "select-page": {
    title: "Select Page",
    titleShort: "Select Page",
    dynamicTitle: "Select: {{page}}",
    description:
      "Switch the session to a specific page by index. Use list-pages to find the index. Does not update the session's tracked tab.",
    form: {
      label: "Select Page",
      description: "Select a page by its index",
      fields: {
        pageIdx: {
          label: "Page Index",
          description:
            "The index of the page to select (call list_pages to list pages)",
          placeholder: "Enter page index",
        },
      },
    },
    response: {
      success: "Page selection operation successful",
      result: "Result of page selection",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while selecting the page",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to select pages",
      },
      forbidden: {
        title: "Forbidden",
        description: "Page selection operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while selecting the page",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while selecting the page",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while selecting the page",
      },
    },
    success: {
      title: "Page Selected Successfully",
      description: "The page was selected successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      navigationAutomation: "Navigation Automation",
    },
  },
  emulate: {
    title: "Emulate",
    titleShort: "Emulate",
    description:
      "Emulate network conditions (offline/3G/4G) or CPU throttling on the current page.",
    dynamicTitle: "Emulate: {{config}}",
    form: {
      label: "Emulate Device",
      description: "Emulate network conditions and CPU throttling",
      fields: {
        networkConditions: {
          label: "Network Conditions",
          description: "Throttle network (set to No emulation to disable)",
          placeholder: "Select network condition",
          options: {
            noEmulation: "No emulation",
            offline: "Offline",
            slow3g: "Slow 3G",
            fast3g: "Fast 3G",
            slow4g: "Slow 4G",
            fast4g: "Fast 4G",
          },
        },
        cpuThrottlingRate: {
          label: "CPU Throttling Rate",
          description: "CPU slowdown factor (1 to disable, 1-20)",
          placeholder: "Enter throttling rate",
        },
      },
    },
    response: {
      success: "Emulation operation successful",
      result: "Result of the emulation operation",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during emulation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to emulate device features",
      },
      forbidden: {
        title: "Forbidden",
        description: "Device emulation operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred during emulation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during emulation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during emulation",
      },
    },
    success: {
      title: "Emulation Successful",
      description: "Device features were emulated successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      performanceAutomation: "Performance Automation",
    },
  },
  "resize-page": {
    title: "Resize Page",
    titleShort: "Resize",
    dynamicTitle: "Resize: {{width}}x{{height}}",
    description:
      "Resize the browser viewport to specific dimensions in pixels.",
    form: {
      label: "Resize Page",
      description: "Resize the page to specified dimensions",
      fields: {
        width: {
          label: "Width",
          description: "Page width in pixels",
          placeholder: "Enter width",
        },
        height: {
          label: "Height",
          description: "Page height in pixels",
          placeholder: "Enter height",
        },
      },
    },
    response: {
      success: "Page resize operation successful",
      result: "Result of page resize operation",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while resizing the page",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to resize pages",
      },
      forbidden: {
        title: "Forbidden",
        description: "Page resize operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while resizing the page",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while resizing the page",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while resizing the page",
      },
    },
    success: {
      title: "Page Resized Successfully",
      description: "The page was resized successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      viewportAutomation: "Viewport Automation",
    },
  },
  "evaluate-script": {
    title: "Evaluate Script",
    titleShort: "Eval Script",
    description:
      "Run JavaScript in the page and return the result. Use for reading state that take-snapshot doesn't expose.",
    dynamicTitle: "Script: {{snippet}}",
    form: {
      label: "Evaluate Script",
      description: "Execute JavaScript in the browser page",
      fields: {
        function: {
          label: "Function",
          description: "JavaScript function declaration to execute",
          placeholder: "() => { return document.title; }",
        },
        args: {
          label: "Arguments",
          description:
            "Optional list of arguments (element UIDs) to pass to the function",
          placeholder: '[{"uid": "element-uid"}]',
          uid: {
            label: "Element UID",
            description: "The unique identifier of an element on the page",
          },
        },
      },
    },
    response: {
      success: "Script evaluation operation successful",
      result: {
        title: "Result",
        description: "Result of the script evaluation",
        executed: "Executed",
        result: "Return Value",
      },
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during script evaluation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to evaluate scripts",
      },
      forbidden: {
        title: "Forbidden",
        description: "Script evaluation operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred during script evaluation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during script evaluation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during script evaluation",
      },
    },
    success: {
      title: "Script Evaluated Successfully",
      description: "The JavaScript was executed successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      scriptExecution: "Script Execution",
    },
  },
  "get-console-message": {
    title: "Get Console Message",
    titleShort: "Console Msg",
    description:
      "Get the full body of a specific console message by msgid from list-console-messages.",
    dynamicTitle: "Console #{{id}}",
    form: {
      label: "Get Console Message",
      description: "Retrieve a specific console message",
      fields: {
        msgid: {
          label: "Message ID",
          description:
            "The msgid of a console message from the listed console messages",
          placeholder: "Enter message ID",
        },
      },
    },
    response: {
      success: "Console message retrieval operation successful",
      result: "Result of the console message retrieval",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description:
          "A network error occurred while retrieving the console message",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to retrieve console messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "Console message retrieval operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while retrieving the console message",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unknown error occurred while retrieving the console message",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while retrieving the console message",
      },
    },
    success: {
      title: "Console Message Retrieved Successfully",
      description: "The console message was retrieved successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      debugging: "Debugging",
    },
  },
  "list-console-messages": {
    title: "List Console Messages",
    titleShort: "Console Log",
    description:
      "List console messages since last navigation. Filter by type (error/warn/log). Use after actions to catch JS errors.",
    form: {
      label: "List Console Messages",
      description: "Get all console messages from the browser page",
      fields: {
        includePreservedMessages: {
          label: "Include Preserved Messages",
          description:
            "Set to true to return the preserved messages over the last 3 navigations",
          placeholder: "false",
        },
        pageIdx: {
          label: "Page Index",
          description: "Page number to return (0-based, omit for first page)",
          placeholder: "Enter page index",
        },
        pageSize: {
          label: "Page Size",
          description:
            "Maximum number of messages to return (omit to return all messages)",
          placeholder: "Enter page size",
        },
        types: {
          label: "Message Types",
          description:
            "Filter messages to only return messages of the specified types (omit to return all)",
          placeholder: "Select message types",
          options: {
            log: "Log",
            debug: "Debug",
            info: "Info",
            error: "Error",
            warn: "Warning",
            dir: "Dir",
            dirxml: "Dirxml",
            table: "Table",
            trace: "Trace",
            clear: "Clear",
            startGroup: "Start Group",
            startGroupCollapsed: "Start Group Collapsed",
            endGroup: "End Group",
            assert: "Assert",
            profile: "Profile",
            profileEnd: "Profile End",
            count: "Count",
            timeEnd: "Time End",
            verbose: "Verbose",
            issue: "Issue",
          },
        },
      },
    },
    response: {
      success: "Console messages retrieved successfully",
      result: {
        title: "Result",
        description: "Console messages list result",
        messages: {
          msgid: "Message ID",
          type: "Type",
          text: "Message",
          timestamp: "Timestamp",
        },
        totalCount: "Total Count",
      },
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while listing console messages",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to list console messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "Listing console messages is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while listing console messages",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while listing console messages",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while listing console messages",
      },
    },
    success: {
      title: "Console Messages Retrieved Successfully",
      description: "The console messages were retrieved successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      debugging: "Debugging",
    },
  },
  "get-network-request": {
    title: "Get Network Request",
    titleShort: "Network Req",
    description:
      "Get full details (headers, body) for a request by reqid from list-network-requests.",
    dynamicTitle: "Network #{{id}}",
    form: {
      label: "Get Network Request",
      description:
        "Get a specific network request or the currently selected one",
      fields: {
        reqid: {
          label: "Request ID",
          description:
            "The reqid of the network request (omit to get currently selected request in DevTools)",
          placeholder: "Enter request ID",
        },
        maxBodyLength: {
          label: "Max Body Length",
          description:
            "Maximum characters to return from inline request/response bodies. Bodies exceeding this are truncated with a notice. Omit for no limit.",
          placeholder: "e.g. 10000",
        },
      },
    },
    response: {
      success: "Network request retrieved successfully",
      result: "Network request retrieval result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description:
          "A network error occurred while getting the network request",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to get network requests",
      },
      forbidden: {
        title: "Forbidden",
        description: "Getting network requests is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while getting the network request",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unknown error occurred while getting the network request",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while getting the network request",
      },
    },
    success: {
      title: "Network Request Retrieved Successfully",
      description: "The network request was retrieved successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      networkAnalysis: "Network Analysis",
    },
  },
  "list-network-requests": {
    title: "List Network Requests",
    titleShort: "Network Log",
    description:
      "List network requests since last navigation. Filter by resource type (fetch/xhr/doc). Use to inspect API calls.",
    form: {
      label: "List Network Requests",
      description: "Get all network requests from the browser page",
      fields: {
        includePreservedRequests: {
          label: "Include Preserved Requests",
          description:
            "Set to true to return the preserved requests over the last 3 navigations",
          placeholder: "false",
        },
        pageIdx: {
          label: "Page Index",
          description: "Page number to return (0-based, omit for first page)",
          placeholder: "Enter page index",
        },
        pageSize: {
          label: "Page Size",
          description:
            "Maximum number of requests to return (omit to return all requests)",
          placeholder: "Enter page size",
        },
        resourceTypes: {
          label: "Resource Types",
          description:
            "Filter requests to only return requests of the specified resource types (omit to return all)",
          placeholder: "Select resource types",
          options: {
            document: "Document",
            stylesheet: "Stylesheet",
            image: "Image",
            media: "Media",
            font: "Font",
            script: "Script",
            texttrack: "Text Track",
            xhr: "XHR",
            fetch: "Fetch",
            prefetch: "Prefetch",
            eventsource: "Event Source",
            websocket: "WebSocket",
            manifest: "Manifest",
            signedexchange: "Signed Exchange",
            ping: "Ping",
            cspviolationreport: "CSP Violation Report",
            preflight: "Preflight",
            fedcm: "FedCM",
            other: "Other",
          },
        },
      },
    },
    response: {
      success: "Network requests retrieved successfully",
      result: {
        title: "Result",
        description: "Network requests list result",
        requests: {
          reqid: "Request ID",
          url: "URL",
          method: "Method",
          status: "Status",
          type: "Type",
        },
        totalCount: "Total Count",
      },
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while listing network requests",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to list network requests",
      },
      forbidden: {
        title: "Forbidden",
        description: "Listing network requests is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while listing network requests",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while listing network requests",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while listing network requests",
      },
    },
    success: {
      title: "Network Requests Retrieved Successfully",
      description: "The network requests were retrieved successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      networkAnalysis: "Network Analysis",
    },
  },
  "performance-analyze-insight": {
    title: "Analyze Performance Insight",
    titleShort: "Perf Insight",
    description:
      "Drill into a specific insight from a trace result (e.g. DocumentLatency, LCPBreakdown). Call after performance-stop-trace.",
    form: {
      label: "Analyze Performance Insight",
      description:
        "Get detailed information about a specific performance insight",
      fields: {
        insightSetId: {
          label: "Insight Set ID",
          description:
            "The id for the specific insight set (only use the ids given in the Available insight sets list)",
          placeholder: "Enter insight set ID",
        },
        insightName: {
          label: "Insight Name",
          description:
            "The name of the Insight you want more information on (e.g., DocumentLatency or LCPBreakdown)",
          placeholder: "Enter insight name",
        },
      },
    },
    response: {
      success: "Performance insight analyzed successfully",
      result: "Performance insight analysis result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description:
          "A network error occurred while analyzing the performance insight",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to analyze performance insights",
      },
      forbidden: {
        title: "Forbidden",
        description: "Analyzing performance insights is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while analyzing the performance insight",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unknown error occurred while analyzing the performance insight",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description:
          "A conflict occurred while analyzing the performance insight",
      },
    },
    success: {
      title: "Performance Insight Analyzed Successfully",
      description: "The performance insight was analyzed successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      performanceAutomation: "Performance Automation",
    },
  },
  "performance-start-trace": {
    title: "Start Performance Trace",
    titleShort: "Start Trace",
    description:
      "Start a performance trace to capture core web vitals and load metrics. Follow with performance-stop-trace.",
    form: {
      label: "Start Performance Trace",
      description: "Begin recording performance metrics for the browser page",
      fields: {
        reload: {
          label: "Reload Page",
          description:
            "Determines if, once tracing has started, the page should be automatically reloaded",
          placeholder: "true",
        },
        autoStop: {
          label: "Auto Stop",
          description:
            "Determines if the trace recording should be automatically stopped",
          placeholder: "true",
        },
      },
    },
    response: {
      success: "Performance trace started successfully",
      result: "Performance trace start result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description:
          "A network error occurred while starting the performance trace",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to start performance traces",
      },
      forbidden: {
        title: "Forbidden",
        description: "Starting performance traces is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while starting the performance trace",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unknown error occurred while starting the performance trace",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while starting the performance trace",
      },
    },
    success: {
      title: "Performance Trace Started Successfully",
      description: "The performance trace was started successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      performanceAutomation: "Performance Automation",
    },
  },
  "performance-stop-trace": {
    title: "Stop Performance Trace",
    titleShort: "Stop Trace",
    description:
      "Stop the active trace and return performance metrics with insight set IDs for performance-analyze-insight.",
    form: {
      label: "Stop Performance Trace",
      description: "Stop the active performance trace recording",
      fields: {},
    },
    response: {
      success: "Performance trace stopped successfully",
      result: "Performance trace stop result with metrics",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description:
          "A network error occurred while stopping the performance trace",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to stop performance traces",
      },
      forbidden: {
        title: "Forbidden",
        description: "Stopping performance traces is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while stopping the performance trace",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unknown error occurred while stopping the performance trace",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while stopping the performance trace",
      },
    },
    success: {
      title: "Performance Trace Stopped Successfully",
      description: "The performance trace was stopped successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      performanceAutomation: "Performance Automation",
    },
  },
  "take-screenshot": {
    title: "Take Screenshot",
    titleShort: "Screenshot",
    dynamicTitle: "Screenshot: {{target}}",
    description:
      "Capture a visual screenshot of the page or a specific element. Returns an image. Use to verify UI state.",
    form: {
      label: "Take Screenshot",
      description: "Capture a screenshot of the browser page or element",
      fields: {
        uid: {
          label: "Element UID",
          description:
            "The uid of an element to screenshot (omit to screenshot the entire page)",
          placeholder: "Enter element uid",
        },
        fullPage: {
          label: "Full Page",
          description:
            "If set to true takes a screenshot of the full page instead of the currently visible viewport (incompatible with uid)",
          placeholder: "false",
        },
        format: {
          label: "Format",
          description:
            "Type of format to save the screenshot as (default: png)",
          placeholder: "png",
          options: {
            png: "PNG",
            jpeg: "JPEG",
            webp: "WebP",
          },
        },
        quality: {
          label: "Quality",
          description:
            "Compression quality for JPEG and WebP formats (0-100). Higher values mean better quality but larger file sizes. Ignored for PNG format.",
          placeholder: "80",
        },
        filePath: {
          label: "File Path",
          description:
            "The absolute path, or a path relative to the current working directory, to save the screenshot to instead of attaching it to the response",
          placeholder: "/path/to/screenshot.png",
        },
      },
    },
    response: {
      success: "Screenshot captured successfully",
      result: "Screenshot capture result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while capturing the screenshot",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to capture screenshots",
      },
      forbidden: {
        title: "Forbidden",
        description: "Capturing screenshots is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while capturing the screenshot",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while capturing the screenshot",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while capturing the screenshot",
      },
    },
    success: {
      title: "Screenshot Captured Successfully",
      description: "The screenshot was captured successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      captureAutomation: "Capture Automation",
    },
  },
  "take-snapshot": {
    title: "Take Snapshot",
    titleShort: "Snapshot",
    description:
      "Get the a11y tree of the page as text. Required before click/fill/drag — provides element UIDs.",
    form: {
      label: "Take Snapshot",
      description:
        "Capture a text snapshot of the browser page based on the a11y tree",
      fields: {
        verbose: {
          label: "Verbose",
          description:
            "Whether to include all possible information available in the full a11y tree (default: false)",
          placeholder: "false",
        },
        filePath: {
          label: "File Path",
          description:
            "The absolute path, or a path relative to the current working directory, to save the snapshot to instead of attaching it to the response",
          placeholder: "/path/to/snapshot.txt",
        },
      },
    },
    response: {
      success: "Snapshot captured successfully",
      result: "Snapshot capture result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while capturing the snapshot",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to capture snapshots",
      },
      forbidden: {
        title: "Forbidden",
        description: "Capturing snapshots is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while capturing the snapshot",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while capturing the snapshot",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while capturing the snapshot",
      },
    },
    success: {
      title: "Snapshot Captured Successfully",
      description: "The snapshot was captured successfully",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      captureAutomation: "Capture Automation",
    },
  },
  "wait-for": {
    title: "Wait For",
    titleShort: "Wait",
    dynamicTitle: "Wait: {{text}}",
    description:
      "Wait for specific text to appear on the page. Use after navigation or actions that trigger async updates.",

    form: {
      label: "Wait For Text",
      description: "Wait for specific text to appear on the page",
      fields: {
        text: {
          label: "Text",
          description: "Text to appear on the page",
          placeholder: "Enter text to wait for",
        },
        timeout: {
          label: "Timeout",
          description:
            "Maximum wait time in milliseconds. If set to 0, the default timeout will be used",
          placeholder: "Enter timeout (ms)",
        },
        captureSnapshot: {
          label: "Capture Snapshot",
          description:
            "When enabled, includes the full accessibility snapshot in the response. Disabled by default to keep responses concise.",
        },
      },
    },

    response: {
      success: "Wait operation successful",
      result: "Wait operation result",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during the wait operation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform wait operations",
      },
      forbidden: {
        title: "Forbidden",
        description: "Wait operation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred during the wait operation",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during the wait operation",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during the wait operation",
      },
    },

    success: {
      title: "Wait Operation Successful",
      description: "The specified text appeared on the page",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser Automation",
      waitAutomation: "Wait Automation",
    },
  },
  title: "Chrome DevTools MCP Tools",
  description:
    "Browser automation via Chrome DevTools. Flow: new-page → take-snapshot → interact (click/fill) → verify.",
  category: "Browser",
  summary:
    "Access Chrome DevTools Protocol tools through MCP for web automation",
  tags: {
    browserAutomation: "Browser Automation",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "MCP Tools",
    webDebugging: "Web Debugging",
    performanceAnalysis: "Performance Analysis",
    inputAutomation: "Input Automation",
    captureAutomation: "Capture Automation",
    debugging: "Debugging",
    dialogAutomation: "Dialog Automation",
    navigationAutomation: "Navigation Automation",
    networkAnalysis: "Network Analysis",
    performanceAutomation: "Performance Automation",
    scriptExecution: "Script Execution",
    viewportAutomation: "Viewport Automation",
    waitAutomation: "Wait Automation",
  },

  form: {
    label: "Browser Tool Execution",
    description:
      "Execute Chrome DevTools MCP tools for browser control and analysis",
    fields: {
      tool: {
        label: "Tool",
        description: "Select the Chrome DevTools MCP tool to execute",
        placeholder: "Choose a tool...",
      },
      arguments: {
        label: "Arguments",
        description: "JSON arguments for the selected tool (optional)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },

  tool: {
    // Input automation tools (8)
    click: "Click Element",
    drag: "Drag Element",
    fill: "Fill Input Field",
    fillForm: "Fill Form",
    handleDialog: "Handle Dialog",
    hover: "Hover Element",
    pressKey: "Press Key",
    uploadFile: "Upload File",

    // Navigation automation tools (6)
    closePage: "Close Page",
    listPages: "List Pages",
    navigatePage: "Navigate Page",
    newPage: "New Page",
    selectPage: "Select Page",
    waitFor: "Wait For",

    // Emulation tools (2)
    emulate: "Emulate Device",
    resizePage: "Resize Page",

    // Performance tools (3)
    performanceAnalyzeInsight: "Analyze Performance Insight",
    performanceStartTrace: "Start Performance Trace",
    performanceStopTrace: "Stop Performance Trace",

    // Network tools (2)
    getNetworkRequest: "Get Network Request",
    listNetworkRequests: "List Network Requests",

    // Debugging tools (5)
    evaluateScript: "Evaluate Script",
    getConsoleMessage: "Get Console Message",
    listConsoleMessages: "List Console Messages",
    takeScreenshot: "Take Screenshot",
    takeSnapshot: "Take Snapshot",
  },

  status: {
    pending: "Pending",
    running: "Running",
    completed: "Completed",
    failed: "Failed",
  },

  response: {
    success: "Tool executed successfully",
    result: "Execution result",
    status: "Current execution status",
    statusItem: "Status item",
    executionId: "Execution ID for tracking",
  },

  examples: {
    requests: {
      navigate: {
        title: "Navigate to URL",
        description: "Navigate browser to a specific URL",
      },
      screenshot: {
        title: "Take Screenshot",
        description: "Capture a screenshot of the current page",
      },
      click: {
        title: "Click Element",
        description: "Click on a specific element",
      },
      performance: {
        title: "Start Performance Trace",
        description: "Begin recording performance metrics",
      },
      script: {
        title: "Evaluate Script",
        description: "Execute JavaScript in the browser",
      },
    },
    responses: {
      navigate: {
        title: "Navigation Result",
        description: "Result of page navigation",
      },
      screenshot: {
        title: "Screenshot Result",
        description: "Screenshot capture result",
      },
      click: {
        title: "Click Result",
        description: "Element click result",
      },
      performance: {
        title: "Performance Trace Started",
        description: "Performance tracing initiated",
      },
      script: {
        title: "Script Evaluation Result",
        description: "JavaScript execution result",
      },
    },
  },

  errors: {
    toolExecutionFailed: {
      title: "Tool execution failed",
      description: "The selected tool could not be executed successfully",
    },
    invalidArguments: {
      title: "Invalid Arguments",
      description: "The provided arguments are not valid for this tool",
    },
    browserNotAvailable: {
      title: "Browser Not Available",
      description: "Chrome browser instance is not available",
    },
    toolNotFound: {
      title: "Tool Not Found",
      description: "The requested tool is not available",
    },
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
      toolRequired: "Tool selection is required",
      argumentsInvalid: "Arguments must be valid JSON",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred while executing the tool",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to execute browser tools",
    },
    forbidden: {
      title: "Forbidden",
      description: "Browser tool execution is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested browser tool was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred during tool execution",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during tool execution",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while executing the tool",
    },
  },

  success: {
    title: "Tool Executed Successfully",
    description: "The browser tool was executed successfully",
  },

  shared: {
    instanceId: {
      label: "Session ID",
      description:
        "Browser session ID. Each unique ID gets its own isolated tab. Leave empty to use the default session.",
      placeholder: "e.g. my-session-1",
    },
  },

  repository: {
    execute: {
      start: "Starting browser tool execution",
      success: "Browser tool executed successfully",
      error: "Error executing browser tool",
    },
    mcp: {
      connect: {
        start: "Connecting to Chrome DevTools MCP server",
        success: "Connected to MCP server successfully",
        error: "Failed to connect to MCP server",
        failedToInitialize: "Failed to initialize Chrome DevTools MCP server",
      },
      closePage: {
        noSession: "No active session — nothing to close",
        switchedToPage: "Closed page, switched to page {{pageId}}",
      },
      tool: {
        call: {
          start: "Calling MCP tool",
          success: "MCP tool called successfully",
          error: "Error calling MCP tool",
          invalidJsonArguments: "Invalid JSON arguments",
          executionFailed: "Tool execution failed: {{error}}",
          newPageFailed: "Could not open a new page",
          toolExecutionFailed: "Failed to execute {{toolName}}",
        },
      },
    },
  },
};
