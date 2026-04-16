<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testcase extends Model
{
    protected $fillable = [
        'story_id',
        'tc_id',
        'title',
        'summary',
        'severity',
        'prerequisites',
        'test_procedure',
        'expected_result',
        'case_type'
    ];

    public function story()
    {
        return $this->belongsTo(Story::class);
    }
}
