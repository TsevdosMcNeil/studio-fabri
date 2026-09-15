<?php

namespace App\Modifiers;

use Statamic\Modifiers\Modifier;

class IsVimeo extends Modifier
{
    /**
     * Return true if the value is a Vimeo URL
     *
     * @param mixed  $value    The URL to check
     * @return bool
     */
    public function index($value)
    {
        return strpos($value, "vimeo") !== false;
    }
}
