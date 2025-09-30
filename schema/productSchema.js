// schemas/productResponseSchema.js
module.exports= {
  type: "object",
  required: ["id", "name", "createdAt", "data"],
  properties: {
    id: { type: "string" }, // UUID or unique string
    name: { type: "string" },
    createdAt: { type: "string", format: "date-time" }, // ISO timestamp
    data: {
      type: "object",
      required: ["year", "price", "CPU model", "Hard disk size"],
      properties: {
        year: { type: "integer" },
        price: { type: "number" },
        "CPU model": { type: "string" },
        "Hard disk size": { type: "string" }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};
