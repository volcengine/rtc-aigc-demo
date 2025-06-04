"""
TouchDesigner WebSocket 接收端示例
在 TouchDesigner 中创建一个 Web Server DAT，并将此脚本设置为其回调处理脚本

配置 Web Server DAT:
- Protocol: WebSocket
- Local Port: 8080
- Enable WebSocket: On
- Callbacks: 设置为此脚本所在的 DAT

此脚本将接收来自 Web 端的语音对话消息和状态更新，
并可以驱动相应的可视化效果。
"""

import json

# 全局变量来存储当前状态
current_status = 'idle'
last_message = ''
last_user = ''
current_volume = 0
current_spectrum = []

def onWebSocketReceiveText(dat, data, peer):
    """
    接收 WebSocket 文本消息的回调函数
    
    Args:
        dat: Web Server DAT 对象
        data: 接收到的文本数据
        peer: 客户端信息
    """
    global current_status, last_message, last_user, current_volume, current_spectrum
    
    try:
        # 解析 JSON 消息
        message = json.loads(data)
        message_type = message.get('type', '')
        
        print(f"📨 收到消息类型: {message_type}")
        
        if message_type == 'user_message':
            # 用户消息
            handle_user_message(message)
            
        elif message_type == 'ai_message':
            # AI 消息
            handle_ai_message(message)
            
        elif message_type == 'status_update':
            # 状态更新
            handle_status_update(message)
            
        elif message_type == 'audio_data':
            # 音频数据
            handle_audio_data(message)
            
    except json.JSONDecodeError as e:
        print(f"❌ JSON 解析失败: {e}")
    except Exception as e:
        print(f"❌ 处理消息失败: {e}")

def handle_user_message(message):
    """处理用户消息"""
    global last_message, last_user
    
    text = message.get('text', '')
    user = message.get('user', '')
    definite = message.get('definite', False)
    paragraph = message.get('paragraph', False)
    
    last_message = text
    last_user = user
    
    print(f"👤 用户消息: {text}")
    
    # 更新 TouchDesigner 中的文本显示
    update_text_display(text, 'user')
    
    # 触发用户消息可视化效果
    trigger_user_visual_effect(text, definite, paragraph)

def handle_ai_message(message):
    """处理 AI 消息"""
    global last_message, last_user
    
    text = message.get('text', '')
    user = message.get('user', '')
    definite = message.get('definite', False)
    paragraph = message.get('paragraph', False)
    is_interrupted = message.get('isInterrupted', False)
    
    last_message = text
    last_user = user
    
    print(f"🤖 AI 消息: {text}")
    
    # 更新 TouchDesigner 中的文本显示
    update_text_display(text, 'ai')
    
    # 触发 AI 消息可视化效果
    trigger_ai_visual_effect(text, definite, paragraph, is_interrupted)

def handle_status_update(message):
    """处理状态更新"""
    global current_status
    
    status = message.get('status', 'idle')
    current_status = status
    
    print(f"🔄 状态更新: {status}")
    
    # 根据状态更新可视化效果
    if status == 'speaking':
        trigger_ai_speaking_effect()
    elif status == 'listening':
        trigger_listening_effect()
    elif status == 'thinking':
        trigger_thinking_effect()
    elif status == 'idle':
        trigger_idle_effect()

def handle_audio_data(message):
    """处理音频数据"""
    global current_volume, current_spectrum
    
    volume = message.get('volume', 0)
    spectrum = message.get('spectrum', [])
    
    current_volume = volume
    current_spectrum = spectrum
    
    # 更新音频可视化
    update_audio_visualization(volume, spectrum)

def update_text_display(text, speaker_type):
    """更新文本显示"""
    try:
        # 假设有一个 Text TOP 用于显示消息
        text_top = op('message_display')
        if text_top:
            # 根据说话者类型设置不同的颜色
            if speaker_type == 'user':
                text_top.par.text = f"User: {text}"
                # 设置用户消息颜色（蓝色）
                text_top.par.fontcolorr = 0.2
                text_top.par.fontcolorg = 0.6
                text_top.par.fontcolorb = 1.0
            else:
                text_top.par.text = f"AI: {text}"
                # 设置 AI 消息颜色（绿色）
                text_top.par.fontcolorr = 0.2
                text_top.par.fontcolorg = 1.0
                text_top.par.fontcolorb = 0.3
    except:
        print("⚠️ 更新文本显示失败")

def trigger_user_visual_effect(text, definite, paragraph):
    """触发用户消息的可视化效果"""
    try:
        # 示例：触发用户输入的粒子效果
        particle_comp = op('user_particles')
        if particle_comp:
            # 根据消息长度调整粒子数量
            particle_count = min(len(text) * 2, 1000)
            particle_comp.par.count = particle_count
            
            # 如果是完整句子，触发爆发效果
            if definite or paragraph:
                particle_comp.par.birthrate = 100
                # 1秒后恢复正常
                run("op('user_particles').par.birthrate = 10", delayFrames=30)
    except:
        print("⚠️ 触发用户可视化效果失败")

def trigger_ai_visual_effect(text, definite, paragraph, is_interrupted):
    """触发 AI 消息的可视化效果"""
    try:
        # 示例：AI 响应的光环效果
        ai_visual = op('ai_visual')
        if ai_visual:
            # 根据消息长度调整效果强度
            intensity = min(len(text) / 50.0, 1.0)
            ai_visual.par.intensity = intensity
            
            # 如果被打断，显示特殊效果
            if is_interrupted:
                ai_visual.par.colorr = 1.0  # 红色表示被打断
                ai_visual.par.colorg = 0.3
                ai_visual.par.colorb = 0.3
            else:
                ai_visual.par.colorr = 0.3  # 正常绿色
                ai_visual.par.colorg = 1.0
                ai_visual.par.colorb = 0.3
    except:
        print("⚠️ 触发 AI 可视化效果失败")

def trigger_ai_speaking_effect():
    """AI 说话状态的视觉效果"""
    try:
        # 启动说话状态的动画
        speaking_anim = op('speaking_animation')
        if speaking_anim:
            speaking_anim.par.play = True
            
        # 调整整体场景亮度
        scene_light = op('main_light')
        if scene_light:
            scene_light.par.dimmer = 0.8
    except:
        print("⚠️ 触发 AI 说话效果失败")

def trigger_listening_effect():
    """监听状态的视觉效果"""
    try:
        # 启动监听状态的脉冲效果
        listening_pulse = op('listening_pulse')
        if listening_pulse:
            listening_pulse.par.amplitude = 0.5
            
        # 调整整体场景为蓝色调
        scene_light = op('main_light')
        if scene_light:
            scene_light.par.colorr = 0.3
            scene_light.par.colorg = 0.6
            scene_light.par.colorb = 1.0
    except:
        print("⚠️ 触发监听效果失败")

def trigger_thinking_effect():
    """思考状态的视觉效果"""
    try:
        # 启动思考状态的旋转效果
        thinking_rotation = op('thinking_rotation')
        if thinking_rotation:
            thinking_rotation.par.speed = 2.0
            
        # 调整整体场景为橙色调
        scene_light = op('main_light')
        if scene_light:
            scene_light.par.colorr = 1.0
            scene_light.par.colorg = 0.7
            scene_light.par.colorb = 0.2
    except:
        print("⚠️ 触发思考效果失败")

def trigger_idle_effect():
    """空闲状态的视觉效果"""
    try:
        # 恢复默认状态
        default_anim = op('default_animation')
        if default_anim:
            default_anim.par.play = True
            
        # 恢复默认光照
        scene_light = op('main_light')
        if scene_light:
            scene_light.par.colorr = 1.0
            scene_light.par.colorg = 1.0
            scene_light.par.colorb = 1.0
            scene_light.par.dimmer = 0.6
    except:
        print("⚠️ 触发空闲效果失败")

def update_audio_visualization(volume, spectrum):
    """更新音频可视化"""
    try:
        # 更新音量表
        volume_meter = op('volume_meter')
        if volume_meter:
            volume_meter.par.value0 = volume / 255.0  # 归一化到 0-1
            
        # 更新频谱显示
        if spectrum and len(spectrum) > 0:
            spectrum_viz = op('spectrum_viz')
            if spectrum_viz:
                # 将频谱数据写入 CHOP 或 DAT
                for i, freq_value in enumerate(spectrum):
                    if i < 32:  # 限制为前32个频段
                        # 这里需要根据实际的 TouchDesigner 网络结构调整
                        channel_name = f'freq_{i:02d}'
                        # spectrum_viz.chan(channel_name).val = freq_value / 255.0
    except:
        print("⚠️ 更新音频可视化失败")

def onWebSocketReceiveBytes(dat, data, peer):
    """
    接收 WebSocket 二进制消息的回调函数
    （如果需要传输音频数据等二进制内容时使用）
    """
    print(f"📦 收到二进制数据，大小: {len(data)} 字节")

def onWebSocketOpen(dat, peer):
    """WebSocket 连接建立时的回调"""
    print(f"🔗 WebSocket 连接已建立: {peer}")

def onWebSocketClose(dat, peer):
    """WebSocket 连接关闭时的回调"""
    print(f"❌ WebSocket 连接已关闭: {peer}")

# 辅助函数：获取当前状态信息（可在其他地方调用）
def get_current_status():
    """获取当前状态信息"""
    return {
        'status': current_status,
        'last_message': last_message,
        'last_user': last_user,
        'volume': current_volume,
        'spectrum_length': len(current_spectrum)
    }

# 使用示例：
# 在 TouchDesigner 中，可以通过以下方式获取状态：
# status_info = op('websocket_handler').get_current_status()
# print(status_info)
