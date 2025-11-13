<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;
use OwenIt\Auditing\Contracts\Auditable;

class Permission extends SpatiePermission implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    /**
     * Attributes to exclude from the Audit.
     *
     * @var array
     */
    protected $auditExclude = [
        'created_at',
        'updated_at',
    ];
}