/**
 * Simple example of using the tweakroot library
 */

import { tweakPubkey } from '../lib/tweakroot.js';

// Example Bitcoin secp256k1 public key (64-character hex string)
// This is a well-known example public key from secp256k1
const pubkey = '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798';

// Example tweak value (can be any hex string)
const tweak = 'deadbeef';

// Tweak the public key
const tweakedPubkey = tweakPubkey(pubkey, tweak);

// Print the results
console.log('Original pubkey:', pubkey);
console.log('Tweak value:    ', tweak);
console.log('Tweaked pubkey: ', tweakedPubkey);

// Try with a different tweak
const anotherTweak = '0123456789abcdef';
const anotherTweakedPubkey = tweakPubkey(pubkey, anotherTweak);
console.log('\nWith a different tweak:');
console.log('Original pubkey:', pubkey);
console.log('Tweak value:    ', anotherTweak);
console.log('Tweaked pubkey: ', anotherTweakedPubkey); 