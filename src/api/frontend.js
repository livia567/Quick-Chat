import service from "@/utils/request";

//注册
export function register(data) {
  return service.post("/user/add", data);
}
