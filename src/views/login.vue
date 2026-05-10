<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon><Back /></el-icon>
        <span @click="router.push('/')"> 返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的用户名和密码</p>
      </div>
    </div>

    <div class="form-container">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="formData.username"
            size="large"
            placeholder="请输入用户名或邮箱"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            size="large"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-button
          class="btn"
          size="large"
          style="background: #1d9e75; border-color: #1d9e75; color: #fff"
          @click="submitForm(ruleFormRef)"
          >登录</el-button
        >
      </el-form>

      <div class="footer">
        <p>还没有账户？<router-link to="/auth/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { login } from "@/api/admin";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const ruleFormRef = ref();

const formData = ref({
  username: "",
  password: "",
});

//校验规则
const rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

//登录
const router = useRouter();
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      login(formData.value).then((data) => {
        //判断token是否存在
        if (data.token) {
          //保存token和用户信息，存到缓存里
          localStorage.setItem("token", data.token);
          //用户信息是一个对象，但是缓存只能存储字符串，所以需要转换为字符串
          localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
          //根据用户角色决定跳转路径
          if (data.userInfo.userType === 2) {
            //跳转到管理员页面
            router.push("/back/dashboard");
          } else {
            //跳转到用户页面
            router.push("/");
          }
        } else {
          //登录失败，提示用户
          ElMessage.error(data.msg || "登录失败，请检查用户名和密码");
        }
      });
    } else {
      console.log("校验失败");
    }
  });
};
</script>

<style scoped lang="scss">
.container {
  width: 384px;
  .title {
    .back-home {
      margin-bottom: 60px;
      cursor: pointer;
      transition: transform 0.2s;
      &:hover {
        color: #1d9e75;
      }
    }
    .title-text {
      text-align: center;
      margin-bottom: 25px;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>
