#!/bin/bash

# 设置错误时退出脚本
set -e

# 步骤 1: 回到上级目录
cd ../..

cd web

# 步骤 2: 构建 Docker 镜像
docker build -t 11153123/enty-xai-web:latest .

# 步骤 3: 推送 Docker 镜像
docker push 11153123/enty-xai-web:latest

# 步骤 4: SSH 登录到远程服务器
ssh root@18.163.80.143 << EOF
  # 步骤 5: 切换到项目目录
  cd /root/xai-client
  
  # 步骤 6: 拉取最新的 Docker 镜像
  docker-compose pull
  
  # 步骤 7: 启动容器
  docker-compose up -d
EOF

echo "所有操作已成功执行。"