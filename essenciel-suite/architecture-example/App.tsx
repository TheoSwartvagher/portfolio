import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/services/AppNavigator';
import { AppProvider } from './src/contexts/AppContext';
import { LanguageProvider } from './src/contexts/LanguageContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
      <AppProvider>
        <StatusBar />
        <AppNavigator />
      </AppProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
};

export default App;
