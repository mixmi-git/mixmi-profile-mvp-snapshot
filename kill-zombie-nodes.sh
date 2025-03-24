#!/bin/bash
echo "Killing all Node.js processes running on ports 3000-3005..."
lsof -ti :3000-3005 | xargs kill -9 2>/dev/null || echo "No processes found on ports 3000-3005"
echo "Done."
