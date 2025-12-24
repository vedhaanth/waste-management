import { useState, useEffect } from 'react';

export const useMongoDB = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Test MongoDB connection
  const testConnection = async () => {
    try {
      const response = await fetch('/api/test-mongo');
      const data = await response.json();
      setIsConnected(data.success);
      return data;
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
      return { success: false, error: error.message };
    }
  };

  // Get all waste items
  const getWasteItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/waste-items');
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to fetch waste items:', error);
      return { success: false, error: error.message };
    }
  };

  // Add new waste item
  const addWasteItem = async (itemData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/waste-items/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to add waste item:', error);
      return { success: false, error: error.message };
    }
  };

  // Register new user
  const registerUser = async (userData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to register user:', error);
      return { success: false, error: error.message };
    }
  };

  // Get statistics
  const getStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to fetch stats:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return {
    isConnected,
    isLoading,
    testConnection,
    getWasteItems,
    addWasteItem,
    registerUser,
    getStats,
  };
};