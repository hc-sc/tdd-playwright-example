// In tests/fixtures.ts
import { folio as baseFolio } from '@playwright/test';
import { Browser, chromium, firefox, Page, webkit } from "playwright";
import { IndexPage } from "../PO/IndexPage";

require('dotenv').config();
const baseURL = process.env.BASE_URL;

// Extend built-in fixtures and declare types for new fixtures
const builder = baseFolio.extend<{ mockedPage: IndexPage }>();

// In fixtures.ts
builder.mockedPage.init(async ({ page }, runTest) => {
    // get built-in page and wrap with POM
    const indexPage = new IndexPage(page, baseURL);

    // pass this to your test
    runTest(indexPage);
});

// Build and export the modified fixtures
const folio = builder.build();
export const it = folio.it;
export const expect = folio.expect;