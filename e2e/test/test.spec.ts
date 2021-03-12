import { it, describe, expect, afterEach, beforeEach, beforeAll, afterAll, folio } from "@playwright/test"
import { devices, Browser, Page, chromium } from "playwright"
const playwright = require('playwright');
import { injectAxe, checkA11y, getViolations, reportViolations } from 'axe-playwright'

// import {reporter, junit-reporter{require("@wdio/cli/package.json"); // @wdio/cli is a peer dependency. 
// var junitReporter = require("@wdio/junit-reporter")

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


describe.skip(`Language Test, `, () => {

    it("EN/FR", async ({ page }) => {
        await page.goto(baseURL);
        let changeLangButton = await page.$eval('#wb-bnr > #wb-lng > ul > li > a', e => e.innerHTML);
        await assertGreetingLanguage(page, changeLangButton);

        // Change language on page
        await Promise.all([
            page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/' }*/),
            page.click(`text=${changeLangButton}`)
        ]);

        changeLangButton = await page.$eval('#wb-bnr > #wb-lng > ul > li > a', e => e.innerHTML);
        await assertGreetingLanguage(page, changeLangButton);

    });
})

for (const side of [Request.Server, Request.Client]) {

    describe.skip(`Test Wizard: ${side} `, () => {

        let inputId;
        let inputName = "Jane";
        let inputRole = "Manager";



        it(`Post One: ${side}`, async ({ page, browserName }) => {
            console.log(`browserName: ${browserName}`);
            await page.goto(baseURL);

            await postOne(page, side, inputName, inputRole);

            inputId = await firstRowIdValue(page, side); // Saving for other tests

            await assertion(page, side, inputName, inputRole, Request.Post)

        });

        it("Get One", async ({ page }) => {

            await page.goto(baseURL);

            await getOne(page, side, inputId);

            await assertion(page, side, inputName, inputRole, Request.Get)

        });

        it("Update One", async ({ page }) => {

            await page.goto(baseURL);

            inputRole = swapRoles(inputRole);

            await updateOne(page, side, inputId, inputName, inputRole);

            await assertion(page, side, inputName, inputRole, Request.Put)

        });


        it("Get All", async ({ page }) => {

            await page.goto(baseURL);
            await getAll(page, side);
            await assertion(page, side, await page.innerText(`td[id="${side.toLowerCase()}-name-1"]`), await page.innerText(`td[id="${side.toLowerCase()}-role-1"]`), Request.Get);

        });

        it("Delete One", async ({ page }) => {

            await page.goto(baseURL);

            await deleteOne(page, side, inputId);

            await assertion(page, side, inputName, inputRole, Request.Delete)

        });
    })
}

describe(`Accessibility: `, () => {

    let browser: Browser;
    let page: Page;
    let accessibilityTags = ['wcag2a']


    beforeAll(async () => {
        browser = await chromium.launch()
        page = await browser.newPage()
    })


    // it('check a11y for the whole page and axe run options', async () => {
    //     await page.goto(baseURL);
    //     await getAll(page, Request.Server);
    //     await getAll(page, Request.Client);

    //     await injectAxe(page)
    //     await testAccessibility(page, accessibilityTags);
    // })


    // it('check a11y for the whole page and axe run options', async () => {
    //     await page.goto(baseURL);
    //     await getAll(page, Request.Server);

    //     await Promise.all([
    //         page.waitForNavigation(/*{ url: 'https://localhost:8443/details' }*/),
    //         page.click('td[id="server-id-1"]')
    //     ]);

    //     await injectAxe(page)
    //     await testAccessibility(page, accessibilityTags);

    //     // const violations = await getViolations(page, null, {
    //     //     detailedReport: true,
    //     //     detailedReportOptions: { html: true },
    //     //     axeOptions: {
    //     //         runOnly: {
    //     //             type: 'tag',
    //     //             values: ['wcag2a'],
    //     //         },
    //     //     },
    //     // })
    //     // console.log(`VIOATIONS: ${violations.length}`)
    //     // expect(violations.length).toBe(0)
    // })

    // it('check a11y for the whole page and axe run options', async () => {
    //     await page.goto(`${baseURL}/errors`);
    //     await injectAxe(page)
    //     await testAccessibility(page, accessibilityTags);
    // })

    it('gets and reports a11y for the specific element', async () => {

        await injectAxe(page)
        await testAccessibility(page, accessibilityTags);

        const violations = await getViolations(page, 'form', {
            axeOptions: {
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a'],
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



// ------------- Test Utility Functions --------------- //

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function postOne(page, side, inputName, inputRole) {

    await page.selectOption('select[id="request-side"]', side);

    // Select POST
    await page.selectOption('select[id="request"]', Request.Post);

    // Click input[name="name"]
    await page.click('input[name="name"]');

    // Fill input[name="name"]
    await page.fill('input[name="name"]', inputName);

    // Press Tab
    await page.press('input[name="name"]', 'Tab');

    // Fill input[name="role"]
    await page.fill('input[name="role"]', inputRole);

    await clickSend(page, side);

}

async function getOne(page, side, inputId) {

    await page.selectOption('select[id="request-side"]', side);

    await page.selectOption('select[id="request"]', Request.Get);

    // Click input[name="id"]
    await page.click('input[name="id"]');

    // Fill input[name="id"]
    await page.fill('input[name="id"]', inputId);

    await clickSend(page, side);
}

async function getAll(page, side) {

    await page.selectOption('select[id="request-side"]', side);
    await page.selectOption('select[id="request"]', Request.Get);

    await clickSend(page, side);
}

function swapRoles(inputRole) {
    return (inputRole === 'Manager' ? 'Director' : 'Manager');
}

async function updateOne(page, side, inputId, inputName, inputRole) {

    await page.selectOption('select[id="request-side"]', side);

    await page.selectOption('select[id="request"]', Request.Put);

    // Click input[name="id"]
    await page.click('input[name="id"]');

    // Fill input[name="id"]
    await page.fill('input[name="id"]', inputId);

    // Click input[name="id"]
    await page.click('input[name="name"]');

    // Fill input[name="name"]
    await page.fill('input[name="name"]', inputName);

    // Click input[name="id"]
    await page.click('input[name="role"]');

    // Fill input[name="role"]
    await page.fill('input[name="role"]', inputRole);

    await clickSend(page, side);
}

async function deleteOne(page, side, inputId) {

    await page.selectOption('select', side);

    await page.selectOption('#request', Request.Delete);

    await page.click('input[name="id"]');

    await page.fill('input[name="id"]', inputId);

    await clickSend(page, side);
}

async function clickSend(page, side) {
    switch (side) {
        case Request.Client:
            // Click text="Send"
            await page.click('text="Send"');
            await sleep(2500);
            break;
        case Request.Server:
            // Click text="Send"
            await Promise.all([
                page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/employees/add' }*/),
                page.click('text="Send"')
            ]);
            break;
        case 'ALERT':
            // Click text="Send"
            page.once('dialog', dialog => {
                console.log(`Dialog message: ${dialog.message()}`);
                dialog.dismiss().catch(() => { });
            });
            await page.click('text="Send"');
            break;

    }

}

function greetingToLanguage(language) {
    switch (language) {
        case 'English':
            return "Bienvenue!";
        case 'Français':
            return "Welcome!";
    }
}

async function assertGreetingLanguage(page, changeLangButton) {
    let greeting = await page.$eval('h1', e => e.innerHTML);
    expect(greeting).toBe(greetingToLanguage(changeLangButton));
}

async function assertion(page, side, inputName, inputRole, request) {
    let idSelector;
    let nameSelector;
    let roleSelector
    let commentSelector;
    let elementToScreenshot;

    switch (side) {
        case "SERVER":

            idSelector = 'td[id="server-id-1"]';
            nameSelector = 'td[id="server-name-1"]';
            roleSelector = 'td[id="server-role-1"]';
            commentSelector = 'td[id="server-comment-1"]';
            elementToScreenshot = '#server-side-employees'
            break;

        case "CLIENT":

            idSelector = 'td[id="client-id-1"]';
            nameSelector = 'td[id="client-name-1"]';
            roleSelector = 'td[id="client-role-1"]';
            commentSelector = 'td[id="client-comment-1"]';
            elementToScreenshot = '#js-employees'
            break;
    }
    let htmlId = await page.innerText(idSelector);
    let htmlName = await page.innerText(nameSelector);
    let htmlRole = await page.innerText(roleSelector);
    let htmlComment = await page.innerText(commentSelector);

    let inputId = htmlId;
    let commentToAssert = request === Request.Delete ? "Deleted" : "";

    expect(htmlName).toBe(inputName);
    expect(htmlRole).toBe(inputRole);
    expect(htmlComment).toBe(commentToAssert);

    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://localhost:8443/details' }*/),
        page.click(idSelector)
    ]);

    const errors = await page.isVisible('id:light=alert');
    if (errors) {
        console.log(`Errors on page: ${errors}`);
        expect(errors).toBeTruthy();
        return; // Remaining assertions not possible.
    }


    if (request !== Request.Delete) {

        htmlId = await page.innerText('td[id="server-id-1"]');
        htmlName = await page.innerText('td[id="server-name-1"]');
        htmlRole = await page.innerText('td[id="server-role-1"]');
        htmlComment = await page.innerText('td[id="server-comment-1"]');

        expect(htmlId).toBe(inputId);
        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);
        expect(htmlComment).toBe(commentToAssert);
    }

}

async function firstRowIdValue(page, side) {
    let selector;
    switch (side) {
        case "SERVER":
            selector = 'td[id="server-id-1"]';
            break
        case "CLIENT":
            selector = 'td[id="client-id-1"]';
            break;
    }
    return await page.innerText(selector);
}

async function testAccessibility(page: Page, accessibilityTags) {
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