const crypto = require('crypto');

class State {

  constructor() {
    this.storedStateAndNonce = new Map();
  }

  setState(key, state) {
    this.storedStateAndNonce.set(key, { state });
  }

  getState(key) {
    return this.storedStateAndNonce.get(key);
  }

  hasState(key) {
    return this.storedStateAndNonce.has(key);
  }

  deleteState(key) {
    this.storedStateAndNonce.delete(key);
  }

  randomValueHex(len) {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len);  // return required number of characters
  }

}

module.exports = new State();