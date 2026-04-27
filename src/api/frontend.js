import service from "@/utils/request";

//注册
export function register(data) {
  return service.post("/user/add", data);
}

//创建新会话
export const startSession = (data) => {
  return service.post("/psychological-chat/session/start", data);
};

//分页查询咨询会话
export const getSessionList = (params) => {
  return service.get("/psychological-chat/sessions", { params });
};

//删除咨询会话
export const deleteSession = (sessionId) => {
  return service.delete(`/psychological-chat/sessions/${sessionId}`);
};

//获取会话消息详情
export const getSessionDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`);
};

//获取会话情绪分析结果
export const getSessionEmotion = (sessionId) => {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`);
};

//创新或更新情绪日志
export const addEmotionDiary = (data) => {
  return service.post("/emotion-diary", data);
};

//查询知识文章列表
export const getKnowledgeList = (params) => {
  return service.get("/knowledge/article/page", { params });
};
