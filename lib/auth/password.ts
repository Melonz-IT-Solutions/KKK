import { randomBytes, scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { compare as bcryptCompare } from 'bcrypt'

const scryptAsync = promisify(scrypt)

const KEY_LENGTH = 64

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')

  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer

  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (/^\$2[aby]\$/.test(storedHash)) {
    try {
      return await bcryptCompare(password, storedHash)
    } catch {
      return false
    }
  }

  const [salt, storedKeyHex] = storedHash.split(':')

  if (!salt || !storedKeyHex) {
    return false
  }

  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
  const storedKey = Buffer.from(storedKeyHex, 'hex')

  if (storedKey.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(derivedKey, storedKey)
}
