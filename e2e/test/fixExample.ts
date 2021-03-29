// In tests/fixtures.ts
import { folio as baseFolio } from '@playwright/test';
import { Browser, chromium, firefox, Page, webkit } from "playwright";
import { IndexPage } from "../PO/IndexPage";

require('dotenv').config();
const baseURL = process.env.BASE_URL;
// Extend built-in fixtures and declare types for new fixtures
const builder = baseFolio.extend<{}, { mockedPage: IndexPage }>();


// Create a fixture which is executed only once per worker
builder.mockedPage.init(async ({ browserName }, runTest) => {

    const browser: Browser = await browserType(browserName).launch()
    const page: Page = await browser.newPage()
    const indexPage: IndexPage = new IndexPage(page, baseURL);

    runTest(indexPage);

    // Define fixture scope to worker
}, { scope: 'worker' });


function browserType(browserName: string) {
    switch (browserName) {
        case 'chromium':
            return chromium;
        case 'firefox':
            return firefox;
        case 'webkit':
            return webkit;
    }
}

// Build and export the modified fixtures
const folio = builder.build();
export const it = folio.it;
export const expect = folio.expect;