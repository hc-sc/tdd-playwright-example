import { it, describe, expect, afterEach, beforeEach, beforeAll, afterAll, folio } from "@playwright/test"
import { chromium, firefox, webkit } from "playwright"
const playwright = require('playwright');
import { IndexPage } from "../PO/IndexPage";
import { injectAxe, checkA11y, getViolations, reportViolations } from 'axe-playwright'


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

        let page: IndexPage = await initialize(browserName);

        await page.navigateHome();
        await page.getCurrentLanguage()
        await assertGreetingLanguage(page);
        await page.toggleLanguage();
        await assertGreetingLanguage(page);

    });
})

for (const side of [Request.Server, Request.Client]) {

    describe.skip(`Test Wizard: ${side} `, () => {

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
            await assertion(page, side, inputName, inputRole, Request.Get);
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
        await page.debugScreenshot(browserName, "PIC");
        // await page.testAccessibility();

        const violations = await page.testAccessibility();
        // violations.forEach(elem => console.debug(elem));

        expect(violations).toBe(undefined);

        // let accessibilityTags = ['wcag2a', 'best-practice']
        // // notWorking = ['wcag2aa', 'wcag21a', 'wcag21aa', 'wcag***', 'ACT', 'section508', 'experimental']
        // // https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter


        // await injectAxe(await page.getPage());
        // await checkA11y(await page.getPage(), 'main', {
        //     detailedReport: true,
        //     detailedReportOptions: { html: false },
        //     axeOptions: {
        //         runOnly: {
        //             type: 'tag',
        //             values: accessibilityTags,
        //         },
        //     },
        // })

    })

    it.skip("Errors Page,", async ({ browserName }) => {
        page = await initialize(browserName);
        await page.navigateErrors();
    })

})


// ------------- Test Utility Functions --------------- //


function swapRoles(inputRole: string) {
    return (inputRole === 'Manager' ? 'Director' : 'Manager');
}

async function assertGreetingLanguage(page: IndexPage) {
    const greeting = await page.getCurrentLanguage() === 'English' ? "Welcome!" : "Bienvenue!";
    expect(await page.getGreeting()).toBe(greeting);
    // expect(await page.getGreeting()).toBe(undefined);
}

async function assertion(page: IndexPage, side: Request, inputName: string, inputRole: string, request: string) {



    let rowIndex: number = 1;

    let rowValues = await page.getRowValues(rowIndex, side);

    let htmlId = rowValues[0];
    let htmlName = rowValues[1];
    let htmlRole = rowValues[2];
    let htmlComment = rowValues[3];

    let inputId = htmlId;
    let commentToAssert = request === Request.Delete ? "Deleted" : "";

    expect(htmlName).toBe(inputName);
    expect(htmlRole).toBe(inputRole);
    expect(htmlComment).toBe(commentToAssert);

    await page.clickRow(side, 1);

    const errors = await page.warningsVisible();
    if (errors) {
        console.log(`Errors on page: ${errors}`);
        expect(errors).toBeTruthy();
        return; // Remaining assertions not possible.
    }


    if (request !== Request.Delete) {
        rowValues = await page.getRowValues(rowIndex, side);
        let htmlId = rowValues[0];
        let htmlName = rowValues[1];
        let htmlRole = rowValues[2];
        let htmlComment = rowValues[3];

        expect(htmlId).toBe(inputId);
        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);
        expect(htmlComment).toBe(commentToAssert);
    }

}
