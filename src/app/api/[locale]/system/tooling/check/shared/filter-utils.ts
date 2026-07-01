/**
 * Shared filtering utilities for check routes
 * Supports simple string matching, regex patterns, and multiple filters
 */

export interface FilterableIssue {
  file: string;
  message: string;
  rule?: string;
}

/**
 * Parse filter input into regex patterns
 * Supports multiple formats with auto-detection:
 * 1. Explicit regex: "/pattern/flags" -> /pattern/flags
 * 2. Glob patterns: test files or src subdirectories -> converted to regex
 * 3. Bare regex: "\.test\.ts$" -> treats as regex if it has regex syntax
 * 4. Simple substring: "components" -> case-insensitive substring match
 * 5. Arrays: ["filter1", "filter2"] -> OR logic
 */
export function parseFilters(filter: string | string[] | undefined): RegExp[] {
  if (!filter) {
    return [];
  }

  const filters = Array.isArray(filter) ? filter : [filter];
  const patterns: RegExp[] = [];

  for (const f of filters) {
    const trimmed = f.trim();
    if (!trimmed) {
      continue;
    }

    // Format 1: Explicit regex pattern with slashes and optional flags
    // Example: /\.test\.ts$/gi
    const slashMatch = trimmed.match(/^\/(.+?)\/([gimsuvy]*)$/);
    if (slashMatch) {
      try {
        patterns.push(new RegExp(slashMatch[1], slashMatch[2]));
        continue;
      } catch {
        // Invalid regex, fall through to next format
      }
    }

    // Format 2: Glob patterns (e.g., *.test.ts or src/**/*.tsx)
    // Example: *.test.ts -> .*\.test\.ts$
    if (isGlobPattern(trimmed)) {
      try {
        patterns.push(new RegExp(globToRegex(trimmed)));
        continue;
      } catch {
        // Invalid glob->regex conversion, fall through
      }
    }

    // Format 3: Try as bare regex if it has clear regex syntax
    // Example: \.test\.ts$ or [a-z]+\.test\.ts$
    if (hasRegexSyntax(trimmed)) {
      try {
        patterns.push(new RegExp(trimmed));
        continue;
      } catch {
        // Invalid regex, fall through
      }
    }

    // Format 4: Default to case-insensitive substring match
    patterns.push(new RegExp(escapeRegex(trimmed), "i"));
  }

  return patterns;
}

/**
 * Check if a string looks like a glob pattern (e.g., *.test.ts)
 * Glob patterns use * and ? but not in ways that are valid regex
 */
function isGlobPattern(str: string): boolean {
  // Has * or ? but not in a valid regex context
  return /[*?]/.test(str) && !str.includes("[") && !str.includes("(");
}

/**
 * Convert a glob pattern to a regex pattern
 * Handles both simple patterns (*.test.ts) and path patterns (src/nested/files.tsx)
 * Patterns without slashes are automatically made recursive (prepend **)
 */
function globToRegex(glob: string): string {
  let pattern = glob;
  const hasPath = pattern.includes("/");

  // If pattern doesn't contain /, prepend ** to match anywhere
  if (!hasPath && !pattern.startsWith("**")) {
    pattern = `**/${pattern}`;
  }

  // Replace glob wildcards with placeholders BEFORE escaping other special chars
  // Handle ** before * to distinguish them
  pattern = pattern.replace(/\*\*/g, "\x00"); // Placeholder for **
  pattern = pattern.replace(/\*/g, "\x01"); // Placeholder for *
  pattern = pattern.replace(/\?/g, "\x02"); // Placeholder for ?

  // Now escape regex special chars (everything except our placeholders)
  pattern = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");

  // Replace placeholders with regex equivalents
  // ** at the start means "optional path/" to handle both root-level and nested files
  // eslint-disable-next-line no-control-regex
  if (pattern.startsWith("\x00/")) {
    // eslint-disable-next-line no-control-regex
    pattern = pattern.replace(/\x00\//, "(?:.*\\/)?");
  } else {
    // ** in the middle followed by / should match zero or more path segments
    // eslint-disable-next-line no-control-regex
    pattern = pattern.replace(/\x00\//g, "(?:.*\\/)?");
    // Any remaining ** matches everything
    // eslint-disable-next-line no-control-regex
    pattern = pattern.replace(/\x00/g, ".*");
  }

  // eslint-disable-next-line no-control-regex
  pattern = pattern.replace(/\x01/g, "[^/]*"); // * matches anything except /
  // eslint-disable-next-line no-control-regex
  pattern = pattern.replace(/\x02/g, "[^/]"); // ? matches any single char except /

  // Add end anchor to avoid matching too much
  if (!pattern.endsWith("$")) {
    pattern += "$";
  }

  return pattern;
}

/**
 * Check if a string has regex syntax that distinguishes it from a plain substring.
 * Looks for regex metacharacters and patterns that indicate regex intent.
 * Note: Glob patterns are handled separately and don't count as regex syntax.
 */
function hasRegexSyntax(str: string): boolean {
  // Skip glob patterns - they're handled separately
  if (isGlobPattern(str)) {
    return false;
  }

  // Contains regex metacharacters (excluding * and ? which are glob)
  const hasMetaChars = /[\\^$+()[\]{}|]/.test(str);

  // Contains character classes or groups
  const hasCharClass = /\[.+?\]/.test(str);

  // Starts or ends with anchors
  const hasAnchors = /^[\^]|[$]$/.test(str);

  // Contains escaped characters (like \d, \w, \.)
  const hasEscapes = /\\[dwsWSDnr]/.test(str);

  // Obvious quantifiers after something
  const hasQuantifiers = /[^\\][+]/.test(str);

  return (
    hasMetaChars || hasCharClass || hasAnchors || hasEscapes || hasQuantifiers
  );
}

/**
 * Escape special regex characters for literal matching
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Check if an issue matches any of the filter patterns
 * Tries to match against file path first (for file-specific regex patterns),
 * then against the combined searchable text for broader matches
 */
export function matchesFilter(
  issue: FilterableIssue,
  patterns: RegExp[],
): boolean {
  if (patterns.length === 0) {
    return true; // No filter = match all
  }

  // First try matching against just the file path
  // This allows patterns like "\.test\.ts$" to work as expected
  for (const pattern of patterns) {
    if (pattern.test(issue.file)) {
      return true;
    }
  }

  // If no file path match, try against combined searchable text
  // This allows matching against messages and rule names too
  const searchableText = [issue.file, issue.message, issue.rule || ""].join(
    " ",
  );

  return patterns.some((pattern) => pattern.test(searchableText));
}

/**
 * Filter issues based on filter parameter
 * Returns filtered issues
 */
export function filterIssues<T extends FilterableIssue>(
  issues: T[],
  filter: string | string[] | undefined,
): T[] {
  const patterns = parseFilters(filter);
  if (patterns.length === 0) {
    return issues;
  }

  return issues.filter((issue) => matchesFilter(issue, patterns));
}

/**
 * Calculate summary statistics for filtered results
 * Only includes fields that are contextually relevant:
 * - totalErrors: only when different from totalIssues (i.e., there are warnings)
 * - filteredIssues/filteredFiles: only when filter is applied
 * - displayedIssues/displayedFiles: only when paginated
 * - currentPage/totalPages: only when multiple pages exist
 * - truncatedMessage: only when there's actual truncation
 */
export interface FilteredSummary {
  totalIssues: number;
  totalFiles: number;
  totalErrors?: number;
  filteredIssues?: number;
  filteredFiles?: number;
  displayedIssues?: number;
  displayedFiles?: number;
  currentPage?: number;
  totalPages?: number;
  truncatedMessage?: string;
}

export function calculateFilteredSummary<
  T extends FilterableIssue & { severity: string },
>(
  allIssues: T[],
  filteredIssues: T[],
  paginatedIssues: T[],
  page: number,
  limit: number,
): FilteredSummary {
  const totalIssues = allIssues.length;
  const totalFiles = new Set(allIssues.map((issue) => issue.file)).size;
  const totalErrors = allIssues.filter(
    (issue) => issue.severity === "error",
  ).length;

  const filteredIssuesCount = filteredIssues.length;
  const filteredFiles = new Set(filteredIssues.map((issue) => issue.file)).size;

  const displayedIssues = paginatedIssues.length;
  const displayedFiles = new Set(paginatedIssues.map((issue) => issue.file))
    .size;

  const totalPages = Math.ceil(filteredIssuesCount / limit);

  // Determine what to show based on context
  const isFiltered = filteredIssuesCount !== totalIssues;
  const isPaginated = totalPages > 1;
  const hasWarnings = totalErrors !== totalIssues;
  const isTruncated =
    displayedIssues < filteredIssuesCount || displayedFiles < filteredFiles;

  const summary: FilteredSummary = {
    totalIssues,
    totalFiles,
  };

  // Only show totalErrors when there are warnings (errors !== total)
  if (hasWarnings) {
    summary.totalErrors = totalErrors;
  }

  // Only show filtered counts when filter is applied
  if (isFiltered) {
    summary.filteredIssues = filteredIssuesCount;
    summary.filteredFiles = filteredFiles;
  }

  // Only show displayed counts when paginated
  if (isPaginated) {
    summary.displayedIssues = displayedIssues;
    summary.displayedFiles = displayedFiles;
    summary.currentPage = page;
    summary.totalPages = totalPages;
  }

  // Only show truncated message when there's actual truncation
  if (isTruncated) {
    summary.truncatedMessage = `Showing ${displayedIssues} of ${filteredIssuesCount} issues from ${displayedFiles} of ${filteredFiles} files`;
  }

  return summary;
}
