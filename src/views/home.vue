<template>
  <div class="home-container">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-left">
        <div class="badge">
          <span class="badge-dot"></span>
          AI 驱动 · 全天候陪伴
        </div>
        <h1 class="hero-title">倾听，<br />是一种<em>治愈</em>。</h1>
        <p class="hero-desc">
          无论深夜还是清晨，你的情绪值得被认真对待。<br />
          AI 陪你梳理思绪，找回内心的平静。
        </p>
        <div class="hero-btns">
          <el-button class="btn-main" round @click="goConsult"
            >开始倾诉</el-button
          >
          <el-button class="btn-ghost" round @click="goDiary"
            >记录心情</el-button
          >
        </div>
      </div>

      <div class="hero-right">
        <div class="chat-card">
          <div class="chat-header">
            <div class="chat-avatar">
              <el-image :src="iconUrl" style="width: 20px; height: 20px" />
            </div>
            <div>
              <div class="chat-name">心理 AI 助手</div>
              <div class="chat-status">● 在线</div>
            </div>
          </div>
          <div class="bubble ai">
            你好，我在这里陪伴你。<br />今天感觉怎么样？
          </div>
          <div class="bubble user">最近压力很大，睡不着…</div>
          <div class="bubble ai">
            听起来你承受了很多。<br />能跟我说说是什么让你焦虑吗？
          </div>
          <div class="typing-row">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="typing-label">正在输入</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据统计 -->
    <div class="divider"></div>
    <section class="stats">
      <div class="stat-item">
        <div class="stat-num">10,000<span>+</span></div>
        <div class="stat-label">注册用户</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">50,000<span>+</span></div>
        <div class="stat-label">累计对话次数</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">98<span>%</span></div>
        <div class="stat-label">用户好评率</div>
      </div>
    </section>

    <!-- 功能介绍 -->
    <section class="features">
      <div class="feat-head">
        <h2>为你而设计</h2>
        <p>从倾诉到记录，全方位守护你的心理健康</p>
      </div>
      <div class="feat-grid">
        <div
          class="feat-card"
          v-for="item in features"
          :key="item.title"
          @click="router.push(item.path)"
        >
          <div class="feat-icon" :style="{ background: item.iconBg }">
            <el-icon :size="22" :color="item.iconColor">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ChatLineRound, EditPen, Reading } from "@element-plus/icons-vue";

const router = useRouter();
const iconUrl = new URL("@/assets/images/robot-fill.png", import.meta.url).href;

const goConsult = () => router.push("/consultation");
const goDiary = () => router.push("/emotion-diary");

const features = [
  {
    title: "AI 实时咨询",
    desc: "基于大模型的流式对话，像真人一样倾听，实时给出专业的情绪支持与干预建议。",
    icon: ChatLineRound,
    iconBg: "#e1f5ee",
    iconColor: "#0F6E56",
    path: "/consultation",
  },
  {
    title: "情绪日记",
    desc: "记录每日心情，AI 自动分析情绪趋势，帮你看见情绪变化背后的规律。",
    icon: EditPen,
    iconBg: "#eaf3de",
    iconColor: "#3B6D11",
    path: "/emotion-diary",
  },
  {
    title: "心理知识库",
    desc: "专业文章精心筛选，随时查阅，让你在日常生活中主动学习心理健康知识。",
    icon: Reading,
    iconBg: "#e6f1fb",
    iconColor: "#185FA5",
    path: "/knowledge",
  },
];
</script>

<style scoped lang="scss">
.home-container {
  background: #fff;
  color: #1d1d1f;
  font-family:
    -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue",
    sans-serif;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 100px 120px 80px;
  min-height: 580px;
}

.hero-left {
  max-width: 460px;

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f0faf6;
    color: #0f6e56;
    font-size: 20px;
    font-weight: 500;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 28px;

    .badge-dot {
      width: 6px;
      height: 6px;
      background: #1d9e75;
      border-radius: 50%;
    }
  }

  .hero-title {
    font-size: 70px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #1d1d1f;
    margin-bottom: 20px;

    em {
      font-style: normal;
      color: #1d9e75;
    }
  }

  .hero-desc {
    font-size: 20px;
    color: #6e6e73;
    line-height: 1.6;
    margin-bottom: 40px;
  }

  .hero-btns {
    display: flex;
    gap: 14px;

    .btn-main {
      background: #1d9e75 !important;
      border-color: #1d9e75 !important;
      color: #fff !important;
      padding: 20px 32px;
      font-size: 20px;
      font-weight: 500;
    }

    .btn-ghost {
      background: transparent !important;
      border-color: #1d9e75 !important;
      color: #1d9e75 !important;
      padding: 20px 32px;
      font-size: 20px;
      font-weight: 500;
    }
  }
}

.hero-right {
  .chat-card {
    background: #f5f5f7;
    border-radius: 24px;
    padding: 30px;
    width: 350px;

    .chat-header {
      display: flex;
      align-items: center;
      gap: 15px;
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);

      .chat-avatar {
        width: 45px;
        height: 45px;
        background: #1d9e75;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .chat-name {
        font-size: 20px;
        font-weight: 600;
        color: #1d1d1f;
      }

      .chat-status {
        font-size: 13px;
        color: #1d9e75;
        margin-top: 2px;
      }
    }

    .bubble {
      border-radius: 18px;
      font-size: 16px;
      line-height: 1.5;
      padding: 10px 14px;
      margin-bottom: 12px;
      max-width: 88%;

      &.ai {
        background: #fff;
        color: #1d1d1f;
        border-bottom-left-radius: 4px;
      }

      &.user {
        background: #1d9e75;
        color: #fff;
        border-bottom-right-radius: 4px;
        margin-left: auto;
      }
    }

    .typing-row {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 4px;

      .dot {
        width: 6px;
        height: 6px;
        background: #aaa;
        border-radius: 50%;
        animation: pulse 1.2s infinite;

        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }

      .typing-label {
        font-size: 11px;
        color: #aaa;
        margin-left: 2px;
      }
    }
  }
}

@keyframes pulse {
  0%,
  60%,
  100% {
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
}

.divider {
  height: 1px;
  background: #f5f5f7;
  margin: 0 120px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 56px 120px;

  .stat-item {
    text-align: center;
    padding: 0 20px;
    border-right: 1px solid #e5e5e7;

    &:last-child {
      border-right: none;
    }

    .stat-num {
      font-size: 44px;
      font-weight: 700;
      color: #1d1d1f;
      letter-spacing: -0.03em;
      margin-bottom: 6px;

      span {
        color: #1d9e75;
      }
    }

    .stat-label {
      font-size: 13px;
      color: #6e6e73;
    }
  }
}

.features {
  background: #f5f5f7;
  padding: 80px 120px 72px;

  .feat-head {
    text-align: center;
    margin-bottom: 48px;

    h2 {
      font-size: 45px;
      font-weight: 700;
      color: #1d1d1f;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
    }

    p {
      font-size: 17px;
      color: #6e6e73;
    }
  }

  .feat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .feat-card {
    background: #fff;
    border-radius: 20px;
    padding: 32px 28px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    .feat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    h3 {
      font-size: 19px;
      font-weight: 600;
      color: #1d1d1f;
      margin-bottom: 10px;
      letter-spacing: -0.01em;
    }

    p {
      font-size: 15px;
      color: #6e6e73;
      line-height: 1.6;
    }
  }
}
</style>
