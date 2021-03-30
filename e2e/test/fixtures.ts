// In tests/fixtures.ts
import { folio as baseFolio } from '@playwright/test';
import { IndexPage } from "../PO/IndexPage";

require('dotenv').config();
const baseURL = process.env.BASE_URL;

// Extend built-in fixtures and declare types for new fixtures
const builder = baseFolio.extend<{ indexPage: IndexPage }>();

// In fixtures.ts
builder.indexPage.init(async ({ page }, runTest) => {
    // get built-in page and wrap with POM
    const indexPage = new IndexPage(page, baseURL);

    // pass this to your test
    runTest(indexPage);
});

// Build and export the modified fixtures
const folio = builder.build();
export const it = folio.it;
export const expect = folio.expect;
export const describe = folio.describe;