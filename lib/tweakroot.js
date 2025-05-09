/**
 * tweakroot - A library for tweaking Taproot public keys
 * 
 * This library implements proper Taproot tweaking by adding a value to a public key
 * as if that value had been added to the corresponding private key.
 * In elliptic curve terms, this is point addition on the secp256k1 curve.
 */

import * as tinysecp from 'tiny-secp256k1';

/**
 * Convert a hex string to Uint8Array
 * @param {string} hex - The hex string to convert
 * @returns {Uint8Array} The resulting bytes
 */
export function hexToBytes (hex) {
  if (!hex || typeof hex !== 'string') {
    throw new Error('Invalid hex string');
  }

  // Remove 0x prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (!/^[0-9a-fA-F]*$/.test(cleanHex)) {
    throw new Error('Invalid hex characters');
  }

  // Fallback implementation
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Convert bytes to a hex string
 * @param {Uint8Array} bytes - The bytes to convert
 * @returns {string} The resulting hex string
 */
export function bytesToHex (bytes) {
  // Fallback implementation
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validate that the input is a valid 64-character hex string (32 bytes)
 * @param {string} pubkey - The public key to validate
 * @returns {boolean} Whether the public key is valid
 */
export function isValidPubkey (pubkey) {
  if (!pubkey || typeof pubkey !== 'string') {
    return false;
  }
  // Remove 0x prefix if present
  const cleanPubkey = pubkey.startsWith('0x') ? pubkey.slice(2) : pubkey;
  return /^[0-9a-fA-F]{64}$/.test(cleanPubkey);
}

/**
 * Converts a Taproot private key (64-character hex string) to a public key (64-character hex string)
 *
 * @param {string} privateKey - 64-character hex string representing the private key
 * @returns {string} 64-character hex string representing the public key
 * @throws {Error} if the private key format is invalid
 */
export function key2pub (privateKey) {
  // Validate private key format
  if (!/^[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error(
      'Invalid private key format. Expected 64-character hex string.'
    )
  }

  try {
    // Convert private key to buffer
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

    // Use tiny-secp256k1 to derive the public key
    const publicKeyBuffer = tinysecp.pointFromScalar(privateKeyBuffer, true);

    if (!publicKeyBuffer) {
      throw new Error('Failed to derive public key');
    }

    // Get the x-coordinate (first 32 bytes after the compression byte) as hex
    // Since publicKeyBuffer is a Uint8Array, convert it to hex properly
    const pubkeyX = bytesToHex(publicKeyBuffer.slice(1, 33));

    return pubkeyX;
  } catch (error) {
    throw new Error(
      `Failed to convert private key to public key: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Add a tweak value to a private key in the scalar field
 * 
 * @param {string} privateKeyHex - 64-character hex string private key
 * @param {string} tweakHex - hex string tweak value
 * @returns {string} tweaked private key as a 64-character hex string
 */
export function addTweakToPrivateKey (privateKeyHex, tweakHex) {
  // Convert to buffers
  const privateKey = Buffer.from(privateKeyHex, 'hex');

  // Pad the tweak with leading zeros if it's shorter than 64 characters
  const paddedTweakHex = tweakHex.padStart(64, '0');
  const tweak = Buffer.from(paddedTweakHex, 'hex');

  // First negate the tweak by using privateNegate
  const negatedTweak = tinysecp.privateNegate(tweak);

  // Then add the negated tweak to the private key
  const result = tinysecp.privateAdd(privateKey, negatedTweak);

  // Return null if result is null (this would happen if result is 0)
  if (!result) {
    // Handle edge case: If the result is 0, return a zero-filled string
    return '0'.padStart(64, '0');
  }

  // Convert back to hex and ensure it's padded to 64 characters
  return bytesToHex(result).padStart(64, '0');
}

/**
 * Tweak a Taproot public key by adding a tweak value as if the tweak
 * had been added to the corresponding private key.
 * 
 * @param {string} pubkeyHex - The 64-character hex string public key (x-only)
 * @param {string} tweakHex - The hex string tweak value
 * @param {boolean} [positive=false] - Whether to use positive tweak (true) or negative tweak (false)
 * @returns {string} The tweaked public key as a 64-character hex string
 */
export function tweakPubkey (pubkeyHex, tweakHex, positive = true) {
  // Validate inputs
  if (!isValidPubkey(pubkeyHex)) {
    throw new Error('Invalid public key: must be a 64-character hex string');
  }

  // Pad the tweak with leading zeros if it's shorter than 64 characters
  const paddedTweakHex = tweakHex.padStart(64, '0');

  try {
    // Convert the x-only pubkey to a compressed point by prepending 0x02
    // (we use 0x02 to represent even y-coordinate, but the parity doesn't 
    // matter as we'll only use the x-coordinate of the result)
    const pubkeyPoint = Buffer.from('02' + pubkeyHex, 'hex');

    // Convert tweak to buffer
    const tweakBuffer = Buffer.from(paddedTweakHex, 'hex');

    // Process the tweak based on the positive flag
    let finalTweakBuffer;
    if (positive) {
      // Use the tweak as-is (addition)
      finalTweakBuffer = tweakBuffer;
    } else {
      // Negate the tweak (subtraction)
      finalTweakBuffer = tinysecp.privateNegate(tweakBuffer);
    }

    // Use tiny-secp256k1 to add the appropriate tweak to the point
    const resultPoint = tinysecp.pointAddScalar(pubkeyPoint, finalTweakBuffer, true);

    if (!resultPoint) {
      throw new Error('Point addition resulted in infinity');
    }

    // Extract x-coordinate (bytes 1-33, excluding the compression prefix)
    // Convert to hex properly since resultPoint is a Uint8Array
    const tweakedPubkeyX = bytesToHex(resultPoint.slice(1, 33));

    return tweakedPubkeyX;
  } catch (error) {
    throw new Error(`Failed to tweak public key: ${error.message}`);
  }
} 