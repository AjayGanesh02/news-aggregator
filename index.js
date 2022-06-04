const PORT = 8000;

const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const scrapeCNN = async () => {

    //open browser and navigate to page
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://us.cnn.com/");
    await page.waitForSelector('.cd__headline-text');

    //scrape page
    const headlines = await page.$$eval('.cd__headline-text', (els) => {
        return els.map(el => {
            const obj = { 'title': el.innerText, 'link': el.parentElement.href };
            return obj;
        });
    });

    //cleanup and return
    await browser.close();

    return Promise.all(headlines);
}

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/scrape/CNN', async (req, res) => {
    const data = await scrapeCNN();
    res.send(data);
})

app.get('/scrape', async (req, res) => {
    data = [];
    const CNNres = await scrapeCNN();
    data = data.concat(CNNres);
    res.send(data);
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));