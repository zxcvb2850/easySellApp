//
//  VideoView.m
//  Test
//
//  Created by CSSTWH on 2018/11/2.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "VideoView.h"

@implementation VideoView
{
    NSString *m_ServerIP;
    NSString *m_ServerPort;
    NSString *m_CallID;
    NSString *m_ResID;
    NSString *m_CaptureImage;
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
    //m_ServerIP = serverip;
  [self SetCaptureImage:serverip];
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
  if(resID != nil){
    [self VideoStop];
  }
}

- (void) SetState: (NSString*) state
{
    //nothing
    NSError *error = nil;
    NSData *stream = [state dataUsingEncoding:NSUTF8StringEncoding];
    if (nil == stream) {
      return;
    }
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:stream options:NSJSONReadingMutableContainers error:&error];
    if (dic == nil) {
      return;
    }
    m_ServerIP = dic[@"server"];
    m_ServerPort = dic[@"port"];
    m_CallID = dic[@"callid"];
    m_ResID = dic[@"resid"];
  
    [self VideoPlay];
}

- (void) SetCaptureImage: (NSString*) path
{
    m_CaptureImage = path;
  /*NSDateFormatter *nsdf2=[[NSDateFormatter alloc] init];
   [nsdf2 setDateStyle:NSDateFormatterShortStyle];
   [nsdf2 setDateFormat:@"yyyy-MM-dd_HH-mm-ss"];
   NSString *date=[nsdf2 stringFromDate:[NSDate date]];
  //创建目录
  NSFileManager *fm = [NSFileManager defaultManager];
   //获取当前目录
   NSString *currentDirectory = NSTemporaryDirectory();
   NSString *imageDirectory = [[NSString alloc] initWithFormat:@"%@/image", currentDirectory];
   NSError *errInfo = nil;
   //创建新目录
   BOOL isDirectory = YES;
   if (![fm fileExistsAtPath:imageDirectory isDirectory:&isDirectory]) {
   if (![fm createDirectoryAtPath:imageDirectory withIntermediateDirectories:YES attributes:nil error:&errInfo]) {
   NSLog(@"%@ create directory failed:%@", imageDirectory, errInfo);
   return;
   }
   }
  //NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  //NSString *imageDirectory1 = [paths objectAtIndex:0];
  //图片目录
  NSString *imagePath = [[NSString alloc] initWithFormat:@"%@/%@.jpg", imageDirectory, date];
  m_CaptureImage = imagePath;*/
}

- (void) VideoPlay
{
    /*m_ServerIP = @"192.168.0.66";
    m_ServerPort = @"7002";
    m_CallID = @"144115269680234505";
    m_ResID = @"7";*/
    m_CaptureImage = nil;
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
  if (nil != m_CaptureImage) {
    /*NSDateFormatter *nsdf2=[[NSDateFormatter alloc] init];
    [nsdf2 setDateStyle:NSDateFormatterShortStyle];
    [nsdf2 setDateFormat:@"yyyy-MM-dd_HH-mm-ss"];
    NSString *date=[nsdf2 stringFromDate:[NSDate date]];*/
    //创建目录
    /*NSFileManager *fm = [NSFileManager defaultManager];
     //获取当前目录
     NSString *currentDirectory = NSHomeDirectory();
     NSString *imageDirectory = [[NSString alloc] initWithFormat:@"%@/image", currentDirectory];
     NSError *errInfo = nil;
     //创建新目录
     BOOL isDirectory = YES;
     if (![fm fileExistsAtPath:imageDirectory isDirectory:&isDirectory]) {
     if (![fm createDirectoryAtPath:imageDirectory withIntermediateDirectories:YES attributes:nil error:&errInfo]) {
     NSLog(@"%@ create directory failed:%@", imageDirectory, errInfo);
     return;
     }
     }*/
    //NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    //NSString *imageDirectory = [paths objectAtIndex:0];
    //图片目录
    //NSString *imagePath = [[NSString alloc] initWithFormat:@"%@/%@_%@.jpg", imageDirectory, m_StreamName, date];
    NSString *imagePath = m_CaptureImage;
    NSLog(@"capture image : %@", imagePath);
    [UIImageJPEGRepresentation(image, 1.0) writeToFile:imagePath atomically:YES];
    m_CaptureImage = nil;
  }
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
