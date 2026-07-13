export interface UserProfile {
  id: string;
  age: number;
  email: string;
}

export type UserId = string;

export function createUser(
  id: UserId,
  age: number,
  email: string,
): UserProfile {
  return { id, age, email };
}
