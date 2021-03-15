require('dotenv').config();
const baseURL = process.env.BASE_URL;
import { devices, Browser, Page, chromium } from "playwright"
import { injectAxe, checkA11y, getViolations, reportViolations } from 'axe-playwright'

enum Request {
    Server = "SERVER",
    Client = "CLIENT",
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE"
}

export class IndexPage {
    private page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async getGreeting() {
        return await this.page.$eval('h1', e => e.innerHTML);
    }

    async getCurrentLanguage() {
        return await this.page.$eval('#wb-bnr > #wb-lng > ul > li > a', e => e.innerHTML);;
    }

    async hello() {
        console.log("HELLO");
    }

    async navigateHome() {
        return await this.page.goto(baseURL);
    }

    async navigateErrors() {
        return await this.page.goto(baseURL);
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async postOne(side, inputName, inputRole) {

        await this.page.selectOption('select[id="request-side"]', side);

        // Select POST
        await this.page.selectOption('select[id="request"]', Request.Post);

        // Click input[name="name"]
        await this.page.click('input[name="name"]');

        // Fill input[name="name"]
        await this.page.fill('input[name="name"]', inputName);

        // Press Tab
        await this.page.press('input[name="name"]', 'Tab');

        // Fill input[name="role"]
        await this.page.fill('input[name="role"]', inputRole);

        await this.clickSend(side);

    }

    async getOne(side, inputId) {

        await this.page.selectOption('select[id="request-side"]', side);

        await this.page.selectOption('select[id="request"]', Request.Get);

        // Click input[name="id"]
        await this.page.click('input[name="id"]');

        // Fill input[name="id"]
        await this.page.fill('input[name="id"]', inputId);

        await this.clickSend(side);
    }

    async getAll(side) {

        await this.page.selectOption('select[id="request-side"]', side);
        await this.page.selectOption('select[id="request"]', Request.Get);

        await this.clickSend(side);
    }



    async updateOne(side, inputId, inputName, inputRole) {

        await this.page.selectOption('select[id="request-side"]', side);

        await this.page.selectOption('select[id="request"]', Request.Put);

        // Click input[name="id"]
        await this.page.click('input[name="id"]');

        // Fill input[name="id"]
        await this.page.fill('input[name="id"]', inputId);

        // Click input[name="id"]
        await this.page.click('input[name="name"]');

        // Fill input[name="name"]
        await this.page.fill('input[name="name"]', inputName);

        // Click input[name="id"]
        await this.page.click('input[name="role"]');

        // Fill input[name="role"]
        await this.page.fill('input[name="role"]', inputRole);

        await this.clickSend(side);
    }

    async deleteOne(side, inputId) {

        await this.page.selectOption('select', side);

        await this.page.selectOption('#request', Request.Delete);

        await this.page.click('input[name="id"]');

        await this.page.fill('input[name="id"]', inputId);

        await this.clickSend(side);
    }

    async clickSend(side) {
        switch (side) {
            case Request.Client:
                // Click text="Send"
                await this.page.click('text="Send"');
                await this.sleep(2500);
                break;
            case Request.Server:
                // Click text="Send"
                await Promise.all([
                    this.page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/employees/add' }*/),
                    this.page.click('text="Send"')
                ]);
                break;
            case 'ALERT':
                // Click text="Send"
                this.page.once('dialog', dialog => {
                    console.log(`Dialog message: ${dialog.message()}`);
                    dialog.dismiss().catch(() => { });
                });
                await this.page.click('text="Send"');
                break;

        }

    }

    async toggleLanguage() {
        let changeLangButton = await this.page.$eval('#wb-bnr > #wb-lng > ul > li > a', e => e.innerHTML);
        // Change language on page
        await Promise.all([
            this.page.waitForNavigation(/*{ url: 'https://tdd-playwright-example-server.herokuapp.com/' }*/),
            this.page.click(`text=${changeLangButton}`)
        ]);
    }

    async firstRowIdValue(side: string) {
        let selector: string;
        switch (side) {
            case Request.Server:
                selector = 'td[id="server-id-1"]';
                break
            case Request.Client:
                selector = 'td[id="client-id-1"]';
                break;
        }
        return await this.page.innerText(selector);
    }

    async innerText(selector: string) {
        return await this.page.innerText(selector);
    }

    async click(selector: string) {
        await Promise.all([
            this.page.waitForNavigation(/*{ url: 'https://localhost:8443/details' }*/),
            this.page.click(selector)
        ]);
    }

    async selectorVisible(selector) {
        return await this.page.isVisible('id:light=alert');
    }

    async injectAxe() {

    }

    async testAccessibility() {
        let accessibilityTags = ['wcag2a']
        // 'best-practice' will fail due to WET body > nav
        // notWorking = ['wcag2aa', 'wcag21a', 'wcag21aa', 'wcag***', 'ACT', 'section508', 'experimental']

        await injectAxe(this.page);
        await checkA11y(this.page, 'main', {
            detailedReport: true,
            detailedReportOptions: { html: true },
            axeOptions: {
                runOnly: {
                    type: 'tag',
                    values: accessibilityTags,
                },
            },
        })
    }

    async close() {
        this.page.close();
    }

}