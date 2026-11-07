/**
 * Utility for secure password hashing and verification using SHA-256
 */

export async function hashPassword(password: string): Promise<string> {
  const salt = 'SMKN1_WARUNGGUNUNG_BKK_SALT_2026';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  
  if (crypto && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Deterministic fallback for environments without crypto.subtle
  let hash = 0;
  const str = password + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

export async function verifyPassword(password: string, expectedHash: string): Promise<boolean> {
  const currentHash = await hashPassword(password);
  return currentHash === expectedHash;
}
