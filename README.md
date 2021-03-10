# java-spring-api-template

[![CircleCI](https://circleci.com/gh/hc-sc/tdd-playwright-example/tree/dev.svg?style=svg&circle-token=92059dd0eb09d496bda4cde2b7bfdaa186c2f329)](https://circleci.com/gh/hc-sc/tdd-playwright-example/tree/dev)

## Local BootRun
`clear && ./gradlew :api:bootRun --args="--spring.profiles.active=local"`
`clear && ./gradlew :site:bootRun --args="--spring.profiles.active=local"`


## Playwright

### Playwright CLI

#### Recording user-stories
`npx playwright codegen https://tdd-playwright-example-server.herokuapp.com`

#### Defining browser and taking screenshots
`npx folio --param browserName=chromium screenshotOnFailure`

## Sources:
* [Playwright](https://playwright.dev/ "Playwright.dev")
* [Playwright-Github](https://github.com/microsoft/playwright "Playwright Github")
* [Playwright-Test](https://github.com/microsoft/playwright-test "Playwright-test")
