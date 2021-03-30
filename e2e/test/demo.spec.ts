
import { checkA11y, injectAxe } from 'axe-playwright';
import { describe, it, expect } from './fixtures'
require('dotenv').config();
const baseURL = process.env.BASE_URL;
enum Request {
    Server = 'SERVER',
    Client = 'CLIENT',
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE'
}


describe.skip(`Our first test: `, () => {

    it.skip('A simple test', async ({ page }) => {

        // await page.goto(baseURL);
        // expect("1").toBe("2");

    });

    it.skip('Testing a recorded user story via a codegen', async ({ page }) => {

        /**
         * Insert codegen user-story here
         */

        // const id = await page.innerText(`td[id="${Request.Server.toLowerCase()}-id-1"]`);
        // console.debug(`ID: ${id}`)
        // expect(id).toBe("1");

    });

    it.skip('Testing a page for accessibility using built-in fixture', async ({ page }) => {

        // await page.goto(baseURL);
        // await injectAxe(page);
        // await checkA11y(page);

    });

    it('Testing a page using a page-object-model and custom fixture', async ({ indexPage }) => {

        // await indexPage.navigateHome();
        // await indexPage.testAccessibility();

    });


});





















