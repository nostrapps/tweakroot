/**
 * Script to explore the API of noble-secp256k1 v2
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

// Check if Point class exists and what methods it has
console.log('\nPoint class exists:', !!secp256k1.Point);
if (secp256k1.Point) {
  console.log('Point methods:');
  Object.getOwnPropertyNames(secp256k1.Point.prototype).forEach(method => {
    if (method !== 'constructor') {
      console.log(`  ${method}: ${typeof secp256k1.Point.prototype[method]}`);
    }
  });

  console.log('Point static methods:');
  Object.getOwnPropertyNames(secp256k1.Point).forEach(method => {
    if (typeof secp256k1.Point[method] === 'function') {
      console.log(`  ${method}: ${typeof secp256k1.Point[method]}`);
    }
  });
}

// Test tweaking functionality
try {
  console.log('\nTesting public key tweaking:');

  const pubkeyHex = 'f0af509a88ab631d8df6fa7eace35a84b034646e85c1bc593bbb31bd2ca84fe2';
  const tweakHex = '01';

  console.log('Original pubkey:', pubkeyHex);
  console.log('Tweak value:', tweakHex);

  // Try using Point class if available
  if (secp256k1.Point && secp256k1.Point.fromHex) {
    console.log('\nAttempting to use Point.fromHex:');
    try {
      // Try with 02 prefix (even y)
      const pubPoint = secp256k1.Point.fromHex('02' + pubkeyHex);
      console.log('  Successfully created point from pubkey with 02 prefix');

      // Try to get a point from the tweak value
      const tweakPoint = secp256k1.Point.fromPrivateKey(Buffer.from(tweakHex.padStart(64, '0'), 'hex'));
      console.log('  Successfully created point from tweak');

      // Try to add the points
      const tweakedPoint = pubPoint.add(tweakPoint);
      console.log('  Successfully added points');

      // Get the x-coordinate
      const tweakedPubkey = Buffer.from(tweakedPoint.toRawBytes(true).slice(1)).toString('hex');
      console.log('  Tweaked pubkey:', tweakedPubkey);
    } catch (error) {
      console.error('  Error with Point operations:', error.message);
    }
  }

  // Try using pointAddScalar if available
  if (secp256k1.utils && secp256k1.utils.pointAddScalar) {
    console.log('\nAttempting to use pointAddScalar:');
    try {
      const compressedPubkey = Buffer.from('02' + pubkeyHex, 'hex');
      const tweakBytes = Buffer.from(tweakHex.padStart(64, '0'), 'hex');

      const tweakedPointBytes = secp256k1.utils.pointAddScalar(compressedPubkey, tweakBytes);
      const tweakedPubkey = Buffer.from(tweakedPointBytes.slice(1)).toString('hex');

      console.log('  Tweaked pubkey:', tweakedPubkey);
    } catch (error) {
      console.error('  Error with pointAddScalar:', error.message);
    }
  }

  // Try using lower-level methods
  console.log('\nAttempting to use getPublicKey:');
  try {
    // We can't directly tweak the pubkey, but for testing we can derive a pubkey from the tweak
    const tweakBytes = Buffer.from(tweakHex.padStart(64, '0'), 'hex');
    const tweakPubkey = secp256k1.getPublicKey(tweakBytes, true);

    console.log('  Public key derived from tweak:', Buffer.from(tweakPubkey.slice(1)).toString('hex'));
  } catch (error) {
    console.error('  Error with getPublicKey:', error.message);
  }

} catch (error) {
  console.error('Error during testing:', error.message);
} 