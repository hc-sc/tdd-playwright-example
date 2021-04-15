# java-spring-api-template

[![CircleCI](https://circleci.com/gh/hc-sc/tdd-playwright-example/tree/dev.svg?style=svg&circle-token=92059dd0eb09d496bda4cde2b7bfdaa186c2f329)](https://circleci.com/gh/hc-sc/tdd-playwright-example/tree/dev)

## Local BootRun
* `clear && ./gradlew :api:bootRun --args="--spring.profiles.active=local"`
* `clear && ./gradlew :site:bootRun --args="--spring.profiles.active=local"`

## Heroku
Deployed: [here](http://tdd-playwright-example-server.herokuapp.com/)

## 🎭 Playwright

### Playwright CLI

#### Recording user-stories
* `npx playwright codegen https://tdd-playwright-example-server.herokuapp.com`

#### Defining browser and taking screenshots
Running tests in all browsers: `chromium, firefox, webkit`
* `npx folio -- param screenshotOnFailure`

Running tests in select available browsers:
* `npx folio --param browserName=chromium screenshotOnFailure`
* `clear &&  FOLIO_JUNIT_OUTPUT_NAME=test-results/playwright_e2e_junit.xml npx folio --reporter=junit,line --param browserName=chromium slowMo=1000 screenshotOnFailure`

Running tests with a reporter:
* `clear &&  FOLIO_JUNIT_OUTPUT_NAME=test-results/playwright_e2e_junit.xml npx folio --reporter=junit,line --param browserName=chromium slowMo=1000 screenshotOnFailure`



### Custom fixtures to support POM

## sonarQube
### Setup
* `docker volume create --name sonarqube_data`
* `docker volume create --name sonarqube_logs`
* `docker volume create --name sonarqube_extensions`
* `docker run --rm -p 9000:9000 -v sonarqube_extensions:/opt/sonarqube/extensions sonarqube:8.7.1-community`
* Navigate to `http://localhost:9000`
* Click `Create a project`
* Add a `Project key`, (can be any value).
* `Dispay name` should automatically be filled with the `Project key` value. Change the `Display name` if desired.
* Click `Setup`
* Enter a `Token name`, and click `Generate`. Make note of the generated token.
* Click `Continue`.
* Select the appropriate `build technology`. This project uses `Gradle`.
* Configure your `build` to include `sonarqube` and run the provided command to run the `sonarqube`.
* Run in shell: `./gradlew sonarqube \
  -Dsonar.projectKey=${projectKey} \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=${generatedToken}`
* Optional: Building sonarqube on a specific app is possible by prefixing the app name: `./gradlew :site:sonarqube \ ` [etc..]

## Support
### Heroku
#### Environment Variables
#### Dyno Usage
* Heroku provides 550 free dyno hours each month. For personal development, this allowance provides more than 17 hours a day in a 31 day month of development usage. To optimize this allowance, Heroku automatically puts the dyno to sleep after 30 minutes of no web traffic.
* If a sleeping web dyno receives web traffic, it will become active again after a short delay (assuming the Heroku account has free dyno hours available).
* When executing automated tests in CI/CD pipeline (ie. e2e), be mindful that sleep periods or test reruns may be needed upon running the first request on the dyno to allow the application to wake.
* Click [here](https://devcenter.heroku.com/articles/free-dyno-hours) for more information about dyno sleeping.

## Azure B2C
* [Azure AD Java Quickstartah for](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v2-java-webapp "Azure B2C Tutorial")

## Sources:
* [Playwright](https://playwright.dev/ "Playwright.dev")
* [Playwright-Github](https://github.com/microsoft/playwright "Playwright Github")
* [Playwright-Test](https://github.com/microsoft/playwright-test "Playwright-test")