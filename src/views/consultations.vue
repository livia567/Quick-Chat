<template>
  <div class="consultations-container">
    <PageHead title="咨询记录" />
    <el-table :data="tableData" style="width: 100%">
      <!-- 第一列：用户昵称 -->
      <el-table-column label="会话ID" width="100">
        <template #default="scope">
          <el-avatar>{{ scope.row.userNickname }}</el-avatar>
        </template>
      </el-table-column>

      <!-- 第二列：会话标题 -->
      <el-table-column label="情绪日志">
        <template #default="scope">
          <div class="session-title">{{ scope.row.sessionTitle }}</div>
          <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
        </template>
      </el-table-column>

      <!-- 第三列：消息数 -->
      <el-table-column label="消息数" prop="messageCount" width="100" />

      <!-- 第四列：时间 -->
      <el-table-column label="时间" prop="lastMessageTime" width="100" />

      <!-- 第五列：操作 -->
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button @click="viewSessionDetail" text type="primary"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页（在table外） -->
    <el-pagination
      style="margin-top: 20px"
      :page-size="pagination.size"
      layout="prev, pager, next"
      :total="pagination.total"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import PageHead from "@/components/PageHead.vue";
import { getConsultationPage } from "@/api/admin";

//el-table的:data属性明确规定接收一个数组类型的数据
//数组的每个元素 → 表格的一行
const tableData = ref([]);

//定义分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

//查看详情
const viewSessionDetail = () => {};

//分页方法
const handleChange = (page) => {
  pagination.currentPage = page;
  handleSearch();
};

//封装刷新列表方法
const handleSearch = () => {
  getConsultationPage(pagination).then((res) => {
    //records: 咨询记录列表详细信息
    //total: 总记录数
    const { records, total } = res;
    tableData.value = records;
    pagination.total = total;
  });
};

onMounted(() => {
  handleSearch();
});
</script>
