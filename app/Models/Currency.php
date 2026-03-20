<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $table = 'currency';
    protected $fillable = ['base', 'usd', 'inr', 'created_at', 'updated_at'];
}
