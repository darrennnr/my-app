#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Usage: $0 <backup.db>"
  exit 1
fi
DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${DATABASE_URL#file:}"
if [[ "$SRC" != /* ]]; then
  SRC="$DIR/prisma/${SRC#./}"
fi
cp "$1" "$SRC"
echo "Restored to $SRC"
