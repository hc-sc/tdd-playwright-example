import { Page } from "playwright"
import { GenericPage } from "../PO/GenericPage";

enum Request {
    Server = "SERVER",
    Client = "CLIENT",
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE",
    Alert = "ALERT"
}

export class IndexPage extends GenericPage {

    constructor(page: Page, baseURL: string) {
        super(page, baseURL);
    }

    async getCurrentLanguage() {
        const lang = 'English' === await this.page.$eval(`css=#wb-lng > ul > li > a`, e => e.textContent) ? 'Français' : 'English';
        // console.debug(lang);
        return lang;
    }

    async getGreeting() {
        return await this.page.$eval('h1', e => e.textContent);
    }

    async navigateErrors() {
        return await this.page.goto(`${this.baseURL}/errors`);
    }



    async postOne(side: Request, inputName: string, inputRole: string) {

        await this.page.selectOption('select[id="request-side"]', side);

        await this.page.selectOption('select[id="request"]', Request.Post);

        await this.page.fill('input[name="name"]', inputName);

        await this.page.fill('input[name="role"]', inputRole);

        await this.clickSend(side);

    }

    async getOne(side: Request, inputId: string) {

        await this.page.selectOption('select[id="request-side"]', side);

        await this.page.selectOption('select[id="request"]', Request.Get);

        await this.page.fill('input[name="id"]', inputId);

        await this.clickSend(side);
    }

    async getAll(side: Request) {

        await this.page.selectOption('select[id="request-side"]', side);

        await this.page.selectOption('select[id="request"]', Request.Get);

        await this.clickSend(side);
    }

    async updateOne(side: Request, inputId: string, inputName: string, inputRole: string) {

        await this.page.selectOption('select[id="request-side"]', side);

        await this.page.selectOption('select[id="request"]', Request.Put);

        await this.page.fill('input[name="id"]', inputId);

        await this.page.fill('input[name="name"]', inputName);

        await this.page.fill('input[name="role"]', inputRole);

        await this.clickSend(side);
    }

    async deleteOne(side: Request, inputId: string) {
        await this.page.selectOption('select', side);
        await this.page.selectOption('#request', Request.Delete);

        await this.page.fill('input[name="id"]', inputId);
        await this.clickSend(side);
    }
    async clickSend(side: Request) {
        switch (side) {
            case Request.Client:
                // Click text="Send"
                await this.click('text="Send"');
                await this.sleep(2500);
                break;
            case Request.Server:
                // Click text="Send"
                await this.clickWait('text="Send"')
                break;
            case Request.Alert:
                // Click text="Send"
                this.page.once('dialog', dialog => {
                    console.log(`Dialog message: ${dialog.message()}`);
                    dialog.dismiss().catch(() => { });
                });
                await this.page.click('text="Send"');
                break;

        }

    }


    async firstRowIdValue(side: Request) {
        return await this.page.innerText(`td[id="${side.toLowerCase()}-id-1"]`);
    }

    async screenShotTable(browserType: string, requestSide: Request) {
        const tableSelector = `${requestSide.toLowerCase()}-side-employees`
        const element = await this.page.$(`${tableSelector}`);
        await element.screenshot({ path: `assert-photos/${browserType}-${tableSelector}.png` })
    }

    async debugScreenshot(browserType: string, comment: string) {
        await this.page.screenshot({ path: `debug-photos/${comment}-${browserType}-page.png` })
    }

    async getLastRowIndex(side: Request) {
        let index = await (await this.page.$eval(`table[id=${side.toLowerCase()}-side-employees] > tbody`, e => e.lastElementChild.id)).split('-')[2];
        return parseInt(await index);
    }

    async getRowValues(index: number, side: Request,) {
        const id = await this.page.innerText(`td[id="${side.toLowerCase()}-id-${index}"]`);
        const name = await this.page.innerText(`td[id="${side.toLowerCase()}-name-${index}"]`);
        const role = await this.page.innerText(`td[id="${side.toLowerCase()}-role-${index}"]`);
        const comment = await this.page.innerText(`td[id="${side.toLowerCase()}-comment-${index}"]`);
        return [id, name, role, comment];
    }

    async clickRow(side: Request, index: number) {
        await this.clickWait(`td[id="${side.toLowerCase()}-id-${index}"]`)
    }

    async warningsVisible() {
        return await this.page.isVisible('id:light=alert');
    }

    protected async showAll() {
        await super.showAll();
        await this.getAll(Request.Server);
        await this.getAll(Request.Client);
    }

    async testAccessibility() {
        await this.showAll();
        await super.testAccessibility();
    }

    async close() {
        await this.page.close();
    }

}
module.exports = { IndexPage }