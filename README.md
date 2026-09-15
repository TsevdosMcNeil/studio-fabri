# Studio Fabri

A Statamic website for **[studio-fabri](https://studio-fabri.co.uk/)** based in [Statamic Starter Kit](https://github.com/pablorica/statamic_starter_kit) 

It is containerized with **Docker** for consistent local development and easy deployment to any environment.


[![version](https://img.shields.io/badge/version-1.2.2-green.svg)](https://semver.org)



## Production 

[https://studio-fabri.co.uk/](https://studio-fabri.co.uk/) 


## Staging 

[https://beta.studio-fabri.co.uk/](https://beta.studio-fabri.co.uk/)

- login: studio-fabri
- pwd: tmstudio

### Staging `public` folder

[https://beta.studio-fabri.co.uk/public.tar.gz](https://beta.studio-fabri.co.uk/public.tar.gz)

```bash
wget --user studio-fabri --password tmstudio https://beta.studio-fabri.co.uk/public.tar.gz
```

### Staging `content` folder

[https://beta.studio-fabri.co.uk/content.tar.gz](https://beta.studio-fabri.co.uk/content.tar.gz)

```bash
wget --user studio-fabri --password tmstudio https://beta.studio-fabri.co.uk/content.tar.gz
```

### Staging `users` folder

[https://beta.studio-fabri.co.uk/users.tar.gz](https://beta.studio-fabri.co.uk/users.tar.gz)

```bash
wget --user studio-fabri --password tmstudio https://beta.studio-fabri.co.uk/users.tar.gz
```


## Local

[https://studio-fabri.localhost:8462](https://studio-fabri.localhost:8462) 



---

## Layout

### Breakpoints
  
* `--breakpoint-sm: 640px;`
* `--breakpoint-md: 768px;`
* `--breakpoint-lg: 1024px;`
* `--breakpoint-xl: 1280px;`
* `--breakpoint-2xl: 1536px;`

---

## Installation instructions

### Docker Installation

[DOCKER.md](https://github.com/TsevdosMcNeil/studio-fabri/blob/main/docs/DOCKER.md)

#### Reload Docker locally (if needed)

```bash
# Quick reload after big changes
cd ~/Dockers/studio-fabri
docker compose up -d --force-recreate
```

### Statamic Installation

[STATAMIC.md](https://github.com/TsevdosMcNeil/studio-fabri/blob/main/docs/STATAMIC.md)

`composer.lock`  & `package-lock.json` files must be present

1. run `docker compose exec node npm install`
2. (optional) run `docker compose exec app php please make:user`
3. run `docker compose exec node npm ci` && `docker compose exec node npm run build`


### Clear caches and reload Laravel

```bash
cd ~/Dockers/studio-fabri

docker compose exec statamic php artisan config:clear
docker compose exec statamic php artisan cache:clear
docker compose exec statamic php artisan view:clear
docker compose exec statamic php artisan route:clear
docker compose exec statamic php artisan optimize
```


---


## Uploading statamic to a repository

Use `composer create-project` **only once** to bootstrap a *new* app.
After that, treat your Statamic site like any other Laravel app: **commit the app**, and on new machines run `composer install`, not `create-project`.

You’ve got two solid ways to organize things:

---

## Option  Commit the app (minus vendor)

Your repo is the Statamic/Laravel app itself.

**Commit (at minimum):**

* `composer.json`, `composer.lock`, `artisan`, `bootstrap/`, `config/`, `routes/`
* Statamic content & config: `content/`, `resources/blueprints/`, `resources/fieldsets/`, `resources/forms/`, `resources/users/`, `resources/views/`, `users/` (if file users), `public/.htaccess`
* Your env example: `.env.example`
* Docker files

**Ignore:**

* `vendor/`, `node_modules/`, `storage/framework/cache/*`, `public/build/` (unless you want to deploy built assets)
* Anything machine-specific

**Deploy / new staging steps (no overwrite):**

```bash
# clone repo
cp .env.example .env   # set APP_URL, etc.

docker compose up -d

# install deps (NO create-project)
docker compose exec -u root -e COMPOSER_ALLOW_SUPERUSER=1 app composer install --no-dev -o

# first time only
docker compose exec app php artisan key:generate

# build assets (or copy your prebuilt /public/build)
docker compose exec node npm ci
docker compose exec node npm run build
```

This way, your collections, taxonomies, blueprints, etc. are just files in git and **cannot** be overwritten by any installer.


## Option B: Keep a thin repo + bootstrap script (don’t overwrite)

If you really don’t want to commit the whole Laravel skeleton, keep Docker + your **overlay** (content/blueprints/etc.), and add a script that runs `create-project` **only if the directory is empty** — then copies your files on top.

Example bootstrap script (commit it as `scripts/bootstrap-statamic.sh`):

```bash
#!/usr/bin/env sh
set -e

# inside the app container
cd /var/www/html

if [ ! -f artisan ]; then
  # Empty dir → do the bootstrap once
  COMPOSER_ALLOW_SUPERUSER=1 composer create-project statamic/statamic . --no-interaction
fi

# Apply your overlay safely (won't clobber existing files)
# Assumes you mounted your overlay at /overlay in the container
rsync -av --ignore-existing /overlay/ /var/www/html/

# Install deps / build
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev -o
php artisan key:generate || true
```

**Compose call:**

```bash
docker compose exec -u root app sh /var/www/html/scripts/bootstrap-statamic.sh
```

> Key bit: `--ignore-existing` ensures you don’t overwrite anything already present. You can also flip it around (copy first, then `composer install`) if you prefer.


### What not to do

* Don’t run `composer create-project` on an already-initialized app directory — it *will* try to lay down a fresh skeleton and can overwrite/complicate things.
* Don’t rely on `statamic:install` to build a project skeleton on every deploy; that’s for first-time setup/publishing assets, not for syncing your content model.


---

## Compilation errors

### Vite Error

If there is a Vite Error when running
```bash
➜  npm run build

> build
> vite build

failed to load config from /var/www/html/vite.config.js
error during build:
TypeError: Cannot read properties of undefined (reading 'startsWith')
```

**Solution**

It can be due a wrong value in .env
`APP_URL="http://wrongsite.co.uk"`

Or a wrong hot file in public, in that case delete it
```bash
docker compose exec app rm -f public/hot
```

---

## Additional commands

### Clear cache and static files

```bash
php please stache:clear
php please static:clear
php please cache:clear
php artisan cache:clear
```
Reference to [Statamic Cache](https://statamic.dev/static-caching#by-force)


---

## Copyright and License

Copyright 2025 studio-fabri website released under the [MIT](https://github.com/TsevdosMcNeil/studio-fabri/blob/main/LICENSE) license.

## Versioning

We use [SemVer](https://semver.org/) for versioning.

### Changelog

[CHANGELOG.md](https://github.com/TsevdosMcNeil/studio-fabri/blob/main/CHANGELOG.md)
