import { randomBytes, scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

const KEY_LENGTH = 64

/**
 * Hash a password using Node.js built-in crypto.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')

  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer

  return `${salt}:${derivedKey.toString('hex')}`
}

/**
 * Verify a password against the stored hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, storedKeyHex] = storedHash.split(':')

  if (!salt || !storedKeyHex) {
    return false
  }

  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
  const storedKey = Buffer.from(storedKeyHex, 'hex')

  // timingSafeEqual requires equal-length buffers, or it throws — guard
  // against a malformed/corrupted stored hash instead of crashing.
  if (storedKey.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(derivedKey, storedKey)
}
