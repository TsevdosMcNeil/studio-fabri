#!/usr/bin/env bash
#
# compress-images.sh — one-off resize/compress of Statamic asset images (Docker setup).
#
# Put this file in the project root (next to docker-compose.yml) and run it on the HOST:
#
#   ./compress-images.sh                 # dry run: lists what would change
#   DRY_RUN=0 ./compress-images.sh       # do it for real
#
# How it works:
#   1. Starts a throwaway alpine container with ImageMagick (nothing installed on the
#      host or in your PHP image), with ./statamic/public/images bind-mounted.
#   2. Inside it: finds JPGs > MIN_SIZE (skips .meta), resizes so the longest edge is
#      <= MAX_PX, recompresses, keeps filenames, keeps owner/permissions, backs up originals.
#   3. Runs `php please assets:meta / glide:clear / static:clear` in the statamic service.
#      Filenames/URLs never change: files are overwritten in place (/images/foo.jpg stays
#      /images/foo.jpg). No Glide URLs are generated — the front-end isn't using Glide.
#
# Tunables (env vars): MAX_PX=2560 QUALITY=82 MIN_SIZE=1M BACKUP_DIR=... IMAGES_DIR=...
#                      COMPOSE_FILES="-f docker-compose.yml -f docker-compose.remote.yml"
#                      STATAMIC_SERVICE=statamic

set -euo pipefail

MAX_PX="${MAX_PX:-2560}"
QUALITY="${QUALITY:-82}"
MIN_SIZE="${MIN_SIZE:-1M}"
DRY_RUN="${DRY_RUN:-1}"

# =====================================================================================
# PART 2 — runs INSIDE the throwaway container
# =====================================================================================
if [ "${IN_CONTAINER:-0}" = "1" ]; then
  DIR=/images
  BACKUP_DIR=/backup
  cd "$DIR"

  human() { numfmt --to=iec --suffix=B "$1"; }
  before_total=0; after_total=0; count=0; skipped=0

  echo "Max ${MAX_PX}px | quality $QUALITY | files > $MIN_SIZE"
  echo "-----------------------------------------------------------------"

  while IFS= read -r -d '' f; do
    f="${f#./}"
    size=$(stat -c %s "$f")
    dims=$(magick identify -format '%wx%h' "${f}[0]" 2>/dev/null || echo "?")

    if [ "$DRY_RUN" = "1" ]; then
      printf '%-8s %-11s %s\n' "$(human "$size")" "$dims" "$f"
      before_total=$((before_total + size)); count=$((count + 1))
      continue
    fi

    tmp="$(mktemp --suffix=.jpg)"
    if ! magick "$f" -auto-orient -resize "${MAX_PX}x${MAX_PX}>" \
          -strip -sampling-factor 4:2:0 -interlace JPEG -quality "$QUALITY" "$tmp"; then
      echo "FAILED: $f" >&2; rm -f "$tmp"; continue
    fi

    new_size=$(stat -c %s "$tmp")
    if [ "$new_size" -ge "$size" ]; then
      echo "skip (no gain): $f"; rm -f "$tmp"; skipped=$((skipped + 1)); continue
    fi

    cp --parents -p "$f" "$BACKUP_DIR/"   # back up original, keeping sub-folders
    cat "$tmp" > "$f"                     # overwrite in place: keeps owner (www-data) + perms
    rm -f "$tmp"

    new_dims=$(magick identify -format '%wx%h' "${f}[0]" 2>/dev/null || echo "?")
    printf '%-8s -> %-8s %-11s -> %-11s %s\n' \
      "$(human "$size")" "$(human "$new_size")" "$dims" "$new_dims" "$f"

    before_total=$((before_total + size)); after_total=$((after_total + new_size))
    count=$((count + 1))
  done < <(find . -type d -name '.meta' -prune -o -type f \
            \( -iname '*.jpg' -o -iname '*.jpeg' \) -size +"$MIN_SIZE" -print0 | sort -z)

  echo "-----------------------------------------------------------------"
  if [ "$DRY_RUN" = "1" ]; then
    echo "$count files would be processed ($(human "$before_total") total)."
  else
    echo "Processed $count files, skipped $skipped."
    echo "Before: $(human "$before_total")  After: $(human "$after_total")  Saved: $(human $((before_total - after_total)))"
  fi
  exit 0
fi

# =====================================================================================
# PART 1 — runs on the HOST
# =====================================================================================
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_PATH="$PROJECT_DIR/$(basename "${BASH_SOURCE[0]}")"
IMAGES_DIR="${IMAGES_DIR:-$PROJECT_DIR/statamic/public/images}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/studio-fabri-images-backup-$(date +%Y%m%d-%H%M%S)}"
COMPOSE_FILES="${COMPOSE_FILES:--f docker-compose.yml -f docker-compose.remote.yml}"
STATAMIC_SERVICE="${STATAMIC_SERVICE:-statamic}"
IM_IMAGE="${IM_IMAGE:-alpine:3.20}"

command -v docker >/dev/null || { echo "docker not found" >&2; exit 1; }
[ -d "$IMAGES_DIR" ] || { echo "Images dir not found: $IMAGES_DIR" >&2; exit 1; }

echo "Images: $IMAGES_DIR"
if [ "$DRY_RUN" = "1" ]; then
  echo "DRY RUN — nothing will be changed. Use DRY_RUN=0 to apply."
  BACKUP_MOUNT=()
else
  mkdir -p "$BACKUP_DIR"
  echo "Backing up originals to: $BACKUP_DIR"
  BACKUP_MOUNT=(-v "$BACKUP_DIR:/backup")
fi

docker run --rm \
  -v "$IMAGES_DIR:/images" \
  ${BACKUP_MOUNT[@]+"${BACKUP_MOUNT[@]}"} \
  -v "$SCRIPT_PATH:/compress-images.sh:ro" \
  -e IN_CONTAINER=1 -e DRY_RUN="$DRY_RUN" \
  -e MAX_PX="$MAX_PX" -e QUALITY="$QUALITY" -e MIN_SIZE="$MIN_SIZE" \
  "$IM_IMAGE" sh -c '
    apk add --no-cache -q bash coreutils findutils imagemagick imagemagick-jpeg >/dev/null \
    && bash /compress-images.sh'

[ "$DRY_RUN" = "1" ] && exit 0

echo
echo "Refreshing Statamic (inside the '$STATAMIC_SERVICE' service)..."
cd "$PROJECT_DIR"
# shellcheck disable=SC2086
dc() { docker compose $COMPOSE_FILES exec -T "$STATAMIC_SERVICE" "$@"; }
dc php please assets:meta  || echo "!! assets:meta failed — run it manually"
# Front-end doesn't use Glide; this only clears the CP's cached thumbnails (harmless, optional)
dc php please glide:clear  || echo "   (glide:clear skipped/failed — fine, only affects CP thumbnails)"
dc php please static:clear || echo "   (static:clear skipped/failed — fine if static caching is off)"

echo
echo "Done. Originals are in: $BACKUP_DIR"
echo "Check the site, then you can delete the backup."
