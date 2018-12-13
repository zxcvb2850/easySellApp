//
//  CLFImageView.m
//  Test
//
//  Created by CSSTWH on 2018/11/2.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "VideoView.h"

@implementation VidowView
{
    NSString *m_ServerIP;
    NSString *m_ServerPort;
    NSString *m_CallID;
    NSString *m_ResID;
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/
- (void) SetServerIP: (NSString*) serverip
{
    m_ServerIP = serverip;
}

- (void) SetServerPort: (NSString*) serverPort
{
    m_ServerPort = serverPort;
}

- (void) SetCallID: (NSString*) callID
{
    m_CallID = callID;
}

- (void) SetResID: (NSString*) resID
{
    m_ResID = resID;
}

- (void) SetState: (NSString*) state
{
    //nothing
    [self VideoPlay];
}

- (void) VideoPlay
{
    m_ServerIP = @"192.168.0.87";
    m_ServerPort = @"7002";
    m_CallID = @"144115256795332612";
    m_ResID = @"1";
    NSLog(@"ip:%@ port:%@ call:%@ res:%@", m_ServerIP, m_ServerPort, m_CallID, m_ResID);
    //播放
    if (0 != [[MClient instance] Connect:m_ServerIP port:[m_ServerPort intValue]])
    {
      NSLog(@"Connect failed.");
    }
    if (0 != [[MClient instance] OpenStream:0 callid:[m_CallID longLongValue] resid:[m_ResID intValue] dispose: self])
    {
      NSLog(@"OpenStream failed.");
    }
    [[NPlayer instance] Start];
    [[NPlayer instance] OpenStream:self];
    [[NPlayer instance] Play:0];
}

- (void) VideoStop
{
    //停止
    [[NPlayer instance] Stop:0];
    [[NPlayer instance] Close:0];
    [[MClient instance] CloseStream:0];
}

//接口失败(ifid见接口说明)
- (void) PlayFailed : (ePlayerFailed) ifid : (NSError*) error
{
  NSLog(@"PlayFailed ifid:%i error:%@", ifid, error);
}

- (void) show_image:(UIImage*)image
{
    self.image = image;
    /*if (m_VideoOrientation) {
      UIImage *newimage = [self image:image rotation:UIImageOrientationRight];
      self.image = newimage;
    }else{
      self.image = image;
    }*/
}

- (void) ReceiveStream: (int) stream buffer: (unsigned char*) buffer length: (long) length
{
    NSLog(@"recv stream: %li", length);
    unsigned char FrameType = 0;
    long Pos = 22;
    memcpy(&FrameType, buffer + sizeof(long), sizeof(FrameType));
    if (0x08 == FrameType) {
      Pos = 18;
    }
    [[NPlayer instance] Input:0 buffer:buffer + Pos length:length - Pos];
    //fwrite((const void *)buffer, length, 1, file);
}

@end
