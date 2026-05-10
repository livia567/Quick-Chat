<template>
  <div class="frontend-layout">
    <!-- 第一部分：导航栏 -->
    <div class="navbar-container">
      <!-- 导航栏左侧：logo+品牌名称 -->
      <div class="brand-section">
        <el-image
          :src="iconUrl"
          alt="logo"
          style="width: 50px; height: 50px"
          class="brand-logo"
        />
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <!-- 导航栏右侧：导航链接 -->
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link v-if="isLoggedIn" to="/consultation" class="nav-link"
          >AI咨询</router-link
        >
        <router-link v-if="isLoggedIn" to="/emotion-diary" class="nav-link"
          >情绪日记</router-link
        >
        <router-link to="/knowledge" class="nav-link">知识库</router-link>
        <el-button v-if="isLoggedIn" class="logout-btn" @click="handleLogout"
          >退出登录</el-button
        >
        <template v-else>
          <router-link to="/auth/login" class="nav-link">登录</router-link>
          <router-link to="/auth/register" class="nav-link">
            <el-button
              style="background: #1d9e75; border-color: #1d9e75; color: #fff"
              >注册</el-button
            >
          </router-link>
        </template>
      </div>
    </div>

    <!-- 第二部分：内容区域 -->
    <div class="content-container">
      <!-- 内容区域是访问子路由展示子组件的地方 -->
      <router-view></router-view>
    </div>

    <!-- 第三部分：footer区域 -->
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2026 心理健康AI助手. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { logout } from "@/api/admin";
import router from "@/router";

const iconUrl = new URL("@/assets/images/robot-fill.png", import.meta.url).href;

const isLoggedIn = ref(false);

//用户端退出登录
const handleLogout = () => {
  logout().then(() => {
    //退出成功后，清空缓存
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    //跳转到登录页
    router.push("/auth/login");
  });
};

onMounted(() => {
  isLoggedIn.value = localStorage.getItem("token") !== null;
});
</script>

<style lang="scss" scoped>
.frontend-layout {
  background-color: #fff;
  .navbar-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .brand-section {
      display: flex;
      align-items: center;
      .brand-logo {
        padding: 5px;
        background: #999;
        border-radius: 30%;
        display: flex;
      }
      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }
    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;
      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        &:hover {
          color: #4a90e2;
        }
      }
    }
  }

  .footer-container {
    background: #f5f5f7;
    color: #333;
    padding: 15px 0;
    margin-top: auto;
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
