const playwright = require('playwright');

(async () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) { //webkit not working on Ubuntu. Needs to be run with Docker
        const browser = await playwright[browserType].launch({
            headless: false
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto("https://tdd-playwright-example-server.herokuapp.com");


        await page.screenshot({ path: `example-${browserType}.png` });

        await browser.close();
    }
})();