#!/bin/bash
echo "Starting ADULTERA Backend API on port 3001..."
cd /home/shaaann/CEP
node server/server.js &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

echo "Starting ADULTERA Frontend on port 5173..."
npm run dev &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo ""
echo "================================"
echo "ADULTERA is running!"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo "================================"
echo ""
echo "Press Ctrl+C to stop both servers."

wait
