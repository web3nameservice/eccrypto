/**
 * Node.js eccrypto implementation.
 * @module eccrypto
 */

"use strict";

require("es6-promise").polyfill();
var secp256k1 = require("secp256k1");

/**
 * Compute the public key for a given private key.
 * @param {Buffer} publicKey A 32-byte private key
 * @return {Buffer} A 65-byte public key
 */
exports.getPublic = function(privateKey) {
  return secp256k1.createPublicKey(privateKey);
};

/**
 * Create an ECDSA signature.
 * @param {Buffer} privateKey A 32-byte private key
 * @param {Buffer} msg The message being signed
 * @return {Promise.<Buffer,undefined>} A promise that resolves with the
 * signature or rejects on bad private key/message.
 */
// FIXME(Kagami): What to do in case of invalid nonce?
exports.sign = function(privateKey, msg) {
  return new Promise(function(resolve, reject) {
    try {
      secp256k1.sign(privateKey, msg, function(code, sig) {
        if (code === 1) {
          resolve(sig);
        } else {
          reject();
        }
      });
    } catch(e) {
      reject();
    }
  });
};

/**
 * Verify an ECDSA signature.
 * @param {Buffer} publicKey The public key
 * @param {Buffer} msg The message being verified
 * @param {Buffer} sig The signature
 * @return {Promise} A promise that resolves on correct signature and
 * rejects on bad signature/public key.
 */
exports.verify = function(publicKey, msg, sig) {
  return new Promise(function(resolve, reject) {
    secp256k1.verify(publicKey, msg, sig, function(code) {
      if (code === 1) {
        resolve();
      } else {
        reject();
      }
    });
  });
};
