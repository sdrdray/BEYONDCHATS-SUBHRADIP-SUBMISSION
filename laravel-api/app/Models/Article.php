<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'original_content',
        'excerpt',
        'url',
        'references',
        'is_updated',
    ];

    protected $casts = [
        'references' => 'array',
        'is_updated' => 'boolean',
    ];
}
