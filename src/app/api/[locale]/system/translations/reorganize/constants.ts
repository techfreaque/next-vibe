/**
 * Translation Reorganization System Constants
 *
 * Centralized configuration constants for the translation reorganization system.
 * These constants represent meaningful configuration values that may need to be changed.
 */

import path from "node:path";

// === DIRECTORY PATHS ===

/**
 * Directory and file name constants
 */
// eslint-disable-next-line i18next/no-literal-string
export const I18N_PATH = "i18n";

export const INDEX_FILE_WITHOUT_EXTENSION = "index";
export const INDEX_FILE = `${INDEX_FILE_WITHOUT_EXTENSION}.ts`;

/**
 * Main translations directory path
 */
export const TRANSLATIONS_DIR = path.resolve(
  path.join(process.cwd(), "src", I18N_PATH),
);

/**
 * Backup directory for translation files
 */
export const BACKUP_DIR = path.resolve(
  process.cwd(),
  ".tmp/translations-backup",
);

/**
 * Source directory for scanning files
 */
export const SRC_DIR = path.resolve(process.cwd(), "src");

// === FILE SCANNING CONFIGURATION ===

/**
 * Directories to ignore when scanning for translation usage
 */
export const IGNORED_DIRS = [
  "node_modules",
  ".next",
  "dist",
  ".tmp",
  I18N_PATH,
];

/**
 * Files to ignore when scanning for translation usage
 */
export const IGNORED_FILES = [".DS_Store", "thumbs.db"];

/**
 * File extensions to include when scanning for translation usage
 */
export const FILE_EXTENSIONS = [".ts", ".tsx"];

/**
 * Test file pattern to exclude from scanning
 */
export const TEST_FILE_PATTERN = ".test.";

// === DEFAULT LOCATIONS ===

/**
 * Default location for unused translation keys
 */
export const UNUSED_KEYS_LOCATION = "src/app/api/[locale]/v1/common/unused";

// === BACKUP CONFIGURATION ===

/**
 * Prefix for backup directory names
 */
export const BACKUP_PREFIX = "translations-";

// === FOLDER TRANSFORMATION RULES ===

/**
 * Folders to skip when generating key paths
 */
export const SKIP_FOLDERS = ["src", "[locale]", I18N_PATH];

/**
 * Folder transformation mappings
 */
export const FOLDER_TRANSFORMATIONS = {
  _components: "components",
} as const;

// === API IMPORT CONFIGURATION ===

/**
 * API import path for main index
 */
export const API_IMPORT_PATH = "./sections/core/api";

/**
 * Location translations prefix for imports
 */
export const LOCATION_TRANSLATIONS_PREFIX = "locationTranslations";

// === FILE PROTOCOL ===

/**
 * File protocol prefix for dynamic imports
 */

export const FILE_PROTOCOL = "file://";

// === TEMPLATE STRINGS ===

/**
 * API translations import statement
 */

export const API_TRANSLATIONS_IMPORT = `import { apiTranslations } from "${API_IMPORT_PATH}";`;

/**
 * API translations key for main index object
 */

export const API_TRANSLATIONS_KEY = "  api: apiTranslations";

// === TEMPLATE CONSTANTS ===

/**
 * Main index template for generating new index files
 */
export const MAIN_INDEX_TEMPLATE = `{locationBasedImports}

const translations = {translationsObject} as const;

export default translations;
`;

/**
 * Placeholder for location-based imports in templates
 */
export const LOCATION_IMPORTS_PLACEHOLDER = "{locationBasedImports}";

/**
 * Placeholder for translations object in templates
 */
export const TRANSLATIONS_OBJECT_PLACEHOLDER = "{translationsObject}";

// === STRING FORMATTING CONSTANTS ===

/**
 * Import template parts
 */
export const IMPORT_TEMPLATE_START = "import { translations as ";
export const IMPORT_TEMPLATE_END = ' } from "';
export const IMPORT_CLOSE = '";';

/**
 * Object formatting constants
 */
export const OBJECT_OPEN = "{\n";
export const OBJECT_CLOSE = "\n}";
export const COMMA_NEWLINE = ",\n";
export const QUOTE = '"';
export const COLON_SPACE = ": ";
export const SPACE_SPACE = "  ";
export const DOT_SLASH = "./";

/**
 * File extension for temporary files
 */
export const TMP_EXTENSION = ".tmp";
