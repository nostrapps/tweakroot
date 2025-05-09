import * as tinysecp from 'tiny-secp256k1';

const privateKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const privateKeyBuffer = Buffer.from(privateKey, 'hex');

// Use tiny-secp256k1 to derive the public key
const publicKeyBuffer = tinysecp.pointFromScalar(privateKeyBuffer, true);

// Log the buffer and its string representation
console.log('Public key buffer:', publicKeyBuffer);
console.log('Public key buffer type:', typeof publicKeyBuffer);
console.log('Public key buffer length:', publicKeyBuffer.length);
console.log('String representation:', publicKeyBuffer.toString());
console.log('Hex representation:', publicKeyBuffer.toString('hex'));
console.log('X-coordinate hex:', publicKeyBuffer.slice(1, 33).toString('hex')); 