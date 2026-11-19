export function isContactMessageEmpty(message: string): boolean {
  return /^[\s\p{Default_Ignorable_Code_Point}\p{Cc}]*$/u.test(message);
}
