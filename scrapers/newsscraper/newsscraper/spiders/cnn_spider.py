from pathlib import Path

import scrapy


class CNNSpider(scrapy.Spider):
    name = "CNN"
    start_urls = ["https://cnn.com/"]

    def parse(self, response):
        articles = response.css("a[data-link-type = article]::attr(href)").getall()
        for article in articles:
            yield response.follow(article, callback=self.parse_article)
    
    def parse_article(self, response):
        yield {
            "text": "test"
        }

