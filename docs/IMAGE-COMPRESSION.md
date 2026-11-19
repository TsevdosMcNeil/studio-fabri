# Studio Fabbri — One-off image compression

**Date:** 19 November 2026
**Site:** https://studiofabbri.co.uk (Statamic, Docker)
**Repo:** https://github.com/TsevdosMcNeil/studio-fabri

---

## 1. The request

Danny asked for a script to compress the images uploaded to the site, because some of them are very large.

### What was offered and agreed

| Option | Scope | Outcome |
|---|---|---|
| Statamic image optimisation (same as Archio) + Statamic 5 upgrade with static cache | Optimised versions created and cached automatically, including for future uploads | Declined: no budget, and Danny doesn't expect the problem to happen again |
| One-off compression script | Compress the existing large images once | **Agreed** |

### Agreed scope
- A one-off fix for the images **already on the server**.
- Images uploaded later **won't** be compressed automatically. If large images build up again, the script can be run again.
- Glide is **not** enabled on the site's front end, and that stays as it is. Images are served directly from `/images/...`.

---

## 2. The problem

`statamic/public/images` takes up **765 MB**. Many photos are sent straight from the camera or exported at print quality:

- About 20 files are over 10 MB, for example `marten-road-31.jpg` (31 MB), `keynsham---studio-fabbri5052-1775734554.jpg` (30 MB) and `studiofabbri_aveling_park_road_21.jpg` (27 MB).
- Many more are 1–9 MB.

Because the front end doesn't use Glide, visitors' browsers download these original files at full size. This slows page loads considerably, especially on mobile.

---

## 3. The solution

A bash script, `compress-images.sh`, kept in the project root next to `docker-compose.yml`.

### What it does
1. Starts a temporary `alpine:3.20` container with ImageMagick, with `statamic/public/images` mounted. Nothing is installed on the host or in the PHP image.
2. Looks for JPG/JPEG files over **1 MB**, including in sub-folders, and skips Statamic's `.meta` folders.
3. For each file:
   - Resizes it so the longest side is at most **2560 px**. Smaller images are never enlarged.
   - Fixes the orientation from the camera's EXIF data, then removes the metadata.
   - Re-saves it as a progressive JPEG at **quality 82**.
   - Only replaces the file if the new version is smaller.
   - Overwrites the file in place, so the **filename, URL, owner (`www-data`) and permissions don't change**.
   - Copies the original to a backup folder outside the web root first.
4. Refreshes Statamic inside the `statamic` service:
   - `php please assets:meta`: updates the stored width, height and file size (needed so the CP shows the correct values).
   - `php please glide:clear`: only clears the CP's cached thumbnails. It doesn't affect the front end and doesn't change any filenames.
   - `php please static:clear`: harmless if static caching isn't enabled.

### What it doesn't change
- Filenames and URLs (no `img/asset/...` Glide URLs).
- Templates, content, or entries that reference the images.
- PNGs and other non-JPG files (the PNGs on the site are tiny icons).

### Settings (environment variables)
| Variable | Default | Purpose |
|---|---|---|
| `DRY_RUN` | `1` | `1` = only list files, `0` = apply the changes |
| `MAX_PX` | `2560` | Maximum length of the longest side |
| `QUALITY` | `82` | JPEG quality |
| `MIN_SIZE` | `1M` | Only process files bigger than this |
| `BACKUP_DIR` | `~/studio-fabri-images-backup-<date>` | Where the originals are copied |
| `COMPOSE_FILES` | `-f docker-compose.yml -f docker-compose.remote.yml` (remote) | Compose files used for `exec`. Locally use `-f docker-compose.yml` |
| `STATAMIC_SERVICE` | `statamic` | Compose service that runs PHP |

---

## 4. How to run it

### Locally first
```bash
cd ~/Dockers/studio-fabri

# 1. Get the real images from the server (optional, but tests with real files)
rsync -avz --exclude '.meta' \
  user@server:/data/webs/studio-fabri/statamic/public/images/ \
  ./statamic/public/images/

# 2. Make sure the local stack is running
docker compose --profile local-only up -d

# 3. Make the script executable
chmod +x compress-images.sh

# 4. Dry run
COMPOSE_FILES="-f docker-compose.yml" ./compress-images.sh

# 5. Apply
DRY_RUN=0 COMPOSE_FILES="-f docker-compose.yml" ./compress-images.sh
```
Then check https://studio-fabri.localhost:8464/ and the asset browser in the CP. Don't commit the compressed images or the rsynced files unless the images are meant to be tracked in git.

### On the live server
```bash
cd /data/webs/studio-fabri
df -h ~                               # make sure there's room for the backup
sudo chmod +x compress-images.sh      # make the file executable
./compress-images.sh                  # dry run: check the list
DRY_RUN=0 ./compress-images.sh        # apply
```

### Rolling back
```bash
cp -a ~/studio-fabri-images-backup-<date>/. /data/webs/studio-fabri/statamic/public/images/
docker compose -f docker-compose.yml -f docker-compose.remote.yml exec statamic php please assets:meta
```

---

## 5. Checks after running
- [ ] The home page and a few project pages load, and the images look right
- [ ] Spot-check the largest images (`marten-road-*`, `230518_fabbri_busheyave_*`, `studio-fabbri---belmont*`) for colour or quality problems
- [ ] The CP asset browser shows the new dimensions and file sizes
- [ ] Record the before/after size in this document
- [ ] Delete the backup after a few days if everything is fine

## 6. Result
_To fill in after the live run:_ files processed ___, before ___ MB, after ___ MB.
