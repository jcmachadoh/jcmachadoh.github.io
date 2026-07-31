#!/usr/bin/env bash
# ============================================================
# Normaliza todas las imagenes de proyectos a 16:9 (1280x720)
# manteniendo el formato y nombre original de cada archivo.
#
# - Imagenes con proporcion entre MIN_RATIO y MAX_RATIO:
#   recorte centrado (cover) hasta 1280x720.
# - Imagenes con proporcion extrema (capturas muy pequenas,
#   banners ultra anchos, etc.):
#   se colocan centradas sobre un fondo difuminado 16:9.
#
# Uso: bash scripts/normalize-images.sh
# ============================================================

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECTS_DIR="$ROOT/public/projects"

WIDTH=1280
HEIGHT=720
MIN_RATIO=1.4
MAX_RATIO=2.2
QUALITY=90

command -v identify >/dev/null 2>&1 || { echo "Se requiere ImageMagick (identify)."; exit 1; }
command -v convert >/dev/null 2>&1 || { echo "Se requiere ImageMagick (convert)."; exit 1; }

if [[ ! -d "$PROJECTS_DIR" ]]; then
    echo "No existe el directorio $PROJECTS_DIR"
    exit 1
fi

tmp_bg="$(mktemp --suffix=.png)"
tmp_fg="$(mktemp --suffix=.png)"
trap 'rm -f "$tmp_bg" "$tmp_fg"' EXIT

count=0

while IFS= read -r -d '' file; do
    read -r w h < <(identify -format '%w %h\n' "$file")
    ratio="$(LC_ALL=C awk "BEGIN{printf \"%.3f\", $w/$h}")"

    if LC_ALL=C awk "BEGIN{exit !($ratio >= $MIN_RATIO && $ratio <= $MAX_RATIO)}"; then
        convert "$file" \
            -resize "${WIDTH}x${HEIGHT}^" -gravity center -extent "${WIDTH}x${HEIGHT}" \
            -strip -quality "$QUALITY" "$file"
        echo "cover    [$ratio] $file"
    else
        convert "$file" \
            -resize "${WIDTH}x${HEIGHT}^" -gravity center -extent "${WIDTH}x${HEIGHT}" \
            -blur 0x60 -modulate 100,85 "$tmp_bg"
        convert "$file" \
            -resize "${WIDTH}x${HEIGHT}" -gravity center -background none -extent "${WIDTH}x${HEIGHT}" \
            "$tmp_fg"
        convert "$tmp_bg" "$tmp_fg" -gravity center -compose over -composite \
            -strip -quality "$QUALITY" "$file"
        echo "blurfill [$ratio] $file"
    fi

    count=$((count + 1))
done < <(find "$PROJECTS_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) -print0)

echo
echo "Listo: $count imagenes normalizadas a ${WIDTH}x${HEIGHT} (16:9)."
