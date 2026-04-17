<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <el-container>
        <Sidebar />
        <el-container direction="vertical">
          <el-header>
            <Navbar />
          </el-header>
          <el-main class="main-content">
            <router-view class="content-container" />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh; //父盒子占满整个屏幕
  //使用 <el-header> 标签时，Element Plus 内部会渲染成：<header class="el-header">
  //所以el-header是类名，要加.
  .el-header {
    height: 74px !important;
  }
  .main-container {
    height: 100%; //子盒子占满父盒子（继承父盒子的高度）
    .content-container {
      padding: 20px;
      background-color: #fff;
      min-height: calc(100% - 74px);
    }
  }
}
</style>
