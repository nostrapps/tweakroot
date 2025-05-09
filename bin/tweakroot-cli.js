#!/usr/bin/env node

/**
 * tweakroot-cli - A command-line tool for tweaking Taproot public keys
 * 
 * This tool implements proper Taproot tweaking by adding a value to a public key
 * as if that value had been added to the corresponding private key.
 * In elliptic curve terms, this is point addition on the secp256k1 curve.
 */

import { tweakPubkey, isValidPubkey } from '../lib/tweakroot.js';

// Process command line arguments
const args = process.argv.slice(2);
const usage = `
tweakroot-cli - Tweak a Taproot public key

Usage: tweakroot-cli <pubkey> <tweak>

Arguments:
  pubkey    64-character hex string public key (x-only)
  tweak     Hex string tweak value

Examples:
  tweakroot-cli 79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798 deadbeef
  tweakroot-cli --help

Note: 
  This tool performs elliptic curve point addition, equivalent to adding
  the tweak value to the private key and then deriving the public key.
`;

// Handle help command
if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(usage);
  process.exit(0);
}

// Check if we have the right number of arguments
if (args.length !== 2) {
  console.error('Error: Two arguments are required.');
  console.log(usage);
  process.exit(1);
}

const [pubkey, tweak] = args;

// Validate the public key
if (!isValidPubkey(pubkey)) {
  console.error('Error: Invalid public key. Must be a 64-character hex string.');
  process.exit(1);
}

try {
  // Perform the tweaking operation
  const tweakedPubkey = tweakPubkey(pubkey, tweak);

  // Output the result
  console.log('Original pubkey:', pubkey);
  console.log('Tweak value:    ', tweak);
  console.log('Tweaked pubkey: ', tweakedPubkey);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
} 