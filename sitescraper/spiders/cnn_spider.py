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
        desc_parts = []
        for paragraph in response.css("p *::text").getall():
            desc_parts.append(paragraph.strip())
        yield {
            "title": response.css("h1::text").get().strip(),
            "description": " ".join(desc_parts),
            "source": "CNN",
            "url": response.url
        }

