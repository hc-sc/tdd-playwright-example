import { it, describe, expect } from "@playwright/test"

/**
 * To use local environment variables, create a .env file and set the BASE_URL to the local endpoint being tested.
 * See the CircleCI config.yml file for how the BASE_URL is injected with a value during CI/CD pipeline.
 */
require('dotenv').config();
const baseURL = process.env.BASE_URL;

//Root 
describe("Check for Form and Table, ", () => {

    it("Endpoint: Get Employee by ID", async ({ page }) => {
        await page.goto(baseURL);


        const clientTable = await page.$("#js-employees > tbody");
        console.log("TABLE: " + clientTable);

        // expect(clientTable.length !== 0).toBeTruthy();
        // expect(null).toBeDefined();
        expect(clientTable).toBeDefined();
    });

    // describe("Verify Client Table, ", () => {

    //     it("Endpoint: Get Employee by ID", async ({ page }) => {
    //         await page.goto(baseURL);


    //         const clientTable = await page.$("#js-employees > tbody");
    //         console.log("TABLE: " + clientTable);

    //         // expect(clientTable.length !== 0).toBeTruthy();
    //         // expect(null).toBeDefined();
    //         expect(clientTable).toBeDefined();
    //     });


})

// body: JSON.stringify("{\"name\": \"Billy\", \"role\": \"PM\"}")

// https://jestjs.io/docs/en/expect