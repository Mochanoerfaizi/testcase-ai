<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    protected $fillable = [
        'taiga_id',
        'product_id',
        'subject',
        'description',
        'taiga_created_at',
        'creator_name',
        'creator_email',
        'assigned_to',
    ];

    protected $casts = [
        'assigned_to' => 'array',
        'taiga_created_at' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    //
}
