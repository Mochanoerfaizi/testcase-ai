<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoryAdditional extends Model
{
    use HasFactory;

    protected $fillable = ['story_id', 'key', 'label', 'value', 'description'];

    public function story()
    {
        return $this->belongsTo(Story::class);
    }
}
