<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- AI助手信息 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image :src="iconUrl1" style="width: 25px; height: 25px" />
        </div>
        <h3 class="assistant-name">宁渡AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
          在线服务中
        </div>
      </div>

      <!-- 情绪花园 -->
      <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">情绪花园</div>
        </div>
        <!-- 情绪信息 -->
        <div class="emotion-info">
          <div class="emotion-name">中性</div>
          <div class="emotion-score">50</div>
        </div>
        <div class="warm-tips">
          <!-- 情绪状态文本 -->
          <div class="emotion-status-text">
            <span class="status-label">今天感觉</span>
            <span class="status-emotion">{{
              currentEmotion.isNegative ? "需要关注" : "很不错"
            }}</span>
          </div>
          <!-- 情绪强度等级（小圆点） -->
          <div class="emotion-intensity">
            <span class="intensity-dots">
              <span
                v-for="dot in 3"
                :key="dot"
                class="dot"
                :class="{
                  active: getIntensityClass(currentEmotion.emotionScore) >= dot,
                }"
              ></span>
            </span>
            <span class="intensity-text">
              {{ getRiskText(currentEmotion.riskLevel) }}
            </span>
          </div>
          <!-- 温暖建议卡片 -->
          <div v-if="currentEmotion.suggestion" class="warm-suggestion">
            <div class="suggestion-icon">💝</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你的小建议</div>
              <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
            </div>
          </div>
          <!-- 治愈小行动 -->
          <div
            class="healing-actions"
            v-if="currentEmotion.improvementSuggestions.length > 0"
          >
            <div class="actions-title">治愈小行动</div>
            <div class="actions-list">
              <div
                v-for="action in currentEmotion.improvementSuggestions"
                :key="action"
                class="action-item"
              >
                <div class="action-icon">✨</div>
                <div class="action-text">{{ action }}</div>
              </div>
            </div>
          </div>
          <!-- 风险提示 -->
          <div
            class="risk-notice"
            v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1"
          >
            <div class="notice-icon">🔔</div>
            <div class="notice-content">
              <div class="notice-title">温馨提示</div>
              <div class="notice-text">
                {{ currentEmotion.riskDescription }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 会话列表 -->
      <div class="session-history">
        <h4 class="section-title">会话列表</h4>
        <div class="session-list">
          <div
            class="session-item"
            v-for="session in sessionList"
            :key="session.id"
            @click="handleSessionClick(session)"
          >
            <div class="session-info">
              <div class="session-title">
                <span>{{ session.sessionTitle }}</span>
                <div class="session-meta">
                  <span class="session-time">{{ session.startedAt }}</span>
                </div>
                <div class="session-preview">
                  {{ session.lastMessageContent }}
                </div>
                <div class="session-stats">
                  <span>
                    <el-icon><ChatRound /></el-icon>
                    {{ session.messageCount || 0 }}
                  </span>
                  <span>
                    <el-icon><Clock /></el-icon>
                    {{ session.durationMinutes || 0 }} 分钟
                  </span>
                </div>
              </div>
              <div class="session-actions">
                <el-button
                  text
                  type="danger"
                  @click="handleDeleteSession(session.id)"
                >
                  <el-icon><DeleteFilled /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天主区域 -->
    <div class="chat-main">
      <!-- 聊天头区域 -->
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image :src="iconUrl2" style="width: 30px; height: 30px" />
          </div>
          <div class="chat-info">
            <h2>宁渡AI助手</h2>
            <p>您的贴心AI心理健康助手</p>
          </div>
        </div>
        <el-button circle @click="createNewFrontendSession" title="新建会话">
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>

      <!-- 聊天内容区域 -->
      <div class="chat-messages" ref="messageListRef">
        <!-- 没数据时展示欢迎用语 -->
        <div class="message-item ai-message" v-if="message?.length === 0">
          <div class="message-avatar">
            <el-image :src="iconUrl1" style="width: 18px; height: 18px" />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              您好！我是小暖，您的AI心理健康助手，很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>

        <!-- 有数据时展示消息列表 -->
        <div
          class="message-item"
          v-for="msg in message"
          :key="msg.id"
          :class="msg.senderType === 1 ? 'user-message' : 'ai-message'"
        >
          <div class="message-avatar">
            <el-image
              v-if="msg.senderType === 1"
              style="width: 18px; height: 18px"
              :src="iconUrl3"
            />
            <el-image
              v-if="msg.senderType === 2"
              style="width: 18px; height: 18px"
              :src="iconUrl1"
            />
          </div>

          <!-- 消息主体 -->
          <div class="message-content">
            <!-- 消息内的文字内容 -->
            <div class="message-bubble">
              <!-- AI助手思考中时展示的点点 -->
              <div
                v-if="msg.senderType === 2 && isAiTyping && msg.content === ''"
                class="typing-indicator"
              >
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
              <!-- AI错误提示 -->
              <!-- msg.isError是后端返回的错误提示 -->
              <!-- mes.isError为true表示出错 -->
              <div v-else-if="msg.isError" class="error-message">
                <p>{{ msg.content }}</p>
              </div>
              <!-- AI正常返回消息 -->
              <MarkdownRenderer
                v-else-if="msg.senderType === 2 && !msg.isError"
                :content="msg.content"
                :isAiMessage="true"
              />
              <!-- 用户发的消息 -->
              <p
                v-else-if="msg.content"
                v-html="formatMessageContent(msg.content)"
              ></p>
            </div>
            <!-- 消息发送时间 -->
            <div class="message-time">
              {{
                msg.senderType === 2 && isAiTyping
                  ? "正在输入中..."
                  : msg.createdAt
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- 消息输入框 -->
      <div class="chat-input">
        <!-- 左侧输入框 -->
        <div class="input-container">
          <!-- v-model="userMessage" 用户输入时，自动更新userMessage的值 -->
          <el-input
            v-model="userMessage"
            placeholder="请输入你想要分享的内容..."
            type="textarea"
            :rows="3"
            :disabled="isAiTyping"
            @keydown="handleKeyDown"
            class="message-input"
            clearable
          ></el-input>
          <div class="input-footer">
            <span>按Enter发送消息，Shift+Enter换行</span>
            <span>{{ userMessage.length }}/500</span>
          </div>
        </div>
        <!-- 右侧发送按钮 -->
        <!-- disabled禁用按钮：用户输入为空或超过500个字符 -->
        <el-button
          :disabled="!userMessage.trim() || userMessage.length > 500"
          type="primary"
          class="send-btn"
          @click="sendMessage"
        >
          <el-icon><Promotion /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  startSession,
  getSessionList,
  deleteSession,
  getSessionDetail,
  getSessionEmotion,
} from "@/api/frontend";
import { ElMessage } from "element-plus";
import { Clock } from "@element-plus/icons-vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { nextTick } from "vue";

const iconUrl1 = new URL("@/assets/images/robot-fill.png", import.meta.url)
  .href;
const iconUrl2 = new URL("@/assets/images/like.png", import.meta.url).href;
const iconUrl3 = new URL("@/assets/images/users.png", import.meta.url).href;

//当前正在看的会话（聊天框内展示的会话）
const currentSession = ref(null);
//左侧会话列表
const sessionList = ref([]);
//当前会话（聊天框里的会话）的所有消息历史（数据是一条一条的，用数组合适）
const message = ref([]);
//输入框里的文字（和input-model绑定了）
const userMessage = ref("");
//AI是否正在输入
const isAiTyping = ref(false);

//新建会话（点击+号和挂载时调用）
//只是在前端造了一个假会话，后端还不知道。只有用户真正发消息之后才会去后端创建。
//所以id是一个临时的id
const createNewFrontendSession = () => {
  //创建一个新的会话对象（前端展示的会话信息）
  const newSession = {
    //每个会话都必须有一个唯一标识（ID）
    //Date.now()生成一个时间戳
    sessionId: `temp_${Date.now()}`,
    status: "TEMP",
    sessionTitle: "新对话",
  };
  //将新会话对象赋值给当前正在对话的会话对象
  currentSession.value = newSession;
  //清空聊天框的消息列表
  message.value = [];
  //清空输入框
  userMessage.value = "";
};

//处理键盘事件
const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

//发送消息
const sendMessage = () => {
  //如果用户输入的消息为空，直接返回
  if (!userMessage.value.trim()) return;

  //如果AI助手正在输入中，直接返回
  if (isAiTyping.value) {
    ElMessage.error("AI助手正在输入中，请稍后");
    return;
  }

  //获取用户输入的消息
  const userMsg = userMessage.value.trim();
  //清空输入框
  userMessage.value = "";
  //如果没有会话或是临时会话（AI显示默认提示词），就需要调后端接口创建一个新的会话
  if (currentSession.value.status === "TEMP") {
    startNewSession(userMsg);
  } else {
    //如果是正式会话，则直接调用开始流式对话函数
    //把用户消息加到message消息列表里
    message.value.push({
      id: Date.now(), // 这个是消息ID，不是会话ID。后端还没保存这条消息，所以只能临时生成
      //这个id是给v-for用的：
      //<div v-for="msg in message" :key="msg.id">
      senderType: 1,
      content: userMsg,
      createAt: new Date().toISOString(),
    });
    //滚动到最底部
    scrollToBottom();
    startAIResponse(currentSession.value.sessionId, userMsg);
  }
};

//创建新会话（调用后端接口的函数）
const startNewSession = (userMsg) => {
  //构建会话参数
  const sessionParams = {
    initialMessage: userMsg,
  };
  //如果是新会话，则自动生成会话标题
  if (currentSession.value.sessionTitle === "新对话") {
    sessionParams.sessionTitle = `宁渡AI助手-${new Date().toLocaleString()}`;
  } else {
    //如果是历史会话记录（已有会话标题），则直接使用原会话标题
    sessionParams.sessionTitle = currentSession.value.sessionTitle;
  }
  //调用后端接口创建新会话
  startSession(sessionParams).then((res) => {
    //拿到后端的真实id，更新前端会话临时id对象
    const sessionData = {
      sessionId: res.sessionId,
      status: res.status,
      sessionTitle: sessionParams.sessionTitle,
    };
    // 当前是临时会话 → 在原对象上更新字段，不换对象
    if (currentSession.value && currentSession.value.status === "TEMP") {
      Object.assign(currentSession.value, sessionData);
    } else {
      // 已经是正式会话 → 直接换成新对象
      currentSession.value = sessionData;
    }
    //创建新会话后，刷新会话列表
    getSessionPage();
    //添加初始用户消息
    message.value.push({
      id: Date.now(),
      senderType: 1,
      content: userMsg,
      createAt: new Date().toISOString(),
    });
    //创建新会话后，开始流式对话
    //这里的userMsg是startNewSession函数调用时传的参数，往上看其实就是userMessage去掉空格后
    startAIResponse(currentSession.value.sessionId, userMsg);
  });
};

//开始流式对话
const startAIResponse = (sessionId, userMessage) => {
  //防止重复发送
  if (isAiTyping.value) {
    ElMessage.error("AI助手正在输入中，请稍后");
    return;
  }
  //设置AI助手正在输入中
  isAiTyping.value = true;

  // aiMessage是一个临时消息对象，用于在UI上立即显示"AI正在输入"的状态
  const aiMessage = {
    // 流式对话开始时，AI的第一条回复还没有被后端保存，所以还没有后端ID
    id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    senderType: 2,
    //当content为空时，显示三个小圆点，表示AI正在输入中
    content: "",
    createAt: new Date().toISOString(),
  };
  //将aiMessage添加到消息数组中
  message.value.push(aiMessage);

  //调用流式接口
  const ctrl = new AbortController(); //AbortController是专门用来中止fetch请求的，会返回一个实例
  //fetchEventSource接收2个参数，第一个是接口地址，第二个是请求参数
  fetchEventSource("/api/psychological-chat/stream", {
    method: "POST",
    headers: {
      //告诉后端服务器：前端发送的数据是JSON格式
      "Content-Type": "application/json",
      // 不是axios，所以需要手动添加token到headers中
      Token: localStorage.getItem("token"),
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      sessionId,
      userMessage,
    }),
    //把控制器绑定到请求上，ctrl.abort()就能中断请求了
    signal: ctrl.signal,
    // 连接刚建立时触发一次，可以在这里检查连接是否正常
    onopen: (response) => {
      console.log(response);
      if (response.headers.get("content-type") !== "text/event-stream") {
        ElMessage.error("后端返回的不是流式数据");
      }
    },
    // 后端每推一段数据就触发一次
    onmessage: (event) => {
      console.log(event);
      // event.data 就是后端推来的那段数据
      const raw = event.data.trim();
      if (!raw) return; //空数据跳过
      // event.event是事件类型，后端发"done"表示结束
      const eventName = event.event;
      //获取到当前会话的AI消息
      const aiMessage = message.value[message.value.length - 1];
      if (eventName === "done") {
        //AI输入完毕
        isAiTyping.value = false;
        //中止fetch请求
        ctrl.abort();
        //开始情绪分析
        loadSessionEmotion(currentSession.value.sessionId);
        return;
      }
      //把后端推来的JSON字符串转成对象
      const payload = JSON.parse(raw);
      const ok = String(payload.code) === "200";
      if (ok && payload.data && payload.data.content) {
        aiMessage.content += payload.data.content;
        //滚动到最底部
        scrollToBottom();
      } else if (!ok) {
        //错误回复显示
        handleError(payload.message || "AI回复失败");
      }
    },
    onError: (err) => {
      handleError(err || "AI回复失败");
      throw err;
    },
    // 连接关闭时触发
    onClose: () => {
      //开始情绪分析
      loadSessionEmotion(currentSession.value.sessionId);
    },
  });
};
//错误回复显示
const handleError = (error) => {
  //获取到当前会话的AI消息
  const aiMessage = message.value[message.value.length - 1];
  if (aiMessage) {
    aiMessage.content = "AI回复失败，请重试";
  }
  isAiTyping.value = false;
  ElMessage.error("AI回复失败，请重试");
};

//获取会话列表
const getSessionPage = () => {
  getSessionList({
    pageNum: 1,
    pageSize: 10,
  }).then((res) => {
    console.log(res);
    sessionList.value = res.records;
  });
};

//获取会话数据（点击会话列表项时把点击的会话赋值给当前正在对话的会话对象展示在大屏幕上）
const handleSessionClick = (session) => {
  console.log(session, "session");
  //点击会话时，获取会话详情
  getSessionDetail(session.id).then((res) => {
    console.log(res);
    message.value = res;
  });
  //点击会话时，获取会话情绪分析结果
  loadSessionEmotion(session.id);
  //更新当前会话对象的数据
  const sessionData = {
    sessionId: "session_" + session.id,
    status: "ACTIVE",
    sessionTitle: session.sessionTitle,
  };
  //将当前会话对象赋值给点击的会话对象
  currentSession.value = sessionData;
};

//删除会话
const handleDeleteSession = (sessionId) => {
  //调用后端接口删除会话
  deleteSession(sessionId).then(() => {
    ElMessage.success("删除成功");
    //删除成功后，刷新会话列表
    getSessionPage();
    if (currentSession.value?.sessionId === "session_" + sessionId) {
      createNewFrontendSession();
    }
  });
};

//格式化消息内容（处理用户发送的消息格式）（简单的换行逻辑）
const formatMessageContent = (content) => {
  return content.replace(/\n/g, "<br>");
};

//加滚动逻辑
const messageListRef = ref(null);
const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
    }
  });
};

//情绪花园
const currentEmotion = ref({
  primaryEmotion: "中性",
  emotionScore: 50,
  isNegative: false,
  riskLevel: 0,
  suggestion: "保持正常情绪状态",
  improvementSuggestions: [],
});

//获取会话情绪分析结果
const loadSessionEmotion = (sessionId) => {
  //确保sessionId格式正确
  const id = sessionId.toString().startsWith("session_")
    ? sessionId
    : `session_${sessionId}`;
  getSessionEmotion(id).then((res) => {
    console.log(res);
    currentEmotion.value = res;
  });
};

//显示小圆点个数逻辑
const getIntensityClass = (score) => {
  if (score >= 61) {
    return 3;
  }
  if (score >= 31) {
    return 2;
  }
  return 1;
};

//显示风险等级文本逻辑
const getRiskText = (level) => {
  switch (level) {
    case 0:
      return "正常";
    case 1:
      return "关注";
    case 2:
      return "预警";
    case 3:
      return "危机";
    default:
      return "正常";
  }
};

//挂载时调用
onMounted(() => {
  //新建一个会话
  createNewFrontendSession();
  //获取会话列表
  getSessionPage();
});
</script>

<style scoped lang="scss">
.consultation-container {
  margin: 0 auto;
  width: 1200px;
  display: flex;
  gap: 20px;
  padding: 20px;
  .sidebar {
    width: 320px;
    .ai-assistant-info {
      margin-bottom: 20px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(255, 252, 248, 0.95) 100%
      );
      border-radius: 16px;
      padding: 16px;
      box-shadow:
        0 8px 32px rgba(251, 146, 60, 0.06),
        0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(251, 146, 60, 0.08);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      .breathing-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        animation: breathing 4s ease-in-out infinite;
        box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
        position: relative;
      }
      .assistant-name {
        font-size: 16px;
        font-weight: 700;
        background: linear-gradient(135deg, #fb923c, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        background-clip: text;
        margin: 0 0 12px;
      }
      .online-status {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #059669;
        font-size: 12px;
        font-weight: 600;
        .status-dot {
          width: 8px;
          height: 8px;
          background: #059669;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
        }
      }
    }
    .session-history {
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .session-list {
        overflow-y: auto;
        max-height: 200px;
        scrollbar-width: thin;
        scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
        .session-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          &:hover {
            background: #f8f9ff;
            border-color: #e6f0ff;
          }
          &.active {
            background: #e6f0ff;
            border-color: #4096ff;
          }
          .session-info {
            flex: 1;
            .session-title {
              font-weight: 500;
              font-size: 14px;
              color: #333;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              .session-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
                .session-time {
                  font-size: 12px;
                  color: #999;
                }
              }
              .session-preview {
                width: 200px;
                font-size: 12px;
                color: #666;
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .session-stats {
                display: flex;
                align-items: center;
                gap: 12px;
                span {
                  font-size: 12px;
                  color: #999;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
              }
            }
            .session-actions {
              position: absolute;
              top: 10px;
              right: 12px;
            }
          }
        }
        .no-sessions-text {
          text-align: center;
          font-size: 14px;
          color: #999;
        }
      }
    }
    .emotion-garden {
      background: linear-gradient(
        135deg,
        #fef9e7 0%,
        #fcf4e6 50%,
        #f6f0e8 100%
      );
      border-radius: 20px;
      padding: 16px;
      margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
      min-height: 300px;

      .garden-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;
        .garden-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #8b4513;
        }
      }
      .emotion-info {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.8);
        background: linear-gradient(
          135deg,
          #ff9a9e 0%,
          #fecfef 50%,
          #fecfef 100%
        );
        color: #fff;
        .emotion-name {
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 2px;
        }
        .emotion-score {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.9;
        }
      }
      .warm-tips {
        text-align: center;
        margin-bottom: 16px;
        .emotion-status-text {
          margin-bottom: 12px;
          .status-label {
            font-size: 14px;
            color: #8b7355;
            margin-right: 8px;
          }
          .status-emotion {
            font-size: 16px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 16px;
            display: inline-block;
          }
        }
        .emotion-intensity {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          .intensity-dots {
            display: flex;
            gap: 4px;
            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #e0e0e0;
              transition: all 0.3s ease;
              &.active {
                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                transform: scale(1.2);
                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
              }
            }
          }
          .intensity-text {
            font-size: 12px;
            color: #8b7355;
            font-weight: 500;
          }
        }
        .warm-suggestion {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.8)
          );
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          .suggestion-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .suggestion-content {
            text-align: left;
            flex: 1;
            .suggestion-title {
              font-size: 14px;
              font-weight: 600;
              color: #8b7355;
              margin-bottom: 6px;
            }
            .suggestion-text {
              font-size: 13px;
              color: #6b5b47;
              line-height: 1.5;
            }
          }
        }
        .healing-actions {
          margin-bottom: 16px;
          .actions-title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #8b7355;
            margin-bottom: 16px;
          }
          .actions-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .action-item {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.9),
                rgba(255, 255, 255, 0.7)
              );
              border-radius: 12px;
              padding: 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              border: 1px solid rgba(255, 255, 255, 0.5);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
              text-align: left;
              .action-icon {
                font-size: 14px;
                color: #ffd700;
                flex-shrink: 0;
              }
              .action-text {
                font-size: 12px;
                color: #6b5b47;
                line-height: 1.4;
                flex: 1;
              }
            }
          }
        }
        .risk-notice {
          background: linear-gradient(135deg, #fff9e6, #ffeaa7);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid rgba(255, 234, 167, 0.6);
          box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
          .notice-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .notice-content {
            flex: 1;
            .notice-title {
              font-size: 14px;
              font-weight: 600;
              color: #d4840f;
              margin-bottom: 6px;
            }
            .notice-text {
              font-size: 13px;
              color: #b8740c;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
  .chat-main {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 252, 250, 0.98) 100%
    );
    border-radius: 20px;
    box-shadow:
      0 12px 40px rgba(251, 146, 60, 0.08),
      0 4px 16px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(251, 146, 60, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    .chat-header {
      background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-shrink: 0;
      .header-left {
        display: flex;
        align-items: center;
        .chat-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
        }
        .chat-info {
          h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          p {
            font-size: 14px;
          }
        }
      }
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.02) 0%,
        rgba(255, 252, 248, 0.05) 100%
      );
      min-height: 0;
      max-height: calc(100vh - 200px);
      scrollbar-width: thin;
      scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
      .message-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }
        &.ai-message {
          .message-avatar {
            background: linear-gradient(135deg, #fb923c, #f59e0b);
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
          }
        }
        &.user-message {
          .message-avatar {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
          }
        }
        .message-content {
          max-width: 70%;
          .message-bubble {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 252, 248, 0.95) 100%
            );
            border-radius: 16px;
            padding: 12px 16px;
            position: relative;
            animation: fadeInUp 0.4s ease-out;
            border: 1px solid rgba(251, 146, 60, 0.1);
            box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
            .typing-indicator {
              display: flex;
              gap: 4px;
              padding: 8px 0;
              .typing-dot {
                width: 8px;
                height: 8px;
                background: #ccc;
                border-radius: 50%;
                animation: typing 1.5s ease-in-out infinite;
                &:nth-child(2) {
                  animation-delay: 0.2s;
                }
                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }
            /* 错误消息样式 */
            .error-message {
              background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
              border: 1px solid #f87171;
              border-radius: 12px;
              padding: 12px 16px;
              color: #991b1b;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
          .message-time {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
          }
        }
      }
    }
    .chat-input {
      border-top: 1px solid rgba(251, 146, 60, 0.1);
      padding: 20px 24px;
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 252, 248, 0.7) 100%
      );
      backdrop-filter: blur(10px);
      flex-shrink: 0;
      .input-container {
        flex: 1;
      }
      .input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #78716c;
        font-weight: 500;
      }
      .send-btn {
        height: 60px;
        width: 60px;
        border-radius: 16px;
        background: linear-gradient(
          135deg,
          #fb923c 0%,
          #f59e0b 100%
        ) !important;
        border: none !important;
        box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
