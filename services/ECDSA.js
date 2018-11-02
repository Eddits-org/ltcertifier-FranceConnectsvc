const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const createKeccakHash = require('keccak');

const { private_key_ECDSA_back } = require('../config').config;

class ECDSA {

  constructor() {
    if(private_key_ECDSA_back) 
      this.privateKey = Buffer.from(private_key_ECDSA_back, 'hex');
    else {
      do {
        this.privateKey = crypto.randomBytes(32)
      } while (!secp256k1.privateKeyVerify(this.privateKey));  
    }
  }

  sign(data) {
    const hash = createKeccakHash('keccak256').update(data).digest();
    return secp256k1.sign(hash, this.privateKey);
  }

}

module.exports = new ECDSA();