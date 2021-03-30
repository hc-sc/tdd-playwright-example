import { IndexPage } from '../PO/IndexPage';
import { describe, it, expect } from './fixtures'

/**
 * To use local environment variables, create a .env file and set the BASE_URL to the local endpoint being tested.
 * See the CircleCI config.yml file for how the BASE_URL is injected with a value during CI/CD pipeline.
 */

enum Request {
    Server = 'SERVER',
    Client = 'CLIENT',
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE'
}

for (const side of [Request.Server, Request.Client]) {

    describe.skip(`Index: ${side} `, () => {

        let inputId: string;
        let inputName = 'Jane';
        let inputRole = 'Manager';

        it('EN/FR', async ({ indexPage }) => {

            // let indexPage: IndexPage = new IndexPage(page, baseURL);

            await indexPage.navigateHome();
            await indexPage.getCurrentLanguage()
            await assertGreetingLanguage(indexPage);
            await indexPage.toggleLanguage();
            await assertGreetingLanguage(indexPage);


        });

        it(`Post One: ${side}`, async ({ indexPage }) => {

            await indexPage.navigateHome();

            await indexPage.postOne(side, inputName, inputRole);

            inputId = await indexPage.firstRowIdValue(side); // Saving for other tests
            await assertTableRows(indexPage, side, inputName, inputRole, Request.Post)


        });

        it('Get One', async ({ indexPage }) => {

            await indexPage.navigateHome();

            await indexPage.getOne(side, inputId);

            await assertTableRows(indexPage, side, inputName, inputRole, Request.Get)

        });

        it('Update One', async ({ indexPage }) => {

            await indexPage.navigateHome();

            inputRole = swapRoles(inputRole);

            await indexPage.updateOne(side, inputId, inputName, inputRole);

            await assertTableRows(indexPage, side, inputName, inputRole, Request.Put)

        });


        it('Get All', async ({ indexPage }) => {

            await indexPage.navigateHome();
            await indexPage.getAll(side);
            await assertTableRows(indexPage, side, inputName, inputRole, Request.Get);
        });

        it('Delete One', async ({ indexPage }) => {

            await indexPage.navigateHome();

            await indexPage.deleteOne(side, inputId);

            await assertTableRows(indexPage, side, inputName, inputRole, Request.Delete)

        });

        it('Errors Page,', async ({ indexPage }) => {
            await indexPage.navigateErrors();
        })

    })
}


// ------------- Test Utility Functions --------------- //


function swapRoles(inputRole: string) {
    return (inputRole === 'Manager' ? 'Director' : 'Manager');
}

async function assertGreetingLanguage(indexPage: IndexPage) {
    const lang = await indexPage.getCurrentLanguage();
    const greeting = lang === 'English' ? 'Welcome!' : 'Bienvenue!';
    // console.log(`LANG: ${lang} Greet: ${greeting}`);
    // expect(await indexPage.getGreeting()).toBe(greeting);
    expect(await indexPage.getGreeting()).not.toBe(greeting);
}

async function assertTableRows(indexPage: IndexPage, side: Request, inputName: string, inputRole: string, request: string) {

    let rowIndex: number = await indexPage.getLastRowIndex(side);

    let rowValues = await indexPage.getRowValues(rowIndex, side);

    let htmlId = rowValues[0];
    let htmlName = rowValues[1];
    let htmlRole = rowValues[2];
    let htmlComment = rowValues[3];

    let inputId = htmlId;
    let commentToAssert = request === Request.Delete ? 'Deleted' : '';

    expect(htmlName).toBe(inputName);
    expect(htmlRole).toBe(inputRole);
    expect(htmlComment).toBe(commentToAssert);

    await indexPage.clickRow(side, rowIndex);

    const errors = await indexPage.warningsVisible();
    if (errors) {
        expect(errors).toBeTruthy();
        return; // Remaining assertions not possible.
    }


    if (request !== Request.Delete) {
        rowValues = await indexPage.getRowValues(1, Request.Server);
        let htmlId = rowValues[0];
        let htmlName = rowValues[1];
        let htmlRole = rowValues[2];
        let htmlComment = rowValues[3];

        expect(htmlId).toBe(inputId);
        expect(htmlName).toBe(inputName);
        expect(htmlRole).toBe(inputRole);
        expect(htmlComment).toBe(commentToAssert);
    }

}
