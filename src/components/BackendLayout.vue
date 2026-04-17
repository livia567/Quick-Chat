<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <el-container>
        <Sidebar />
        <el-container direction="vertical">
          <el-header>
            <Navbar />
          </el-header>
          <el-main>
            <router-view />
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
  .main-container {
    height: 100%; //子盒子占满父盒子（继承父盒子的高度）
  }
}
</style>
