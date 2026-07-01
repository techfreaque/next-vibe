import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";

function isJsonObject(value: WidgetData): value is Record<string, WidgetData> {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof File) &&
    !(value instanceof Blob) &&
    !(value instanceof Date)
  );
}

export function containsFile(obj: WidgetData): boolean {
  if (obj instanceof File) {
    return true;
  }
  if (obj instanceof Blob) {
    return true;
  }
  if (Array.isArray(obj)) {
    return obj.some((item) => containsFile(item));
  }
  if (obj && typeof obj === "object") {
    return Object.values(obj).some((value) => containsFile(value));
  }
  return false;
}

function extractFiles(
  obj: WidgetData,
  parentKey = "",
  result: Array<[string, File | Blob]> = [],
): Array<[string, File | Blob]> {
  if (obj instanceof File || obj instanceof Blob) {
    result.push([parentKey, obj]);
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      extractFiles(item, `${parentKey}[${index}]`, result);
    });
  } else if (isJsonObject(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      extractFiles(value, parentKey ? `${parentKey}.${key}` : key, result);
    }
  }
  return result;
}

function stripFiles(obj: WidgetData): WidgetData {
  if (obj instanceof File || obj instanceof Blob) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(stripFiles);
  }
  if (isJsonObject(obj)) {
    const result: Record<string, WidgetData> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = stripFiles(value);
    }
    return result;
  }
  return obj;
}

export function objectToFormData(obj: Record<string, WidgetData>): FormData {
  const formData = new FormData();
  const jsonData = stripFiles(obj);
  formData.append("data", JSON.stringify(jsonData));
  const files = extractFiles(obj);
  for (const [key, file] of files) {
    formData.append(key, file);
  }
  return formData;
}
