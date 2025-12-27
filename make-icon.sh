#!/bin/bash
set -e
# Generates build/icon.icns from assets/icon.svg or assets/icon.png
SRC_PNG=assets/icon.png
SRC_SVG=assets/icon.svg
ICONSET_DIR=build/icon.iconset
OUT_ICNS=build/icon.icns

mkdir -p build
if [ ! -f "$SRC_PNG" ]; then
  if [ -f "$SRC_SVG" ]; then
    if command -v rsvg-convert >/dev/null 2>&1; then
      rsvg-convert -w 1024 -h 1024 "$SRC_SVG" -o "$SRC_PNG"
    elif command -v convert >/dev/null 2>&1; then
      convert "$SRC_SVG" -resize 1024x1024 "$SRC_PNG"
    else
      echo "No PNG found and no SVG converter (rsvg-convert/convert). Please provide assets/icon.png or install librsvg/imagemagick." >&2
      exit 1
    fi
  else
    echo "No source icon found. Place assets/icon.png or assets/icon.svg." >&2
    exit 1
  fi
fi

rm -rf "$ICONSET_DIR"
mkdir -p "$ICONSET_DIR"

# sizes
sips -z 16 16 "$SRC_PNG" --out "$ICONSET_DIR/icon_16x16.png"
sips -z 32 32 "$SRC_PNG" --out "$ICONSET_DIR/icon_16x16@2x.png"
sips -z 32 32 "$SRC_PNG" --out "$ICONSET_DIR/icon_32x32.png"
sips -z 64 64 "$SRC_PNG" --out "$ICONSET_DIR/icon_32x32@2x.png"
sips -z 128 128 "$SRC_PNG" --out "$ICONSET_DIR/icon_128x128.png"
sips -z 256 256 "$SRC_PNG" --out "$ICONSET_DIR/icon_128x128@2x.png"
sips -z 256 256 "$SRC_PNG" --out "$ICONSET_DIR/icon_256x256.png"
sips -z 512 512 "$SRC_PNG" --out "$ICONSET_DIR/icon_256x256@2x.png"
sips -z 512 512 "$SRC_PNG" --out "$ICONSET_DIR/icon_512x512.png"
sips -z 1024 1024 "$SRC_PNG" --out "$ICONSET_DIR/icon_512x512@2x.png"

iconutil -c icns "$ICONSET_DIR" -o "$OUT_ICNS"

echo "Generated $OUT_ICNS"
