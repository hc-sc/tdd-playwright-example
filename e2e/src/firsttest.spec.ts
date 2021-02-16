import { it, describe, expect } from "@playwright/test"

const baseURL = "https://tdd-playwright-example-server.herokuapp.com";

//Root 
describe("Check for Elements, ", () => {
    it("Endpoint: Root", async ({ page }) => {
        await page.goto(baseURL);

        const serverTable = await page.$('table');
        expect(serverTable).toBeDefined();

        const clientTable = await page.$('#js-employees');
        expect(clientTable).toBeDefined();
    });

    it("Endpoint: Get Employees", async ({ page }) => {
        await page.goto(baseURL + "/employees");

        const serverTable = await page.textContent('table');
        expect(serverTable).toBeDefined();

        const clientTable = await page.$('#js-employees');
        expect(clientTable).toBeDefined();
    });

    it("Endpoint: Get Employee by ID", async ({ page }) => {
        await page.goto(baseURL + "/employees/1");

        const serverTable = await page.textContent('table');
        expect(serverTable).toBeDefined();

        const clientTable = await page.$('#js-employees');
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