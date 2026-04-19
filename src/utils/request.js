import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router/index";

//创建axios实例
const service = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

//请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//响应拦截器
service.interceptors.response.use(
  //请求成功时执行
  (response) => {
    const { data, config } = response;
    //业务状态码等于200时（此时接口成功）
    if (data.code === "200") {
      return data.data;
    } else {
      if (data.code === "-1") {
        if (!config.url?.includes("/login")) {
          ElMessage.error(data.msg || "登录过期，请重新登录");
          //清除token
          localStorage.removeItem("token");
          //清除用户信息
          localStorage.removeItem("userInfo");
          //跳转登录页
          router.push("/auth/login");
        }
      } else {
        //业务状态码不等于200也不等于-1时（此时接口异常）
        ElMessage.error(data.msg || "接口异常，请稍后重试");
        //返回空对象
        return Promise.reject("网络请求失败");
      }
    }
    return response;
  },
  //请求失败时执行
  (error) => {
    return Promise.reject(error);
  },
);

export default service;
