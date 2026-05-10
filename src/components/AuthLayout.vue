<template>
  <div class="auth-layout">
    <div class="left-section">
      <div class="content">
        <div class="badge">
          <span class="badge-dot"></span>
          AI 驱动 · 全天候陪伴
        </div>
        <h2 class="title">倾听，<br /><em>是一种治愈。</em></h2>
        <p class="text">
          这里没有评判，只有聆听。<br />
          在喧嚣的世界里，为你留出一方安静的心灵栖息地。
        </p>
        <div class="feature-list">
          <div class="feature-item" v-for="item in features" :key="item">
            <span class="check">✓</span>
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div class="right-section">
      <router-view />
    </div>
  </div>
</template>

<script setup>
const iconUrl = new URL("@/assets/images/robot-fill.png", import.meta.url).href;

const features = ["AI 实时流式对话", "情绪趋势智能分析", "专业心理知识库"];
</script>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  min-height: 100vh;

  .left-section {
    flex: 1;
    min-height: 100vh;
    position: sticky; // 左边固定不跟随滚动
    top: 0;
    background: #f5f5f7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;

    .content {
      max-width: 400px;

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #e1f5ee;
        color: #0f6e56;
        font-size: 17px;
        font-weight: 500;
        padding: 5px 14px;
        border-radius: 20px;
        margin-bottom: 32px;

        .badge-dot {
          width: 6px;
          height: 6px;
          background: #1d9e75;
          border-radius: 50%;
        }
      }

      .title {
        font-size: 60px;
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

      .text {
        font-size: 17px;
        color: #6e6e73;
        line-height: 1.7;
        margin-bottom: 40px;
      }

      .feature-list {
        display: flex;
        flex-direction: column;
        gap: 14px;

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          color: #1d1d1f;

          .check {
            width: 22px;
            height: 22px;
            background: #1d9e75;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            flex-shrink: 0;
          }
        }
      }
    }
  }

  .right-section {
    flex: 1;
    min-height: 100vh;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
