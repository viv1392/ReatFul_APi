
const { test: baseTest, expect } = require('@playwright/test');
const { userApi } = require('../UserApi/userAPI');

const test = baseTest.extend({
  userApi: async ({ request }, use) => {
    await use(new userApi(request));
  },
});

module.exports = { test, expect };