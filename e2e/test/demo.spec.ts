import { it, describe, expect, afterEach, beforeEach, beforeAll, afterAll, folio } from '@playwright/test'
import { Page, chromium, firefox, webkit } from 'playwright'
import { IndexPage } from '../PO/IndexPage';

require('dotenv').config();
const baseURL = process.env.BASE_URL;

enum Request {
    Server = 'SERVER',
    Client = 'CLIENT',
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE'
}

async function initialize(browserName: string) {
    const browser = await browserType(browserName).launch()
    const page = await browser.newPage()
    return new IndexPage(page, baseURL);
}

function browserType(browserName: string) {
    switch (browserName) {
        case 'chromium':
            return chromium;
        case 'firefox':
            return firefox;
        case 'webkit':
            return webkit;
    }
}

it('EN/FR', async ({ page }) => {

    await page.goto(baseURL);

    let indexpage: IndexPage = new IndexPage(page, baseURL)

});

async function assertGreetingLanguage(page: IndexPage) {
    const greeting = await page.getCurrentLanguage() === 'English' ? 'Welcome!' : 'Bienvenue!';
    // expect(await page.getGreeting()).toBe(greeting);
    expect(await page.getGreeting()).not.toBe(greeting);
}