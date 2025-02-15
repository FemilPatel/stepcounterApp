import {
  View,
  Text,
  Button,
  SafeAreaView,
  NativeModules,
  NativeEventEmitter,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {
  check,
  PERMISSIONS,
  request,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import {listenToSteps, startStepCounting} from './StepCounterIos';
import {stopStepCounting} from './StepCounterAndroid';

const AppIos = () => {
  const [steps, setSteps] = useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      requestNotifications(['alert', 'sound']).then(({status, settings}) => {
        // …
      });
      requestPermissions();
    }, 1000);
  }, []);

  const requestPermissions = async () => {
    try {
      const result = await check(PERMISSIONS.IOS.MOTION);
      if (result === RESULTS.DENIED) {
        await request(PERMISSIONS.IOS.MOTION);
      }

      console.log('All permissions granted!');
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  React.useEffect(() => {
    const subscription = listenToSteps(setSteps);
    return () => subscription.remove();
  }, []);
  return (
    <SafeAreaView>
      <View>
        <Text>Steps: {steps}</Text>
        <Button title="Start Counting" onPress={startStepCounting} />
        <Button title="Stop Counting" onPress={stopStepCounting} />
      </View>
    </SafeAreaView>
  );
};

export default AppIos;
