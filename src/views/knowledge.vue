<template>
  <div>
    <!-- 页面标题 -->
    <PageHead title="知识文章">
      <!-- 具名插槽，#是v-slot的简写，用于指定插槽的名称 -->
      <template #buttons>
        <el-button type="primary">新增</el-button>
      </template>
    </PageHead>

    <!-- form表单检索框 -->
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>

    <!-- table列表 -->
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <!-- 第一列：文章标题 -->
      <el-table-column label="文章标题" fixed="left" width="250">
        <!-- Element Plus 把当前行数据通过插槽传给我 用scope接收它 -->
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><Document /></el-icon>
            <!-- scope.row 当前行数据 -->
            <span class="page-title">{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- 第二列：分类 -->
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><Timer /></el-icon>
            <span class="page-category">{{
              categoryMap[scope.row.categoryId]
            }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- 第三四五列 -->
      <el-table-column label="作者" prop="authorName" width="150" />
      <el-table-column label="阅读量" prop="readCount" width="150" />
      <el-table-column label="发布时间" prop="publishedAt" width="200" />

      <!-- 第六列：操作 -->
      <el-table-column label="操作" width="230" fixed="right">
        <template #default="scope">
          <el-button text type="primary">编辑</el-button>
          <el-button
            v-if="scope.row.status === 0 || scope.row.status === 2"
            text
            type="success"
            >发布</el-button
          >
          <el-button v-if="scope.row.status === 1" text type="warning"
            >下线</el-button
          >
          <el-button text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import { categoryTree, articlePage } from "@/api/admin";
import { ref, onMounted, reactive } from "vue";

//form表单检索框配置
const formItem = [
  {
    comp: "input",
    prop: "title",
    label: "文章标题",
    placeholder: "请输入文章标题",
  },
  {
    comp: "select",
    prop: "categoryId",
    label: "分类",
    placeholder: "请选择分类",
  },
  {
    comp: "select",
    prop: "status",
    label: "状态",
    placeholder: "请选择状态",
    options: [
      { label: "草稿", value: "0" },
      { label: "已发布", value: "1" },
      { label: "已下线", value: "2" },
    ],
  },
];

//分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});
//列表数据
const tableData = ref([]);
//handleSearch获取列表数据
const handleSearch = async (formData) => {
  //合并分页参数和业务参数（query参数要求）
  const params = {
    ...pagination,
    ...formData,
  };
  const { records, total } = await articlePage(params);
  tableData.value = records;
  //把后端返回的total赋值给pagination.total
  pagination.total = total;
};

//空对象，用来存 id → 分类名 的映射
const categoryMap = reactive({});
//空数组，用来存处理好的分类列表
const categories = ref([]);
onMounted(async () => {
  //data 就是后端返回的分类数组 长这样：
  //   [
  //   { id: 1, categoryName: "心理健康" },
  //   { id: 2, categoryName: "情绪管理" },]
  const data = await categoryTree();
  categories.value = data.map((item) => {
    //categoryMap[1] = "心理健康"
    categoryMap[item.id] = item.categoryName;
    //把每一项转换成下拉框需要的格式
    return {
      label: item.categoryName,
      value: item.id,
    };
  });
  //把处理好的分类列表塞进表单第二项（下拉框）的选项里，下拉框就有内容了
  formItem[1].options = categories.value;

  //获取列表
  handleSearch();
});

//分页参数改变时触发
//page 参数是Element Plus自动传的当前页码
const handleChange = (page) => {
  pagination.currentPage = page;
  handleSearch();
};
</script>

<style scoped lang="scss">
.page-title {
  margin-left: 10px;
}
.page-category {
  margin-left: 5px;
}
</style>
