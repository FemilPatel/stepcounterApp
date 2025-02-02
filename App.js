import {View, Text, Button, PermissionsAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  listenToSteps,
  startStepCounting,
  stopStepCounting,
} from './StepCounter';

const App = () => {
  const [steps, setSteps] = useState(0);
  useEffect(() => {
    requestActivityPermission();
  }, []);

  useEffect(() => {
    const subscription = listenToSteps(setSteps);
    return () => subscription.remove();
  }, []);

  async function requestActivityPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Activity recognition permission granted');
      } else {
        console.log('Activity recognition permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View>
      <Text>Steps: {steps}</Text>
      <Button title="Start Counting" onPress={startStepCounting} />
      <Button title="Stop Counting" onPress={stopStepCounting} />
    </View>
  );
};

export default App;
