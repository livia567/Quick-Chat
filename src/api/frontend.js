import service from "@/utils/request";

//注册
export function register(data) {
  return service.post("/user/add", data);
}

//创建新会话
export const startSession = (data) => {
  return service.post("/psychological-chat/session/start", data);
};
