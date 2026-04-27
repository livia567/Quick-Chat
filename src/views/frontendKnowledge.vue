<template>
  <div class="knowledge-container">
    <!-- 知识库标题 -->
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconUrl" style="width: 60px; height: 60px"></el-image>
        <h1>心理健康知识库</h1>
      </div>
    </div>
    <!-- 知识库主体内容 -->
    <div class="content">
      <!-- 左侧菜单 -->
      <div class="recommend-section">
        <div class="section-title">推荐阅读</div>
        <div class="recommend-list">
          <div
            class="recommend-item"
            v-for="item in recommendList"
            :key="item.id"
            @click="goToArticle(item.id)"
          >
            <h4>{{ item.title }}</h4>
            <p class="read-count">
              <el-icon><Histogram /></el-icon>
              阅读量 {{ item.readCount }}
            </p>
          </div>
        </div>
      </div>

      <!-- 右侧文章列表 -->
      <div class="article-list">
        <div
          class="article-item"
          v-for="item in articleList"
          :key="item.id"
          @click="goToArticle(item.id)"
        >
          <el-image
            style="width: 240px; height: 150px"
            :src="getImage(item.coverImage)"
          ></el-image>
          <div class="info">
            <div class="title">
              <h3>{{ item.title }}</h3>
              <el-tag Plain type="primary">{{ item.categoryName }}</el-tag>
            </div>
            <div style="margin-top: 10px">
              <div class="flex-box">
                <el-icon><Avatar /></el-icon>
                <span>{{ item.authorName }}</span>
              </div>
              <div class="flex-box">
                <el-icon><List /></el-icon>
                <span>{{ dayjs(item.updateAt).format("YYYY-MM-DD") }}</span>
              </div>
              <div style="margin-top: 40px">
                <div class="flex-box">
                  <el-icon><Platform /></el-icon>
                  <span>观看人数 {{ item.readCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部分页（和content同层级） -->
    <div class="pagination-wrapper">
      <el-pagination
        style="margin-top: 20px"
        :page-size="pagination.size"
        layout="prev, pager, next"
        :total="pagination.total"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { getKnowledgeList } from "@/api/frontend";
import dayjs from "dayjs";
import { Platform } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();

const iconUrl = new URL("@/assets/images/book.png", import.meta.url).href;
const coverUrl = new URL("@/assets/images/cover.jpg", import.meta.url).href;

//分页参数
const pagination = reactive({
  currentPage: 1,
  size: 5,
  total: 0,
});

//右侧列表数据
const articleList = ref([]);

//获取右侧列表数据方法（因为在组件挂载和分页切换时都要获取右侧列表，所以封装为一个方法）
const getPageList = () => {
  //获取右侧列表的参数
  const params = {
    sortField: "publishedAt",
    sortDirection: "desc",
    //将pagination对象中的所有属性"拆开"，并合并到当前对象中
    ...pagination,
  };
  getKnowledgeList(params).then((res) => {
    articleList.value = res.records;
    pagination.total = res.total;
  });
};

//获取封面图片
const getImage = (url) => {
  return url ? "http://159.75.169.224:1235" + url : coverUrl;
};

//分页切换时，更新当前页码
const handleChange = (page) => {
  pagination.currentPage = page;
  //更新右侧列表数据
  getPageList();
};

//跳转到详情页面
const goToArticle = (id) => {
  router.push(`/knowledge/article/${id}`);
};

//推荐阅读列表
const recommendList = ref([]);

onMounted(() => {
  //获取左侧推荐阅读列表的参数
  const params = {
    sortField: "readCount",
    sortDirection: "desc",
    currentPage: 1,
    size: 5,
  };
  //调用接口
  getKnowledgeList(params).then((res) => {
    console.log(res);
    recommendList.value = res.records;
  });
  //获取右侧列表数据
  getPageList();
});
</script>

<style scoped lang="scss">
.knowledge-container {
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
  .flex-box {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
  .header-section {
    background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
    color: white;
    padding: 48px;
    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
  .content {
    display: flex;
    gap: 20px;
    margin: 0 auto;
    width: 1200px;
    padding: 20px;
    .recommend-section {
      width: 280px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      padding: 15px;
      height: 400px;
      .section-title {
        font-size: 12;
        font-weight: 600;
        color: #374151;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .recommend-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .recommend-item {
          border-left: 4px solid #f59e0b;
          padding-left: 10px;
          cursor: pointer;
          .read-count {
            margin-top: 15px;
            font-size: 12px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
    .article-list {
      flex: 1;
      .article-item {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        padding: 15px;
        margin-bottom: 20px;
        display: flex;
        .info {
          margin-left: 20px;
          .title {
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
  }
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
  }
}
</style>
