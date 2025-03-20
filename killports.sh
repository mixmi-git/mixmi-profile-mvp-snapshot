#!/bin/bash

# Kill processes on common Next.js ports
echo "Killing processes on ports 3000-3010..."
for port in {3000..3010}; do
  lsof -ti:$port | xargs kill -9 2>/dev/null || true
done

# Kill any Next.js processes by name
echo "Killing any remaining Next.js processes..."
pkill -f "node.*next" 2>/dev/null || true

echo "All Next.js processes killed. Ready to start a fresh server." 