<template>
  <div>
    <PageHead title="知识文章">
      <!-- 具名插槽，#是v-slot的简写，用于指定插槽的名称 -->
      <template #buttons>
        <el-button type="primary">新增</el-button>
      </template>
    </PageHead>
  </div>
</template>

<script setup>
import PageHead from "@/components/PageHead.vue";
</script>
