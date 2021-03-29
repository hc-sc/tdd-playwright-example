import { it, describe, expect, afterEach, beforeEach, beforeAll, afterAll, folio } from "@playwright/test"
import { chromium, firefox, webkit } from "playwright"
import { IndexPage } from "../PO/IndexPage";
import { injectAxe, checkA11y, getViolations, reportViolations } from 'axe-playwright'
import { Page, Browser } from "playwright"
const playwright = require('playwright');

require('dotenv').config();
const baseURL = process.env.BASE_URL;

async function initialize(browserName: string) {
    const browser = await browserType(browserName).launch();
    const page = await browser.newPage();
    console.log("BASEURL: " + baseURL);
    return new IndexPage(page, baseURL);
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

describe.skip('Accessibility,', async () => {

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

        expect(violations.length).toBe(0);

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



})

describe(`Accessibility: `, () => {

    let browser: Browser;
    let page: Page;
    let accessibilityTags: string[] = ['wcag2a']


    it('gets and reports a11y for the specific element', async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
        await page.goto(baseURL);
        await injectAxe(page)
        await testAccessibility(page, accessibilityTags);

        const violations = await getViolations(page, null, {
            axeOptions: {
                runOnly: {
                    type: 'tag',
                    values: accessibilityTags,
                },
            },
        })
        // console.log(junitReporter);
        // if (repo !== undefined) {
        //     console.log(repo);
        //     reportViolations(violations, repo)
        // }


        expect(violations.length).toBe(0)
    })


    afterAll(async () => {
        await browser.close()
    })
})

async function testAccessibility(page: Page, accessibilityTags: string[]) {
    await checkA11y(page, null, {
        detailedReport: true,
        detailedReportOptions: { html: false },
        axeOptions: {
            runOnly: {
                type: 'tag',
                values: accessibilityTags,
            },
        },
    })
}