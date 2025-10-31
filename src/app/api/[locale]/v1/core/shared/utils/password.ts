/**
 * Password utility functions
 * Provides secure password hashing and verification using Argon2
 */

import "server-only";

import * as argon2 from "argon2";

/**
 * Hash a password using Argon2
 * @param password - The password to hash
 * @returns Promise with the hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  // Use Argon2id which is a hybrid of Argon2i and Argon2d
  // It provides protection against both side-channel attacks and GPU cracking
  return await argon2.hash(password, {
    type: argon2.argon2id,
    // These are recommended parameters for password hashing
    memoryCost: 65_536, // 64 MiB
    timeCost: 3, // 3 iterations
    parallelism: 4, // 4 parallel threads
  });
}

/**
 * Verify a password against a hash
 * @param password - The password to verify
 * @param hashedPassword - The stored hashed password
 * @returns Promise with boolean indicating if the password matches
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch {
    // If the hash format is invalid or there's another error, return false
    return false;
  }
}
