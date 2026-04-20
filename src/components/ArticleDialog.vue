<template>
  <el-dialog
    title="文章详情"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <h1>文章详情</h1>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from "vue";

//接收父组件传来的modelValue值，默认false，类型为Boolean
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

//声明可以向父组件发事件，用于更新父组件的modelValue值
const emit = defineEmits(["update:modelValue"]);

//子组件自己不能直接改 props，所以用 computed 包一层：
const dialogVisible = computed({
  // get：读值时去读 props.modelValue
  get() {
    return props.modelValue;
  },
  // set：有人想改它时，不直接改，而是通知父组件去改
  set(val) {
    emit("update:modelValue", val);
  },
});
const handleClose = () => {};
</script>
