<template>
  <el-form ref="ruleFormRef" :model="formData">
    <el-row :gutter="24">
      <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <component
              v-model="formData[item.prop]"
              :is="isComp(item.comp)"
              :placeholder="item.placeholder"
              ><template v-if="item.comp === 'select'">
                <el-option label="全部" value="" />
                <el-option
                  v-for="opt in item.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                /> </template
            ></component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <el-row>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset(ruleFormRef)">重置</el-button>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

//接收父组件传递的formItem数组
const props = defineProps({
  formItem: {
    type: Array,
    default: () => [],
  },
});

//实现响应式布局
const formItemAttrs = computed(() => {
  //监听props里的formItem，把它解构出来，赋值给formItemAttrs
  const { formItem } = props;
  formItem.forEach((item) => {
    item.col = {
      // 一行（el-row是24，此时就是一行只显示一个元素）
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 6,
    };
  });
  return formItem;
});

//表单数据
const formData = reactive({});
const isComp = (comp) => {
  return {
    input: "el-input",
    select: "el-select",
  }[comp];
};

//查询按钮点击事件
const emit = defineEmits(["search"]);
const handleSearch = () => {
  emit("search", formData);
};

//重置按钮点击事件
const ruleFormRef = ref();
const handleReset = (formEl) => {
  //先重置表单
  if (!formEl) return;
  formEl.resetFields();
  //再触发查询
  emit("search", formData);
};
</script>
