import { it, describe, expect, afterEach, beforeEach } from "@playwright/test"

/**
 * To use local environment variables, create a .env file and set the BASE_URL to the local endpoint being tested.
 * See the CircleCI config.yml file for how the BASE_URL is injected with a value during CI/CD pipeline.
 */
require('dotenv').config();
const baseURL = process.env.BASE_URL;

describe("Language Test, ", () => {
    it("EN/FR", async ({ page }) => {

        await page.goto(baseURL);
        // const lang = await page.evaluate(() => document.documentElement.lang.toString());
        // console.log(lang);

        let changeLangButton = await page.$eval('#wb-bnr > #wb-lng > ul > li > a', e => e.innerHTML);
        await assertGreetingLanguage(page, changeLangButton);

        // Change language on page
        await Promise.all([
            page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/' }*/),
            page.click('text=' + changeLangButton)
        ]);

        changeLangButton = await page.$eval('#wb-bnr > #wb-lng > ul > li > a', e => e.innerHTML);
        await assertGreetingLanguage(page, changeLangButton);

    });
})



describe("Test Wizard: Client Side, ", () => {

    let inputName = "Joan";
    let inputRole = "Director";
    let inputId;

    it("Client Methods: Post One", async ({ page }) => {

        await page.goto(baseURL);

        await page.selectOption('select[id="request-side"]', 'CLIENT');
        await postOne(page, 'CLIENT', inputName, inputRole);

        const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
        const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
        const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);

        // await postOneClient(page, inputName, inputRole);
        inputId = await page.$eval('td:nth-child(1)', e => e.innerHTML);

    });

    it("Client Methods: Get One", async ({ page }) => {

        await page.goto(baseURL);

        await page.selectOption('select[id="request-side"]', 'CLIENT');

        await getOne(page, 'CLIENT', inputId, inputName, inputRole);

        const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
        const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
        const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

        expect(htmlId).toBe(inputId);
        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);

        await Promise.all([
            page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/details' }*/),
            page.click('tr[id="row-1"]')
        ]);



    });



    it("Client Methods: Update One", async ({ page }) => {

        await page.goto(baseURL);

        inputRole = swapRoles(inputRole);

        await updateOne(page, 'CLIENT', inputId, inputName, inputRole);

        const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
        const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
        const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

        expect(htmlId).toBe(inputId);
        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);

    });


    it("Client Methods: Delete One", async ({ page }) => {

        await page.goto(baseURL);

        await deleteOne(page, 'CLIENT', inputId);

        const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
        const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
        const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);
        const htmlStatus = await page.$eval('td:nth-child(4)', e => e.innerHTML);

        expect(htmlId).toBe(inputId);
        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);
        expect(htmlStatus).toBe("Deleted");


    });


    it("Client Methods: Not Found Alert", async ({ page }) => {

        await page.goto(baseURL);

        await page.selectOption('select[id="request-side"]', 'CLIENT');

        await page.selectOption('select[id="request"]', 'GET');

        // Click input[name="id"]
        await page.click('input[name="id"]');

        // Fill input[name="id"]
        await page.fill('input[name="id"]', inputId);

        await clickSend(page, 'ALERT');


    });

})

// describe("Test Wizard: Service Side, ", () => {

//     let inputName = "Jane";
//     let inputRole = "Manager";
//     let inputId;


//     it("Service Methods: Post One", async ({ page }) => {

//         await page.goto(baseURL);

//         await postOne(page, side, inputName, inputRole);

//         const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
//         const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

//         expect(htmlName).toBe(inputName);
//         expect(htmlRole).toBe(inputRole);

//         inputId = await page.$eval('td:nth-child(1)', e => e.innerHTML);

//     });

//     it("Service Methods: Get One", async ({ page }) => {



//         // INSERT USER STORY HERE:

//         await page.goto(baseURL);
//         await getOne(page, side, inputId, inputName, inputRole);

//         //


//         const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
//         const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
//         const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

//         expect(htmlId).toBe(inputId);
//         expect(htmlName).toBe(inputName);
//         expect(htmlRole).toBe(inputRole);

//     });

//     it("Service Methods: Update One", async ({ page }) => {

//         await page.goto(baseURL);

//         inputRole = swapRoles(inputRole);

//         await updateOne(page, 'SERVICE', inputId, inputName, inputRole);

//         const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
//         const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
//         const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

//         expect(htmlId).toBe(inputId);
//         expect(htmlName).toBe(inputName);
//         expect(htmlRole).toBe(inputRole);

//     });


//     it("Service Methods: Get All", async ({ page }) => {

//         await page.goto(baseURL);

//         await getAll(page, 'SERVICE');

//     });

//     it("Service Methods: Delete One", async ({ page }) => {

//         await page.goto(baseURL);

//         await deleteOne(page, 'SERVICE', inputId);

//         const htmlId = await page.$("#server-side-employees > tbody > td");

//         expect(htmlId).toBe(null);

//     });


// })


// ------------- Test Utility Functions --------------- //

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function postOne(page, side, inputName, inputRole) {

    await page.selectOption('select[id="request-side"]', side);

    // Select POST
    await page.selectOption('select[id="request"]', 'POST');

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

async function getOne(page, side, inputId, inputName, inputRole) {

    await page.selectOption('select[id="request-side"]', side);

    await page.selectOption('select[id="request"]', 'GET');

    // Click input[name="id"]
    await page.click('input[name="id"]');

    // Fill input[name="id"]
    await page.fill('input[name="id"]', inputId);

    await clickSend(page, side);
}

async function getAll(page, side) {

    // await page.selectOption('select[id="request-side"]', side);

    await page.selectOption('select[id="request"]', 'GET');

    await clickSend(page, side);
}

function swapRoles(inputRole) {
    return (inputRole === 'Manager' ? 'Director' : 'Manager');
}

async function updateOne(page, side, inputId, inputName, inputRole) {

    // await page.selectOption('select[id="request-side"]', side);

    await page.selectOption('select[id="request-side"]', side);


    await page.selectOption('select[id="request"]', 'PUT');

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

    await page.selectOption('select[id="request-side"]', side);

    // Select DELETE
    await page.selectOption('select[id="request"]', 'DELETE');

    // Click input[name="id"]
    await page.click('input[name="id"]');

    // Fill input[name="id"]
    await page.fill('input[name="id"]', inputId);

    await clickSend(page, side);
}

async function clickSend(page, side) {
    switch (side) {
        case 'CLIENT':
            // Click text="Send"
            await page.click('text="Send"');
            await sleep(2500);
            break;
        case 'SERVER':
            // Click text="Send"
            await Promise.all([
                page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/employees/add' }*/),
                page.click('text="Send"')
            ]);
        case 'ALERT':
            // Click text="Send"
            page.once('dialog', dialog => {
                console.log(`Dialog message: ${dialog.message()}`);
                dialog.dismiss().catch(() => { });
            });
            await page.click('text="Send"');

    }

    // Click text="Send"
    if (side === 'CLIENT') {

    } else {

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
    console.log(changeLangButton);
    let greeting = await page.$eval('h1', e => e.innerHTML);
    console.debug(greeting);
    expect(greeting).toBe(greetingToLanguage(changeLangButton));
}



        // const form = await page.$("#form");
        // expect(form).not.toBe(null);

        // const clientTable = await page.$("#js-employees > tbody");
        // console.log("TABLE: " + clientTable);


        // // expect(clientTable.length !== 0).toBeTruthy();
        // // expect(null).toBeDefined();
        // expect(clientTable).not.toBe(null);



        // Select POST'
        // await page.selectOption('select[id="request"]', 'POST');
