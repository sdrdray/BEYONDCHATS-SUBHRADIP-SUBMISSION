import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

/**
 * Article Scraper Service
 * Extracts main content from article URLs
 */
class ArticleScraperService {
    constructor() {
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        };
    }

    /**
     * Scrape content from a URL
     * @param {string} url - Article URL
     * @returns {Promise<Object>} Article content
     */
    async scrapeArticle(url) {
        console.log(`Scraping article from: ${url}`);
        
        try {
            // Try with Puppeteer first for dynamic content
            return await this.scrapeWithPuppeteer(url);
        } catch (error) {
            console.error(`Puppeteer failed for ${url}:`, error.message);
            
            // Fallback to axios for static content
            try {
                return await this.scrapeWithAxios(url);
            } catch (fallbackError) {
                console.error(`Axios also failed for ${url}:`, fallbackError.message);
                return {
                    url,
                    title: '',
                    content: '',
                    error: fallbackError.message
                };
            }
        }
    }

    /**
     * Scrape multiple articles
     */
    async scrapeMultipleArticles(urls) {
        console.log(`Scraping ${urls.length} articles...`);
        const results = [];
        
        for (const url of urls) {
            const article = await this.scrapeArticle(url);
            results.push(article);
            
            // Add delay to avoid rate limiting
            await this.delay(1000);
        }
        
        return results;
    }

    /**
     * Scrape using Puppeteer
     */
    async scrapeWithPuppeteer(url) {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            await page.setUserAgent(this.headers['User-Agent']);
            
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });
            
            // Wait for content to load
            await page.waitForSelector('body', { timeout: 10000 });
            
            // Extract article content
            const articleData = await page.evaluate(() => {
                // Try to find article element
                const article = document.querySelector('article') ||
                               document.querySelector('main') ||
                               document.querySelector('.post-content') ||
                               document.querySelector('.article-content') ||
                               document.querySelector('.content');
                
                // Extract title
                const titleElement = document.querySelector('h1') ||
                                   document.querySelector('.title') ||
                                   document.querySelector('.post-title');
                const title = titleElement ? titleElement.textContent.trim() : '';
                
                // Extract content
                let content = '';
                if (article) {
                    // Remove unwanted elements
                    const unwanted = article.querySelectorAll('script, style, nav, footer, aside, .advertisement, .ads');
                    unwanted.forEach(el => el.remove());
                    
                    // Get text content preserving paragraphs
                    const paragraphs = article.querySelectorAll('p, h2, h3, h4, li');
                    const textParts = Array.from(paragraphs).map(p => p.textContent.trim());
                    content = textParts.filter(t => t.length > 20).join('\n\n');
                } else {
                    // Fallback to body content
                    const paragraphs = document.querySelectorAll('p');
                    const textParts = Array.from(paragraphs).map(p => p.textContent.trim());
                    content = textParts.filter(t => t.length > 20).join('\n\n');
                }
                
                return { title, content };
            });
            
            return {
                url,
                title: articleData.title,
                content: articleData.content,
                wordCount: articleData.content.split(/\s+/).length
            };
            
        } finally {
            await browser.close();
        }
    }

    /**
     * Scrape using Axios
     */
    async scrapeWithAxios(url) {
        const response = await axios.get(url, {
            headers: this.headers,
            timeout: 15000
        });
        
        const $ = cheerio.load(response.data);
        
        // Remove unwanted elements
        $('script, style, nav, footer, aside, .advertisement, .ads').remove();
        
        // Try to find article content
        const article = $('article').first().length ? $('article').first() :
                       $('main').first().length ? $('main').first() :
                       $('.post-content').first().length ? $('.post-content').first() :
                       $('.article-content').first().length ? $('.article-content').first() :
                       $('.content').first();
        
        // Extract title
        const title = $('h1').first().text().trim() ||
                     $('.title').first().text().trim() ||
                     $('.post-title').first().text().trim() ||
                     $('title').text().trim();
        
        // Extract content
        let content = '';
        if (article.length) {
            const paragraphs = article.find('p, h2, h3, h4, li');
            const textParts = paragraphs.map((i, el) => $(el).text().trim()).get();
            content = textParts.filter(t => t.length > 20).join('\n\n');
        } else {
            // Fallback to all paragraphs
            const paragraphs = $('p');
            const textParts = paragraphs.map((i, el) => $(el).text().trim()).get();
            content = textParts.filter(t => t.length > 20).join('\n\n');
        }
        
        return {
            url,
            title,
            content,
            wordCount: content.split(/\s+/).length
        };
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default ArticleScraperService;
