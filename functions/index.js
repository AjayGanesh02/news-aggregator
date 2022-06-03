const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const cors = require("cors")({origin: true});
// const cheerio = require("cheerio");
const puppeteer = require('puppeteer');
const fetch = require("node-fetch");

// const getHTML = async (url) => {
//     const res = await fetch(url);
//     const html = await res.text();
//     return html;
// }

const scrapeCNN = async () => {
    const browser = await puppeteer.launch( { headless: true });
    const page = await browser.newPage();
    await page.goto("https://us.cnn.com/");
    
    // const html = await getHTML("https://us.cnn.com/");
    // const $ = cheerio.load(html);

    const headlines = await page.$$eval('.cd__headline-text', (el) => {
        return el.map((i, el) => {
            return el.textContent;
        });
    });

    // const articles = [];

    // $(".cd__headline-text").each((i, el) => {
    //     articles.push({
    //         title: $(el).text(),
    //         link: $(el).parent().attr("href")
    //     });

    //     if (articles.length === 10) return false;
    // });

    return Promise.all(headlines);
}


exports.scrape = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        const data = await scrapeCNN();

        response.send(data);

    });
});
