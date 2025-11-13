<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Role extends SpatieRole implements Auditable
{
    use AuditableTrait;

    /**
     * Attributes to exclude from the Audit.
     *
     * @var array
     */
    protected $auditExclude = [
        'created_at',
        'updated_at',
    ];
    
    /**
     * Attributes to be audited.
     *
     * @var array
     */
    protected $auditAttributeModifiers = [
        'permissions' => 'collect_permission_names',
    ];
    
    /**
     * Custom attribute modifier to collect permission names.
     *
     * @param mixed $value
     * @return array
     */
    public function collectPermissionNamesAttributeModifier($value)
    {
        return $this->permissions->pluck('name')->toArray();
    }
}