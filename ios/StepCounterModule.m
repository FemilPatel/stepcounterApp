//
//  StepCounterModule.m
//  stepcounter
//
//  Created by DREAMWORLD on 08/02/25.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <CoreMotion/CoreMotion.h>
#import <UserNotifications/UserNotifications.h>

@interface StepCounterModule : RCTEventEmitter <RCTBridgeModule>
@end

@implementation StepCounterModule {
  CMPedometer *pedometer;
  int initialSteps;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"StepCountUpdate"];
}

RCT_EXPORT_METHOD(startStepCounter) {
  NSLog(@"test");
  if (!pedometer) {
    pedometer = [[CMPedometer alloc] init];
  }

  if ([CMPedometer isStepCountingAvailable]) {
    initialSteps = -1;
    
    [pedometer startPedometerUpdatesFromDate:[NSDate date]
                                  withHandler:^(CMPedometerData * _Nullable pedometerData, NSError * _Nullable error) {
      if (error) {
        NSLog(@"Pedometer error: %@", error);
        return;
      }

      int totalSteps = [pedometerData.numberOfSteps intValue];

      if (initialSteps == -1) {
        initialSteps = totalSteps;
      }

      int currentSteps = totalSteps - initialSteps;

      [self sendEventWithName:@"StepCountUpdate"
                         body:@{@"steps": @(currentSteps)}];

      [self showStepCountNotification:currentSteps];
    }];
  }
}

RCT_EXPORT_METHOD(stopStepCounter) {
  [pedometer stopPedometerUpdates];
}

- (void)showStepCountNotification:(int)steps {
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
  content.title = @"Step Counter";
  content.body = [NSString stringWithFormat:@"You have walked %d steps today!", steps];
  content.sound = [UNNotificationSound defaultSound];

  UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:@"StepCounterNotification"
                                                                        content:content
                                                                        trigger:nil];

  [center addNotificationRequest:request withCompletionHandler:nil];
}

@end
