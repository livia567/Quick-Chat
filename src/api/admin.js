import service from "@/utils/request";
export function login(data) {
  return service.post("/user/login", data);
}

export function categoryTree() {
  return service.get("/knowledge/category/tree");
}

export function articlePage(params) {
  return service.get("/knowledge/article/page", { params });
}

//接收两个参数 一个文件本身 一个文件相关参数
export function uploadFile(file, businessInfo) {
  //创建一个"表单盒子"，专门用来装文件和其他参数，因为文件不能直接塞进普通JSON字符串里
  const formData = new FormData();
  formData.append("file", file);
  formData.append("businessType", "ARTICLE");
  formData.append("businessId", businessInfo.businessId);
  formData.append("businessField", "cover");

  //post方法是前端给后端传数据的，get方法是后端给前端传数据的
  return service.post("/file/upload", formData, {
    headers: {
      //告诉后端"我发的是含文件的表单，不是普通JSON"
      "Content-type": "multipart/form-data",
    },
  });
}

//新增文章
export function createArticle(data) {
  return service.post("/knowledge/article", data);
}

//获取文章详情
export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`);
}

//更新知识文章
export function updateArticle(id, data) {
  return service.put(`/knowledge/article/${id}`, data);
}

//改变文章状态
export function changeArticleStatus(id, data) {
  return service.put(`/knowledge/article/${id}/status`, data);
}

//删除文章
export function deleteArticle(id) {
  return service.delete(`/knowledge/article/${id}`);
}

//获取咨询记录列表
export function getConsultationPage(params) {
  return service.get("/psychological-chat/sessions", { params });
}

//获取咨询会话详情
export function getSessionDetail(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`);
}

//获取情绪日志列表
export function getEmotionalPage(params) {
  return service.get("/emotion-diary/admin/page", { params });
}

//删除情绪日志
export function deleteEmotional(id) {
  return service.delete(`/emotion-diary/admin/${id}`);
}
