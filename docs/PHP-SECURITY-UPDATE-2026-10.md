# PHP security update — Statamic Docker

**Date:** 24 October 2026  
**Scope:** PHP-FPM image for the Statamic service  
**Reason:** Address the reported PHP security issues CVE-2026-109618 and CVE-2026-109619.  
**Status:** Prepared; deployment and verification pending.

## Existing configuration

- `docker-compose.yml` builds the `statamic` service from `./docker/php/Dockerfile`.
- The existing Dockerfile uses `FROM php:8.3-fpm`.
- The PHP image installs GD, Intl, mbstring, ZIP, EXIF, OPcache, BCMath and Imagick, and copies custom PHP INI files.
- The application is bind-mounted from `./statamic:/var/www/html`; the Composer cache uses a named volume.
- `docker-compose.override.yml` is for local Node development and does not need to change for this update.

## Proposed change

Change the base image in `docker/php/Dockerfile`:

```diff
-FROM php:8.3-fpm
+FROM php:8.3.36-fpm
```

This pins the build to PHP 8.3.36, avoiding an unrelated minor-version upgrade. Verify the release's applicability to the reported CVEs against the official PHP security advisories before deployment. Future PHP patches will require an explicit version update.

## Production deployment

1. Back up application content, configuration and any persistent data. Confirm rollback access to the previous image.
2. Commit and deploy the Dockerfile change to the remote server.
3. From the directory containing `docker-compose.yml`, build the updated image:

   ```bash
   docker compose build --pull statamic
   ```

4. If the build succeeds, recreate only the Statamic service:

   ```bash
   docker compose up -d --no-deps statamic
   ```

   **Note:** The PHP-FPM service will restart briefly. The bind-mounted application source is not replaced by the image rebuild.

## Verification

```bash
docker compose ps
docker compose exec statamic php -v
docker compose exec statamic php -m
docker compose exec statamic composer check-platform-reqs
docker compose exec statamic php please --version
docker compose logs --tail=100 statamic
```

Confirm PHP reports **8.3.36** and that `gd`, `intl`, `mbstring`, `zip`, `exif`, `bcmath`, `imagick` and `Zend OPcache` are available. Test the public website, Statamic Control Panel, image transformations, forms and any project-specific features. Record results in the changelog after testing.

## Risks and rollback

- The PECL Imagick installation may fail when rebuilding; do not replace the running container unless the build succeeds.
- A PHP image change may reveal dependency or extension compatibility problems.
- For rollback, restore the prior Dockerfile version (and its known-good image, if retained), rebuild or retag as appropriate, and recreate only the `statamic` service. Confirm that the old image is still available before deployment.
- No changes to `docker-compose.yml` or `docker-compose.override.yml` are required for this PHP-only update.

## Follow-up

Check for newer PHP 8.3 security releases and plan any PHP 8.4/8.5 migration separately after confirming Statamic and Composer compatibility.
