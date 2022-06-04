// in a new folder be sure to run "npm init -y" and "npm install puppeteer"
const puppeteer = require("puppeteer")
const fs = require("fs/promises")

async function start() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    devtools: true
})
  const page = await browser.newPage()

  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://food.grab.com/sg/en/restaurants', ['geolocation']);

  const client = await page.target().createCDPSession();
  await client.send('Emulation.setGeolocationOverride', {
        latitude: 90,
        longitude: 90,
        accuracy: 100
    });
  
  // Changes to the north pole's location
  await page.goto("https://food.grab.com/sg/en/restaurants")

  const result = await page.evaluate(() => {
    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
    });
});
console.log(result);
  await browser.close()
}

start()
