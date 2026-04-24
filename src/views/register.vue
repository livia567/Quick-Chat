<template>
  <div class="container">
    <!-- 标题 -->
    <div class="title">
      <div class="title-text">
        <h2>创建您的用户</h2>
        <p>请填写注册信息</p>
      </div>
    </div>

    <!-- 注册表单 -->
    <div class="form-container">
      <!-- :model="formData"告诉表单数据是什么，prop要用formData里的属性 -->
      <!-- ref="submitFormRef"给表单起个名字，方便JS里调用表单的方法 -->
      <!-- submitFormRef就是这个form表单实例 -->
      <el-form
        label-position="top"
        :model="formData"
        :rules="rules"
        ref="submitFormRef"
      >
        <!-- 第一行：用户名 -->
        <!-- prop要和formData的属性名一致，否则校验会失败 -->
        <el-form-item label="用户名" prop="username">
          <!-- v-model和formData里的某个属性绑定 -->
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            size="large"
          ></el-input>
        </el-form-item>

        <!-- 第二行：邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            size="large"
          ></el-input>
        </el-form-item>

        <!-- 第三行：昵称 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="formData.nickname"
            placeholder="请输入昵称（可选）"
            size="large"
          ></el-input>
        </el-form-item>

        <!-- 第四行：手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号（可选）"
            size="large"
          ></el-input>
        </el-form-item>

        <!-- 第五行：密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            size="large"
            type="password"
            show-password
          ></el-input>
        </el-form-item>

        <!-- 第六行：确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            placeholder="请确认密码"
            size="large"
            type="password"
            show-password
          ></el-input>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <!-- submitForm(submitFormRef)获取el-form组件实例 -->
          <el-button
            class="btn"
            type="primary"
            size="large"
            @click="submitForm(submitFormRef)"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { register } from "@/api/frontend";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

// 注册表单数据
const formData = reactive({
  username: "",
  email: "",
  nickname: "",
  phone: "",
  password: "",
  confirmPassword: "",
  gender: 0,
  userType: 1, //用户类型 1:普通用户 2:管理员
});

//校验规则
const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请确认密码", trigger: "blur" }],
});

//表单提交
const router = useRouter();
const submitFormRef = ref(null);
const submitForm = async (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    // 这里data需要解构赋值，因为register返回的是一个对象，里面有一个data属性，我们只需要data属性
    register(formData).then(({ data }) => {
      console.log(data);
      //如果注册成功，就不会有data属性(data里面是注册失败的信息)
      if (!data) {
        ElMessage.success("注册成功");
        router.push("/auth/login");
      }
    });
  });
};
</script>

<style scoped lang="scss">
.container {
  width: 384px;
  margin: 0 auto; // 水平居中
  padding-top: 20px; // 给顶部留点空间

  .title {
    .title-text {
      text-align: center;
      h2 {
        font-size: 28px; // 稍微缩小
        margin-bottom: 4px; // 减小下边距
      }
      p {
        font-size: 14px;
        margin-top: 0; // 去掉多余上边距
      }
    }
  }

  .form-container {
    margin-top: 16px;

    .btn {
      margin-top: 20px;
      margin-bottom: 20px;
      width: 100%;
      display: block;
    }
  }
}
</style>
