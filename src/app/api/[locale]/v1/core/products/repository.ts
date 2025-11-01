import { type ProductIds } from "./repository-client";
import { type Countries } from "@/i18n/core/config";

export interface ProductsRepository { 
    getProductStripeId(productId: ProductIds, country: Countries): string;
}
