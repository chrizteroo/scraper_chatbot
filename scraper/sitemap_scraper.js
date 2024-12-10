const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
    // Define the base URLs to scrape
    const baseUrls = [
        'https://www.gemini.com/cryptopedia',
        'https://www.openware.com/solution/digital-assets-exchange'
    ];

    let scrapedUrls = [];

    for (const baseUrl of baseUrls) {
        try {
            console.log(`Scraping links from: ${baseUrl}`);
            const { data } = await axios.get(baseUrl);
            const $ = cheerio.load(data);

            // Extract and process all <a> tags
            $('a').each((_, element) => {
                const href = $(element).attr('href');

                if (href) {
                    // Handle relative URLs
                    const fullUrl = href.startsWith('http') ? href : new URL(href, baseUrl).href;

                    // Add only unique URLs
                    if (!scrapedUrls.includes(fullUrl)) {
                        scrapedUrls.push(fullUrl);
                    }
                }
            });

            console.log(`Successfully scraped links from: ${baseUrl}`);
        } catch (err) {
            console.error(`Error scraping ${baseUrl}:`, err.message);
        }
    }

    // Remove duplicate URLs
    scrapedUrls = [...new Set(scrapedUrls)];

    // Save the scraped URLs to a JSON file
    const filePath = './scraped_data/scraped_urls.json';
    fs.writeFileSync(filePath, JSON.stringify(scrapedUrls, null, 2));
    console.log(`Scraped URLs saved to ${filePath}`);
})();
