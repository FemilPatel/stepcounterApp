import {NativeEventEmitter, NativeModules} from 'react-native';

const {StepCounterModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(StepCounterModule);

export const startStepCounting = () => {
  StepCounterModule.startStepCounter();
};

export const stopStepCounting = () => {
  StepCounterModule.stopStepCounter();
};

export const listenToSteps = callback => {
  return eventEmitter.addListener('StepCountUpdate', event => {
    callback(event.steps);
  });
};
