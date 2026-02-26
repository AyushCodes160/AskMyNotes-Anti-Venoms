#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Installing backend dependencies..."
cd backend
python3 -m pip install --upgrade pip
pip install -r requirements.txt

echo "Build complete. Ready to serve monolithic app!"
