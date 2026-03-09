#!/bin/bash

# HCI Portfolio Development Server
# Usage: ./dev.sh or bash dev.sh

echo "🚀 Starting development server..."
echo "📁 Serving from: $(pwd)"
echo "🌐 Open your browser to: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Try Python 3 first, then Python 2, then bun
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
elif command -v bun &> /dev/null; then
    bun run index.html
else
    echo "❌ Error: No suitable server found. Please install Python or bun."
    exit 1
fi
