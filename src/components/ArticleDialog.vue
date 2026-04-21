<template>
  <el-dialog
    title="文章详情"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <!-- 文章标题 -->
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入文章标题"
          maxlength="100"
          show-word-limit
          clearable
        />
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 文章摘要 -->
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          type="textarea"
          v-model="formData.summary"
          placeholder="请输入文章摘要（可选）"
          maxlength="1000"
          show-word-limit
          :rows="3"
          clearable
        />
      </el-form-item>

      <!-- 标签 -->
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="formData.tagArray"
          placeholder="请输入文章标签（可多选）"
          multiple
          filterable
          allow-create
          width="100%"
        >
          <el-option
            v-for="tag in commonTags"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </el-form-item>

      <!-- 上传封面 -->
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <!-- action后跟要传给后端的地址，但是这里上传之后还要校验，所以就先写# -->
          <!-- before-upload是上传前要做的校验,返回为true才会触发下一个方法（请求接口方法）-->
          <!-- handleUploadRequest:上传请求的方法 -->
          <el-upload
            class="avatar-uploader"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            :show-file-list="false"
            accept="image/*"
          >
            <!-- 图片未上传时 显示-->
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传封面</p>
            </div>
            <!-- 图片上传后显示 -->
            <img v-else :src="imgUrl" alt="封面图片" class="cover-image" />
          </el-upload>
          <div v-if="imgUrl" class="cover-remove">
            <el-button type="danger" @click="handleRemove">移除封面</el-button>
          </div>
        </div>
      </el-form-item>

      <!-- 文章内容（富文本格式） -->
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          placeholder="请输入文章内容，支持富文本格式 可以使用加粗、斜体、列表、标题等格式来丰富文本内容"
          :maxCharCount="10000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          min-height="300px"
        />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { uploadFile } from "@/api/admin";
import { fileBaseUrl } from "@/config/index.js";
import RichTextEditor from "./RichTextEditor.vue";

//接收父组件传来的modelValue值，默认false，类型为Boolean
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
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

//表单数据
const formData = reactive({
  title: "",
  content: "",
  coverImage: "",
  categoryId: 1,
  summary: "",
  tags: "",
  id: "",
});

// 表单校验规则
const rules = reactive({
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    { max: 100, message: "文章标题最多100个字符", trigger: "blur" },
  ],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }],
  summary: [{ max: 1000, message: "文章摘要最多1000个字符", trigger: "blur" }],
});

//标签选项
const commonTags = [
  "情绪管理",
  "焦虑",
  "抑郁",
  "压力",
  "睡眠",
  "冥想",
  "正念",
  "放松",
  "心理健康",
  "自我成长",
  "人际关系",
  "工作压力",
  "学习方法",
  "生活技巧",
];

// 上传图片
const imgUrl = ref("");
// 上传前做的校验
const beforeUpload = (file) => {
  console.log(file);
  const isImage = file.type.startsWith("image/");
  // file.size是字节，需要转换成MB
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isImage) {
    ElMessage.error("请上传图片文件");
    return false;
  }
  if (!isLt5M) {
    ElMessage.error("上传的封面图片大小不能超过5MB");
    return false;
  }
  return true;
};

// 上传请求的方法
const handleUploadRequest = async ({ file }) => {
  //UUID生成
  const businessId = crypto.randomUUID();
  const fileRes = await uploadFile(file, {
    businessId: businessId,
  });
  console.log(fileRes);

  //拼接完整的图片地址=后端文件服务器地址+相对路径filePath
  imgUrl.value = fileBaseUrl + fileRes.filePath;
  //提交给后端的数据的是相对路径filePath
  formData.coverImage = fileRes.filePath;
};

//移除封面
const handleRemove = () => {
  imgUrl.value = "";
  formData.coverImage = "";
};

//富文本内容改变时触发
const handleContentChange = (data) => {
  console.log(data, "富文本内容");
  formData.content = data.html;
};
//editorInstance存储富文本实例
const editorInstance = ref(null);

//富文本编辑器初始化完成时会被调用，editor是组件自动传进来的编辑器实例
const handleEditorCreated = (editor) => {
  //把编辑器实例存进editorInstance.value，方便后续在其他地方调用编辑器的方法
  editorInstance.value = editor;
  //formData.content有值（说明是编辑场景，已有旧数据）&& editor存在（编辑器确实创建成功了）
  if (formData.content && editor) {
    //nextTick 等Vue把DOM更新完再执行里面的代码（编辑器实例创建好 ≠ 编辑器DOM渲染好）
    nextTick(() => {
      //调用编辑器的setContent方法，把formData.content（旧数据的 HTML）塞进编辑器
      //这样进入编辑页面时编辑器里就能显示已有内容，而不是空白。
      editor.setContent(formData.content);
      //新增文章 →formData.content是空的 →if 不成立 →编辑器空白，用户自己输入
    });
  }
};
</script>

<style scoped lang="scss">
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background-color: #f6f8fa;
}
.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>
