const fs = require('fs');

const rawUrls = JSON.parse(fs.readFileSync('./scraped_data/scraped_urls.json', 'utf-8'));
const cleanedUrls = [...new Set(rawUrls)];

fs.writeFileSync('./scraped_data/cleaned_urls.json', JSON.stringify(cleanedUrls, null, 2));
console.log('URLs deduplicated and saved!');
