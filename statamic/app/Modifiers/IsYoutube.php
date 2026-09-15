<?php

namespace App\Modifiers;

use Statamic\Modifiers\Modifier;

class IsYoutube extends Modifier
{
    /**
     * Return true if the value is a Youtube URL
     *
     * @param mixed  $value    The URL to check
     * @param array  $params   Any parameters used in the modifier
     * @return bool
     */
    public function index(
        $value , 
        $params
    ) {
        $is_youtube = false;

        if(strpos($value, "youtu.be") !== false) {
            $is_youtube = true;
        }
        if(strpos($value, "youtube") !== false) {
            $is_youtube = true;
        }

        if ($param = array_get($params, 0)) {
            if( $param == 'id' 
                && $is_youtube
            ) {
                $youtubeid = explode('v=', $value);
                $youtubeid = $youtubeid[1];
                $youtubeid = explode('?', $youtubeid);
                $youtubeid = $youtubeid[0];
                $youtubeid = explode('&', $youtubeid);
                $youtubeid = $youtubeid[0];

                return $youtubeid;
            }
        }
        

        
        return $is_youtube;
    }
}
