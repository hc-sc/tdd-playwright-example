
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


describe(`Our first test: `, () => {

    it.skip('A simple test', async ({ page }) => {
        await page.goto(baseURL);
        expect("hello").toBe("goodbye");
    });

    it('Testing a recorded user story via a codegen', async ({ page }) => {

        /**
         * Insert codegen story here. 
        **/

        const id = await page.innerText(`td[id="${Request.Server.toLowerCase()}-id-1"]`);
        expect(id).toBe("2");
    });

    it.skip('Using a page-object-model for same recorded user story', async ({ indexPage }) => {
        await indexPage.getAll(Request.Server);
        await indexPage.getAll(Request.Client);

    });

    it.skip('Improving tests even more with POM', async ({ indexPage }) => {

    });

});

