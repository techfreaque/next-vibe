/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * IMAP Type Inference Tests
 *
 * This file contains type-level tests for IMAP endpoint type inference.
 * These tests will fail at compile-time if the type inference breaks.
 *
 * DO NOT DELETE - This prevents regressions in type inference logic.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
  ResponseType,
  SuccessResponseType,
  ErrorResponseType,
} from "next-vibe/shared/types/response.schema";

import type imapAccountsListDefinition from "@/app/api/[locale]/v1/core/emails/imap-client/accounts/list/definition";
import type imapAccountTestDefinition from "@/app/api/[locale]/v1/core/emails/imap-client/accounts/test/definition";
import type imapConfigDefinition from "@/app/api/[locale]/v1/core/emails/imap-client/config/definition";
import type {
  DeleteEndpointTypes,
  EndpointReturn,
  ExtractEndpointTypes,
  GetEndpointTypes,
  PrimaryMutationTypes,
} from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";

// Helper type to test if two types are exactly equal
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

/**
 * IMAP ACCOUNTS LIST TYPE INFERENCE TEST
 * Test the actual imap accounts list definition that's failing
 */

// Step 1: Verify the definition structure
type ImapStep1_DefType = typeof imapAccountsListDefinition;
type ImapStep1_Check = "GET" extends keyof ImapStep1_DefType ? true : false;
type ImapStep1_Verify = Expect<Equal<ImapStep1_Check, true>>;

// Step 2: Extract GET endpoint
type ImapStep2_GetEndpoint = typeof imapAccountsListDefinition.GET;
type ImapStep2_Check = "types" extends keyof ImapStep2_GetEndpoint
  ? true
  : false;
type ImapStep2_Verify = Expect<Equal<ImapStep2_Check, true>>;

// Step 3: Extract ResponseOutput from types
type ImapStep3_ResponseOutput = typeof imapAccountsListDefinition.GET extends {
  types: { ResponseOutput: infer R };
}
  ? R
  : never;

// Step 4: Verify it has proper structure (not any or never)
type ImapStep4_IsNotNever = ImapStep3_ResponseOutput extends never
  ? false
  : true;

// Step 5: Extract the response type using ExtractEndpointTypes
type ImapStep5_ExtractedTypes = ExtractEndpointTypes<
  typeof imapAccountsListDefinition.GET
>;
type ImapStep5_ResponseType = ImapStep5_ExtractedTypes["response"];

// Step 6: Verify extracted type has 'accounts' property
type ImapStep6_HasAccounts = "accounts" extends keyof ImapStep5_ResponseType
  ? true
  : false;

// Step 7: Test EndpointReturn type (what useEndpoint actually returns)

type ImapStep7_EndpointReturn = EndpointReturn<
  typeof imapAccountsListDefinition
>;

// Verify read property exists and is not never
type ImapStep7_HasRead = "read" extends keyof ImapStep7_EndpointReturn
  ? true
  : false;
type ImapStep7_ReadVerify = Expect<Equal<ImapStep7_HasRead, true>>;

// Extract the read property type
type ImapStep7_ReadType = ImapStep7_EndpointReturn["read"];

// Verify read is not never or undefined
type ImapStep7_ReadNotNever = ImapStep7_ReadType extends never ? false : true;
type ImapStep7_ReadNotNeverVerify = Expect<Equal<ImapStep7_ReadNotNever, true>>;

// Verify read has response property
type ImapStep7_ReadHasResponse = "response" extends keyof ImapStep7_ReadType
  ? true
  : false;
type ImapStep7_ReadHasResponseVerify = Expect<
  Equal<ImapStep7_ReadHasResponse, true>
>;

// Extract the response type from read
type ImapStep7_ResponseType = ImapStep7_ReadType extends { response: infer R }
  ? R
  : never;

// Verify response is ResponseType wrapped - check if it has 'success' property
type ImapStep7_ResponseIsResponseType = ImapStep7_ResponseType extends
  | { success: boolean }
  | undefined
  ? true
  : false;
type ImapStep7_ResponseIsResponseTypeVerify = Expect<
  Equal<ImapStep7_ResponseIsResponseType, true>
>;

// Extract the data type from ResponseType (when success = true)
type ImapStep7_DataType = ImapStep7_ResponseType extends
  | ResponseType<infer TData>
  | undefined
  ? TData
  : never;

// Verify data has accounts property
type ImapStep7_DataHasAccounts = "accounts" extends keyof ImapStep7_DataType
  ? true
  : false;
type ImapStep7_DataHasAccountsVerify = Expect<
  Equal<ImapStep7_DataHasAccounts, true>
>;

// Step 8: Verify accounts is an array
type ImapStep8_AccountsType = ImapStep7_DataType extends {
  accounts: infer A;
}
  ? A
  : never;
// Check if accounts is an array by verifying it extends readonly array
type ImapStep8_AccountsIsArray =
  ImapStep8_AccountsType extends readonly (infer _Item)[] ? true : false;
type ImapStep8_AccountsIsArrayVerify = Expect<
  Equal<ImapStep8_AccountsIsArray, true>
>;

// Step 9: Verify data type is properly typed (not never)
type ImapStep9_DataIsNotNever = ImapStep7_DataType extends never ? false : true;
type ImapStep9_DataIsNotNeverVerify = Expect<
  Equal<ImapStep9_DataIsNotNever, true>
>;

// Export a dummy value to make this a valid module
export const IMAP_TYPE_TESTS_PASS = true;

