import http from "../http";
import IUserInfo from "../types/User";

const get = () => {
    return http.get<IUserInfo>(`user/info/`);
    };

const UserService = {
    get,
  };
  
  export default UserService;