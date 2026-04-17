import { defineStore } from "pinia";
import { ref } from "vue";

//调用defineStore方法创建admin的store模块
export const useAdminStore = defineStore("admin", () => {
  // 定义状态
  const isCollapse = ref(false);

  // 定义修改状态的方法
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };
  return {
    isCollapse,
    toggleCollapse,
  };
});
