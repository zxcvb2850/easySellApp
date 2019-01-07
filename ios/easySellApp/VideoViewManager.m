//
//  CLFButtonManager.m
//  Test
//
//  Created by CSSTWH on 2018/10/30.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "VideoViewManager.h"
#import <React/RCTBridge.h>
#import "VideoView.h"
@implementation VideoViewManager
{
  VideoView *g_CLFImageView;
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(videoPlay) {
  [g_CLFImageView VideoPlay];
}
RCT_EXPORT_METHOD(videoStop) {
  [g_CLFImageView VideoStop];
}

//RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
/*RCT_CUSTOM_VIEW_PROPERTY(normalTitle, NSString, UIButton){
  
  [view setTitle:json forState: UIControlStateNormal];
}
RCT_CUSTOM_VIEW_PROPERTY(selectedTitle, NSString, UIButton){
    
   [view setTitle:json forState: UIControlStateSelected];
}*/
RCT_CUSTOM_VIEW_PROPERTY(serverIP, NSString, UIImageView){
  VideoView *imgView = (VideoView*)view;
  [imgView SetServerIP: json];
}
RCT_CUSTOM_VIEW_PROPERTY(serverPort, NSString, UIImageView){
  VideoView *imgView = (VideoView*)view;
  [imgView SetServerPort: json];
}
RCT_CUSTOM_VIEW_PROPERTY(callID, NSString, UIImageView){
  VideoView *imgView = (VideoView*)view;
  [imgView SetCallID: json];
}
RCT_CUSTOM_VIEW_PROPERTY(resID, NSString, UIImageView){
  VideoView *imgView = (VideoView*)view;
  [imgView SetResID: json];
}
RCT_CUSTOM_VIEW_PROPERTY(state, NSString, UIImageView){
  VideoView *imgView = (VideoView*)view;
  [imgView SetState: json];
}
RCT_CUSTOM_VIEW_PROPERTY(captureImage, NSString, UIImageView){
  VideoView *imgView = (VideoView*)view;
  [imgView SetState: json];
}

- (UIView *)view

{
    VideoView *imgView = [[VideoView alloc] init];
  
    //[imgView addTarget:self action:@selector(previewSelected:) forControlEvents:UIControlEventTouchUpInside];
    g_CLFImageView = imgView;
    return imgView;
  
    /*CLFButton *btn = [CLFButton buttonWithType:UIButtonTypeCustom];
  
    [btn addTarget:self action:@selector(btnSelected:) forControlEvents:UIControlEventTouchUpInside];
  
    return btn;*/
  
}

- (void)previewSelected: (VideoView *)sender{
}

/*- (void)btnSelected: (CLFButton *)sender{
  
    sender.selected = !sender.selected;
  
      if (!sender.onChange){
    
        return;
    
      }
  
    sender.onChange(@{@"msg": @"我是测试信息", @"isSelected": @(sender.isSelected)});

}*/
@end
