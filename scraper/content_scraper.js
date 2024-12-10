const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Load URLs from the cleaned URLs file
const urls = JSON.parse(fs.readFileSync('./scraped_data/cleaned_urls.json', 'utf-8'));

(async () => {
    const scrapedContent = [];

    for (const url of urls) {
        try {
            console.log(`Scraping content from: ${url}`);
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            // Extract the page title
            const pageTitle = $('title').text().trim();

            // Extract text content from the body (limit to meaningful text)
            const pageContent = $('body')
                .text()
                .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with a single space
                .trim()
                .substring(0, 1000); // Limit content to 1000 characters

            scrapedContent.push({
                url,
                title: pageTitle,
                content: pageContent
            });

            console.log(`Successfully scraped content from: ${url}`);
        } catch (err) {
            console.error(`Error scraping content from ${url}:`, err.message);
        }
    }

    // Save the scraped content to a JSON file
    const filePath = './scraped_data/scraped_content.json';
    fs.writeFileSync(filePath, JSON.stringify(scrapedContent, null, 2));
    console.log(`Content scraped and saved to ${filePath}`);
})();
