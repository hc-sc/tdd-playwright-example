
import { Page } from "playwright"
import { injectAxe, checkA11y, getViolations, reportViolations } from 'axe-playwright'

export class GenericPage {
    protected page: Page;
    protected baseURL: string;
    constructor(page: Page, baseURL: string) {
        this.page = page;
        this.baseURL = baseURL;
    }

    async getPage() {
        return this.page;
    }

    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async toggleLanguage() {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(`css=#wb-lng > ul > li`) // Always the first instance in light:DOM.
        ]);
    }

    async navigateHome() {
        await this.page.goto(this.baseURL);
    }

    async testAccessibility() {

        // Ensure all components are visible

        let accessibilityTags = ['wcag2a', 'best-practice']
        // notWorking = ['wcag2aa', 'wcag21a', 'wcag21aa', 'wcag***', 'ACT', 'section508', 'experimental']
        // https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter

        await injectAxe(this.page);
        // 'main' tag will exclude wet components
        const violations = await getViolations(this.page, null, {
            detailedReport: true,
            detailedReportOptions: { html: true },
            axeOptions: {
                runOnly: {
                    type: 'tag',
                    values: accessibilityTags,
                },
            },
        })


        const scrubbedVio = await this.removeANSI(JSON.stringify(violations[0]));
        console.log(scrubbedVio);
        // const map = new Map(Object.entries(violations));



        // console.log(typeof map)
        // console.log(map);

        // for (const [key, value] of Object.entries(violations)) {
        //     console.log(key, this.removeANSI(value));
        // }

        // return scrubbedVio;
        return violations;
    }

    protected async removeANSI(violations: string) {
        if (violations === undefined) { return violations; }


        const regex = 's/\x1b\[[0-9;]*m//g'

        // console.log('Hello myRegexp!'.replace(regex, 'World')) // = Hello World!
        return (violations.replace(regex, 'World')).replace(/["']/g, "");
    }




}
module.exports = { GenericPage }