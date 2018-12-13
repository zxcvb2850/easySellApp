//
//  NPlayer.h
//  NPlayer
//
//  Created by CSSTWH on 15/11/27.
//  Copyright (c) 2015年 csst. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

//错误码
typedef enum ePlayerFailed
{
    ePlayerFailedOpenStream = 0,            //OpenStream Failed
    ePlayerFailedPlay,                      //Play Failed
    ePlayerFailedInput,                     //Input Failed
} ePlayerFailed;

//流播放事件协议
@protocol NPlayerEvent <NSObject>

@required

/**
 * 显示图片，用于播放器输出图片给委托对象
 *
 * @param image:        要显示的图片
 *
 */
- (void) show_image:(UIImage*)image;

//接口失败(ifid见接口说明)
- (void) PlayFailed : (ePlayerFailed) ifid : (NSError*) error;

@end


//播放
@interface NPlayer : NSObject

/*接口功能：获取流播放实例
 接口参数：无
 接口返回：流播放实例
 */
+ (NPlayer*) instance;

/*接口功能：启动
 接口参数：无
 接口返回：0表示成功，其它表示错误码
 */
- (int) Start;

/*接口功能：停止
 接口参数：无
 接口返回：无
 */
- (void) Stop;

/*接口功能：打开流
 接口索引：1
 接口参数：delegate：代理对象
 接口返回：大于等于0表示pid，负值表示错误码
 */
- (int) OpenStream : (id<NPlayerEvent>) delegate;

/*接口功能：关闭
 接口参数：pid：pid
 接口返回：无
 */
- (void) Close: (int) pid;

/*接口功能：播放
 接口索引：2
 接口参数：pid：pid
 接口返回：0表示成功，其它表示错误码
 */
- (int) Play: (int) pid;

/*接口功能：停止
 接口参数：pid：pid
 接口返回：0表示成功，其它表示错误码
 */
- (int) Stop: (int) pid;

/*接口功能：加入数据(流模式下使用)
 接口索引：3
 接口参数：pid：pid
 接口返回：0表示成功，其它表示错误码
 */
- (int) Input: (int) pid buffer : (unsigned char*)buffer length : (long) length;

@end