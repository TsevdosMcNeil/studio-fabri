<?php

namespace App\Modifiers;

use Statamic\Modifiers\Modifier;
use Illuminate\Support\Facades\Log;

class GetVideoId extends Modifier
{
    /**
     * Return the ID value of the Vimeo URL
     *
     * @param mixed  $url    The URL to be checked
     * @return mixed
     */
    public function index($url)
    {
        $is_youtube = false;

        if(strpos($url, "youtu.be") !== false) {
            $is_youtube = true;
        }
        if(strpos($url, "youtube") !== false) {
            $is_youtube = true;
        }

        if( $is_youtube ) {
            $youtubeid = explode('v=', $url);
            $youtubeid = $youtubeid[1];
            $youtubeid = explode('?', $youtubeid);
            $youtubeid = $youtubeid[0];
            $youtubeid = explode('&', $youtubeid);
            $youtubeid = $youtubeid[0];

            return $youtubeid;
        }
        
        preg_match('/\d+/', $url, $id_array);
        //Log::info("ID: ". print_r($id_array,true));
        if (empty($id_array)) {
            return false;
        }
        return  $id_array[0];
    }
}
