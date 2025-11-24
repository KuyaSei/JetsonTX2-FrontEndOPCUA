Jetson TX2 Food Volume Monitoring System

This repository contains the full source code for a Real-Time Food Volume Monitoring System running on an NVIDIA Jetson TX2 (Ubuntu 18.04).

It uses a 3-Tier Architecture:

Backend (The Cook): Python + RealSense Camera + OPC UA Server

Middleware (The Waiter): Python + Flask API

Frontend (The Display): Angular 15 + Ionic 7 Dashboard

=> Critical Prerequisites (Read First)

The Jetson TX2 runs an older OS (Ubuntu 18.04), which limits software compatibility. Do not install the latest versions of Node.js or Angular. You must follow these specific version requirements.

OS: Ubuntu 18.04 (L4T)

Python: 3.8 (Managed via Conda)

Node.js: v16.x (Strict requirement)

Angular CLI: v15.x (Strict requirement)

=> Part 1: System Setup (One-Time Installation)

1. Python Environment (Conda)

We use Conda to manage Python libraries and avoid system conflicts.

# 1. Create the environment
conda create -n OpcuaDemo python=3.8

# 2. Activate it (You must do this every time you open a terminal)
conda activate OpcuaDemo

# 3. Install System Dependencies (Required for OPC UA)
sudo apt update
sudo apt install libxml2-dev libxslt-dev

# 4. Install Python Libraries
pip install opcua asyncua flask flask-cors opencv-python pyrealsense2


2. Node.js & Angular Setup (The Downgrade Strategy)

Modern Angular (v17+) does not work on Jetson TX2. We must force install Node 16 and Angular 15.

# 1. Remove any existing/wrong Node versions
sudo apt remove nodejs npm
sudo rm /etc/apt/sources.list.d/nodesource.list

# 2. Install Node.js v16 (The "Golden Version" for Jetson)
curl -fsSL [https://deb.nodesource.com/setup_16.x](https://deb.nodesource.com/setup_16.x) | sudo -E bash -
sudo apt install -y nodejs

# 3. Verify Versions (Must see v16.x.x and npm 8.x.x)
node -v
npm -v

# 4. Install Angular CLI v15 Globally
sudo npm install -g @angular/cli@15
sudo npm install -g @ionic/cli


=> Part 2: Project Configuration

1. Frontend Setup

After cloning this repo, you need to install the local project dependencies.

cd angular-test

# 1. Clean up any old/wrong installations
rm -rf node_modules package-lock.json

# 2. Install dependencies (This reads the prepared package.json for v15)
npm install

# 3. (Optional) If you encounter errors, run the compatibility compiler manually
./node_modules/.bin/ngcc


2. Files Explained (What to Keep/Delete)

OPCUA-Fetch-Demo/ (The Backend Folder)

camera_server.py (KEEP): This is the MAIN server script. It connects to the RealSense camera, calculates distance at 4 points, and runs the OPC UA server. Use this for the real demo.

api_server.py (KEEP): This is the Flask API that serves data to the frontend.

point_finder.py (Utility): Use this to calibrate (click) the 4 points on the camera feed.

server_UI.py (DELETE/IGNORE): Old demo script for random numbers. Not used in production.

OPCUA_local_RandomValue_serve.py (DELETE/IGNORE): Old mock data server.

angular-test/ (The Frontend Folder)

src/app/app.component.ts: Main logic. Connects to http://localhost:5000/data.

src/app/app.component.html: The Ionic Dashboard UI design.

angular.json: Specific configuration for Angular 15 builder. Do not update this.

src/polyfills.ts: Required file for Angular 15 compatibility.

=> Part 3: How to Run the System (Daily Routine)

You need 3 separate terminals to run the full stack.

Terminal 1: The Camera Server (The Cook)

This runs the camera and the OPC UA server.

conda activate OpcuaDemo
cd OPCUA-Fetch-Demo
python3 camera_server.py


Action: A window will pop up showing the live camera feed. Press 'q' to stop.

Terminal 2: The API Server (The Waiter)

This bridges the camera data to the web dashboard.

conda activate OpcuaDemo
cd OPCUA-Fetch-Demo
python3 api_server.py


Output: "Running on https://www.google.com/search?q=http://0.0.0.0:5000"

Terminal 3: The Frontend (The Display)

This runs the Angular/Ionic dashboard.

cd angular-test
ng serve --host 0.0.0.0 --disable-host-check


Output: "Angular Live Development Server is listening on..."

=> Part 4: Viewing the Dashboard

Open the web browser on the Jetson TX2 (Chromium).

Go to: http://localhost:4200

You will see the live dashboard updating with real sensor data from the camera!

=> Troubleshooting Guide

Error: ng serve fails with "Schema validation failed"

Fix: Your angular.json is too new. Replace its content with the Angular 15 compatible schema (provided in the project docs).

Error: ENOENT: src/polyfills.ts

Fix: Create the file src/polyfills.ts and add import 'zone.js'; to it. Update angular.json to include "src/polyfills.ts" in the polyfills array.

Error: Module not found: Error: Can't resolve...

Fix: Delete node_modules and run npm install --legacy-peer-deps.

Camera Window freezes but Terminal works

Fix: This is a known threading issue. Ensure the cv2.imshow loop is running inside the main async loop with await asyncio.sleep(0.001).
