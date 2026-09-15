# Statamic (Laravel) – Docker Setup (no DB)


## 1) Prerequisites
- Docker Desktop or Docker Engine + Compose v2
- Git


> Place these files at the root of your Statamic/Laravel project (where `artisan` lives).

> **Service names** in the current Pinaco compose are `statamic` (PHP-FPM), `node`, and `caddy`.
> Older notes below sometimes use `app` for the PHP service — that's the same role, just an earlier name. Use `statamic` with the current stack (e.g. `docker compose exec statamic composer install`).




---

## 2) Project structure
```
.
├─ php/
│   ├─ Dockerfile
│   └─ conf.d/
│      ├─ custom.ini
│      └─ opcache.ini
├─ Caddyfile
├─ docker-compose.yml
├─ .env
└─ statamic (your Statamic app files: artisan, composer.json, public/, etc.)
```

---

## 3) Project configuration

  1. Docker Compose Configuration
      - [docker-compose.yml](docker-compose.example.yml)
  2. Caddyfile
     - [Caddyfile](Caddyfile.example)
  3. Environment variables
     - [.env](env.example)
  4. PHP Configuration
      - [Dockerfile](docker/php/Dockerfile)
      - PHP ini tweaks
        - [custom.ini](docker/php/conf.d/custom.ini)
        - [opcache.ini](docker/php/conf.d/opcache.ini)
  5. NODE Configuration
      - [Dockerfile](docker/node/Dockerfile)
  6. Statamic
     1. Environment variables
         - [.env](statamic/env.example)

> These are the **local/dev** files. The remote server uses the same base plus a separate
> override — see **§8 Deploying to the remote server**.

### Create SSL keys

```bash
mkdir -p ./certs
mkcert -cert-file ./certs/local.pem -key-file ./certs/local-key.pem \
  tm-studio.localhost pma.tm-studio.localhost
```

### There are model examples of all those files in /default folder. You can copy them if neede

```bash
cp ~/Dockers/default/env.statamic.example ./
cp ~/Dockers/default/docker-compose.statamic.example.yml ./
cp ~/Dockers/default/docker-compose.statamic.override.yml ./
cp ~/Dockers/default/docker-compose.statamic.remote.yml ./
cp ~/Dockers/default/Caddyfile.statamic.example ./
cp -R ~/Dockers/default/statamic ./statamic
cp -R ~/Dockers/default/docker_statamic ./docker

cp env.statamic.example .env
cp docker-compose.statamic.example.yml docker-compose.yml
cp docker-compose.statamic.override.yml docker-compose.override.yml
cp Caddyfile.statamic.example Caddyfile
cp statamic/env.example statamic/.env


## Edit the files (replace 'default' by 'tm-studio' and port 8454 by 8463 and Node Port 5173 -> 5175
vi .env
```


In theory there is nothing to change in these files

```bash
./docker/php/Dockerfile
./docker/php/conf.d/custom.ini
./docker/php/conf.d/opcache.ini
./docker/node/Dockerfile
docker-compose.yml 
Caddyfile
```

---

## 4) Optional measures

### a) Check the PHP environment is working

- Create a basic php file in statamic/public/index.php

```bash
mkdir -p ./statamic/public
vi statamic/public/index.php
<?php 
echo "Hello, World!";
```bash

### Load the app with Curl with -k (because your local cert may not be trusted by curl).
curl -k https://tm-studio.localhost:8463
Hello, World!%  

## Opne local browser
https://tm-studio.localhost:8463/

## If it fails, check Caddy logs:
docker compose logs caddy
## and PHP logs:
docker compose logs statamic


### b) Set user, match container UID/GID to your host

On your host, get your IDs:

```bash
id -u  #---> 501
id -g  #---> 20 we cannot use 20 becasue it has conflicts with Alpine (inside Alpine, GID 20 already exists)
```

Put them in your Compose .env (the file next to docker-compose.yml, not Laravel’s .env):

```bash
UID=<your uid>
GID=1000
```

Rebuild and up (if the appp has been already built):

```bash
docker compose down
docker compose build --no-cache app
docker compose up -d
```

Now the app user inside the container matches your host user and can write to the project.

```bash
id -u
```

---

## 5) Install Statamic in Docker

[STATAMIC.md](https://github.com/TsevdosMcNeil/pinaco/blob/main/docs/STATAMIC.md)

---

## 6) Troubleshooting & Common errors

- **Permission errors**: ensure UID/GID mapping matches your host.
- **Vite not connecting**: ensure the node service runs with `--host`.
- **TLS errors**: trust Caddy’s local CA or use plain HTTP only.

> **First rule when a port won't connect:** a "Couldn't connect / connection refused"
> almost always means the **process behind the port died or was never created**, not a
> network problem. Check `docker compose ps -a` and `docker compose logs <service>` before
> touching firewall/port config. Plain `docker compose ps` (without `-a`) hides stopped and
> never-created containers, so a missing service there doesn't mean "broken" — just "not up".

### Caddy crashes on start → port never opens (undefined named matcher)

**Symptom**

```bash
curl -k https://pinaco.localhost:8462
# curl: (7) Failed to connect to pinaco.localhost port 8462 after 0 ms: Couldn't connect to server
```

Caddy and its published port look configured, but nothing is listening.

**Diagnose**

```bash
docker compose ps            # caddy shows "Exited", not "Up"
docker compose logs caddy    # -> Error: ... unrecognized matcher name: @vite
```

**Cause** — the Caddyfile references a named matcher (`@vite`) that is **never defined**.
Caddy fails config adaptation and the container exits immediately, so the `8462:8462`
mapping never becomes active.

**Fix** — a named matcher must be **defined before it's used**:

```caddyfile
@vite path /build/* /@vite/* /@id/* /resources/* /node_modules/*
reverse_proxy @vite {$NODE_CONTAINER:node_default}:{$NODE_PORT:5175}
```

Then recreate just Caddy:

```bash
docker compose up -d --force-recreate caddy
```

> Requests matching `@vite` only succeed once the Vite dev server is actually running
> inside the node container (`npm run dev`, bound to `0.0.0.0`). Until then they 502, but
> `index.php` served via `php_fastcgi` works fine.

### `composer install` → "No composer.lock file present" and unresolvable conflicts

**Symptom**

```
No composer.lock file present. Updating dependencies to latest instead of installing from lock file.
...
- statamic/cms[v5.74.x] require laravel/framework ^12.40.0 ... conflicts with your root require (^11.24)
- spatie/browsershot[4.3.x/4.4.x] ... not loaded, because affected by security advisories
```

**Cause** — with **no `composer.lock`**, Composer runs an *update* and resolves everything
to the newest versions. `statamic/cms ^5.25` floats up to the latest (which now requires
Laravel 12) and collides with the pinned Laravel 11. The advisory block is a separate but
related consequence of re-resolving.

**Fix (migration path — preferred)** — bring the project's `composer.lock` over and install
from it. Installing from a lock skips resolution and pins the exact tested versions, so the
conflicts vanish:

```bash
# copy composer.lock next to composer.json, then:
docker compose exec statamic composer install
```

**Notes**
- **Always commit `composer.lock`.** It is the source of truth; its absence is what forces
  the broken fresh-resolve.
- `spatie/browsershot` **4.x is entirely affected** by advisories — the patched line is
  `^5.0.5`. Treat that as a *deliberate* upgrade (coordinate with `statamic-peak-seo`, which
  pins its own browsershot range), not part of the first install.
- The `Class Statamic\Console\Composer\Scripts is not autoloadable` line during a failed
  install is harmless — that script lives in `vendor/`, which doesn't exist yet. It clears
  once install completes.

### A service isn't running (e.g. `node`)

Two distinct causes seen on Pinaco:

**a) Missing build context.** The `node` service builds from `build.context: ./docker/node`.
If that folder / `Dockerfile` is missing (e.g. deleted by mistake), the image can't build and
the container is **never created**.

**b) Scoped `up` skips it.** `docker compose up -d <service>` starts only that service **and
its `depends_on` chain** — nothing else. `caddy` depends on `statamic`, so
`docker compose up -d --force-recreate caddy` brings up caddy + statamic but **not** node
(nothing depends on node). Services with no `restart:` policy also stay down after a Docker
Desktop restart.

**Diagnose / fix**

```bash
docker compose ps -a               # see Exited / never-created services
docker compose logs node           # read the real error (e.g. missing build context)
docker compose up -d --build node  # build + create + start just node, surfacing build errors
# or reconcile everything:
docker compose up -d --build
```

### `image:` + `build:` in the same service → tag shadowing

**Symptom** — your custom Node Dockerfile changes don't take effect; a plain `up -d` runs the
wrong image.

**Cause** — with **both** keys set, Compose builds your Dockerfile but tags the result with
the `image:` name (e.g. `node:25-alpine`), colliding with the official Hub tag. A prior
`docker compose pull` can fetch the official image over the top, and `up -d` (without
`--build`) reuses whatever already exists locally.

**Fix** — use **one**. Drop `image:` and let Compose auto-name the built image the way the
`statamic` service already does (→ `pinaco-node`), or give it a project-specific tag:

```yaml
node:
  build:
    context: ./docker/node
  # no image: line — Compose tags it pinaco-node
```

```bash
docker compose up -d --build node
```

### Error when opening https://constructure.localhost:8446 in a browser: 

```bash
Unable to connect Firefox can’t establish a connection to the server at constructure.localhost:8446.
```

This looks like Caddy isn’t actually listening on :8446 (or the container isn’t up). Let’s zero in and fix it fast.

1) Confirm Caddy is running and listening on 8446

```bash
docker compose logs --no-color caddy

statamic_caddy  | Error: loading initial config: loading new config: loading tls app module: provision tls: loading certificates: open /etc/caddy/certs/constructure.localhost.pem: no such file or directory

```

This means the folder `/etc/caddy/certs` is not defined in `docker-compose.yml`

```yaml
  caddy:
    image: caddy:2-alpine
    container_name: statamic_caddy
    ports:
      - "8080:80"      # optional HTTP
      - "8446:8446"    # HTTPS matches your Caddyfile (:8446)
    volumes:
      - ./statamic:/var/www/html:ro
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
      - ./certs:/etc/caddy/certs:ro
    depends_on:
      - app

```

Update `docker-compose.yml` and reload the app
```bash
cd ~/Dockers/constructure
docker compose up -d --force-recreate
```

Quick tests
```bash
# Caddy is serving on the right port
➜  docker ps --format "table {{.Names}}\t{{.Ports}}" | grep statamic_caddy
statamic_caddy               0.0.0.0:8446->8446/tcp, [::]:8446->8446/tcp, 0.0.0.0:8080->80/tcp, [::]:8080->80/tcp
➜  
```
```bash
# Caddy can read the certs
➜  docker compose exec caddy ls -l /etc/caddy/certs
total 8
-rw-------    1 root     root          1708 Oct 13 17:16 constructure.localhost-key.pem
-rw-r--r--    1 root     root          1554 Oct 13 17:16 constructure.localhost.pem
```
```bash
# TLS handshake + SNI to the right host
➜  openssl s_client -connect 127.0.0.1:8446 -servername constructure.localhost -brief </dev/null | head -n 10

depth=0 O = mkcert development certificate, OU = pablo@iMac.local (Pablo Rica)
verify error:num=20:unable to get local issuer certificate
depth=0 O = mkcert development certificate, OU = pablo@iMac.local (Pablo Rica)
verify error:num=21:unable to verify the first certificate
CONNECTION ESTABLISHED
Protocol version: TLSv1.3
Ciphersuite: TLS_AES_128_GCM_SHA256
Peer certificate: O = mkcert development certificate, OU = pablo@iMac.local (Pablo Rica)
Hash used: SHA256
Signature type: RSA-PSS
Verification error: unable to verify the first certificate
Server Temp Key: X25519, 253 bits
DONE
```
```bash
# App responds
curl -vk https://constructure.localhost:8446/ -H 'Host: constructure.localhost'
curl -vk --resolve constructure.localhost:8446:127.0.0.1 https://constructure.localhost:8446/

```

### Caddy errors

If there are changes on the Caddyfile we need to reload them using

```bash
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile             
```
But sometimes can be errors
```bash
2025/10/13 21:01:21.129 INFO    using config from file  {"file": "/etc/caddy/Caddyfile"}
2025/10/13 21:01:21.148 INFO    adapted config to JSON  {"adapter": "caddyfile"}
2025/10/13 21:01:21.148 WARN    Caddyfile input is not formatted; run 'caddy fmt --overwrite' to fix inconsistencies    {"adapter": "caddyfile", "file": "/etc/caddy/Caddyfile", "line": 2}
```
To fix that format the file:
```bash
# On your host, from the folder with Caddyfile
docker run --rm -v "$PWD/Caddyfile":/Caddyfile caddy:2-alpine \
  caddy fmt --overwrite /Caddyfile
# then reload (inside container):
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
```

---

## 7) Common tasks

 - Quick Start

```bash
cd ~/Dockers/constructure
docker compose up -d
```

- Quick reload after big changes
```bash
cd ~/Dockers/constructure
docker compose up -d --force-recreate
```

Delete hot file
```bash
docker compose exec app rm -f public/hot
```

Add watcher without websockets
```bash
docker compose run --rm -w /var/www/html node sh -lc "npm ci && npm run build -- --watch"
```


Composer
```bash
# Install
docker compose exec app composer install
```


Node
```bash
# Start/stop node
docker compose start node

# Get version
docker compose exec node node -v    # v22.12.0
docker compose exec node npm -v     # v10.9.0 (bundled with that Node)

#Install
docker compose exec node npm ci

# Address installation issues
docker compose exec node npm audit fix

# Compile
docker compose exec node npm run build
docker compose exec node npm run dev -- --host --strictPort --port 5173

# Restart node after changes in docker-compose.yml or Dockerfile or package.json
docker compose down
docker compose pull node
docker compose up -d node
```

Php please
```bash
docker compose exec app php please make:user
```


Cache
```bash
docker compose exec app php please stache:clear
docker compose exec app php please static:clear
docker compose exec app php please cache:clear
docker compose exec app php artisan cache:clear

docker compose exec app php artisan config:clear
docker compose exec app php artisan optimize:clear
docker compose exec app php please stache:refresh
docker compose exec app php artisan config:cache
```

Vite

```bash
# Inside node: verify Vite is listening on 0.0.0.0:5173
docker compose exec node sh -lc 'ss -lntp | grep 5173 || netstat -lnt | grep 5173 || true'
```


Caddy
```bash
# Logs
docker compose logs -f --no-color caddy

# Inside caddy: fetch Vite client with correct Host header (should be 200, not 403)
docker compose exec caddy sh -lc 'curl -I http://statamic_node:5173/@vite/client -H "Host: constructure.localhost"'

#Apply changes
docker run --rm -v "$PWD/Caddyfile":/Caddyfile caddy:2-alpine \
  caddy fmt --overwrite /Caddyfile
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile

```


### Statamic Commands**

```bash
docker compose exec app composer require vendor/package
docker compose exec app php artisan cache:clear
docker compose exec app php artisan tinker
docker compose exec app php artisan test
```

**Flush cache**

```bash
docker compose exec app php please cache:clear
docker compose exec app php please stache:clear
docker compose exec app php please static:clear
docker compose exec app php artisan cache:clear
```

**Create new App Tag**

```bash
docker compose exec app php please make:tag Foo
```


### Difference between **`docker compose exec`** and **`docker compose run`** — they *sound* similar but behave very differently.


### **`docker compose exec`**

**Use it to run a command *inside an already-running* container.**

#### Key points:

* The target service **must already be running**.
* Executes the command **inside the existing container instance**.
* Shares the same filesystem, network, environment, and state.
* Great for debugging or interacting with long-running services.

#### Examples:

```bash
docker compose exec web sh
```

→ Open a shell **inside the running `web` container**.

```bash
docker compose exec db psql -U postgres
```

→ Run `psql` inside the running database container.


### **`docker compose run`**

**Use it to start a *new, one-off container* for a service.**

#### Key points:

* The service does **NOT** need to already be running.
* Creates a **new container** based on the service’s image and config.
* Does **NOT** run the service’s long-running command (unless you specify `--entrypoint`).
* Does **not** automatically remove the new container unless `--rm` is used.
* Useful for tasks like database migrations, CLI jobs, utilities, etc.

#### Examples:

```bash
docker compose run --rm web sh
```

→ Start a **new container** for `web` with a shell, then remove it afterward.

```bash
docker compose run worker python script.py
```

→ Run a batch/worker job in an isolated container.



### **Quick comparison**

| Feature                                     | `docker compose exec` | `docker compose run` |
| ------------------------------------------- | --------------------- | -------------------- |
| Works only if service is running?           | ✅ Yes                 | ❌ No                 |
| Creates a new container?                    | ❌ No                  | ✅ Yes                |
| Runs inside existing environment and state? | ✅ Yes                 | ❌ New environment    |
| Good for debugging running services?        | ✅ Yes                 | ❌ Not ideal          |
| Good for one-off commands?                  | ⚠️ Maybe              | ✅ Yes                |



### When to use which?

#### Use **`exec`** when:

* You need to inspect a live container.
* You want to run commands that rely on the current running service state.
* You want to open a shell inside a running service.

#### Use **`run`** when:

* You need a temporary container for a job.
* You want to run a service’s image without starting the whole stack.
* You need to override the command/entrypoint for a one-time task.



---

## 8) Deploying to the remote server (host Nginx + Certbot)

The local stack terminates TLS **inside** Caddy on a custom HTTPS port using mkcert certs.
The remote stack is different:

| Concern      | Local (dev)                                   | Remote (server)                                        |
| ------------ | --------------------------------------------- | ------------------------------------------------------ |
| TLS          | Caddy container, mkcert, custom port          | **Host Nginx + Certbot**, port 443                     |
| PHP-FPM      | Caddy → `statamic:9000` over Docker network   | Host Nginx → **`127.0.0.1:<port>` → container `9000`** |
| Caddy        | on (via `local-only` profile)                 | **off** (profile not activated)                        |
| Node         | build helper (`npm run build`/`dev`)          | **off** (`local-only` profile) — assets pre-built      |
| Vite         | dev server proxied by Caddy                   | **not served** — assets committed to git               |

> Reminder: despite its name, `STATAMIC_SSL_PORT` is the **published FPM port** on the
> remote box (TLS is on 443 via Nginx). Keeping the name is fine as long as you remember
> what it maps to.

### 8.1 Compose file layout — mind the merge rules

Two Compose behaviours will bite you if you're not careful (both verified with
`docker compose config`):

1. **`ports` merges by appending, never replacing.** An override can *add* ports but cannot
   *remove* base ones. `ports: []` in an override does **nothing** — the base port stays
   published (and if the base port has no `127.0.0.1` prefix, it binds `0.0.0.0` and punches
   through ufw). **The base file must not declare any port you might want gone in some
   environment.**
2. **`docker-compose.override.yml` auto-loads** on any `docker compose up` with no `-f`
   flags. Don't put *remote-only* settings there or they silently apply to local runs. Name
   the remote file explicitly (`docker-compose.remote.yml`).

**Recommended layout**

```yaml
# docker-compose.yml (base) — NO published ports; node + caddy gated behind a profile
services:
  node:
    profiles: ["local-only"]        # build-only helper; NOT needed in production (see §8.4)
    build:
      context: ./docker/node        # no image: line, no ports:
    ...
  statamic:
    build:
      context: ./docker/php         # no profile → always runs (local AND remote)
    ...
  caddy:
    profiles: ["local-only"]        # only starts when the profile is active
    ...
```

```yaml
# docker-compose.override.yml — LOCAL dev extras (auto-loaded)
services:
  node:
    ports:
      - "127.0.0.1:${NODE_PORT}:${NODE_PORT}"   # loopback only; often not even needed
                                                # (Caddy reaches node over the Docker network)
```

```yaml
# docker-compose.remote.yml — REMOTE only (loaded via COMPOSE_FILE, see below)
services:
  statamic:
    ports:
      - "127.0.0.1:${STATAMIC_SSL_PORT}:9000"   # FPM published on loopback for host Nginx
# node needs no entry here — the local-only profile already keeps it off the server
```

**Load the right files per environment — from `.env`, not flags**

Passing `-f … -f …` (or `--profile …`) on *every* command is tedious and, worse, dangerous: the
moment you run a bare `docker compose up -d` without them, Compose reconciles to **base-only**
config and quietly recreates `statamic` **without** its FPM port, breaking Nginx→FPM. Let each
machine's Compose `.env` (next to `docker-compose.yml`) pick the setup instead, so a flagless
`docker compose …` always does the right thing. Same two lines on both machines, opposite comments:

```dotenv
COMPOSE_PROFILES=local-only # ONLY local, comment in remote
#COMPOSE_FILE=docker-compose.yml:docker-compose.remote.yml # ONLY remote, comment in LOCAL
```

- **Local** `.env` (as above): `COMPOSE_PROFILES=local-only` active → `up -d` brings up
  statamic + node + caddy. `COMPOSE_FILE` commented, so file discovery is the default: base +
  auto-loaded `docker-compose.override.yml`.
- **Remote** `.env` (swap the comments): `COMPOSE_FILE` active → base + `docker-compose.remote.yml`
  (this *replaces* discovery, so `override.yml` is NOT auto-loaded). `COMPOSE_PROFILES` commented →
  no profile active → `up -d` brings up **just statamic** (node + caddy stay off).

Then every command is flagless and correct on both machines:

```bash
docker compose up -d --build                     # right services per machine, with the FPM port
docker compose exec statamic php please cache:clear
docker compose config | less                     # verify effective ports before a first deploy
```

> `COMPOSE_FILE` uses `:` as the path separator on Linux/macOS. Don't have both variables active on
> the same machine — the commented/uncommented split is the whole mechanism.

### 8.2 Host Nginx config

The critical rule for dockerised PHP-FPM: Nginx serves static files from the **host** path
(`root`), but PHP-FPM resolves `SCRIPT_FILENAME` on **its own** filesystem — so that must be
the **container** path (`/var/www/html/public`). Point it at the host path and you get
FPM's classic *"Primary script unknown / File not found"*.

```nginx
# /etc/nginx/sites-available/pinaco   (plain :80 — `certbot --nginx` adds the 443 block + redirect)
server {
    listen 80;
    listen [::]:80;
    server_name beta.pinaco.tm-studio.co.uk;

    root /data/webs/pinaco/statamic/public;   # HOST path (bind-mount source) → static files
    index index.php index.html;
    client_max_body_size 50M;
    error_log /var/log/nginx/pinaco.error.log;

    location = /favicon.ico { log_not_found off; access_log off; }
    location = /robots.txt  { allow all; log_not_found off; access_log off; }
    location ~ /\.(?!well-known).* { deny all; }   # block dotfiles, keep ACME renewals working

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        try_files $uri =404;                                        # don't hand ghost scripts to FPM
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/html/public$fastcgi_script_name;  # CONTAINER path
        fastcgi_param DOCUMENT_ROOT   /var/www/html/public;                       # CONTAINER path
        fastcgi_pass 127.0.0.1:8462;                                # == 127.0.0.1:${STATAMIC_SSL_PORT}
        fastcgi_read_timeout 300;
        fastcgi_intercept_errors on;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf)$ {
        expires 7d;
        access_log off;
        try_files $uri =404;
    }
}
```

- `fastcgi_pass` **must match** the port the remote override publishes
  (`127.0.0.1:${STATAMIC_SSL_PORT}:9000`).
- Because `root` is the `public/` dir, `vendor/`, `.env`, and content live above the web
  root and aren't directly reachable — no big pile of deny rules needed.
- The dotfile deny **exempts `.well-known`** so Certbot's ACME challenge (and renewals)
  keep working.

Then enable TLS:

```bash
sudo ln -s /etc/nginx/sites-available/pinaco /etc/nginx/sites-enabled/pinaco
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d beta.pinaco.tm-studio.co.uk
```

### 8.3 Remote `.env` caveats

- `APP_ENV=production`, `APP_DEBUG=false`.
- **`STATAMIC_URL` must be the clean domain WITHOUT the port** — the local pattern
  `https://${STATAMIC_HOST}:${STATAMIC_SSL_PORT}` bakes `:8462` into the URL, which would
  break every generated asset / CP / redirect URL:
  ```bash
  STATAMIC_URL="https://beta.pinaco.tm-studio.co.uk"   # no port; TLS is on 443 via Nginx
  ```
- `OPCACHE_VALIDATE_TIMESTAMPS=0` for performance — **but** the source is bind-mounted, so
  opcache won't notice changed files. Restart the PHP container (or reload FPM) on each
  deploy to bust it:
  ```bash
  docker compose restart statamic   # flagless — COMPOSE_FILE is set in the remote .env (§8.1)
  ```

### 8.4 Node is build-only — build locally, ship `public/build/`

Node has **no runtime role** in production. Its only jobs are `npm run build` (produces
`public/build/`) and `npm run dev` (the HMR server, inherently local). Serving is 100% Nginx
reading the compiled static files — so the server never needs node. That's why it sits under the
`local-only` profile alongside Caddy (§8.1): the remote `up -d` simply never starts it.

You **can't delete a service via the override merge** (services merge, they don't get removed), so
the profile *gate* is the correct mechanism — not an entry in `docker-compose.remote.yml`.

Workflow: **build on your Mac, commit the output, deploy.**

```bash
# LOCAL — compile, then commit the result
docker compose exec node npm run build      # writes statamic/public/build/*
git add statamic/public/build && git commit -m "build assets"

# REMOTE — pull; only PHP deps run on the server
git pull
docker compose exec statamic composer install --no-dev --optimize-autoloader
```

Three things make this safe:

- **`public/build/` and `public/build/manifest.json` must be present** on the server (they're
  tracked in git, so a `git pull` delivers them).
- **No `public/hot` on the server.** That file is dropped by `npm run dev`; if a stale one ships,
  Statamic's `@vite` directive routes to the (absent) dev server and every asset 404s. Keep `hot`
  **gitignored**, and if one ever appears: `docker compose exec statamic rm -f public/hot`.
- Vite output is content-hashed plain JS/CSS, so a Mac-built bundle is byte-identical to a
  Linux-built one — no cross-platform gotcha (unlike native binaries).

> Emergency rebuild *on* the box? The profile is an escape hatch, not a wall:
> `docker compose --profile local-only up -d node`, rebuild, then drop it again.

> **Endgame (defer to CI):** a multi-stage image — a node build stage compiles assets and copies
> `public/build/` into the PHP image — removes node from remote, stops committing built assets, and
> drops source-mounting all at once. That's the GHCR/CI target; local-build-and-commit bridges you
> there without the churn today.

---

## 9) Production notes
- Use `APP_ENV=production`, `APP_DEBUG=false`.
- Run `npm run build` and serve static assets via **host Nginx** with caching (Caddy is
  local-only).
- TLS is handled by **host Nginx + Certbot** on 443; the FPM container is published only on
  `127.0.0.1:${STATAMIC_SSL_PORT}`.
- Use external Redis if required.
- Add backups for `storage/`.
- Longer term: prefer an **immutable app image** (built assets baked in) over bind-mounting
  the live source tree — consistent with the `docker save | gzip | ssh | docker load`
  transfer flow used elsewhere, and a prerequisite for GHCR-based CI/CD.

---

## 10) Key gotchas — quick reference

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| `curl: (7) Couldn't connect` on the HTTPS port | Caddy crashed on an **undefined `@matcher`** → container exited → port never opened | Define the matcher *before* use; `ps`/`logs` confirm. Connection-refused ⇒ check the process, not the network |
| `No composer.lock present` + Laravel 11/12 conflict + browsershot advisory | No lock ⇒ Composer *updates* to latest, floating `statamic/cms` onto Laravel 12 | Bring `composer.lock` over → `composer install`. Always commit the lock |
| A service (e.g. `node`) missing from `ps` | Missing `build.context` dir, **or** a scoped `up <svc>` that skipped it | `ps -a` + `logs`; `up -d --build node` or `up -d` (whole file) |
| Custom Node image changes ignored | `image:` **and** `build:` both set → build tagged as the Hub name, shadowed | Use one; drop `image:` → auto-tag `pinaco-node`; rebuild with `--build` |
| Override's `ports: []` doesn't remove a port | Compose **appends** port lists, never replaces | Don't declare the port in the base at all; add per-environment |
| Remote settings leaking into local runs | `docker-compose.override.yml` **auto-loads** without `-f` | Name the remote file `docker-compose.remote.yml`, load it explicitly |
| Bare `up -d` recreates `statamic` without its FPM port | Ran without the `-f`/override → base-only config | Set `COMPOSE_FILE`/`COMPOSE_PROFILES` in each machine's `.env` so flagless commands are correct |
| All CSS/JS 404 in prod after deploy | Stale `public/hot` shipped → `@vite` points at the absent dev server | `rm -f public/hot`; gitignore it. Node is build-only — ship `public/build/`, keep node off (profile) |
| Nginx → FPM *"Primary script unknown"* | `SCRIPT_FILENAME` set to the **host** path; FPM resolves on the **container** FS | Set `SCRIPT_FILENAME`/`DOCUMENT_ROOT` to `/var/www/html/public`; keep `root` as the host path |
| Assets/CP/redirects point at `:8462` in prod | `STATAMIC_URL` built with `:${STATAMIC_SSL_PORT}` | Set `STATAMIC_URL` to the bare `https://` domain (no port) |
| Code changes not reflected in prod | `OPCACHE_VALIDATE_TIMESTAMPS=0` + bind-mounted source | Restart `statamic` (or reload FPM) on deploy |
| Docker ports bypass ufw | Docker writes its own iptables rules | Bind every published port to `127.0.0.1` |
