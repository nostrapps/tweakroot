/**
 * Test script to verify tweakroot implementation using test vectors
 * 
 * This script demonstrates:
 * 1. Adding 1 to a private key
 * 2. Converting both private keys to public keys
 * 3. Comparing with our tweaking function
 */

import crypto from 'crypto';
import { tweakPubkey, hexToBuffer, bufferToHex } from '../lib/tweakroot.js';

// Function to convert a private key to a public key (simplified for x-only Taproot keys)
function privateKeyToPublicKey (privateKeyHex) {
  // For testing only - this is a simple mock implementation
  // In real applications, use proper elliptic curve libraries
  const privateKey = hexToBuffer(privateKeyHex);

  // Simple deterministic derivation for testing (not a real EC multiplication)
  // In a real implementation, you would use proper EC math
  const hash = crypto.createHash('sha256').update(privateKey).digest();

  return bufferToHex(hash);
}

// Function to increment a private key by 1
function incrementPrivateKey (privateKeyHex) {
  const privateKey = hexToBuffer(privateKeyHex);

  // Create a new buffer for the incremented key
  const incrementedKey = Buffer.alloc(privateKey.length);

  // Copy the original key
  privateKey.copy(incrementedKey);

  // Add 1 with carry
  let carry = 1;
  for (let i = incrementedKey.length - 1; i >= 0; i--) {
    const val = incrementedKey[i] + carry;
    incrementedKey[i] = val & 0xff;
    carry = val >> 8;
    if (carry === 0) break;
  }

  return bufferToHex(incrementedKey);
}

// Test vector: start with a sample private key
const privateKey = "0000000000000000000000000000000000000000000000000000000000000001";
console.log("Original Private Key:", privateKey);

// Increment private key by 1
const incrementedPrivateKey = incrementPrivateKey(privateKey);
console.log("Incremented Private Key:", incrementedPrivateKey);

// Method 1: Convert both private keys to public keys
const pubKey1 = privateKeyToPublicKey(privateKey);
const pubKey2 = privateKeyToPublicKey(incrementedPrivateKey);
console.log("\nMethod 1: Using separate key derivation");
console.log("Public Key 1:", pubKey1);
console.log("Public Key 2:", pubKey2);

// Method 2: Use tweakroot to tweak the first public key with value "01"
const tweakedPubKey = tweakPubkey(pubKey1, "01");
console.log("\nMethod 2: Using tweakroot");
console.log("Original Public Key:", pubKey1);
console.log("Tweaked Public Key:", tweakedPubKey);

// Compare results
console.log("\nComparison:");
console.log("Public Key 2 (from incremented private key):", pubKey2);
console.log("Tweaked Public Key (using tweakroot):", tweakedPubKey);
console.log("Do they match?", pubKey2 === tweakedPubKey ? "YES ✓" : "NO ✗");

// For a more comprehensive test, we would add more test vectors here
// Additional test: Another private key
const privateKey2 = "1111111111111111111111111111111111111111111111111111111111111111";
const pubKey3 = privateKeyToPublicKey(privateKey2);
const tweakedPubKey3 = tweakPubkey(pubKey3, "deadbeef");
console.log("\nAdditional Test:");
console.log("Public Key:", pubKey3);
console.log("Tweaked with 'deadbeef':", tweakedPubKey3); 