package com.stepcounter;

import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class StepCounterModule extends ReactContextBaseJavaModule implements SensorEventListener {
    private static final String MODULE_NAME = "StepCounterModule";
    private final ReactApplicationContext reactContext;
    private SensorManager sensorManager;
    private Sensor stepCounterSensor;
    private int initialStepCount = -1; // Store initial steps when app starts
    private int currentSteps = 0;

    public StepCounterModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        sensorManager = (SensorManager) context.getSystemService(context.SENSOR_SERVICE);
        stepCounterSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void startStepCounter() {
        if (stepCounterSensor != null) {
            sensorManager.registerListener(this, stepCounterSensor, SensorManager.SENSOR_DELAY_NORMAL);

            // Start the foreground service for background counting
            Intent serviceIntent = new Intent(reactContext, StepCounterService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(serviceIntent);
            } else {
                reactContext.startService(serviceIntent);
            }
        }
    }

    @ReactMethod
    public void stopStepCounter() {
        sensorManager.unregisterListener(this);
        Intent serviceIntent = new Intent(reactContext, StepCounterService.class);
        reactContext.stopService(serviceIntent);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            int totalSteps = (int) event.values[0];

            // Store the initial step count when the app starts
            if (initialStepCount == -1) {
                initialStepCount = totalSteps;
            }

            // Calculate steps relative to the initial count
            currentSteps = totalSteps - initialStepCount;

            sendEvent("StepCountUpdate", currentSteps);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    private void sendEvent(String eventName, int stepCount) {
        WritableMap params = Arguments.createMap();
        params.putInt("steps", stepCount);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}
