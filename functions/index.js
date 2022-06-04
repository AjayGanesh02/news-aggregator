const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const puppeteer = require('puppeteer');

const scrapeCNN = async () => {

    //open browser and navigate to page
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://us.cnn.com/");
    await page.waitForSelector('.cd__headline-text');

    //scrape page
    const headlines = await page.$$eval('.cd__headline-text', (els) => {
        return els.map(el => {
            const obj = {'title': el.innerText, 'link': el.parentElement.href};
            return obj;
        });
    });

    //cleanup and return
    await browser.close();

    return Promise.all(headlines);
}


exports.scrape = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        const data = await scrapeCNN();

        response.send(data);

    });
});
