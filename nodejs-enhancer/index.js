import dotenv from 'dotenv';
import GoogleSearchService from './services/googleSearch.js';
import ArticleScraperService from './services/articleScraper.js';
import LLMService from './services/llmService.js';
import LaravelAPIService from './services/laravelAPI.js';

// Load environment variables
dotenv.config();

/**
 * Main Article Enhancement Workflow
 */
class ArticleEnhancer {
    constructor() {
        this.googleSearch = new GoogleSearchService();
        this.articleScraper = new ArticleScraperService();
        this.llmService = new LLMService();
        this.laravelAPI = new LaravelAPIService();
    }

    /**
     * Run the complete enhancement workflow
     */
    async run() {
        try {
            console.log('='.repeat(60));
            console.log('Starting Article Enhancement Workflow');
            console.log('='.repeat(60));
            console.log('');

            // Step 1: Fetch latest article from Laravel API
            console.log('STEP 1: Fetching latest article from Laravel API');
            console.log('-'.repeat(60));
            const originalArticle = await this.laravelAPI.getLatestArticle();
            console.log(`✓ Retrieved: "${originalArticle.title}"`);
            console.log('');

            // Step 2: Search Google for the article title
            console.log('STEP 2: Searching Google for article title');
            console.log('-'.repeat(60));
            const searchResults = await this.googleSearch.searchGoogle(
                originalArticle.title,
                2
            );
            
            if (searchResults.length === 0) {
                console.log('✗ No search results found. Exiting...');
                return;
            }
            
            console.log(`✓ Found ${searchResults.length} search results:`);
            searchResults.forEach((result, index) => {
                console.log(`  ${index + 1}. ${result.title}`);
                console.log(`     ${result.url}`);
            });
            console.log('');

            // Step 3: Scrape content from top 2 articles
            console.log('STEP 3: Scraping content from reference articles');
            console.log('-'.repeat(60));
            const referenceArticles = await this.articleScraper.scrapeMultipleArticles(
                searchResults.map(r => r.url)
            );
            
            console.log('✓ Scraped reference articles:');
            referenceArticles.forEach((article, index) => {
                console.log(`  ${index + 1}. ${article.title} (${article.wordCount} words)`);
            });
            console.log('');

            // Step 4: Enhance article using LLM
            console.log('STEP 4: Enhancing article with LLM');
            console.log('-'.repeat(60));
            const enhancedData = await this.llmService.enhanceArticle(
                originalArticle,
                referenceArticles
            );
            console.log('✓ Article enhanced successfully');
            console.log('');

            // Step 5: Format references
            console.log('STEP 5: Formatting references');
            console.log('-'.repeat(60));
            const referencesSection = this.formatReferences(referenceArticles);
            const finalContent = enhancedData.content + '\n\n' + referencesSection;
            console.log('✓ References added to article');
            console.log('');

            // Step 6: Publish enhanced article
            console.log('STEP 6: Publishing enhanced article to Laravel API');
            console.log('-'.repeat(60));
            const publishedArticle = await this.publishArticle(
                originalArticle,
                finalContent,
                enhancedData.references
            );
            console.log(`✓ Article published successfully with ID: ${publishedArticle.id}`);
            console.log('');

            // Summary
            console.log('='.repeat(60));
            console.log('✓ WORKFLOW COMPLETED SUCCESSFULLY');
            console.log('='.repeat(60));
            console.log(`Original Article: ${originalArticle.title}`);
            console.log(`Enhanced Article ID: ${publishedArticle.id}`);
            console.log(`References: ${referenceArticles.length} articles`);
            console.log('');

            return publishedArticle;

        } catch (error) {
            console.error('');
            console.error('='.repeat(60));
            console.error('✗ ERROR IN WORKFLOW');
            console.error('='.repeat(60));
            console.error(`Error: ${error.message}`);
            console.error('');
            if (error.stack) {
                console.error('Stack trace:');
                console.error(error.stack);
            }
            throw error;
        }
    }

    /**
     * Format references section
     */
    formatReferences(referenceArticles) {
        const references = referenceArticles.map((article, index) => {
            return `${index + 1}. [${article.title}](${article.url})`;
        }).join('\n');

        return `---

## References

This article was enhanced based on analysis of the following top-ranking articles:

${references}

*Last updated: ${new Date().toLocaleDateString()}*`;
    }

    /**
     * Publish enhanced article
     */
    async publishArticle(originalArticle, enhancedContent, references) {
        // Create a new article entry with the enhanced content
        const newArticleData = {
            title: originalArticle.title + ' (Enhanced)',
            content: enhancedContent,
            original_content: originalArticle.content,
            excerpt: await this.generateExcerpt(enhancedContent),
            url: originalArticle.url,
            references: references,
            is_updated: true
        };

        return await this.laravelAPI.createArticle(newArticleData);
    }

    /**
     * Generate excerpt from content
     */
    async generateExcerpt(content) {
        // Remove markdown and get first 200 characters
        const plainText = content
            .replace(/#{1,6}\s/g, '')  // Remove headers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Remove links
            .replace(/[*_~`]/g, '')  // Remove markdown formatting
            .trim();

        return plainText.substring(0, 200) + '...';
    }
}

// Run the workflow
const enhancer = new ArticleEnhancer();
enhancer.run()
    .then(() => {
        console.log('Process completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Process failed:', error.message);
        process.exit(1);
    });
