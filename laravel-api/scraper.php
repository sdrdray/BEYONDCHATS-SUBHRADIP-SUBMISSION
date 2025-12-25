#!/usr/bin/env php
<?php

/**
 * BeyondChats Blog Scraper
 * Fetches the 5 oldest articles from BeyondChats blog
 */

require __DIR__.'/vendor/autoload.php';

use GuzzleHttp\Client;
use App\Models\Article;

class BeyondChatsScraper
{
    private $client;
    private $baseUrl = 'https://beyondchats.com';

    public function __construct()
    {
        $this->client = new Client([
            'verify' => false,
            'timeout' => 30,
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ]
        ]);
    }

    public function scrapeOldestArticles($count = 5)
    {
        echo "Starting to scrape BeyondChats blog...\n";
        
        try {
            // Fetch the blogs page
            $response = $this->client->get($this->baseUrl . '/blogs/');
            $html = (string) $response->getBody();
            
            // Parse HTML to extract articles
            $articles = $this->parseArticles($html);
            
            // Get the oldest articles (from the end of the array)
            $oldestArticles = array_slice($articles, -$count);
            
            echo "Found " . count($oldestArticles) . " articles to save\n";
            
            // Save to database
            foreach ($oldestArticles as $article) {
                $this->saveArticle($article);
            }
            
            echo "Successfully scraped and saved articles!\n";
            return $oldestArticles;
            
        } catch (\Exception $e) {
            echo "Error: " . $e->getMessage() . "\n";
            return [];
        }
    }

    private function parseArticles($html)
    {
        $articles = [];
        
        // Extract article data using regex patterns
        // This is a basic implementation - adjust based on actual HTML structure
        preg_match_all('/<article[^>]*>(.*?)<\/article>/is', $html, $articleMatches);
        
        foreach ($articleMatches[1] as $articleHtml) {
            // Extract title
            if (preg_match('/<h[1-6][^>]*>(.*?)<\/h[1-6]>/is', $articleHtml, $titleMatch)) {
                $title = strip_tags($titleMatch[1]);
            } else {
                continue;
            }
            
            // Extract URL
            $url = '';
            if (preg_match('/href=["\']([^"\']*)["\']/', $articleHtml, $urlMatch)) {
                $url = $urlMatch[1];
                if (!str_starts_with($url, 'http')) {
                    $url = $this->baseUrl . $url;
                }
            }
            
            // Extract excerpt/content
            if (preg_match('/<p[^>]*>(.*?)<\/p>/is', $articleHtml, $excerptMatch)) {
                $excerpt = strip_tags($excerptMatch[1]);
            } else {
                $excerpt = '';
            }
            
            $articles[] = [
                'title' => trim($title),
                'excerpt' => trim($excerpt),
                'url' => $url,
                'content' => $this->fetchArticleContent($url)
            ];
        }
        
        return $articles;
    }

    private function fetchArticleContent($url)
    {
        if (empty($url)) {
            return '';
        }
        
        try {
            $response = $this->client->get($url);
            $html = (string) $response->getBody();
            
            // Extract main content
            if (preg_match('/<article[^>]*>(.*?)<\/article>/is', $html, $contentMatch)) {
                return strip_tags($contentMatch[1], '<p><h1><h2><h3><h4><h5><h6><ul><ol><li><strong><em><a>');
            }
            
            return strip_tags($html, '<p><h1><h2><h3><h4><h5><h6><ul><ol><li><strong><em><a>');
            
        } catch (\Exception $e) {
            echo "Error fetching article content: " . $e->getMessage() . "\n";
            return '';
        }
    }

    private function saveArticle($articleData)
    {
        try {
            Article::create([
                'title' => $articleData['title'],
                'content' => $articleData['content'],
                'original_content' => $articleData['content'],
                'excerpt' => $articleData['excerpt'],
                'url' => $articleData['url'],
                'is_updated' => false
            ]);
            
            echo "Saved: {$articleData['title']}\n";
        } catch (\Exception $e) {
            echo "Error saving article: " . $e->getMessage() . "\n";
        }
    }
}

// Bootstrap Laravel
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Run scraper
$scraper = new BeyondChatsScraper();
$scraper->scrapeOldestArticles(5);
