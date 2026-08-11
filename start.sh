#!/usr/bin/env bash

echo "🚀 Starting SalesGenie AI Backend (FastAPI)..."
cd "$(dirname "$0")/backend"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "✨ Starting SalesGenie AI Frontend (Vite React)..."
cd "../frontend"
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM EXIT

echo ""
echo "========================================================="
echo " 🎉 SalesGenie AI Full-Stack Platform is Live!"
echo " 👉 Frontend: http://localhost:5173"
echo " 👉 Backend API Docs: http://localhost:8000/docs"
echo "========================================================="
echo ""

wait
