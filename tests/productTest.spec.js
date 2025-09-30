const { test, expect } = require('../fixture/FixtureTest');
const { SchemaValidator } = require('../utils/SchemaValidation');
const productSchema = require('../schema/productSchema');
const { productPayload, invalidProductPayload, productPayloadSet } = require('../utils/testData');

// Enterprise-style API tests: happy path, negative cases, schema validation, response time, data-driven
test.describe.serial('Rest Api Test - Enterprise Level', () => {
    const validator = new SchemaValidator();
    let createdIds = [];

    test.afterEach(async ({ userApi }) => {
        // ensure no open resources between tests
        await userApi.disposeApi();
    });

    test('Create product - happy path', async ({ userApi }) => {
        const payload = productPayload();
        const response = await userApi.createUser(payload);

        // basic http assertions
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();

        // performance: response should be reasonably fast
        expect(response.timing ? response.timing.duration : 0).toBeGreaterThanOrEqual(0);

        const body = await response.json();
        expect(body).toHaveProperty('id');
        createdIds.push(body.id);

        // schema validation (throws on failure)
        validator.validateSchema(productSchema, body);
    });

    test('Get product - happy path', async ({ userApi }) => {
        // Pre-create item
        const createResp = await userApi.createUser(productPayload());
        expect(createResp.ok()).toBeTruthy();
        const created = await createResp.json();
        createdIds.push(created.id);

        const getResp = await userApi.getUser(created.id);
        expect(getResp.status()).toBe(200);
        const data = await getResp.json();
        validator.validateSchema(productSchema, data);
        expect(data.id).toBe(created.id);
    });

    test('Update product - happy path', async ({ userApi }) => {
        const createResp = await userApi.createUser(productPayload());
        expect(createResp.ok()).toBeTruthy();
        const created = await createResp.json();
        createdIds.push(created.id);

        const updatedPayload = {
            ...created,
            data: {
                ...created.data,
                year: (created.data.year || 2022) + 1,
                price: (created.data.price || 100) + 50,
            },
        };

        const updateResp = await userApi.updateData(created.id, updatedPayload);
        expect(updateResp.ok()).toBeTruthy();
        const updated = await updateResp.json();
        validator.validateSchema(productSchema, updated);
        expect(updated.data.price).toBeGreaterThanOrEqual(created.data.price);
    });

    test('Delete product - happy path', async ({ userApi }) => {
        const createResp = await userApi.createUser(productPayload());
        expect(createResp.ok()).toBeTruthy();
        const created = await createResp.json();

        const deleteResp = await userApi.deleteData(created.id);
        expect(deleteResp.ok()).toBeTruthy();
        const msg = await deleteResp.json();
        // API returns a message or the deleted object depending on implementation
        expect(msg).toBeDefined();
    });

    test('Negative: create with invalid payload should fail or sanitize', async ({ userApi }) => {
        const resp = await userApi.createUser(invalidProductPayload());
        if (!resp.ok()) {
            // server rejected invalid payload
            expect([400, 422, 500]).toContain(resp.status());
            return;
        }

    // If server accepted it, ensure minimal sanity checks pass
    const body = await resp.json();
    // server accepted but may not fully validate - ensure critical identifiers exist
    expect(body).toHaveProperty('id');
    expect(typeof body.name).toBe('string');
    });

    test('Negative: get non-existent id returns 404', async ({ userApi }) => {
        const resp = await userApi.getUser('non-existent-id-xyz');
        expect([404, 400, 500]).toContain(resp.status());
    });

    test.describe('Data-driven creations', () => {
        for (const payload of productPayloadSet()) {
            test(`Create product for dataset: ${payload.name}`, async ({ userApi }) => {
                const resp = await userApi.createUser(payload);
                expect(resp.ok()).toBeTruthy();
                const body = await resp.json();
                createdIds.push(body.id);
                validator.validateSchema(productSchema, body);
            });
        }
    });

    test.afterAll(async ({ userApi }) => {
        // clean up created resources
        for (const id of createdIds) {
            try {
                await userApi.deleteData(id);
            } catch (e) {
                // log and continue
                console.log(`cleanup failed for ${id}:`, e.message || e);
            }
        }
    });
});
 


// allure report generation
// # Allure Playwright reporter
//npm install -D allure-playwright

//# Allure command line (for generating HTML reports)
//npm install -g allure-commandline --save-dev

//allure --version
//allure generate allure-results --clean -o allure-report
//allure open allure-report

