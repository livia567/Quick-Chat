<template>
  <div class="navbar">
    <!-- 左侧 -->
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">{{ route.meta.title }}</p>
    </div>

    <!-- 右侧 -->
    <div class="flex-box">
      <!-- 外层：下拉菜单容器-->
      <el-dropdown @command="handleCommand">
        <!-- 触发器：被点击后会展开菜单的东西 -->
        <div class="flex-box">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <p class="user-name">admin</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <!-- 下拉内容：菜单弹窗 -->
        <template #dropdown>
          <!-- el-dropdown-menu：下拉菜单的内容  command="logout"：点击时传给 handleCommand 的值 -->
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAdminStore } from "@/stores/admin";
import { logout } from "@/api/admin";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
//useRouter	获取路由器实例，用来跳转页面
//useRoute	获取当前路由信息，用来读取数据

//获取路由实例
const router = useRouter();
//获取当前路由信息
const route = useRoute();

const handleCommand = (command) => {
  console.log(command);
  if (command === "logout") {
    // 退出登录逻辑
    ElMessageBox.confirm("确定退出登录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      // 确认退出登录（调用接口告诉后端销毁当前用户信息）
      logout().then(() => {
        //清除缓存
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        ElMessage.success("退出登录成功");
        //跳转到登录页
        router.push("/auth/login");
      });
    });
  }
};

const handleCollapse = () => {
  useAdminStore().toggleCollapse();
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 左右两端对齐（左边内容 | 右边内容） */
  padding: 0 15px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7ed;

  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page-title {
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }
}
</style>
