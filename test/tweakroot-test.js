// Import the tweakroot library
import {
  key2pub,
  tweakPubkey,
  addTweakToPrivateKey
} from '../lib/tweakroot.js';

// Test key2pub function
console.log('Testing key2pub function:');
const privateKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const pubkey = key2pub(privateKey);
console.log('Private key:', privateKey);
console.log('Public key:', pubkey);
console.log();

// Test tweakPubkey function
console.log('Testing tweakPubkey function:');
const tweak = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
const tweakedPubkey = tweakPubkey(pubkey, tweak);
console.log('Original pubkey:', pubkey);
console.log('Tweak value:', tweak);
console.log('Tweaked pubkey:', tweakedPubkey);
console.log();

// Test addTweakToPrivateKey function
console.log('Testing addTweakToPrivateKey function:');
const tweakedPrivkey = addTweakToPrivateKey(privateKey, tweak);
const tweakedPubkeyFromPrivate = key2pub(tweakedPrivkey);
console.log('Original private key:', privateKey);
console.log('Tweak value:', tweak);
console.log('Tweaked private key:', tweakedPrivkey);
console.log('Pubkey from tweaked private key:', tweakedPubkeyFromPrivate);
console.log('Should match tweaked pubkey:', tweakedPubkey === tweakedPubkeyFromPrivate); 