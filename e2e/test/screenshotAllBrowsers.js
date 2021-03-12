const playwright = require('playwright');
require('dotenv').config();
const baseURL = process.env.DEPLOYED_SITE_URL;

(async () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) { //webkit not working on Ubuntu. Needs to be run with Docker
        const browser = await playwright[browserType].launch({
            headless: false
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(baseURL);


        await page.screenshot({ path: `example-${browserType}.png` });

        await browser.close();
    }
})();