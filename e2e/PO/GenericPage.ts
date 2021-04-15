
import { Page } from "playwright"
import { injectAxe, checkA11y } from 'axe-playwright'

export class GenericPage {
    protected page: Page;
    protected baseURL: string;

    constructor(page: Page, baseURL: string) {
        this.page = page;
        this.baseURL = baseURL;
    }

    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async toggleLanguage() {
        await this.clickWait(`css=#wb-lng > ul > li`) // Always the first instance in light:DOM.
    }

    async navigateHome() {
        await this.page.goto(this.baseURL);
    }

    protected async clickWait(selector: string) {

        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(selector)
        ]);

        // https://css-tricks.com/why-using-reduce-to-sequentially-resolve-promises-works/
        // const clicks = [selector];
        // clicks.reduce(async (promiseAccumulator, selector) => {
        //     await promiseAccumulator;
        //     return promiseAccumulator.then(() => {
        //         return this.page.click(selector);
        //     });

        // }, Promise.resolve());
    }

    protected async click(selector: string) {
        this.page.click(selector)
    }

    protected async showAll() {
        this.navigateHome();
    }

    // Ensure all components are visible
    async testAccessibility() {

        await injectAxe(this.page);

        // 'main' tag will exclude wet components
        const componentToTest = 'main'; // Set to null to test entire page

        // let accessibilityTags = ['wcag2a', 'best-practice']
        // others = ['wcag2aa', 'wcag21a', 'wcag21aa', 'wcag***', 'ACT', 'section508', 'experimental']
        // https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter
        await checkA11y(this.page, componentToTest, {
            detailedReport: true,
            detailedReportOptions: { html: false },
            axeOptions: {
                reporter: 'v2',
                // runOnly: {
                //     type: 'tag',
                //     values: accessibilityTags,
                // },
            },
        })
    }


}
// module.exports = { GenericPage }