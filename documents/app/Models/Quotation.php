<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{

    protected $table = 'quotation';
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id', 'serial', 'description', 'value',
        'discount', 'taxing'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
    protected $hidden = [
        'password',
    ];
}
