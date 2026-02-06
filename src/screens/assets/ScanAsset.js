import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';

const ScanAsset = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in your device settings to scan QR codes and barcodes.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => console.log('Open settings') }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      Alert.alert('Error', 'Failed to request camera permission');
      setHasPermission(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    
    // Validate scanned data
    if (!data || data.trim() === '') {
      Alert.alert('Invalid Code', 'The scanned code is empty. Please try again.');
      setScanned(false);
      return;
    }

    Alert.alert(
      'Asset Scanned',
      `Asset ID: ${data}\nType: ${type}`,
      [
        {
          text: 'Scan Another',
          onPress: () => setScanned(false),
          style: 'cancel'
        },
        {
          text: 'View Asset Details',
          onPress: () => {
            // Navigate to asset details with the scanned ID
            navigation.navigate('Assets', { assetId: data });
          }
        }
      ]
    );
  };

  const handleManualEntry = () => {
    // For production, implement a proper modal or navigate to input screen
    Alert.alert(
      'Manual Entry',
      'Enter Asset ID',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Open Form',
          onPress: () => {
            // Navigate to manual entry form
            console.log('Navigate to manual entry');
          }
        }
      ]
    );
  };

  const onCameraReady = () => {
    setCameraReady(true);
  };

  // Permission Loading State
  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Initializing Camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Permission Denied State
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>📷</Text>
          <Text style={styles.errorTitle}>Camera Access Denied</Text>
          <Text style={styles.errorMessage}>
            FieldCheck needs camera access to scan QR codes and barcodes.
            Please enable camera permissions in your device settings.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={requestCameraPermission}
          >
            <Text style={styles.primaryButtonText}>Request Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleManualEntry}
          >
            <Text style={styles.secondaryButtonText}>Enter Manually</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Camera Screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'code93', 'pdf417'],
          }}
          onCameraReady={onCameraReady}
        >
          {/* Scan Frame Overlay */}
          <View style={styles.overlay}>
            <View style={styles.topOverlay} />
            <View style={styles.middleRow}>
              <View style={styles.sideOverlay} />
              <View style={styles.scanFrame}>
                {/* Corner Markers */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                
                {/* Scanning Animation */}
                {!scanned && cameraReady && (
                  <View style={styles.scanLine} />
                )}
              </View>
              <View style={styles.sideOverlay} />
            </View>
            <View style={styles.bottomOverlay}>
              <Text style={styles.instructionText}>
                {scanned ? 'Processing...' : 'Position code within frame'}
              </Text>
            </View>
          </View>
        </CameraView>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualEntry}
        >
          <Text style={styles.manualButtonIcon}>⌨️</Text>
          <Text style={styles.manualButtonText}>Manual Entry</Text>
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.resetButtonText}>🔄 Scan Again</Text>
          </TouchableOpacity>
        )}

        <View style={styles.formatsContainer}>
          <Text style={styles.formatsTitle}>Supported Formats</Text>
          <View style={styles.formatTags}>
            <View style={styles.formatTag}>
              <Text style={styles.formatTagText}>QR Code</Text>
            </View>
            <View style={styles.formatTag}>
              <Text style={styles.formatTagText}>EAN-13</Text>
            </View>
            <View style={styles.formatTag}>
              <Text style={styles.formatTagText}>Code 128</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#00d4ff',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00d4ff',
    opacity: 0.8,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  controlsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  manualButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  manualButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  manualButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formatsContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  formatsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  formatTags: {
    flexDirection: 'row',
    gap: 8,
  },
  formatTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  formatTagText: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScanAsset;
