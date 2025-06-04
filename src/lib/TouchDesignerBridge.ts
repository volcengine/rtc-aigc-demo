/**
 * TouchDesigner WebSocket 通信桥接
 * 用于将语音对话的文本消息实时发送给 TouchDesigner 进行可视化
 */

import logger from '@/utils/logger';

export interface MessageData {
  type: 'user_message' | 'ai_message' | 'status_update' | 'audio_data';
  text?: string;
  user?: string;
  timestamp?: number;
  definite?: boolean;
  paragraph?: boolean;
  isInterrupted?: boolean;
  // 音频数据相关
  volume?: number;
  spectrum?: number[];
  // 状态相关
  status?: 'speaking' | 'listening' | 'thinking' | 'idle';
}

class TouchDesignerBridge {
  private ws: WebSocket | null = null;

  private reconnectAttempts = 0;

  private maxReconnectAttempts = 5;

  private reconnectInterval = 3000;

  private isConnecting = false;

  constructor(private url: string = 'ws://localhost:50604') {
    this.connect();
  }

  private connect(): void {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    logger.log('🔗 [TouchDesigner] 尝试连接...', { url: this.url });

    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        logger.log('✅ [TouchDesigner] 连接成功');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        
        // 发送连接确认消息
        this.send({
          type: 'status_update',
          status: 'idle',
          timestamp: Date.now()
        });
      };

      this.ws.onclose = (event) => {
        logger.log('❌ [TouchDesigner] 连接关闭', { code: event.code, reason: event.reason });
        this.isConnecting = false;
        this.ws = null;
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        logger.error('🚨 [TouchDesigner] 连接错误', error);
        this.isConnecting = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          logger.log('📨 [TouchDesigner] 收到消息', data);
          // 可以在这里处理来自 TouchDesigner 的消息
        } catch (error) {
          logger.error('🚨 [TouchDesigner] 消息解析失败', error);
        }
      };

    } catch (error) {
      logger.error('🚨 [TouchDesigner] 创建连接失败', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('🚨 [TouchDesigner] 达到最大重连次数，停止重连');
      return;
    }

    this.reconnectAttempts++;
    logger.log(`🔄 [TouchDesigner] ${this.reconnectInterval / 1000}秒后尝试第${this.reconnectAttempts}次重连...`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  /**
   * 发送消息到 TouchDesigner
   */
  public send(data: MessageData): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      logger.warn('⚠️ [TouchDesigner] WebSocket 未连接，消息未发送', data);
      return;
    }

    try {
      const message = JSON.stringify(data);
      this.ws.send(message);
      logger.debug('📤 [TouchDesigner] 消息已发送', data);
    } catch (error) {
      logger.error('🚨 [TouchDesigner] 发送消息失败', error);
    }
  }

  /**
   * 发送用户消息
   */
  public sendUserMessage(text: string, user: string, options: Partial<MessageData> = {}): void {
    this.send({
      type: 'user_message',
      text,
      user,
      timestamp: Date.now(),
      ...options
    });
  }

  /**
   * 发送AI消息
   */
  public sendAIMessage(text: string, user: string, options: Partial<MessageData> = {}): void {
    this.send({
      type: 'ai_message',
      text,
      user,
      timestamp: Date.now(),
      ...options
    });
  }

  /**
   * 发送状态更新
   */
  public sendStatusUpdate(status: MessageData['status']): void {
    this.send({
      type: 'status_update',
      status,
      timestamp: Date.now()
    });
  }

  /**
   * 发送音频数据
   */
  public sendAudioData(volume: number, spectrum?: number[]): void {
    this.send({
      type: 'audio_data',
      volume,
      spectrum,
      timestamp: Date.now()
    });
  }

  /**
   * 检查连接状态
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * 手动重连
   */
  public reconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
    this.reconnectAttempts = 0;
    this.connect();
  }

  /**
   * 关闭连接
   */
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // 防止自动重连
  }
}

// 单例实例
export const touchDesignerBridge = new TouchDesignerBridge();

export default TouchDesignerBridge;
