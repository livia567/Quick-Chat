<template>
  <div>
    <PageHead title="知识文章">
      <!-- 具名插槽，#是v-slot的简写，用于指定插槽的名称 -->
      <template #buttons>
        <el-button type="primary">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
  </div>
</template>

<script setup>
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import { categoryTree } from "@/api/admin";
import { ref, onMounted, reactive } from "vue";

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

//查询
const handleSearch = (formData) => {
  console.log(formData);
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
});
</script>
