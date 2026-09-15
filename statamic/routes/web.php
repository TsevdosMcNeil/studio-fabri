<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::statamic('example', 'example-view', [
//    'title' => 'Example'
// ]);

// The route to the RSS Projects feed.
Route::statamic('/feed/projects', 'feed/projects', [
    'layout' => null,
    'content_type' => 'application/xml',
]);
// The route to the RSS News feed.
Route::statamic('/feed/news', 'feed/news', [
    'layout' => null,
    'content_type' => 'application/xml',
]);

// The Search route to display search results with `views/search.antlers.html`.
Route::statamic('/search', 'search');
