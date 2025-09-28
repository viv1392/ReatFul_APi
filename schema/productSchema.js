const Ajv = require("ajv");
module.exports = { 
  type: "object",
  required: ["id", "name", "data"],
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    data: { 
      type: "object",
      properties: {
        year: { type: "number" },
        price: { type: "number" }
      }
    }
  }
};

