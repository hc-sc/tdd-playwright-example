# java-spring-api-template

[![CircleCI](https://circleci.com/gh/hc-sc/tdd-playwright-example/tree/dev.svg?style=svg&circle-token=92059dd0eb09d496bda4cde2b7bfdaa186c2f329)](https://circleci.com/gh/hc-sc/tdd-playwright-example/tree/dev)

## Local BootRun
* `clear && ./gradlew :api:bootRun --args="--spring.profiles.active=local"`
* `clear && ./gradlew :site:bootRun --args="--spring.profiles.active=local"`

## Heroku
Deployed: [here](http://tdd-playwright-example-server.herokuapp.com/)

## Playwright

### Playwright CLI

#### Recording user-stories
* `npx playwright codegen https://tdd-playwright-example-server.herokuapp.com`

#### Defining browser and taking screenshots
Running tests in all browsers: `chromium, firefox, webkit`
* `npx folio -- param screenshotOnFailure`

Running tests in select available browsers:
* `npx folio --param browserName=chromium screenshotOnFailure`

## Support
### Heroku
#### Environment Variables
#### Dyno Usage
* Heroku provides 550 free dyno hours each month. For personal development, this allowance provides more than 17 hours a day in a 31 day month of development usage. To optimize this allowance, Heroku automatically puts the dyno to sleep after 30 minutes of no web traffic.
* If a sleeping web dyno receives web traffic, it will become active again after a short delay (assuming the Heroku account has free dyno hours available).
* When executing automated tests in CI/CD pipeline, be mindful that sleep periods may be needed upon running the first request on the dyno to allow the application to wake.
* Click [here](https://devcenter.heroku.com/articles/free-dyno-hours) for more information about dyno sleeping.

## Sources:
* [Playwright](https://playwright.dev/ "Playwright.dev")
* [Playwright-Github](https://github.com/microsoft/playwright "Playwright Github")
* [Playwright-Test](https://github.com/microsoft/playwright-test "Playwright-test")
