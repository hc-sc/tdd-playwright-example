import { it, describe, expect } from "@playwright/test"
require('dotenv').config();
// const { endpoint } = require('./config');
// const baseURL = process.env.endpoint;
// const baseURL = "https://tdd-playwright-example-server.herokuapp.com";
// const baseURL = "https://localhost:8443"
const baseURL = process.env.BASE_URL;

//Root 
describe("Check for Client Table, ", () => {

    it("Endpoint: Get Employee by ID", async ({ page }) => {
        await page.goto(baseURL);


        const clientTable = await page.$("#js-employees > tbody");
        console.log("TABLE: " + clientTable);

        // expect(clientTable.length !== 0).toBeTruthy();
        // expect(null).toBeDefined();
        expect(clientTable).toBeDefined();
    });

    // it("Endpoint: POST Employee by ID", async ({ page }) => {
    //     await page.route(baseURL + "/employees/add", (route, request) => {
    //         const method = 'POST';
    //         const postData = "{\"name\": \"Billy\", \"role\": \"PM\"}";
    //         route.continue({ method, postData });
    //     });

    //     const response = page.goto(baseURL + "/employees");
    // });

})

// body: JSON.stringify("{\"name\": \"Billy\", \"role\": \"PM\"}")

// https://jestjs.io/docs/en/expect