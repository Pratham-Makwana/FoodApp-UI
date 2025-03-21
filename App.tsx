import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import '@unistyles/unistyles';
import Navigation from '@navigation/Navigation';
import {Provider} from 'react-redux';
import {persistor, store} from '@states/store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Navigation />
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
