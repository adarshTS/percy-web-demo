const { Builder } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const percySnapshot = require('@percy/selenium-webdriver');
const { By } = require('selenium-webdriver');
const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;

var capabilities = {
	'bstack:options' : {
		"os" : "OS X",
		"osVersion" : "Ventura",
        "browserVersion" : "112.0",
		"projectName" : "adS_Studio",
		"debug" : "true",
		"networkLogs" : "true",
		"seleniumVersion" : "3.14.0",
		"userName" : process.env.BROWSERSTACK_USERNAME,
		"accessKey" : process.env.BROWSERSTACK_ACCESS_KEY,
		"localIdentifier" : process.env.BROWSERSTACK_LOCAL_IDENTIFIER
	},
	"browserName" : "Chrome",
}

  async function test (capabilities) {
    let driver = new webdriver.Builder()
    .usingServer(`http://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
    .withCapabilities({
      ...capabilities,
      ...capabilities['browser'] && { browserName: capabilities['browser']}  
    })
    .build();

  try {
    await driver.get('https://adarshts.github.io/percy-web-demo/', 1000);
    await percySnapshot(driver, 'Homepage');

    await driver.wait(webdriver.until.elementLocated(By.xpath("//a[text()='Designers']"))).click();
    await percySnapshot(driver, 'Designers Page');

    await driver.wait(webdriver.until.elementLocated(By.xpath("//a[text()='Contact']"))).click();
    await percySnapshot(driver, 'Contact Page');

    await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Done!"}}'
      );

  } 
  catch(e) {
    console.log("Error:", e)
    await driver.executeScript( 
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some actions failed to load."}}'
    );
  }
  
  finally {
    await driver.quit();
  }

}
test (capabilities);