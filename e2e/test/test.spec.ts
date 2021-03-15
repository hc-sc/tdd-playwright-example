import { it, describe, expect, afterEach, beforeEach, beforeAll, afterAll, folio } from "@playwright/test"
import { devices, Browser, Page, chromium, firefox, webkit } from "playwright"
const playwright = require('playwright');
import { injectAxe, checkA11y, getViolations, reportViolations } from 'axe-playwright'
import { IndexPage } from "../PO/IndexPage";


// import {reporter, junit-reporter{require("@wdio/cli/package.json"); // @wdio/cli is a peer dependency. 
// var junitReporter = require("@wdio/junit-reporter")

/**
 * To use local environment variables, create a .env file and set the BASE_URL to the local endpoint being tested.
 * See the CircleCI config.yml file for how the BASE_URL is injected with a value during CI/CD pipeline.
 */

require('dotenv').config();
const baseURL = process.env.BASE_URL;

enum Request {
    Server = "SERVER",
    Client = "CLIENT",
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE"
}


// it("POM TEST", async ({ browserName }) => {
//     const page: IndexPage = await initialize(browserName);
//     await page.navigateHome();
//     await page.testAccessibility();
//     // page.hello();
//     // await page.navigateHome();
// })

async function initialize(browserName: string) {
    const browser = await browserType(browserName).launch()
    const page = await browser.newPage()
    return new IndexPage(page);
}

function browserType(browserName: string) {
    switch (browserName) {
        case "chromium":
            return chromium;
        case "firefox":
            return firefox;
        case "webkit":
            return webkit;
    }
}
describe(`Language Test, `, () => {


    it("EN/FR", async ({ browserName }) => {

        const page = await initialize(browserName);
        await page.navigateHome();
        await assertGreetingLanguage(page);

        await page.toggleLanguage();

        await assertGreetingLanguage(page);

    });
})

for (const side of [Request.Server, Request.Client]) {

    describe(`Test Wizard: ${side} `, () => {

        let page: IndexPage;

        let inputId;
        let inputName = "Jane";
        let inputRole = "Manager";


        afterEach(async () => {
            await page.close();
        })

        it(`Post One: ${side}`, async ({ browserName }) => {
            page = await initialize(browserName);
            await page.navigateHome();

            await page.postOne(side, inputName, inputRole);

            inputId = await page.firstRowIdValue(side); // Saving for other tests

            await assertion(page, side, inputName, inputRole, Request.Post)

        });

        it("Get One", async ({ browserName }) => {

            page = await initialize(browserName);
            await page.navigateHome();

            await page.getOne(side, inputId);

            await assertion(page, side, inputName, inputRole, Request.Get)

        });

        it("Update One", async ({ browserName }) => {

            page = await initialize(browserName);
            await page.navigateHome();

            inputRole = swapRoles(inputRole);

            await page.updateOne(side, inputId, inputName, inputRole);

            await assertion(page, side, inputName, inputRole, Request.Put)

        });


        it("Get All", async ({ browserName }) => {

            page = await initialize(browserName);
            await page.navigateHome();
            await page.getAll(side);
            await assertion(page, side, await page.innerText(`td[id="${side.toLowerCase()}-name-1"]`), await page.innerText(`td[id="${side.toLowerCase()}-role-1"]`), Request.Get);

        });

        it("Delete One", async ({ browserName }) => {

            page = await initialize(browserName);
            await page.navigateHome();

            await page.deleteOne(side, inputId);

            await assertion(page, side, inputName, inputRole, Request.Delete)

        });

    })
}

describe('Accessibility,', async () => {

    let page: IndexPage;

    afterEach(async () => {
        await page.close();
    })

    it("Wizard Page,", async ({ browserName }) => {
        page = await initialize(browserName);
        await page.navigateHome();

        await page.getAll(Request.Server);
        await page.getAll(Request.Client);
        await page.testAccessibility();
        // await page.screenshot("test");
        await page.clickFirstRow();
        await page.testAccessibility();
        // await page.screenshot(browserName);
    })

    it("Errors Page,", async ({ browserName }) => {
        page = await initialize(browserName);
        await page.navigateErrors();

        await page.testAccessibility();
    })

})


// ------------- Test Utility Functions --------------- //


function swapRoles(inputRole) {
    return (inputRole === 'Manager' ? 'Director' : 'Manager');
}

async function assertGreetingLanguage(page: IndexPage) {
    let greeting;
    switch (await page.getCurrentLanguage()) {
        case 'English':
            greeting = "Bienvenue!";
            break;
        case 'Français':
            greeting = "Welcome!";
    }

    expect(await page.getGreeting()).toBe(greeting);
}

async function assertion(page: IndexPage, side: string, inputName: string, inputRole: string, request: string) {
    let idSelector: string;
    let nameSelector: string;
    let roleSelector: string;
    let commentSelector: string;
    let elementToScreenshot: string;

    switch (side) {
        case "SERVER":

            idSelector = 'td[id="server-id-1"]';
            nameSelector = 'td[id="server-name-1"]';
            roleSelector = 'td[id="server-role-1"]';
            commentSelector = 'td[id="server-comment-1"]';
            elementToScreenshot = '#server-side-employees'
            break;

        case "CLIENT":

            idSelector = 'td[id="client-id-1"]';
            nameSelector = 'td[id="client-name-1"]';
            roleSelector = 'td[id="client-role-1"]';
            commentSelector = 'td[id="client-comment-1"]';
            elementToScreenshot = '#js-employees'
            break;
    }
    let htmlId = await page.innerText(idSelector);
    let htmlName = await page.innerText(nameSelector);
    let htmlRole = await page.innerText(roleSelector);
    let htmlComment = await page.innerText(commentSelector);

    let inputId = htmlId;
    let commentToAssert = request === Request.Delete ? "Deleted" : "";

    expect(htmlName).toBe(inputName);
    expect(htmlRole).toBe(inputRole);
    expect(htmlComment).toBe(commentToAssert);

    await page.click(idSelector);

    const errors = await page.selectorVisible('id:light=alert');
    if (errors) {
        console.log(`Errors on page: ${errors}`);
        expect(errors).toBeTruthy();
        return; // Remaining assertions not possible.
    }


    if (request !== Request.Delete) {

        htmlId = await page.innerText('td[id="server-id-1"]');
        htmlName = await page.innerText('td[id="server-name-1"]');
        htmlRole = await page.innerText('td[id="server-role-1"]');
        htmlComment = await page.innerText('td[id="server-comment-1"]');

        expect(htmlId).toBe(inputId);
        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);
        expect(htmlComment).toBe(commentToAssert);
    }

}