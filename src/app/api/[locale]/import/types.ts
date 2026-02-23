/**
 * Domain-specific Record Interface
 * This interface should be implemented by each domain (leads, contacts, etc.)
 */
export interface DomainRecord {
  id?: string;
  email: string;
  [key: string]: string | number | boolean | null | undefined;
}
