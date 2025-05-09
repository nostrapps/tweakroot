/**
 * Script to explore the API of noble-secp256k1
 */

import * as secp256k1 from '@noble/secp256k1';

console.log('=== Exploring noble-secp256k1 API ===');

// List all available properties and methods
console.log('\nProperties and methods:');
Object.keys(secp256k1).forEach(key => {
  const type = typeof secp256k1[key];
  console.log(`${key}: ${type}`);

  // If it's an object, also show its properties
  if (type === 'object' && secp256k1[key] !== null) {
    console.log('  Properties:');
    Object.keys(secp256k1[key]).forEach(subKey => {
      console.log(`    ${subKey}: ${typeof secp256k1[key][subKey]}`);
    });
  }
});

// Test basic functionality
try {
  console.log('\nTesting basic functionality:');

  // Generate a private key
  const privateKey = secp256k1.utils.randomPrivateKey();
  console.log('Private key (hex):', Buffer.from(privateKey).toString('hex'));

  // Get public key - both compressed and uncompressed
  const publicKeyCompressed = secp256k1.getPublicKey(privateKey, true);
  const publicKeyUncompressed = secp256k1.getPublicKey(privateKey, false);

  console.log('Public key compressed (hex):', Buffer.from(publicKeyCompressed).toString('hex'));
  console.log('Public key uncompressed (hex):', Buffer.from(publicKeyUncompressed).toString('hex'));

  // Try to tweak a private key
  if (typeof secp256k1.utils.privateAdd === 'function') {
    console.log('\nTesting private key tweaking:');
    const tweak = new Uint8Array(32);
    tweak[0] = 1; // Add 1 to the private key

    const tweakedPrivateKey = secp256k1.utils.privateAdd(privateKey, tweak);
    console.log('Tweaked private key (hex):', Buffer.from(tweakedPrivateKey).toString('hex'));

    // Get the public key from tweaked private key
    const tweakedPublicKey = secp256k1.getPublicKey(tweakedPrivateKey, true);
    console.log('Tweaked public key (hex):', Buffer.from(tweakedPublicKey).toString('hex'));
  } else {
    console.log('\nNo privateAdd function found');
  }

  // Try to find any tweaking functions
  console.log('\nLooking for tweaking functions:');
  Object.keys(secp256k1).forEach(key => {
    if (key.toLowerCase().includes('tweak') || key.toLowerCase().includes('add')) {
      console.log(`Found potential function: ${key}`);
    }
  });

  if (secp256k1.utils) {
    Object.keys(secp256k1.utils).forEach(key => {
      if (key.toLowerCase().includes('tweak') || key.toLowerCase().includes('add')) {
        console.log(`Found potential utils function: ${key}`);
      }
    });
  }

} catch (error) {
  console.error('Error during testing:', error.message);
} 