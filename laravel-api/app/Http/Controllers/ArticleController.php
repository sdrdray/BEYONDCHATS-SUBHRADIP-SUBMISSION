<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 15);
            $articles = Article::orderBy('created_at', 'desc')->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => $articles
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching articles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new article
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'original_content' => 'nullable|string',
                'excerpt' => 'nullable|string',
                'url' => 'nullable|url',
                'references' => 'nullable|array',
                'is_updated' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $article = Article::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Article created successfully',
                'data' => $article
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a specific article
     */
    public function show($id)
    {
        try {
            $article = Article::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $article
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update an existing article
     */
    public function update(Request $request, $id)
    {
        try {
            $article = Article::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'content' => 'sometimes|required|string',
                'original_content' => 'nullable|string',
                'excerpt' => 'nullable|string',
                'url' => 'nullable|url',
                'references' => 'nullable|array',
                'is_updated' => 'nullable|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $article->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Article updated successfully',
                'data' => $article
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an article
     */
    public function destroy($id)
    {
        try {
            $article = Article::findOrFail($id);
            $article->delete();

            return response()->json([
                'success' => true,
                'message' => 'Article deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the latest article
     */
    public function latest()
    {
        try {
            $article = Article::orderBy('created_at', 'desc')->first();
            
            if (!$article) {
                return response()->json([
                    'success' => false,
                    'message' => 'No articles found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $article
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching latest article',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
