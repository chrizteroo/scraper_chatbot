#mkdir scraper_chatbot cd scraper_chatbot#yarn add axios cheerio
# Create the root project folder
# mkdir scraper_chatbot
cd scraper_chatbot

# Create subdirectories
mkdir scraped_data scraper chatbot public

# Create files inside the scraped_data directory
touch scraped_data/scraped_urls.json
touch scraped_data/cleaned_urls.json
touch scraped_data/scraped_content.json

# Create files inside the scraper directory
touch scraper/sitemap_scraper.js
touch scraper/cleaner.js
touch scraper/content_scraper.js

# Create files inside the chatbot directory
touch chatbot/chatbot.js
touch chatbot/chatbot_routes.js

# Create files inside the public directory
touch public/index.html
touch public/chatbot.css
touch public/chatbot.js

# Create the root-level files
touch .env
touch package.json
touch yarn.lock
touch README.md
Open Terminal code.yarn init -y
yarn add axios cheerio dotenv express yarn ad openai# Use node scraper/content_scraper.js# node scraper/sitemap_scraper.json use yarn scrape-all
yarn dev
open http://localhost:3000
Engage chatbot

Project Structure
scraper_chatbot/
├── chatbot/
│   ├── server.js
│   ├── chatbot_routes.js
├── public/
│   ├── index.html
│   ├── chatbot.css
│   ├── chatbot.js
├── scraped_data/
│   ├── scraped_urls.json
│   ├── cleaned_urls.json
│   ├── scraped_content.json
├── scraper/
│   ├── sitemap_scraper.js
│   ├── cleaner.js
│   ├── content_scraper.js
├── .env
├── package.json
├── yarn.lock
# Ai-Automated-Market-Maker
