
import { useState, useEffect } from 'react';

export interface ComparisonData {
  originalDocument: string;
  dateTimeFormat: string;
  marker: string;
}

export const useStorageData = () => {
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    originalDocument: '',
    dateTimeFormat: '',
    marker: ''
  });

  const isChromeExtension = () => {
    return typeof window !== 'undefined' && 
           typeof (window as any).chrome !== 'undefined' && 
           (window as any).chrome.runtime && 
           (window as any).chrome.storage;
  };

  // Load data from Chrome storage on component mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        if (isChromeExtension()) {
          const chrome = (window as any).chrome;
          const result = await chrome.storage.local.get(['emailComparisonData']);
          if (result.emailComparisonData) {
            setComparisonData(result.emailComparisonData);
          }
        } else {
          const stored = localStorage.getItem('emailComparisonData');
          if (stored) {
            setComparisonData(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.log('Storage not available, using session state');
      }
    };
    
    loadStoredData();
  }, []);

  // Save data to Chrome storage whenever comparisonData changes
  useEffect(() => {
    const saveData = async () => {
      try {
        if (isChromeExtension()) {
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
  }, [comparisonData]);

  const clearStoredData = async () => {
    try {
      if (isChromeExtension()) {
        const chrome = (window as any).chrome;
        await chrome.storage.local.remove(['emailComparisonData']);
      } else {
        localStorage.removeItem('emailComparisonData');
      }
    } catch (error) {
      console.log('Cannot clear storage');
    }
  };

  const handleInputChange = (field: keyof ComparisonData, value: string) => {
    setComparisonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    comparisonData,
    handleInputChange,
    clearStoredData,
    setComparisonData
  };
};
