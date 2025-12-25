import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

/**
 * Google Search Service
 * Handles searching Google and extracting blog/article links
 */
class GoogleSearchService {
    constructor() {
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        };
    }

    /**
     * Search Google for a query and return top blog/article links
     * @param {string} query - Search query
     * @param {number} limit - Number of results to return
     * @returns {Promise<Array>} Array of search results
     */
    async searchGoogle(query, limit = 2) {
        console.log(`Searching Google for: "${query}"`);
        
        try {
            // Method 1: Using Puppeteer for reliable scraping
            return await this.searchWithPuppeteer(query, limit);
        } catch (error) {
            console.error('Error searching Google:', error.message);
            
            // Fallback to axios if puppeteer fails
            try {
                return await this.searchWithAxios(query, limit);
            } catch (fallbackError) {
                console.error('Fallback search also failed:', fallbackError.message);
                return [];
            }
        }
    }

    /**
     * Search using Puppeteer (more reliable but slower)
     */
    async searchWithPuppeteer(query, limit) {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            await page.setUserAgent(this.headers['User-Agent']);
            
            // Navigate to Google search
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Wait for search results
            await page.waitForSelector('div#search', { timeout: 10000 });
            
            // Extract search results
            const results = await page.evaluate(() => {
                const items = [];
                const searchResults = document.querySelectorAll('div.g');
                
                searchResults.forEach(result => {
                    const linkElement = result.querySelector('a');
                    const titleElement = result.querySelector('h3');
                    const snippetElement = result.querySelector('.VwiC3b, .yXK7lf');
                    
                    if (linkElement && titleElement) {
                        const url = linkElement.href;
                        const title = titleElement.textContent;
                        const snippet = snippetElement ? snippetElement.textContent : '';
                        
                        // Filter out non-article URLs
                        if (url && !url.includes('youtube.com') && 
                            !url.includes('facebook.com') && 
                            !url.includes('twitter.com') &&
                            !url.includes('google.com')) {
                            items.push({ url, title, snippet });
                        }
                    }
                });
                
                return items;
            });
            
            console.log(`Found ${results.length} search results`);
            return results.slice(0, limit);
            
        } finally {
            await browser.close();
        }
    }

    /**
     * Search using Axios (faster but less reliable)
     */
    async searchWithAxios(query, limit) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        const response = await axios.get(searchUrl, {
            headers: this.headers,
            timeout: 15000
        });
        
        const $ = cheerio.load(response.data);
        const results = [];
        
        // Extract search results
        $('div.g').each((index, element) => {
            if (results.length >= limit) return false;
            
            const $element = $(element);
            const linkElement = $element.find('a').first();
            const titleElement = $element.find('h3').first();
            const snippetElement = $element.find('.VwiC3b, .yXK7lf').first();
            
            const url = linkElement.attr('href');
            const title = titleElement.text();
            const snippet = snippetElement.text();
            
            if (url && title && !url.includes('youtube.com') && 
                !url.includes('facebook.com') && !url.includes('google.com')) {
                results.push({ url, title, snippet });
            }
        });
        
        console.log(`Found ${results.length} search results`);
        return results;
    }

    /**
     * Filter results to only include blog/article URLs
     */
    filterBlogUrls(results) {
        const blogKeywords = ['blog', 'article', 'post', 'news', 'guide', 'tutorial'];
        
        return results.filter(result => {
            const url = result.url.toLowerCase();
            return blogKeywords.some(keyword => url.includes(keyword)) ||
                   url.match(/\/(blog|article|post|news)\//);
        });
    }
}

export default GoogleSearchService;
