<template>
  <div class="consultations-container">
    <PageHead title="咨询记录" />
    <el-table :data="tableData" style="width: 100%">
      <!-- 第一列：用户昵称 -->
      <el-table-column label="会话ID" width="100">
        <!-- 列表自定义内容要写成插槽，用scope接收它，scope.row 当前行数据 -->
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

      <!-- 第五列：操作（查看详情按钮）  -->
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button @click="viewSessionDetail(scope.row)" text type="primary"
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

    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      title="咨询记录详情"
      width="70%"
      :close-on-click-modal="false"
    >
      <!-- 弹窗内容 -->
      <div class="session-detail">
        <!-- detail-header弹窗上半部分内容 -->
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户：</div>
            <div class="detail-value">{{ sessionDetail.userNickname }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">开始时间：</div>
            <div class="detail-value">{{ sessionDetail.startedAt }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">消息数：</div>
            <div class="detail-value">{{ sessionDetail.messageCount }}</div>
          </div>
        </div>

        <!-- detail-container弹窗下半部分内容 -->
        <div class="message-container">
          <div class="message-header">
            <h4>对话记录</h4>
          </div>
          <div class="message-list" v-loading="loadingMessages">
            <div
              v-for="message in sessionMessages"
              :key="message.id"
              class="message-item"
              :class="message.senderType === 1 ? 'user-message' : 'ai-message'"
            >
              <div class="message-header">
                <span class="sender">{{
                  message.senderType === 1 ? "用户" : "AI助手"
                }}</span>
                <span class="time">{{ message.createdAt }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 关闭按钮 -->
      <!-- 如果直接在内容区域写按钮，按钮会在内容区内部，而不是固定在底部 -->
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import PageHead from "@/components/PageHead.vue";
import { getConsultationPage, getSessionDetail } from "@/api/admin";

//el-table的:data属性明确规定接收一个数组类型的数据
//数组的每个元素 → 表格的一行
const tableData = ref([]);

//定义分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

//弹窗上半部分（头部信息）表格的当前行 row
const sessionDetail = ref({});
//弹窗下半部分（聊天记录）接口返回的消息数据 res
const sessionMessages = ref([]);
//加载状态
const loadingMessages = ref(false);

//查看详情
const viewSessionDetail = (row) => {
  // 接口调用前打开模态框会显示正在加载
  loadingMessages.value = true;
  //一点击按钮就打开弹窗
  showDetailDialog.value = true;
  getSessionDetail(row.id).then((res) => {
    //接口调用完毕会关闭加载状态
    loadingMessages.value = false;
    sessionMessages.value = res;
    sessionDetail.value = row;
  });
};

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

//弹窗显示状态
const showDetailDialog = ref(false);

onMounted(() => {
  handleSearch();
});
</script>

<style scoped lang="scss">
.session-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.session-preview {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.session-detail {
  max-height: 70vh;
  overflow-y: auto;

  .detail-header {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    .detail-label {
      font-weight: 500;
      color: #495057;
      min-width: 80px;
      margin-right: 8px;
    }

    .detail-value {
      color: #333;
    }
  }

  .message-container {
    margin-top: 20px;

    .message-header {
      margin-bottom: 16px;

      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .message-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;

      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;

        &:last-child {
          margin-bottom: 0;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .sender {
            font-weight: 500;
            color: #333;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .time {
            font-size: 12px;
            color: #999;
          }
        }

        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
}

.user-message {
  background: #e8f4fd !important;
}

.ai-message {
  background: #f0f9f0 !important;
}
</style>
