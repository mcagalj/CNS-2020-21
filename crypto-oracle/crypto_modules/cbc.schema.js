exports.defs = {
  $id: "defs",
  definitions: {
    stringOrBuffer: { anyOf: [{ type: "string" }, { instanceof: "Buffer" }] },
    boolean: { type: "boolean" },
    string: { type: "string" }
  }
};

exports.encrypt = {
  $id: "cbc_encrypt",
  title: "CBC encryption params scheme",
  type: "object",
  properties: {
    key: { $ref: "defs#/definitions/stringOrBuffer" },
    iv: { $ref: "defs#/definitions/stringOrBuffer" },
    plaintext: { $ref: "defs#/definitions/stringOrBuffer" },
    padding: { $ref: "defs#/definitions/string" },
    inputEncoding: { $ref: "defs#/definitions/string" },
    outputEncoding: { $ref: "defs#/definitions/string" }
  },
  required: ["key", "plaintext"]
};

exports.decrypt = {
  $id: "cbc_decrypt",
  title: "CBC decryption params scheme",
  type: "object",
  properties: {
    key: { $ref: "defs#/definitions/stringOrBuffer" },
    iv: { $ref: "defs#/definitions/stringOrBuffer" },
    ciphertext: { $ref: "defs#/definitions/stringOrBuffer" },
    padding: { $ref: "defs#/definitions/string" },
    inputEncoding: { $ref: "defs#/definitions/string" },
    outputEncoding: { $ref: "defs#/definitions/string" }
  },
  required: ["key", "iv", "ciphertext"]
};
