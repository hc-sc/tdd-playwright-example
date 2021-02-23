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

        let greeting;

        const lang = await page.evaluate(() => document.documentElement.lang.toString());
        console.log(lang);
        switch (lang) {
            case "fr":
                greeting = await page.$eval('h1', e => e.innerHTML);
                expect(greeting).toBe("Bienvenue!");
                // await Promise.all([
                //     page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/' }*/),
                //     page.click('text="Français"')
                // ]);
                break;
            case "en":


                greeting = await page.$eval('h1', e => e.innerHTML);
                // console.log(greeting);

                expect(greeting).toBe("Welcome!");
                // await Promise.all([
                //     page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/' }*/),
                //     page.click('text="English"')
                // ]);
                // greeting = await page.$eval('h1', e => e.innerHTML);
                // console.log(greeting);
                break;
        }


    });
})


describe("Test Wizard: Client Side, ", () => {

    let inputName = "Joan";
    let inputRole = "Director";
    let inputId;

    it("Service Methods: Post One", async ({ page }) => {

        await page.goto(baseURL);

        await page.selectOption('select[id="request-side"]', 'CLIENT');
        await postOne(page, 'CLIENT', inputName, inputRole);

        // const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
        const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
        const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);

        // await postOneClient(page, inputName, inputRole);
        inputId = await page.$eval('td:nth-child(1)', e => e.innerHTML);

    });

    it("Service Methods: Get One", async ({ page }) => {

        await page.goto(baseURL);

        await page.selectOption('select[id="request-side"]', 'CLIENT');

        await getOne(page, 'SERVER', inputId, inputName, inputRole);

        const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
        const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
        const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

        expect(htmlId).toBe(inputId);
        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);

    });

})

describe("Test Wizard: Service Side, ", () => {

    let inputName = "Jane";
    let inputRole = "Manager";
    let inputId;


    it("Service Methods: Post One", async ({ page }) => {

        await page.goto(baseURL);

        await postOne(page, 'SERVER', inputName, inputRole);

        const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
        const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);

        inputId = await page.$eval('td:nth-child(1)', e => e.innerHTML);

    });

    it("Service Methods: Get One", async ({ page }) => {

        await page.goto(baseURL);

        await getOne(page, 'SERVER', inputId, inputName, inputRole);

        const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
        const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
        const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

        expect(htmlId).toBe(inputId);
        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);

    });

    it("Service Methods: Update One", async ({ page }) => {

        await page.goto(baseURL);

        inputRole = swapRoles(inputRole);

        await updateOne(page, 'SERVICE', inputId, inputName, inputRole);

        const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
        const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
        const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

        expect(htmlId).toBe(inputId);
        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);

    });


    it("Service Methods: Get All", async ({ page }) => {

        await page.goto(baseURL);

        await getAll(page, 'SERVICE');

    });

    it("Service Methods: Delete One", async ({ page }) => {

        await page.goto(baseURL);

        await deleteOne(page, 'SERVICE', inputId);

        const htmlId = await page.$("#server-side-employees > tbody > td");

        expect(htmlId).toBe(null);

    });


})


// ------------------ SERVICE TEST FUNCTIONS --------------------- //



// async function getAllService(page) {

//     await page.goto(baseURL);

//     // Click text="Send"
//     await Promise.all([
//         page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/employees?request-side=SERVER&request=GET&id=&name=&role=' }*/),
//         page.click('text="Send"')
//     ]);

//     const htmlId = await page.$eval('td:nth-child(1)', e => e.innerHTML);
//     const htmlName = await page.$eval('td:nth-child(2)', e => e.innerHTML);
//     const htmlRole = await page.$eval('td:nth-child(3)', e => e.innerHTML);

//     expect(htmlId).not.toBe(null);
//     expect(htmlName).not.toBe(null);
//     expect(htmlRole).not.toBe(null);

// }

// async function deleteOneService(page, inputId, inputName, inputRole) {

//     await page.goto(baseURL);

//     // Select DELETE
//     await page.selectOption('select[id="request"]', 'DELETE');

//     // Click input[name="id"]
//     await page.click('input[name="id"]');

//     // Fill input[name="id"]
//     await page.fill('input[name="id"]', "6");

//     // Click text="Send"
//     await Promise.all([
//         page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/employees/delete' }*/),
//         page.click('text="Send"')
//     ]);

//     const htmlId = await page.$("#server-side-employees > tbody > td");

//     expect(htmlId).toBe(null);
// }

// async function postOneClient(page, inputName, inputRole) {
//     // Go to https://tdd-playwright-example-server.herokuapp.com/
//     await page.goto('https://tdd-playwright-example-server.herokuapp.com/');


//     await postOne(page, 'CLIENT', inputName, inputRole);

//     const htmlId = await page.$eval('td:nth-last-child(3)', e => e.innerHTML);


//     console.log(await htmlId);

//     // const clientTable = await page.$("#js-employees > tbody > tr");
//     // console.log("TABLE: " + clientTable.innerHTML);


// }

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

async function updateOne(page, side, inputId, inputName, inputRole) {

    // await page.selectOption('select[id="request-side"]', side);

    await page.selectOption('select[id="request-side"]', 'SERVER');


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

    // await page.selectOption('select[id="request-side"]', side);

    // Select DELETE
    await page.selectOption('select[id="request"]', 'DELETE');

    // Click input[name="id"]
    await page.click('input[name="id"]');

    // Fill input[name="id"]
    await page.fill('input[name="id"]', inputId);

    await clickSend(page, side);
}

async function clickSend(page, side) {
    // Click text="Send"
    if (side === 'CLIENT') {
        // Click text="Send"
        await page.click('text="Send"');
        await sleep(2500);
    } else {
        // Click text="Send"
        await Promise.all([
            page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/employees/add' }*/),
            page.click('text="Send"')
        ]);
    }
}

function swapRoles(inputRole) {
    return (inputRole === 'Manager' ? 'Director' : 'Manager');
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
