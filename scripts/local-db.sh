#!/usr/bin/env bash
set -euo pipefail

DB_DIR="$HOME/mednet-db"
PORT=54329

find_pg_ctl() {
  if command -v pg_ctl >/dev/null 2>&1; then
    command -v pg_ctl
    return
  fi
  for d in /usr/lib/postgresql/*/bin; do
    if [ -x "$d/pg_ctl" ]; then
      echo "$d/pg_ctl"
      return
    fi
  done
  echo "" >&2
  echo "pg_ctl not found. Install PostgreSQL (e.g. 'sudo apt install postgresql') or use a free hosted database such as Neon — see README.md." >&2
  exit 1
}

case "${1:-help}" in
  start)
    PG_CTL=$(find_pg_ctl)
    if "$PG_CTL" -D "$DB_DIR" status >/dev/null 2>&1; then
      echo "Local Med-Net database is already running on port $PORT."
      exit 0
    fi
    if [ ! -f "$DB_DIR/PG_VERSION" ]; then
      echo "No database found at $DB_DIR — initializing a new one…"
      INITDB=$(dirname "$(find_pg_ctl)")/initdb
      "$INITDB" -D "$DB_DIR" --auth=trust --username=mednet >/dev/null
      "$(dirname "$(find_pg_ctl)")/createdb" -h 127.0.0.1 -p "$PORT" -U mednet mednet 2>/dev/null || true
      echo "Created. Now run: npm run setup"
    fi
    "$PG_CTL" -D "$DB_DIR" -o "-p $PORT -k $DB_DIR -c listen_addresses=127.0.0.1" -l "$DB_DIR/postgres.log" start
    sleep 1
    echo "Local Med-Net database running on port $PORT."
    ;;
  stop)
    PG_CTL=$(find_pg_ctl)
    "$PG_CTL" -D "$DB_DIR" stop -m fast 2>/dev/null || echo "Database was not running."
    ;;
  status)
    PG_CTL=$(find_pg_ctl)
    "$PG_CTL" -D "$DB_DIR" status 2>/dev/null || echo "Stopped"
    ;;
  *)
    echo "Usage: npm run db:start | npm run db:stop | npm run db:status"
    echo ""
    echo "Manages the local development database stored in ~/mednet-db."
    echo "For production, use a hosted Postgres such as Neon (see README.md)."
    ;;
esac
