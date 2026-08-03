/**
 * Desktop API translations (English)
 */

export const translations = {
  "take-screenshot": {
    title: "Take Desktop Screenshot",
    titleShort: "Screenshot",
    dynamicTitle: "Screenshot: {{target}}",
    description: "Capture a screenshot of the desktop or a screen region",
    form: {
      label: "Take Screenshot",
      capturing: "Capturing…",
      refresh: "Retake",
      description:
        "Capture a screenshot of the full desktop or a specific region",
      fields: {
        outputPath: {
          label: "Output Path",
          description:
            "Absolute path to save the screenshot. Omit to return inline base64.",
          placeholder: "/tmp/screenshot.png",
        },
        screen: {
          label: "Screen Index",
          description:
            "Screen/monitor index (0 = primary). Prefer monitorName over this.",
          placeholder: "0",
        },
        monitorName: {
          label: "Monitor Name",
          description:
            "Monitor output name (e.g. DP-1, HDMI-1). Run list-monitors first to see available names.",
          placeholder: "DP-1",
        },
        maxWidth: {
          label: "Max Width",
          description:
            "Downscale to this width if the capture is wider. Useful for AI - 4-monitor captures are massive.",
          placeholder: "1920",
        },
      },
    },
    response: {
      success: "Screenshot captured successfully",
      imagePath: "Path where the screenshot was saved",
      imageData: "Base64-encoded PNG screenshot data",
      imageUrl: "URL to access the screenshot",
      width: "Screenshot width in pixels",
      height: "Screenshot height in pixels",
      monitorName: "Monitor that was captured",
      originalWidth: "Original width before downscaling",
      originalHeight: "Original height before downscaling",
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
        description: "You are not authorized to capture desktop screenshots",
      },
      forbidden: {
        title: "Forbidden",
        description: "Capturing desktop screenshots is forbidden",
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
      notImplemented: {
        title: "Not Implemented",
        description: "This feature is not available on your operating system",
      },
    },
    success: {
      title: "Screenshot Captured",
      description: "The desktop screenshot was captured successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      captureAutomation: "Capture Automation",
    },
  },
  "get-accessibility-tree": {
    title: "Get Accessibility Tree",
    titleShort: "A11y Tree",
    dynamicTitle: "A11y: {{app}}",
    description:
      "Get the accessibility tree of the focused window or a specific application",
    form: {
      label: "Get Accessibility Tree",
      description:
        "Retrieve the AT-SPI accessibility tree for desktop UI inspection",
      fields: {
        appName: {
          label: "Application Name",
          description:
            "Process name or window title to target (omit for focused window)",
          placeholder: "firefox",
        },
        maxDepth: {
          label: "Max Depth",
          description: "Maximum tree depth to traverse (default: 5)",
          placeholder: "5",
        },
        includeActions: {
          label: "Include Actions",
          description:
            "Show available actions per node (click, press, activate...). More detail but bigger output.",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Accessibility tree retrieved successfully",
      tree: "Accessibility tree as structured text",
      nodeCount: "Total number of nodes traversed",
      truncated: "Whether the query timed out and output may be incomplete",
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
          "A network error occurred while retrieving the accessibility tree",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to access the accessibility tree",
      },
      forbidden: {
        title: "Forbidden",
        description: "Accessing the accessibility tree is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The target application or window was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while retrieving the accessibility tree",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unknown error occurred while retrieving the accessibility tree",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description:
          "A conflict occurred while retrieving the accessibility tree",
      },
      notImplemented: {
        title: "Not Implemented",
        description: "This feature is not available on your operating system",
      },
    },
    success: {
      title: "Accessibility Tree Retrieved",
      description: "The accessibility tree was retrieved successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      accessibilityAutomation: "Accessibility Automation",
    },
  },
  "list-monitors": {
    title: "List Monitors",
    titleShort: "Monitors",
    description:
      "List all connected monitors with resolution, position, and index",
    form: {
      label: "List Monitors",
      description:
        "Enumerate all connected displays. Use monitor names to target specific screens for screenshots.",
      fields: {},
    },
    response: {
      success: "Monitors listed successfully",
      monitors: "Array of connected monitors",
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
        description: "A network error occurred while listing monitors",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to list monitors",
      },
      forbidden: {
        title: "Forbidden",
        description: "Listing monitors is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred while listing monitors",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while listing monitors",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while listing monitors",
      },
      notImplemented: {
        title: "Not Implemented",
        description:
          "Monitor listing is not available on your operating system",
      },
    },
    success: {
      title: "Monitors Listed",
      description: "All connected monitors were listed successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      captureAutomation: "Capture Automation",
    },
  },
  click: {
    title: "Click",
    titleShort: "Click",
    dynamicTitle: "Click: {{x}},{{y}}",
    description:
      "Move the mouse to absolute coordinates and perform a mouse click",
    form: {
      label: "Click",
      description: "Move the mouse to the given coordinates and click",
      fields: {
        x: {
          label: "X Coordinate",
          description:
            "Horizontal screen coordinate in pixels (from left edge)",
          placeholder: "100",
        },
        y: {
          label: "Y Coordinate",
          description: "Vertical screen coordinate in pixels (from top edge)",
          placeholder: "200",
        },
        button: {
          label: "Mouse Button",
          description: "Mouse button to click (left, middle, right)",
          placeholder: "left",
          options: {
            left: "Left",
            middle: "Middle",
            right: "Right",
          },
        },
        doubleClick: {
          label: "Double Click",
          description: "Perform a double click instead of a single click",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Click performed successfully",
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
        description: "A network error occurred while performing the click",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to perform desktop clicks",
      },
      forbidden: {
        title: "Forbidden",
        description: "Performing desktop clicks is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while performing the click",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while performing the click",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while performing the click",
      },
      notImplemented: {
        title: "Not Implemented",
        description: "This feature is not available on your operating system",
      },
    },
    success: {
      title: "Click Performed",
      description: "The mouse click was performed successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      inputAutomation: "Input Automation",
    },
  },
  "type-text": {
    title: "Type Text",
    titleShort: "Type Text",
    dynamicTitle: "Type: {{text}}",
    description: "Type text into the focused window using keyboard simulation",
    form: {
      label: "Type Text",
      description: "Send keystrokes to the focused window to type text",
      fields: {
        text: {
          label: "Text",
          description: "The text to type into the focused window",
          placeholder: "Hello, World!",
        },
        delay: {
          label: "Delay (ms)",
          description: "Delay between keystrokes in milliseconds (default: 12)",
          placeholder: "12",
        },
        windowId: {
          label: "Window ID",
          description:
            "Focus this window UUID before typing (from list-windows)",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Window Title",
          description: "Focus window containing this title before typing",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Text typed successfully",
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
        description: "A network error occurred while typing text",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to type text on the desktop",
      },
      forbidden: {
        title: "Forbidden",
        description: "Typing text on the desktop is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred while typing text",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while typing text",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while typing text",
      },
      notImplemented: {
        title: "Not Implemented",
        description: "This feature is not available on your operating system",
      },
    },
    success: {
      title: "Text Typed",
      description: "The text was typed successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      inputAutomation: "Input Automation",
    },
  },
  "press-key": {
    title: "Press Key",
    titleShort: "Press Key",
    dynamicTitle: "Key: {{key}}",
    description: "Press a key or key combination using xdotool",
    form: {
      label: "Press Key",
      description:
        "Send a key press event to the desktop using xdotool key syntax",
      fields: {
        key: {
          label: "Key",
          description:
            "Key name or combination in xdotool syntax (e.g. Return, ctrl+c, alt+F4)",
          placeholder: "Return",
        },
        repeat: {
          label: "Repeat Count",
          description: "Number of times to press the key (default: 1)",
          placeholder: "1",
        },
        delay: {
          label: "Delay (ms)",
          description:
            "Delay between repeated key presses in milliseconds (default: 0)",
          placeholder: "0",
        },
        windowId: {
          label: "Window ID",
          description: "Focus this window UUID before pressing the key",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Window Title",
          description:
            "Focus window containing this title before pressing the key",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Key pressed successfully",
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
        description: "A network error occurred while pressing the key",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to press keys on the desktop",
      },
      forbidden: {
        title: "Forbidden",
        description: "Pressing keys on the desktop is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred while pressing the key",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while pressing the key",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while pressing the key",
      },
      notImplemented: {
        title: "Not Implemented",
        description: "This feature is not available on your operating system",
      },
    },
    success: {
      title: "Key Pressed",
      description: "The key was pressed successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      inputAutomation: "Input Automation",
    },
  },
  "move-mouse": {
    title: "Move Mouse",
    titleShort: "Move Mouse",
    dynamicTitle: "Move: {{x}},{{y}}",
    description: "Move the mouse cursor to absolute screen coordinates",
    form: {
      label: "Move Mouse",
      description: "Move the mouse cursor to the specified screen position",
      fields: {
        x: {
          label: "X Coordinate",
          description:
            "Horizontal screen coordinate in pixels (from left edge)",
          placeholder: "100",
        },
        y: {
          label: "Y Coordinate",
          description: "Vertical screen coordinate in pixels (from top edge)",
          placeholder: "200",
        },
      },
    },
    response: {
      success: "Mouse moved successfully",
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
        description: "A network error occurred while moving the mouse",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to move the mouse on the desktop",
      },
      forbidden: {
        title: "Forbidden",
        description: "Moving the mouse on the desktop is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred while moving the mouse",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while moving the mouse",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while moving the mouse",
      },
      notImplemented: {
        title: "Not Implemented",
        description: "This feature is not available on your operating system",
      },
    },
    success: {
      title: "Mouse Moved",
      description: "The mouse cursor was moved successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      inputAutomation: "Input Automation",
    },
  },
  scroll: {
    title: "Scroll",
    titleShort: "Scroll",
    dynamicTitle: "Scroll: {{direction}}",
    description:
      "Scroll at the current mouse position or specified coordinates",
    form: {
      label: "Scroll",
      description: "Scroll up, down, left, or right at the given position",
      fields: {
        x: {
          label: "X Coordinate",
          description:
            "Horizontal position to scroll at (uses current position if omitted)",
          placeholder: "100",
        },
        y: {
          label: "Y Coordinate",
          description:
            "Vertical position to scroll at (uses current position if omitted)",
          placeholder: "200",
        },
        direction: {
          label: "Direction",
          description: "Scroll direction",
          placeholder: "down",
          options: {
            up: "Up",
            down: "Down",
            left: "Left",
            right: "Right",
          },
        },
        amount: {
          label: "Amount",
          description: "Number of scroll steps (default: 3)",
          placeholder: "3",
        },
      },
    },
    response: {
      success: "Scroll performed successfully",
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
        description: "A network error occurred while scrolling",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to scroll on the desktop",
      },
      forbidden: {
        title: "Forbidden",
        description: "Scrolling on the desktop is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred while scrolling",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while scrolling",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while scrolling",
      },
      notImplemented: {
        title: "Not Implemented",
        description: "This feature is not available on your operating system",
      },
    },
    success: {
      title: "Scroll Performed",
      description: "The scroll was performed successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      inputAutomation: "Input Automation",
    },
  },
  "get-focused-window": {
    title: "Get Focused Window",
    titleShort: "Focused Window",
    description: "Get information about the currently focused window",
    form: {
      label: "Get Focused Window",
      description:
        "Retrieve the window ID, title, and PID of the active window",
      fields: {},
    },
    response: {
      success: "Focused window info retrieved successfully",
      windowId: "X11 window ID of the focused window",
      windowTitle: "Title text of the focused window",
      pid: "Process ID of the focused window",
      width: "Window width in pixels",
      height: "Window height in pixels",
      monitor: "Monitor index the window is on",
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
          "A network error occurred while getting the focused window",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to get window information",
      },
      forbidden: {
        title: "Forbidden",
        description: "Getting window information is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "No focused window was found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while getting the focused window",
      },
      unknown: {
        title: "Unknown Error",
        description:
          "An unknown error occurred while getting the focused window",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while getting the focused window",
      },
      notImplemented: {
        title: "Not Implemented",
        description: "This feature is not available on your operating system",
      },
    },
    success: {
      title: "Focused Window Retrieved",
      description: "The focused window information was retrieved successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      windowManagement: "Window Management",
    },
  },
  "list-windows": {
    title: "List Windows",
    titleShort: "List Windows",
    description: "List all open windows on the desktop",
    form: {
      label: "List Windows",
      description:
        "Retrieve a list of all open windows with their IDs, titles, and positions",
      fields: {},
    },
    response: {
      success: "Window list retrieved successfully",
      windows: "List of open windows",
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
        description: "A network error occurred while listing windows",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to list windows",
      },
      forbidden: {
        title: "Forbidden",
        description: "Listing windows is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "No windows were found",
      },
      serverError: {
        title: "Server Error",
        description: "An internal server error occurred while listing windows",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while listing windows",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while listing windows",
      },
      notImplemented: {
        title: "Not Implemented",
        description: "This feature is not available on your operating system",
      },
    },
    success: {
      title: "Windows Listed",
      description: "The window list was retrieved successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      windowManagement: "Window Management",
    },
  },
  "focus-window": {
    title: "Focus Window",
    titleShort: "Focus Window",
    dynamicTitle: "Focus: {{target}}",
    description: "Bring a window to the foreground and give it focus",
    form: {
      label: "Focus Window",
      description: "Focus a window by its ID, PID, or title",
      fields: {
        windowId: {
          label: "Window ID",
          description:
            "X11 window ID (hexadecimal, e.g. 0x1234). Takes priority over other options.",
          placeholder: "0x1234",
        },
        pid: {
          label: "Process ID",
          description: "Focus the window belonging to this process ID",
          placeholder: "12345",
        },
        title: {
          label: "Window Title",
          description:
            "Focus the window whose title contains this string (case-sensitive)",
          placeholder: "Firefox",
        },
      },
    },
    response: {
      success: "Window focused successfully",
      error: "Error message",
      executionId: "Execution ID for tracking",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please provide at least one of: windowId, pid, or title",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while focusing the window",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to focus windows",
      },
      forbidden: {
        title: "Forbidden",
        description: "Focusing windows is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The specified window was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while focusing the window",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while focusing the window",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while focusing the window",
      },
      notImplemented: {
        title: "Not Implemented",
        description: "This feature is not available on your operating system",
      },
    },
    success: {
      title: "Window Focused",
      description: "The window was brought to the foreground successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      windowManagement: "Window Management",
    },
  },
  "move-window-to-monitor": {
    title: "Move Window to Monitor",
    titleShort: "Move Window",
    dynamicTitle: "Move: {{target}}",
    description: "Move a window to a specific monitor",
    form: {
      label: "Move Window to Monitor",
      description: "Move a window by its ID, PID, or title to a target monitor",
      fields: {
        windowId: {
          label: "Window ID",
          description:
            "KWin internal window UUID (from list-windows). Takes priority over pid and title.",
          placeholder: "{uuid}",
        },
        pid: {
          label: "Process ID",
          description: "Move the window belonging to this process ID",
          placeholder: "12345",
        },
        title: {
          label: "Window Title",
          description:
            "Move the window whose title contains this string (case-insensitive)",
          placeholder: "Firefox",
        },
        monitorName: {
          label: "Monitor Name",
          description:
            "Target monitor name (e.g. DP-1, HDMI-A-1). Use list-monitors to see available names.",
          placeholder: "DP-1",
        },
        monitorIndex: {
          label: "Monitor Index",
          description:
            "Target monitor index (0-based). Use monitorName when possible.",
          placeholder: "0",
        },
      },
    },
    response: {
      success: "Whether the move succeeded",
      movedTo: "Monitor the window was moved to",
      windowTitle: "Title of the window that was moved",
      error: "Error message if the operation failed",
      executionId: "Unique identifier for this execution",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description:
          "Please provide at least one window identifier and a monitor target",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while moving the window",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to move windows",
      },
      forbidden: {
        title: "Forbidden",
        description: "Moving windows is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The specified window or monitor was not found",
      },
      serverError: {
        title: "Server Error",
        description:
          "An internal server error occurred while moving the window",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while moving the window",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that may be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while moving the window",
      },
    },
    success: {
      title: "Window Moved",
      description: "The window was moved to the target monitor successfully",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop Automation",
      windowManagement: "Window Management",
    },
  },

  title: "Desktop Automation Tools",
  description: "Control the desktop: screenshots, mouse, keyboard, windows",
  category: "Desktop",
  summary:
    "Cross-platform desktop automation: Linux (ydotool/KWin/pyatspi) and Windows (PowerShell/UIAutomation)",
  tags: {
    desktopAutomation: "Desktop Automation",
    inputAutomation: "Input Automation",
    windowManagement: "Window Management",
    captureAutomation: "Capture Automation",
    accessibilityAutomation: "Accessibility Automation",
  },

  tool: {
    takeScreenshot: "Take Screenshot",
    getAccessibilityTree: "Get Accessibility Tree",
    listMonitors: "List Monitors",
    click: "Click",
    typeText: "Type Text",
    pressKey: "Press Key",
    moveMouse: "Move Mouse",
    scroll: "Scroll",
    getFocusedWindow: "Get Focused Window",
    listWindows: "List Windows",
    focusWindow: "Focus Window",
    moveWindowToMonitor: "Move Window to Monitor",
  },

  widget: {
    noWindows: "No open windows found",
    windowCount_one: "{{count}} window",
    windowCount_other: "{{count}} windows",
    actionFocus: "Focus",
    actionType: "Type",
    actionKey: "Key",
    actionMove: "Move",
    actionA11y: "A11y",
    actionTypeText: "Type Text",
    actionPressKey: "Press Key",
    actionScreenshot: "Screenshot",
    actionScreenshotOnMonitor: "Screenshot: {{monitor}}",
    actionA11yTree: "A11y Tree",
    actionAllWindows: "← All windows",
    actionAllMonitors: "All monitors →",
    actionScreenshotLink: "Screenshot →",
    actionMoveWindowHere: "Move Window Here",
    labelPrimary: "Primary",
    statusFocused: "Window focused",
    statusTyped: "Typed",
    statusPressed: "Pressed",
    statusMoved: "Moved",
    statusScrolled: "Scrolled",
    statusMouseMoved: "Mouse moved",
    statusClickExecuted: "Click executed",
    labelSaved: "Saved:",
    labelTruncated: "⚠ Truncated",
    filterPlaceholder: "Filter nodes…",
    titleTypeText: "Type Text",
    titlePressKey: "Press Key",
    titleClick: "Click",
    titleScroll: "Scroll",
    titleMoveMouse: "Move Mouse",
    titleMoveWindow: "Move Window",
    titleA11yTree: "Accessibility Tree",
    titleListWindows: "Windows",
    titleListMonitors: "Monitors",
    titleGetFocusedWindow: "Focused Window",
    titleFocusWindow: "Focus Window",
  },

  repository: {
    platformNotSupported:
      "Platform not supported: {{platform}}. Linux and Windows are supported.",
    windowsNotSupported: "Windows support coming soon",
    macosNotSupported: "macOS support coming soon",
    commandFailed: "Command failed: {{error}}",
    toolNotFound:
      "Required tool not found: {{tool}}. Install it with: {{installCmd}}",
    screenshotFailed: "Failed to capture screenshot",
    accessibilityFailed: "Failed to get accessibility tree",
    accessibilityFailedWithError: "Failed to get accessibility tree: {{error}}",
    focusWindowRequiresIdentifier:
      "At least one of windowId, pid, or title is required",
    missingDep:
      "Required system package missing: {{dep}}. A system auth dialog should have appeared - approve it to install automatically.",
    scriptWriteFailed: "Failed to write script: {{error}}",
    monitorNotFoundByName: 'Monitor "{{monitorName}}" not found',
    screenIndexOutOfRange: "Screen index {{screen}} out of range",
    unknownKeyName: "Unknown key name: {{key}}",
    focusedWindowParseFailed: "Failed to parse focused window output",
    couldNotListWindows: "Could not list windows",
    noWindowWithPid: "No window with PID {{pid}}",
    noWindowWithTitle: 'No window with title containing "{{title}}"',
    provideMonitorNameOrIndex: "Provide monitorName or monitorIndex",
    monitorNotFound: "Monitor not found: {{monitor}}",
    noActiveWindow: "No active window",
    kwinNoOutput: "KWin script produced no output",
    kwinNoWindowData: "No window data in KWin script output",
    windowMoveNoEffect:
      "Window move did not take effect — window never reached monitor {{monitor}}",
  },
};
