//
//  MClient.h
//  MClient
//
//  Created by CSSTWH on 15/12/9.
//  Copyright (c) 2015年 csst. All rights reserved.
//

#import <Foundation/Foundation.h>

//流媒体协议(应用实现)
@protocol MStream <NSObject>

@required
/*接口功能: 接收流回调
 接口参数: stream: 流索引
 接口参数: buffer: 流媒体数据
 接口参数: length: 流媒体数据长度
 返回说明: 无
 */
-(void) ReceiveStream: (int) stream buffer: (unsigned char*) buffer length: (int) length;

@end


//客户端接口
@interface MClient : NSObject

/*接口功能：获取客户端实例
 接口参数：无
 接口返回：客户端实例
 */
+ (MClient*) instance;

/*接口功能: 连接服务器
 接口参数: server: 服务器地址
 接口参数: port: 服务器端口
 返回说明: 流索引
 */
-(int) Connect : (NSString*) server port:(int) port;

/*接口功能: 打开流通道
 接口参数: stream: 流索引
 接口参数: callid: 连接索引
 接口参数: resid: 资源索引
 接口参数: dispose: 流处理器（实现MAVSStream协议）
 返回说明: 返回0表示连接成功, 返回值小于0表示失败，负值表示错误码
 */
-(int) OpenStream: (int) stream callid:(long long) callid resid:(int) resid dispose: (id) dispose;

/*接口功能: 关闭流通道
 接口参数: stream: 流索引
 返回说明: 无
 */
-(void) CloseStream: (int) stream;

@end
