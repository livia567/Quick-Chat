<template>
  <el-aside :width="isCollapse ? '64px' : '264px'">
    <el-menu
      :collapse="isCollapse"
      :collapse-transition="false"
      default-active="2"
      class="menu-style"
    >
      <div class="brand">
        <el-image
          style="width: 50px; height: 50px; margin-right: 10px"
          :src="iconUrl"
        ></el-image>
        <div v-show="!isCollapse" class="info-card">
          <h1 class="brand-title">心理健康AI助手</h1>
          <p class="sub-title">管理后台</p>
        </div>
      </div>

      <el-menu-item
        @click="selectMenu"
        v-for="item in router.options.routes[0].children"
        :key="item.path"
        :index="item.path"
      >
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin";

//创建路由实例
const router = useRouter();
console.log(router);

//导入logo图片
const iconUrl = new URL("@/assets/images/机器人.png", import.meta.url).href;

//跳转菜单点击事件selectMenu
const selectMenu = (key) => {
  console.log(key);
  const currentRoute = router.options.routes[0]; //父级路由
  router.push(`${currentRoute.path}/${key.index}`);
};

//判断是否折叠菜单
//先调用useAdminStore()，拿到里面的属性isCollapse，用computed监听isCollapse的变化，最后返回isCollapse的值
const isCollapse = computed(() => useAdminStore().isCollapse);
</script>

<style lang="scss" scoped>
.el-aside {
  height: 100vh;
}
.menu-style {
  height: 100%; //子盒子占满父盒子（继承父盒子的高度）

  .brand {
    display: flex; /* 弹性布局，让内部元素排成一行 */
    align-items: center; /* 垂直居中对齐 */
    justify-content: center; /* 水平居中对齐 */
    padding: 10px; /* 内边距10px */
    background-color: #fff; /* 白色背景 */
    border-bottom: 1px solid #e5e7ed; /* 底部灰色边框线 */

    .info-card {
      .brand-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #1f2937;
      }
      .sub-title {
        font-size: 14px;
        color: #6b7280;
      }
    }
  }
}
</style>
