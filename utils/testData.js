function productPayload() {
  return {
    name: `Apple MacBook Pro 16`, // unique
    data: {
      year: 2019,
      price: 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB"
    }
  };
}

module.exports = { productPayload };
