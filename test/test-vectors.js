/**
 * Test vectors verification for tweakroot
 * 
 * This script verifies the tweaking implementation against specific test vectors.
 */

import { tweakPubkey, key2pub, addTweakToPrivateKey } from '../lib/tweakroot.js';

// Test vectors from the user
const testVectors = {
  privateKey: '1cb2d0ef03b4a5eadacd261913a27b36bb8fe7d8f59492fd7cb05a0987b8c377',
  publicKey: '24ad6dc8c0a0182660d00435edcba749b06e47ea78d0194add3ff522e0e084e4',
  privateKeyPlus1: 'b2205d95c7ee36fd27bffc44d42b1d62c3a7abccf6fc660d2ef1e55e7aa33ed5',
  tweakedPublicKeyPlus1: 'a08ac0b7f09c8abd0a4e5207050359b420e59bcba2b8684b9b0fa822a39591e9'
};

// Step 1: Verify we can convert private key to public key correctly
console.log('=== TEST VECTOR VERIFICATION ===');
console.log('\nStep 1: Verify private key to public key conversion');
const derivedPublicKey = key2pub(testVectors.privateKey);
console.log('Expected public key:  ', testVectors.publicKey);
console.log('Calculated public key:', derivedPublicKey);
const pubkeyMatch = derivedPublicKey === testVectors.publicKey;
console.log('Match?', pubkeyMatch ? 'YES ✓' : 'NO ✗');

// Step 2: Verify we can add 1 to the private key correctly
console.log('\nStep 2: Verify adding 1 to private key');
const calculatedPrivateKeyPlus1 = addTweakToPrivateKey(testVectors.privateKey, '01');
console.log('Expected private key + 1:  ', testVectors.privateKeyPlus1);
console.log('Calculated private key + 1:', calculatedPrivateKeyPlus1);
const privKeyMatch = calculatedPrivateKeyPlus1 === testVectors.privateKeyPlus1;
console.log('Match?', privKeyMatch ? 'YES ✓' : 'NO ✗');

// Step 3: Verify we can derive the tweaked public key from the tweaked private key
console.log('\nStep 3: Derive public key from private key + 1');
const derivedTweakedPublicKey = key2pub(calculatedPrivateKeyPlus1);
console.log('Expected tweaked public key:  ', testVectors.tweakedPublicKeyPlus1);
console.log('Calculated tweaked public key:', derivedTweakedPublicKey);
const tweakedPubKeyMatch = derivedTweakedPublicKey === testVectors.tweakedPublicKeyPlus1;
console.log('Match?', tweakedPubKeyMatch ? 'YES ✓' : 'NO ✗');

// Step 4: Test our tweakPubkey function with the tweak value "01"
console.log('\nStep 4: Test our tweakPubkey function');
try {
  const tweakedPublicKey = tweakPubkey(testVectors.publicKey, '01');
  console.log('Expected tweaked public key:  ', testVectors.tweakedPublicKeyPlus1);
  console.log('tweakPubkey function result:  ', tweakedPublicKey);
  const implementationMatch = tweakedPublicKey === testVectors.tweakedPublicKeyPlus1;
  console.log('Match?', implementationMatch ? 'YES ✓' : 'NO ✗');

  if (!implementationMatch) {
    console.log('\nThe current implementation does not correctly tweak the public key.');
    console.log('We need to update it to perform the correct elliptic curve operation.');
  }
} catch (error) {
  console.error('ERROR in tweakPubkey:', error.message);
}

// Summary
console.log('\n=== SUMMARY ===');
if (pubkeyMatch && privKeyMatch && tweakedPubKeyMatch) {
  console.log('✅ Test vectors validation successful');
} else {
  console.log('❌ Test vector validation failed');
  console.log('We need to ensure our implementation correctly tweaks public keys.');
} 