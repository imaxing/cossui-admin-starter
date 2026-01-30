#!/bin/bash

# 总启动脚本 - 启动开发服务

# 清理僵尸进程
bash scripts/clean.sh

# 清理旧构建产物与增量缓存
find "packages" "apps" -type d -name "dist" -prune -exec rm -rf {} + 2>/dev/null
find "packages" "apps" -type f -name "*.tsbuildinfo" -delete 2>/dev/null

# 构建依赖包
pnpm --filter @cat/types build && \
pnpm --filter @cat/constants build && \
pnpm --filter @cat/shared build && \
pnpm --filter @cat/uikit build

# 显示服务地址
(
  sleep 3
  echo ""
  echo "=========================================="
  echo "[Basic-Admin]    http://localhost:3000"
  echo "=========================================="
  echo ""
) &

# 启动服务
pnpm concurrently \
  --prefix "[{name}]" \
  --names "Basic-Admin" \
  --kill-others-on-fail \
  --no-color \
  "pnpm --filter basic-admin dev"
