import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { inspectionsAPI } from '../../api/inspections';
import { subscriptionsAPI } from '../../api/subscriptions';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import colors from '../../theme/colors';

const AIAnalysisScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(null);

  React.useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    try {
      const response = await subscriptionsAPI.getUsage();
      if (response.success) {
        setUsage(response.stats);
      }
    } catch (error) {
      console.error('Load usage error:', error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library permissions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setAnalysis(null); // Clear previous analysis
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera permissions');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setAnalysis(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setLoading(true);
    try {
      const response = await inspectionsAPI.analyzeImage(selectedImage);

      if (response.success) {
        setAnalysis(response.analysis);
        await loadUsage(); // Refresh usage
        Alert.alert('Success', 'AI analysis complete!');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      if (error.upgrade) {
        Alert.alert(
          'Limit Reached',
          error.message,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Upgrade',
              onPress: () => navigation.navigate('Profile', { screen: 'Upgrade' }),
            },
          ]
        );
      } else {
        Alert.alert('Error', error.message || 'Analysis failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const severityMap = {
      Low: colors.success,
      Medium: colors.warning,
      High: colors.error,
      Critical: '#B00020',
    };
    return severityMap[severity] || colors.textSecondary;
  };

  if (loading) {
    return <Loading text="Analyzing with AI..." />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Usage Stats */}
      {usage && (
        <Card style={styles.usageCard}>
          <View style={styles.usageHeader}>
            <Text style={styles.usageTitle}>AI Usage</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planText}>{usage.plan.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.usageStats}>
            <View style={styles.usageStat}>
              <Text style={styles.usageLabel}>Image Analysis</Text>
              <Text style={styles.usageValue}>
                {usage.imageAnalysis.used} / {usage.imageAnalysis.limit === -1 ? '∞' : usage.imageAnalysis.limit}
              </Text>
            </View>
            <View style={styles.usageStat}>
              <Text style={styles.usageLabel}>AI Reports</Text>
              <Text style={styles.usageValue}>
                {usage.aiReports.used} / {usage.aiReports.limit === -1 ? '∞' : usage.aiReports.limit}
              </Text>
            </View>
          </View>
        </Card>
      )}

      {/* Image Selection */}
      <Card>
        <Text style={styles.cardTitle}>Select Image</Text>
        {selectedImage ? (
          <View>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <View style={styles.imageActions}>
              <Button
                title="Pick Different"
                onPress={pickImage}
                variant="outline"
                style={styles.imageButton}
              />
              <Button
                title="Take New"
                onPress={takePhoto}
                variant="outline"
                style={styles.imageButton}
              />
            </View>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={64} color={colors.textLight} />
            <Text style={styles.placeholderText}>No image selected</Text>
            <View style={styles.imageActions}>
              <Button
                title="Pick from Gallery"
                onPress={pickImage}
                style={styles.imageButton}
              />
              <Button
                title="Take Photo"
                onPress={takePhoto}
                style={styles.imageButton}
              />
            </View>
          </View>
        )}
      </Card>

      {/* Analyze Button */}
      {selectedImage && !analysis && (
        <Button
          title="🤖 Analyze with AI"
          onPress={analyzeImage}
          style={styles.analyzeButton}
        />
      )}

      {/* AI Analysis Results */}
      {analysis && (
        <>
          <Card>
            <View style={styles.resultHeader}>
              <Ionicons name="checkmark-circle" size={32} color={colors.success} />
              <Text style={styles.resultTitle}>AI Analysis Complete</Text>
            </View>

            <View style={styles.severityBadge}>
              <Text
                style={[
                  styles.severityText,
                  { color: getSeverityColor(analysis.severity) },
                ]}
              >
                Severity: {analysis.severity}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionText}>{analysis.description}</Text>
            </View>

            {analysis.issues && analysis.issues.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Issues Found</Text>
                {analysis.issues.map((issue, index) => (
                  <View key={index} style={styles.issueItem}>
                    <Ionicons name="alert-circle" size={20} color={colors.error} />
                    <Text style={styles.issueText}>{issue}</Text>
                  </View>
                ))}
              </View>
            )}

            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                {analysis.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recItem}>
                    <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
                    <Text style={styles.recText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <View style={styles.actions}>
            <Button
              title="Analyze Another"
              onPress={() => {
                setSelectedImage(null);
                setAnalysis(null);
              }}
              variant="outline"
            />
            <Button
              title="Create Inspection"
              onPress={() => {
                navigation.navigate('CreateInspection', {
                  aiAnalysis: analysis,
                  imageUri: selectedImage,
                });
              }}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  usageCard: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  planText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  usageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  usageStat: {
    alignItems: 'center',
  },
  usageLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  usageValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 24,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  imageButton: {
    flex: 1,
  },
  analyzeButton: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 16,
    marginBottom: 16,
  },
  severityText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
});

export default AIAnalysisScreen;