
import { useState, useEffect } from 'react';

export interface ComparisonData {
  originalDocument: string;
  dateTimeFormat: string;
  marker: string;
  apiEndpoint: string;
}

export const useStorageData = (isChromeExtension: boolean) => {
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    originalDocument: '',
    dateTimeFormat: '',
    marker: '',
    apiEndpoint: ''
  });

  // Load data from storage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        if (isChromeExtension) {
          const chrome = (window as any).chrome;
          const result = await chrome.storage.local.get(['emailComparisonData']);
          if (result.emailComparisonData) {
            setComparisonData(prev => ({
              ...prev,
              ...result.emailComparisonData
            }));
          }
        } else {
          const stored = localStorage.getItem('emailComparisonData');
          if (stored) {
            const parsedData = JSON.parse(stored);
            setComparisonData(prev => ({
              ...prev,
              ...parsedData
            }));
          }
        }
      } catch (error) {
        console.log('Storage not available, using session state');
      }
    };
    
    loadStoredData();
  }, [isChromeExtension]);

  // Save data to storage whenever comparisonData changes
  useEffect(() => {
    const saveData = async () => {
      try {
        if (isChromeExtension) {
          const chrome = (window as any).chrome;
          await chrome.storage.local.set({ emailComparisonData: comparisonData });
        } else {
          localStorage.setItem('emailComparisonData', JSON.stringify(comparisonData));
        }
      } catch (error) {
        console.log('Storage not available');
      }
    };

    saveData();
  }, [comparisonData, isChromeExtension]);

  const updateField = (field: keyof ComparisonData, value: string) => {
    setComparisonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetData = () => {
    setComparisonData({
      originalDocument: '',
      dateTimeFormat: '',
      marker: '',
      apiEndpoint: ''
    });
  };

  const clearStorage = async () => {
    try {
      if (isChromeExtension) {
        const chrome = (window as any).chrome;
        await chrome.storage.local.remove(['emailComparisonData']);
      } else {
        localStorage.removeItem('emailComparisonData');
      }
    } catch (error) {
      console.log('Cannot clear storage');
    }
  };

  return {
    comparisonData,
    updateField,
    resetData,
    clearStorage
  };
};
