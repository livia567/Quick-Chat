<template>
  <div class="emotional-container">
    <PageHead title="情绪日志" />
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
    <!-- table列表 -->
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <!-- 第一列：用户ID -->
      <el-table-column label="用户ID" prop="id" width="80" />
      <!-- 第二列：会话ID -->
      <el-table-column label="会话ID" width="80">
        <template #default="scope">
          <el-avatar>{{ scope.row.nickname }}</el-avatar>
        </template>
      </el-table-column>
      <!-- 第三列：记录日期 -->
      <el-table-column label="记录日期" prop="diaryDate" width="120" />
      <!-- 第四列：情绪评分 -->
      <el-table-column label="情绪评分" width="250">
        <template #default="scope">
          <!-- Element-plus评分组件 el-rate -->
          <el-rate
            :model-value="scope.row.moodScore"
            :max="10"
            disabled
          ></el-rate>
        </template>
      </el-table-column>
      <!-- 第五列：生活指标 -->
      <el-table-column label="生活指标" width="120">
        <template #default="scope">
          <div>
            <p>睡眠:{{ scope.row.sleepQuality }} / 5</p>
            <p>压力:{{ scope.row.stressLevel }} / 5</p>
          </div>
        </template>
      </el-table-column>
      <!-- 第六列：情绪触发因素 -->
      <el-table-column
        label="情绪触发因素"
        prop="emotionTriggers"
        width="120"
      />
      <!-- 第七列：日记内容 -->
      <el-table-column label="日记内容" prop="diaryContent" width="250" />
      <!-- 第八列：操作 -->
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button text type="primary">详情</el-button>
          <el-button text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页（在表格外） -->
    <!-- @change是Element Plus的内置事件，翻页或改变每页条数时自动触发 -->
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
import TableSearch from "@/components/TableSearch.vue";
import { getEmotionalPage } from "@/api/admin";

// 搜索表单配置
const formItem = [
  {
    comp: "input",
    prop: "userId",
    label: "用户ID",
    placeholder: "请输入用户ID",
  },
  {
    comp: "select",
    prop: "moodScoreRange",
    label: "情绪评分",
    placeholder: "请选择评分范围",
    options: [
      { label: "低分（1-3）", value: "1-3" },
      { label: "中分（4-6）", value: "4-6" },
      { label: "高分（7-10）", value: "7-10" },
    ],
  },
];

//分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

//分页参数改变时触发
//page 参数是Element Plus自动传的当前页码
const handleChange = (page) => {
  pagination.currentPage = page;
  handleSearch();
};

//列表数据
const tableData = ref([]);
//handleSearch获取列表数据
const handleSearch = async (formData) => {
  //合并分页参数和业务参数（query参数要求）
  const params = {
    ...pagination,
    ...formData,
  };
  const { records, total } = await getEmotionalPage(params);
  tableData.value = records;
  //把后端返回的total赋值给pagination.total
  pagination.total = total;
};

onMounted(() => {
  handleSearch({});
  console.log(tableData.value, "情绪日志");
});
</script>
