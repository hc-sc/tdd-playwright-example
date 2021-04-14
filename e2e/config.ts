// config.ts

import { PlaywrightEnv, newTestType, setConfig, TestInfo, reporters, setReporters } from "@playwright/test";
import { IndexPage } from "./PO/IndexPage";


require('dotenv').config();
const baseURL = process.env.BASE_URL;

setConfig({
    testDir: "./tests",  // Search for tests in this directory.
    timeout: 30000,  // Each test is given 30 seconds.
    // timeout: 90000,  // Each test is given 90 seconds.
    retries: 0,  // Failing tests will be retried at most two times.
    workers: 5,
});

setReporters([
    // Report to the terminal with "line" reporter.
    // new reporters.line(),
    // Additionally, output a JUnit XML file.
    new reporters.junit({ outputFile: 'test-results/playwright-e2e-junit.xml', stripANSIControlSequences: true }),
    new reporters.list(),
]);

// Extend the default environment to add any test arguments, for example POMs.
class MyEnv extends PlaywrightEnv {
    async beforeEach(testInfo: TestInfo) {
        // Get all default arguments, including Page.
        const result = await super.beforeEach(testInfo);
        // Create your POM.
        const indexPage = new IndexPage(result.page, baseURL);
        // Return default arguments and new POM.
        return { ...result, indexPage };
    }
}

// Declare "indexPage" test argument for types in IDE.
export const test = newTestType<{ indexPage: IndexPage }>();
export { expect } from "@playwright/test";

// Run tests in three browsers.
const options = {
    // Launch options:
    headless: true,
    slowMo: 50,
    // Context options:
    viewport: { width: 800, height: 600 },
    ignoreHTTPSErrors: true,
    // Testing options:
    // video: 'retain-on-failure',
    screenshot: 'only-on-failure',
};

// Run tests in three browsers.
test.runWith(new MyEnv('chromium', options), { tag: 'chromium' });
test.runWith(new MyEnv('firefox', options), { tag: 'firefox' });
test.runWith(new MyEnv('webkit', options), { tag: 'webkit' });