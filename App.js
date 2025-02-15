import {View, Text, Platform} from 'react-native';
import React from 'react';
import AppIos from './AppIos';
import AppAndroid from './AppAndroid';

const App = () => {
  return <>{Platform.OS === 'ios' ? <AppIos /> : <AppAndroid />}</>;
};

export default App;
