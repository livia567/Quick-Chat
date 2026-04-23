<template>
  <div class="dashboard-container">
    <!-- 第一行4个card -->
    <el-row :gutter="24">
      <!-- 一行4个card，所以每个card占6个span -->
      <el-col :span="6">
        <!-- 第一个card -->
        <el-card>
          <div class="card-content">
            <!-- 左侧头像 -->
            <div class="avatar users">
              <el-image :src="iconUrl1" style="width: 40px; height: 40px" />
            </div>
            <!-- 右侧信息 -->
            <div class="info">
              <p class="title">总用户数</p>
              <!-- aiData在接口调用前是一个空对象，所以需要判断是否为空 -->
              <!-- ?. 表示如果某个属性不存在，就返回 undefined 而不是报错 -->
              <p class="number">{{ aiData.systemOverview?.totalUsers }}</p>
              <p class="subtitle-title">
                活跃用户：{{ aiData.systemOverview?.activeUsers }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <!-- 第二个card -->
        <el-card>
          <div class="card-content">
            <!-- 左侧头像 -->
            <div class="avatar like">
              <el-image :src="iconUrl2" style="width: 40px; height: 40px" />
            </div>
            <!-- 右侧信息 -->
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ aiData.systemOverview?.totalDiaries }}</p>
              <p class="subtitle-title">
                新增日志：{{ aiData.systemOverview?.todayNewDiaries }} 条
              </p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <!-- 第三个card -->
        <el-card>
          <div class="card-content">
            <!-- 左侧头像 -->
            <div class="avatar comments">
              <el-image :src="iconUrl3" style="width: 40px; height: 40px" />
            </div>
            <!-- 右侧信息 -->
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">{{ aiData.systemOverview?.totalSessions }}</p>
              <p class="subtitle-title">
                新增会话：{{ aiData.systemOverview?.todayNewSessions }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <!-- 第四个card -->
        <el-card>
          <div class="card-content">
            <!-- 左侧头像 -->
            <div class="avatar smile">
              <el-image :src="iconUrl4" style="width: 40px; height: 40px" />
            </div>
            <!-- 右侧信息 -->
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{ aiData.systemOverview?.avgMoodScore }}/10</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行2个图表 -->
    <el-row :gutter="24" style="margin-top: 20px">
      <el-col :span="12">
        <!-- width: 100%是在珊格内的100%，即一半的宽度 -->
        <el-card style="width: 100%">
          <!-- 用具名插槽的方式写卡片标题 -->
          <template #header>
            <div class="card-header">情绪趋势分析</div>
          </template>
          <div class="chart-content">
            <!-- 图表内容 -->
            <!-- ref="emotionChartRef" 是DOM元素的引用，告诉ECharts要把图表画在哪里-->
            <!--ref="emotionChartRef" 把div这个DOM元素赋值给emotionChartRef.value  -->
            <div ref="emotionChartRef" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 第二行第二个图表 -->
      <el-col :span="12">
        <el-card style="width: 100%">
          <!-- 用具名插槽的方式写卡片标题 -->
          <template #header>
            <div class="card-header">咨询会话统计</div>
          </template>
          <div class="chart-content">
            <div class="consultation-stats">
              <div class="stat-item">
                <div class="stat-label">总会话数</div>
                <div class="stat-value">
                  {{ aiData.consultationStats?.totalSessions }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">平均时长</div>
                <div class="stat-value">
                  {{ aiData.consultationStats?.avgDurationMinutes }} 分钟
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">活跃用户</div>
                <div class="stat-value">
                  {{ aiData.systemOverview?.activeUsers }}
                </div>
              </div>
            </div>
            <!-- 图表内容 -->
            <div
              ref="consultationChartRef"
              style="width: 100%; height: 260px"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第三行1个图表 -->
    <el-row style="margin-top: 20px">
      <el-card style="width: 100%">
        <!-- 用具名插槽的方式写卡片标题 -->
        <template #header>
          <div class="card-header">用户活跃度趋势</div>
        </template>
        <div class="chart-content">
          <!-- 图表内容 -->
          <div
            ref="userActivityChartRef"
            style="width: 100%; height: 300px"
          ></div>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script setup>
import { getAnalyticsOverview } from "@/api/admin";
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

//初始化图表（入口函数）
const initChart = () => {
  //初始化情绪趋势图表
  initEmotionChart();
  //初始化咨询会话统计图表
  initConsultationChart();
  //初始化用户活跃度趋势图表
  initUserActivityChart();
};

//情绪趋势图表
//普通变量 ECharts实例对象，用来操作图表（更新、销毁等）
let emotionChart = null;
const emotionChartRef = ref(null);
//初始化情绪趋势图表函数
const initEmotionChart = () => {
  //在组件挂载到页面(onMounted)时，Vue把DOM放进浏览器
  //此时DOM元素存在了，Vue就会把那一行写了ref="emotionChartRef"的div元素赋值给emotionChartRef.value
  //所以挂载后调用该函数时，emotionChartRef.value就已经有值了，不会return
  if (!emotionChartRef.value) return;
  //销毁现有图表
  if (emotionChart) {
    emotionChart.dispose();
  }
  //创建echarts实例
  emotionChart = new echarts.init(emotionChartRef.value);
  //获取情绪趋势数据
  const TrendData = aiData.value?.emotionTrend || [];
  //配置项
  const option = {
    // 图表标题
    title: {
      text: "情绪趋势分析",
      textStyle: {
        color: "#2d3436",
        fontSize: 16,
        fontWeight: "600",
      },
      left: "center",
      //不加px会自动理解成像素值
      top: "10",
    },
    // 鼠标悬停在图表上时的提示框
    tooltip: {
      trigger: "axis", //触发方式：悬停在坐标轴上时触发提示框
      //鼠标悬停时弹出的提示框边框颜色（浅橙色）
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        //提示框里文字的颜色（深灰色）
        color: "#2d3436",
      },
    },
    //图例（图表中用来标示每条线/每个颜色代表什么的小方块和文字）
    legend: {
      data: ["平均情绪评分", "记录数量"],
      top: "40",
    },
    //横坐标
    xAxis: {
      type: "category",
      //遍历TrendData数组（这个数组里每个元素是一个对象，包含date属性）
      //提取每个对象的date属性，返回的一元新数组赋值给xAxis.data，作为横坐标
      data: TrendData.map((item) => item.date),
      //样式
      axisLine: {
        //X轴那条线的颜色（深灰色）
        lineStyle: {
          color: "#2d3436",
        },
      },
    },
    //纵坐标
    yAxis: [
      //左侧纵坐标轴（因为纵坐标轴有2个，所以写成数组形式，每个元素都是一个对象）
      {
        type: "value",
        name: "情绪评分",
        position: "left",
        //样式
        axisLine: {
          lineStyle: {
            color: "#2d3436",
          },
        },
      },
      //右侧纵坐标轴
      {
        type: "value",
        name: "记录数量",
        position: "right",
        //样式
        axisLine: {
          lineStyle: {
            color: "#2d3436",
          },
        },
      },
    ],
    //数据（同样也有两组）
    series: [
      //左侧情绪评分折线图
      {
        name: "平均情绪评分",
        //折线图
        type: "line",
        data: TrendData.map((item) => item.avgMoodScore),
        //使用平滑曲线
        smooth: true,
        //样式
        lineStyle: {
          //线宽
          width: 3,
          //这条折线的颜色
          color: "#faebaf",
        },
        itemStyle: {
          //线上每个数据点（圆点）的颜色
          color: "#faebaf",
        },
      },
      //右侧记录数量折线图
      {
        name: "记录数量",
        type: "line",
        data: TrendData.map((item) => item.recordCount),
        smooth: true,
        //样式
        lineStyle: {
          width: 3,
          color: "#eeb5a3",
        },
        itemStyle: {
          color: "#eeb5a3",
        },
      },
    ],
    //控制容器样式
    grid: {
      top: "80",
      bottom: "3%",
      left: "3%",
      right: "4%",
    },
  };

  //设置图表项(把option配置项传给图表实例)
  emotionChart.setOption(option);
};

//咨询会话统计图表
//普通变量 ECharts实例对象，用来操作图表（更新、销毁等）
let consultationChart = null;
//接受DOM元素（div）
const consultationChartRef = ref(null);
//初始化咨询会话统计图表函数
const initConsultationChart = () => {
  if (!consultationChartRef.value) return;
  //销毁现有图表
  if (consultationChart) {
    consultationChart.dispose();
  }
  //创建echarts实例
  consultationChart = new echarts.init(consultationChartRef.value);
  //获取咨询会话统计数据
  const dailyTrend = aiData.value?.consultationStats.dailyTrend || [];
  const option = {
    title: {
      text: "咨询活动统计",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      data: ["会话数量", "参与用户数"],
      top: 40,
      textStyle: {
        color: "#636e72",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: dailyTrend.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      axisLabel: {
        color: "#636e72",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#636e72",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.1)",
        },
      },
    },
    series: [
      {
        name: "会话数量",
        type: "bar",
        data: dailyTrend.map((item) => item.sessionCount),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#74b9ff" },
              { offset: 1, color: "#0984e3" },
            ],
          },
        },
        barWidth: "40%",
      },
      {
        name: "参与用户数",
        type: "bar",
        data: dailyTrend.map((item) => item.userCount),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#fdcb6e" },
              { offset: 1, color: "#f39c12" },
            ],
          },
        },
        barWidth: "40%",
      },
    ],
  };
  consultationChart.setOption(option);
};

//用户活跃度趋势图表
//普通变量 ECharts实例对象，用来操作图表（更新、销毁等）
let userActivityChart = null;
//接受DOM元素（div）
const userActivityChartRef = ref(null);
//初始化用户活跃度趋势图表函数
const initUserActivityChart = () => {
  if (!userActivityChartRef.value) return;
  //销毁现有图表
  if (userActivityChart) {
    userActivityChart.dispose();
  }
  //创建echarts实例
  userActivityChart = new echarts.init(userActivityChartRef.value);
  //获取用户活跃度趋势数据
  const activityData = aiData.value?.userActivity || [];
  const option = {
    title: {
      text: "用户活跃度趋势",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      data: ["活跃用户", "新增用户", "日记用户", "咨询用户"],
      top: 40,
      textStyle: {
        color: "#636e72",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: activityData.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      axisLabel: {
        color: "#636e72",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#636e72",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.1)",
        },
      },
    },
    series: [
      {
        name: "活跃用户",
        type: "line",
        data: activityData.map((item) => item.activeUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#a29bfe",
        },
        itemStyle: {
          color: "#a29bfe",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(162, 155, 254, 0.4)" },
              { offset: 1, color: "rgba(162, 155, 254, 0.1)" },
            ],
          },
        },
      },
      {
        name: "新增用户",
        type: "line",
        data: activityData.map((item) => item.newUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#fdcb6e",
        },
        itemStyle: {
          color: "#fdcb6e",
        },
      },
      {
        name: "日记用户",
        type: "line",
        data: activityData.map((item) => item.diaryUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#00b894",
        },
        itemStyle: {
          color: "#00b894",
        },
      },
      {
        name: "咨询用户",
        type: "line",
        data: activityData.map((item) => item.consultationUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#fab1a0",
        },
        itemStyle: {
          color: "#fab1a0",
        },
      },
    ],
  };
  userActivityChart.setOption(option);
};

//图片引入
const iconUrl1 = new URL("@/assets/images/users.png", import.meta.url).href;
const iconUrl2 = new URL("@/assets/images/like.png", import.meta.url).href;
const iconUrl3 = new URL("@/assets/images/comments.png", import.meta.url).href;
const iconUrl4 = new URL("@/assets/images/smile.png", import.meta.url).href;

//接收后端返回的综合数据
const aiData = ref({});
onMounted(() => {
  getAnalyticsOverview().then((res) => {
    console.log(res, "综合数据分析");
    aiData.value = res;
    //初始化图表
    initChart();
  });
});
</script>

<style scoped lang="scss">
.dashboard-container {
  .card-content {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 12px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }
    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }
      .value {
        font-size: 24px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px;
      }
      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }
  .chart-content {
    padding: 20px;
    height: 300px;
    position: relative;

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .consultation-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
  }
}
</style>
