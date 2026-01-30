#!/bin/bash


ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

clean_all() {
  # 清理构建产物与增量缓存，避免 tsc -b 误判为最新
  find "$ROOT_DIR/packages" "$ROOT_DIR/apps" -type d -name "dist" -prune -exec rm -rf {} +
  find "$ROOT_DIR/packages" "$ROOT_DIR/apps" -type f -name "tsconfig.tsbuildinfo" -exec rm -f {} +
  rm -f "$ROOT_DIR/tsconfig.tsbuildinfo"
}

clean_self() {
  local target_dir
  target_dir="$(pwd)"

  rm -rf "$target_dir/dist"
  rm -f "$target_dir/tsconfig.tsbuildinfo"
}

if [[ "${1:-}" == "--all" ]]; then
  clean_all
  exit 0
fi

clean_self



# 清理所有开发进程

pkill -9 -f 'tsx watch' 2>/dev/null
pkill -9 -f 'next dev' 2>/dev/null
pkill -9 -f 'concurrently' 2>/dev/null

sleep 1

# 清理端口占用
PORTS=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012)
for PORT in "${PORTS[@]}"; do
  lsof -ti:$PORT 2>/dev/null | xargs kill -9 2>/dev/null
done

sleep 1
