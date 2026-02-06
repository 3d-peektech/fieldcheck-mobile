// Example: How to replace axios with fetch in your components

// ❌ OLD WAY (with axios - doesn't work in React Native):
/*
import axios from 'axios';

const fetchData = async () => {
  const response = await axios.get('https://api.example.com/data');
  return response.data;
};

const postData = async (data) => {
  const response = await axios.post('https://api.example.com/data', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
*/

// ✅ NEW WAY (with fetch - works in React Native):

// Option 1: Using the api utility
import api from './utils/api';

const fetchData = async () => {
  const data = await api.get('/data');
  return data;
};

const postData = async (newData) => {
  const result = await api.post('/data', newData);
  return result;
};

// Option 2: Using fetch directly
const fetchDataDirect = async () => {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const postDataDirect = async (newData, token) => {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Example: Complete component with fetch
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import api from './utils/api';

const ExampleComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.get('/api/your-endpoint');
      setData(result);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
};

export default ExampleComponent;