import OpenAI from 'openai';

/**
 * LLM Service for Article Enhancement
 * Uses OpenAI API to improve article content
 */
class LLMService {
    constructor(apiKey) {
        this.openai = new OpenAI({
            apiKey: apiKey || process.env.OPENAI_API_KEY
        });
    }

    /**
     * Enhance article based on reference articles
     * @param {Object} originalArticle - Original article data
     * @param {Array} referenceArticles - Reference articles from Google
     * @returns {Promise<Object>} Enhanced article
     */
    async enhanceArticle(originalArticle, referenceArticles) {
        console.log('Enhancing article with LLM...');
        
        try {
            const prompt = this.buildPrompt(originalArticle, referenceArticles);
            
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert content writer and SEO specialist. Your task is to improve articles by analyzing top-ranking content and applying best practices for formatting, structure, and readability.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 3000
            });
            
            const enhancedContent = response.choices[0].message.content;
            
            console.log('Article enhanced successfully');
            
            return {
                content: enhancedContent,
                originalContent: originalArticle.content,
                references: referenceArticles.map(ref => ({
                    title: ref.title,
                    url: ref.url
                })),
                enhancedAt: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Error enhancing article:', error.message);
            throw error;
        }
    }

    /**
     * Build prompt for LLM
     */
    buildPrompt(originalArticle, referenceArticles) {
        const referencesText = referenceArticles.map((ref, index) => `
### Reference Article ${index + 1}: ${ref.title}
URL: ${ref.url}

Content Preview:
${ref.content.substring(0, 1500)}...

---
        `).join('\n');

        return `
I need you to improve the following article by analyzing top-ranking content from Google search results.

## Original Article
Title: ${originalArticle.title}

Content:
${originalArticle.content}

---

## Top-Ranking Reference Articles

${referencesText}

---

## Your Task

1. Analyze the formatting, structure, and content style of the reference articles
2. Improve the original article by:
   - Enhancing the formatting (use proper headings, bullet points, etc.)
   - Improving readability and flow
   - Adding relevant information from reference articles where appropriate
   - Maintaining the core message of the original article
   - Making it more comprehensive and valuable to readers
   - Optimizing for SEO while keeping it natural

3. Return ONLY the improved article content in Markdown format
4. DO NOT include phrases like "Here's the improved version" or meta-commentary
5. Start directly with the article title as H1 (# Title)

Please provide the enhanced article now:
        `;
    }

    /**
     * Generate article summary
     */
    async generateSummary(content) {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'Generate a concise 2-3 sentence summary of the article.'
                    },
                    {
                        role: 'user',
                        content: `Summarize this article:\n\n${content.substring(0, 2000)}`
                    }
                ],
                temperature: 0.5,
                max_tokens: 150
            });
            
            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error generating summary:', error.message);
            return '';
        }
    }
}

export default LLMService;
