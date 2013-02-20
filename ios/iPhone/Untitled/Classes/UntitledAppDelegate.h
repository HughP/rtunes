//
//  UntitledAppDelegate.h
//  Untitled
//
//  Created by Rhushiraj Patil on 13-02-13.
//  Copyright 2013 Saba Softwares Pvt. Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UntitledAppDelegate : NSObject <UIApplicationDelegate, UITabBarControllerDelegate> {
    UIWindow *window;
    UITabBarController *tabBarController;
}

@property (nonatomic, retain) IBOutlet UIWindow *window;
@property (nonatomic, retain) IBOutlet UITabBarController *tabBarController;

@end
