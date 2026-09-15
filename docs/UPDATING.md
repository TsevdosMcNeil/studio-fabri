
# Updating Statamic

## Updating Manually in Local

**IMPORTANT: PHP version > 8.2**

- Remove "require" data from `composer.json`
	- It's very important that "fruitcake/laravel-cors" is deleted from `composer.json`
	- [Read more](https://github.com/fruitcake/laravel-cors)
- Replace `\Fruitcake\Cors\HandleCors::class` with `\Illuminate\Http\Middleware\HandleCors::class` in `app/Http/Kernel.php`
- Remove "require.dev" data from `composer.json`
- Delete `vendor` folder
	-  `rm -R vendor`
- Delete `composer.lock` file
	-  `rm composer.lock`


### Run these commands

```bash
composer require "statamic/cms" --with-all-dependencies --ignore-platform-reqs
composer require "eminos/statamic-tabs" --with-all-dependencies --ignore-platform-reqs
composer require "guzzlehttp/guzzle" --with-all-dependencies --ignore-platform-reqs
composer require "jonassiewertsen/statamic-livewire" --with-all-dependencies --ignore-platform-reqs
composer require "laravel/framework" --with-all-dependencies --ignore-platform-reqs
composer require "laravel/sanctum" --with-all-dependencies --ignore-platform-reqs
composer require "laravel/tinker" --with-all-dependencies --ignore-platform-reqs
composer require "nesbot/carbon" --with-all-dependencies --ignore-platform-reqs
composer require "simonridley/tracking-code-manager" --with-all-dependencies --ignore-platform-reqs
composer require "spatie/browsershot" --with-all-dependencies --ignore-platform-reqs
composer require "studio1902/statamic-peak-browser-appearance" --with-all-dependencies --ignore-platform-reqs
composer require "studio1902/statamic-peak-commands" --with-all-dependencies --ignore-platform-reqs
composer require "studio1902/statamic-peak-seo" --with-all-dependencies --ignore-platform-reqs
composer require "studio1902/statamic-peak-tools" --with-all-dependencies --ignore-platform-reqs
composer require "xndbogdan/statamic-bard-text-color" --with-all-dependencies --ignore-platform-reqs
composer require "barryvdh/laravel-debugbar" --dev --with-all-dependencies --ignore-platform-reqs
composer require "fakerphp/faker" --dev --with-all-dependencies --ignore-platform-reqs
composer require "laravel/sail" --dev --with-all-dependencies --ignore-platform-reqs
composer require "mockery/mockery" --dev --with-all-dependencies --ignore-platform-reqs
composer require "nunomaduro/collision" --dev --with-all-dependencies --ignore-platform-reqs
composer require "phpunit/phpunit" --dev --with-all-dependencies --ignore-platform-reqs
composer require "spatie/laravel-ignition" --dev --with-all-dependencies --ignore-platform-reqs
  
php please cache:clear
npm run build
```

## Laravel Changes

**Breaking change in Laravel 6.0**

[5.6 - Uses the following](https://laravel.com/docs/5.6/helpers#method-array-get)

    array = ['products' => ['desk' => ['price' => 100]]];
    $price = array_get($array, 'products.desk.price');

[6.0 - Uses the following](https://laravel.com/docs/6.0/helpers#method-array-get)

    use Illuminate\Support\Arr;
	
	$array = ['products' => ['desk' => ['price' => 100]]];
    $price = Arr::get($array, 'products.desk.price');

So the custom modifire `app/Modifiers/GetVideoId.php` has been updated from

```php
$type = array_get($params, 0) ?? 'embed';
```

to

```php
use Illuminate\Support\Arr;
...
$type = Arr::get($params, 0) ?? 'embed';
```

## Updating Livewire

Upgrading Statamic to the latest versions causes Livewire to upgrade as well. This causes many errors because custom code becomes obsolete and needs to be changed.

 - [Oficial Documentation](https://livewire.laravel.com/docs/installation#manually-bundling-livewire-and-alpine)
 - [Statamic Livewire](https://statamic.com/addons/jonassiewertsen/livewire)
 - [Laravel Livewire loading after Alpine.js after Update](https://stackoverflow.com/questions/77920248/laravel-livewire-loading-after-alpine-js-after-update)

### Manually bundling Livewire and Alpine

From now, Alpine and Livewire are loaded by  "livewire.js", which means you have no control over the order in which these libraries are loaded. Consequently, importing and registering Alpine plugins, as shown in the example below, will no longer function:

```javascript
// Warning: This snippet demonstrates what NOT to do...
 
import Alpine from 'alpinejs'
import Clipboard from '@ryangjchandler/alpine-clipboard'
 
Alpine.plugin(Clipboard)
Alpine.start()
```

### Updating Livewire Layout files

To address this issue, we need to inform Livewire that we want to use the ESM (ECMAScript module) version ourselves and prevent the injection of the livewire.js script tag. To achieve this, we must add the `{{ livewire:scriptConfig }}` directive to our layout files, that is instead of
    
```html
{{ livewire:styles }}
<main class="outer-grid">
    <!-- content -->
</main>
{{ livewire:scripts }}
```

We will write 

```html
{{ livewire:styles }}
<main class="outer-grid livewirepage">
    <!-- content -->
</main>
{{ livewire:scriptConfig }}
```
*(do not forget to add the class `livewirepage` to the main tag)*

#### Update the app.js file

Then we need to import Alpine and Livewire in our app.js file, allowing us to register any custom resources, and ultimately starting Livewire and Alpine:
That means, instead of
    
```javascript
import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import morph from '@alpinejs/morph'
import persist from '@alpinejs/persist'
import focus from '@alpinejs/focus'
import intersect from '@alpinejs/intersect'

// Call Alpine.
window.Alpine = Alpine
Alpine.plugin([collapse, focus, morph, persist, intersect])
Alpine.start()
```

We will write

```javascript
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
import collapse from '@alpinejs/collapse'
import morph from '@alpinejs/morph'
import focus from '@alpinejs/focus'
import intersect from '@alpinejs/intersect'

// Load Alpine.
Alpine.plugin([collapse, focus, morph, intersect])

// Call Livewire only in Livewire pages
if(document.querySelector('main').classList.contains('livewirepage')){
    Livewire.start()
}  
```

Note that the call `import persist from '@alpinejs/persist'` is not longer necessary, because it is already included in the Livewire package.

#### Update the package.json file

Remove the following lines from the package.json file, we don't need them anymore becasue these libraries are already included in the Livewire package.

```json
"@alpinejs/persist": "^3.12.3",
"alpinejs": "^3.12.3",
```

Use these commands to do that:

```bash
npm uninstall alpinejs --save
npm uninstall @alpinejs/persist --save
```

And compile files again:

```bash
npm install
```

### Updating the Livewire configuration

[Troubleshooting Laravel Livewire: Resolving the 'Unable to Find Component' Error](https://filamentapps.dev/blog/troubleshooting-laravel-livewire-resolving-the-unable-to-find-component-error)

After uploading the Laravel application to use Laravel Livewire version 3, you may have encountered the **Unable to Find Component** error. This error can be frustrating, but it's important to note that the latest version of Livewire introduced a change in how it discovers components. Specifically, the Livewire autodiscovery for components has been relocated from the `app\Http\Livewire` directory to the `app\Livewire` directory. This means that if you create a Livewire component inside the `app\Http\Livewire` directory, you'll encounter this error.

This can be fixed with these steps:

- Run this command to create a new livewire.php file in your Laravel application's config directory.

`php artisan livewire:publish --config`

- Open the newly created `config/livewire.php` file in a code editor.
- Look for the `'class_namespace'` option in the configuration file.
- Modify the `'class_namespace'` value to `'App\\Http\\Livewire'`. Your configuration should look like this:

`'class_namespace' => 'App\\Http\\Livewire', `

- Save changes. The new configuration file is ready.


## Updating Staging

Once the updates are done in local,upload the changes to the repository, go tho the staging server, download the repository latest version  and run the following commands:

```bash
rm -R vendor
rm composer.lock

composer install

rm -R node_modules

npm install

php please cache:clear
chown -R www-data:www-data /data/webs/pinaco.codigo.co.uk
chmod -R 755 /data/webs/pinaco.codigo.co.uk

npm run build
```


### Composer errors when uploading

[Could not fetch 'repository', please review your configured GitHub OAuth token when running "composer update"](https://stackoverflow.com/questions/70456133/could-not-fetch-repository-please-review-your-configured-github-oauth-token-w)

    composer config --global --auth github-oauth.github.com [GENERATED TOKEN]

[Error "Root composer.json requires php ^7.3 but your php version (8.0.0) does not satisfy that requirement"](https://stackoverflow.com/questions/65454412/error-root-composer-json-requires-php-7-3-but-your-php-version-8-0-0-does-no)

    composer require "statamic/cms 5.0.0" --ignore-platform-reqs

