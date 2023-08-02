class WristSpasmError extends Error {
  constructor(message, source) {
    super(message);
    this.name = "WristSpasmError";
    this.source = source;
  }

  toString() {
    return this.message;
  }
}

module.exports = WristSpasmError;
