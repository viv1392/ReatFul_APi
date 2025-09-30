function productPayload() {
  return {
    name: `Apple MacBook Pro 16`, // unique
    data: {
      year: 2019,
      price: 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB"
    }
  }
}

function invalidProductPayload() {
  // Missing required fields / wrong types to trigger validation errors
  return {
    name: 12345, // invalid type
    data: {
      year: 'not-a-number',
    }
  };
}

function productPayloadSet() {
  // Return a small set of payloads to exercise variations
  return [
    productPayload(),
    {
      name: 'Budget Laptop',
      data: {
        year: 2021,
        price: 499.99,
        'CPU model': 'Intel i3',
        'Hard disk size': '256 GB'
      }
    },
    {
      name: 'Gaming Rig',
      data: {
        year: 2024,
        price: 2999.99,
        'CPU model': 'AMD Ryzen 9',
        'Hard disk size': '2 TB'
      }
    }
  ];
}

module.exports = { productPayload, invalidProductPayload, productPayloadSet };
