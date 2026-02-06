#!/bin/bash

# FieldCheck Mobile - Complete Setup Script
# This script installs all dependencies and configures the app

echo "================================================"
echo "FieldCheck Mobile - Complete Setup"
echo "================================================"

# Step 1: Install camera packages
echo ""
echo "Step 1: Installing camera dependencies..."
npx expo install expo-camera expo-barcode-scanner

# Step 2: Install other required packages
echo ""
echo "Step 2: Installing additional packages..."
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Step 3: Instructions for manual updates
echo ""
echo "================================================"
echo "Setup complete! Next steps:"
echo "================================================"
echo ""
echo "1. UPDATE app.json - Add camera permissions:"
echo "   {"
echo "     \"expo\": {"
echo "       \"plugins\": ["
echo "         ["
echo "           \"expo-camera\","
echo "           {"
echo "             \"cameraPermission\": \"Allow FieldCheck to access camera\""
echo "           }"
echo "         ]"
echo "       ]"
echo "     }"
echo "   }"
echo ""
echo "2. REPLACE these files:"
echo "   - src/screens/assets/ScanAsset.js"
echo "   - src/screens/inspections/AIAnalysis.js"
echo ""
echo "3. RUN the app:"
echo "   npx expo start -c"
echo ""
echo "================================================"
