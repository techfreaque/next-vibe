/**
 * Type utilities for extracting field names and types from endpoint definitions
 * Native re-exports all types from web implementation
 */

export type {
  EndpointFieldStructure,
  ExtractFieldPaths,
  GetFieldByPath,
  FieldConfigMap,
  EndpointFieldName,
  TypedEndpointFields,
  GetFieldConfig,
  InferFormValues,
} from "../../../web/ui/form/endpoint-field-types";

export {
  isValidFieldPath,
  getFieldStructureByPath,
} from "../../../web/ui/form/endpoint-field-types";
