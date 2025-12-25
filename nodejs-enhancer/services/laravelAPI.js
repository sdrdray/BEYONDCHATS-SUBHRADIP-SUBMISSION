import axios from 'axios';

/**
 * Laravel API Service
 * Handles communication with Laravel backend
 */
class LaravelAPIService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || process.env.LARAVEL_API_URL || 'http://localhost:8000/api';
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 10000
        });
    }

    /**
     * Get latest article
     */
    async getLatestArticle() {
        try {
            console.log('Fetching latest article from Laravel API...');
            const response = await this.client.get('/articles/latest/get');
            
            if (response.data.success) {
                console.log(`Retrieved article: ${response.data.data.title}`);
                return response.data.data;
            } else {
                throw new Error('Failed to fetch latest article');
            }
        } catch (error) {
            console.error('Error fetching latest article:', error.message);
            throw error;
        }
    }

    /**
     * Get all articles
     */
    async getAllArticles(page = 1, perPage = 15) {
        try {
            const response = await this.client.get('/articles', {
                params: { page, per_page: perPage }
            });
            
            return response.data.data;
        } catch (error) {
            console.error('Error fetching articles:', error.message);
            throw error;
        }
    }

    /**
     * Get article by ID
     */
    async getArticle(id) {
        try {
            const response = await this.client.get(`/articles/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching article ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Create new article
     */
    async createArticle(articleData) {
        try {
            console.log('Creating new article via API...');
            const response = await this.client.post('/articles', articleData);
            
            if (response.data.success) {
                console.log(`Article created successfully: ID ${response.data.data.id}`);
                return response.data.data;
            } else {
                throw new Error('Failed to create article');
            }
        } catch (error) {
            console.error('Error creating article:', error.message);
            throw error;
        }
    }

    /**
     * Update existing article
     */
    async updateArticle(id, articleData) {
        try {
            console.log(`Updating article ${id} via API...`);
            const response = await this.client.put(`/articles/${id}`, articleData);
            
            if (response.data.success) {
                console.log(`Article ${id} updated successfully`);
                return response.data.data;
            } else {
                throw new Error('Failed to update article');
            }
        } catch (error) {
            console.error(`Error updating article ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Delete article
     */
    async deleteArticle(id) {
        try {
            const response = await this.client.delete(`/articles/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting article ${id}:`, error.message);
            throw error;
        }
    }
}

export default LaravelAPIService;
