import { describe, it, expect } from './fixtures'
import { injectAxe, checkA11y } from 'axe-playwright'
require('dotenv').config();

describe.skip(`Accessibility: `, () => {

    it('gets and reports a11y for the specific element', async ({ indexPage }) => {
        await indexPage.testAccessibility();
    })


    it.skip('gets and reports a11y for the specific element', async ({ page }) => {

        const baseURL = process.env.BASE_URL;

        await page.goto(baseURL);
        await injectAxe(page);
        // await checkA11y(page);
        await checkA11y(page, null, {
            detailedReport: true,
            detailedReportOptions: { html: false },
            axeOptions: {
                reporter: 'raw-env',
                // runOnly: {
                //     type: 'tag',
                //     values: ['wcag2a'],
                // },
            },
        })
    });
});
