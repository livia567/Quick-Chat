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
