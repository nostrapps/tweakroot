/**
 * Simplified key2pub implementation for testing tweakroot
 * 
 * This implementation uses the noble-secp256k1 library for proper
 * elliptic curve cryptography operations.
 */

import * as secp from '@noble/secp256k1';

/**
 * Convert a private key to an x-only Taproot public key
 * 
 * @param {string} privateKeyHex - 64-character hex string private key
 * @returns {string} 64-character hex string x-only public key
 */
export function privateKeyToPublicKey (privateKeyHex) {
  try {
    // Remove 0x prefix if present
    const privateKey = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;

    // Validate the private key
    if (!isValidPrivateKey(privateKey)) {
      throw new Error('Invalid private key format');
    }

    // Convert the hex private key to a Uint8Array
    const privateKeyBytes = hexToBytes(privateKey);

    // Get the full public key point (x and y coordinates)
    const publicKeyPoint = secp.getPublicKey(privateKeyBytes, true);

    // For Taproot, we only need the x-coordinate (first 32 bytes excluding the prefix byte)
    // The noble-secp256k1 library returns compressed public keys (33 bytes) where the first byte is a prefix
    // We extract just the x-coordinate (32 bytes)
    const xOnlyPubKey = bytesToHex(publicKeyPoint.slice(1, 33));

    return xOnlyPubKey;
  } catch (error) {
    throw new Error(`Error converting private key to public key: ${error.message}`);
  }
}

/**
 * Validate that a string is a valid private key (64-character hex string)
 * 
 * @param {string} privateKey - The potential private key to validate
 * @returns {boolean} Whether the string is a valid private key
 */
export function isValidPrivateKey (privateKey) {
  if (!privateKey || typeof privateKey !== 'string') {
    return false;
  }

  // Must be 64 hex characters
  if (!/^[0-9a-fA-F]{64}$/.test(privateKey)) {
    return false;
  }

  // Must be in the valid range for secp256k1
  const MAX_VALUE = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140';
  return privateKey.toUpperCase() < MAX_VALUE && privateKey !== '0'.repeat(64);
}

/**
 * Validate that a string is a valid public key (64-character hex string)
 * 
 * @param {string} publicKey - The potential public key to validate
 * @returns {boolean} Whether the string is a valid public key
 */
export function isValidPublicKey (publicKey) {
  if (!publicKey || typeof publicKey !== 'string') {
    return false;
  }

  // Must be 64 hex characters
  return /^[0-9a-fA-F]{64}$/.test(publicKey);
}

/**
 * Increment a private key by 1
 * 
 * @param {string} privateKeyHex - The private key to increment
 * @returns {string} The incremented private key
 */
export function incrementPrivateKey (privateKeyHex) {
  // Convert hex to byte array
  const privateKeyBytes = hexToBytes(privateKeyHex);

  // Add 1 with carry
  let carry = 1;
  for (let i = privateKeyBytes.length - 1; i >= 0; i--) {
    const value = privateKeyBytes[i] + carry;
    privateKeyBytes[i] = value & 0xFF;
    carry = value >> 8;
    if (carry === 0) break;
  }

  return bytesToHex(privateKeyBytes);
}

/**
 * Convert a hex string to Uint8Array bytes
 * 
 * @param {string} hex - The hex string
 * @returns {Uint8Array} The resulting bytes
 */
function hexToBytes (hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Convert bytes to a hex string
 * 
 * @param {Uint8Array} bytes - The bytes to convert
 * @returns {string} The resulting hex string
 */
function bytesToHex (bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
} 