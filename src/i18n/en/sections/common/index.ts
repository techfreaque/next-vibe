import { accessibilityTranslations } from "./accessibility";
import { actionsTranslations } from "./actions";
import { ageRangeValuesTranslations } from "./ageRangeValues";
import { apiTranslations } from "./api";
import { buttonTranslations } from "./button";
import { buttonsTranslations } from "./buttons";
import { calendarTranslations } from "./calendar";
import { categoriesTranslations } from "./categories";
import { chartTypesTranslations } from "./chartTypes";
import { companyTranslations } from "./company";
import { countriesTranslations } from "./countries";
import { dateRangesTranslations } from "./dateRanges";
import { durationsTranslations } from "./durations";
import { errorTranslations } from "./error";
import { errorsTranslations } from "./errors";
import { footerTranslations } from "./footer";
import { formTranslations } from "./form";
import { formattingTranslations } from "./formatting";
import { incomeLevelValuesTranslations } from "./incomeLevelValues";
import { incomeRangesTranslations } from "./incomeRanges";
import { infoTranslations } from "./info";
import { interestValuesTranslations } from "./interestValues";
import { languagesTranslations } from "./languages";
import { selectorTranslations } from "./selector";
import { successTranslations } from "./success";
import { uiTranslations } from "./ui";
import { warningTranslations } from "./warning";
import { weekdayTranslations } from "./weekday";

export const commonTranslations = {
  accessibility: accessibilityTranslations,
  actions: actionsTranslations,
  ageRangeValues: ageRangeValuesTranslations,
  api: apiTranslations,
  button: buttonTranslations,
  buttons: buttonsTranslations,
  calendar: calendarTranslations,
  categories: categoriesTranslations,
  chartTypes: chartTypesTranslations,
  company: companyTranslations,
  countries: countriesTranslations,
  dateRanges: dateRangesTranslations,
  durations: durationsTranslations,
  error: errorTranslations,
  errors: errorsTranslations,
  footer: footerTranslations,
  form: formTranslations,
  formatting: formattingTranslations,
  incomeLevelValues: incomeLevelValuesTranslations,
  incomeRanges: incomeRangesTranslations,
  info: infoTranslations,
  interestValues: interestValuesTranslations,
  languages: languagesTranslations,
  selector: selectorTranslations,
  success: successTranslations,
  ui: uiTranslations,
  warning: warningTranslations,
  weekday: weekdayTranslations,
  appName: "Social Media Service Center",
  appShortName: "Social Media SC",
  description:
    "Professional social media management platform to grow your business",
  logoPart1: "Social Media",
  logoPart2: "Service Center",
  search: "Search",
  filter: "Filter",
  loading: "Loading...",
  saving: "Saving...",
  saved: "Saved",
  refresh: "Refresh",
  noResults: "No results found",
  cancel: "Cancel",
  save: "Save",
  close: "Close",
  active: "Active",
  more: "more",
  rows: "rows",
  confirmDelete: "Are you sure you want to delete this item?",
  comingSoon: "Coming soon...",
  noCompany: "No company",
  dateFormat: "MMM d, yyyy",
  dateFormatLong: "MMMM d, yyyy",
  dateTimeFormat: "MMM d, yyyy h:mm a",
  languageOnly: "Language Only",
  add: "Add",
  adding: "Adding...",
  characters: "characters",
  total: "total",
  searchOptions: "Search options...",
  searchCountries: "Search countries...",
  noOptionsFound: "No options found.",
  noCountryFound: "No country found.",
  useCustomValue: 'Use "{{value}}" as custom value',
  addTags: "Add tags...",
  addCustomValue: 'Add "{{value}}"',
  enterPhoneNumber: "Enter phone number",
  preferred: "Preferred",
  allCountries: "All Countries",
  required: "Required",
  selectDate: "Select date",
  selectOption: "Select an option",
  backToHome: "Back to home",
  processing: "Processing...",
  tryAgainLater: "Please try again later",
  unknownFieldType: "Unknown field type",
  customValue: "Custom",
  all: "All",
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
  timePeriod: "Time Period",
  // Task system related
  dryRun: "Dry Run",
  dryRunDescription: "Execute without making actual changes",
  taskNames: "Task Names",
  taskNamesDescription: "Specific task names to execute (optional)",
  selectTasks: "Select tasks...",
  force: "Force",
  forceDescription: "Force execution even if tasks are not due",
  taskName: "Task Name",
  duration: "Duration",
  executedAt: "Executed At",
  message: "Message",
  detailed: "Detailed",
  detailedDescription: "Show detailed information",
  uptime: "Uptime",
  id: "ID",
  status: "Status",
  lastRun: "Last Run",
  nextRun: "Next Run",
  schedule: "Schedule",
  // Unique cron repository error messages
  cronRepositoryTaskUpdateFailed: "Failed to update cron task",
  cronRepositoryTaskDeleteFailed: "Failed to delete cron task",
  cronRepositoryExecutionCreateFailed: "Failed to create cron execution",
  cronRepositoryExecutionUpdateFailed: "Failed to update cron execution",
  cronRepositoryExecutionsFetchFailed: "Failed to fetch cron executions",
  cronRepositoryRecentExecutionsFetchFailed:
    "Failed to fetch recent executions",
  cronRepositorySchedulesFetchFailed: "Failed to fetch task schedules",
  cronRepositoryScheduleUpdateFailed: "Failed to update task schedule",
  cronRepositoryStatisticsFetchFailed: "Failed to fetch task statistics",
  // Unique cron status endpoint error types
  cronStatusGetValidationFailed: "Invalid cron status request parameters",
  cronStatusGetNetworkError: "Network error while fetching cron status",
  cronStatusGetUnauthorized: "Unauthorized access to cron status",
  cronStatusGetForbidden: "Access forbidden to cron status",
  cronStatusGetNotFound: "Cron status resource not found",
  cronStatusGetServerError: "Server error while fetching cron status",
  cronStatusGetUnknownError: "Unknown error occurred in cron status",
  cronStatusGetUnsavedChanges: "Unsaved changes in cron status",
  cronStatusGetConflict: "Conflict in cron status operation",
  // Unique cron history endpoint error types
  cronHistoryGetValidationFailed: "Invalid cron history request parameters",
  cronHistoryGetNetworkError: "Network error while fetching cron history",
  cronHistoryGetUnauthorized: "Unauthorized access to cron history",
  cronHistoryGetForbidden: "Access forbidden to cron history",
  cronHistoryGetNotFound: "Cron history resource not found",
  cronHistoryGetServerError: "Server error while fetching cron history",
  cronHistoryGetUnknownError: "Unknown error occurred in cron history",
  cronHistoryGetUnsavedChanges: "Unsaved changes in cron history",
  cronHistoryGetConflict: "Conflict in cron history operation",
  // Unique cron stats endpoint error types
  cronStatsGetValidationFailed: "Invalid cron stats request parameters",
  cronStatsGetNetworkError: "Network error while fetching cron stats",
  cronStatsGetUnauthorized: "Unauthorized access to cron stats",
  cronStatsGetForbidden: "Access forbidden to cron stats",
  cronStatsGetNotFound: "Cron stats resource not found",
  cronStatsGetServerError: "Server error while fetching cron stats",
  cronStatsGetUnknownError: "Unknown error occurred in cron stats",
  cronStatsGetUnsavedChanges: "Unsaved changes in cron stats",
  cronStatsGetConflict: "Conflict in cron stats operation",
  // Side tasks translations
  sideTasksTitle: "Side Tasks Management",
  sideTasksDescription: "Manage background side tasks",
  sideTasksCategory: "System Tasks",
  sideTasksContainerTitle: "Side Tasks Configuration",
  sideTasksContainerDescription: "Configure side task operations",
  sideTasksActionLabel: "Action",
  sideTasksActionDescription: "Select the action to perform",
  sideTasksActionList: "List Tasks",
  sideTasksActionGet: "Get Task",
  sideTasksActionCreate: "Create Task",
  sideTasksActionUpdate: "Update Task",
  sideTasksActionDelete: "Delete Task",
  sideTasksIdLabel: "Task ID",
  sideTasksIdDescription: "Unique identifier for the task",
  sideTasksNameLabel: "Task Name",
  sideTasksNameDescription: "Name of the side task",
  sideTasksDataLabel: "Task Data",
  sideTasksDataDescription: "Additional data for the task",
  sideTasksLimitLabel: "Limit",
  sideTasksLimitDescription: "Maximum number of results to return",
  sideTasksActionStats: "Get Statistics",
  sideTasksActionExecutions: "Get Executions",
  sideTasksActionHealthCheck: "Health Check",
  // Unique side tasks repository error messages
  sideTasksRepositoryFetchAllFailed: "Failed to fetch all side tasks",
  sideTasksRepositoryFetchByIdFailed: "Failed to fetch side task by ID",
  sideTasksRepositoryCreateFailed: "Failed to create side task",
  sideTasksRepositoryUpdateFailed: "Failed to update side task",
  sideTasksRepositoryDeleteFailed: "Failed to delete side task",
  sideTasksRepositoryExecutionCreateFailed:
    "Failed to create side task execution",
  sideTasksRepositoryExecutionUpdateFailed:
    "Failed to update side task execution",
  sideTasksRepositoryExecutionsFetchFailed:
    "Failed to fetch side task executions",
  sideTasksRepositoryHealthCheckCreateFailed:
    "Failed to create side task health check",
  sideTasksRepositoryHealthChecksFetchFailed:
    "Failed to fetch side task health checks",
  sideTasksRepositoryStatisticsFetchFailed:
    "Failed to fetch side task statistics",
  // Unique task types repository error messages
  taskTypesRepositoryFetchFailed: "Failed to fetch task types",
  taskTypesRepositoryValidationFailed: "Failed to validate task types",
  taskTypesRepositoryExportFailed: "Failed to export task types",
  // Pulse task translations
  pulseExecuteTitle: "Execute Pulse Task",
  pulseExecuteDescription: "Execute a pulse task operation",
  pulseStatusTitle: "Pulse Status",
  pulseStatusDescription: "Get pulse system status",
  pulseTaskType: "Pulse Task",
  pulseContainerTitle: "Pulse Task Configuration",
  pulseContainerDescription: "Configure pulse task operations",
  // Unique pulse task error messages - each endpoint gets unique keys
  pulseExecutePostValidationFailed:
    "Invalid pulse execution request parameters",
  pulseExecutePostNetworkError: "Network error during pulse execution",
  pulseExecutePostUnauthorized: "Unauthorized access to pulse execution",
  pulseExecutePostForbidden: "Access forbidden to pulse execution",
  pulseExecutePostNotFound: "Pulse execution resource not found",
  pulseExecutePostServerError: "Server error during pulse execution",
  pulseExecutePostUnknownError: "Unknown error occurred during pulse execution",
  pulseExecutePostUnsavedChanges: "Unsaved changes in pulse execution",
  pulseExecutePostConflict: "Conflict in pulse execution operation",
  pulseStatusGetValidationFailed: "Invalid pulse status request parameters",
  pulseStatusGetNetworkError: "Network error while fetching pulse status",
  pulseStatusGetUnauthorized: "Unauthorized access to pulse status",
  pulseStatusGetForbidden: "Access forbidden to pulse status",
  pulseStatusGetNotFound: "Pulse status resource not found",
  pulseStatusGetServerError: "Server error while fetching pulse status",
  pulseStatusGetUnknownError: "Unknown error occurred in pulse status",
  pulseStatusGetUnsavedChanges: "Unsaved changes in pulse status",
  pulseStatusGetConflict: "Conflict in pulse status operation",
};
