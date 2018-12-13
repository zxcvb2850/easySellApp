//
//  CLFImageView.h
//  Test
//
//  Created by CSSTWH on 2018/11/2.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>
#import "MClient.framework/Headers/MClient.h"
#import "NPlayer.framework/Headers/NPlayer.h"

@interface VidowView : UIImageView<MStream, NPlayerEvent>

//设置参数
- (void) SetServerIP: (NSString*) serverip;
- (void) SetServerPort: (NSString*) serverPort;
- (void) SetCallID: (NSString*) callID;
- (void) SetResID: (NSString*) resID;
//设置状态-废弃 true:播放 false:停止
- (void) SetState: (NSString*) state;
- (void) VideoPlay;
- (void) VideoStop;

@property (nonatomic, copy) RCTBubblingEventBlock onChange;

@end
