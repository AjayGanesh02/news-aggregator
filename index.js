const PORT = process.env.PORT || 8080;

const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/scrape', async (req, res) => {
    data = [];
    const CNNres = await scrapeCNN();
    data = data.concat(CNNres);
    res.send(data);
});

const scrapeCNN = async () => {

    //open browser and navigate to page
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://us.cnn.com/");
    await page.waitForSelector('.cd__headline-text');

    //scrape page
    const headlines = await page.$$eval('.cd__headline-text', async (els) => {
        const data = await els.map(el => {
            const obj = { 'title': el.innerText, 'link': el.parentElement.href };
            return obj;
        });

        return data;
    });

    //cleanup and return
    await browser.close();

    return headlines;
}

app.get('/scrape/CNN', async (req, res) => {
    const data = await scrapeCNN();
    res.send(data);
})