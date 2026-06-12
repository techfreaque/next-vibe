/**
 * Products catalog enums
 * Defines the enums used in the products/catalog module using createEnumOptions pattern
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Product type enum
 * Classifies whether a catalog product is a service, physical good, or digital item
 */
export const {
  enum: ProductType,
  options: ProductTypeOptions,
  Value: ProductTypeValue,
} = createEnumOptions(scopedTranslation, {
  SERVICE: "enums.productType.service",
  PHYSICAL: "enums.productType.physical",
  DIGITAL: "enums.productType.digital",
});

// Create DB enum array for Drizzle
export const ProductTypeDB = [
  ProductType.SERVICE,
  ProductType.PHYSICAL,
  ProductType.DIGITAL,
] as const;
