const { firefox } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext();

    // Open new page
    const page = await context.newPage();

    // Go to https://tdd-playwright-example-server.herokuapp.com/
    await page.goto('https://tdd-playwright-example-server.herokuapp.com/');

    // Select POST
    await page.selectOption('select[id="request"]', 'POST');

    // Click input[name="name"]
    await page.click('input[name="name"]');

    // Fill input[name="name"]
    await page.fill('input[name="name"]', 'Jane');

    // Press Tab
    await page.press('input[name="name"]', 'Tab');

    // Fill input[name="role"]
    await page.fill('input[name="role"]', 'Manager');

    // Click text="Send"
    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/employees/add' }*/),
        page.click('text="Send"')
    ]);

    // Click text="Jane"
    await page.click('text="Jane"');

    // Click text="Send"
    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/employees?request-side=SERVER&request=GET&id=&name=&role=' }*/),
        page.click('text="Send"')
    ]);

    // Click text="Jane"
    await page.click('text="Jane"');

    await close(page, context, browser);

})();


async function close(page, context, browser) {
    // Close page
    await page.close();

    // ---------------------
    await context.close();
    await browser.close();

}