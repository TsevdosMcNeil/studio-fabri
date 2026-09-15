

# Instagram

[Statamic Instagram Plugin](https://statamic.com/addons/marcorieser/statamic-instagram)

This new plugin will replace the old one `nineteensquared/instagram`, which has been abandoned.

### Features

- Fetch Instagram posts via Meta's Instagram Business API  
- Auto-refreshing of Access Tokens  


### How to Install

First, remove the old package:

```bash
composer remove nineteensquared/instagram
```

Then, install the new one:

```bash
composer require marcorieser/statamic-instagram
...
Using version ^2.0 for marcorieser/statamic-instagram
```


### How to Use

#### Installation Steps

1. Install the addon  
2. Publish the addon config by running:  

   ```bash
   php artisan vendor:publish --tag=statamic-instagram-config
   ```

3. A new file `config/statamic-instagram.php` will be created  
4. Add your Access Token to the account section in the published config file  

```php
return [
    'limit' => 12,

    'include_child_posts' => false,

    'cache' => [
        'key_prefix' => 'instagram',
        'duration' => 60 * 60 * 24, // 1 day
    ],

    'accounts' => [
        [
            'handle' => 'default',
            'access_token' => 'YOUR TOKEN HERE',
        ],
    ]
];
```

If you do not have a token, follow the instructions below.


### Creating a Meta App / Access Token

Create an Access Token for the API with these steps:

1. Log in with your Instagram credentials at [Facebook Developers](https://developers.facebook.com)  
2. Create a new app (choose **Other** as the use case and **Business** as the app type)  
3. Add **Instagram** as a product to your app  
4. Link your Instagram account at **Generate access tokens** in the API setup with the Instagram login section of your app  
5. Generate a token and add it to the config in Statamic  

Further information is available in [Meta's documentation](https://developers.facebook.com/docs/).



### Display the Feed

You can use the `{{ instagram:feed }}` tag to fetch media from the API and return them as an array.

