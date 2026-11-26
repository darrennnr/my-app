#!/bin/bash
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$DIR/backups"
mkdir -p "$BACKUP_DIR"
TS=$(date +%Y%m%d-%H%M%S)
SRC="${DATABASE_URL#file:}"
# resolve relative to prisma
if [[ "$SRC" != /* ]]; then
  SRC="$DIR/prisma/${SRC#./}"
fi
if [ ! -f "$SRC" ]; then
  echo "Database not found: $SRC"
  exit 1
fi
cp "$SRC" "$BACKUP_DIR/portal-$TS.db"
echo "Backup saved: $BACKUP_DIR/portal-$TS.db"
# keep last 14
ls -1t "$BACKUP_DIR"/portal-*.db 2>/dev/null | tail -n +15 | xargs -r rm --
